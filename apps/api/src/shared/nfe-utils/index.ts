import * as forge from 'node-forge';
import { SignedXml } from 'xml-crypto';
import { DOMParser } from '@xmldom/xmldom';

export function gerarCodigoNumerico(): number {
  return Math.floor(10000000 + Math.random() * 90000000);
}

export function digitoVerificador(chaveSemDV: string): string {
  let soma = 0;
  let peso = 2;
  for (let i = chaveSemDV.length - 1; i >= 0; i--) {
    soma += parseInt(chaveSemDV[i]) * peso;
    peso = peso === 9 ? 2 : peso + 1;
  }
  const resto = soma % 11;
  const dv = 11 - resto;
  if (dv === 0 || dv === 1) return '0';
  return String(dv);
}

export function validarChaveAcesso(chave: string): boolean {
  if (!/^\d{44}$/.test(chave)) return false;

  const uf = parseInt(chave.substring(0, 2));
  if (uf < 11 || uf > 53) return false;

  const ano = parseInt(chave.substring(2, 4));
  const mes = parseInt(chave.substring(4, 6));
  if (mes < 1 || mes > 12) return false;

  const cnpj = chave.substring(6, 20);
  if (!/^\d{14}$/.test(cnpj)) return false;

  const modelo = chave.substring(20, 22);
  if (modelo !== '55' && modelo !== '65') return false;

  const serie = chave.substring(22, 25);
  const numero = chave.substring(25, 34);
  const tpEmis = chave.substring(34, 35);
  const cNF = chave.substring(35, 43);
  const dvInformado = chave.substring(43, 44);

  const chaveSemDV = chave.substring(0, 43);
  const dvCalculado = digitoVerificador(chaveSemDV);

  return dvInformado === dvCalculado;
}

export function formatarChaveAcesso(chave: string): string {
  if (!/^\d{44}$/.test(chave)) return chave;
  return `NFe ${chave.substring(0, 2)} ${chave.substring(2, 6)} ${chave.substring(6, 20)} ${chave.substring(20, 22)} ${chave.substring(22, 25)} ${chave.substring(25, 34)} ${chave.substring(34, 35)} ${chave.substring(35, 43)} ${chave.substring(43, 44)}`;
}

export interface ChaveAcessoParams {
  uf: string;
  dataEmissao: Date;
  cnpj: string;
  modelo: string;
  serie: string;
  numero: number;
  tipoEmissao: string;
  codigoNumerico: number;
}

const CODIGOS_UF: Record<string, string> = {
  'RO': '11', 'AC': '12', 'AM': '13', 'RR': '14', 'PA': '15', 'AP': '16', 'TO': '17',
  'MA': '21', 'PI': '22', 'CE': '23', 'RN': '24', 'PB': '25', 'PE': '26', 'AL': '27',
  'SE': '28', 'BA': '29',
  'MG': '31', 'ES': '32', 'RJ': '33', 'SP': '35',
  'PR': '41', 'SC': '42', 'RS': '43',
  'MS': '50', 'MT': '51', 'GO': '52', 'DF': '53',
};

export function gerarChaveAcesso(params: ChaveAcessoParams): string {
  const codigoUF = CODIGOS_UF[params.uf] || '35';

  const data = new Date(params.dataEmissao);
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = String(data.getFullYear()).slice(-2);

  const cnpjLimpo = params.cnpj.replace(/\D/g, '').padStart(14, '0');

  const serie = params.serie.padStart(3, '0');
  const numero = String(params.numero).padStart(9, '0');
  const cNF = String(params.codigoNumerico).padStart(8, '0').slice(-8);

  const chaveSemDV = `${codigoUF}${ano}${mes}${cnpjLimpo}${params.modelo}${serie}${numero}${params.tipoEmissao}${cNF}`;

  const dv = digitoVerificador(chaveSemDV);
  return chaveSemDV + dv;
}

export function montarXMLInutilizacao(dados: {
  cnpj: string;
  uf: string;
  ambiente: string;
  serie: number;
  numeroInicial: number;
  numeroFinal: number;
  justificativa: string;
  data: Date;
}): string {
  const codigoUF = CODIGOS_UF[dados.uf] || '35';
  const tpAmb = dados.ambiente === 'producao' ? '1' : '2';
  const dataStr = dados.data.toISOString().replace(/[-:]/g, '').substring(0, 14);

  return `<?xml version="1.0" encoding="UTF-8"?>
<inutNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <infInut Id="ID${codigoUF}${dados.data.getFullYear()}${String(dados.data.getMonth() + 1).padStart(2, '0')}${dados.cnpj.replace(/\D/g, '')}${String(dados.serie).padStart(3, '0')}${String(dados.numeroInicial).padStart(9, '0')}${String(dados.numeroFinal).padStart(9, '0')}">
    <tpAmb>${tpAmb}</tpAmb>
    <xServ>INUTILIZAR</xServ>
    <cUF>${codigoUF}</cUF>
    <ano>${String(dados.data.getFullYear()).slice(-2)}</ano>
    <CNPJ>${dados.cnpj.replace(/\D/g, '')}</CNPJ>
    <mod>55</mod>
    <serie>${String(dados.serie).padStart(3, '0')}</serie>
    <nNFIni>${String(dados.numeroInicial).padStart(9, '0')}</nNFIni>
    <nNFFin>${String(dados.numeroFinal).padStart(9, '0')}</nNFFin>
    <xJust>${dados.justificativa}</xJust>
  </infInut>
</inutNFe>`;
}

export function montarXMLCancelamento(dados: {
  chaveAcesso: string;
  protocolo: string;
  justificativa: string;
  data: Date;
}): string {
  const dataStr = dados.data.toISOString().replace(/[-:]/g, '').substring(0, 14);

  return `<?xml version="1.0" encoding="UTF-8"?>
<evento xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.00">
  <infEvento Id="ID110111${dados.chaveAcesso}01">
    <cOrgao>91</cOrgao>
    <tpAmb>2</tpAmb>
    <CNPJ>${dados.chaveAcesso.substring(6, 20)}</CNPJ>
    <chNFe>${dados.chaveAcesso}</chNFe>
    <dhEvento>${dataStr}</dhEvento>
    <tpEvento>110111</tpEvento>
    <nSeqEvento>1</nSeqEvento>
    <verEvento>1.00</verEvento>
    <detEvento versao="1.00">
      <descEvento>Cancelamento</descEvento>
      <nProt>${dados.protocolo}</nProt>
      <xJust>${dados.justificativa}</xJust>
    </detEvento>
  </infEvento>
</evento>`;
}

export function montarXMLCartaCorrecao(dados: {
  chaveAcesso: string;
  sequencia: number;
  correcao: string;
  dataEvento: Date;
}): string {
  const dataStr = dados.dataEvento.toISOString().replace(/[-:]/g, '').substring(0, 14);
  const seq = String(dados.sequencia).padStart(2, '0');

  return `<?xml version="1.0" encoding="UTF-8"?>
<evento xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.00">
  <infEvento Id="ID110110${dados.chaveAcesso}${seq}">
    <cOrgao>91</cOrgao>
    <tpAmb>2</tpAmb>
    <CNPJ>${dados.chaveAcesso.substring(6, 20)}</CNPJ>
    <chNFe>${dados.chaveAcesso}</chNFe>
    <dhEvento>${dataStr}</dhEvento>
    <tpEvento>110110</tpEvento>
    <nSeqEvento>${dados.sequencia}</nSeqEvento>
    <verEvento>1.00</verEvento>
    <detEvento versao="1.00">
      <descEvento>Carta de Correcao</descEvento>
      <xCorrecao>${dados.correcao}</xCorrecao>
      <xCondUso>A Carta de Correcao e disciplinada pelo paragrafo 1o-A do art. 7o do Convenio S/N, de 15 de dezembro de 1970 e pode ser utilizada para regularizacao de erro ocorrido na emissao de documento fiscal, desde que o erro nao esteja relacionado com: I - as variaveis que determinam o valor do imposto tais como: base de calculo, aliquota, diferenca de preco, natureza da operacao, II - a correcao de dados cadastrais que implique mudanca do remetente ou do destinatario, III - a data de emissao ou de saida.</xCondUso>
    </detEvento>
  </infEvento>
</evento>`;
}

export function montarXMLConsultaCadastro(dados: {
  cnpj: string;
  uf: string;
  ie?: string;
}): string {
  const codigoUF = CODIGOS_UF[dados.uf] || '35';

  return `<?xml version="1.0" encoding="UTF-8"?>
<ConsCad xmlns="http://www.portalfiscal.inf.br/nfe" versao="2.00">
  <infCons>
    <xServ>CONS-CAD</xServ>
    <UF>${dados.uf}</UF>
    <CNPJ>${dados.cnpj.replace(/\D/g, '')}</CNPJ>
  </infCons>
</ConsCad>`;
}

export function gerarQRCodeNFCe(params: {
  chaveAcesso: string;
  versao: string;
  ambiente: string;
  csc: string;
  cscId: string;
}): string {
  const tpAmb = params.ambiente === 'producao' ? '1' : '2';
  const data = `${params.chaveAcesso}|${params.versao}|${tpAmb}|${params.cscId}|${params.csc}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hashHex = Math.abs(hash).toString(16).padStart(8, '0');
  return `${params.chaveAcesso}|${params.versao}|${tpAmb}|${params.cscId}|${hashHex}`;
}

export function lerCertificadoPFX(base64: string, senha: string) {
  const pfxDer = forge.util.decode64(base64);
  const pfxAsn1 = forge.asn1.fromDer(pfxDer);
  const pfx = forge.pkcs12.pkcs12FromAsn1(pfxAsn1, senha);

  let privateKey: forge.pki.PrivateKey | null = null;
  const keyBags = pfx.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
  if (keyBags[forge.pki.oids.pkcs8ShroudedKeyBag]?.length) {
    privateKey = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0].key as forge.pki.PrivateKey;
  }
  if (!privateKey) {
    const keyBags2 = pfx.getBags({ bagType: forge.pki.oids.keyBag });
    if (keyBags2[forge.pki.oids.keyBag]?.length) {
      privateKey = keyBags2[forge.pki.oids.keyBag][0].key as forge.pki.PrivateKey;
    }
  }
  if (!privateKey) throw new Error('Não foi possível extrair a chave privada do certificado');

  let cert: forge.pki.Certificate | null = null;
  const certBags = pfx.getBags({ bagType: forge.pki.oids.certBag });
  if (certBags[forge.pki.oids.certBag]?.length) {
    cert = certBags[forge.pki.oids.certBag][0].cert as forge.pki.Certificate;
  }
  if (!cert) throw new Error('Não foi possível extrair o certificado do PFX');

  const validoAte = cert.validity.notAfter;
  const diasRestantes = Math.max(0, Math.ceil((validoAte.getTime() - Date.now()) / 86400000));

  const getFieldValue = (obj: any, name: string): string => {
    const field = obj.getField({ name, type: name });
    return field?.value || obj.getField(name)?.value || '';
  };

  return {
    valido: diasRestantes > 0,
    validoAte,
    diasParaExpirar: diasRestantes,
    emissor: getFieldValue(cert.issuer, 'organizationName') || getFieldValue(cert.issuer, 'O'),
    titular: getFieldValue(cert.subject, 'commonName') || getFieldValue(cert.subject, 'CN'),
    cnpj: extrairCNPJdoCertificado(cert),
    privateKeyPem: forge.pki.privateKeyToPem(privateKey),
    certPem: forge.pki.certificateToPem(cert),
    certBase64: forge.util.encode64(forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes()),
  };
}

function extrairCNPJdoCertificado(cert: forge.pki.Certificate): string {
  const cnpjField = cert.subject.getField('2.16.76.1.3.3');
  if (cnpjField?.value) {
    return String(cnpjField.value).replace(/\D/g, '');
  }
  const cn = cert.subject.getField('commonName')?.value || cert.subject.getField('CN')?.value || '';
  const cnpjFromCN = String(cn).match(/(\d{14})/);
  return cnpjFromCN?.[1] || '';
}

export function assinarXML(xml: string, chaveAcesso: string, certificadoBase64: string, senhaCertificado: string): string {
  const { privateKeyPem, certPem } = lerCertificadoPFX(certificadoBase64, senhaCertificado);

  const sig = new SignedXml({
    privateKey: privateKeyPem,
    publicCert: certPem,
  });
  sig.signatureAlgorithm = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1';
  sig.canonicalizationAlgorithm = 'http://www.w3.org/2001/10/xml-exc-c14n#';

  sig.addReference({
    xpath: '//*[local-name(.)=\'infNFe\']',
    transforms: [
      'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
      'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
    ],
    digestAlgorithm: 'http://www.w3.org/2000/09/xmldsig#sha1',
    uri: `#NFe${chaveAcesso}`,
  });

  sig.computeSignature(xml, {
    location: {
      reference: '//*[local-name(.)=\'infNFe\']',
      action: 'after',
    },
  });

  return sig.getSignedXml();
}

export function validarAssinatura(xmlAssinado: string): boolean {
  const doc = new DOMParser().parseFromString(xmlAssinado, 'text/xml');
  const signatures = doc.getElementsByTagNameNS('http://www.w3.org/2000/09/xmldsig#', 'Signature');
  if (!signatures.length) return false;

  const sig = new SignedXml();
  try {
    sig.loadSignature(signatures[0].toString());
    return sig.checkSignature(xmlAssinado);
  } catch {
    return false;
  }
}
