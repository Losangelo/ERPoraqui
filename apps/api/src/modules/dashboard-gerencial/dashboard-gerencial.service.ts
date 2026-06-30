import { prisma } from '@/database/prisma.service';

export class DashboardGerencialService {
  async dashboardCompleto(empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    const [
      totalClientes,
      totalFornecedores,
      totalProdutos,
      totalVendedores,
      vendas,
      compras,
      contasReceber,
      contasPagar,
      estoque,
    ] = await Promise.all([
      prisma.cliente.count({ where: { empresaId, ativo: true } }),
      prisma.fornecedor.count({ where: { empresaId, ativo: true } }),
      prisma.produto.count({ where: { empresaId, ativo: true } }),
      prisma.vendedor.count({ where: { empresaId, ativo: true } }),
      prisma.pedidoVenda.findMany({
        where: {
          empresaId,
          dataCriacao: { gte: inicioMes },
        },
        select: { valorTotal: true },
      }),
      prisma.pedidoCompra.findMany({
        where: {
          empresaId,
          dataCriacao: { gte: inicioMes },
        },
        select: { valorTotal: true },
      }),
      prisma.contaReceber.findMany({
        where: { empresaId, situacao: { in: ['ABERTA', 'VENCIDO'] } },
        select: { valorOriginal: true },
      }),
      prisma.contaPagar.findMany({
        where: { empresaId, situacao: { in: ['ABERTA', 'VENCIDO'] } },
        select: { valorOriginal: true },
      }),
      prisma.produto.findMany({
        where: { empresaId, ativo: true },
        select: { quantidadeEstoque: true },
      }),
    ]);

    const valorVendasMes = vendas.reduce((sum: number, v) => sum + Number(v.valorTotal), 0);
    const valorComprasMes = compras.reduce((sum: number, v) => sum + Number(v.valorTotal), 0);
    const valorReceber = contasReceber.reduce((sum: number, c) => sum + Number(c.valorOriginal), 0);
    const valorPagar = contasPagar.reduce((sum: number, c) => sum + Number(c.valorOriginal), 0);
    const valorEstoque = estoque.reduce((sum: number, p) => sum + Number(p.quantidadeEstoque), 0);

    return {
      cadastros: {
        clientes: totalClientes,
        fornecedores: totalFornecedores,
        produtos: totalProdutos,
        vendedores: totalVendedores,
      },
      vendas: {
        mes: {
          quantidade: vendas.length,
          valor: valorVendasMes,
        },
      },
      compras: {
        mes: {
          quantidade: compras.length,
          valor: valorComprasMes,
        },
      },
      financeiro: {
        receber: {
          quantidade: contasReceber.length,
          valor: valorReceber,
        },
        pagar: {
          quantidade: contasPagar.length,
          valor: valorPagar,
        },
        saldoProjecao: valorReceber - valorPagar,
      },
      estoque: {
        valorTotal: valorEstoque,
      },
    };
  }

  async graficoVendas(empresaId: string, periodo: string = '30dias') {
    if (!empresaId) throw new Error('Empresa não identificada');

    let inicio: Date;
    const fim = new Date();
    fim.setHours(23, 59, 59, 999);

    switch (periodo) {
      case '7dias':
        inicio = new Date();
        inicio.setDate(inicio.getDate() - 7);
        break;
      case '30dias':
        inicio = new Date();
        inicio.setDate(inicio.getDate() - 30);
        break;
      case '90dias':
        inicio = new Date();
        inicio.setDate(inicio.getDate() - 90);
        break;
      case 'ano':
        inicio = new Date();
        inicio.setFullYear(inicio.getFullYear() - 1);
        break;
      default:
        inicio = new Date();
        inicio.setDate(inicio.getDate() - 30);
    }

    const vendas = await prisma.pedidoVenda.findMany({
      where: {
        empresaId,
        dataCriacao: { gte: inicio, lte: fim },
      },
      select: {
        dataCriacao: true,
        valorTotal: true,
      },
      orderBy: { dataCriacao: 'asc' },
    });

    const vendasAgrupadas = vendas.reduce((acc: Record<string, number>, v) => {
      const key = v.dataCriacao.toISOString().split('T')[0];
      acc[key] = (acc[key] || 0) + Number(v.valorTotal);
      return acc;
    }, {});

    return Object.entries(vendasAgrupadas).map(([data, valor]) => ({
      data,
      valor,
    }));
  }

  async graficoVendasPorDiaSemana(empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const inicio = new Date();
    inicio.setDate(inicio.getDate() - 30);

    const vendas = await prisma.pedidoVenda.findMany({
      where: {
        empresaId,
        dataCriacao: { gte: inicio },
      },
      select: {
        dataCriacao: true,
        valorTotal: true,
      },
    });

    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const agrupado: Record<string, number> = {};

    vendas.forEach((v) => {
      const dia = diasSemana[v.dataCriacao.getDay()];
      agrupado[dia] = (agrupado[dia] || 0) + Number(v.valorTotal);
    });

    return Object.entries(agrupado).map(([dia, valor]) => ({ dia, valor }));
  }

  async graficoReceitasDespesas(empresaId: string, periodo: string = '30dias') {
    if (!empresaId) throw new Error('Empresa não identificada');

    let inicio: Date;
    const fim = new Date();
    fim.setHours(23, 59, 59, 999);

    switch (periodo) {
      case '30dias':
        inicio = new Date();
        inicio.setDate(inicio.getDate() - 30);
        break;
      case '90dias':
        inicio = new Date();
        inicio.setDate(inicio.getDate() - 90);
        break;
      case 'ano':
        inicio = new Date();
        inicio.setFullYear(inicio.getFullYear() - 1);
        break;
      default:
        inicio = new Date();
        inicio.setDate(inicio.getDate() - 30);
    }

    const [contasReceber, contasPagar] = await Promise.all([
      prisma.contaReceber.findMany({
        where: {
          empresaId,
          dataEmissao: { gte: inicio, lte: fim },
        },
        select: { dataVencimento: true, valorOriginal: true },
      }),
      prisma.contaPagar.findMany({
        where: {
          empresaId,
          dataVencimento: { gte: inicio, lte: fim },
        },
        select: { dataVencimento: true, valorOriginal: true },
      }),
    ]);

    const receitasAgrupadas = contasReceber.reduce((acc: Record<string, number>, c) => {
      const key = c.dataVencimento.toISOString().split('T')[0];
      acc[key] = (acc[key] || 0) + Number(c.valorOriginal);
      return acc;
    }, {});

    const despesasAgrupadas = contasPagar.reduce((acc: Record<string, number>, c) => {
      const key = c.dataVencimento.toISOString().split('T')[0];
      acc[key] = (acc[key] || 0) + Number(c.valorOriginal);
      return acc;
    }, {});

    const todasDatas = new Set([...Object.keys(receitasAgrupadas), ...Object.keys(despesasAgrupadas)]);
    
    return Array.from(todasDatas)
      .sort()
      .slice(-30)
      .map((data) => ({
        data,
        receitas: receitasAgrupadas[data] || 0,
        despesas: despesasAgrupadas[data] || 0,
      }));
  }

  async graficoStatusPedidos(empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const vendas = await prisma.pedidoVenda.findMany({
      where: { empresaId },
      select: { situacao: true },
    });

    const agrupado: Record<string, number> = {};
    vendas.forEach((v) => {
      agrupado[v.situacao] = (agrupado[v.situacao] || 0) + 1;
    });

    return Object.entries(agrupado).map(([status, quantidade]) => ({ status, quantidade }));
  }

  async graficoEstoquePorCategoria(empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const produtos = await prisma.produto.findMany({
      where: { empresaId, ativo: true },
      include: {
        categoria: {
          select: { nome: true },
        },
      },
    });

    const agrupado: Record<string, number> = {};

    produtos.forEach((p) => {
      const cat = p.categoria?.nome || 'Sem Categoria';
      agrupado[cat] = (agrupado[cat] || 0) + Number(p.quantidadeEstoque);
    });

    return Object.entries(agrupado)
      .map(([categoria, quantidade]) => ({ categoria, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);
  }

  async graficoMaisVendidos(empresaId: string, limite: number = 10) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const inicio = new Date();
    inicio.setDate(inicio.getDate() - 30);

    const vendas = await prisma.pedidoVenda.findMany({
      where: {
        empresaId,
        dataCriacao: { gte: inicio },
      },
      select: {
        itens: {
          select: {
            produtoId: true,
            produto: {
              select: { nome: true, codigoInterno: true },
            },
            quantidade: true,
            valorTotal: true,
          },
        },
      },
    });

    const agrupado: Record<string, { nome: string; codigo: string; quantidade: number; valor: number }> = {};

    vendas.forEach((venda) => {
      venda.itens.forEach((item) => {
        const key = item.produtoId;
        if (!agrupado[key]) {
          agrupado[key] = {
            nome: item.produto.nome,
            codigo: item.produto.codigoInterno,
            quantidade: 0,
            valor: 0,
          };
        }
        agrupado[key].quantidade += Number(item.quantidade);
        agrupado[key].valor += Number(item.valorTotal);
      });
    });

    return Object.values(agrupado)
      .sort((a, b) => b.valor - a.valor)
      .slice(0, limite);
  }

  async indicadoresRapidos(empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const hoje = new Date();
    const inicioDia = new Date(hoje.setHours(0, 0, 0, 0));
    const fimDia = new Date(hoje.setHours(23, 59, 59, 999));

    const [vendasDia, pedidosDia, produtos] = await Promise.all([
      prisma.pedidoVenda.findMany({
        where: {
          empresaId,
          dataCriacao: { gte: inicioDia, lte: fimDia },
        },
        select: { valorTotal: true },
      }),
      prisma.pedidoVenda.count({
        where: {
          empresaId,
          dataCriacao: { gte: inicioDia, lte: fimDia },
        },
      }),
      prisma.produto.findMany({
        where: {
          empresaId,
          ativo: true,
        },
        select: { quantidadeEstoque: true, estoqueMinimo: true },
      }),
    ]);

    const valorVendasDia = vendasDia.reduce((sum: number, v) => sum + Number(v.valorTotal), 0);
    const produtosEstoqueZero = produtos.filter(p => Number(p.quantidadeEstoque) <= 0).length;
    const produtosAbaixoMinimo = produtos.filter(p => Number(p.quantidadeEstoque) <= Number(p.estoqueMinimo)).length;

    return {
      vendasDia: {
        quantidade: vendasDia.length,
        valor: valorVendasDia,
      },
      pedidosDia,
      estoque: {
        abaixoMinimo: produtosAbaixoMinimo,
        estoqueZero: produtosEstoqueZero,
      },
    };
  }
}
