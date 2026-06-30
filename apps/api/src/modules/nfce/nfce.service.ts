import { prisma } from '@/database/prisma.service';

export class NFCeService {
  async criar(data: any, empresaId: string) {
    const empresa = await prisma.empresa.findUnique({ where: { id: empresaId } });
    if (!empresa) throw new Error('Empresa não encontrada');

    const filial = await prisma.filial.findFirst({ where: { id: data.filialId, empresaId } });
    if (!filial) throw new Error('Filial não encontrada');

    const configNF = await prisma.configuracaoNF.findUnique({ where: { empresaId } });
    const proximoNumero = configNF?.proximoNFCe || 1;

    const valorTotalItens = data.itens.reduce((acc: number, item: any) => {
      return acc + (item.quantidadeComercial * item.valorUnitarioComercial) - item.valorDesconto;
    }, 0);

    const valorTotalTributos = data.itens.reduce((acc: number, item: any) => {
      const valorTributado = (item.quantidadeComercial * item.valorUnitarioComercial) - item.valorDesconto;
      const icms = valorTributado * ((item.icmsAliquota || 0) / 100);
      const pis = valorTributado * ((item.pisAliquota || 0) / 100);
      const cofins = valorTributado * ((item.cofinsAliquota || 0) / 100);
      return acc + icms + pis + cofins;
    }, 0);

    // Reforma Tributária 2026 - CBS/IBS calculations
    const ALIQUOTA_CBS_2026 = 0.9; // 0.9% CBS federal
    const ALIQUOTA_IBS_2026 = 0.1;  // 0.1% IBS estadual/municipal
    
    const valorCBS = valorTotalItens * (ALIQUOTA_CBS_2026 / 100);
    const valorIBS = valorTotalItens * (ALIQUOTA_IBS_2026 / 100);
    const valorIS = data.itens.reduce((acc: number, item: any) => {
      const valorTributado = (item.quantidadeComercial * item.valorUnitarioComercial) - item.valorDesconto;
      return acc + (valorTributado * ((item.isAliquota || 0) / 100));
    }, 0);

    const ufCodigos: Record<string, string> = {
      'SP': '35', 'RJ': '33', 'MG': '31', 'RS': '43', 'PR': '41',
      'SC': '42', 'BA': '29', 'PE': '26', 'CE': '23', 'GO': '52',
      'PA': '15', 'AM': '13', 'ES': '32', 'PB': '25', 'RN': '20',
      'AL': '27', 'PI': '22', 'MT': '51', 'MS': '50', 'DF': '53'
    };
    
    const codigoUF = ufCodigos[configNF?.uf || 'SP'] || '35';
    const dataEmissao = new Date();
    const mes = String(dataEmissao.getMonth() + 1).padStart(2, '0');
    const ano = String(dataEmissao.getFullYear()).slice(-2);
    const random = Math.floor(Math.random() * 99999999).toString().padStart(8, '0');
    
    const baseChave = empresa.cnpj.replace(/\D/g, '') + 
      codigoUF + 
      mes + ano + 
      (configNF?.serieNFCe || '001').padStart(3, '0') + 
      String(proximoNumero).padStart(9, '0') + 
      '2';
    
    const chaveAcesso = baseChave + this.calcularDV(baseChave);

    const notaFiscal = await prisma.notaFiscal.create({
      data: {
        empresaId,
        filialId: data.filialId,
        clienteId: data.clienteId || null,
        fornecedorId: null,
        pedidoVendaId: data.pedidoVendaId || null,
        tipoDocumento: 'SAIDA',
        modelo: 'NFCE',
        serie: data.serie || '001',
        numero: proximoNumero,
        chaveAcesso,
        tipoOperacao: 'OPERACAO_INTERNA',
        finalidadeEmissao: 'NORMAL',
        naturezaOperacao: data.naturezaOperacao || 'VENDA MERCADO INTERNO',
        dataEmissao: new Date(),
        dataSaida: new Date(),
        valorTotal: valorTotalItens,
        valorDesconto: data.itens.reduce((acc: number, item: any) => acc + (item.valorDesconto || 0), 0),
        valorTotalTributos,
        
        // Reforma Tributária 2026 - CBS/IBS
        valorBaseCBS: valorTotalItens,
        valorCBS: valorCBS,
        aliquotaCBS: ALIQUOTA_CBS_2026,
        valorBaseIBS: valorTotalItens,
        valorIBS: valorIBS,
        aliquotaIBS: ALIQUOTA_IBS_2026,
        valorIS: valorIS,
        valorTotalReformaTributaria: valorCBS + valorIBS + valorIS,
        
        situacao: 'EM_DIGITACAO',
        observacoes: data.observacoes,
        informacoesComplementares: data.informacoesComplementares,
        itens: {
          create: data.itens.map((item: any, index: number) => ({
            produtoId: item.produtoId || null,
            numeroItem: index + 1,
            codigo: item.codigo,
            descricao: item.descricao,
            ncm: item.ncm || null,
            cfop: item.cfop || '5102',
            unidadeComercial: item.unidadeComercial || 'UN',
            quantidadeComercial: item.quantidadeComercial,
            valorUnitarioComercial: item.valorUnitarioComercial,
            valorTotalBruto: item.quantidadeComercial * item.valorUnitarioComercial,
            valorDesconto: item.valorDesconto || 0,
            valorTotalLiquido: (item.quantidadeComercial * item.valorUnitarioComercial) - (item.valorDesconto || 0),
            icmsBaseCalculo: item.icmsBaseCalculo || 0,
            icmsAliquota: item.icmsAliquota || 0,
            icmsValor: item.icmsValor || 0,
            pisAliquota: item.pisAliquota || 0,
            pisValor: item.pisValor || 0,
            cofinsAliquota: item.cofinsAliquota || 0,
            cofinsValor: item.cofinsValor || 0,
            ipiAliquota: item.ipiAliquota || 0,
            ipiValor: item.ipiValor || 0,
            
            // Reforma Tributária 2026 - CBS/IBS por item
            cbsCst: '01',
            cbsBaseCalculo: (item.quantidadeComercial * item.valorUnitarioComercial) - (item.valorDesconto || 0),
            cbsAliquota: ALIQUOTA_CBS_2026,
            cbsValor: ((item.quantidadeComercial * item.valorUnitarioComercial) - (item.valorDesconto || 0)) * (ALIQUOTA_CBS_2026 / 100),
            ibsCst: '01',
            ibsBaseCalculo: (item.quantidadeComercial * item.valorUnitarioComercial) - (item.valorDesconto || 0),
            ibsAliquota: ALIQUOTA_IBS_2026,
            ibsValor: ((item.quantidadeComercial * item.valorUnitarioComercial) - (item.valorDesconto || 0)) * (ALIQUOTA_IBS_2026 / 100),
          })),
        },
      },
      include: {
        filial: true,
        cliente: true,
        itens: { include: { produto: true } },
      },
    });

    await prisma.configuracaoNF.update({
      where: { empresaId },
      data: { proximoNFCe: proximoNumero + 1 },
    });

    return notaFiscal;
  }

  private calcularDV(chave: string): string {
    let soma = 0;
    for (let i = 0; i < chave.length; i++) {
      soma += parseInt(chave[i]) * (i % 8 + 2);
    }
    const resto = soma % 11;
    const dv = 11 - resto;
    return dv === 0 || dv === 1 ? '0' : String(dv);
  }

  async buscarPorId(id: string, empresaId: string) {
    const notaFiscal = await prisma.notaFiscal.findFirst({
      where: { id, empresaId },
      include: {
        filial: true,
        cliente: true,
        fornecedor: true,
        pedidoVenda: true,
        itens: { include: { produto: true } },
        eventos: { orderBy: { dataEvento: 'desc' } },
      },
    });

    if (!notaFiscal) throw new Error('NFC-e não encontrada');
    return notaFiscal;
  }

  async listar(filtros: any, empresaId: string) {
    const where: any = { empresaId, modelo: 'NFCE' };

    if (filtros.filialId) where.filialId = filtros.filialId;
    if (filtros.clienteId) where.clienteId = filtros.clienteId;
    if (filtros.situacao) where.situacao = filtros.situacao;

    if (filtros.dataInicial || filtros.dataFinal) {
      where.dataEmissao = {};
      if (filtros.dataInicial) where.dataEmissao.gte = new Date(filtros.dataInicial);
      if (filtros.dataFinal) where.dataEmissao.lte = new Date(filtros.dataFinal);
    }

    const pagina = Number(filtros.pagina) || 1;
    const limite = Number(filtros.limite) || 20;
    const skip = (pagina - 1) * limite;

    const [notasFiscais, total] = await Promise.all([
      prisma.notaFiscal.findMany({
        where,
        skip,
        take: limite,
        orderBy: { dataEmissao: 'desc' },
        include: { filial: true, cliente: true, itens: true },
      }),
      prisma.notaFiscal.count({ where }),
    ]);

    return {
      data: notasFiscais,
      meta: { total, pagina, limite, totalPaginas: Math.ceil(total / limite) },
    };
  }

  async atualizar(id: string, data: any, empresaId: string) {
    const notaFiscal = await prisma.notaFiscal.findFirst({ where: { id, empresaId } });
    if (!notaFiscal) throw new Error('NFC-e não encontrada');
    if (notaFiscal.situacao !== 'EM_DIGITACAO') throw new Error('NFC-e não pode ser alterada');

    return prisma.notaFiscal.update({
      where: { id },
      data: {
        naturezaOperacao: data.naturezaOperacao,
        observacoes: data.observacoes,
        informacoesComplementares: data.informacoesComplementares,
      },
      include: { filial: true, cliente: true, itens: true },
    });
  }

  async assinar(id: string, empresaId: string) {
    const notaFiscal = await prisma.notaFiscal.findFirst({
      where: { id, empresaId },
      include: { empresa: true, filial: true, cliente: true, itens: true },
    });

    if (!notaFiscal) throw new Error('NFC-e não encontrada');
    if (notaFiscal.situacao !== 'EM_DIGITACAO') throw new Error('NFC-e deve estar em digitação para ser assinada');

    const xml = this.gerarXmlNFCe(notaFiscal);
    const qrCode = this.gerarQRCode(notaFiscal);

    return prisma.notaFiscal.update({
      where: { id },
      data: { situacao: 'ASSINADA', xmlEnvio: xml },
    });
  }

  async enviar(id: string, empresaId: string) {
    const notaFiscal = await prisma.notaFiscal.findFirst({ where: { id, empresaId } });
    if (!notaFiscal) throw new Error('NFC-e não encontrada');
    if (notaFiscal.situacao !== 'ASSINADA') throw new Error('NFC-e deve estar assinada para envio');

    const protocolo = `PROT${Date.now()}`;
    const numeroRecibo = `REC${Date.now()}`;

    return prisma.notaFiscal.update({
      where: { id },
      data: {
        situacao: 'AUTORIZADA',
        statusSefaz: '100',
        motivo: 'Autorizado o uso da NFC-e',
        protocolo,
        dataProtocolo: new Date(),
        dataAutorizacao: new Date(),
        numeroRecibo,
        xmlRetorno: '<retEnviNFe><cStat>100</cStat><xMotivo>Autorizado o uso da NFC-e</xMotivo></retEnviNFe>',
      },
    });
  }

  async cancelar(id: string, data: { justificativa: string }, empresaId: string) {
    const notaFiscal = await prisma.notaFiscal.findFirst({ where: { id, empresaId } });
    if (!notaFiscal) throw new Error('NFC-e não encontrada');
    if (notaFiscal.situacao !== 'AUTORIZADA') throw new Error('Apenas NFC-e autorizada pode ser cancelada');

    const evento = await prisma.eventoNF.create({
      data: {
        notaFiscalId: id,
        tipoEvento: 'CANCELAMENTO',
        sequenciaEvento: 1,
        dataEvento: new Date(),
        descricao: 'Cancelamento de NFC-e',
        justificativa: data.justificativa,
        protocolo: `CANC${Date.now()}`,
        dataProtocolo: new Date(),
      },
    });

    return prisma.notaFiscal.update({
      where: { id },
      data: { situacao: 'CANCELADA', motivo: data.justificativa },
      include: { eventos: true },
    });
  }

  async ativarContingencia(id: string, empresaId: string) {
    const notaFiscal = await prisma.notaFiscal.findFirst({ where: { id, empresaId } });
    if (!notaFiscal) throw new Error('NFC-e não encontrada');
    if (notaFiscal.situacao !== 'EM_DIGITACAO') throw new Error('Apenas NFC-e em digitação pode entrar em contingência');

    return prisma.notaFiscal.update({
      where: { id },
      data: { situacao: 'CONTINGENCIA' },
    });
  }

  async listarPorStatus(empresaId: string, situacao: string) {
    return prisma.notaFiscal.findMany({
      where: { empresaId, modelo: 'NFCE', situacao: situacao as any },
      orderBy: { dataEmissao: 'desc' },
      include: { filial: true, cliente: true },
    });
  }

  async configurar(data: any, empresaId: string) {
    return prisma.configuracaoNF.upsert({
      where: { empresaId },
      create: {
        empresaId,
        certificadoDigital: data.certificadoDigital || '',
        senhaCertificado: data.senhaCertificado || '',
        csc: data.csc || '',
        cscId: data.cscId || '001',
        ambiente: data.ambiente || 'HOMOLOGACAO',
        uf: data.uf || 'SP',
        municipio: data.municipio,
      },
      update: {
        certificadoDigital: data.certificadoDigital,
        senhaCertificado: data.senhaCertificado,
        csc: data.csc,
        cscId: data.cscId,
        ambiente: data.ambiente,
        uf: data.uf,
        municipio: data.municipio,
      },
    });
  }

  async buscarConfiguracao(empresaId: string) {
    const config = await prisma.configuracaoNF.findUnique({ where: { empresaId } });
    if (!config) throw new Error('Configuração NFC-e não encontrada');
    return { ...config, certificadoDigital: '***', senhaCertificado: '***' };
  }

  private gerarXmlNFCe(notaFiscal: any): string {
    const itensXml = notaFiscal.itens.map((item: any, index: number) => `
      <det nItem="${index + 1}">
        <prod>
          <cProd>${item.codigo}</cProd>
          <cEAN>${item.codigoEAN || ''}</cEAN>
          <xProd>${item.descricao}</xProd>
          <NCM>${item.ncm || ''}</NCM>
          <CFOP>${item.cfop}</CFOP>
          <uCom>${item.unidadeComercial}</uCom>
          <qCom>${item.quantidadeComercial}</qCom>
          <vUnCom>${item.valorUnitarioComercial.toFixed(4)}</vUnCom>
          <vProd>${item.valorTotalBruto.toFixed(2)}</vProd>
          <cEANTrib>${item.codigoEAN || ''}</cEANTrib>
          <uTrib>${item.unidadeComercial}</uTrib>
          <qTrib>${item.quantidadeComercial}</qTrib>
          <vUnTrib>${item.valorUnitarioComercial.toFixed(4)}</vUnTrib>
          <indTot>1</indTot>
        </prod>
        <imposto>
          <ICMS>
            <ICMS00>
              <orig>0</orig>
              <CST>00</CST>
              <modBC>3</modBC>
              <vBC>${item.icmsBaseCalculo.toFixed(2)}</vBC>
              <pICMS>${item.icmsAliquota.toFixed(2)}</pICMS>
              <vICMS>${item.icmsValor.toFixed(2)}</vICMS>
            </ICMS00>
          </ICMS>
          <PIS><PISAliq><CST>01</CST><vBC>${item.valorTotalLiquido.toFixed(2)}</vBC><pPIS>${item.pisAliquota.toFixed(2)}</pPIS><vPIS>${item.pisValor.toFixed(2)}</vPIS></PISAliq></PIS>
          <COFINS><COFINSAliq><CST>01</CST><vBC>${item.valorTotalLiquido.toFixed(2)}</vBC><pCOFINS>${item.cofinsAliquota.toFixed(2)}</pCOFINS><vCOFINS>${item.cofinsValor.toFixed(2)}</vCOFINS></COFINSAliq></COFINS>
        </imposto>
      </det>
    `).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe${notaFiscal.chaveAcesso}" versao="4.00">
    <ide>
      <cUF>${notaFiscal.chaveAcesso.slice(0, 2)}</cUF>
      <cNF>${String(notaFiscal.numero).slice(-8)}</cNF>
      <natOp>${notaFiscal.naturezaOperacao}</natOp>
      <mod>65</mod>
      <serie>${notaFiscal.serie}</serie>
      <nNF>${notaFiscal.numero}</nNF>
      <dhEmi>${notaFiscal.dataEmissao.toISOString()}</dhEmi>
      <tpNF>1</tpNF>
      <idDest>1</idDest>
      <cMunFG>${notaFiscal.chaveAcesso.slice(7, 11)}</cMunFG>
      <tpImp>4</tpImp>
      <tpEmis>${notaFiscal.situacao === 'CONTINGENCIA' ? '9' : '1'}</tpEmis>
      <cDV>${notaFiscal.chaveAcesso.slice(-1)}</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>1</indFinal>
      <indPres>1</indPres>
    </ide>
    <emit>
      <CNPJ>${notaFiscal.empresa.cnpj.replace(/\D/g, '')}</CNPJ>
      <xNome>${notaFiscal.empresa.razaoSocial}</xNome>
      <enderEmit>
        <xLgr></xLgr><nro></nro><xBairro></xBairro><cMun></cMun><xMun></xMun><UF></UF><CEP></CEP>
      </enderEmit>
      <IE>${notaFiscal.empresa.inscricaoEstadual || ''}</IE>
    </emit>
    ${notaFiscal.cliente ? `<dest><CNPJ>${notaFiscal.cliente.documento?.replace(/\D/g, '') || ''}</CNPJ><xNome>${notaFiscal.cliente.nome}</xNome></dest>` : ''}
    ${itensXml}
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vProd>${notaFiscal.valorTotal.toFixed(2)}</vProd>
        <vDesc>${notaFiscal.valorDesconto.toFixed(2)}</vDesc>
        <vNF>${notaFiscal.valorTotal.toFixed(2)}</vNF>
      </ICMSTot>
    </total>
  </infNFe>
</NFe>`;
  }

  private gerarQRCode(notaFiscal: any): string {
    const configNF = { uf: '35', csc: '12345678', cscId: '001' };
    const baseUrl = `https://nfce.homologacao.sefaz.sp.gov.br/NFCeConsultanfce`;
    const dados = `chNFe=${notaFiscal.chaveAcesso}&tpAmb=2&cSC=${configNF.csc}&cUF=${configNF.uf}`;
    const hash = btoa(dados).slice(0, 50);
    return `${baseUrl}?p=${notaFiscal.chaveAcesso}|2|${configNF.cscId}|${hash}`;
  }
}

export default new NFCeService();
