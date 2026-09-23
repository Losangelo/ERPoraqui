import { z } from 'zod';

export const criarVeiculoSchema = z.object({
  placa: z.string().min(1, 'Placa é obrigatória'),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  ano: z.coerce.number().int().min(1900).max(2100).optional(),
  cor: z.string().optional(),
  capacidadeKg: z.coerce.number().positive().optional(),
  tipoVeiculo: z.enum(['CARRO', 'MOTO', 'VAN', 'CAMINHAO', 'BICICLETA', 'OUTRO']).default('CARRO'),
  observacoes: z.string().optional(),
  ativo: z.boolean().default(true),
});

export const atualizarVeiculoSchema = criarVeiculoSchema.partial();

export type CriarVeiculoInput = z.infer<typeof criarVeiculoSchema>;
export type AtualizarVeiculoInput = z.infer<typeof atualizarVeiculoSchema>;

export const veiculoFiltroSchema = z.object({
  placa: z.string().optional(),
  tipoVeiculo: z.enum(['CARRO', 'MOTO', 'VAN', 'CAMINHAO', 'BICICLETA', 'OUTRO']).optional(),
  ativo: z.coerce.boolean().optional(),
  pagina: z.coerce.number().default(1),
  limite: z.coerce.number().default(20),
});

export type VeiculoFiltro = z.infer<typeof veiculoFiltroSchema>;
