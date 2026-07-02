import { prisma } from '@/database/prisma.service';
import appLogger from '@/shared/logger/logger';
import { 
  criarOrcamentoSchema, 
  atualizarOrcamentoSchema, 
  orcamentoFiltroSchema,
  CriarOrcamentoInput, 
  AtualizarOrcamentoInput, 
  OrcamentoFiltro 
} from './dto/orcamento.dto';

export class OrcamentosService {
  private async gerarNumeroOrcamento(empresaId: string): Promise<string> {
    const ultimo = await prisma.orcamento.findFirst({
      where: { empresaId },
      orderBy: { numeroOrcamento: 'desc' },
    });
    if (ultimo) {
      const seq = parseInt(ultimo.numeroOrcamento.replace(/\D/g, ''), 10) + 1;
      return `ORC${String(seq).padStart(6, '0')}`;
    }
    return 'ORC000001';
  }

  async criar(empresaId: string, data: CriarOrcamentoInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const parsed = criarOrcamentoSchema.parse(data);

    const empresa = await prisma.empresa.findUnique({ where: { id: empresaId } });
    if (!empresa) throw new Error('Empresa não encontrada');

    let filialId = parsed.filialId;
    if (!filialId) {
      const primeiraFilial = await prisma.filial.findFirst({ where: { empresaId } });
      if (!primeiraFilial) throw new Error('Nenhuma filial encontrada para a empresa');
      filialId = primeiraFilial.id;
    }

    const filial = await prisma.filial.findFirst({ where: { id: filialId, empresaId } });
    if (!filial) throw new Error('Filial não encontrada');

    const cliente = await prisma.cliente.findFirst({ where: { id: parsed.clienteId, empresaId } });
    if (!cliente) throw new Error('Cliente não encontrado');

    const numeroOrcamento = parsed.numeroOrcamento || await this.gerarNumeroOrcamento(empresaId);
    const dataValidade = parsed.dataValidade ? new Date(parsed.dataValidade) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const dataEmissao = parsed.dataEmissao ? new Date(parsed.dataEmissao) : new Date();
    const itens = parsed.itens || [];

    const valorItens = itens.reduce((acc, item) => {
      const total = (item.quantidade * item.valorUnitario) - item.valorDesconto;
      return acc + total;
    }, 0);

    const valorTotal = valorItens + parsed.valorFrete + parsed.valorOutrosAcrescimos - parsed.valorDesconto;

    const orcamento = await prisma.orcamento.create({
      data: {
        empresaId,
        filialId,
        clienteId: parsed.clienteId,
        numeroOrcamento,
        serie: parsed.serie,
        dataValidade,
        dataEmissao,
        valorTotal,
        valorDesconto: parsed.valorDesconto,
        valorFrete: parsed.valorFrete,
        valorOutrosAcrescimos: parsed.valorOutrosAcrescimos,
        observacoes: parsed.observacoes,
        observacoesInternas: parsed.observacoesInternas,
        situacao: 'ABERTO',
        itens: itens.length > 0 ? {
          create: itens.map((item, index) => ({
            produtoId: item.produtoId,
            numeroItem: index + 1,
            quantidade: item.quantidade,
            unidadeMedida: item.unidadeMedida,
            valorUnitario: item.valorUnitario,
            valorTotal: (item.quantidade * item.valorUnitario) - item.valorDesconto,
            valorDesconto: item.valorDesconto,
          })),
        } : undefined,
      },
      include: {
        filial: true,
        cliente: true,
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });

    appLogger.business('criar_orcamento', { empresaId, orcamentoId: orcamento.id });
    return orcamento;
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const orcamento = await prisma.orcamento.findFirst({
      where: { id, empresaId },
      include: {
        filial: true,
        cliente: true,
        itens: {
          include: {
            produto: true,
          },
        },
        pedidoVenda: true,
      },
    });

    if (!orcamento) throw new Error('Orçamento não encontrado');
    return orcamento;
  }

  async listar(empresaId: string, filtros: OrcamentoFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const parsed = orcamentoFiltroSchema.parse(filtros);

    const where: any = { empresaId };

    if (parsed.clienteId) where.clienteId = parsed.clienteId;
    if (parsed.filialId) where.filialId = parsed.filialId;
    if (parsed.situacao) where.situacao = parsed.situacao;

    if (parsed.dataInicial || parsed.dataFinal) {
      where.dataCriacao = {};
      if (parsed.dataInicial) where.dataCriacao.gte = parsed.dataInicial;
      if (parsed.dataFinal) where.dataCriacao.lte = parsed.dataFinal;
    }

    const skip = (parsed.pagina - 1) * parsed.limite;

    const [orcamentos, total] = await Promise.all([
      prisma.orcamento.findMany({
        where,
        skip,
        take: parsed.limite,
        orderBy: { dataCriacao: 'desc' },
        include: {
          filial: true,
          cliente: true,
          itens: true,
        },
      }),
      prisma.orcamento.count({ where }),
    ]);

    return {
      data: orcamentos,
      meta: {
        total,
        pagina: parsed.pagina,
        limite: parsed.limite,
        totalPaginas: Math.ceil(total / parsed.limite),
      },
    };
  }

  async atualizar(id: string, empresaId: string, data: AtualizarOrcamentoInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const orcamentoExistente = await prisma.orcamento.findFirst({
      where: { id, empresaId },
    });

    if (!orcamentoExistente) throw new Error('Orçamento não encontrado');

    if (orcamentoExistente.situacao === 'CONVERTIDO') {
      throw new Error('Orçamento já convertido em pedido');
    }

    if (orcamentoExistente.situacao === 'CANCELADO') {
      throw new Error('Orçamento cancelado não pode ser alterado');
    }

    const parsed = atualizarOrcamentoSchema.parse(data);

    const orcamento = await prisma.orcamento.update({
      where: { id },
      data: parsed,
      include: {
        filial: true,
        cliente: true,
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });

    appLogger.business('atualizar_orcamento', { empresaId, orcamentoId: id });
    return orcamento;
  }

  async converterEmPedido(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const orcamento = await prisma.orcamento.findFirst({
      where: { id, empresaId },
      include: {
        itens: true,
        cliente: true,
        filial: true,
      },
    });

    if (!orcamento) throw new Error('Orçamento não encontrado');

    if (orcamento.situacao !== 'ABERTO' && orcamento.situacao !== 'APROVADO') {
      throw new Error('Orçamento deve estar ABERTO ou APROVADO para ser convertido');
    }

    const ultimoPedido = await prisma.pedidoVenda.findFirst({
      where: { empresaId },
      orderBy: { numeroPedido: 'desc' },
    });

    const novoNumero = ultimoPedido 
      ? String(parseInt(ultimoPedido.numeroPedido) + 1).padStart(6, '0')
      : '000001';

    const pedido = await prisma.pedidoVenda.create({
      data: {
        empresaId,
        filialId: orcamento.filialId,
        clienteId: orcamento.clienteId,
        numeroPedido: novoNumero,
        serie: orcamento.serie,
        tipoOperacao: 'VENDA',
        situacao: 'EM_ABERTO',
        dataEmissao: new Date(),
        valorTotal: orcamento.valorTotal,
        valorDesconto: orcamento.valorDesconto,
        valorFrete: orcamento.valorFrete,
        valorOutrosAcrescimos: orcamento.valorOutrosAcrescimos,
        observacoes: orcamento.observacoes,
        observacoesInternas: orcamento.observacoesInternas,
        itens: {
          create: orcamento.itens.map((item) => ({
            produtoId: item.produtoId,
            numeroItem: item.numeroItem,
            quantidade: item.quantidade,
            unidadeMedida: item.unidadeMedida,
            valorUnitario: item.valorUnitario,
            valorTotal: item.valorTotal,
            valorDesconto: item.valorDesconto,
          })),
        },
      },
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });

    await prisma.orcamento.update({
      where: { id },
      data: {
        situacao: 'CONVERTIDO',
        pedidoVendaId: pedido.id,
      },
    });

    appLogger.business('converter_orcamento_pedido', { empresaId, orcamentoId: id, pedidoId: pedido.id });
    return { orcamento, pedido };
  }

  async excluir(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const orcamento = await prisma.orcamento.findFirst({
      where: { id, empresaId },
    });

    if (!orcamento) throw new Error('Orçamento não encontrado');

    if (orcamento.situacao === 'CONVERTIDO') {
      throw new Error('Orçamento convertido não pode ser excluído');
    }

    await prisma.itemOrcamento.deleteMany({ where: { orcamentoId: id } });
    await prisma.orcamento.delete({ where: { id } });

    appLogger.business('excluir_orcamento', { empresaId, orcamentoId: id });
    return { message: 'Orçamento excluído com sucesso' };
  }

  async aprovar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const orcamento = await prisma.orcamento.findFirst({
      where: { id, empresaId },
    });

    if (!orcamento) throw new Error('Orçamento não encontrado');

    if (orcamento.situacao !== 'ABERTO') {
      throw new Error('Apenas orçamentos ABERTOS podem ser aprovados');
    }

    const resultado = await prisma.orcamento.update({
      where: { id },
      data: { situacao: 'APROVADO' },
    });

    appLogger.business('aprovar_orcamento', { empresaId, orcamentoId: id });
    return resultado;
  }

  async reprovar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const orcamento = await prisma.orcamento.findFirst({
      where: { id, empresaId },
    });

    if (!orcamento) throw new Error('Orçamento não encontrado');

    if (orcamento.situacao !== 'ABERTO') {
      throw new Error('Apenas orçamentos ABERTOS podem ser reprovados');
    }

    const resultado = await prisma.orcamento.update({
      where: { id },
      data: { situacao: 'REPROVADO' },
    });

    appLogger.business('reprovar_orcamento', { empresaId, orcamentoId: id });
    return resultado;
  }

  async expirarOrcamentosVencidos(empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const orcamentosVencidos = await prisma.orcamento.findMany({
      where: {
        empresaId,
        situacao: 'ABERTO',
        dataValidade: { lt: new Date() },
      },
    });

    if (orcamentosVencidos.length === 0) {
      return { message: 'Nenhum orçamento vencido encontrado', atualizados: 0 };
    }

    const ids = orcamentosVencidos.map((o) => o.id);

    await prisma.orcamento.updateMany({
      where: { id: { in: ids } },
      data: { situacao: 'EXPIRADO' },
    });

    appLogger.business('expirar_orcamentos', { empresaId, quantidade: ids.length });
    return { message: 'Orçamentos vencidos expirados', atualizados: ids.length };
  }
}
