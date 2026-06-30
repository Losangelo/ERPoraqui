import { z } from 'zod';

export const criarVendedorSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  tipoPessoa: z.enum(['FISICA', 'JURIDICA']),
  documento: z.string().min(1, 'Documento é obrigatório'),
  inscricaoEstadual: z.string().optional(),
  telefone: z.string().optional(),
  telefoneCelular: z.string().optional(),
  email: z.string().email('E-mail inválido').optional(),
  comissao: z.number().min(0).max(100).default(0),
});

export const atualizarVendedorSchema = criarVendedorSchema.partial();

export type CriarVendedorInput = z.infer<typeof criarVendedorSchema>;
export type AtualizarVendedorInput = z.infer<typeof atualizarVendedorSchema>;

export const vendedorFiltroSchema = z.object({
  nome: z.string().optional(),
  documento: z.string().optional(),
  tipoPessoa: z.enum(['FISICA', 'JURIDICA']).optional(),
  ativo: z.boolean().optional(),
  pagina: z.number().default(1),
  limite: z.number().default(20),
});

export type VendedorFiltro = z.infer<typeof vendedorFiltroSchema>;
