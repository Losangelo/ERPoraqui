import { z } from 'zod';

export const salvarAvaliacaoSchema = z.object({
  ratingLoja: z.number().int().min(1).max(5),
  ratingPedido: z.number().int().min(1).max(5),
  ratingEntrega: z.number().int().min(1).max(5),
  comentario: z.string().optional(),
});

export type SalvarAvaliacaoInput = z.infer<typeof salvarAvaliacaoSchema>;
