import { prisma } from '@/database/prisma.service';
import { gerarSpedFiscalSchema, gerarSpedContribuicoesSchema, spedFiscalFiltroSchema, GerarSpedFiscalInput, GerarSpedContribuicoesInput, SpedFiscalFiltro } from './dto/sped-fiscal.dto';


export class SpedFiscalService {
  constructor(prisma) {}

  async gerarSpedFiscal(data: GerarSpedFiscalInput, empresaId: string) {
    const parsed = gerarSpedFiscalSchema.parse(data);

    const empresa = await prisma.empresa.findUnique({ where: { id: empresaId } });
    if (!empresa) throw new Error('Empresa não encontrada');

    const spedExistente = await prisma.spedFiscal.findFirst({
      where: {
        empresaId,
        periodoIni: parsed.periodoIni,
        periodoFin: parsed.periodoFin,
      },
    });

    if (spedExistente && spedExistente.situacao === 'GERADO') {
      throw new Error('SPED Fiscal já gerado para este período');
    }

    const sped = await prisma.spedFiscal.upsert({
      where: spedExistente ? { id: spedExistente.id } : { id: '' },
      create: {
        empresaId,
        periodoIni: parsed.periodoIni,
        periodoFin: parsed.periodoFin,
        situacao: 'EM_GERACAO',
        observacoes: parsed.observacoes,
      },
      update: {
        situacao: 'EM_GERACAO',
        observacoes: parsed.observacoes,
      },
    });

    const notasFiscais = await prisma.notaFiscal.findMany({
      where: {
        empresaId,
        dataEmissao: {
          gte: parsed.periodoIni,
          lte: parsed.periodoFin,
        },
        situacao: 'AUTORIZADA',
      },
      include: {
        cliente: true,
        fornecedor: true,
        itens: true,
      },
      orderBy: { dataEmissao: 'asc' },
    });

    const registros: string[] = [];
    let contador = 0;

    const dataAtual = new Date();
    const dataStr = `${dataAtual.getDate().toString().padStart(2, '0')}${String(dataAtual.getMonth() + 1).padStart(2, '0')}${dataAtual.getFullYear()}`;
    const horaStr = `${dataAtual.getHours().toString().padStart(2, '0')}${dataAtual.getMinutes().toString().padStart(2, '0')}${dataAtual.getSeconds().toString().padStart(2, '0')}`;

    registros.push(this.gerarRegistro0000(empresa, parsed, dataStr, horaStr));
    contador++;

    registros.push(this.gerarRegistro0001());
    contador++;

    const municipios = new Set<string>();
    notasFiscais.forEach(nf => {
      if (nf.cliente?.endereco) {
        const end = typeof nf.cliente.endereco === 'string' ? JSON.parse(nf.cliente.endereco) : nf.cliente.endereco;
        if (end.cidade) municipios.add(end.cidade);
      }
    });

    registros.push(this.gerarRegistro0035());
    contador++;

    const notasPorCliente = new Map<string, typeof notasFiscais>();
    notasFiscais.forEach(nf => {
      const key = nf.clienteId || 'SEM_CLIENTE';
      if (!notasPorCliente.has(key)) {
        notasPorCliente.set(key, []);
      }
      notasPorCliente.get(key)!.push(nf);
    });

    registros.push(this.gerarRegistro0100());
    contador++;

    const saldoInicial = await this.calcularSaldoInicial(empresaId, parsed.periodoIni);
    registros.push(this.gerarRegistro0990(saldoInicial + contador + 1));
    contador = saldoInicial + contador + 1;

    const arquivo = registros.join('\r\n');

    const totalRegistros = contador;

    await prisma.spedFiscal.update({
      where: { id: sped.id },
      data: {
        arquivo,
        totalRegistros,
        situacao: 'GERADO',
      },
    });

    return {
      id: sped.id,
      periodoIni: parsed.periodoIni,
      periodoFin: parsed.periodoFin,
      totalRegistros,
      situacao: 'GERADO',
    };
  }

  private gerarRegistro0000(empresa: any, data: GerarSpedFiscalInput, dataStr: string, horaStr: string): string {
    const cnpj = empresa.cnpj.replace(/\D/g, '');
    const nome = empresa.razaoSocial.padEnd(100).substring(0, 100);
    const endereco = empresa.endereco || {};
    const enderecoStr = typeof endereco === 'string' ? JSON.parse(endereco) : endereco;
    
    return `|0000|0|${dataStr}|${horaStr}|1|RELAÇÃO de Mercadorias e Serviços|${cnpj}|${nome}|||${enderecoStr.estado || 'SP'}|${enderecoStr.cidade || 'São Paulo'}|||0||`;
  }

  private gerarRegistro0001(): string {
    return '|0001|0|';
  }

  private gerarRegistro0035(): string {
    return '|0035|00|';
  }

  private gerarRegistro0100(): string {
    const cnpj = '00000000000000';
    const cpf = '';
    const nome = 'CONTABIL'.padEnd(100).substring(0, 100);
    return `|0100|${cpf}|${nome}|${cnpj}|01|01|${'CONTABIL'}|`;
  }

  private gerarRegistro0990(total: number): string {
    return `|0990|${total}|`;
  }

  private async calcularSaldoInicial(empresaId: string, periodoIni: Date): Promise<number> {
    return 0;
  }

  async gerarSpedContribuicoes(data: GerarSpedContribuicoesInput, empresaId: string) {
    const parsed = gerarSpedContribuicoesSchema.parse(data);

    const empresa = await prisma.empresa.findUnique({ where: { id: empresaId } });
    if (!empresa) throw new Error('Empresa não encontrada');

    const sped = await prisma.spedContribuicoes.create({
      data: {
        empresaId,
        periodoIni: parsed.periodoIni,
        periodoFin: parsed.periodoFin,
        situacao: 'EM_GERACAO',
        observacoes: parsed.observacoes,
      },
    });

    const notasFiscais = await prisma.notaFiscal.findMany({
      where: {
        empresaId,
        dataEmissao: {
          gte: parsed.periodoIni,
          lte: parsed.periodoFin,
        },
        situacao: 'AUTORIZADA',
      },
      include: {
        itens: true,
      },
    });

    const registros: string[] = [];
    let contador = 0;

    registros.push(this.gerarRegistro0000Contribuicoes(empresa, parsed));
    contador++;

    registros.push('|0001|0|');
    contador++;

    const totalReceita = notasFiscais.reduce((acc, nf) => acc + nf.valorTotal, 0);
    const totalPis = notasFiscais.reduce((acc, nf) => acc + nf.valorPIS, 0);
    const totalCofins = notasFiscais.reduce((acc, nf) => acc + nf.valorCOFINS, 0);

    registros.push(this.gerarRegistro0110(totalReceita, totalPis, totalCofins));
    contador++;

    registros.push(this.gerarRegistro0990(contador + 1));
    contador++;

    const arquivo = registros.join('\r\n');

    await prisma.spedContribuicoes.update({
      where: { id: sped.id },
      data: {
        arquivo,
        totalRegistros: contador,
        situacao: 'GERADO',
      },
    });

    return {
      id: sped.id,
      periodoIni: parsed.periodoIni,
      periodoFin: parsed.periodoFin,
      totalRegistros: contador,
      situacao: 'GERADO',
    };
  }

  private gerarRegistro0000Contribuicoes(empresa: any, data: GerarSpedContribuicoesInput): string {
    const cnpj = empresa.cnpj.replace(/\D/g, '');
    const mesIni = String(data.periodoIni.getMonth() + 1).padStart(2, '0');
    const anoIni = String(data.periodoIni.getFullYear());
    const mesFin = String(data.periodoFin.getMonth() + 1).padStart(2, '0');
    const anoFin = String(data.periodoFin.getFullYear());
    
    return `|0000|${mesIni}${anoIni}|${mesFin}${anoFin}|${cnpj}|${empresa.razaoSocial.substring(0, 100).padEnd(100)}|1|1|||`;
  }

  private gerarRegistro0110(receita: number, pis: number, cofins: number): string {
    return `|0110|1|1|${receita.toFixed(2)}|${pis.toFixed(2)}|${cofins.toFixed(2)}|0.00|0.00|0.00|0.00|0.00||`;
  }

  async listar(filtros: SpedFiscalFiltro, empresaId: string) {
    const parsed = spedFiscalFiltroSchema.parse(filtros);

    const where: any = { empresaId };

    if (parsed.periodoIni) where.periodoIni = parsed.periodoIni;
    if (parsed.periodoFin) where.periodoFin = parsed.periodoFin;
    if (parsed.situacao) where.situacao = parsed.situacao;

    const skip = (parsed.pagina - 1) * parsed.limite;

    const [speds, total] = await Promise.all([
      prisma.spedFiscal.findMany({
        where,
        skip,
        take: parsed.limite,
        orderBy: { periodoIni: 'desc' },
      }),
      prisma.spedFiscal.count({ where }),
    ]);

    return {
      data: speds,
      meta: {
        total,
        pagina: parsed.pagina,
        limite: parsed.limite,
        totalPaginas: Math.ceil(total / parsed.limite),
      },
    };
  }

  async buscarPorId(id: string, empresaId: string) {
    const sped = await prisma.spedFiscal.findFirst({
      where: { id, empresaId },
    });

    if (!sped) throw new Error('SPED não encontrado');
    return sped;
  }

  async download(id: string, empresaId: string) {
    const sped = await prisma.spedFiscal.findFirst({
      where: { id, empresaId },
    });

    if (!sped) throw new Error('SPED não encontrado');

    if (!sped.arquivo) {
      throw new Error('SPED ainda não foi gerado');
    }

    return {
      arquivo: sped.arquivo,
      nome: `SPED_FISCAL_${sped.periodoIni.toISOString().slice(0, 7).replace('-', '')}_${empresaId}.txt`,
      totalRegistros: sped.totalRegistros,
    };
  }

  async listarContribuicoes(filtros: SpedFiscalFiltro, empresaId: string) {
    const parsed = spedFiscalFiltroSchema.parse(filtros);

    const where: any = { empresaId };

    if (parsed.periodoIni) where.periodoIni = parsed.periodoIni;
    if (parsed.periodoFin) where.periodoFin = parsed.periodoFin;
    if (parsed.situacao) where.situacao = parsed.situacao;

    const skip = (parsed.pagina - 1) * parsed.limite;

    const [speds, total] = await Promise.all([
      prisma.spedContribuicoes.findMany({
        where,
        skip,
        take: parsed.limite,
        orderBy: { periodoIni: 'desc' },
      }),
      prisma.spedContribuicoes.count({ where }),
    ]);

    return {
      data: speds,
      meta: {
        total,
        pagina: parsed.pagina,
        limite: parsed.limite,
        totalPaginas: Math.ceil(total / parsed.limite),
      },
    };
  }

  async downloadContribuicoes(id: string, empresaId: string) {
    const sped = await prisma.spedContribuicoes.findFirst({
      where: { id, empresaId },
    });

    if (!sped) throw new Error('SPED Contribuições não encontrado');

    if (!sped.arquivo) {
      throw new Error('SPED ainda não foi gerado');
    }

    return {
      arquivo: sped.arquivo,
      nome: `SPED_PISCOFINS_${sped.periodoIni.toISOString().slice(0, 7).replace('-', '')}_${empresaId}.txt`,
      totalRegistros: sped.totalRegistros,
    };
  }
}
