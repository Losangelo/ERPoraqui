import { prisma } from '@/database/prisma.service';
import { FluxoCaixaInput, FluxoCaixaFiltro } from './dto/fluxo-caixa.dto';

export class FluxoCaixaService {
  async criar(empresaId: string, dados: FluxoCaixaInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const fluxoCaixa = await prisma.fluxoCaixa.create({
      data: {
        empresaId,
        tipo: dados.tipo,
        categoria: dados.categoria,
        descricao: dados.descricao,
        valor: dados.valor,
        formaPagamento: dados.formaPagamento,
        dataMovimentacao: dados.dataMovimentacao ? new Date(dados.dataMovimentacao) : new Date(),
        referenciaId: dados.referenciaId,
        referenciaTipo: dados.referenciaTipo,
      },
    });

    return {
      ...fluxoCaixa,
      valor: Number(fluxoCaixa.valor),
    };
  }

  async listar(empresaId: string, filtros: FluxoCaixaFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const { tipo, categoria, dataInicial, dataFinal, pagina, limite } = filtros;

    const where: any = {
      empresaId,
      ...(tipo && { tipo }),
      ...(categoria && { categoria: { contains: categoria, mode: 'insensitive' as const } }),
      ...((dataInicial || dataFinal) && {
        dataMovimentacao: {
          ...(dataInicial && { gte: new Date(dataInicial) }),
          ...(dataFinal && { lte: new Date(dataFinal) }),
        },
      }),
    };

    const [dados, total] = await Promise.all([
      prisma.fluxoCaixa.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { dataMovimentacao: 'desc' },
      }),
      prisma.fluxoCaixa.count({ where }),
    ]);

    const dadosFormatados = dados.map((f) => ({
      ...f,
      valor: Number(f.valor),
    }));

    return {
      dados: dadosFormatados,
      meta: {
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const fluxoCaixa = await prisma.fluxoCaixa.findFirst({
      where: { id, empresaId },
    });

    if (!fluxoCaixa) {
      throw new Error('Movimentação não encontrada');
    }

    return {
      ...fluxoCaixa,
      valor: Number(fluxoCaixa.valor),
    };
  }

  async saldoAtual(empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const movimentacoes = await prisma.fluxoCaixa.findMany({
      where: { empresaId },
      select: { tipo: true, valor: true },
    });

    const entradas = movimentacoes
      .filter((m) => m.tipo === 'ENTRADA')
      .reduce((sum, m) => sum + Number(m.valor), 0);

    const saidas = movimentacoes
      .filter((m) => m.tipo === 'SAIDA')
      .reduce((sum, m) => sum + Number(m.valor), 0);

    return {
      entradas,
      saidas,
      saldo: entradas - saidas,
    };
  }

  async resumoDiario(empresaId: string, data: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const dataInicio = new Date(data);
    dataInicio.setHours(0, 0, 0, 0);
    const dataFim = new Date(data);
    dataFim.setHours(23, 59, 59, 999);

    const movimentacoes = await prisma.fluxoCaixa.findMany({
      where: {
        empresaId,
        dataMovimentacao: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      orderBy: { dataMovimentacao: 'asc' },
    });

    const entradas = movimentacoes
      .filter((m) => m.tipo === 'ENTRADA')
      .reduce((sum, m) => sum + Number(m.valor), 0);

    const saidas = movimentacoes
      .filter((m) => m.tipo === 'SAIDA')
      .reduce((sum, m) => sum + Number(m.valor), 0);

    return {
      data,
      entradas,
      saidas,
      saldoDia: entradas - saidas,
      movimentacoes: movimentacoes.map((m) => ({
        ...m,
        valor: Number(m.valor),
      })),
    };
  }

  async listarCategorias(empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const categorias = await prisma.fluxoCaixa.findMany({
      where: { empresaId },
      select: { categoria: true },
      distinct: ['categoria'],
    });

    return categorias.map((c) => c.categoria);
  }
}
