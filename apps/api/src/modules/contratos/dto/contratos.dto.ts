import { z } from 'zod';

export const criarContratoSchema = z.object({
  clienteId: z.string().min(1, 'Cliente é obrigatório'),
  numero: z.string().min(1, 'Número do contrato é obrigatório'),
  descricao: z.string().optional(),
  dataInicio: z.coerce.date(),
  dataFim: z.coerce.date().optional(),
  valor: z.number().positive('Valor deve ser positivo'),
  tipoReajuste: z.enum(['NENHUM', 'IGPM', 'IPCA', 'NF']).default('NENHUM'),
  periodicidade: z.string().default('MENSAL'),
  observacoes: z.string().optional(),
});

export const atualizarContratoSchema = z.object({
  descricao: z.string().optional(),
  dataFim: z.coerce.date().optional(),
  valor: z.number().positive().optional(),
  tipoReajuste: z.enum(['NENHUM', 'IGPM', 'IPCA', 'NF']).optional(),
  periodicidade: z.string().optional(),
  observacoes: z.string().optional(),
});

export const contratoFiltroSchema = z.object({
  pagina: z.coerce.number().default(1),
  limite: z.coerce.number().default(20),
  status: z.enum(['RASCUNHO', 'ATIVO', 'SUSPENSO', 'ENCERRADO']).optional(),
  clienteId: z.string().optional(),
  search: z.string().optional(),
});

export const criarMedicaoSchema = z.object({
  periodo: z.string().min(1, 'Período é obrigatório (ex: 2026-07)'),
  valor: z.number().positive('Valor deve ser positivo'),
  dataVencimento: z.coerce.date(),
});

export type CriarContratoInput = z.infer<typeof criarContratoSchema>;
export type AtualizarContratoInput = z.infer<typeof atualizarContratoSchema>;
export type ContratoFiltro = z.infer<typeof contratoFiltroSchema>;
export type CriarMedicaoInput = z.infer<typeof criarMedicaoSchema>;
