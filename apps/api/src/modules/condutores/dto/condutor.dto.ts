import { z } from 'zod';

export const criarCondutorSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cpf: z.string().optional(),
  tipoCondutor: z.enum(['PROPRIO', 'PJ']).default('PROPRIO'),
  cnh: z.string().optional(),
  cnhCategoria: z.string().optional(),
  cnhVencimento: z.coerce.date().optional(),
  telefone: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  observacoes: z.string().optional(),
  ativo: z.boolean().default(true),
});

export const atualizarCondutorSchema = criarCondutorSchema.partial();

export type CriarCondutorInput = z.infer<typeof criarCondutorSchema>;
export type AtualizarCondutorInput = z.infer<typeof atualizarCondutorSchema>;

export const condutorFiltroSchema = z.object({
  nome: z.string().optional(),
  ativo: z.coerce.boolean().optional(),
  tipoCondutor: z.enum(['PROPRIO', 'PJ']).optional(),
  pagina: z.coerce.number().default(1),
  limite: z.coerce.number().default(20),
});

export type CondutorFiltro = z.infer<typeof condutorFiltroSchema>;
