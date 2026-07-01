import { z } from 'zod';

// Veículos
export const veiculoSchema = z.object({
  placa: z.string().length(7, 'Placa deve ter 7 caracteres'),
  renavam: z.string().optional(),
  rntrc: z.string().optional(),
  tipoPropriedade: z.enum(['1', '2', '3']).default('1'),
  tara: z.coerce.number().default(0),
  capacidade: z.coerce.number().default(0),
  tipoCarroceria: z.string().optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  anoFabricacao: z.coerce.number().int().optional(),
  cor: z.string().optional(),
  ativo: z.boolean().default(true),
});

export const veiculoUpdateSchema = veiculoSchema.partial();

// Condutores
export const condutorSchema = z.object({
  cpf: z.string().min(11).max(14),
  nome: z.string().min(2).max(200),
  rntrc: z.string().optional(),
  cnh: z.string().optional(),
  cnhCategoria: z.string().optional(),
  cnhVencimento: z.coerce.date().optional(),
  telefone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  endereco: z.record(z.any()).optional(),
  ativo: z.boolean().default(true),
});

export const condutorUpdateSchema = condutorSchema.partial();

// MDF-e
export const mdfeDocumentoSchema = z.object({
  tipo: z.enum(['NFE', 'CTE', 'MDFE']),
  chaveAcesso: z.string().length(44),
  valorDocumento: z.coerce.number().default(0),
  pesoTotal: z.coerce.number().default(0),
});

export const criarMdfeSchema = z.object({
  filialId: z.string(),
  ufCarregamento: z.string().length(2),
  ufDescarregamento: z.string().length(2).optional(),
  rntrc: z.string().optional(),
  veiculoId: z.string().optional(),
  condutorId: z.string().optional(),
  valorTotalCarga: z.coerce.number().default(0),
  observacoes: z.string().optional(),
  documentos: z.array(mdfeDocumentoSchema).default([]),
});

export const atualizarMdfeSchema = z.object({
  ufCarregamento: z.string().length(2).optional(),
  ufDescarregamento: z.string().length(2).optional(),
  rntrc: z.string().optional(),
  veiculoId: z.string().optional(),
  condutorId: z.string().optional(),
  valorTotalCarga: z.coerce.number().optional(),
  observacoes: z.string().optional(),
  documentos: z.array(mdfeDocumentoSchema).optional(),
});

export const mdfeFiltroSchema = z.object({
  pagina: z.coerce.number().default(1),
  limite: z.coerce.number().default(20),
  situacao: z.string().optional(),
  periodoIni: z.coerce.date().optional(),
  periodoFin: z.coerce.date().optional(),
});

export const incluirDocumentoSchema = z.object({
  tipo: z.enum(['NFE', 'CTE', 'MDFE']),
  chaveAcesso: z.string().length(44),
  valorDocumento: z.coerce.number().default(0),
  pesoTotal: z.coerce.number().default(0),
});

export type VeiculoInput = z.infer<typeof veiculoSchema>;
export type VeiculoUpdate = z.infer<typeof veiculoUpdateSchema>;
export type CondutorInput = z.infer<typeof condutorSchema>;
export type CondutorUpdate = z.infer<typeof condutorUpdateSchema>;
export type CriarMdfeInput = z.infer<typeof criarMdfeSchema>;
export type AtualizarMdfeInput = z.infer<typeof atualizarMdfeSchema>;
export type MdfeFiltro = z.infer<typeof mdfeFiltroSchema>;
export type IncluirDocumentoInput = z.infer<typeof incluirDocumentoSchema>;
