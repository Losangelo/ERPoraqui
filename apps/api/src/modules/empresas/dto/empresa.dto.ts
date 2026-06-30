import { z } from 'zod';

export const criarEmpresaSchema = z.object({
  razaoSocial: z.string().min(1, 'Razão social é obrigatória'),
  nomeFantasia: z.string().optional(),
  cnpj: z.string().min(14, 'CNPJ inválido').max(18),
  inscricaoEstadual: z.string().optional(),
  inscricaoMunicipal: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email('E-mail inválido').optional(),
  site: z.string().url('URL inválida').optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().length(2, 'UF deve ter 2 dígitos').optional(),
  cep: z.string().optional(),
  regimeTributario: z.enum(['SIMPLES_NACIONAL', 'LUCRO_PRESUMIDO', 'LUCRO_REAL', 'ISENTO']).optional(),
});

export const atualizarEmpresaSchema = criarEmpresaSchema.partial();

export type CriarEmpresaInput = z.infer<typeof criarEmpresaSchema>;
export type AtualizarEmpresaInput = z.infer<typeof atualizarEmpresaSchema>;

export const empresaResponseSchema = z.object({
  id: z.string(),
  razaoSocial: z.string(),
  nomeFantasia: z.string().nullable(),
  cnpj: z.string(),
  inscricaoEstadual: z.string().nullable(),
  inscricaoMunicipal: z.string().nullable(),
  telefone: z.string().nullable(),
  email: z.string().nullable(),
  site: z.string().nullable(),
  regimeTributario: z.string(),
  ativo: z.boolean(),
  dataCriacao: z.date(),
  dataAtualizacao: z.date(),
});

export type EmpresaResponse = z.infer<typeof empresaResponseSchema>;
