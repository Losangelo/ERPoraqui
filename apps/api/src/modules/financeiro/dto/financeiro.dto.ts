import { z } from 'zod';

export const criarContaReceberSchema = z.object({
  clienteId: z.string().min(1, 'Cliente é obrigatório'),
  pedidoVendaId: z.string().optional(),
  numeroDocumento: z.string().min(1, 'Número do documento é obrigatório'),
  numeroParcela: z.number().default(1),
  totalParcelas: z.number().default(1),
  dataVencimento: z.date(),
  valorOriginal: z.number().positive('Valor original deve ser positivo'),
  formaPagamento: z.enum(['DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'BOLETO', 'TRANSFERENCIA', 'CHEQUE']).optional(),
  centroCustoId: z.string().optional(),
  observacoes: z.string().optional(),
});

export const receberContaSchema = z.object({
  valorRecebido: z.number().optional(),
  valorDesconto: z.number().min(0).default(0),
  valorJuros: z.number().min(0).default(0),
  valorMulta: z.number().min(0).default(0),
  formaPagamento: z.enum(['DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'BOLETO', 'TRANSFERENCIA', 'CHEQUE']),
  dataRecebimento: z.date().optional(),
});

export const criarContaPagarSchema = z.object({
  fornecedorId: z.string().min(1, 'Fornecedor é obrigatório'),
  pedidoCompraId: z.string().optional(),
  numeroDocumento: z.string().min(1, 'Número do documento é obrigatório'),
  numeroParcela: z.number().default(1),
  totalParcelas: z.number().default(1),
  dataVencimento: z.date(),
  valorOriginal: z.number().positive('Valor original deve ser positivo'),
  formaPagamento: z.enum(['DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'BOLETO', 'TRANSFERENCIA', 'CHEQUE']).optional(),
  centroCustoId: z.string().optional(),
  observacoes: z.string().optional(),
});

export const pagarContaSchema = z.object({
  valorPago: z.number().optional(),
  valorDesconto: z.number().min(0).default(0),
  valorJuros: z.number().min(0).default(0),
  valorMulta: z.number().min(0).default(0),
  formaPagamento: z.enum(['DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'BOLETO', 'TRANSFERENCIA', 'CHEQUE']),
  dataPagamento: z.date().optional(),
});

export const contaFiltroSchema = z.object({
  clienteId: z.string().optional(),
  fornecedorId: z.string().optional(),
  situacao: z.enum(['ABERTA', 'PAGO', 'VENCIDO', 'CANCELADO', 'BAIXADO']).optional(),
  dataInicial: z.date().optional(),
  dataFinal: z.date().optional(),
  pagina: z.number().default(1),
  limite: z.number().default(20),
});

export const criarContaBancariaSchema = z.object({
  banco: z.string().min(1, 'Banco é obrigatório'),
  agencia: z.string().min(1, 'Agência é obrigatória'),
  conta: z.string().min(1, 'Conta é obrigatória'),
  tipo: z.enum(['CORRENTE', 'POUPANCA', 'INVESTIMENTO']).default('CORRENTE'),
  saldoInicial: z.number().default(0),
});

export const criarMovimentacaoBancariaSchema = z.object({
  contaBancariaId: z.string().min(1, 'Conta bancária é obrigatória'),
  dataMovimentacao: z.date(),
  dataCompetencia: z.date().optional(),
  tipo: z.enum(['CREDITO', 'DEBITO']),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  documento: z.string().optional(),
  valor: z.number(),
});

export const conciliarMovimentacaoSchema = z.object({
  movimentacaoId: z.string().min(1, 'Movimentação é obrigatória'),
  conciliacaoId: z.string().min(1, 'Conciliação é obrigatória'),
});

export const criarConciliacaoSchema = z.object({
  contaBancariaId: z.string().min(1, 'Conta bancária é obrigatória'),
  periodoIni: z.date(),
  periodoFin: z.date(),
  observacoes: z.string().optional(),
});

export type CriarContaReceberInput = z.infer<typeof criarContaReceberSchema>;
export type ReceberContaInput = z.infer<typeof receberContaSchema>;
export type CriarContaPagarInput = z.infer<typeof criarContaPagarSchema>;
export type PagarContaInput = z.infer<typeof pagarContaSchema>;
export type ContaFiltro = z.infer<typeof contaFiltroSchema>;
export type CriarContaBancariaInput = z.infer<typeof criarContaBancariaSchema>;
export type CriarMovimentacaoBancariaInput = z.infer<typeof criarMovimentacaoBancariaSchema>;
export type ConciliarMovimentacaoInput = z.infer<typeof conciliarMovimentacaoSchema>;
export type CriarConciliacaoInput = z.infer<typeof criarConciliacaoSchema>;
