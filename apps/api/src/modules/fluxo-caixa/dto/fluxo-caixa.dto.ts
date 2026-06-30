import { z } from 'zod';

export const FluxoCaixaSchema = z.object({
  tipo: z.enum(['ENTRADA', 'SAIDA']),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  valor: z.number().positive('Valor deve ser maior que zero'),
  formaPagamento: z.enum(['DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'BOLETO', 'TRANSFERENCIA', 'CHEQUE']),
  dataMovimentacao: z.string().optional(),
  referenciaId: z.string().optional(),
  referenciaTipo: z.string().optional(),
});

export const FluxoCaixaFiltroSchema = z.object({
  tipo: z.enum(['ENTRADA', 'SAIDA']).optional(),
  categoria: z.string().optional(),
  dataInicial: z.string().optional(),
  dataFinal: z.string().optional(),
  pagina: z.number().int().positive().default(1),
  limite: z.number().int().positive().max(100).default(20),
});

export type FluxoCaixaInput = z.infer<typeof FluxoCaixaSchema>;
export type FluxoCaixaFiltro = z.infer<typeof FluxoCaixaFiltroSchema>;
