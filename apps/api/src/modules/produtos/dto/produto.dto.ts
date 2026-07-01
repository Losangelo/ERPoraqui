import { z } from 'zod';

export const criarProdutoSchema = z.object({
  codigoInterno: z.string().min(1, 'Código interno é obrigatório').max(50),
  codigoBarras: z.string().optional(),
  gtin: z.string().optional(),
  nome: z.string().min(1, 'Nome é obrigatório').max(255),
  descricao: z.string().optional(),
  descricaoDetalhada: z.string().optional(),
  categoriaId: z.string().optional(),
  unidadeMedidaId: z.string().optional(),
  precoVenda: z.number().min(0, 'Preço de venda deve ser positivo'),
  precoCusto: z.number().min(0).default(0),
  precoMinimo: z.number().min(0).default(0),
  quantidadeEstoque: z.number().min(0).default(0),
  estoqueMinimo: z.number().min(0).default(0),
  estoqueMaximo: z.number().min(0).default(0),
  pesoBruto: z.number().optional(),
  pesoLiquido: z.number().optional(),
  volume: z.number().optional(),
  ncm: z.string().length(8, 'NCM deve ter 8 dígitos').optional(),
  cest: z.string().optional(),
  origenMercadoria: z.enum(['NACIONAL', 'ESTRANGEIRA_IMPORTACAO_DIRETA', 'ESTRANGEIRA_NACIONALIZADA']).default('NACIONAL'),
  ativo: z.boolean().default(true),
});

export const atualizarProdutoSchema = criarProdutoSchema.partial();

export const produtoFiltroSchema = z.object({
  nome: z.string().optional(),
  codigoInterno: z.string().optional(),
  codigoBarras: z.string().optional(),
  categoriaId: z.string().optional(),
  ativo: z.boolean().optional(),
  pagina: z.coerce.number().min(1).default(1),
  limite: z.coerce.number().min(1).max(500).default(20),
});

export type CriarProdutoInput = z.infer<typeof criarProdutoSchema>;
export type AtualizarProdutoInput = z.infer<typeof atualizarProdutoSchema>;
export type ProdutoFiltro = z.infer<typeof produtoFiltroSchema>;

export const produtoResponseSchema = z.object({
  id: z.string(),
  empresaId: z.string(),
  codigoInterno: z.string(),
  codigoBarras: z.string().nullable(),
  gtin: z.string().nullable(),
  nome: z.string(),
  descricao: z.string().nullable(),
  descricaoDetalhada: z.string().nullable(),
  categoriaId: z.string().nullable(),
  unidadeMedidaId: z.string().nullable(),
  precoVenda: z.number(),
  precoCusto: z.number(),
  precoMinimo: z.number(),
  quantidadeEstoque: z.number(),
  estoqueMinimo: z.number(),
  estoqueMaximo: z.number(),
  pesoBruto: z.number().nullable(),
  pesoLiquido: z.number().nullable(),
  volume: z.number().nullable(),
  ncm: z.string().nullable(),
  cest: z.string().nullable(),
  origenMercadoria: z.string(),
  ativo: z.boolean(),
  dataCriacao: z.date(),
  dataAtualizacao: z.date(),
});

export type ProdutoResponse = z.infer<typeof produtoResponseSchema>;

export const listaProdutosResponseSchema = z.object({
  dados: z.array(produtoResponseSchema),
  meta: z.object({
    pagina: z.number(),
    limite: z.number(),
    total: z.number(),
    totalPaginas: z.number(),
  }),
});

export type ListaProdutosResponse = z.infer<typeof listaProdutosResponseSchema>;
