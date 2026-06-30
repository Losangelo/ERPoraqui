import { z } from 'zod';

export const UnidadeMedidaSchema = z.object({
  simbolo: z.string().min(1, 'Símbolo é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  fracionada: z.boolean().optional(),
  ativo: z.boolean().optional(),
});

export const UnidadeMedidaUpdateSchema = z.object({
  simbolo: z.string().min(1, 'Símbolo é obrigatório').optional(),
  descricao: z.string().min(1, 'Descrição é obrigatória').optional(),
  fracionada: z.boolean().optional(),
  ativo: z.boolean().optional(),
});

export const UnidadeMedidaFiltroSchema = z.object({
  simbolo: z.string().optional(),
  descricao: z.string().optional(),
  ativo: z.boolean().optional(),
  pagina: z.number().int().positive().default(1),
  limite: z.number().int().positive().max(100).default(20),
});

export type UnidadeMedidaInput = z.infer<typeof UnidadeMedidaSchema>;
export type UnidadeMedidaUpdateInput = z.infer<typeof UnidadeMedidaUpdateSchema>;
export type UnidadeMedidaFiltro = z.infer<typeof UnidadeMedidaFiltroSchema>;
