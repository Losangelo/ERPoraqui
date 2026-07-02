import { prisma } from '@/database/prisma.service';
import { CriarRenegociacaoInput, RenegociacaoFiltro, criarRenegociacaoSchema, renegociacaoFiltroSchema } from './dto/renegociacao.dto';

export class RenegociacaoService {
  async listar(empresaId: string, filtros: RenegociacaoFiltro) {
    const parsed = renegociacaoFiltroSchema.parse(filtros);

    const where: Record<string, unknown> = { empresaId };

    if (parsed.tipo) where.tipo = parsed.tipo;
    if (parsed.situacao) where.situacao = parsed.situacao;
    if (parsed.clienteId) where.clienteId = parsed.clienteId;
    if (parsed.fornecedorId) where.fornecedorId = parsed.fornecedorId;
    if (parsed.dataInicial || parsed.dataFinal) {
      where.dataCriacao = {};
      if (parsed.dataInicial) (where.dataCriacao as Record<string, unknown>).gte = new Date(parsed.dataInicial);
      if (parsed.dataFinal) (where.dataCriacao as Record<string, unknown>).lte = new Date(parsed.dataFinal);
    }

    const skip = (parsed.pagina - 1) * parsed.limite;

    const [data, total] = await Promise.all([
      prisma.renegociacao.findMany({
        where,
        skip,
        take: parsed.limite,
        orderBy: { dataCriacao: 'desc' },
        include: {
          cliente: { select: { id: true, nome: true, documento: true } },
          fornecedor: { select: { id: true, nome: true, documento: true } },
          contas: true,
          parcelas: { orderBy: { numeroParcela: 'asc' } },
        },
      }),
      prisma.renegociacao.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        pagina: parsed.pagina,
        limite: parsed.limite,
        totalPaginas: Math.ceil(total / parsed.limite),
      },
    };
  }

  async buscarPorId(id: string, empresaId: string) {
    const renegociacao = await prisma.renegociacao.findFirst({
      where: { id, empresaId },
      include: {
        cliente: { select: { id: true, nome: true, documento: true } },
        fornecedor: { select: { id: true, nome: true, documento: true } },
        contas: true,
        parcelas: { orderBy: { numeroParcela: 'asc' } },
      },
    });

    if (!renegociacao) {
      throw new Error('Renegociação não encontrada');
    }

    return renegociacao;
  }

  async criar(empresaId: string, data: CriarRenegociacaoInput) {
    const parsed = criarRenegociacaoSchema.parse(data);

    if (!parsed.clienteId && !parsed.fornecedorId) {
      throw new Error('Informe cliente ou fornecedor');
    }

    const contas = parsed.tipo === 'RECEBER'
      ? await prisma.contaReceber.findMany({
          where: { id: { in: parsed.contasIds }, empresaId, situacao: { in: ['ABERTA', 'VENCIDO'] } },
        })
      : await prisma.contaPagar.findMany({
          where: { id: { in: parsed.contasIds }, empresaId, situacao: { in: ['ABERTA', 'VENCIDO'] } },
        });

    if (contas.length !== parsed.contasIds.length) {
      throw new Error('Algumas contas não foram encontradas ou não estão disponíveis para renegociação');
    }

    const valorTotal = contas.reduce((sum, c) => sum + c.valorOriginal, 0);
    const valorFinal = valorTotal - parsed.valorDesconto + parsed.valorJuros + parsed.valorMulta;
    const valorParcela = valorFinal / parsed.numeroParcelas;
    const primeiraVencimento = new Date(parsed.primeiraVencimento);

    return prisma.$transaction(async (tx) => {
      const renegociacao = await tx.renegociacao.create({
        data: {
          empresaId,
          clienteId: parsed.tipo === 'RECEBER' ? parsed.clienteId : null,
          fornecedorId: parsed.tipo === 'PAGAR' ? parsed.fornecedorId : null,
          tipo: parsed.tipo,
          valorTotal,
          valorDesconto: parsed.valorDesconto,
          valorJuros: parsed.valorJuros,
          valorMulta: parsed.valorMulta,
          valorFinal,
          numeroParcelas: parsed.numeroParcelas,
          primeiraVencimento,
          situacao: 'PENDENTE',
          observacoes: parsed.observacoes,
          contas: {
            create: contas.map((c) => ({
              contaId: c.id,
              tipoConta: parsed.tipo,
            })),
          },
          parcelas: {
            create: Array.from({ length: parsed.numeroParcelas }, (_, i) => {
              const vencimento = new Date(primeiraVencimento);
              vencimento.setMonth(vencimento.getMonth() + i);
              return {
                numeroParcela: i + 1,
                dataVencimento: vencimento,
                valor: i === parsed.numeroParcelas - 1
                  ? parseFloat((valorFinal - valorParcela * (parsed.numeroParcelas - 1)).toFixed(2))
                  : parseFloat(valorParcela.toFixed(2)),
              };
            }),
          },
        },
        include: {
          cliente: { select: { id: true, nome: true, documento: true } },
          fornecedor: { select: { id: true, nome: true, documento: true } },
          contas: true,
          parcelas: { orderBy: { numeroParcela: 'asc' } },
        },
      });

      const updateData = { situacao: 'RENEGOCIADO' as const };
      if (parsed.tipo === 'RECEBER') {
        await tx.contaReceber.updateMany({
          where: { id: { in: parsed.contasIds } },
          data: updateData,
        });
      } else {
        await tx.contaPagar.updateMany({
          where: { id: { in: parsed.contasIds } },
          data: updateData,
        });
      }

      return renegociacao;
    });
  }

  async confirmar(id: string, empresaId: string) {
    const renegociacao = await prisma.renegociacao.findFirst({
      where: { id, empresaId },
      include: { parcelas: true, contas: true },
    });

    if (!renegociacao) {
      throw new Error('Renegociação não encontrada');
    }

    if (renegociacao.situacao !== 'PENDENTE') {
      throw new Error('Renegociação já foi confirmada ou cancelada');
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.renegociacao.update({
        where: { id },
        data: { situacao: 'CONFIRMADA' },
        include: {
          cliente: { select: { id: true, nome: true, documento: true } },
          fornecedor: { select: { id: true, nome: true, documento: true } },
          contas: true,
          parcelas: { orderBy: { numeroParcela: 'asc' } },
        },
      });

      if (renegociacao.tipo === 'RECEBER' && renegociacao.clienteId) {
        for (const parcela of renegociacao.parcelas) {
          await tx.contaReceber.create({
            data: {
              empresaId,
              clienteId: renegociacao.clienteId,
              numeroDocumento: `REN-${id.slice(0, 8)}-${parcela.numeroParcela}`,
              numeroParcela: parcela.numeroParcela,
              totalParcelas: renegociacao.numeroParcelas,
              dataVencimento: parcela.dataVencimento,
              dataEmissao: new Date(),
              valorOriginal: parcela.valor,
              situacao: 'ABERTA',
              observacoes: `Renegociação ${id.slice(0, 8)} - Parcela ${parcela.numeroParcela}/${renegociacao.numeroParcelas}`,
            },
          });
        }
      }

      if (renegociacao.tipo === 'PAGAR' && renegociacao.fornecedorId) {
        for (const parcela of renegociacao.parcelas) {
          await tx.contaPagar.create({
            data: {
              empresaId,
              fornecedorId: renegociacao.fornecedorId,
              numeroDocumento: `REN-${id.slice(0, 8)}-${parcela.numeroParcela}`,
              numeroParcela: parcela.numeroParcela,
              totalParcelas: renegociacao.numeroParcelas,
              dataVencimento: parcela.dataVencimento,
              dataEmissao: new Date(),
              valorOriginal: parcela.valor,
              situacao: 'ABERTA',
              observacoes: `Renegociação ${id.slice(0, 8)} - Parcela ${parcela.numeroParcela}/${renegociacao.numeroParcelas}`,
            },
          });
        }
      }

      return updated;
    });
  }

  async cancelar(id: string, empresaId: string) {
    const renegociacao = await prisma.renegociacao.findFirst({
      where: { id, empresaId },
      include: { contas: true },
    });

    if (!renegociacao) {
      throw new Error('Renegociação não encontrada');
    }

    if (renegociacao.situacao !== 'PENDENTE') {
      throw new Error('Renegociação já foi confirmada ou cancelada');
    }

    return prisma.$transaction(async (tx) => {
      const contasReceberIds: string[] = [];
      const contasPagarIds: string[] = [];

      for (const c of renegociacao.contas) {
        if (c.tipoConta === 'RECEBER') contasReceberIds.push(c.contaId);
        else contasPagarIds.push(c.contaId);
      }

      if (contasReceberIds.length > 0) {
        await tx.contaReceber.updateMany({
          where: { id: { in: contasReceberIds } },
          data: { situacao: 'ABERTA' },
        });
      }

      if (contasPagarIds.length > 0) {
        await tx.contaPagar.updateMany({
          where: { id: { in: contasPagarIds } },
          data: { situacao: 'ABERTA' },
        });
      }

      return tx.renegociacao.update({
        where: { id },
        data: { situacao: 'CANCELADA' },
        include: {
          cliente: { select: { id: true, nome: true, documento: true } },
          fornecedor: { select: { id: true, nome: true, documento: true } },
          contas: true,
          parcelas: { orderBy: { numeroParcela: 'asc' } },
        },
      });
    });
  }

  async listarContasDisponiveis(empresaId: string, tipo: string, busca?: string) {
    if (tipo === 'RECEBER') {
      const where: Record<string, unknown> = {
        empresaId,
        situacao: { in: ['ABERTA', 'VENCIDO'] },
      };
      if (busca) {
        where.OR = [
          { numeroDocumento: { contains: busca, mode: 'insensitive' } },
          { cliente: { nome: { contains: busca, mode: 'insensitive' } } },
        ];
      }
      return prisma.contaReceber.findMany({
        where,
        include: { cliente: { select: { id: true, nome: true } } },
        orderBy: { dataVencimento: 'asc' },
      });
    }

    const where: Record<string, unknown> = {
      empresaId,
      situacao: { in: ['ABERTA', 'VENCIDO'] },
    };
    if (busca) {
      where.OR = [
        { numeroDocumento: { contains: busca, mode: 'insensitive' } },
        { fornecedor: { nome: { contains: busca, mode: 'insensitive' } } },
      ];
    }
    return prisma.contaPagar.findMany({
      where,
      include: { fornecedor: { select: { id: true, nome: true } } },
      orderBy: { dataVencimento: 'asc' },
    });
  }
}
