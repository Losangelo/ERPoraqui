import { prisma } from '@/database/prisma.service';
import { GerarSpedFiscalInput, SpedFiscalFiltro, SpedConfigInput } from './dto/sped-fiscal.dto';

interface SpedBlockInfo {
  id: string;
  nome: string;
  descricao: string;
  status: 'pronto' | 'parcial' | 'pendente';
  registros: number;
}

class SpedEngine {
  private blocks: Map<string, (params: any) => Promise<string[]>> = new Map();

  register(id: string, generator: (params: any) => Promise<string[]>) {
    this.blocks.set(id, generator);
  }

  async generate(blocos: string[], params: any): Promise<{ linhas: string[]; total: number }> {
    const linhas: string[] = [];
    for (const bloco of blocos) {
      const generator = this.blocks.get(bloco);
      if (generator) {
        const lines = await generator(params);
        linhas.push(...lines);
      }
    }
    return { linhas, total: linhas.length };
  }
}

export class SpedFiscalService {
  private engine = new SpedEngine();

  constructor() {
    this.registerBlocks();
  }

  private registerBlocks() {
    this.engine.register('0', this.gerarBloco0.bind(this));
    this.engine.register('C', this.gerarBlocoC.bind(this));
    this.engine.register('D', this.gerarBlocoD.bind(this));
    this.engine.register('E', this.gerarBlocoE.bind(this));
    this.engine.register('G', this.gerarBlocoG.bind(this));
    this.engine.register('H', this.gerarBlocoH.bind(this));
  }

  async gerarSpedFiscal(data: GerarSpedFiscalInput, empresaId: string) {
    const empresa = await prisma.empresa.findUnique({ where: { id: empresaId } });
    if (!empresa) throw new Error('Empresa não encontrada');

    const spedExistente = await prisma.spedFiscal.findFirst({
      where: { empresaId, periodoIni: data.periodoIni, periodoFin: data.periodoFin },
    });

    if (spedExistente && spedExistente.situacao === 'GERADO') {
      throw new Error('SPED Fiscal já gerado para este período');
    }

    const sped = await prisma.spedFiscal.upsert({
      where: spedExistente ? { id: spedExistente.id } : { id: '' },
      create: { empresaId, periodoIni: data.periodoIni, periodoFin: data.periodoFin, situacao: 'EM_GERACAO', observacoes: data.observacoes },
      update: { situacao: 'EM_GERACAO', observacoes: data.observacoes },
    });

    const config = await this.getConfig(empresaId);
    const blocosAtivos = data.blocos || (config?.blocosAtivos as string[]) || ['0', 'C'];

    const params = { empresa, empresaId, periodoIni: data.periodoIni, periodoFin: data.periodoFin, config };
    const { linhas, total } = await this.engine.generate(blocosAtivos, params);

    const arquivo = linhas.join('\r\n');

    await prisma.spedFiscal.update({
      where: { id: sped.id },
      data: { arquivo, totalRegistros: total, situacao: 'GERADO' },
    });

    return { id: sped.id, periodoIni: data.periodoIni, periodoFin: data.periodoFin, totalRegistros: total, situacao: 'GERADO' };
  }

  private async gerarBloco0(params: any): Promise<string[]> {
    const { empresa, config } = params;
    const linhas: string[] = [];
    const cnpj = empresa.cnpj?.replace(/\D/g, '') || '';
    const razao = (empresa.razaoSocial || '').padEnd(100).substring(0, 100);
    const dataAtual = new Date();
    const dataStr = `${String(dataAtual.getDate()).padStart(2, '0')}${String(dataAtual.getMonth() + 1).padStart(2, '0')}${dataAtual.getFullYear()}`;
    const horaStr = `${String(dataAtual.getHours()).padStart(2, '0')}${String(dataAtual.getMinutes()).padStart(2, '0')}${String(dataAtual.getSeconds()).padStart(2, '0')}`;
    const end = empresa.endereco ? (typeof empresa.endereco === 'string' ? JSON.parse(empresa.endereco) : empresa.endereco) : {};

    linhas.push(`|0000|0|${dataStr}|${horaStr}|${config?.finalidade || '1'}|SPED FISCAL - ERPoraqui|${cnpj}|${razao}|||${end.estado || 'SP'}|${end.cidade || ''}|||${cnpj}|`);
    linhas.push('|0001|0|');
    linhas.push(`|0035|00|`);

    const clientes = await prisma.cliente.findMany({ where: { empresaId: params.empresaId, ativo: true }, take: 500 });
    for (const c of clientes) {
      const doc = c.cpfCnpj?.replace(/\D/g, '') || '';
      const nome = (c.nome || '').padEnd(100).substring(0, 100);
      const endC = c.endereco ? (typeof c.endereco === 'string' ? JSON.parse(c.endereco) : c.endereco) : {};
      linhas.push(`|0150|${doc}|${doc.length > 11 ? 2 : 1}|${nome}|${endC.logradouro || ''}|${endC.numero || ''}||${endC.bairro || ''}||${endC.cep || ''}|${endC.cidade || ''}|${endC.estado || ''}|||`);
    }

    const fornecedores = await prisma.fornecedor.findMany({ where: { empresaId: params.empresaId, ativo: true }, take: 500 });
    for (const f of fornecedores) {
      const doc = f.cpfCnpj?.replace(/\D/g, '') || '';
      const nome = (f.nome || '').padEnd(100).substring(0, 100);
      linhas.push(`|0150|${doc}|${doc.length > 11 ? 2 : 1}|${nome}|||||||||||`);
    }

    const unidades = await prisma.unidadeMedida.findMany({ where: { empresaId: params.empresaId } });
    for (const u of unidades) {
      linhas.push(`|0190|${u.simbolo || 'UN'}|${(u.descricao || '').padEnd(20).substring(0, 20)}|`);
    }

    const produtos = await prisma.produto.findMany({ where: { empresaId: params.empresaId, ativo: true }, take: 1000 });
    for (const p of produtos) {
      const cod = (p.codigoInterno || p.id.substring(0, 20)).padEnd(20).substring(0, 20);
      const nome = (p.nome || '').padEnd(100).substring(0, 100);
      const ncm = p.NCM || '00000000';
      linhas.push(`|0200|${cod}|${nome}|||${ncm}|${p.codigoBarras || ''}||${p.unidadeVenda || 'UN'}|`);
    }

    if (config?.cnpjContador) {
      linhas.push(`|0100|${config.cnpjContador}|${(config.contatoContador || '').padEnd(100).substring(0, 100)}||`);
    } else {
      linhas.push('|0100||Contabil Padrao||||');
    }

    linhas.push(`|0990|${linhas.length + 1}|`);
    return linhas;
  }

  private async gerarBlocoC(params: any): Promise<string[]> {
    const linhas: string[] = [];
    linhas.push('|C001|0|');

    const notas = await prisma.notaFiscal.findMany({
      where: {
        empresaId: params.empresaId,
        dataEmissao: { gte: params.periodoIni, lte: params.periodoFin },
        situacao: 'AUTORIZADA',
      },
      include: { itens: true },
      orderBy: { dataEmissao: 'asc' },
      take: 2000,
    });

    for (const nf of notas) {
      const cnpjDest = nf.cliente?.cpfCnpj?.replace(/\D/g, '') || nf.fornecedor?.cpfCnpj?.replace(/\D/g, '') || '';
      const modelo = String(nf.modelo || '55');
      const serie = String(nf.serie || '1');
      const numero = String(nf.numero || '0');
      const dataEmi = nf.dataEmissao ? `${String(nf.dataEmissao.getDate()).padStart(2, '0')}${String(nf.dataEmissao.getMonth() + 1).padStart(2, '0')}${nf.dataEmissao.getFullYear()}` : '';
      const valorTotal = Number(nf.valorTotal || 0).toFixed(2);
      const cfop = nf.cfop || '5102';
      const natOp = nf.naturezaOperacao || 'VENDA';

      linhas.push(`|C100|0|${modelo}|${serie}|${numero}|${dataEmi}|${dataEmi}||${cnpjDest}|${1}|${cnpjDest}|${cfop}|${natOp}|${''}|${''}|${''}|${''}|${''}|${''}|${''}|${''}|${valorTotal}|`);

      if (nf.itens && nf.itens.length > 0) {
        for (const item of nf.itens) {
          const codProd = (item.codigoProduto || item.produtoId || '').padEnd(20).substring(0, 20);
          const qtd = Number(item.quantidade || 1).toFixed(2);
          const vUnit = Number(item.valorUnitario || 0).toFixed(2);
          const vTotal = Number(item.valorTotal || 0).toFixed(2);
          const vDesc = Number(item.valorDesconto || 0).toFixed(2);
          const vBCIcms = Number(item.baseICMS || 0).toFixed(2);
          const vIcms = Number(item.valorICMS || 0).toFixed(2);
          const aliqIcms = Number(item.aliquotaICMS || 0).toFixed(2);
          const cst = item.CST || '00';

          linhas.push(`|C170|1|${codProd}|${qtd}|${vUnit}|${vTotal}|${vDesc}|${vBCIcms}|${vIcms}|${aliqIcms}|${cst}|`);
        }
      }

      const resumoKey = `${cfop}_${nf.itens?.[0]?.CST || '00'}`;
      const vBC = nf.itens?.reduce((a, i) => a + Number(i.baseICMS || 0), 0) || 0;
      const vICMS = nf.itens?.reduce((a, i) => a + Number(i.valorICMS || 0), 0) || 0;
      linhas.push(`|C190|0|${nf.itens?.[0]?.CST || '00'}|${cfop}|${vBC.toFixed(2)}|${vICMS.toFixed(2)}|`);
    }

    linhas.push(`|C990|${linhas.length + 1}|`);
    return linhas;
  }

  private async gerarBlocoD(params: any): Promise<string[]> {
    const linhas: string[] = [];
    linhas.push('|D001|0|');

    const notasServico = await prisma.notaServico.findMany({
      where: {
        empresaId: params.empresaId,
        dataEmissao: { gte: params.periodoIni, lte: params.periodoFin },
        situacao: 'AUTORIZADA',
      },
      take: 500,
    });

    for (const ns of notasServico) {
      const dataEmi = ns.dataEmissao ? `${String(ns.dataEmissao.getDate()).padStart(2, '0')}${String(ns.dataEmissao.getMonth() + 1).padStart(2, '0')}${ns.dataEmissao.getFullYear()}` : '';
      const valor = Number(ns.valorTotal || 0).toFixed(2);
      const iss = Number(ns.valorISS || 0).toFixed(2);

      linhas.push(`|D100|0|${ns.numero || ''}|${dataEmi}|${valor}|${iss}|${ns.codigoServico || ''}|`);
    }

    linhas.push(`|D990|${linhas.length + 1}|`);
    return linhas;
  }

  private async gerarBlocoE(params: any): Promise<string[]> {
    const linhas: string[] = [];
    linhas.push('|E001|0|');

    const apuracao = await prisma.spedApuracao.findFirst({
      where: {
        empresaId: params.empresaId,
        periodo: { gte: params.periodoIni, lte: params.periodoFin },
        tipo: 'ICMS',
      },
    });

    if (apuracao) {
      linhas.push(`|E100|${apuracao.periodo.getMonth() + 1}${apuracao.periodo.getFullYear()}|${Number(apuracao.saldoAnterior).toFixed(2)}|`);
      linhas.push(`|E110|${Number(apuracao.debitos).toFixed(2)}|${Number(apuracao.creditos).toFixed(2)}|${Number(apuracao.saldoFinal).toFixed(2)}|`);
    } else {
      const mes = String(params.periodoIni.getMonth() + 1).padStart(2, '0');
      const ano = params.periodoIni.getFullYear();
      linhas.push(`|E100|${mes}${ano}|0.00|`);
      linhas.push(`|E110|0.00|0.00|0.00|`);
    }

    linhas.push(`|E990|${linhas.length + 1}|`);
    return linhas;
  }

  private async gerarBlocoG(params: any): Promise<string[]> {
    const linhas: string[] = [];
    linhas.push('|G001|0|');
    linhas.push('|G110|0|0.00|');
    linhas.push(`|G990|${linhas.length + 1}|`);
    return linhas;
  }

  private async gerarBlocoH(params: any): Promise<string[]> {
    const linhas: string[] = [];
    linhas.push('|H001|0|');

    const produtos = await prisma.produto.findMany({
      where: { empresaId: params.empresaId, ativo: true },
      select: { codigoInterno: true, nome: true, NCM: true, unidadeVenda: true, quantidadeEstoque: true, precoCusto: true },
      take: 2000,
    });

    for (const p of produtos) {
      const cod = (p.codigoInterno || '').padEnd(20).substring(0, 20);
      const qtd = Number(p.quantidadeEstoque || 0).toFixed(2);
      const vCusto = Number(p.precoCusto || 0).toFixed(2);
      linhas.push(`|H010|${cod}|${qtd}|${p.unidadeVenda || 'UN'}||${vCusto}|${p.NCM || '00000000'}|`);
    }

    linhas.push(`|H990|${linhas.length + 1}|`);
    return linhas;
  }

  // --- Config ---

  async getConfig(empresaId: string) {
    return prisma.spedConfig.findUnique({ where: { empresaId } });
  }

  async updateConfig(empresaId: string, data: SpedConfigInput) {
    return prisma.spedConfig.upsert({
      where: { empresaId },
      create: { empresaId, ...data },
      update: data,
    });
  }

  listarBlocos(): SpedBlockInfo[] {
    return [
      { id: '0', nome: 'Bloco 0', descricao: 'Abertura e identificação', status: 'pronto', registros: 7 },
      { id: 'C', nome: 'Bloco C', descricao: 'Documentos fiscais ICMS/IPI', status: 'parcial', registros: 8 },
      { id: 'D', nome: 'Bloco D', descricao: 'Documentos fiscais serviço', status: 'parcial', registros: 4 },
      { id: 'E', nome: 'Bloco E', descricao: 'Apuração ICMS/IPI', status: 'parcial', registros: 4 },
      { id: 'G', nome: 'Bloco G', descricao: 'Controle crédito ICMS', status: 'parcial', registros: 3 },
      { id: 'H', nome: 'Bloco H', descricao: 'Inventário', status: 'parcial', registros: 4 },
    ];
  }

  // --- CRUD ---

  async listar(filtros: SpedFiscalFiltro, empresaId: string) {
    const where: any = { empresaId };
    if (filtros.periodoIni) where.periodoIni = { gte: filtros.periodoIni };
    if (filtros.periodoFin) where.periodoFin = { lte: filtros.periodoFin };
    if (filtros.situacao) where.situacao = filtros.situacao;

    const skip = (filtros.pagina - 1) * filtros.limite;
    const [speds, total] = await Promise.all([
      prisma.spedFiscal.findMany({ where, skip, take: filtros.limite, orderBy: { periodoIni: 'desc' } }),
      prisma.spedFiscal.count({ where }),
    ]);

    return { data: speds, meta: { total, pagina: filtros.pagina, limite: filtros.limite, totalPaginas: Math.ceil(total / filtros.limite) } };
  }

  async buscarPorId(id: string, empresaId: string) {
    const sped = await prisma.spedFiscal.findFirst({ where: { id, empresaId } });
    if (!sped) throw new Error('SPED não encontrado');
    return sped;
  }

  async download(id: string, empresaId: string) {
    const sped = await prisma.spedFiscal.findFirst({ where: { id, empresaId } });
    if (!sped) throw new Error('SPED não encontrado');
    if (!sped.arquivo) throw new Error('SPED ainda não foi gerado');
    return {
      arquivo: sped.arquivo,
      nome: `SPED_FISCAL_${sped.periodoIni.toISOString().slice(0, 7).replace('-', '')}_${empresaId}.txt`,
      totalRegistros: sped.totalRegistros,
    };
  }
}
