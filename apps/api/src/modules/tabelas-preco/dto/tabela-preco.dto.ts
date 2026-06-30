import { z } from 'zod';

export const criarTabelaPrecoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(255),
  descricao: z.string().optional(),
  tipo: z.enum(['VISTA', 'PRAZO', 'PROMOCAO', 'ESPECIAL']).default('VISTA'),
  markupBase: z.number().min(0).default(0),
  ativo: z.boolean().default(true),
});

export const atualizarTabelaPrecoSchema = criarTabelaPrecoSchema.partial();

export const tabelaPrecoFiltroSchema = z.object({
  nome: z.string().optional(),
  tipo: z.string().optional(),
  ativo: z.boolean().optional(),
  pagina: z.number().min(1).default(1),
  limite: z.number().min(1).max(100).default(20),
});

export const criarTabelaPrecoItemSchema = z.object({
  produtoId: z.string().min(1, 'Produto é obrigatório'),
  precoVenda: z.number().min(0, 'Preço de venda deve ser positivo'),
  precoMinimo: z.number().min(0).default(0),
  descontoMaximo: z.number().min(0).max(100).default(0),
});

export const atualizarTabelaPrecoItemSchema = criarTabelaPrecoItemSchema.partial();

export const calcularPrecoSchema = z.object({
  produtoId: z.string().min(1, 'Produto é obrigatório'),
  precoCusto: z.number().min(0).optional(),
});

export type CriarTabelaPrecoInput = z.infer<typeof criarTabelaPrecoSchema>;
export type AtualizarTabelaPrecoInput = z.infer<typeof atualizarTabelaPrecoSchema>;
export type TabelaPrecoFiltro = z.infer<typeof tabelaPrecoFiltroSchema>;
export type CriarTabelaPrecoItemInput = z.infer<typeof criarTabelaPrecoItemSchema>;
export type AtualizarTabelaPrecoItemInput = z.infer<typeof atualizarTabelaPrecoItemSchema>;
export type CalcularPrecoInput = z.infer<typeof calcularPrecoSchema>;
