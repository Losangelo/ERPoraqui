import { z } from 'zod';

export const criarChequeSchema = z.object({
  contaBancariaId: z.string().optional(),
  clienteId: z.string().optional(),
  fornecedorId: z.string().optional(),
  numero: z.string().min(1, 'Número do cheque é obrigatório'),
  banco: z.string().min(1, 'Banco é obrigatório'),
  agencia: z.string().min(1, 'Agência é obrigatória'),
  conta: z.string().min(1, 'Conta é obrigatória'),
  emitente: z.string().min(1, 'Emitente é obrigatório'),
  valor: z.number().positive('Valor deve ser positivo'),
  dataEmissao: z.date(),
  dataVencimento: z.date(),
  tipo: z.enum(['RECEBIDO', 'EMITIDO']).default('RECEBIDO'),
  observacoes: z.string().optional(),
});

export const atualizarChequeSchema = z.object({
  numero: z.string().optional(),
  banco: z.string().optional(),
  agencia: z.string().optional(),
  conta: z.string().optional(),
  emitente: z.string().optional(),
  valor: z.number().positive().optional(),
  dataEmissao: z.date().optional(),
  dataVencimento: z.date().optional(),
  observacoes: z.string().optional(),
});

export const devolverChequeSchema = z.object({
  motivoDevolucao: z.string().min(1, 'Motivo da devolução é obrigatório'),
});

export const chequeFiltroSchema = z.object({
  tipo: z.enum(['RECEBIDO', 'EMITIDO']).optional(),
  situacao: z.enum(['EM_CARTEIRA', 'DEPOSITADO', 'COMPENSADO', 'DEVOLVIDO', 'REPASSADO', 'CANCELADO']).optional(),
  dataInicial: z.date().optional(),
  dataFinal: z.date().optional(),
  clienteId: z.string().optional(),
  fornecedorId: z.string().optional(),
  pagina: z.number().default(1),
  limite: z.number().default(20),
});

export type CriarChequeInput = z.infer<typeof criarChequeSchema>;
export type AtualizarChequeInput = z.infer<typeof atualizarChequeSchema>;
export type DevolverChequeInput = z.infer<typeof devolverChequeSchema>;
export type ChequeFiltro = z.infer<typeof chequeFiltroSchema>;
