import { prisma } from '@/database/prisma.service';
import { CriarQuitacaoInput, QuitacaoFiltro, criarQuitacaoSchema, quitacaoFiltroSchema } from './dto/quitacao.dto';

export class QuitacaoService {
  async listar(empresaId: string, filtros: QuitacaoFiltro) {
    const parsed = quitacaoFiltroSchema.parse(filtros);

    const where: Record<string, unknown> = { empresaId };

    if (parsed.tipo) where.tipo = parsed.tipo;
    if (parsed.dataInicial || parsed.dataFinal) {
      where.dataQuitacao = {};
      if (parsed.dataInicial) (where.dataQuitacao as Record<string, unknown>).gte = new Date(parsed.dataInicial);
      if (parsed.dataFinal) (where.dataQuitacao as Record<string, unknown>).lte = new Date(parsed.dataFinal);
    }

    const skip = (parsed.pagina - 1) * parsed.limite;

    const [data, total] = await Promise.all([
      prisma.quitacao.findMany({
        where,
        skip,
        take: parsed.limite,
        orderBy: { dataQuitacao: 'desc' },
        include: {
          cliente: { select: { id: true, nome: true, documento: true } },
          fornecedor: { select: { id: true, nome: true, documento: true } },
          contas: true,
        },
      }),
      prisma.quitacao.count({ where }),
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
    const quitacao = await prisma.quitacao.findFirst({
      where: { id, empresaId },
      include: {
        cliente: { select: { id: true, nome: true, documento: true } },
        fornecedor: { select: { id: true, nome: true, documento: true } },
        contas: true,
      },
    });

    if (!quitacao) {
      throw new Error('Quitação não encontrada');
    }

    return quitacao;
  }

  async criar(empresaId: string, data: CriarQuitacaoInput) {
    const parsed = criarQuitacaoSchema.parse(data);

    if (!parsed.clienteId && !parsed.fornecedorId) {
      throw new Error('Informe cliente ou fornecedor');
    }

    return prisma.$transaction(async (tx) => {
      const quitacao = await tx.quitacao.create({
        data: {
          empresaId,
          tipo: parsed.tipo,
          clienteId: parsed.tipo === 'RECEBER' ? parsed.clienteId : null,
          fornecedorId: parsed.tipo === 'PAGAR' ? parsed.fornecedorId : null,
          valorTotal: parsed.contas.reduce((sum, c) => sum + c.valorPago, 0),
          dataQuitacao: new Date(parsed.dataQuitacao),
          formaPagamento: parsed.formaPagamento || null,
          observacoes: parsed.observacoes || null,
          contas: {
            create: parsed.contas.map((c) => ({
              contaId: c.contaId,
              tipoConta: c.tipoConta,
              valorPago: c.valorPago,
            })),
          },
        },
        include: {
          cliente: { select: { id: true, nome: true, documento: true } },
          fornecedor: { select: { id: true, nome: true, documento: true } },
          contas: true,
        },
      });

      for (const conta of parsed.contas) {
        if (conta.tipoConta === 'RECEBER') {
          const contaRec = await tx.contaReceber.update({
            where: { id: conta.contaId },
            data: {
              situacao: 'PAGO',
              valorRecebido: conta.valorPago,
              dataRecebimento: new Date(parsed.dataQuitacao),
              formaPagamento: parsed.formaPagamento as any || null,
            },
          });

          await tx.fluxoCaixa.create({
            data: {
              empresaId,
              tipo: 'ENTRADA',
              categoria: 'RECEBIMENTO_CONTA',
              descricao: `Recebimento - ${contaRec.numeroDocumento}`,
              valor: conta.valorPago,
              formaPagamento: (parsed.formaPagamento as any) || 'PIX',
              dataMovimentacao: new Date(parsed.dataQuitacao),
              referenciaId: conta.contaId,
              referenciaTipo: 'CONTA_RECEBER',
              centroCustoId: contaRec.centroCustoId,
            },
          });
        } else {
          const contaPag = await tx.contaPagar.update({
            where: { id: conta.contaId },
            data: {
              situacao: 'PAGO',
              valorPago: conta.valorPago,
              dataPagamento: new Date(parsed.dataQuitacao),
              formaPagamento: parsed.formaPagamento as any || null,
            },
          });

          await tx.fluxoCaixa.create({
            data: {
              empresaId,
              tipo: 'SAIDA',
              categoria: 'PAGAMENTO_CONTA',
              descricao: `Pagamento - ${contaPag.numeroDocumento}`,
              valor: conta.valorPago,
              formaPagamento: (parsed.formaPagamento as any) || 'PIX',
              dataMovimentacao: new Date(parsed.dataQuitacao),
              referenciaId: conta.contaId,
              referenciaTipo: 'CONTA_PAGAR',
              centroCustoId: contaPag.centroCustoId,
            },
          });
        }
      }

      return quitacao;
    });
  }

  async listarContasDisponiveis(empresaId: string, tipo: string) {
    if (tipo === 'RECEBER') {
      return prisma.contaReceber.findMany({
        where: {
          empresaId,
          situacao: { in: ['ABERTA', 'VENCIDO'] },
        },
        include: { cliente: { select: { id: true, nome: true } } },
        orderBy: { dataVencimento: 'asc' },
      });
    }

    return prisma.contaPagar.findMany({
      where: {
        empresaId,
        situacao: { in: ['ABERTA', 'VENCIDO'] },
      },
      include: { fornecedor: { select: { id: true, nome: true } } },
      orderBy: { dataVencimento: 'asc' },
    });
  }
}
