import { z } from 'zod';

export const criarClienteSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(255),
  tipoPessoa: z.enum(['FISICA', 'JURIDICA']),
  documento: z.string().min(11, 'Documento inválido').max(18),
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
  dataNascimento: z.string().optional(),
  limiteCredito: z.number().min(0).default(0),
  ativo: z.boolean().default(true),
});

export const atualizarClienteSchema = criarClienteSchema.partial();

export const clienteFiltroSchema = z.object({
  nome: z.string().optional(),
  documento: z.string().optional(),
  tipoPessoa: z.enum(['FISICA', 'JURIDICA']).optional(),
  ativo: z.boolean().optional(),
  pagina: z.number().min(1).default(1),
  limite: z.number().min(1).max(100).default(20),
});

export type CriarClienteInput = z.infer<typeof criarClienteSchema>;
export type AtualizarClienteInput = z.infer<typeof atualizarClienteSchema>;
export type ClienteFiltro = z.infer<typeof clienteFiltroSchema>;

export const clienteResponseSchema = z.object({
  id: z.string(),
  empresaId: z.string(),
  nome: z.string(),
  tipoPessoa: z.string(),
  documento: z.string(),
  inscricaoEstadual: z.string().nullable(),
  inscricaoMunicipal: z.string().nullable(),
  telefone: z.string().nullable(),
  telefoneCelular: z.string().nullable(),
  email: z.string().nullable(),
  logradouro: z.string().nullable(),
  numero: z.string().nullable(),
  complemento: z.string().nullable(),
  bairro: z.string().nullable(),
  cidade: z.string().nullable(),
  uf: z.string().nullable(),
  cep: z.string().nullable(),
  dataNascimento: z.date().nullable(),
  limiteCredito: z.number(),
  ativo: z.boolean(),
  dataCriacao: z.date(),
  dataAtualizacao: z.date(),
});

export type ClienteResponse = z.infer<typeof clienteResponseSchema>;

export const listaClientesResponseSchema = z.object({
  dados: z.array(clienteResponseSchema),
  meta: z.object({
    pagina: z.number(),
    limite: z.number(),
    total: z.number(),
    totalPaginas: z.number(),
  }),
});

export type ListaClientesResponse = z.infer<typeof listaClientesResponseSchema>;
