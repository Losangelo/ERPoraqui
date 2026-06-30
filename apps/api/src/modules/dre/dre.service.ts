import { Request, Response } from 'express';
import { prisma } from '@/database/prisma.service';

export class DREService {
  async gerarDRE(req: Request, res: Response) {
    try {
      const empresaId = (req as any).usuario?.empresaId;
      const { dataInicial, dataFinal } = req.query;

      const dataIni = dataInicial ? new Date(dataInicial as string) : new Date(new Date().getFullYear(), 0, 1);
      const dataFin = dataFinal ? new Date(dataFinal as string) : new Date();

      const receitas = await prisma.fluxoCaixa.findMany({
        where: {
          empresaId,
          tipo: 'ENTRADA',
          dataMovimentacao: { gte: dataIni, lte: dataFin },
        },
        select: { valor: true, categoria: true },
      });

      const despesas = await prisma.fluxoCaixa.findMany({
        where: {
          empresaId,
          tipo: 'SAIDA',
          dataMovimentacao: { gte: dataIni, lte: dataFin },
        },
        select: { valor: true, categoria: true },
      });

      const vendasBrutas = receitas
        .filter(r => r.categoria === 'Vendas')
        .reduce((sum, r) => sum + r.valor, 0);

      const devolucoes = await prisma.contaReceber.aggregate({
        where: {
          empresaId,
          dataEmissao: { gte: dataIni, lte: dataFin },
          valorRecebido: { lt: prisma.contaReceber.fields.valorOriginal },
        },
        _sum: { valorDesconto: true },
      });

      const receitaLiquida = vendasBrutas;

      const custoMercadorias = await prisma.pedidoVenda.aggregate({
        where: {
          empresaId,
          situacao: { in: ['CONFIRMADO', 'ENTREGUE'] },
          dataEmissao: { gte: dataIni, lte: dataFin },
        },
        _sum: { valorTotal: true },
      });

      const custo = custoMercadorias._sum.valorTotal || 0;

      const lucroBruto = receitaLiquida - custo;

      const despesasOperacionais = despesas
        .filter(d => !['Fornecedores', 'Impostos'].includes(d.categoria))
        .reduce((sum, d) => sum + d.valor, 0);

      const despesasFinanceiras = despesas
        .filter(d => d.categoria === 'Despesas Financeiras')
        .reduce((sum, d) => sum + d.valor, 0);

      const receitasFinanceiras = receitas
        .filter(r => r.categoria === 'Receitas Financeiras')
        .reduce((sum, r) => sum + r.valor, 0);

      const resultadoFinanceiro = receitasFinanceiras - despesasFinanceiras;

      const lucroOperacional = lucroBruto - despesasOperacionais;

      const impostos = despesas
        .filter(d => d.categoria === 'Impostos')
        .reduce((sum, d) => sum + d.valor, 0);

      const lucroLiquido = lucroOperacional + resultadoFinanceiro - impostos;

      const dre = {
        periodo: {
          dataInicial: dataIni,
          dataFinal: dataFin,
        },
        receitaBruta: vendasBrutas,
        devolucoesAbatimentos: devolucoes._sum.valorDesconto || 0,
        receitaLiquida,
        custoMercadoriasVendidas: custo,
        lucroBruto,
        despesasOperacionais: {
          total: despesasOperacionais,
          detalhamento: despesas
            .filter(d => !['Fornecedores', 'Impostos', 'Despesas Financeiras', 'Receitas Financeiras'].includes(d.categoria))
            .reduce((acc, d) => {
              acc[d.categoria] = (acc[d.categoria] || 0) + d.valor;
              return acc;
            }, {} as Record<string, number>),
        },
        resultadoFinanceiro,
        lucroOperacional,
        impostos,
        lucroLiquido,
        margemLucro: receitaLiquida > 0 ? ((lucroLiquido / receitaLiquida) * 100) : 0,
      };

      res.json(dre);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async gerarDREMensal(req: Request, res: Response) {
    try {
      const empresaId = (req as any).usuario?.empresaId;
      const { ano } = req.query;
      const anoAtual = parseInt(ano as string) || new Date().getFullYear();

      const meses = [];
      for (let mes = 1; mes <= 12; mes++) {
        const dataIni = new Date(anoAtual, mes - 1, 1);
        const dataFin = new Date(anoAtual, mes, 0);

        const receitas = await prisma.fluxoCaixa.findMany({
          where: {
            empresaId,
            tipo: 'ENTRADA',
            dataMovimentacao: { gte: dataIni, lte: dataFin },
          },
        });

        const despesas = await prisma.fluxoCaixa.findMany({
          where: {
            empresaId,
            tipo: 'SAIDA',
            dataMovimentacao: { gte: dataIni, lte: dataFin },
          },
        });

        const receitaBruta = receitas
          .filter(r => r.categoria === 'Vendas')
          .reduce((sum, r) => sum + r.valor, 0);

        const despesasTotais = despesas.reduce((sum, d) => sum + d.valor, 0);

        meses.push({
          mes,
          nome: this.getNomeMes(mes),
          receitaBruta,
          despesasTotais,
          resultado: receitaBruta - despesasTotais,
        });
      }

      res.json({
        ano: anoAtual,
        meses,
        totalReceita: meses.reduce((sum, m) => sum + m.receitaBruta, 0),
        totalDespesas: meses.reduce((sum, m) => sum + m.despesasTotais, 0),
        resultadoAnual: meses.reduce((sum, m) => sum + m.resultado, 0),
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async gerarDREAnual(req: Request, res: Response) {
    try {
      const empresaId = (req as any).usuario?.empresaId;
      const { anos } = req.query;

      const anosAnterior = parseInt(anos as string) || 3;
      const anoAtual = new Date().getFullYear();
      const comparacoes = [];

      for (let i = anosAnterior - 1; i >= 0; i--) {
        const ano = anoAtual - i;
        const dataIni = new Date(ano, 0, 1);
        const dataFin = new Date(ano, 11, 31);

        const receitas = await prisma.fluxoCaixa.findMany({
          where: {
            empresaId,
            tipo: 'ENTRADA',
            dataMovimentacao: { gte: dataIni, lte: dataFin },
          },
        });

        const despesas = await prisma.fluxoCaixa.findMany({
          where: {
            empresaId,
            tipo: 'SAIDA',
            dataMovimentacao: { gte: dataIni, lte: dataFin },
          },
        });

        const receitaBruta = receitas.reduce((sum, r) => sum + r.valor, 0);
        const despesasTotais = despesas.reduce((sum, d) => sum + d.valor, 0);

        comparacoes.push({
          ano,
          receitaBruta,
          despesasTotais,
          resultado: receitaBruta - despesasTotais,
          margem: receitaBruta > 0 ? ((receitaBruta - despesasTotais) / receitaBruta) * 100 : 0,
        });
      }

      res.json({ comparacoes });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async gerarDREComparativo(req: Request, res: Response) {
    try {
      const empresaId = (req as any).usuario?.empresaId;
      const { dataInicial1, dataFinal1, dataInicial2, dataFinal2 } = req.query;

      const dre1 = await this.calcularDREPeriodo(empresaId, dataInicial1 as string, dataFinal2 as string);
      const dre2 = await this.calcularDREPeriodo(empresaId, dataInicial2 as string, dataFinal2 as string);

      res.json({
        periodo1: { dataInicial: dataInicial1, dataFinal: dataFinal1, ...dre1 },
        periodo2: { dataInicial: dataInicial2, dataFinal: dataFinal2, ...dre2 },
        variacao: {
          receitaBruta: dre1.receitaBruta > 0 ? ((dre2.receitaBruta - dre1.receitaBruta) / dre1.receitaBruta) * 100 : 0,
          lucroLiquido: dre1.lucroLiquido > 0 ? ((dre2.lucroLiquido - dre1.lucroLiquido) / dre1.lucroLiquido) * 100 : 0,
        },
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  private async calcularDREPeriodo(empresaId: string, dataInicial: string, dataFinal: string) {
    const dataIni = new Date(dataInicial);
    const dataFin = new Date(dataFinal);

    const receitas = await prisma.fluxoCaixa.findMany({
      where: {
        empresaId,
        tipo: 'ENTRADA',
        dataMovimentacao: { gte: dataIni, lte: dataFin },
      },
    });

    const despesas = await prisma.fluxoCaixa.findMany({
      where: {
        empresaId,
        tipo: 'SAIDA',
        dataMovimentacao: { gte: dataIni, lte: dataFin },
      },
    });

    const receitaBruta = receitas.reduce((sum, r) => sum + r.valor, 0);
    const despesasTotais = despesas.reduce((sum, d) => sum + d.valor, 0);

    return {
      receitaBruta,
      despesasTotais,
      lucroLiquido: receitaBruta - despesasTotais,
    };
  }

  private getNomeMes(mes: number): string {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ];
    return meses[mes - 1];
  }
}

export default new DREService();
