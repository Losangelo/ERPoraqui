import { prisma } from '@/database/prisma.service';
import { 
  CriarEntradaMercadoriaInput,
  EntradaFiltro 
} from './dto/entrada-mercadoria.dto';

export class EntradasMercadoriaService {
  async criar(empresaId: string, dados: CriarEntradaMercadoriaInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const { itens, ...entradaData } = dados;

    const valorTotalItens = itens.reduce((total, item) => {
      const valorItem = item.quantidade * item.valorUnitario;
      const desconto = valorItem * (item.valorDesconto / 100);
      return total + (valorItem - desconto);
    }, 0);

    const valorTotal = valorTotalItens + entradaData.valorFrete - entradaData.valorDesconto;

    return prisma.entradaMercadoria.create({
      data: {
        ...entradaData,
        empresaId,
        valorTotal,
        dataEmissao: entradaData.dataEmissao || new Date(),
        itens: {
          create: itens.map((item) => ({
            ...item,
            quantidadeRecebida: item.quantidadeRecebida || item.quantidade,
            valorTotal: item.quantidade * item.valorUnitario,
          })),
        },
      },
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
        pedidoCompra: true,
      },
    });
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.entradaMercadoria.findFirst({
      where: { id, empresaId },
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
        pedidoCompra: true,
      },
    });
  }

  async listar(empresaId: string, filtros: EntradaFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const { pedidoCompraId, situacao, dataInicial, dataFinal, pagina, limite } = filtros;

    const where = {
      empresaId,
      ...(pedidoCompraId && { pedidoCompraId }),
      ...(situacao && { situacao }),
      ...(dataInicial && dataFinal && {
        dataEntrada: {
          gte: dataInicial,
          lte: dataFinal,
        },
      }),
    };

    const [dados, total] = await Promise.all([
      prisma.entradaMercadoria.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { dataEntrada: 'desc' },
        include: {
          pedidoCompra: {
            select: { id: true, numeroPedido: true },
          },
          _count: {
            select: { itens: true },
          },
        },
      }),
      prisma.entradaMercadoria.count({ where }),
    ]);

    return {
      dados,
      meta: {
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }

  async confirmarRecebimento(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    
    const entrada = await prisma.entradaMercadoria.findUnique({
      where: { id },
      include: { itens: true },
    });

    if (!entrada) {
      throw new Error('Entrada não encontrada');
    }

    for (const item of entrada.itens) {
      await prisma.produto.update({
        where: { id: item.produtoId },
        data: {
          quantidadeEstoque: {
            increment: item.quantidadeRecebida,
          },
        },
      });
    }

    return prisma.entradaMercadoria.update({
      where: { id },
      data: { situacao: 'RECEBIDO' },
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });
  }

  async cancelar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    
    return prisma.entradaMercadoria.update({
      where: { id },
      data: { situacao: 'CANCELADO' },
    });
  }

  private async verificarProprietario(id: string, empresaId: string) {
    const entrada = await prisma.entradaMercadoria.findFirst({
      where: { id, empresaId },
    });

    if (!entrada) {
      throw new Error('Entrada não encontrada');
    }
  }
}
