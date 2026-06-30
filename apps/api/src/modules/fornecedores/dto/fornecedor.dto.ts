import { z } from 'zod';

export const criarFornecedorSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(255),
  tipoPessoa: z.enum(['FISICA', 'JURIDICA']),
  documento: z.string().min(1, 'CPF/CNPJ é obrigatório'),
  inscricaoEstadual: z.string().optional(),
  inscricaoMunicipal: z.string().optional(),
  telefone: z.string().optional(),
  telefoneCelular: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().length(2, 'UF deve ter 2 dígitos').optional(),
  cep: z.string().optional(),
  ativo: z.boolean().default(true),
});

export const atualizarFornecedorSchema = criarFornecedorSchema.partial();

export const fornecedorFiltroSchema = z.object({
  nome: z.string().optional(),
  documento: z.string().optional(),
  tipoPessoa: z.enum(['FISICA', 'JURIDICA']).optional(),
  ativo: z.boolean().optional(),
  pagina: z.number().min(1).default(1),
  limite: z.number().min(1).max(100).default(20),
});

export type CriarFornecedorInput = z.infer<typeof criarFornecedorSchema>;
export type AtualizarFornecedorInput = z.infer<typeof atualizarFornecedorSchema>;
export type FornecedorFiltro = z.infer<typeof fornecedorFiltroSchema>;

export const fornecedorResponseSchema = z.object({
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
  ativo: z.boolean(),
  dataCriacao: z.date(),
  dataAtualizacao: z.date(),
});

export type FornecedorResponse = z.infer<typeof fornecedorResponseSchema>;

export const listaFornecedoresResponseSchema = z.object({
  dados: z.array(fornecedorResponseSchema),
  meta: z.object({
    pagina: z.number(),
    limite: z.number(),
    total: z.number(),
    totalPaginas: z.number(),
  }),
});

export type ListaFornecedoresResponse = z.infer<typeof listaFornecedoresResponseSchema>;
