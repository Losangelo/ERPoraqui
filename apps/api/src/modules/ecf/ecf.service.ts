import { prisma } from '@/database/prisma.service';

export class ECFService {
  async listarECF(empresaId: string) {
    return prisma.eCF.findMany({
      where: { empresaId, ativo: true },
      orderBy: { identificacao: 'asc' },
    });
  }

  async criarECF(data: {
    identificacao: string;
    marca: string;
    modelo: string;
    numeroSerie: string;
    numeroFabricacao: string;
    versaoSB: string;
    dataInstalacao: Date;
    lojaId?: string;
  }, empresaId: string) {
    return prisma.eCF.create({
      data: {
        empresaId,
        identificacao: data.identificacao,
        marca: data.marca,
        modelo: data.modelo,
        numeroSerie: data.numeroSerie,
        numeroFabricacao: data.numeroFabricacao,
        versaoSB: data.versaoSB,
        dataInstalacao: data.dataInstalacao,
        lojaId: data.lojaId,
      },
    });
  }

  async buscarECF(id: string) {
    const ecf = await prisma.eCF.findUnique({
      where: { id },
      include: {
        reducoesZ: { orderBy: { dataMovimento: 'desc' }, take: 10 },
      },
    });
    if (!ecf) throw new Error('ECF não encontrado');
    return ecf;
  }

  async atualizarECF(id: string, data: Partial<{
    identificacao: string;
    marca: string;
    modelo: string;
    ativo: boolean;
  }>) {
    return prisma.eCF.update({
      where: { id },
      data,
    });
  }

  async excluirECF(id: string) {
    return prisma.eCF.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async listarReducoesZ(ecfId: string) {
    return prisma.reducaoZ.findMany({
      where: { ecfId },
      orderBy: { dataMovimento: 'desc' },
    });
  }

  async criarReducaoZ(ecfId: string, data: {
    dataMovimento: Date;
    numeroReducao: number;
    cro: number;
    crz: number;
    cooInicial: number;
    cooFinal: number;
    gtInicial: number;
    gtFinal: number;
    valorVendaBruta: number;
    valorTotalSuprimento: number;
    valorTotalSangria: number;
    valorBaseICMS: number;
    valorICMS: number;
    valorISS: number;
    valorPIS: number;
    valorCOFINS: number;
  }) {
    const lastReducao = await prisma.reducaoZ.findFirst({
      where: { ecfId },
      orderBy: { numeroReducao: 'desc' },
    });

    if (lastReducao && data.numeroReducao !== lastReducao.numeroReducao + 1) {
      throw new Error('Número da redução Z deve ser sequencial');
    }

    return prisma.reducaoZ.create({
      data: {
        ecfId,
        ...data,
      },
    });
  }

  async buscarReducaoZ(id: string) {
    const reducao = await prisma.reducaoZ.findUnique({
      where: { id },
    });
    if (!reducao) throw new Error('Redução Z não encontrada');
    return reducao;
  }

  async abrirCupom(ecfId: string, data: { itens?: any[] }, empresaId: string) {
    const ecf = await prisma.eCF.findUnique({ where: { id: ecfId } });
    if (!ecf) throw new Error('ECF não encontrado');

    const lastCupom = await prisma.cupom.findFirst({
      where: { ecfId },
      orderBy: { numeroCupom: 'desc' },
    });

    const nextCupom = (lastCupom?.numeroCupom || 0) + 1;
    const nextCOO = (lastCupom?.coo || 0) + 1;
    const nextCCF = (lastCupom?.ccf || 0) + 1;

    const cupom = await prisma.cupom.create({
      data: {
        ecfId,
        numeroCupom: nextCupom,
        coo: nextCOO,
        ccf: nextCCF,
        dataEmissao: new Date(),
        subtotal: 0,
        valorTotal: 0,
        formaPagamento: 'DINHEIRO',
        valorPagamento: 0,
        situacao: 'ABERTO',
      },
      include: { itens: true },
    });

    return cupom;
  }

  async adicionarItem(cupomId: string, data: {
    produtoId?: string;
    codigo: string;
    descricao: string;
    quantidade: number;
    unidadeMedida: string;
    valorUnitario: number;
    valorDesconto?: number;
    aliquotaICMS?: string;
  }) {
    const cupom = await prisma.cupom.findUnique({
      where: { id: cupomId },
      include: { itens: true },
    });

    if (!cupom) throw new Error('Cupom não encontrado');
    if (cupom.situacao !== 'ABERTO') throw new Error('Cupom já foi finalizado');

    const valorTotal = data.quantidade * data.valorUnitario - (data.valorDesconto || 0);

    const item = await prisma.itemCupom.create({
      data: {
        cupomId,
        produtoId: data.produtoId,
        codigo: data.codigo,
        descricao: data.descricao,
        quantidade: data.quantidade,
        unidadeMedida: data.unidadeMedida,
        valorUnitario: data.valorUnitario,
        valorTotal,
        valorDesconto: data.valorDesconto || 0,
        aliquotaICMS: data.aliquotaICMS,
      },
    });

    const subtotal = cupom.itens.reduce((sum, i) => sum + i.valorTotal, 0) + valorTotal;

    await prisma.cupom.update({
      where: { id: cupomId },
      data: { subtotal, valorTotal: subtotal },
    });

    return item;
  }

  async finalizarCupom(cupomId: string, data: {
    formaPagamento: string;
    valorPagamento: number;
    observacoes?: string;
  }) {
    const cupom = await prisma.cupom.findUnique({
      where: { id: cupomId },
      include: { itens: true },
    });

    if (!cupom) throw new Error('Cupom não encontrado');
    if (cupom.situacao !== 'ABERTO') throw new Error('Cupom já foi finalizado');
    if (cupom.itens.length === 0) throw new Error('Cupom sem itens');

    const valorTroco = data.valorPagamento - cupom.valorTotal;
    const hashCupom = this.gerarHashCupom(cupom);

    return prisma.cupom.update({
      where: { id: cupomId },
      data: {
        situacao: 'FINALIZADO',
        formaPagamento: data.formaPagamento as any,
        valorPagamento: data.valorPagamento,
        valorTroco: valorTroco > 0 ? valorTroco : 0,
        hashCupom,
        observacoes: data.observacoes,
      },
      include: { itens: true },
    });
  }

  async cancelarCupom(cupomId: string, data: { justificativa: string }) {
    const cupom = await prisma.cupom.findUnique({
      where: { id: cupomId },
    });

    if (!cupom) throw new Error('Cupom não encontrado');
    if (cupom.situacao !== 'FINALIZADO') throw new Error('Apenas cupons finalizados podem ser cancelados');

    return prisma.cupom.update({
      where: { id: cupomId },
      data: {
        situacao: 'CANCELADO',
        observacoes: `CANCELADO: ${data.justificativa}`,
      },
    });
  }

  async listarCupons(ecfId: string) {
    return prisma.cupom.findMany({
      where: { ecfId },
      orderBy: { dataEmissao: 'desc' },
      include: { itens: true },
    });
  }

  async criarSuprimento(ecfId: string, data: {
    valor: number;
    tipo: string;
    observacoes?: string;
  }) {
    return prisma.suprimento.create({
      data: {
        ecfId,
        dataMovimento: new Date(),
        valor: data.valor,
        tipo: data.tipo as any,
        observacoes: data.observacoes,
      },
    });
  }

  async criarSangria(ecfId: string, data: {
    valor: number;
    motivo: string;
    observacoes?: string;
  }) {
    return prisma.sangria.create({
      data: {
        ecfId,
        dataMovimento: new Date(),
        valor: data.valor,
        motivo: data.motivo,
        observacoes: data.observacoes,
      },
    });
  }

  private gerarHashCupom(cupom: any): string {
    const data = `${cupom.numeroCupom}${cupom.coo}${cupom.dataEmissao.toISOString()}${cupom.valorTotal}`;
    return btoa(data).slice(0, 32);
  }
}

export default new ECFService();
