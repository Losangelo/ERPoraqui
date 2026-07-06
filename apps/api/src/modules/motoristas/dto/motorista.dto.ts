import { z } from 'zod';

export const criarMotoristaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cpf: z.string().optional(),
  tipo: z.enum(['PROPRIO', 'PJ']).default('PROPRIO'),
  cnh: z.string().optional(),
  cnhCategoria: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email('E-mail inválido').optional(),
  observacoes: z.string().optional(),
});

export const atualizarMotoristaSchema = criarMotoristaSchema.partial();

export type CriarMotoristaInput = z.infer<typeof criarMotoristaSchema>;
export type AtualizarMotoristaInput = z.infer<typeof atualizarMotoristaSchema>;

export const motoristaFiltroSchema = z.object({
  nome: z.string().optional(),
  ativo: z.boolean().optional(),
  tipo: z.enum(['PROPRIO', 'PJ']).optional(),
  pagina: z.number().default(1),
  limite: z.number().default(20),
});

export type MotoristaFiltro = z.infer<typeof motoristaFiltroSchema>;
