import { prisma } from '@/database/prisma.service';
import appLogger from '@/shared/logger/logger';
import { 
  adicionarItemSchema, 
  finalizarVendaSchema, 
  criarOperadorSchema, 
  abrirCaixaSchema, 
  fecharCaixaSchema, 
  pdvFiltroSchema, 
  buscarProdutoSchema, 
  AdicionarItemInput, 
  FinalizarVendaInput, 
  CriarOperadorInput, 
  AbrirCaixaInput, 
  FecharCaixaInput, 
  PdvFiltro, 
  BuscarProdutoInput 
} from './dto/pdv.dto';

interface ItemCarrinho {
  produtoId: string;
  codigoBarras?: string;
  descricao: string;
  quantidade: number;
  unidadeMedida: string;
  valorUnitario: number;
  valorDesconto: number;
}

export class PdvService {
  private carrinhos: Map<string, ItemCarrinho[]> = new Map();

  async iniciarVenda(empresaId: string, filialId: string, operadorId?: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const filial = await prisma.filial.findFirst({
      where: { id: filialId, empresaId },
    });

    if (!filial) {
      throw new Error('Filial não encontrada');
    }

    const ultimaVenda = await prisma.vendaPDV.findFirst({
      where: { empresaId },
      orderBy: { numeroCupom: 'desc' },
    });

    const novoNumero = ultimaVenda
      ? String(parseInt(ultimaVenda.numeroCupom) + 1).padStart(6, '0')
      : '000001';

    const venda = await prisma.vendaPDV.create({
      data: {
        empresaId,
        filialId,
        operadorId,
        numeroCupom: novoNumero,
        subtotal: 0,
        valorTotal: 0,
        formaPagamento: 'DINHEIRO',
        valorPago: 0,
        situacao: 'ABERTA',
      },
    });

    this.carrinhos.set(venda.id, []);

    return { venda, itens: [] };
  }

  async adicionarItem(empresaId: string, vendaId: string, data: AdicionarItemInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const venda = await prisma.vendaPDV.findFirst({
      where: { id: vendaId, empresaId, situacao: 'ABERTA' },
    });

    if (!venda) {
      throw new Error('Venda não encontrada ou já finalizada');
    }

    const produto = await prisma.produto.findFirst({
      where: { id: data.produtoId, empresaId, ativo: true },
    });

    if (!produto) {
      throw new Error('Produto não encontrado ou inativo');
    }

    if (produto.quantidadeEstoque < data.quantidade) {
      throw new Error('Quantidade em estoque insuficiente');
    }

    const carrinho = this.carrinhos.get(vendaId) || [];
    
    const itemExistenteIndex = carrinho.findIndex(
      (item) => item.produtoId === data.produtoId,
    );

    if (itemExistenteIndex >= 0) {
      const novaQuantidade = carrinho[itemExistenteIndex].quantidade + data.quantidade;
      
      if (produto.quantidadeEstoque < novaQuantidade) {
        throw new Error('Quantidade total excede estoque disponível');
      }

      carrinho[itemExistenteIndex].quantidade = novaQuantidade;
      carrinho[itemExistenteIndex].valorDesconto += data.valorDesconto;
    } else {
      const item: ItemCarrinho = {
        produtoId: data.produtoId,
        codigoBarras: produto.codigoBarras || produto.gtin,
        descricao: produto.nome,
        quantidade: data.quantidade,
        unidadeMedida: produto.unidadeMedidaId?.simbolo || 'UN',
        valorUnitario: data.valorUnitario || produto.precoVenda,
        valorDesconto: data.valorDesconto,
      };
      carrinho.push(item);
    }

    this.carrinhos.set(vendaId, carrinho);

    return this.calcularTotais(vendaId, carrinho);
  }

  async removerItem(empresaId: string, vendaId: string, produtoId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const venda = await prisma.vendaPDV.findFirst({
      where: { id: vendaId, empresaId, situacao: 'ABERTA' },
    });

    if (!venda) {
      throw new Error('Venda não encontrada ou já finalizada');
    }

    const carrinho = this.carrinhos.get(vendaId) || [];
    const novoCarrinho = carrinho.filter((item) => item.produtoId !== produtoId);
    
    this.carrinhos.set(vendaId, novoCarrinho);

    return this.calcularTotais(vendaId, novoCarrinho);
  }

  async atualizarQuantidade(empresaId: string, vendaId: string, produtoId: string, quantidade: number) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const venda = await prisma.vendaPDV.findFirst({
      where: { id: vendaId, empresaId, situacao: 'ABERTA' },
    });

    if (!venda) {
      throw new Error('Venda não encontrada ou já finalizada');
    }

    const produto = await prisma.produto.findFirst({
      where: { id: produtoId, empresaId },
    });

    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    if (produto.quantidadeEstoque < quantidade) {
      throw new Error('Quantidade em estoque insuficiente');
    }

    const carrinho = this.carrinhos.get(vendaId) || [];
    const itemIndex = carrinho.findIndex((item) => item.produtoId === produtoId);

    if (itemIndex < 0) {
      throw new Error('Item não encontrado no carrinho');
    }

    if (quantidade <= 0) {
      carrinho.splice(itemIndex, 1);
    } else {
      carrinho[itemIndex].quantidade = quantidade;
    }

    this.carrinhos.set(vendaId, carrinho);

    return this.calcularTotais(vendaId, carrinho);
  }

  private async calcularTotais(vendaId: string, carrinho: ItemCarrinho[]) {
    const subtotal = carrinho.reduce((acc, item) => {
      return acc + (item.quantidade * item.valorUnitario);
    }, 0);

    const totalDesconto = carrinho.reduce((acc, item) => {
      return acc + item.valorDesconto;
    }, 0);

    const valorTotal = subtotal - totalDesconto;

    await prisma.vendaPDV.update({
      where: { id: vendaId },
      data: {
        subtotal,
        valorDesconto: totalDesconto,
        valorTotal,
      },
    });

    return {
      vendaId,
      itens: carrinho,
      subtotal,
      valorDesconto: totalDesconto,
      valorTotal,
    };
  }

  async finalizarVenda(empresaId: string, vendaId: string, data: FinalizarVendaInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const parsed = finalizarVendaSchema.parse(data);

    const venda = await prisma.vendaPDV.findFirst({
      where: { id: vendaId, empresaId, situacao: 'ABERTA' },
    });

    if (!venda) {
      throw new Error('Venda não encontrada ou já finalizada');
    }

    const carrinho = this.carrinhos.get(vendaId) || [];

    if (carrinho.length === 0) {
      throw new Error('Venda sem itens');
    }

    if (parsed.valorPago < venda.valorTotal) {
      throw new Error('Valor pago menor que o total da venda');
    }

    const valorTroco = parsed.valorPago - venda.valorTotal;

    const vendaFinalizada = await prisma.vendaPDV.update({
      where: { id: vendaId },
      data: {
        formaPagamento: parsed.formaPagamento,
        valorPago: parsed.valorPago,
        valorTroco,
        situacao: 'FINALIZADA',
        clienteId: parsed.clienteId || null,
        observacoes: parsed.observacoes,
        itens: {
          create: carrinho.map((item, index) => ({
            produtoId: item.produtoId,
            codigoBarras: item.codigoBarras,
            descricao: item.descricao,
            quantidade: item.quantidade,
            unidadeMedida: item.unidadeMedida,
            valorUnitario: item.valorUnitario,
            valorTotal: (item.quantidade * item.valorUnitario) - item.valorDesconto,
            valorDesconto: item.valorDesconto,
          })),
        },
      },
      include: {
        itens: { include: { produto: true } },
        cliente: true,
        operador: true,
      },
    });

    for (const item of carrinho) {
      await prisma.produto.update({
        where: { id: item.produtoId },
        data: { quantidadeEstoque: { decrement: item.quantidade } },
      });
    }

    this.carrinhos.delete(vendaId);

    appLogger.business('finalizar_venda_pdv', { empresaId, vendaId, valor: vendaFinalizada.valorTotal });
    return { venda: vendaFinalizada, troco: valorTroco };
  }

  async cancelarVenda(empresaId: string, vendaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const venda = await prisma.vendaPDV.findFirst({
      where: { id: vendaId, empresaId },
      include: { itens: true },
    });

    if (!venda) {
      throw new Error('Venda não encontrada');
    }

    if (venda.situacao === 'CANCELADA') {
      throw new Error('Venda já cancelada');
    }

    if (venda.situacao === 'ABERTA') {
      this.carrinhos.delete(vendaId);
    }

    if (venda.situacao === 'FINALIZADA') {
      for (const item of venda.itens) {
        await prisma.produto.update({
          where: { id: item.produtoId },
          data: { quantidadeEstoque: { increment: item.quantidade } },
        });
      }
    }

    const resultado = await prisma.vendaPDV.update({
      where: { id: vendaId },
      data: { situacao: 'CANCELADA' },
      include: { itens: true },
    });

    appLogger.business('cancelar_venda_pdv', { empresaId, vendaId });
    return resultado;
  }

  async buscarProdutos(empresaId: string, data: BuscarProdutoInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const parsed = buscarProdutoSchema.parse(data);

    const where: any = {
      empresaId,
      ativo: true,
      quantidadeEstoque: { gt: 0 },
    };

    if (parsed.termo) {
      where.OR = [
        { nome: { contains: parsed.termo, mode: 'insensitive' } },
        { codigoBarras: { contains: parsed.termo } },
        { gtin: { contains: parsed.termo } },
        { codigoInterno: { contains: parsed.termo } },
      ];
    }

    const skip = (parsed.pagina - 1) * parsed.limite;

    const [produtos, total] = await Promise.all([
      prisma.produto.findMany({
        where,
        skip,
        take: parsed.limite,
        orderBy: { nome: 'asc' },
        include: { categoria: true, unidadeMedida: true },
      }),
      prisma.produto.count({ where }),
    ]);

    return {
      data: produtos,
      meta: { total, pagina: parsed.pagina, limite: parsed.limite, totalPaginas: Math.ceil(total / parsed.limite) },
    };
  }

  async buscarPorCodigoBarras(empresaId: string, codigoBarras: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const produto = await prisma.produto.findFirst({
      where: {
        empresaId,
        ativo: true,
        OR: [{ codigoBarras }, { gtin: codigoBarras }],
      },
      include: { categoria: true, unidadeMedida: true },
    });

    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    return produto;
  }

  async criarOperador(empresaId: string, data: CriarOperadorInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const parsed = criarOperadorSchema.parse(data);

    const operadorExistente = await prisma.operadorPDV.findFirst({
      where: { empresaId, nome: parsed.nome },
    });

    if (operadorExistente) {
      throw new Error('Operador com este nome já existe');
    }

    return prisma.operadorPDV.create({
      data: { empresaId, nome: parsed.nome, pin: parsed.pin },
    });
  }

  async listarOperadores(empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    return prisma.operadorPDV.findMany({
      where: { empresaId, ativo: true },
      orderBy: { nome: 'asc' },
    });
  }

  async autenticarOperador(empresaId: string, nome: string, pin: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const operador = await prisma.operadorPDV.findFirst({
      where: { empresaId, nome, pin, ativo: true },
    });

    if (!operador) {
      throw new Error('Operador ou PIN inválidos');
    }

    return operador;
  }

  async abrirCaixa(empresaId: string, data: AbrirCaixaInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const parsed = abrirCaixaSchema.parse(data);

    const operador = await prisma.operadorPDV.findFirst({
      where: { id: parsed.operadorId, empresaId, ativo: true },
    });

    if (!operador) {
      throw new Error('Operador não encontrado');
    }

    const caixaAberto = await prisma.caixa.findFirst({
      where: { filialId: parsed.filialId, situacao: 'ABERTO' },
    });

    if (caixaAberto) {
      throw new Error('Já existe um caixa aberto para esta filial');
    }

    return prisma.caixa.create({
      data: {
        empresaId,
        filialId: parsed.filialId,
        operadorId: parsed.operadorId,
        dataAbertura: new Date(),
        saldoInicial: parsed.saldoInicial,
        totalEntradas: 0,
        totalSaidas: 0,
        situacao: 'ABERTO',
      },
      include: { operador: true, filial: true },
    });
  }

  async fecharCaixa(empresaId: string, caixaId: string, data: FecharCaixaInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const parsed = fecharCaixaSchema.parse(data);

    const caixa = await prisma.caixa.findFirst({
      where: { id: caixaId, empresaId, situacao: 'ABERTO' },
      include: { operador: true },
    });

    if (!caixa) {
      throw new Error('Caixa não encontrado ou já fechado');
    }

    const vendasDoCaixa = await prisma.vendaPDV.findMany({
      where: {
        filialId: caixa.filialId,
        situacao: 'FINALIZADA',
        dataVenda: { gte: caixa.dataAbertura },
      },
    });

    const totalEntradas = vendasDoCaixa.reduce((acc, v) => acc + v.valorTotal, 0);
    const saldoFinal = caixa.saldoInicial + totalEntradas;

    return prisma.caixa.update({
      where: { id: caixaId },
      data: {
        dataFechamento: new Date(),
        saldoFinal,
        totalEntradas,
        situacao: 'FECHADO',
        observacoes: parsed.observacoes,
      },
      include: { operador: true, filial: true },
    });
  }

  async buscarCaixaAberto(empresaId: string, filialId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const caixa = await prisma.caixa.findFirst({
      where: { filialId, empresaId, situacao: 'ABERTO' },
      include: { operador: true, filial: true },
    });

    if (!caixa) {
      throw new Error('Nenhum caixa aberto nesta filial');
    }

    return caixa;
  }

  async listarVendas(empresaId: string, filtros: PdvFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const parsed = pdvFiltroSchema.parse(filtros);

    const where: any = { empresaId };

    if (parsed.filialId) where.filialId = parsed.filialId;
    if (parsed.operadorId) where.operadorId = parsed.operadorId;
    if (parsed.clienteId) where.clienteId = parsed.clienteId;
    if (parsed.formaPagamento) where.formaPagamento = parsed.formaPagamento;
    if (parsed.situacao) where.situacao = parsed.situacao;

    if (parsed.dataInicial || parsed.dataFinal) {
      where.dataVenda = {};
      if (parsed.dataInicial) where.dataVenda.gte = parsed.dataInicial;
      if (parsed.dataFinal) where.dataVenda.lte = parsed.dataFinal;
    }

    const skip = (parsed.pagina - 1) * parsed.limite;

    const [vendas, total] = await Promise.all([
      prisma.vendaPDV.findMany({
        where,
        skip,
        take: parsed.limite,
        orderBy: { dataVenda: 'desc' },
        include: {
          cliente: true,
          operador: true,
          filial: true,
          itens: { include: { produto: true } },
        },
      }),
      prisma.vendaPDV.count({ where }),
    ]);

    return {
      data: vendas,
      meta: { total, pagina: parsed.pagina, limite: parsed.limite, totalPaginas: Math.ceil(total / parsed.limite) },
    };
  }

  async buscarVenda(empresaId: string, vendaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const venda = await prisma.vendaPDV.findFirst({
      where: { id: vendaId, empresaId },
      include: {
        cliente: true,
        operador: true,
        filial: true,
        itens: { include: { produto: true } },
      },
    });

    if (!venda) {
      throw new Error('Venda não encontrada');
    }

    return venda;
  }
}
