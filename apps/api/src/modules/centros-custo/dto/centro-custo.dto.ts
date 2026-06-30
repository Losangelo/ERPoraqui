import { z } from 'zod';

export const criarCentroCustoSchema = z.object({
  codigo: z.string().min(1, 'Código é obrigatório'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  centroPaiId: z.string().optional(),
});

export const atualizarCentroCustoSchema = z.object({
  codigo: z.string().optional(),
  nome: z.string().optional(),
  descricao: z.string().optional(),
  centroPaiId: z.string().optional(),
  ativo: z.boolean().optional(),
});

export type CriarCentroCustoInput = z.infer<typeof criarCentroCustoSchema>;
export type AtualizarCentroCustoInput = z.infer<typeof atualizarCentroCustoSchema>;
