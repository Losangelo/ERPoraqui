import { prisma } from '@/database/prisma.service';
import { 
  CriarPedidoCompraInput, 
  AtualizarPedidoCompraInput,
  PedidoCompraFiltro 
} from './dto/pedido-compra.dto';

export class PedidosCompraService {
  async criar(empresaId: string, dados: CriarPedidoCompraInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const { itens, ...pedidoData } = dados;

    const valorTotalItens = itens.reduce((total, item) => {
      const valorItem = item.quantidade * item.valorUnitario;
      const desconto = valorItem * (item.valorDesconto / 100);
      return total + (valorItem - desconto);
    }, 0);

    const valorTotal = valorTotalItens + pedidoData.valorFrete - pedidoData.valorDesconto;

    return prisma.pedidoCompra.create({
      data: {
        ...pedidoData,
        empresaId,
        valorTotal,
        dataEmissao: pedidoData.dataEmissao || new Date(),
        itens: {
          create: itens.map((item, index) => ({
            ...item,
            numeroItem: index + 1,
            valorTotal: item.quantidade * item.valorUnitario,
          })),
        },
      },
      include: {
        itens: true,
        fornecedor: true,
      },
    });
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.pedidoCompra.findFirst({
      where: { id, empresaId },
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
        fornecedor: true,
      },
    });
  }

  async listar(empresaId: string, filtros: PedidoCompraFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const { fornecedorId, situacao, dataInicial, dataFinal, pagina, limite } = filtros;

    const where = {
      empresaId,
      ...(fornecedorId && { fornecedorId }),
      ...(situacao && { situacao }),
      ...(dataInicial && dataFinal && {
        dataEmissao: {
          gte: dataInicial,
          lte: dataFinal,
        },
      }),
    };

    const [dados, total] = await Promise.all([
      prisma.pedidoCompra.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { dataCriacao: 'desc' },
        include: {
          fornecedor: {
            select: { id: true, nome: true, documento: true },
          },
          _count: {
            select: { itens: true },
          },
        },
      }),
      prisma.pedidoCompra.count({ where }),
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

  async atualizar(id: string, empresaId: string, dados: AtualizarPedidoCompraInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    
    const pedidoAtual = await prisma.pedidoCompra.findFirst({
      where: { id, empresaId },
    });

    if (!pedidoAtual) {
      throw new Error('Pedido não encontrado');
    }

    // Verificar se está alterando para confirmado
    const estaConfirmando = dados.situacao === 'CONFIRMADO' && pedidoAtual.situacao !== 'CONFIRMADO';
    
    const updatedPedido = await prisma.pedidoCompra.update({
      where: { id },
      data: dados,
      include: {
        itens: true,
        fornecedor: true,
      },
    });

    // Gerar contas a pagar automaticamente ao confirmar o pedido
    if (estaConfirmando) {
      const condicaoPagamento = dados.condicaoPagamento || pedidoAtual.condicaoPagamento || 'A_VISTA';
      
      if (condicaoPagamento !== 'A_VISTA') {
        await this.gerarContasPagar(updatedPedido, empresaId);
      }
    }

    return updatedPedido;
  }

  private async gerarContasPagar(pedido: any, empresaId: string) {
    const quantidadeParcelas = pedido.quantidadeParcelas || 1;
    const intervaloParcelas = pedido.intervaloParcelas || 30;
    const primeiraParcelaDias = pedido.primeiraParcelaDias || 0;
    const valorParcela = pedido.valorTotal / quantidadeParcelas;

    const contasPagar = [];

    for (let i = 0; i < quantidadeParcelas; i++) {
      const dataVencimento = new Date();
      dataVencimento.setDate(dataVencimento.getDate() + primeiraParcelaDias + (i * intervaloParcelas));

      contasPagar.push({
        empresaId,
        fornecedorId: pedido.fornecedorId,
        pedidoCompraId: pedido.id,
        numeroDocumento: `${pedido.numeroPedido}-${i + 1}`,
        numeroParcela: i + 1,
        totalParcelas: quantidadeParcelas,
        dataVencimento,
        dataEmissao: new Date(),
        valorOriginal: valorParcela,
        valorPago: 0,
        valorDesconto: 0,
        valorJuros: 0,
        valorMulta: 0,
        situacao: 'ABERTA' as const,
        formaPagamento: null,
      });
    }

    await prisma.contaPagar.createMany({
      data: contasPagar,
    });
  }

  async cancelar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    
    return prisma.pedidoCompra.update({
      where: { id },
      data: { situacao: 'CANCELADO' },
    });
  }

  private async verificarProprietario(id: string, empresaId: string) {
    const pedido = await prisma.pedidoCompra.findFirst({
      where: { id, empresaId },
    });

    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }
  }
}
