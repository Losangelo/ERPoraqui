import { z } from 'zod';

export const estoqueFiltroSchema = z.object({
  categoriaId: z.string().optional(),
  categoria: z.string().optional(),
  nome: z.string().optional(),
  codigoInterno: z.string().optional(),
  alertaEstoqueMinimo: z.boolean().optional(),
  pagina: z.number().default(1),
  limite: z.number().default(20),
});

export type EstoqueFiltro = z.infer<typeof estoqueFiltroSchema>;

export const ajusteEstoqueSchema = z.object({
  produtoId: z.string().min(1, 'Produto é obrigatório'),
  quantidade: z.number(),
  tipo: z.enum(['ENTRADA', 'SAIDA', 'AJUSTE']),
  motivo: z.string().optional(),
});

export type AjusteEstoqueInput = z.infer<typeof ajusteEstoqueSchema>;
