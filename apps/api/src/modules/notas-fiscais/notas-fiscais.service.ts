import { prisma } from '@/database/prisma.service';
import { criarNotaFiscalSchema, atualizarNotaFiscalSchema, cancelarNotaFiscalSchema, cartaCorrecaoSchema, configurarCertificadoSchema, notaFiscalFiltroSchema, CriarNotaFiscalInput, AtualizarNotaFiscalInput, CancelarNotaFiscalInput, CartaCorrecaoInput, ConfigurarCertificadoInput, NotaFiscalFiltro } from './dto/nota-fiscal.dto';
import { tributosItem } from '@/shared/tributos';
import { gerarChaveAcesso, gerarCodigoNumerico, montarXMLCancelamento, montarXMLCartaCorrecao, montarXMLInutilizacao, assinarXML } from '@/shared/nfe-utils';
import { SefazClient, SefazConfig } from '@/shared/sefaz-client';

export class NotasFiscaisService {
  private async obterSefazClient(empresaId: string): Promise<SefazClient> {
    const configNF = await prisma.configuracaoNF.findUnique({ where: { empresaId } });
    if (!configNF?.certificadoDigital) throw new Error('Certificado digital não configurado');

    const config: SefazConfig = {
      uf: configNF.uf || 'SP',
      ambiente: (configNF.ambiente?.toLowerCase() as any) || 'homologacao',
      modelo: 'nfe',
      certificadoBase64: configNF.certificadoDigital,
      senhaCertificado: configNF.senhaCertificado,
    };
    return new SefazClient(config);
  }

  async criar(data: CriarNotaFiscalInput, empresaId: string) {
    const parsed = criarNotaFiscalSchema.parse(data);

    const empresa = await prisma.empresa.findUnique({ where: { id: empresaId } });
    if (!empresa) throw new Error('Empresa não encontrada');

    const filial = await prisma.filial.findFirst({ where: { id: parsed.filialId, empresaId } });
    if (!filial) throw new Error('Filial não encontrada');

    const configNF = await prisma.configuracaoNF.findUnique({ where: { empresaId } });
    const proximoNumero = parsed.modelo === 'NFCE'
      ? (configNF?.proximoNFCe || 1)
      : (configNF?.proximoNFe || 1);

    const chaveAcesso = gerarChaveAcesso({
      uf: configNF?.uf || 'SP',
      dataEmissao: new Date(),
      cnpj: empresa.cnpj,
      modelo: parsed.modelo === 'NFCE' ? '65' : '55',
      serie: parsed.serie,
      numero: proximoNumero,
      tipoEmissao: '1',
      codigoNumerico: gerarCodigoNumerico(),
    });

    let valorTotalItens = 0;
    let valorTotalDesconto = 0;
    let valorTotalTributos = 0;
    let valorTotalCBS = 0;
    let valorTotalIBS = 0;
    let valorTotalIS = 0;

    const itensCalculados = parsed.itens.map((item, index) => {
      const calc = tributosItem({
        icmsCst: '00',
        icmsAliquota: item.icmsAliquota,
        icmsReducaoBase: 0,
        icmsModalidade: 'VALOR_OPERACAO',
        icmsSTMargem: 0,
        icmsSTReducao: 0,
        icmsSTAliquota: 0,
        ipiCst: '50',
        ipiAliquota: item.ipiAliquota,
        ipiTributado: true,
        pisCst: '01',
        pisAliquota: item.pisAliquota,
        cofinsCst: '01',
        cofinsAliquota: item.cofinsAliquota,
        cbsAliquota: 0.9,
        ibsAliquota: 0.1,
        isAliquota: item.isAliquota,
        valorUnitario: item.valorUnitarioComercial,
        quantidade: item.quantidadeComercial,
        valorFrete: 0,
        valorSeguro: 0,
        valorDespesas: 0,
        valorDesconto: item.valorDesconto,
      });

      valorTotalItens += calc.valorProduto;
      valorTotalDesconto += item.valorDesconto;
      valorTotalTributos += calc.valorTotalTributos;
      valorTotalCBS += calc.cbsValor;
      valorTotalIBS += calc.ibsValor;
      valorTotalIS += calc.isValor;

      return {
        produtoId: item.produtoId || null,
        numeroItem: index + 1,
        codigo: item.codigo,
        descricao: item.descricao,
        ncm: item.ncm || null,
        cfop: item.cfop,
        unidadeComercial: item.unidadeComercial,
        quantidadeComercial: item.quantidadeComercial,
        valorUnitarioComercial: item.valorUnitarioComercial,
        valorTotalBruto: calc.valorProduto,
        valorDesconto: item.valorDesconto,
        valorTotalLiquido: calc.valorTotalLiquido,
        codigoEAN: item.codigoEAN || null,
        origemMercadoria: item.origemMercadoria || '0',

        icmsCst: '00',
        icmsAliquota: item.icmsAliquota,
        icmsBaseCalculo: calc.icmsBaseCalculo,
        icmsValor: calc.icmsValor,
        icmsModalidade: 'VALOR_OPERACAO',
        icmsSTBaseCalculo: calc.icmsSTBaseCalculo,
        icmsSTAliquota: 0,
        icmsSTValor: calc.icmsSTValor,
        icmsReducaoBase: 0,

        pisCst: '01',
        pisAliquota: item.pisAliquota,
        pisValor: calc.pisValor,
        pisBaseCalculo: calc.pisBaseCalculo,
        cofinsCst: '01',
        cofinsAliquota: item.cofinsAliquota,
        cofinsValor: calc.cofinsValor,
        cofinsBaseCalculo: calc.cofinsBaseCalculo,

        ipiCst: '50',
        ipiAliquota: item.ipiAliquota,
        ipiValor: calc.ipiValor,
        ipiBaseCalculo: calc.valorTotalLiquido,
        ipiTributado: true,

        cbsCst: '01',
        cbsBaseCalculo: calc.cbsBaseCalculo,
        cbsAliquota: 0.9,
        cbsValor: calc.cbsValor,
        ibsCst: '01',
        ibsBaseCalculo: calc.ibsBaseCalculo,
        ibsAliquota: 0.1,
        ibsValor: calc.ibsValor,
        isAliquota: item.isAliquota || 0,
        isValor: calc.isValor,
      };
    });

    const notaFiscal = await prisma.notaFiscal.create({
      data: {
        empresaId,
        filialId: parsed.filialId,
        clienteId: parsed.clienteId || null,
        fornecedorId: parsed.fornecedorId || null,
        pedidoVendaId: parsed.pedidoVendaId || null,
        tipoDocumento: parsed.tipoDocumento,
        modelo: parsed.modelo,
        serie: parsed.serie,
        numero: proximoNumero,
        chaveAcesso,
        tipoOperacao: parsed.tipoOperacao,
        finalidadeEmissao: parsed.finalidadeEmissao,
        naturezaOperacao: parsed.naturezaOperacao,
        dataEmissao: new Date(),
        dataSaida: parsed.dataSaida || null,
        valorTotal: valorTotalItens,
        valorDesconto: valorTotalDesconto,
        valorTotalTributos,
        valorBaseCBS: valorTotalItens,
        valorCBS: valorTotalCBS,
        aliquotaCBS: 0.9,
        valorBaseIBS: valorTotalItens,
        valorIBS: valorTotalIBS,
        aliquotaIBS: 0.1,
        valorIS: valorTotalIS,
        aliquotaIS: 0,
        valorTotalReformaTributaria: valorTotalCBS + valorTotalIBS + valorTotalIS,
        situacao: 'EM_DIGITACAO',
        observacoes: parsed.observacoes,
        informacoesComplementares: parsed.informacoesComplementares,
        itens: {
          create: itensCalculados as any,
        },
      },
      include: {
        filial: true,
        cliente: true,
        fornecedor: true,
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });

    await prisma.configuracaoNF.update({
      where: { empresaId },
      data: {
        [parsed.modelo === 'NFCE' ? 'proximoNFCe' : 'proximoNFe']: proximoNumero + 1,
      },
    });

    return notaFiscal;
  }

  async buscarPorId(id: string, empresaId: string) {
    const notaFiscal = await prisma.notaFiscal.findFirst({
      where: { id, empresaId },
      include: {
        filial: true,
        cliente: true,
        fornecedor: true,
        pedidoVenda: true,
        itens: {
          include: {
            produto: true,
          },
        },
        eventos: {
          orderBy: { dataEvento: 'desc' },
        },
      },
    });

    if (!notaFiscal) throw new Error('Nota fiscal não encontrada');
    return notaFiscal;
  }

  async listar(filtros: NotaFiscalFiltro, empresaId: string) {
    const parsed = notaFiscalFiltroSchema.parse(filtros);

    const where: any = { empresaId };

    if (parsed.filialId) where.filialId = parsed.filialId;
    if (parsed.clienteId) where.clienteId = parsed.clienteId;
    if (parsed.modelo) where.modelo = parsed.modelo;
    if (parsed.situacao) where.situacao = parsed.situacao;

    if (parsed.dataInicial || parsed.dataFinal) {
      where.dataEmissao = {};
      if (parsed.dataInicial) where.dataEmissao.gte = parsed.dataInicial;
      if (parsed.dataFinal) where.dataEmissao.lte = parsed.dataFinal;
    }

    const skip = (parsed.pagina - 1) * parsed.limite;

    const [notasFiscais, total] = await Promise.all([
      prisma.notaFiscal.findMany({
        where,
        skip,
        take: parsed.limite,
        orderBy: { dataEmissao: 'desc' },
        include: {
          filial: true,
          cliente: true,
          fornecedor: true,
          itens: true,
        },
      }),
      prisma.notaFiscal.count({ where }),
    ]);

    return {
      data: notasFiscais,
      meta: {
        total,
        pagina: parsed.pagina,
        limite: parsed.limite,
        totalPaginas: Math.ceil(total / parsed.limite),
      },
    };
  }

  async atualizar(id: string, data: AtualizarNotaFiscalInput, empresaId: string) {
    const notaFiscal = await prisma.notaFiscal.findFirst({
      where: { id, empresaId },
    });

    if (!notaFiscal) throw new Error('Nota fiscal não encontrada');

    if (notaFiscal.situacao === 'AUTORIZADA') {
      throw new Error('Nota fiscal autorizada não pode ser alterada');
    }

    if (notaFiscal.situacao === 'CANCELADA') {
      throw new Error('Nota fiscal cancelada não pode ser alterada');
    }

    const parsed = atualizarNotaFiscalSchema.parse(data);

    return prisma.notaFiscal.update({
      where: { id },
      data: parsed,
      include: {
        filial: true,
        cliente: true,
        itens: true,
      },
    });
  }

  async assinar(id: string, empresaId: string) {
    const notaFiscal = await prisma.notaFiscal.findFirst({
      where: { id, empresaId },
      include: {
        empresa: true,
        filial: true,
        cliente: true,
        fornecedor: true,
        itens: true,
      },
    });

    if (!notaFiscal) throw new Error('Nota fiscal não encontrada');

    if (notaFiscal.situacao !== 'EM_DIGITACAO') {
      throw new Error('Nota deve estar em digitação para ser assinada');
    }

    const configNF = await prisma.configuracaoNF.findUnique({ where: { empresaId } });
    if (!configNF?.certificadoDigital) throw new Error('Certificado digital não configurado');

    const xml = this.gerarXmlNFe(notaFiscal);
    const xmlAssinado = assinarXML(xml, notaFiscal.chaveAcesso, configNF.certificadoDigital, configNF.senhaCertificado);

    return prisma.notaFiscal.update({
      where: { id },
      data: {
        situacao: 'ASSINADA',
        xmlEnvio: xmlAssinado,
      },
      include: {
        filial: true,
        cliente: true,
        itens: true,
      },
    });
  }

  async enviar(id: string, empresaId: string) {
    const notaFiscal = await prisma.notaFiscal.findFirst({
      where: { id, empresaId },
    });

    if (!notaFiscal) throw new Error('Nota fiscal não encontrada');

    if (notaFiscal.situacao !== 'ASSINADA') {
      throw new Error('Nota deve estar assinada para ser enviada');
    }

    const sefaz = await this.obterSefazClient(empresaId);

    const { codigoRecibo } = await sefaz.autorizar(notaFiscal.xmlEnvio || '');

    await prisma.notaFiscal.update({
      where: { id },
      data: {
        situacao: 'ENVIADA',
        numeroRecibo: codigoRecibo,
      },
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = await sefaz.consultarRecibo(codigoRecibo);

    const notaAtualizada = await prisma.notaFiscal.update({
      where: { id },
      data: {
        situacao: result.sucesso ? 'AUTORIZADA' : 'DENEGADA',
        statusSefaz: result.codigo,
        motivo: result.motivo,
        protocolo: result.protocolo,
        dataProtocolo: new Date(),
        dataAutorizacao: result.sucesso ? new Date() : null,
        xmlRetorno: result.xmlRetorno,
      },
    });

    if (result.sucesso && notaFiscal.clienteId && !notaFiscal.pedidoVendaId) {
      await prisma.contaReceber.create({
        data: {
          empresaId,
          clienteId: notaFiscal.clienteId,
          pedidoVendaId: null,
          numeroDocumento: notaFiscal.chaveAcesso,
          numeroParcela: 1,
          totalParcelas: 1,
          dataVencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          valorOriginal: notaFiscal.valorTotal,
          formaPagamento: 'BOLETO',
          observacoes: `NF-e ${notaFiscal.modelo} nº ${notaFiscal.numero} - ${notaFiscal.chaveAcesso}`,
        },
      });
    }

    return notaAtualizada;
  }

  async cancelar(id: string, data: CancelarNotaFiscalInput, empresaId: string) {
    const parsed = cancelarNotaFiscalSchema.parse(data);

    const notaFiscal = await prisma.notaFiscal.findFirst({
      where: { id, empresaId },
    });

    if (!notaFiscal) throw new Error('Nota fiscal não encontrada');

    if (notaFiscal.situacao !== 'AUTORIZADA') {
      throw new Error('Apenas notas autorizadas podem ser canceladas');
    }

    const sefaz = await this.obterSefazClient(empresaId);

    const xmlCancelamento = montarXMLCancelamento({
      chaveAcesso: notaFiscal.chaveAcesso,
      protocolo: notaFiscal.protocolo || '',
      justificativa: parsed.justificativa,
      data: new Date(),
    });

    const result = await sefaz.cancelar({
      xmlAssinado: xmlCancelamento,
      protocolo: notaFiscal.protocolo || '',
      justificativa: parsed.justificativa,
    });

    const evento = await prisma.eventoNF.create({
      data: {
        notaFiscalId: id,
        tipoEvento: 'CANCELAMENTO',
        sequenciaEvento: 1,
        dataEvento: new Date(),
        descricao: 'Cancelamento de NF-e',
        justificativa: parsed.justificativa,
        protocolo: result.protocolo,
        dataProtocolo: new Date(),
        xmlEnvio: xmlCancelamento,
        xmlRetorno: result.xmlRetorno,
      },
    });

    return prisma.notaFiscal.update({
      where: { id },
      data: {
        situacao: 'CANCELADA',
        motivo: result.motivo || parsed.justificativa,
      },
      include: {
        eventos: true,
      },
    });
  }

  async cartaCorrecao(id: string, data: CartaCorrecaoInput, empresaId: string) {
    const parsed = cartaCorrecaoSchema.parse(data);

    const notaFiscal = await prisma.notaFiscal.findFirst({
      where: { id, empresaId },
    });

    if (!notaFiscal) throw new Error('Nota fiscal não encontrada');

    if (notaFiscal.situacao !== 'AUTORIZADA') {
      throw new Error('Apenas notas autorizadas podem ter carta de correção');
    }

    const ultimoEvento = await prisma.eventoNF.findFirst({
      where: { notaFiscalId: id, tipoEvento: 'CARTA_CORRECAO' },
      orderBy: { sequenciaEvento: 'desc' },
    });

    const sequencia = (ultimoEvento?.sequenciaEvento || 0) + 1;

    const sefaz = await this.obterSefazClient(empresaId);

    const xmlCCe = montarXMLCartaCorrecao({
      chaveAcesso: notaFiscal.chaveAcesso,
      sequencia,
      correcao: parsed.justificativa,
      dataEvento: new Date(),
    });

    const result = await sefaz.cartaCorrecao({
      chaveAcesso: notaFiscal.chaveAcesso,
      sequencia,
      correcao: parsed.justificativa,
    });

    return prisma.eventoNF.create({
      data: {
        notaFiscalId: id,
        tipoEvento: 'CARTA_CORRECAO',
        sequenciaEvento: sequencia,
        dataEvento: new Date(),
        descricao: parsed.justificativa,
        protocolo: result.protocolo,
        dataProtocolo: new Date(),
        xmlEnvio: xmlCCe,
        xmlRetorno: result.xmlRetorno,
      },
    });
  }

  async inutilizar(numeroInicial: number, numeroFinal: number, serie: string, justificativa: string, empresaId: string) {
    const xmlInutilizacao = montarXMLInutilizacao({
      cnpj: '',
      uf: 'SP',
      ambiente: 'homologacao',
      serie: parseInt(serie),
      numeroInicial,
      numeroFinal,
      justificativa,
      data: new Date(),
    });

    const notaFiscal = await prisma.notaFiscal.create({
      data: {
        empresaId,
        filialId: '',
        tipoDocumento: 'SAIDA',
        modelo: 'NFE',
        serie,
        numero: numeroInicial,
        chaveAcesso: `INUTIL${numeroInicial}`,
        tipoOperacao: 'OPERACAO_INTERNA',
        naturezaOperacao: 'INUTILIZACAO',
        valorTotal: 0,
        situacao: 'INUTILIZADA',
        motivo: justificativa,
        xmlEnvio: xmlInutilizacao,
      },
    });

    return notaFiscal;
  }

  async configurarCertificado(data: ConfigurarCertificadoInput, empresaId: string) {
    const parsed = configurarCertificadoSchema.parse(data);

    return prisma.configuracaoNF.upsert({
      where: { empresaId },
      create: {
        empresaId,
        certificadoDigital: parsed.certificadoDigital,
        senhaCertificado: parsed.senhaCertificado,
        csc: parsed.csc,
        cscId: parsed.cscId,
        ambiente: parsed.ambiente,
        uf: parsed.uf,
        municipio: parsed.municipio,
      },
      update: {
        certificadoDigital: parsed.certificadoDigital,
        senhaCertificado: parsed.senhaCertificado,
        csc: parsed.csc,
        cscId: parsed.cscId,
        ambiente: parsed.ambiente,
        uf: parsed.uf,
        municipio: parsed.municipio,
      },
    });
  }

  async buscarConfiguracao(empresaId: string) {
    const config = await prisma.configuracaoNF.findUnique({
      where: { empresaId },
    });

    if (!config) {
      throw new Error('Configuração NF-e não encontrada');
    }

    return {
      ...config,
      certificadoDigital: '***',
      senhaCertificado: '***',
    };
  }

  async listarPorStatus(empresaId: string, situacao: string) {
    return prisma.notaFiscal.findMany({
      where: { empresaId, situacao: situacao as any },
      orderBy: { dataEmissao: 'desc' },
      include: {
        filial: true,
        cliente: true,
      },
    });
  }

  async statusSefaz(empresaId: string) {
    const sefaz = await this.obterSefazClient(empresaId);
    return sefaz.consultarStatus();
  }

  private gerarXmlNFe(notaFiscal: any): string {
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
              <orig>${item.origemMercadoria || 0}</orig>
              <CST>${item.icmsCst || '00'}</CST>
              <modBC>3</modBC>
              <vBC>${(item.icmsBaseCalculo || 0).toFixed(2)}</vBC>
              <pICMS>${(item.icmsAliquota || 0).toFixed(2)}</pICMS>
              <vICMS>${(item.icmsValor || 0).toFixed(2)}</vICMS>
            </ICMS00>
          </ICMS>
          <PIS>
            <PISAliq>
              <CST>${item.pisCst || '01'}</CST>
              <vBC>${(item.valorTotalLiquido || 0).toFixed(2)}</vBC>
              <pPIS>${(item.pisAliquota || 0).toFixed(2)}</pPIS>
              <vPIS>${(item.pisValor || 0).toFixed(2)}</vPIS>
            </PISAliq>
          </PIS>
          <COFINS>
            <COFINSAliq>
              <CST>${item.cofinsCst || '01'}</CST>
              <vBC>${(item.valorTotalLiquido || 0).toFixed(2)}</vBC>
              <pCOFINS>${(item.cofinsAliquota || 0).toFixed(2)}</pCOFINS>
              <vCOFINS>${(item.cofinsValor || 0).toFixed(2)}</vCOFINS>
            </COFINSAliq>
          </COFINS>
        </imposto>
      </det>
    `).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe${notaFiscal.chaveAcesso}" versao="4.00">
    <ide>
      <cUF>${notaFiscal.chaveAcesso.substring(0, 2)}</cUF>
      <cNF>${notaFiscal.chaveAcesso.substring(35, 43)}</cNF>
      <natOp>${notaFiscal.naturezaOperacao}</natOp>
      <mod>${notaFiscal.modelo === 'NFCE' ? '65' : '55'}</mod>
      <serie>${notaFiscal.serie}</serie>
      <nNF>${notaFiscal.numero}</nNF>
      <dhEmi>${notaFiscal.dataEmissao.toISOString()}</dhEmi>
      <tpNF>1</tpNF>
      <idDest>1</idDest>
      <cMunFG>3550308</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
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
        <xLgr></xLgr>
        <nro></nro>
        <xBairro></xBairro>
        <cMun></cMun>
        <xMun></xMun>
        <UF></UF>
        <CEP></CEP>
      </enderEmit>
      <IE>${notaFiscal.empresa.inscricaoEstadual || ''}</IE>
    </emit>
    ${notaFiscal.cliente ? `
    <dest>
      <CNPJ>${notaFiscal.cliente.documento?.replace(/\D/g, '') || ''}</CNPJ>
      <xNome>${notaFiscal.cliente.nome}</xNome>
    </dest>
    ` : ''}
    ${itensXml}
    <total>
      <ICMSTot>
        <vBC>${(notaFiscal.valorTotalTributos || 0).toFixed(2)}</vBC>
        <vICMS>0.00</vICMS>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vProd>${(notaFiscal.valorTotal || 0).toFixed(2)}</vProd>
        <vFrete>${(notaFiscal.valorFrete || 0).toFixed(2)}</vFrete>
        <vSeg>${(notaFiscal.valorSeguro || 0).toFixed(2)}</vSeg>
        <vDesc>${(notaFiscal.valorDesconto || 0).toFixed(2)}</vDesc>
        <vII>0.00</vII>
        <vIPI>${(notaFiscal.valorIPI || 0).toFixed(2)}</vIPI>
        <vPIS>${(notaFiscal.valorPIS || 0).toFixed(2)}</vPIS>
        <vCOFINS>${(notaFiscal.valorCOFINS || 0).toFixed(2)}</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>${(notaFiscal.valorTotal || 0).toFixed(2)}</vNF>
      </ICMSTot>
    </total>
  </infNFe>
</NFe>`;
  }
}
