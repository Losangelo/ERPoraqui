import { z } from 'zod';

export const criarTransportadoraSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  tipoPessoa: z.enum(['FISICA', 'JURIDICA']),
  documento: z.string().min(1, 'Documento é obrigatório'),
  inscricaoEstadual: z.string().optional(),
  inscricaoMunicipal: z.string().optional(),
  telefone: z.string().optional(),
  telefoneCelular: z.string().optional(),
  email: z.string().email('E-mail inválido').optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().length(2, 'UF deve ter 2 dígitos').optional(),
  cep: z.string().optional(),
});

export const atualizarTransportadoraSchema = criarTransportadoraSchema.partial();

export type CriarTransportadoraInput = z.infer<typeof criarTransportadoraSchema>;
export type AtualizarTransportadoraInput = z.infer<typeof atualizarTransportadoraSchema>;

export const transportadoraFiltroSchema = z.object({
  nome: z.string().optional(),
  documento: z.string().optional(),
  tipoPessoa: z.enum(['FISICA', 'JURIDICA']).optional(),
  ativo: z.boolean().optional(),
  pagina: z.number().default(1),
  limite: z.number().default(20),
});

export type TransportadoraFiltro = z.infer<typeof transportadoraFiltroSchema>;
