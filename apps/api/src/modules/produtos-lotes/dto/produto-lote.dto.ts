import { z } from 'zod';

export const criarProdutoLoteSchema = z.object({
  produtoId: z.string().min(1, 'Produto é obrigatório'),
  codigoLote: z.string().min(1, 'Código do lote é obrigatório').max(100),
  dataFabricacao: z.string().datetime().optional(),
  dataValidade: z.string().datetime().optional(),
  quantidade: z.number().min(0).default(0),
  quantidadeOriginal: z.number().min(0).default(0),
  custoUnitario: z.number().min(0).default(0),
  ativo: z.boolean().default(true),
});

export const atualizarProdutoLoteSchema = criarProdutoLoteSchema.partial();

export const produtoLoteFiltroSchema = z.object({
  produtoId: z.string().optional(),
  ativo: z.boolean().optional(),
  pagina: z.number().min(1).default(1),
  limite: z.number().min(1).max(100).default(20),
});

export const ajustarEstoqueSchema = z.object({
  quantidade: z.number(),
  motivo: z.string().optional(),
});

export type CriarProdutoLoteInput = z.infer<typeof criarProdutoLoteSchema>;
export type AtualizarProdutoLoteInput = z.infer<typeof atualizarProdutoLoteSchema>;
export type ProdutoLoteFiltro = z.infer<typeof produtoLoteFiltroSchema>;
export type AjustarEstoqueInput = z.infer<typeof ajustarEstoqueSchema>;
