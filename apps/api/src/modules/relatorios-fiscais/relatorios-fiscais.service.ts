import { prisma } from '@/database/prisma.service';

export class RelatoriosFiscaisService {
  async resumoNotas(empresaId: string, dataInicial: string, dataFinal: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const inicio = new Date(dataInicial);
    const fim = new Date(dataFinal);
    fim.setHours(23, 59, 59, 999);

    const notasFiscais = await prisma.entradaMercadoria.findMany({
      where: {
        empresaId,
        dataEmissao: {
          gte: inicio,
          lte: fim,
        },
      },
      orderBy: { dataEmissao: 'desc' },
    });

    const totalNotas = notasFiscais.length;
    const valorTotal = notasFiscais.reduce((sum, n) => sum + Number(n.valorTotal), 0);

    return {
      periodo: { dataInicial, dataFinal },
      totalNotas,
      valorTotal,
      notas: notasFiscais.map((n) => ({
        id: n.id,
        numero: n.numeroNota,
        serie: n.serieNota,
        dataEmissao: n.dataEmissao,
        valorTotal: Number(n.valorTotal),
      })),
    };
  }

  async resumoImpostos(empresaId: string, dataInicial: string, dataFinal: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const inicio = new Date(dataInicial);
    const fim = new Date(dataFinal);
    fim.setHours(23, 59, 59, 999);

    const [notasEntrada, vendas, compras] = await Promise.all([
      prisma.entradaMercadoria.findMany({
        where: {
          empresaId,
          dataEmissao: { gte: inicio, lte: fim },
        },
        select: { valorTotal: true },
      }),
      prisma.pedidoVenda.findMany({
        where: {
          empresaId,
          dataCriacao: { gte: inicio, lte: fim },
        },
        select: { valorTotal: true },
      }),
      prisma.pedidoCompra.findMany({
        where: {
          empresaId,
          dataCriacao: { gte: inicio, lte: fim },
        },
        select: { valorTotal: true },
      }),
    ]);

    const valorEntradas = notasEntrada.reduce((sum: number, n) => sum + Number(n.valorTotal), 0);
    const valorVendas = vendas.reduce((sum: number, n) => sum + Number(n.valorTotal), 0);
    const valorCompras = compras.reduce((sum: number, n) => sum + Number(n.valorTotal), 0);

    return {
      periodo: { dataInicial, dataFinal },
      entradas: {
        quantidade: notasEntrada.length,
        valorTotal: valorEntradas,
      },
      vendas: {
        quantidade: vendas.length,
        valorTotal: valorVendas,
      },
      compras: {
        quantidade: compras.length,
        valorTotal: valorCompras,
      },
    };
  }

  async spedFiscal(empresaId: string, dataInicial: string, dataFinal: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const inicio = new Date(dataInicial);
    const fim = new Date(dataFinal);
    fim.setHours(23, 59, 59, 999);

    const empresa = await prisma.empresa.findUnique({
      where: { id: empresaId },
    });

    const notasEntrada = await prisma.entradaMercadoria.findMany({
      where: {
        empresaId,
        dataEmissao: { gte: inicio, lte: fim },
      },
      orderBy: { dataEmissao: 'asc' },
    });

    const registros: string[] = [];
    
    registros.push(`0000|0|${empresa?.cnpj || ''}|${empresa?.razaoSocial || ''}|${dataInicial}|${dataFinal}|`);
    
    for (const nota of notasEntrada) {
      registros.push(`C100|0|0|${nota.serieNota}|${nota.numeroNota}|${nota.dataEmissao?.toISOString().split('T')[0] || ''}||${Number(nota.valorTotal).toFixed(2)}|0.00|||`);
    }

    return {
      cnpj: empresa?.cnpj,
      nome: empresa?.razaoSocial,
      periodo: { dataInicial, dataFinal },
      registros,
    };
  }

  async spedContribuicoes(empresaId: string, dataInicial: string, dataFinal: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const inicio = new Date(dataInicial);
    const fim = new Date(dataFinal);
    fim.setHours(23, 59, 59, 999);

    const empresa = await prisma.empresa.findUnique({
      where: { id: empresaId },
    });

    const [vendas, compras] = await Promise.all([
      prisma.pedidoVenda.findMany({
        where: {
          empresaId,
          dataCriacao: { gte: inicio, lte: fim },
        },
        select: { valorTotal: true },
      }),
      prisma.pedidoCompra.findMany({
        where: {
          empresaId,
          dataCriacao: { gte: inicio, lte: fim },
        },
        select: { valorTotal: true },
      }),
    ]);

    const totalVendas = vendas.reduce((sum: number, n) => sum + Number(n.valorTotal), 0);
    const totalCompras = compras.reduce((sum: number, n) => sum + Number(n.valorTotal), 0);
    const basePis = totalVendas;
    const baseCofins = totalVendas;

    return {
      cnpj: empresa?.cnpj,
      nome: empresa?.razaoSocial,
      periodo: { dataInicial, dataFinal },
      totalVendas,
      totalCompras,
      basePis,
      baseCofins,
      pis: basePis * 0.0065,
      cofins: baseCofins * 0.03,
    };
  }
}
