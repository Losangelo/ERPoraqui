import { z } from 'zod';

export const criarLicitacaoItemSchema = z.object({
  produtoId: z.string().min(1, 'Produto é obrigatório'),
  quantidade: z.number().positive('Quantidade deve ser positiva'),
  valorUnitario: z.number().nonnegative('Valor unitário não pode ser negativo'),
  marca: z.string().optional(),
});

export const criarLicitacaoSchema = z.object({
  numero: z.string().min(1, 'Número da licitação é obrigatório'),
  orgao: z.string().min(1, 'Órgão é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  tipo: z.enum(['PREGAO', 'CONCORRENCIA', 'CONVITE', 'TOMADA_PRECOS']),
  dataAbertura: z.coerce.date(),
  dataEncerramento: z.coerce.date().optional(),
  valorEstimado: z.number().positive('Valor estimado deve ser positivo'),
  observacoes: z.string().optional(),
  itens: z.array(criarLicitacaoItemSchema).optional(),
});

export const atualizarLicitacaoSchema = z.object({
  orgao: z.string().optional(),
  descricao: z.string().optional(),
  tipo: z.enum(['PREGAO', 'CONCORRENCIA', 'CONVITE', 'TOMADA_PRECOS']).optional(),
  dataAbertura: z.coerce.date().optional(),
  dataEncerramento: z.coerce.date().optional(),
  valorEstimado: z.number().positive().optional(),
  situacao: z.enum(['EM_ANDAMENTO', 'GANHA', 'PERDIDA', 'CANCELADA']).optional(),
  observacoes: z.string().optional(),
});

export const licitacaoFiltroSchema = z.object({
  pagina: z.coerce.number().default(1),
  limite: z.coerce.number().default(20),
  situacao: z.enum(['EM_ANDAMENTO', 'GANHA', 'PERDIDA', 'CANCELADA']).optional(),
  tipo: z.enum(['PREGAO', 'CONCORRENCIA', 'CONVITE', 'TOMADA_PRECOS']).optional(),
  search: z.string().optional(),
});

export type CriarLicitacaoItemInput = z.infer<typeof criarLicitacaoItemSchema>;
export type CriarLicitacaoInput = z.infer<typeof criarLicitacaoSchema>;
export type AtualizarLicitacaoInput = z.infer<typeof atualizarLicitacaoSchema>;
export type LicitacaoFiltro = z.infer<typeof licitacaoFiltroSchema>;
