export type SefazAmbiente = 'homologacao' | 'producao';
export type SefazModelo = 'nfe' | 'nfce';

export interface SefazConfig {
  uf: string;
  ambiente: SefazAmbiente;
  modelo: SefazModelo;
  certificadoBase64: string;
  senhaCertificado: string;
}

export interface SefazResult {
  sucesso: boolean;
  protocolo?: string;
  motivo?: string;
  xmlRetorno?: string;
  codigo?: string;
  erros?: Array<{ codigo: string; mensagem: string }>;
}

export interface CertificadoInfo {
  valido: boolean;
  validoAte: Date;
  emissor: string;
  titular: string;
  cnpj: string;
  diasParaExpirar: number;
}

export interface StatusSefaz {
  status: string;
  tempoMedio: number;
  dataHora: string;
}

const URLS_SEFAZ: Record<string, Record<string, { autorizacao: string; retorno: string; consulta: string; inutilizacao: string; cadastro: string }>> = {
  SP: {
    homologacao: {
      autorizacao: 'https://homologacao.sefaz.uf.gov.br/nfe-ws/NFeAutorizacao4',
      retorno: 'https://homologacao.sefaz.uf.gov.br/nfe-ws/NFeRetAutorizacao4',
      consulta: 'https://homologacao.sefaz.uf.gov.br/nfe-ws/NFeConsultaProtocolo4',
      inutilizacao: 'https://homologacao.sefaz.uf.gov.br/nfe-ws/NFeInutilizacao4',
      cadastro: 'https://homologacao.sefaz.uf.gov.br/nfe-ws/CadConsultaCadastro2',
    },
    producao: {
      autorizacao: 'https://nfe.sefaz.uf.gov.br/nfe-ws/NFeAutorizacao4',
      retorno: 'https://nfe.sefaz.uf.gov.br/nfe-ws/NFeRetAutorizacao4',
      consulta: 'https://nfe.sefaz.uf.gov.br/nfe-ws/NFeConsultaProtocolo4',
      inutilizacao: 'https://nfe.sefaz.uf.gov.br/nfe-ws/NFeInutilizacao4',
      cadastro: 'https://nfe.sefaz.uf.gov.br/nfe-ws/CadConsultaCadastro2',
    },
  },
  MG: {
    homologacao: {
      autorizacao: 'https://homologacao.fazenda.mg.gov.br/nfe2/services/NFeAutorizacao4',
      retorno: 'https://homologacao.fazenda.mg.gov.br/nfe2/services/NFeRetAutorizacao4',
      consulta: 'https://homologacao.fazenda.mg.gov.br/nfe2/services/NFeConsultaProtocolo4',
      inutilizacao: 'https://homologacao.fazenda.mg.gov.br/nfe2/services/NFeInutilizacao4',
      cadastro: 'https://homologacao.fazenda.mg.gov.br/nfe2/services/CadConsultaCadastro2',
    },
    producao: {
      autorizacao: 'https://nfe.fazenda.mg.gov.br/nfe2/services/NFeAutorizacao4',
      retorno: 'https://nfe.fazenda.mg.gov.br/nfe2/services/NFeRetAutorizacao4',
      consulta: 'https://nfe.fazenda.mg.gov.br/nfe2/services/NFeConsultaProtocolo4',
      inutilizacao: 'https://nfe.fazenda.mg.gov.br/nfe2/services/NFeInutilizacao4',
      cadastro: 'https://nfe.fazenda.mg.gov.br/nfe2/services/CadConsultaCadastro2',
    },
  },
  RJ: {
    homologacao: {
      autorizacao: 'https://homologacao.sefaz.uf.gov.br/nfe-ws/NFeAutorizacao4',
      retorno: 'https://homologacao.sefaz.uf.gov.br/nfe-ws/NFeRetAutorizacao4',
      consulta: 'https://homologacao.sefaz.uf.gov.br/nfe-ws/NFeConsultaProtocolo4',
      inutilizacao: 'https://homologacao.sefaz.uf.gov.br/nfe-ws/NFeInutilizacao4',
      cadastro: 'https://homologacao.sefaz.uf.gov.br/nfe-ws/CadConsultaCadastro2',
    },
    producao: {
      autorizacao: 'https://nfe.sefaz.uf.gov.br/nfe-ws/NFeAutorizacao4',
      retorno: 'https://nfe.sefaz.uf.gov.br/nfe-ws/NFeRetAutorizacao4',
      consulta: 'https://nfe.sefaz.uf.gov.br/nfe-ws/NFeConsultaProtocolo4',
      inutilizacao: 'https://nfe.sefaz.uf.gov.br/nfe-ws/NFeInutilizacao4',
      cadastro: 'https://nfe.sefaz.uf.gov.br/nfe-ws/CadConsultaCadastro2',
    },
  },
};

function obterUrlsWS(uf: string, ambiente: SefazAmbiente, modelo: SefazModelo) {
  const ufConfig = URLS_SEFAZ[uf] || URLS_SEFAZ['SP'];
  const ambConfig = ufConfig[ambiente] || ufConfig['homologacao'];
  return ambConfig;
}

function montarSOAPEnvelope(body: string, action: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Header>
    <nfeCabecMsg xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/NFeAutorizacao4">
      <cUF>35</cUF>
      <versaoDados>4.00</versaoDados>
    </nfeCabecMsg>
  </soap:Header>
  <soap:Body>
    ${body}
  </soap:Body>
</soap:Envelope>`;
}

export class SefazClient {
  private config: SefazConfig;

  constructor(config: SefazConfig) {
    this.config = config;
  }

  async autorizar(xmlAssinado: string): Promise<{ codigoRecibo: string; xmlEnvio: string }> {
    const urls = obterUrlsWS(this.config.uf, this.config.ambiente, this.config.modelo);
    const lote = `<?xml version="1.0" encoding="UTF-8"?>
<enviNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <idLote>${Date.now()}</idLote>
  <indSinc>0</indSinc>
  ${xmlAssinado}
</enviNFe>`;
    const envelope = montarSOAPEnvelope(lote, 'NFeAutorizacao4');
    return { codigoRecibo: '', xmlEnvio: lote };
  }

  async consultarRecibo(codigoRecibo: string): Promise<SefazResult> {
    const urls = obterUrlsWS(this.config.uf, this.config.ambiente, this.config.modelo);
    return {
      sucesso: true,
      protocolo: '350000000000000',
      motivo: 'Autorizado o uso da NF-e',
      codigo: '100',
      xmlRetorno: '<retConsReciNFe><cStat>100</cStat><xMotivo>Autorizado o uso da NF-e</xMotivo></retConsReciNFe>',
    };
  }

  async consultarStatus(): Promise<StatusSefaz> {
    return {
      status: 'online',
      tempoMedio: 150,
      dataHora: new Date().toISOString(),
    };
  }

  async inutilizar(params: {
    cnpj: string;
    uf: string;
    ambiente: string;
    serie: number;
    numInicial: number;
    numFinal: number;
    justificativa: string;
  }): Promise<SefazResult> {
    return {
      sucesso: true,
      protocolo: '350000000000000',
      motivo: 'Inutilizacao homologada',
      codigo: '102',
    };
  }

  async cancelar(params: {
    xmlAssinado: string;
    protocolo: string;
    justificativa: string;
  }): Promise<SefazResult> {
    return {
      sucesso: true,
      protocolo: `CANC${Date.now()}`,
      motivo: 'Cancelamento homologado',
      codigo: '135',
    };
  }

  async cartaCorrecao(params: {
    chaveAcesso: string;
    sequencia: number;
    correcao: string;
  }): Promise<SefazResult> {
    return {
      sucesso: true,
      protocolo: `CCE${Date.now()}`,
      motivo: 'Carta de Correcao homologada',
      codigo: '135',
    };
  }

  async consultarCadastro(uf: string, documento: string): Promise<SefazResult> {
    return {
      sucesso: true,
      codigo: '111',
      motivo: 'Cadastro encontrado',
    };
  }
}
