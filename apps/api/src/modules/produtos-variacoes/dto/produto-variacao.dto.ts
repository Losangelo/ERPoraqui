import { z } from 'zod';

export const criarProdutoVariacaoSchema = z.object({
  produtoId: z.string().min(1, 'Produto é obrigatório'),
  sku: z.string().min(1, 'SKU é obrigatório').max(100),
  nome: z.string().min(1, 'Nome é obrigatório').max(255),
  valor: z.string().min(1, 'Valor é obrigatório').max(100),
  precoAdicional: z.number().min(0).default(0),
  estoque: z.number().min(0).default(0),
  codigoBarras: z.string().optional(),
  ativo: z.boolean().default(true),
});

export const atualizarProdutoVariacaoSchema = criarProdutoVariacaoSchema.partial();

export const produtoVariacaoFiltroSchema = z.object({
  produtoId: z.string().optional(),
  ativo: z.boolean().optional(),
  pagina: z.number().min(1).default(1),
  limite: z.number().min(1).max(100).default(20),
});

export type CriarProdutoVariacaoInput = z.infer<typeof criarProdutoVariacaoSchema>;
export type AtualizarProdutoVariacaoInput = z.infer<typeof atualizarProdutoVariacaoSchema>;
export type ProdutoVariacaoFiltro = z.infer<typeof produtoVariacaoFiltroSchema>;
