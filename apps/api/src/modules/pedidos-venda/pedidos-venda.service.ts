import { prisma } from '@/database/prisma.service';
import { 
  CriarPedidoVendaInput, 
  AtualizarPedidoVendaInput,
  PedidoVendaFiltro 
} from './dto/pedido-venda.dto';

export class PedidosVendaService {
  async criar(empresaId: string, dados: CriarPedidoVendaInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const { itens, ...pedidoData } = dados;

    const valorTotalItens = itens.reduce((total, item) => {
      const valorItem = item.quantidade * item.valorUnitario;
      const desconto = valorItem * (item.valorDesconto / 100);
      return total + (valorItem - desconto);
    }, 0);

    const valorTotal = valorTotalItens + pedidoData.valorFrete + pedidoData.valorOutrosAcrescimos - pedidoData.valorDesconto;

    return prisma.pedidoVenda.create({
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
        cliente: true,
        filial: true,
      },
    });
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.pedidoVenda.findFirst({
      where: { id, empresaId },
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
        cliente: true,
        filial: true,
      },
    });
  }

  async listar(empresaId: string, filtros: PedidoVendaFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const { clienteId, filialId, situacao, dataInicial, dataFinal, pagina, limite } = filtros;

    const where = {
      empresaId,
      ...(clienteId && { clienteId }),
      ...(filialId && { filialId }),
      ...(situacao && { situacao }),
      ...(dataInicial && dataFinal && {
        dataEmissao: {
          gte: dataInicial,
          lte: dataFinal,
        },
      }),
    };

    const [dados, total] = await Promise.all([
      prisma.pedidoVenda.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { dataCriacao: 'desc' },
        include: {
          cliente: {
            select: { id: true, nome: true, documento: true },
          },
          filial: {
            select: { id: true, nomeFantasia: true },
          },
          _count: {
            select: { itens: true },
          },
        },
      }),
      prisma.pedidoVenda.count({ where }),
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

  async atualizar(id: string, empresaId: string, dados: AtualizarPedidoVendaInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    
    const pedidoAtual = await prisma.pedidoVenda.findFirst({
      where: { id, empresaId },
    });

    if (!pedidoAtual) {
      throw new Error('Pedido não encontrado');
    }

    // Verificar se está alterando para confirmado
    const estaConfirmando = dados.situacao === 'CONFIRMADO' && pedidoAtual.situacao !== 'CONFIRMADO';
    
    const updatedPedido = await prisma.pedidoVenda.update({
      where: { id },
      data: dados,
      include: {
        itens: true,
        cliente: true,
        filial: true,
      },
    });

    // Gerar contas a receber automaticamente ao confirmar o pedido
    if (estaConfirmando) {
      const condicaoPagamento = dados.condicaoPagamento || pedidoAtual.condicaoPagamento || 'A_VISTA';
      
      if (condicaoPagamento !== 'A_VISTA') {
        await this.gerarContasReceber(updatedPedido, empresaId);
      }
    }

    return updatedPedido;
  }

  private async gerarContasReceber(pedido: any, empresaId: string) {
    const quantidadeParcelas = pedido.quantidadeParcelas || 1;
    const intervaloParcelas = pedido.intervaloParcelas || 30;
    const primeiraParcelaDias = pedido.primeiraParcelaDias || 0;
    const valorParcela = pedido.valorTotal / quantidadeParcelas;

    const contasReceber = [];

    for (let i = 0; i < quantidadeParcelas; i++) {
      const dataVencimento = new Date();
      dataVencimento.setDate(dataVencimento.getDate() + primeiraParcelaDias + (i * intervaloParcelas));

      contasReceber.push({
        empresaId,
        clienteId: pedido.clienteId,
        pedidoVendaId: pedido.id,
        numeroDocumento: `${pedido.numeroPedido}-${i + 1}`,
        numeroParcela: i + 1,
        totalParcelas: quantidadeParcelas,
        dataVencimento,
        dataEmissao: new Date(),
        valorOriginal: valorParcela,
        valorRecebido: 0,
        valorDesconto: 0,
        valorJuros: 0,
        valorMulta: 0,
        situacao: 'ABERTA' as const,
        formaPagamento: null,
      });
    }

    await prisma.contaReceber.createMany({
      data: contasReceber,
    });
  }

  async cancelar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    
    return prisma.pedidoVenda.update({
      where: { id },
      data: { situacao: 'CANCELADO' },
    });
  }

  async aprovar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    return prisma.pedidoVenda.update({
      where: { id },
      data: { situacao: 'CONFIRMADO' },
    });
  }

  async enviar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    return prisma.pedidoVenda.update({
      where: { id },
      data: { situacao: 'ENVIADO' },
    });
  }

  private async verificarProprietario(id: string, empresaId: string) {
    const pedido = await prisma.pedidoVenda.findFirst({
      where: { id, empresaId },
    });

    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }
  }
}
