import { z } from 'zod';

export const criarGarantiaSchema = z.object({
  clienteId: z.string().min(1, 'Cliente é obrigatório'),
  produtoId: z.string().min(1, 'Produto é obrigatório'),
  vendaId: z.string().optional(),
  numero: z.string().min(1, 'Número da garantia é obrigatório'),
  tipo: z.enum(['FABRICA', 'ESTENDIDA', 'LEGAL']).default('FABRICA'),
  prazoDias: z.number().int().positive('Prazo deve ser positivo'),
  dataInicio: z.coerce.date(),
  cobertura: z.string().optional(),
  observacoes: z.string().optional(),
});

export const atualizarGarantiaSchema = z.object({
  prazoDias: z.number().int().positive().optional(),
  dataFim: z.coerce.date().optional(),
  cobertura: z.string().optional(),
  status: z.enum(['ATIVA', 'EXPIRADA', 'CANCELADA', 'ACIONADA']).optional(),
  observacoes: z.string().optional(),
});

export const garantiaFiltroSchema = z.object({
  pagina: z.coerce.number().default(1),
  limite: z.coerce.number().default(20),
  status: z.enum(['ATIVA', 'EXPIRADA', 'CANCELADA', 'ACIONADA']).optional(),
  tipo: z.enum(['FABRICA', 'ESTENDIDA', 'LEGAL']).optional(),
  clienteId: z.string().optional(),
  produtoId: z.string().optional(),
  search: z.string().optional(),
});

export const criarGarantiaRegraSchema = z.object({
  produtoId: z.string().optional(),
  categoriaId: z.string().optional(),
  prazoDias: z.number().int().positive('Prazo deve ser positivo'),
  tipo: z.enum(['FABRICA', 'ESTENDIDA', 'LEGAL']).default('FABRICA'),
  cobertura: z.string().optional(),
  termos: z.string().optional(),
  ativo: z.boolean().default(true),
});

export const atualizarGarantiaRegraSchema = z.object({
  prazoDias: z.number().int().positive().optional(),
  tipo: z.enum(['FABRICA', 'ESTENDIDA', 'LEGAL']).optional(),
  cobertura: z.string().optional(),
  termos: z.string().optional(),
  ativo: z.boolean().optional(),
});

export type CriarGarantiaInput = z.infer<typeof criarGarantiaSchema>;
export type AtualizarGarantiaInput = z.infer<typeof atualizarGarantiaSchema>;
export type GarantiaFiltro = z.infer<typeof garantiaFiltroSchema>;
export type CriarGarantiaRegraInput = z.infer<typeof criarGarantiaRegraSchema>;
export type AtualizarGarantiaRegraInput = z.infer<typeof atualizarGarantiaRegraSchema>;
