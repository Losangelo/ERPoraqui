import { z } from 'zod';

export const criarFilialSchema = z.object({
  empresaId: z.string().optional(),
  razaoSocial: z.string().min(1, 'Razão social é obrigatória'),
  nomeFantasia: z.string().optional(),
  cnpj: z.string().min(14, 'CNPJ deve ter no mínimo 14 dígitos').max(18, 'CNPJ deve ter no máximo 18 caracteres'),
  inscricaoEstadual: z.string().optional(),
  inscricaoMunicipal: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email('E-mail inválido').optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().length(2, 'UF deve ter 2 dígitos').optional(),
  cep: z.string().optional(),
  filialMatriz: z.boolean().optional(),
});

export const atualizarFilialSchema = criarFilialSchema.partial();

export type CriarFilialInput = z.infer<typeof criarFilialSchema>;
export type AtualizarFilialInput = z.infer<typeof atualizarFilialSchema>;
