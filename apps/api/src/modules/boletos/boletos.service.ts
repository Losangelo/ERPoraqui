import { prisma } from '@/database/prisma.service';
import appLogger from '@/shared/logger/logger';
import { 
  criarBoletoSchema, 
  atualizarBoletoSchema, 
  baixarBoletoSchema, 
  boletoFiltroSchema, 
  criarBancoSchema, 
  gerarRemessaSchema,
  gerarRemessaLoteSchema,
  processarRetornoSchema,
  CriarBoletoInput, 
  AtualizarBoletoInput, 
  BaixarBoletoInput, 
  BoletoFiltro, 
  CriarBancoInput,
  GerarRemessaInput,
  GerarRemessaLoteInput,
  ProcessarRetornoInput,
} from './dto/boleto.dto';
import { generateBarCode, generateLinhaDigitavel } from './boleto.utils';
import { gerarCnab400Remessa, gerarCnab240Remessa, parseCnab400Retorno, parseCnab240Retorno } from './cnab.utils';

export class BoletosService {
  async criar(empresaId: string, data: CriarBoletoInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const parsed = criarBoletoSchema.parse(data);

    const contaReceber = await prisma.contaReceber.findFirst({
      where: { id: parsed.contaReceberId, empresaId },
    });

    if (!contaReceber) {
      throw new Error('Conta a receber não encontrada');
    }

    if (contaReceber.formaPagamento !== 'BOLETO') {
      throw new Error('Conta não é do tipo boleto');
    }

    const banco = parsed.bancoId 
      ? await prisma.banco.findUnique({ where: { id: parsed.bancoId } })
      : null;

    const valorTotal = parsed.valorOriginal + parsed.valorJuros + parsed.valorMulta - parsed.valorDesconto;

    const codigoBarras = banco ? generateBarCode(banco.codigo, parsed.numeroBoleto, valorTotal, parsed.dataVencimento) : null;
    const linhaDigitavel = codigoBarras ? generateLinhaDigitavel(codigoBarras) : null;

    const boleto = await prisma.boleto.create({
      data: {
        empresaId,
        contaReceberId: parsed.contaReceberId,
        bancoId: parsed.bancoId,
        numeroBoleto: parsed.numeroBoleto,
        numeroDocumento: contaReceber.numeroDocumento,
        dataVencimento: parsed.dataVencimento,
        valorOriginal: parsed.valorOriginal,
        valorJuros: parsed.valorJuros,
        valorMulta: parsed.valorMulta,
        valorDesconto: parsed.valorDesconto,
        valorPago: 0,
        situacao: 'EMITIDO',
        instrucoes: parsed.instrucoes,
        mensagem: parsed.mensagem,
        codigoBarras,
        linhaDigitavel,
      },
      include: {
        contaReceber: {
          include: {
            cliente: true,
          },
        },
        empresa: true,
      },
    });

    appLogger.business('criar_boleto', { empresaId, boletoId: boleto.id });
    return boleto;
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const boleto = await prisma.boleto.findFirst({
      where: { id, empresaId },
      include: {
        contaReceber: {
          include: {
            cliente: true,
          },
        },
        empresa: true,
      },
    });

    if (!boleto) throw new Error('Boleto não encontrado');
    return boleto;
  }

  async listar(empresaId: string, filtros: BoletoFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const parsed = boletoFiltroSchema.parse(filtros);

    const where: any = { empresaId };

    if (parsed.contaReceberId) where.contaReceberId = parsed.contaReceberId;
    if (parsed.situacao) where.situacao = parsed.situacao;

    if (parsed.dataInicial || parsed.dataFinal) {
      where.dataVencimento = {};
      if (parsed.dataInicial) where.dataVencimento.gte = parsed.dataInicial;
      if (parsed.dataFinal) where.dataVencimento.lte = parsed.dataFinal;
    }

    const skip = (parsed.pagina - 1) * parsed.limite;

    const [boletos, total] = await Promise.all([
      prisma.boleto.findMany({
        where,
        skip,
        take: parsed.limite,
        orderBy: { dataVencimento: 'asc' },
        include: {
          contaReceber: {
            include: {
              cliente: true,
            },
          },
        },
      }),
      prisma.boleto.count({ where }),
    ]);

    return {
      data: boletos,
      meta: {
        total,
        pagina: parsed.pagina,
        limite: parsed.limite,
        totalPaginas: Math.ceil(total / parsed.limite),
      },
    };
  }

  async atualizar(id: string, empresaId: string, data: AtualizarBoletoInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const boleto = await prisma.boleto.findFirst({
      where: { id, empresaId },
    });

    if (!boleto) throw new Error('Boleto não encontrado');

    if (boleto.situacao === 'BAIXADO' || boleto.situacao === 'BAIXADO_MANUALMENTE') {
      throw new Error('Boleto já baixado não pode ser alterado');
    }

    if (boleto.situacao === 'CANCELADO') {
      throw new Error('Boleto cancelado não pode ser alterado');
    }

    const parsed = atualizarBoletoSchema.parse(data);

    const resultado = await prisma.boleto.update({
      where: { id },
      data: parsed,
      include: {
        contaReceber: {
          include: {
            cliente: true,
          },
        },
      },
    });

    appLogger.business('atualizar_boleto', { empresaId, boletoId: id });
    return resultado;
  }

  async baixar(id: string, empresaId: string, data: BaixarBoletoInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const boleto = await prisma.boleto.findFirst({
      where: { id, empresaId },
      include: {
        contaReceber: true,
      },
    });

    if (!boleto) throw new Error('Boleto não encontrado');

    if (boleto.situacao === 'BAIXADO' || boleto.situacao === 'BAIXADO_MANUALMENTE') {
      throw new Error('Boleto já baixado');
    }

    if (boleto.situacao === 'CANCELADO') {
      throw new Error('Boleto cancelado não pode ser baixado');
    }

    const parsed = baixarBoletoSchema.parse(data);

    const valorTotal = parsed.valorPago + parsed.valorJuros + parsed.valorMulta - parsed.valorDesconto;

    const [boletoAtualizado] = await Promise.all([
      prisma.boleto.update({
        where: { id },
        data: {
          situacao: 'BAIXADO',
          dataPagamento: parsed.dataPagamento,
          valorPago: valorTotal,
          valorJuros: parsed.valorJuros,
          valorMulta: parsed.valorMulta,
          valorDesconto: parsed.valorDesconto,
        },
      }),
      prisma.contaReceber.update({
        where: { id: boleto.contaReceberId },
        data: {
          situacao: 'BAIXADO',
          dataRecebimento: parsed.dataPagamento,
          valorRecebido: valorTotal,
          valorJuros: parsed.valorJuros,
          valorMulta: parsed.valorMulta,
          valorDesconto: parsed.valorDesconto,
        },
      }),
    ]);

    appLogger.business('baixar_boleto', { empresaId, boletoId: id });
    return boletoAtualizado;
  }

  async cancelar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const boleto = await prisma.boleto.findFirst({
      where: { id, empresaId },
    });

    if (!boleto) throw new Error('Boleto não encontrado');

    if (boleto.situacao === 'BAIXADO' || boleto.situacao === 'BAIXADO_MANUALMENTE') {
      throw new Error('Boleto baixado não pode ser cancelado');
    }

    const resultado = await prisma.boleto.update({
      where: { id },
      data: { situacao: 'CANCELADO' },
    });

    appLogger.business('cancelar_boleto', { empresaId, boletoId: id });
    return resultado;
  }

  async gerarSegundaVia(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const boleto = await prisma.boleto.findFirst({
      where: { id, empresaId },
      include: {
        contaReceber: {
          include: {
            cliente: true,
          },
        },
        empresa: true,
      },
    });

    if (!boleto) throw new Error('Boleto não encontrado');

    if (boleto.situacao === 'BAIXADO' || boleto.situacao === 'BAIXADO_MANUALMENTE') {
      throw new Error('Boleto já baixado não pode gerar segunda via');
    }

    const novoNumeroBoleto = `${boleto.numeroBoleto}-2`;

    const banco = boleto.bancoId 
      ? await prisma.banco.findUnique({ where: { id: boleto.bancoId } })
      : null;

    const valorAtualizado = boleto.valorOriginal + boleto.valorJuros + boleto.valorMulta - boleto.valorDesconto;
    const novaDataVencimento = new Date();
    novaDataVencimento.setDate(novaDataVencimento.getDate() + 7);

    const codigoBarras = banco ? generateBarCode(banco.codigo, novoNumeroBoleto, valorAtualizado, novaDataVencimento) : null;
    const linhaDigitavel = codigoBarras ? generateLinhaDigitavel(codigoBarras) : null;

    const novoBoleto = await prisma.boleto.create({
      data: {
        empresaId,
        contaReceberId: boleto.contaReceberId,
        bancoId: boleto.bancoId,
        numeroBoleto: novoNumeroBoleto,
        numeroDocumento: boleto.numeroDocumento,
        dataVencimento: novaDataVencimento,
        valorOriginal: boleto.valorOriginal,
        valorJuros: boleto.valorJuros,
        valorMulta: boleto.valorMulta,
        valorDesconto: boleto.valorDesconto,
        valorPago: 0,
        situacao: 'EMITIDO',
        instrucoes: boleto.instrucoes,
        mensagem: boleto.mensagem,
        codigoBarras,
        linhaDigitavel,
      },
      include: {
        contaReceber: {
          include: {
            cliente: true,
          },
        },
      },
    });

    appLogger.business('gerar_segunda_via_boleto', { empresaId, boletoId: id, novoBoletoId: novoBoleto.id });
    return novoBoleto;
  }

  async expirarBoletosVencidos(empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const boletosVencidos = await prisma.boleto.findMany({
      where: {
        empresaId,
        situacao: { in: ['EMITIDO', 'ENVIADO'] },
        dataVencimento: { lt: hoje },
      },
    });

    if (boletosVencidos.length === 0) {
      return { message: 'Nenhum boleto vencido encontrado', atualizados: 0 };
    }

    const ids = boletosVencidos.map((b) => b.id);

    await prisma.boleto.updateMany({
      where: { id: { in: ids } },
      data: { situacao: 'VENCIDO' },
    });

    appLogger.business('expirar_boletos', { empresaId, quantidade: ids.length });
    return { message: 'Boletos vencidos atualizados', atualizados: ids.length };
  }

  async criarBanco(data: CriarBancoInput) {
    const parsed = criarBancoSchema.parse(data);

    const bancoExistente = await prisma.banco.findUnique({
      where: { codigo: parsed.codigo },
    });

    if (bancoExistente) {
      throw new Error('Banco com este código já existe');
    }

    return prisma.banco.create({ data: parsed });
  }

  async listarBancos() {
    return prisma.banco.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    });
  }

  async gerarRemessa(boletoId: string, empresaId: string, data: GerarRemessaInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const parsed = gerarRemessaSchema.parse(data);

    const boleto = await prisma.boleto.findFirst({
      where: { id: boletoId, empresaId },
      include: {
        contaReceber: { include: { cliente: true } },
        empresa: true,
      },
    });

    if (!boleto) throw new Error('Boleto não encontrado');

    const banco = boleto.bancoId
      ? await prisma.banco.findUnique({ where: { id: boleto.bancoId } })
      : null;

    const bancoCodigo = banco?.codigo ?? '001';
    const endereco = boleto.contaReceber.cliente.endereco as Record<string, string> | null ?? {};

    const cnabData = {
      numeroBoleto: boleto.numeroBoleto,
      numeroDocumento: boleto.numeroDocumento,
      dataVencimento: boleto.dataVencimento,
      valorOriginal: boleto.valorOriginal,
      valorJuros: boleto.valorJuros,
      valorMulta: boleto.valorMulta,
      valorDesconto: boleto.valorDesconto,
      clienteNome: boleto.contaReceber.cliente.nome,
      clienteDocumento: boleto.contaReceber.cliente.documento,
      clienteEndereco: endereco['logradouro'] ?? '',
      clienteBairro: endereco['bairro'] ?? '',
      clienteCep: endereco['cep'] ?? '',
      clienteCidade: endereco['cidade'] ?? '',
      clienteUf: endereco['uf'] ?? '',
      empresaRazaoSocial: boleto.empresa.razaoSocial,
      empresaCnpj: boleto.empresa.cnpj,
      bancoCodigo,
      linhaDigitavel: boleto.linhaDigitavel ?? undefined,
      instrucoes: boleto.instrucoes ?? undefined,
      mensagem: boleto.mensagem ?? undefined,
    };

    const conteudo = parsed.tipoArquivo === 'CNAB240'
      ? gerarCnab240Remessa([cnabData])
      : gerarCnab400Remessa([cnabData]);

    const remessa = await prisma.remessaBoleto.create({
      data: {
        empresaId,
        nomeArquivo: `REM_${boleto.numeroBoleto}_${parsed.tipoArquivo}.txt`,
        tipoArquivo: parsed.tipoArquivo,
        totalBoletos: 1,
        valorTotal: boleto.valorOriginal,
        conteudo,
      },
    });

    await prisma.boleto.update({
      where: { id: boletoId },
      data: { situacao: 'ENVIADO' },
    });

    appLogger.business('gerar_remessa', { empresaId, boletoId, remessaId: remessa.id });
    return remessa;
  }

  async gerarRemessaLote(empresaId: string, data: GerarRemessaLoteInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const parsed = gerarRemessaLoteSchema.parse(data);

    const boletos = await prisma.boleto.findMany({
      where: { id: { in: parsed.boletoIds }, empresaId },
      include: {
        contaReceber: { include: { cliente: true } },
        empresa: true,
      },
    });

    if (boletos.length === 0) throw new Error('Nenhum boleto encontrado');

    const banco = boletos[0].bancoId
      ? await prisma.banco.findUnique({ where: { id: boletos[0].bancoId } })
      : null;
    const bancoCodigo = banco?.codigo ?? '001';

    const cnabDataList = boletos.map((boleto) => {
      const endereco = boleto.contaReceber.cliente.endereco as Record<string, string> | null ?? {};
      return {
        numeroBoleto: boleto.numeroBoleto,
        numeroDocumento: boleto.numeroDocumento,
        dataVencimento: boleto.dataVencimento,
        valorOriginal: boleto.valorOriginal,
        valorJuros: boleto.valorJuros,
        valorMulta: boleto.valorMulta,
        valorDesconto: boleto.valorDesconto,
        clienteNome: boleto.contaReceber.cliente.nome,
        clienteDocumento: boleto.contaReceber.cliente.documento,
        clienteEndereco: endereco['logradouro'] ?? '',
        clienteBairro: endereco['bairro'] ?? '',
        clienteCep: endereco['cep'] ?? '',
        clienteCidade: endereco['cidade'] ?? '',
        clienteUf: endereco['uf'] ?? '',
        empresaRazaoSocial: boleto.empresa.razaoSocial,
        empresaCnpj: boleto.empresa.cnpj,
        bancoCodigo,
        linhaDigitavel: boleto.linhaDigitavel ?? undefined,
        instrucoes: boleto.instrucoes ?? undefined,
        mensagem: boleto.mensagem ?? undefined,
      };
    });

    const conteudo = parsed.tipoArquivo === 'CNAB240'
      ? gerarCnab240Remessa(cnabDataList)
      : gerarCnab400Remessa(cnabDataList);

    const valorTotal = boletos.reduce((s, b) => s + b.valorOriginal, 0);
    const numeroLote = `LOTE_${Date.now()}`;

    const remessa = await prisma.remessaBoleto.create({
      data: {
        empresaId,
        nomeArquivo: `REM_${numeroLote}_${parsed.tipoArquivo}.txt`,
        tipoArquivo: parsed.tipoArquivo,
        totalBoletos: boletos.length,
        valorTotal,
        conteudo,
      },
    });

    await prisma.boleto.updateMany({
      where: { id: { in: parsed.boletoIds } },
      data: { situacao: 'ENVIADO' },
    });

    appLogger.business('gerar_remessa_lote', { empresaId, quantidade: boletos.length, remessaId: remessa.id });
    return remessa;
  }

  async processarRetorno(empresaId: string, data: ProcessarRetornoInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const parsed = processarRetornoSchema.parse(data);

    const resultado = parsed.tipoArquivo === 'CNAB240'
      ? parseCnab240Retorno(parsed.conteudo)
      : parseCnab400Retorno(parsed.conteudo);

    const atualizados: string[] = [];
    const erros: string[] = [];

    for (const item of resultado.itens) {
      if (!item.numeroDocumento) continue;

      const boleto = await prisma.boleto.findFirst({
        where: {
          empresaId,
          numeroDocumento: item.numeroDocumento,
        },
        include: { contaReceber: true },
      });

      if (!boleto) {
        erros.push(`Boleto ${item.numeroDocumento} não encontrado`);
        continue;
      }

      if (item.situacao === 'BAIXADO' && item.valorPago > 0) {
        const valorPago = item.valorPago || boleto.valorOriginal;

        await prisma.boleto.update({
          where: { id: boleto.id },
          data: {
            situacao: 'BAIXADO',
            dataPagamento: item.dataPagamento ?? undefined,
            valorPago,
          },
        });

        if (boleto.contaReceber) {
          await prisma.contaReceber.update({
            where: { id: boleto.contaReceberId },
            data: {
              situacao: 'BAIXADO',
              dataRecebimento: item.dataPagamento ?? undefined,
              valorRecebido: valorPago,
            },
          });
        }

        atualizados.push(boleto.numeroDocumento);
      } else if (item.situacao === 'CANCELADO') {
        await prisma.boleto.update({
          where: { id: boleto.id },
          data: { situacao: 'CANCELADO' },
        });

        atualizados.push(boleto.numeroDocumento);
      }
    }

    appLogger.business('processar_retorno', {
      empresaId,
      total: resultado.totalBoletos,
      atualizados: atualizados.length,
      erros: erros.length,
    });

    return {
      ...resultado,
      atualizados,
      errosProcessamento: erros,
    };
  }

  async listarRemessaHistorico(empresaId: string, pagina = 1, limite = 20) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const skip = (pagina - 1) * limite;

    const [remessas, total] = await Promise.all([
      prisma.remessaBoleto.findMany({
        where: { empresaId },
        skip,
        take: limite,
        orderBy: { dataGeracao: 'desc' },
      }),
      prisma.remessaBoleto.count({ where: { empresaId } }),
    ]);

    return {
      data: remessas,
      meta: {
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }

  async downloadRemessa(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const remessa = await prisma.remessaBoleto.findFirst({
      where: { id, empresaId },
    });

    if (!remessa) throw new Error('Remessa não encontrada');

    return remessa;
  }
}
