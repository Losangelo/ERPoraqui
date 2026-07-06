import { z } from 'zod';

export const criarVeiculoEntregaSchema = z.object({
  placa: z.string().min(1, 'Placa é obrigatória'),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  ano: z.number().int().min(1900).max(2100).optional(),
  cor: z.string().optional(),
  capacidadeKg: z.number().positive().optional(),
  tipo: z.enum(['CARRO', 'MOTO', 'VAN', 'CAMINHAO', 'BICICLETA', 'OUTRO']).default('CARRO'),
  proprietarioId: z.string().optional(),
  observacoes: z.string().optional(),
});

export const atualizarVeiculoEntregaSchema = criarVeiculoEntregaSchema.partial();

export type CriarVeiculoEntregaInput = z.infer<typeof criarVeiculoEntregaSchema>;
export type AtualizarVeiculoEntregaInput = z.infer<typeof atualizarVeiculoEntregaSchema>;

export const veiculoEntregaFiltroSchema = z.object({
  placa: z.string().optional(),
  tipo: z.enum(['CARRO', 'MOTO', 'VAN', 'CAMINHAO', 'BICICLETA', 'OUTRO']).optional(),
  ativo: z.boolean().optional(),
  pagina: z.number().default(1),
  limite: z.number().default(20),
});

export type VeiculoEntregaFiltro = z.infer<typeof veiculoEntregaFiltroSchema>;
