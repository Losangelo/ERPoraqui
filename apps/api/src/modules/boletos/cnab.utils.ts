export function padRight(value: string | number, length: number, char = ' '): string {
  const str = String(value ?? '');
  return str.substring(0, length).padEnd(length, char);
}

export function padLeft(value: string | number, length: number, char = '0'): string {
  const str = String(value ?? '');
  return str.substring(0, length).padStart(length, char);
}

export function formatCnabDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  return `${day}${month}${year}`;
}

export function formatCnabValue(value: number): string {
  return String(Math.round(value * 100)).padStart(15, '0');
}

export function formatCnabValueSmall(value: number): string {
  return String(Math.round(value * 100)).padStart(13, '0');
}

export function detectBankFromLine(line: string): string {
  return line.substring(0, 3);
}

export function detectCnabType(fileContent: string): 'CNAB400' | 'CNAB240' {
  const firstLine = fileContent.split('\n')[0];
  if (!firstLine) return 'CNAB400';
  if (firstLine.substring(0, 9) === '888888888') return 'CNAB240';
  const headerTipo = firstLine.substring(0, 1);
  return headerTipo === '0' ? 'CNAB400' : 'CNAB240';
}

interface BoletoCnabData {
  numeroBoleto: string;
  numeroDocumento: string;
  dataVencimento: Date;
  valorOriginal: number;
  valorJuros: number;
  valorMulta: number;
  valorDesconto: number;
  clienteNome: string;
  clienteDocumento: string;
  clienteEndereco?: string;
  clienteBairro?: string;
  clienteCep?: string;
  clienteCidade?: string;
  clienteUf?: string;
  empresaRazaoSocial: string;
  empresaCnpj: string;
  bancoCodigo: string;
  bancoAgencia?: string;
  bancoConta?: string;
  linhaDigitavel?: string;
  codigoBarras?: string;
  instrucoes?: string;
  mensagem?: string;
}

interface RetornoItem {
  nossoNumero: string;
  numeroDocumento: string;
  situacao: string;
  dataOcorrencia: Date | null;
  dataVencimento: Date | null;
  dataPagamento: Date | null;
  valorPago: number;
  valorDocumento: number;
  valorTarifa: number;
  erro: string | null;
  codigoOcorrencia: string;
  descricaoOcorrencia: string;
}

interface RetornoResult {
  empresaCnpj: string;
  empresaNome: string;
  bancoCodigo: string;
  dataArquivo: Date | null;
  totalBoletos: number;
  valorTotal: number;
  itens: RetornoItem[];
  erros: string[];
}

export function gerarCnab400Remessa(boletos: BoletoCnabData[]): string {
  const linhas: string[] = [];
  const now = new Date();

  const header = gerarHeaderCnab400(boletos[0], now);
  linhas.push(header);

  for (const boleto of boletos) {
    const detail = gerarDetalheCnab400(boleto, now);
    linhas.push(detail);
  }

  const trailer = gerarTrailerCnab400(boletos.length, boletos.reduce((s, b) => s + b.valorOriginal, 0));
  linhas.push(trailer);

  return linhas.join('\r\n');
}

function gerarHeaderCnab400(boleto: BoletoCnabData, data: Date): string {
  const linha = [
    '0',                                        // 001 - Tipo registro
    padRight('1', 2),                           // 002-003 - Operacao (1=remessa)
    padRight('REMESSA', 7),                     // 004-010 - Literal remessa
    padRight('01', 2),                          // 011-012 - Codigo servico (01=Cobranca)
    padRight('COBRANCA', 15),                   // 013-027 - Literal servico
    padRight(boleto.empresaCnpj, 14),           // 028-041 - CNPJ da empresa
    padRight(boleto.bancoCodigo, 3),            // 042-044 - Codigo do banco
    padRight('', 7),                            // 045-051 - Brancos
    padRight('', 1),                            // 052 - CNAB
    padRight(boleto.empresaRazaoSocial, 30),    // 053-082 - Nome da empresa
    padRight(boleto.bancoCodigo, 3),            // 083-085 - Codigo banco
    padRight('', 11),                           // 086-096 - Brancos
    padRight(boleto.bancoAgencia ?? '', 5),     // 097-101 - Agencia
    padRight(boleto.bancoConta ?? '', 10),      // 102-111 - Conta
    padRight('', 9),                            // 112-120 - Brancos
    formatCnabDate(data),                       // 121-126 - Data de geracao
    padRight('', 274),                          // 127-400 - Brancos
  ].join('');

  return linha.substring(0, 400).padEnd(400, ' ');
}

function gerarDetalheCnab400(boleto: BoletoCnabData, data: Date): string {
  const valorTotal = boleto.valorOriginal + boleto.valorJuros + boleto.valorMulta - boleto.valorDesconto;
  const endereco = boleto.clienteEndereco ?? '';
  const bairro = boleto.clienteBairro ?? '';
  const cep = (boleto.clienteCep ?? '').replace(/\D/g, '').padStart(8, '0');
  const cidade = boleto.clienteCidade ?? '';
  const uf = boleto.clienteUf ?? '';

  const linha = [
    '1',                                        // 001 - Tipo registro
    padRight('', 5),                            // 002-006 - Brancos
    boleto.linhaDigitavel?.replace(/[ .]/g, '').substring(0, 14).padEnd(14, '0') ?? padRight('', 14), // 007-020 - Linha digitavel
    padRight(boleto.bancoCodigo, 3),            // 021-023 - Codigo banco
    padRight('', 4),                            // 024-027 - Brancos
    padRight('', 1),                            // 028 - CNAB
    padRight('', 6),                            // 029-034 - Brancos
    padRight(boleto.numeroBoleto, 25),          // 035-059 - Numero do boleto
    padRight('', 5),                            // 060-064 - Brancos
    padRight('', 1),                            // 065 - CNAB
    padRight('01', 2),                          // 066-067 - Carteira
    padRight('', 1),                            // 068 - CNAB
    padRight('N', 1),                           // 069 - Especie
    padRight('', 1),                            // 070 - CNAB
    padRight(boleto.numeroDocumento, 10),       // 071-080 - Numero documento
    formatCnabDate(boleto.dataVencimento),      // 081-086 - Data vencimento
    padLeft(valorTotal.toFixed(2).replace('.', ''), 13), // 087-099 - Valor
    padRight('', 19),                           // 100-118 - Brancos
    formatCnabDate(data),                       // 119-124 - Data emissao
    padRight('', 7),                            // 125-131 - Brancos
    padRight('', 12),                           // 132-143 - Brancos
    padRight('', 1),                            // 144 - CNAB
    formatCnabDate(boleto.dataVencimento),      // 145-150 - Data vencimento
    padLeft(boleto.valorMulta.toFixed(2).replace('.', ''), 13), // 151-163 - Valor mora/multa
    padRight('', 60),                           // 164-223 - Brancos/Instrucoes
    padRight(boleto.clienteNome, 37),           // 224-260 - Nome do pagador
    padRight('', 9),                            // 261-269 - Brancos
    padRight(endereco, 37),                     // 270-306 - Endereco
    padRight(bairro, 12),                       // 307-318 - Bairro
    padRight(cep.substring(0, 5), 5),           // 319-323 - CEP
    padRight(cep.substring(5, 8), 3),           // 324-326 - Sufixo CEP
    padRight(cidade, 15),                       // 327-341 - Cidade
    padRight(uf, 2),                            // 342-343 - UF
    padRight('', 57),                           // 344-400 - Brancos
  ].join('');

  return linha.substring(0, 400).padEnd(400, ' ');
}

function gerarTrailerCnab400(totalBoletos: number, valorTotal: number): string {
  const linha = [
    '9',                                        // 001 - Tipo registro
    padRight('', 393),                          // 002-394 - Brancos
    padLeft(totalBoletos, 6),                   // 395-400 - Total de registros
  ].join('');

  return linha.substring(0, 400).padEnd(400, ' ');
}

export function parseCnab400Retorno(fileContent: string): RetornoResult {
  const linhas = fileContent.split('\n').filter((l) => l.trim().length > 0);
  const result: RetornoResult = {
    empresaCnpj: '',
    empresaNome: '',
    bancoCodigo: '',
    dataArquivo: null,
    totalBoletos: 0,
    valorTotal: 0,
    itens: [],
    erros: [],
  };

  for (const linha of linhas) {
    const tipo = linha.substring(0, 1);

    if (tipo === '0') {
      result.empresaCnpj = linha.substring(28, 42).trim();
      result.empresaNome = linha.substring(53, 83).trim();
      result.bancoCodigo = linha.substring(42, 45).trim();
      const dataStr = linha.substring(121, 127).trim();
      if (dataStr.length === 6) {
        const day = parseInt(dataStr.substring(0, 2));
        const month = parseInt(dataStr.substring(2, 4)) - 1;
        const year = parseInt('20' + dataStr.substring(4, 6));
        result.dataArquivo = new Date(year, month, day);
      }
    }

    if (tipo === '1') {
      const codigoOcorrencia = linha.substring(108, 110).trim();
      const item: RetornoItem = {
        nossoNumero: linha.substring(35, 60).trim(),
        numeroDocumento: linha.substring(71, 81).trim(),
        situacao: mapearSituacaoRetorno(codigoOcorrencia),
        dataOcorrencia: parseDateField6(linha.substring(110, 116)),
        dataVencimento: parseDateField6(linha.substring(81, 87)),
        dataPagamento: parseDateField6(linha.substring(116, 122)),
        valorPago: parseFloat(linha.substring(122, 135)) / 100,
        valorDocumento: parseFloat(linha.substring(87, 100)) / 100,
        valorTarifa: parseFloat(linha.substring(153, 158)) / 100,
        erro: codigoOcorrencia !== '06' ? getDescricaoOcorrencia(codigoOcorrencia) : null,
        codigoOcorrencia,
        descricaoOcorrencia: getDescricaoOcorrencia(codigoOcorrencia),
      };
      result.itens.push(item);
    }

    if (tipo === '9') {
      result.totalBoletos = parseInt(linha.substring(395, 400)) || 0;
    }
  }

  result.valorTotal = result.itens.reduce((s, i) => s + i.valorPago, 0);
  return result;
}

function mapearSituacaoRetorno(codigo: string): string {
  const mapa: Record<string, string> = {
    '02': 'BAIXADO',
    '06': 'BAIXADO',
    '09': 'CANCELADO',
    '10': 'BAIXADO',
    '11': 'CANCELADO',
    '14': 'BAIXADO',
    '15': 'BAIXADO_MANUALMENTE',
    '17': 'CANCELADO',
    '19': 'BAIXADO',
    '20': 'BAIXADO',
    '24': 'CANCELADO',
    '41': 'BAIXADO',
  };
  return mapa[codigo] || 'PENDENTE';
}

function getDescricaoOcorrencia(codigo: string): string {
  const mapa: Record<string, string> = {
    '02': 'Confirmação de entrada',
    '03': 'Rejeição do título',
    '04': 'Alteração de vencimento',
    '05': 'Alteração de dados',
    '06': 'Liquidação',
    '07': 'Liquidação por conta',
    '08': 'Liquidação em cartório',
    '09': 'Baixa simples',
    '10': 'Baixa por protesto',
    '11': 'Sustação de protesto',
    '12': 'Abatimento concedido',
    '13': 'Abatimento cancelado',
    '14': 'Alteração de vencimento',
    '15': 'Liquidação em cartório',
    '16': 'Confirmação de protesto',
    '17': 'Cancelamento de protesto',
    '18': 'Alteração do título',
    '19': 'Confirmação de instrução',
    '20': 'Débito de tarifas',
    '21': 'Baixa rejeitada',
    '22': 'Título em aberto',
    '23': 'Encaminhado a protesto',
    '24': 'Sustado de protesto',
    '25': 'Protesto sustado',
    '41': 'Título pago em dinheiro',
  };
  return mapa[codigo] || 'Ocorrência desconhecida';
}

function parseDateField6(dataStr: string): Date | null {
  if (!dataStr || dataStr.trim().length !== 6) return null;
  if (dataStr === '000000') return null;
  const day = parseInt(dataStr.substring(0, 2));
  const month = parseInt(dataStr.substring(2, 4)) - 1;
  const year = parseInt('20' + dataStr.substring(4, 6));
  return new Date(year, month, day);
}

export function parseCnab240Retorno(fileContent: string): RetornoResult {
  const linhas = fileContent.split('\n').filter((l) => l.trim().length > 0);
  const result: RetornoResult = {
    empresaCnpj: '',
    empresaNome: '',
    bancoCodigo: '',
    dataArquivo: null,
    totalBoletos: 0,
    valorTotal: 0,
    itens: [],
    erros: [],
  };

  let currentItem: Partial<RetornoItem> | null = null;

  for (const linha of linhas) {
    const tipo = linha.substring(7, 8);

    if (tipo === '0') {
      result.bancoCodigo = linha.substring(0, 3).trim();
      result.empresaCnpj = linha.substring(18, 32).trim();
      result.empresaNome = linha.substring(73, 103).trim();
      const dataStr = linha.substring(147, 153).trim();
      if (dataStr.length === 6) {
        const day = parseInt(dataStr.substring(0, 2));
        const month = parseInt(dataStr.substring(2, 4)) - 1;
        const year = parseInt('20' + dataStr.substring(4, 6));
        result.dataArquivo = new Date(year, month, day);
      }
    }

    if (tipo === '3') {
      const segmento = linha.substring(13, 14);

      if (segmento === 'T') {
        const codigoOcorrencia = linha.substring(15, 17).trim();
        currentItem = {
          codigoOcorrencia,
          descricaoOcorrencia: getDescricaoOcorrencia(codigoOcorrencia),
          situacao: mapearSituacaoRetorno(codigoOcorrencia),
          dataOcorrencia: parseDateField8(linha.substring(67, 75)),
          dataPagamento: parseDateField8(linha.substring(82, 90)),
          valorPago: parseFloat(linha.substring(95, 110)) / 100,
          valorTarifa: parseFloat(linha.substring(110, 125)) / 100,
          erro: codigoOcorrencia !== '06' ? getDescricaoOcorrencia(codigoOcorrencia) : null,
        };
      }

      if (segmento === 'U') {
        if (currentItem) {
          currentItem.nossoNumero = linha.substring(48, 73).trim();
          currentItem.numeroDocumento = linha.substring(108, 128).trim();
          currentItem.dataVencimento = parseDateField8(linha.substring(152, 160));
          currentItem.valorDocumento = parseFloat(linha.substring(160, 176)) / 100;

          result.itens.push(currentItem as RetornoItem);
        }
        currentItem = null;
      }
    }

    if (tipo === '9') {
      result.totalBoletos = parseInt(linha.substring(153, 163)) || 0;
    }
  }

  result.valorTotal = result.itens.reduce((s, i) => s + i.valorPago, 0);
  return result;
}

function parseDateField8(dataStr: string): Date | null {
  if (!dataStr || dataStr.trim().length !== 8) return null;
  if (dataStr === '00000000') return null;
  const day = parseInt(dataStr.substring(6, 8));
  const month = parseInt(dataStr.substring(4, 6)) - 1;
  const year = parseInt(dataStr.substring(0, 4));
  return new Date(year, month, day);
}

export function gerarCnab240Remessa(boletos: BoletoCnabData[]): string {
  const linhas: string[] = [];
  const now = new Date();

  const header = gerarHeaderCnab240(boletos[0], now);
  linhas.push(header);

  for (const boleto of boletos) {
    const segmentoP = gerarSegmentoCnab240P(boleto);
    const segmentoQ = gerarSegmentoCnab240Q(boleto);
    const segmentoR = gerarSegmentoCnab240R(boleto);
    linhas.push(segmentoP);
    linhas.push(segmentoQ);
    linhas.push(segmentoR);
  }

  const trailer = gerarTrailerCnab240(boletos.length, boletos.reduce((s, b) => s + b.valorOriginal, 0));
  linhas.push(trailer);

  return linhas.join('\r\n');
}

function gerarHeaderCnab240(boleto: BoletoCnabData, data: Date): string {
  const linha = [
    padRight(boleto.bancoCodigo, 3),           // 001-003 - Banco
    padLeft('0', 4),                            // 004-007 - Lote
    padRight('0', 1),                           // 008 - Tipo registro
    padRight('', 9),                            // 009-017 - CNAB
    padRight('1', 2),                           // 018-019 - Tipo operacao
    padRight('01', 2),                          // 020-021 - Tipo servico
    padRight('', 2),                            // 022-023 - CNAB
    padRight('', 10),                           // 024-033 - Versao layout
    padRight('', 1),                            // 034 - CNAB
    padRight(boleto.empresaCnpj, 14),           // 035-048 - CNPJ
    padRight('', 20),                           // 049-068 - Convenio
    padRight(boleto.bancoAgencia ?? '', 5),     // 069-073 - Agencia
    padLeft(boleto.bancoConta ?? '', 12),       // 074-085 - Conta
    padRight('', 1),                            // 086 - DAC
    padRight('', 1),                            // 087 - CNAB
    padRight(boleto.empresaRazaoSocial, 30),    // 088-117 - Nome empresa
    padRight(boleto.bancoCodigo, 3),            // 118-120 - Nome banco
    padRight('', 10),                           // 121-130 - CNAB
    padRight('1', 1),                           // 131 - Codigo remessa
    padRight(formatCnabDate(data), 6),          // 132-137 - Data geracao
    padRight('000000', 6),                      // 138-143 - Hora geracao
    padLeft('1', 6),                            // 144-149 - Numero sequencial
    padRight('', 57),                           // 150-206 - CNAB
    padRight('', 34),                           // 207-240 - CNAB
  ].join('');

  return linha.substring(0, 240).padEnd(240, ' ');
}

function gerarSegmentoCnab240P(boleto: BoletoCnabData): string {
  const valorTotal = boleto.valorOriginal + boleto.valorJuros + boleto.valorMulta - boleto.valorDesconto;

  const linha = [
    padRight(boleto.bancoCodigo, 3),           // 001-003 - Banco
    padLeft('1', 4),                            // 004-007 - Lote
    padRight('3', 1),                           // 008 - Tipo registro
    padRight('P', 1),                           // 009 - Segmento
    padRight('', 1),                            // 010 - CNAB
    padRight('01', 2),                          // 011-012 - Movimento
    padRight('', 3),                            // 013-015 - CNAB
    padRight(boleto.bancoAgencia ?? '', 5),     // 016-020 - Agencia
    padLeft(boleto.bancoConta ?? '', 12),       // 021-032 - Conta
    padRight('', 1),                            // 033 - DAC
    padRight('', 1),                            // 034 - CNAB
    padRight(boleto.numeroBoleto, 20),          // 035-054 - Nosso numero
    padRight('', 5),                            // 055-059 - CNAB
    padRight('01', 2),                          // 060-061 - Carteira
    padRight('', 1),                            // 062 - Cadastramento
    padRight('', 1),                            // 063 - Documento
    padRight('', 10),                           // 064-073 - Brancos
    padRight(boleto.numeroDocumento, 15),       // 074-088 - Numero documento
    formatCnabDate(boleto.dataVencimento),      // 089-094 - Data vencimento
    padLeft(String(Math.round(valorTotal * 100)), 15), // 095-109 - Valor
    padRight('', 5),                            // 110-114 - CNAB
    padRight('', 15),                           // 115-129 - CNAB
    padRight('', 1),                            // 130 - CNAB
    padRight('', 10),                           // 131-140 - CNAB
    padRight('', 1),                            // 141 - CNAB
    padRight(boleto.linhaDigitavel?.replace(/[ .]/g, '') ?? padRight('', 0), 1), // 142 - DV codigo barras
    padRight('', 33),                           // 143-175 - CNAB
    padRight('', 10),                           // 176-185 - CNAB
    padRight('', 8),                            // 186-193 - CNAB
    padRight('', 47),                           // 194-240 - CNAB
  ].join('');

  return linha.substring(0, 240).padEnd(240, ' ');
}

function gerarSegmentoCnab240Q(boleto: BoletoCnabData): string {
  const endereco = boleto.clienteEndereco ?? '';
  const bairro = boleto.clienteBairro ?? '';
  const cep = (boleto.clienteCep ?? '').replace(/\D/g, '').padStart(8, '0');
  const cidade = boleto.clienteCidade ?? '';
  const uf = boleto.clienteUf ?? '';

  const linha = [
    padRight(boleto.bancoCodigo, 3),           // 001-003 - Banco
    padLeft('1', 4),                            // 004-007 - Lote
    padRight('3', 1),                           // 008 - Tipo registro
    padRight('Q', 1),                           // 009 - Segmento
    padRight('', 1),                            // 010 - CNAB
    padRight('01', 2),                          // 011-012 - Movimento
    padRight('', 3),                            // 013-015 - CNAB
    padRight(boleto.clienteNome, 40),           // 016-055 - Nome pagador
    padRight('', 15),                           // 056-070 - CNAB
    padRight(endereco, 40),                     // 071-110 - Endereco
    padRight(bairro, 15),                       // 111-125 - Bairro
    padRight(cep.substring(0, 5), 5),           // 126-130 - CEP
    padRight(cep.substring(5, 8), 3),           // 131-133 - Sufixo CEP
    padRight(cidade, 20),                       // 134-153 - Cidade
    padRight(uf, 2),                            // 154-155 - UF
    padRight('', 85),                           // 156-240 - CNAB
  ].join('');

  return linha.substring(0, 240).padEnd(240, ' ');
}

function gerarSegmentoCnab240R(boleto: BoletoCnabData): string {
  const linha = [
    padRight(boleto.bancoCodigo, 3),           // 001-003 - Banco
    padLeft('1', 4),                            // 004-007 - Lote
    padRight('3', 1),                           // 008 - Tipo registro
    padRight('R', 1),                           // 009 - Segmento
    padRight('', 1),                            // 010 - CNAB
    padRight('01', 2),                          // 011-012 - Movimento
    padRight('', 3),                            // 013-015 - CNAB
    padRight(boleto.valorJuros > 0 ? '2' : '0', 2), // 016-017 - Tipo desconto
    padLeft(String(Math.round(boleto.valorDesconto * 100)), 15), // 018-032 - Valor desconto
    padRight('', 15),                           // 033-047 - CNAB
    padRight('', 15),                           // 048-062 - CNAB
    padRight('', 15),                           // 063-077 - CNAB
    padLeft(String(Math.round(boleto.valorMulta * 100)), 15), // 078-092 - Valor multa
    padRight(boleto.instrucoes?.substring(0, 10) ?? padRight('', 10), 10), // 093-102 - Instrucao 1
    padRight(boleto.mensagem?.substring(0, 10) ?? padRight('', 10), 10), // 103-112 - Instrucao 2
    padRight('', 128),                          // 113-240 - CNAB
  ].join('');

  return linha.substring(0, 240).padEnd(240, ' ');
}

function gerarTrailerCnab240(totalBoletos: number, valorTotal: number): string {
  const linha = [
    padRight('', 3),                            // 001-003 - Banco
    padRight('9999', 4),                        // 004-007 - Lote
    padRight('9', 1),                           // 008 - Tipo registro
    padRight('', 9),                            // 009-017 - CNAB
    padLeft(totalBoletos, 6),                   // 018-023 - Quantidade lotes
    padLeft(totalBoletos, 6),                   // 024-029 - Quantidade registros
    padLeft(String(Math.round(valorTotal * 100)), 16), // 030-045 - Total valor
    padRight('', 195),                          // 046-240 - CNAB
  ].join('');

  return linha.substring(0, 240).padEnd(240, ' ');
}
