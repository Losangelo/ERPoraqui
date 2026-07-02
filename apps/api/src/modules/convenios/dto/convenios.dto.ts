import { z } from 'zod';

export const criarConvenioSchema = z.object({
  clienteId: z.string().min(1, 'Cliente é obrigatório'),
  numero: z.string().min(1, 'Número do convênio é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  dataInicio: z.coerce.date(),
  dataFim: z.coerce.date().optional(),
  valorTotal: z.number().positive('Valor total deve ser positivo'),
  observacoes: z.string().optional(),
});

export const atualizarConvenioSchema = z.object({
  descricao: z.string().optional(),
  dataFim: z.coerce.date().optional(),
  valorTotal: z.number().positive().optional(),
  situacao: z.enum(['ATIVO', 'SUSPENSO', 'ENCERRADO']).optional(),
  observacoes: z.string().optional(),
});

export const convenioFiltroSchema = z.object({
  pagina: z.coerce.number().default(1),
  limite: z.coerce.number().default(20),
  situacao: z.enum(['ATIVO', 'SUSPENSO', 'ENCERRADO']).optional(),
  clienteId: z.string().optional(),
  search: z.string().optional(),
});

export type CriarConvenioInput = z.infer<typeof criarConvenioSchema>;
export type AtualizarConvenioInput = z.infer<typeof atualizarConvenioSchema>;
export type ConvenioFiltro = z.infer<typeof convenioFiltroSchema>;
