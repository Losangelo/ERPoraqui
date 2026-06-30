
import { prisma } from '@/database/prisma.service';
import { 
  criarContaReceberSchema, 
  receberContaSchema, 
  criarContaPagarSchema, 
  pagarContaSchema, 
  contaFiltroSchema,
  criarContaBancariaSchema,
  criarMovimentacaoBancariaSchema,
  conciliarMovimentacaoSchema,
  criarConciliacaoSchema,
  CriarContaReceberInput,
  ReceberContaInput,
  CriarContaPagarInput,
  PagarContaInput,
  ContaFiltro,
  CriarContaBancariaInput,
  CriarMovimentacaoBancariaInput,
  ConciliarMovimentacaoInput,
  CriarConciliacaoInput
} from './dto/financeiro.dto';


export class FinanceiroService {
  constructor(prisma) {}

  async criarContaReceber(data: CriarContaReceberInput, empresaId: string) {
    const parsed = criarContaReceberSchema.parse(data);

    const cliente = await prisma.cliente.findFirst({
      where: { id: parsed.clienteId, empresaId },
    });

    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    return prisma.contaReceber.create({
      data: {
        empresaId,
        clienteId: parsed.clienteId,
        pedidoVendaId: parsed.pedidoVendaId || null,
        numeroDocumento: parsed.numeroDocumento,
        numeroParcela: parsed.numeroParcela,
        totalParcelas: parsed.totalParcelas,
        dataVencimento: parsed.dataVencimento,
        valorOriginal: parsed.valorOriginal,
        formaPagamento: parsed.formaPagamento || null,
        observacoes: parsed.observacoes,
      },
      include: {
        cliente: true,
      },
    });
  }

  async listarContasReceber(filtros: ContaFiltro, empresaId: string) {
    const parsed = contaFiltroSchema.parse(filtros);

    const where: any = { empresaId };

    if (parsed.clienteId) where.clienteId = parsed.clienteId;
    if (parsed.situacao) where.situacao = parsed.situacao;

    if (parsed.dataInicial || parsed.dataFinal) {
      where.dataVencimento = {};
      if (parsed.dataInicial) where.dataVencimento.gte = parsed.dataInicial;
      if (parsed.dataFinal) where.dataVencimento.lte = parsed.dataFinal;
    }

    const skip = (parsed.pagina - 1) * parsed.limite;

    const [dados, total] = await Promise.all([
      prisma.contaReceber.findMany({
        where,
        skip,
        take: parsed.limite,
        orderBy: { dataVencimento: 'asc' },
        include: {
          cliente: { select: { id: true, nome: true, documento: true } },
        },
      }),
      prisma.contaReceber.count({ where }),
    ]);

    return {
      data: dados,
      meta: {
        total,
        pagina: parsed.pagina,
        limite: parsed.limite,
        totalPaginas: Math.ceil(total / parsed.limite),
      },
    };
  }

  async receberConta(id: string, data: ReceberContaInput, empresaId: string) {
    const parsed = receberContaSchema.parse(data);

    const conta = await prisma.contaReceber.findFirst({
      where: { id, empresaId },
    });

    if (!conta) {
      throw new Error('Conta não encontrada');
    }

    if (conta.situacao === 'PAGO') {
      throw new Error('Conta já recebida');
    }

    const valorRecebido = parsed.valorRecebido || conta.valorOriginal;
    const valorTotal = valorRecebido - parsed.valorDesconto + parsed.valorJuros + parsed.valorMulta;

    return prisma.contaReceber.update({
      where: { id },
      data: {
        valorRecebido: valorTotal,
        valorDesconto: parsed.valorDesconto,
        valorJuros: parsed.valorJuros,
        valorMulta: parsed.valorMulta,
        situacao: 'PAGO',
        formaPagamento: parsed.formaPagamento,
        dataRecebimento: parsed.dataRecebimento || new Date(),
      },
    });
  }

  async buscarContaReceber(id: string, empresaId: string) {
    const conta = await prisma.contaReceber.findFirst({
      where: { id, empresaId },
      include: {
        cliente: true,
        pedidoVenda: true,
      },
    });

    if (!conta) {
      throw new Error('Conta não encontrada');
    }

    return conta;
  }

  async atualizarContaReceber(id: string, data: any, empresaId: string) {
    const conta = await prisma.contaReceber.findFirst({
      where: { id, empresaId },
    });

    if (!conta) {
      throw new Error('Conta não encontrada');
    }

    return prisma.contaReceber.update({
      where: { id },
      data: {
        clienteId: data.clienteId || conta.clienteId,
        numeroDocumento: data.numeroDocumento || conta.numeroDocumento,
        dataVencimento: data.dataVencimento ? new Date(data.dataVencimento) : conta.dataVencimento,
        valorOriginal: data.valorOriginal || conta.valorOriginal,
        observacoes: data.observacoes !== undefined ? data.observacoes : conta.observacoes,
      },
      include: {
        cliente: true,
      },
    });
  }

  async excluirContaReceber(id: string, empresaId: string) {
    const conta = await prisma.contaReceber.findFirst({
      where: { id, empresaId },
    });

    if (!conta) {
      throw new Error('Conta não encontrada');
    }

    if (conta.situacao === 'PAGO') {
      throw new Error('Não é possível excluir uma conta já recebida');
    }

    return prisma.contaReceber.delete({
      where: { id },
    });
  }

  async criarContaPagar(data: CriarContaPagarInput, empresaId: string) {
    const parsed = criarContaPagarSchema.parse(data);

    const fornecedor = await prisma.fornecedor.findFirst({
      where: { id: parsed.fornecedorId, empresaId },
    });

    if (!fornecedor) {
      throw new Error('Fornecedor não encontrado');
    }

    return prisma.contaPagar.create({
      data: {
        empresaId,
        fornecedorId: parsed.fornecedorId,
        pedidoCompraId: parsed.pedidoCompraId || null,
        numeroDocumento: parsed.numeroDocumento,
        numeroParcela: parsed.numeroParcela,
        totalParcelas: parsed.totalParcelas,
        dataVencimento: parsed.dataVencimento,
        valorOriginal: parsed.valorOriginal,
        formaPagamento: parsed.formaPagamento || null,
        observacoes: parsed.observacoes,
      },
      include: {
        fornecedor: true,
      },
    });
  }

  async listarContasPagar(filtros: ContaFiltro, empresaId: string) {
    const parsed = contaFiltroSchema.parse(filtros);

    const where: any = { empresaId };

    if (parsed.fornecedorId) where.fornecedorId = parsed.fornecedorId;
    if (parsed.situacao) where.situacao = parsed.situacao;

    if (parsed.dataInicial || parsed.dataFinal) {
      where.dataVencimento = {};
      if (parsed.dataInicial) where.dataVencimento.gte = parsed.dataInicial;
      if (parsed.dataFinal) where.dataVencimento.lte = parsed.dataFinal;
    }

    const skip = (parsed.pagina - 1) * parsed.limite;

    const [dados, total] = await Promise.all([
      prisma.contaPagar.findMany({
        where,
        skip,
        take: parsed.limite,
        orderBy: { dataVencimento: 'asc' },
        include: {
          fornecedor: { select: { id: true, nome: true, documento: true } },
        },
      }),
      prisma.contaPagar.count({ where }),
    ]);

    return {
      data: dados,
      meta: {
        total,
        pagina: parsed.pagina,
        limite: parsed.limite,
        totalPaginas: Math.ceil(total / parsed.limite),
      },
    };
  }

  async pagarConta(id: string, data: PagarContaInput, empresaId: string) {
    const parsed = pagarContaSchema.parse(data);

    const conta = await prisma.contaPagar.findFirst({
      where: { id, empresaId },
    });

    if (!conta) {
      throw new Error('Conta não encontrada');
    }

    if (conta.situacao === 'PAGO') {
      throw new Error('Conta já paga');
    }

    const valorPago = parsed.valorPago || conta.valorOriginal;
    const valorTotal = valorPago - parsed.valorDesconto + parsed.valorJuros + parsed.valorMulta;

    return prisma.contaPagar.update({
      where: { id },
      data: {
        valorPago: valorTotal,
        valorDesconto: parsed.valorDesconto,
        valorJuros: parsed.valorJuros,
        valorMulta: parsed.valorMulta,
        situacao: 'PAGO',
        formaPagamento: parsed.formaPagamento,
        dataPagamento: parsed.dataPagamento || new Date(),
      },
    });
  }

  async buscarContaPagar(id: string, empresaId: string) {
    const conta = await prisma.contaPagar.findFirst({
      where: { id, empresaId },
      include: {
        fornecedor: true,
        pedidoCompra: true,
      },
    });

    if (!conta) {
      throw new Error('Conta não encontrada');
    }

    return conta;
  }

  async atualizarContaPagar(id: string, data: any, empresaId: string) {
    const conta = await prisma.contaPagar.findFirst({
      where: { id, empresaId },
    });

    if (!conta) {
      throw new Error('Conta não encontrada');
    }

    return prisma.contaPagar.update({
      where: { id },
      data: {
        fornecedorId: data.fornecedorId || conta.fornecedorId,
        numeroDocumento: data.numeroDocumento || conta.numeroDocumento,
        dataVencimento: data.dataVencimento ? new Date(data.dataVencimento) : conta.dataVencimento,
        valorOriginal: data.valorOriginal || conta.valorOriginal,
        observacoes: data.observacoes !== undefined ? data.observacoes : conta.observacoes,
      },
      include: {
        fornecedor: true,
      },
    });
  }

  async excluirContaPagar(id: string, empresaId: string) {
    const conta = await prisma.contaPagar.findFirst({
      where: { id, empresaId },
    });

    if (!conta) {
      throw new Error('Conta não encontrada');
    }

    if (conta.situacao === 'PAGO') {
      throw new Error('Não é possível excluir uma conta já paga');
    }

    return prisma.contaPagar.delete({
      where: { id },
    });
  }

  async dashboardFinanceiro(empresaId: string) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const [contasReceber, contasPagar] = await Promise.all([
      prisma.contaReceber.aggregate({
        where: { empresaId },
        _sum: { valorOriginal: true, valorRecebido: true },
        _count: true,
      }),
      prisma.contaPagar.aggregate({
        where: { empresaId },
        _sum: { valorOriginal: true, valorPago: true },
        _count: true,
      }),
    ]);

    const receberAbertas = await prisma.contaReceber.count({
      where: { empresaId, situacao: 'ABERTA' },
    });

    const pagarAbertas = await prisma.contaPagar.count({
      where: { empresaId, situacao: 'ABERTA' },
    });

    const receberVencidas = await prisma.contaReceber.count({
      where: { 
        empresaId, 
        situacao: { in: ['ABERTA', 'VENCIDO'] },
        dataVencimento: { lt: hoje },
      },
    });

    const pagarVencidas = await prisma.contaPagar.count({
      where: { 
        empresaId, 
        situacao: { in: ['ABERTA', 'VENCIDO'] },
        dataVencimento: { lt: hoje },
      },
    });

    return {
      totalReceber: Number(contasReceber._sum.valorOriginal || 0),
      totalRecebido: Number(contasReceber._sum.valorRecebido || 0),
      totalPagar: Number(contasPagar._sum.valorOriginal || 0),
      totalPago: Number(contasPagar._sum.valorPago || 0),
      receberAbertas,
      pagarAbertas,
      receberVencidas,
      pagarVencidas,
      saldo: Number(contasReceber._sum.valorRecebido || 0) - Number(contasPagar._sum.valorPago || 0),
    };
  }

  async criarContaBancaria(data: CriarContaBancariaInput, empresaId: string) {
    const parsed = criarContaBancariaSchema.parse(data);

    return prisma.contaBancaria.create({
      data: {
        empresaId,
        banco: parsed.banco,
        agencia: parsed.agencia,
        conta: parsed.conta,
        tipo: parsed.tipo,
        saldoInicial: parsed.saldoInicial,
        saldoAtual: parsed.saldoInicial,
      },
    });
  }

  async listarContasBancarias(empresaId: string) {
    return prisma.contaBancaria.findMany({
      where: { empresaId, ativo: true },
      orderBy: { banco: 'asc' },
    });
  }

  async criarMovimentacaoBancaria(data: CriarMovimentacaoBancariaInput, empresaId: string) {
    const parsed = criarMovimentacaoBancariaSchema.parse(data);

    const contaBancaria = await prisma.contaBancaria.findFirst({
      where: { id: parsed.contaBancariaId, empresaId },
    });

    if (!contaBancaria) {
      throw new Error('Conta bancária não encontrada');
    }

    const valorMovimentacao = parsed.tipo === 'CREDITO' 
      ? parsed.valor 
      : -parsed.valor;

    const [movimentacao] = await Promise.all([
      prisma.movimentacaoBancaria.create({
        data: {
          contaBancariaId: parsed.contaBancariaId,
          dataMovimentacao: parsed.dataMovimentacao,
          dataCompetencia: parsed.dataCompetencia || null,
          tipo: parsed.tipo,
          descricao: parsed.descricao,
          documento: parsed.documento || null,
          valor: parsed.valor,
        },
      }),
      prisma.contaBancaria.update({
        where: { id: parsed.contaBancariaId },
        data: {
          saldoAtual: { increment: valorMovimentacao },
        },
      }),
    ]);

    return movimentacao;
  }

  async listarMovimentacoesBancarias(contaBancariaId: string, empresaId: string) {
    const contaBancaria = await prisma.contaBancaria.findFirst({
      where: { id: contaBancariaId, empresaId },
    });

    if (!contaBancaria) {
      throw new Error('Conta bancária não encontrada');
    }

    return prisma.movimentacaoBancaria.findMany({
      where: { contaBancariaId },
      orderBy: { dataMovimentacao: 'desc' },
    });
  }

  async criarConciliacao(data: CriarConciliacaoInput, empresaId: string) {
    const parsed = criarConciliacaoSchema.parse(data);

    const contaBancaria = await prisma.contaBancaria.findFirst({
      where: { id: parsed.contaBancariaId, empresaId },
    });

    if (!contaBancaria) {
      throw new Error('Conta bancária não encontrada');
    }

    const movimentacoes = await prisma.movimentacaoBancaria.findMany({
      where: {
        contaBancariaId: parsed.contaBancariaId,
        dataMovimentacao: {
          gte: parsed.periodoIni,
          lte: parsed.periodoFin,
        },
      },
    });

    const totalCreditos = movimentacoes
      .filter(m => m.tipo === 'CREDITO')
      .reduce((acc, m) => acc + m.valor, 0);

    const totalDebitos = movimentacoes
      .filter(m => m.tipo === 'DEBITO')
      .reduce((acc, m) => acc + m.valor, 0);

    const totalConciliado = movimentacoes
      .filter(m => m.conciliado)
      .reduce((acc, m) => acc + m.valor, 0);

    return prisma.conciliacao.create({
      data: {
        empresaId,
        contaBancariaId: parsed.contaBancariaId,
        periodoIni: parsed.periodoIni,
        periodoFin: parsed.periodoFin,
        observacoes: parsed.observacoes,
        totalCreditos,
        totalDebitos,
        totalConciliado,
        totalNaoConciliado: totalCreditos + totalDebitos - totalConciliado,
      },
    });
  }

  async conciliarMovimentacao(data: ConciliarMovimentacaoInput) {
    const parsed = conciliarMovimentacaoSchema.parse(data);

    return prisma.movimentacaoBancaria.update({
      where: { id: parsed.movimentacaoId },
      data: {
        conciliado: true,
        conciliacaoId: parsed.conciliacaoId,
      },
    });
  }

  async listarConciliacoes(contaBancariaId: string, empresaId: string) {
    return prisma.conciliacao.findMany({
      where: { empresaId, contaBancariaId },
      orderBy: { dataConciliacao: 'desc' },
    });
  }

  async removerConciliacaoMovimentacao(movimentacaoId: string) {
    return prisma.movimentacaoBancaria.update({
      where: { id: movimentacaoId },
      data: {
        conciliado: false,
        conciliacaoId: null,
      },
    });
  }
}
