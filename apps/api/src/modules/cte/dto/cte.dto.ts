import { z } from 'zod';

export const criarCteSchema = z.object({
  filialId: z.string(),
  tomadorId: z.string(),
  tomadorTipo: z.enum(['REMETENTE', 'DESTINATARIO', 'OUTROS']),
  remetenteId: z.string().optional(),
  destinatarioId: z.string().optional(),
  tipoServico: z.enum(['NORMAL', 'SUBCONTRATACAO', 'REDESPACHO', 'MISTO']),
  valorFrete: z.coerce.number(),
  valorCarga: z.coerce.number(),
  naturezaCarga: z.string().optional(),
  especieCarga: z.string().optional(),
  peso: z.coerce.number().optional(),
  volumes: z.coerce.number().int().optional(),
});

export const atualizarCteSchema = z.object({
  tomadorId: z.string().optional(),
  tomadorTipo: z.enum(['REMETENTE', 'DESTINATARIO', 'OUTROS']).optional(),
  remetenteId: z.string().optional(),
  destinatarioId: z.string().optional(),
  tipoServico: z.enum(['NORMAL', 'SUBCONTRATACAO', 'REDESPACHO', 'MISTO']).optional(),
  valorFrete: z.coerce.number().optional(),
  valorCarga: z.coerce.number().optional(),
  naturezaCarga: z.string().optional(),
  especieCarga: z.string().optional(),
  peso: z.coerce.number().optional(),
  volumes: z.coerce.number().int().optional(),
});

export const cteFiltroSchema = z.object({
  pagina: z.coerce.number().default(1),
  limite: z.coerce.number().default(20),
  situacao: z.string().optional(),
  periodoIni: z.coerce.date().optional(),
  periodoFin: z.coerce.date().optional(),
});

export type CriarCteInput = z.infer<typeof criarCteSchema>;
export type AtualizarCteInput = z.infer<typeof atualizarCteSchema>;
export type CteFiltro = z.infer<typeof cteFiltroSchema>;
