import { prisma } from '@/database/prisma.service';
import { MovimentacaoEstoqueInput, MovimentacaoEstoqueFiltro, HistoricoProdutoParams } from './dto/movimentacao-estoque.dto';

export class MovimentacaoEstoqueService {
  async criar(empresaId: string, dados: MovimentacaoEstoqueInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const produto = await prisma.produto.findFirst({
      where: { id: dados.produtoId, empresaId },
    });

    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    const quantidadeAnterior = Number(produto.quantidadeEstoque);
    let quantidadeNova: number;

    switch (dados.tipoMovimentacao) {
      case 'ENTRADA':
      case 'DEVOLUCAO':
        quantidadeNova = quantidadeAnterior + dados.quantidade;
        break;
      case 'SAIDA':
        quantidadeNova = quantidadeAnterior - dados.quantidade;
        if (quantidadeNova < 0) {
          throw new Error('Estoque insuficiente para esta operação');
        }
        break;
      case 'AJUSTE':
        quantidadeNova = dados.quantidade;
        break;
      case 'TRANSFERENCIA':
        quantidadeNova = quantidadeAnterior - dados.quantidade;
        if (quantidadeNova < 0) {
          throw new Error('Estoque insuficiente para transferência');
        }
        break;
      default:
        throw new Error('Tipo de movimentação inválido');
    }

    const [movimentacao] = await prisma.$transaction([
      prisma.movimentacaoEstoque.create({
        data: {
          empresaId,
          produtoId: dados.produtoId,
          tipoMovimentacao: dados.tipoMovimentacao,
          quantidade: dados.quantidade,
          quantidadeAnterior,
          quantidadeNova,
          motivo: dados.motivo,
        },
      }),
      prisma.produto.update({
        where: { id: dados.produtoId },
        data: { quantidadeEstoque: quantidadeNova },
      }),
    ]);

    return movimentacao;
  }

  async listar(empresaId: string, filtros: MovimentacaoEstoqueFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const { produtoId, tipoMovimentacao, dataInicial, dataFinal, pagina, limite } = filtros;

    const where: any = {
      empresaId,
      ...(produtoId && { produtoId }),
      ...(tipoMovimentacao && { tipoMovimentacao }),
      ...((dataInicial || dataFinal) && {
        dataMovimentacao: {
          ...(dataInicial && { gte: new Date(dataInicial) }),
          ...(dataFinal && { lte: new Date(dataFinal) }),
        },
      }),
    };

    const [dados, total] = await Promise.all([
      prisma.movimentacaoEstoque.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { dataMovimentacao: 'desc' },
        include: {
          produto: {
            select: {
              id: true,
              codigoInterno: true,
              nome: true,
            },
          },
        },
      }),
      prisma.movimentacaoEstoque.count({ where }),
    ]);

    const dadosFormatados = dados.map((m) => ({
      ...m,
      quantidade: Number(m.quantidade),
      quantidadeAnterior: Number(m.quantidadeAnterior),
      quantidadeNova: Number(m.quantidadeNova),
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

    const movimentacao = await prisma.movimentacaoEstoque.findFirst({
      where: { id, empresaId },
      include: {
        produto: {
          select: {
            id: true,
            codigoInterno: true,
            nome: true,
            unidadeMedida: {
              select: { simbolo: true },
            },
          },
        },
      },
    });

    if (!movimentacao) {
      throw new Error('Movimentação não encontrada');
    }

    return {
      ...movimentacao,
      quantidade: Number(movimentacao.quantidade),
      quantidadeAnterior: Number(movimentacao.quantidadeAnterior),
      quantidadeNova: Number(movimentacao.quantidadeNova),
    };
  }

  async historicoProduto(produtoId: string, empresaId: string, filtros?: HistoricoProdutoParams) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const { dataInicio, dataFim, pagina = 1, limite = 100 } = filtros || {};

    const where: any = {
      produtoId,
      empresaId,
      ...((dataInicio || dataFim) && {
        dataMovimentacao: {
          ...(dataInicio && { gte: new Date(dataInicio) }),
          ...(dataFim && { lte: new Date(dataFim) }),
        },
      }),
    };

    const [movimentacoes, total] = await Promise.all([
      prisma.movimentacaoEstoque.findMany({
        where,
        orderBy: { dataMovimentacao: 'asc' },
        skip: (pagina - 1) * limite,
        take: limite,
        include: {
          produto: {
            select: {
              id: true,
              codigoInterno: true,
              nome: true,
            },
          },
        },
      }),
      prisma.movimentacaoEstoque.count({ where }),
    ]);

    let saldo = 0;
    const dadosComSaldo = movimentacoes.map((m) => {
      const qtd = Number(m.quantidade);
      const tipo = m.tipoMovimentacao;
      const signal = (tipo === 'ENTRADA' || tipo === 'DEVOLUCAO') ? qtd : -qtd;
      saldo += signal;
      return {
        ...m,
        quantidade: qtd,
        quantidadeAnterior: Number(m.quantidadeAnterior),
        quantidadeNova: Number(m.quantidadeNova),
        saldoAcumulado: saldo,
      };
    });

    return {
      dados: dadosComSaldo,
      meta: {
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }
}
