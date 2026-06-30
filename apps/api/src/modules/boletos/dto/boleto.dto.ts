import { z } from 'zod';

export const criarBoletoSchema = z.object({
  contaReceberId: z.string().min(1, 'Conta a receber é obrigatória'),
  bancoId: z.string().optional(),
  numeroBoleto: z.string().min(1, 'Número do boleto é obrigatório'),
  dataVencimento: z.date().min(new Date(), 'Data de vencimento deve ser futura'),
  valorOriginal: z.number().positive('Valor original deve ser maior que zero'),
  valorJuros: z.number().min(0).default(0),
  valorMulta: z.number().min(0).default(0),
  valorDesconto: z.number().min(0).default(0),
  instrucoes: z.string().optional(),
  mensagem: z.string().optional(),
});

export const atualizarBoletoSchema = z.object({
  dataVencimento: z.date().optional(),
  valorJuros: z.number().min(0).optional(),
  valorMulta: z.number().min(0).optional(),
  valorDesconto: z.number().min(0).optional(),
  instrucoes: z.string().optional(),
  mensagem: z.string().optional(),
  situacao: z.enum(['EMITIDO', 'ENVIADO', 'BAIXADO', 'BAIXADO_MANUALMENTE', 'CANCELADO', 'VENCIDO', 'PROTESTADO', 'CARTA_CORRECAO']).optional(),
});

export const baixarBoletoSchema = z.object({
  dataPagamento: z.date(),
  valorPago: z.number(),
  valorJuros: z.number().min(0).default(0),
  valorMulta: z.number().min(0).default(0),
  valorDesconto: z.number().min(0).default(0),
});

export const boletoFiltroSchema = z.object({
  contaReceberId: z.string().optional(),
  situacao: z.enum(['EMITIDO', 'ENVIADO', 'BAIXADO', 'BAIXADO_MANUALMENTE', 'CANCELADO', 'VENCIDO', 'PROTESTADO', 'CARTA_CORRECAO']).optional(),
  dataInicial: z.date().optional(),
  dataFinal: z.date().optional(),
  pagina: z.number().default(1),
  limite: z.number().default(20),
});

export const criarBancoSchema = z.object({
  codigo: z.string().min(1, 'Código do banco é obrigatório'),
  nome: z.string().min(1, 'Nome do banco é obrigatório'),
  nomeReduzido: z.string().min(1, 'Nome reduzido é obrigatório'),
  cnpj: z.string().optional(),
  ativo: z.boolean().default(true),
});

export const gerarRemessaSchema = z.object({
  tipoArquivo: z.enum(['CNAB400', 'CNAB240']).default('CNAB400'),
});

export const gerarRemessaLoteSchema = z.object({
  boletoIds: z.array(z.string().min(1)).min(1, 'Selecione ao menos um boleto'),
  tipoArquivo: z.enum(['CNAB400', 'CNAB240']).default('CNAB400'),
});

export const processarRetornoSchema = z.object({
  conteudo: z.string().min(1, 'Conteúdo do arquivo é obrigatório'),
  tipoArquivo: z.enum(['CNAB400', 'CNAB240']).default('CNAB400'),
  nomeArquivo: z.string().optional(),
});

export const remessaHistoricoFiltroSchema = z.object({
  pagina: z.number().default(1),
  limite: z.number().default(20),
});

export type CriarBoletoInput = z.infer<typeof criarBoletoSchema>;
export type AtualizarBoletoInput = z.infer<typeof atualizarBoletoSchema>;
export type BaixarBoletoInput = z.infer<typeof baixarBoletoSchema>;
export type BoletoFiltro = z.infer<typeof boletoFiltroSchema>;
export type CriarBancoInput = z.infer<typeof criarBancoSchema>;
export type GerarRemessaInput = z.infer<typeof gerarRemessaSchema>;
export type GerarRemessaLoteInput = z.infer<typeof gerarRemessaLoteSchema>;
export type ProcessarRetornoInput = z.infer<typeof processarRetornoSchema>;
export type RemessaHistoricoFiltro = z.infer<typeof remessaHistoricoFiltroSchema>;
