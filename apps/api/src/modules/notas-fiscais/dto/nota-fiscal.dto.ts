import { z } from 'zod';

export const criarNotaFiscalSchema = z.object({
  filialId: z.string().min(1, 'Filial é obrigatória'),
  clienteId: z.string().optional(),
  fornecedorId: z.string().optional(),
  pedidoVendaId: z.string().optional(),
  tipoDocumento: z.enum(['ENTRADA', 'SAIDA']),
  modelo: z.enum(['NFE', 'NFCE', 'NFS_E']).default('NFE'),
  serie: z.string().default('001'),
  tipoOperacao: z.enum(['OPERACAO_INTERNA', 'OPERACAO_INTERESTADUAL', 'OPERACAO_EXTERIOR']).default('OPERACAO_INTERNA'),
  finalidadeEmissao: z.enum(['NORMAL', 'COMPLEMENTAR', 'AJUSTE', 'DEVOLUCAO']).default('NORMAL'),
  naturezaOperacao: z.string().min(1, 'Natureza da operação é obrigatória'),
  dataSaida: z.date().optional(),
  observacoes: z.string().optional(),
  informacoesComplementares: z.string().optional(),
    itens: z.array(z.object({
    produtoId: z.string().optional(),
    codigo: z.string(),
    descricao: z.string(),
    ncm: z.string().optional(),
    cfop: z.string(),
    unidadeComercial: z.string(),
    quantidadeComercial: z.number().positive(),
    valorUnitarioComercial: z.number().positive(),
    valorDesconto: z.number().min(0).default(0),
    codigoEAN: z.string().optional(),
    origemMercadoria: z.string().default('0'),
    icmsAliquota: z.number().min(0).default(0),
    icmsBaseCalculo: z.number().min(0).default(0),
    icmsValor: z.number().min(0).default(0),
    pisAliquota: z.number().min(0).default(0),
    pisValor: z.number().min(0).default(0),
    cofinsAliquota: z.number().min(0).default(0),
    cofinsValor: z.number().min(0).default(0),
    ipiAliquota: z.number().min(0).default(0),
    ipiValor: z.number().min(0).default(0),
    isAliquota: z.number().min(0).default(0),
  })).min(1, 'Pelo menos um item é obrigatório'),
});

export const atualizarNotaFiscalSchema = z.object({
  situacao: z.enum(['EM_DIGITACAO', 'EM_PROCESSAMENTO', 'ASSINADA', 'ENVIADA', 'AUTORIZADA', 'DENEGADA', 'CANCELADA', 'INUTILIZADA', 'CONTINGENCIA']).optional(),
  dataSaida: z.date().optional(),
  observacoes: z.string().optional(),
  informacoesComplementares: z.string().optional(),
});

export const cancelarNotaFiscalSchema = z.object({
  justificativa: z.string().min(15, 'Justificativa deve ter pelo menos 15 caracteres'),
});

export const cartaCorrecaoSchema = z.object({
  justificativa: z.string().min(15, 'Justificativa deve ter pelo menos 15 caracteres'),
});

export const configurarCertificadoSchema = z.object({
  certificadoDigital: z.string().min(1, 'Certificado digital é obrigatório'),
  senhaCertificado: z.string().min(1, 'Senha do certificado é obrigatória'),
  csc: z.string().optional(),
  cscId: z.string().optional(),
  ambiente: z.enum(['PRODUCAO', 'HOMOLOGACAO']).default('HOMOLOGACAO'),
  uf: z.string().length(2).default('SP'),
  municipio: z.string().optional(),
});

export const notaFiscalFiltroSchema = z.object({
  filialId: z.string().optional(),
  clienteId: z.string().optional(),
  modelo: z.enum(['NFE', 'NFCE', 'NFS_E']).optional(),
  situacao: z.enum(['EM_DIGITACAO', 'EM_PROCESSAMENTO', 'ASSINADA', 'ENVIADA', 'AUTORIZADA', 'DENEGADA', 'CANCELADA', 'INUTILIZADA', 'CONTINGENCIA']).optional(),
  dataInicial: z.date().optional(),
  dataFinal: z.date().optional(),
  pagina: z.number().default(1),
  limite: z.number().default(20),
});

export type CriarNotaFiscalInput = z.infer<typeof criarNotaFiscalSchema>;
export type AtualizarNotaFiscalInput = z.infer<typeof atualizarNotaFiscalSchema>;
export type CancelarNotaFiscalInput = z.infer<typeof cancelarNotaFiscalSchema>;
export type CartaCorrecaoInput = z.infer<typeof cartaCorrecaoSchema>;
export type ConfigurarCertificadoInput = z.infer<typeof configurarCertificadoSchema>;
export type NotaFiscalFiltro = z.infer<typeof notaFiscalFiltroSchema>;
