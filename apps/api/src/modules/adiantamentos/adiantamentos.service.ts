import { prisma } from '@/database/prisma.service';
import { CriarAdiantamentoInput, AdiantamentoFiltro, criarAdiantamentoSchema, adiantamentoFiltroSchema } from './dto/adiantamento.dto';

export class AdiantamentoService {
  async listar(empresaId: string, filtros: AdiantamentoFiltro) {
    const parsed = adiantamentoFiltroSchema.parse(filtros);

    const where: Record<string, unknown> = { empresaId };

    if (parsed.tipo) where.tipo = parsed.tipo;
    if (parsed.situacao) where.situacao = parsed.situacao;
    if (parsed.dataInicial || parsed.dataFinal) {
      where.dataAdiantamento = {};
      if (parsed.dataInicial) (where.dataAdiantamento as Record<string, unknown>).gte = new Date(parsed.dataInicial);
      if (parsed.dataFinal) (where.dataAdiantamento as Record<string, unknown>).lte = new Date(parsed.dataFinal);
    }

    const skip = (parsed.pagina - 1) * parsed.limite;

    const [data, total] = await Promise.all([
      prisma.adiantamento.findMany({
        where,
        skip,
        take: parsed.limite,
        orderBy: { dataAdiantamento: 'desc' },
        include: {
          cliente: { select: { id: true, nome: true, documento: true } },
          fornecedor: { select: { id: true, nome: true, documento: true } },
        },
      }),
      prisma.adiantamento.count({ where }),
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
    const adiantamento = await prisma.adiantamento.findFirst({
      where: { id, empresaId },
      include: {
        cliente: { select: { id: true, nome: true, documento: true } },
        fornecedor: { select: { id: true, nome: true, documento: true } },
      },
    });

    if (!adiantamento) {
      throw new Error('Adiantamento não encontrado');
    }

    return adiantamento;
  }

  async criar(empresaId: string, data: CriarAdiantamentoInput) {
    const parsed = criarAdiantamentoSchema.parse(data);

    if (!parsed.clienteId && !parsed.fornecedorId && !parsed.funcionarioId) {
      throw new Error('Informe cliente, fornecedor ou funcionário');
    }

    return prisma.adiantamento.create({
      data: {
        empresaId,
        tipo: parsed.tipo,
        clienteId: parsed.tipo === 'CLIENTE' ? parsed.clienteId : null,
        fornecedorId: parsed.tipo === 'FORNECEDOR' ? parsed.fornecedorId : null,
        funcionarioId: parsed.tipo === 'FUNCIONARIO' ? parsed.funcionarioId : null,
        valor: parsed.valor,
        dataAdiantamento: new Date(parsed.dataAdiantamento),
        dataPrevisao: parsed.dataPrevisao ? new Date(parsed.dataPrevisao) : null,
        formaPagamento: parsed.formaPagamento || null,
        observacoes: parsed.observacoes || null,
      },
      include: {
        cliente: { select: { id: true, nome: true, documento: true } },
        fornecedor: { select: { id: true, nome: true, documento: true } },
      },
    });
  }

  async atualizar(id: string, empresaId: string, data: Partial<CriarAdiantamentoInput>) {
    const adiantamento = await prisma.adiantamento.findFirst({
      where: { id, empresaId },
    });

    if (!adiantamento) {
      throw new Error('Adiantamento não encontrado');
    }

    if (adiantamento.situacao === 'CANCELADO') {
      throw new Error('Não é possível alterar um adiantamento cancelado');
    }

    return prisma.adiantamento.update({
      where: { id },
      data: {
        valor: data.valor ?? adiantamento.valor,
        dataAdiantamento: data.dataAdiantamento ? new Date(data.dataAdiantamento) : adiantamento.dataAdiantamento,
        dataPrevisao: data.dataPrevisao !== undefined ? (data.dataPrevisao ? new Date(data.dataPrevisao) : null) : adiantamento.dataPrevisao,
        formaPagamento: data.formaPagamento !== undefined ? (data.formaPagamento || null) : adiantamento.formaPagamento,
        observacoes: data.observacoes !== undefined ? (data.observacoes || null) : adiantamento.observacoes,
      },
      include: {
        cliente: { select: { id: true, nome: true, documento: true } },
        fornecedor: { select: { id: true, nome: true, documento: true } },
      },
    });
  }

  async quitar(id: string, empresaId: string) {
    const adiantamento = await prisma.adiantamento.findFirst({
      where: { id, empresaId },
    });

    if (!adiantamento) {
      throw new Error('Adiantamento não encontrado');
    }

    if (adiantamento.situacao !== 'ABERTO') {
      throw new Error('Adiantamento não está aberto');
    }

    return prisma.adiantamento.update({
      where: { id },
      data: { situacao: 'QUITADO' },
      include: {
        cliente: { select: { id: true, nome: true, documento: true } },
        fornecedor: { select: { id: true, nome: true, documento: true } },
      },
    });
  }

  async cancelar(id: string, empresaId: string) {
    const adiantamento = await prisma.adiantamento.findFirst({
      where: { id, empresaId },
    });

    if (!adiantamento) {
      throw new Error('Adiantamento não encontrado');
    }

    if (adiantamento.situacao === 'QUITADO') {
      throw new Error('Não é possível cancelar um adiantamento já quitado');
    }

    return prisma.adiantamento.update({
      where: { id },
      data: { situacao: 'CANCELADO' },
      include: {
        cliente: { select: { id: true, nome: true, documento: true } },
        fornecedor: { select: { id: true, nome: true, documento: true } },
      },
    });
  }

  async excluir(id: string, empresaId: string) {
    const adiantamento = await prisma.adiantamento.findFirst({
      where: { id, empresaId },
    });

    if (!adiantamento) {
      throw new Error('Adiantamento não encontrado');
    }

    if (adiantamento.situacao === 'QUITADO') {
      throw new Error('Não é possível excluir um adiantamento quitado');
    }

    return prisma.adiantamento.delete({ where: { id } });
  }
}
