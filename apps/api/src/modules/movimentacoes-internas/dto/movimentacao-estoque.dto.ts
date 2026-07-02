import { z } from 'zod';

export const MovimentacaoEstoqueSchema = z.object({
  produtoId: z.string().min(1, 'Produto é obrigatório'),
  tipoMovimentacao: z.enum(['ENTRADA', 'SAIDA', 'TRANSFERENCIA', 'AJUSTE', 'DEVOLUCAO']),
  quantidade: z.number().positive('Quantidade deve ser maior que zero'),
  motivo: z.string().optional(),
});

export const MovimentacaoEstoqueFiltroSchema = z.object({
  produtoId: z.string().optional(),
  tipoMovimentacao: z.enum(['ENTRADA', 'SAIDA', 'TRANSFERENCIA', 'AJUSTE', 'DEVOLUCAO']).optional(),
  dataInicial: z.string().optional(),
  dataFinal: z.string().optional(),
  pagina: z.number().int().positive().default(1),
  limite: z.number().int().positive().max(100).default(20),
});

export const HistoricoProdutoSchema = z.object({
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
  pagina: z.coerce.number().int().positive().default(1),
  limite: z.coerce.number().int().positive().max(200).default(100),
});

export type MovimentacaoEstoqueInput = z.infer<typeof MovimentacaoEstoqueSchema>;
export type MovimentacaoEstoqueFiltro = z.infer<typeof MovimentacaoEstoqueFiltroSchema>;
export type HistoricoProdutoParams = z.infer<typeof HistoricoProdutoSchema>;
