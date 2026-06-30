import { z } from 'zod';

export const CategoriaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  categoriaPaiId: z.string().optional(),
  ativo: z.boolean().optional(),
});

export const CategoriaUpdateSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').optional(),
  descricao: z.string().optional(),
  categoriaPaiId: z.string().nullable().optional(),
  ativo: z.boolean().optional(),
});

export const CategoriaFiltroSchema = z.object({
  nome: z.string().optional(),
  ativo: z.boolean().optional(),
  pagina: z.number().int().positive().default(1),
  limite: z.number().int().positive().max(100).default(20),
});

export type CategoriaInput = z.infer<typeof CategoriaSchema>;
export type CategoriaUpdateInput = z.infer<typeof CategoriaUpdateSchema>;
export type CategoriaFiltro = z.infer<typeof CategoriaFiltroSchema>;
