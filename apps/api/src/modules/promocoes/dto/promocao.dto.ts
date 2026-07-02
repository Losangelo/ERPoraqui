import { z } from 'zod';

export const criarPromocaoSchema = z.object({
  nome: z.string().optional(),
  descricao: z.string().optional(),
  tipoDesconto: z.enum(['PERCENTUAL', 'VALOR_FIXO', 'LEVE_PAGUE']).default('PERCENTUAL'),
  valorDesconto: z.number().min(0).default(0),
  qtdMinima: z.number().int().positive().optional(),
  qtdCobrar: z.number().int().positive().optional(),
  dataInicio: z.string().datetime({ offset: true }).or(z.string()),
  dataFim: z.string().datetime({ offset: true }).or(z.string()),
  ativo: z.boolean().default(true),
  aplicaProdutos: z.enum(['TODOS', 'SELECIONADOS']).default('TODOS'),
  itens: z.array(z.object({
    produtoId: z.string().min(1),
    precoPromocional: z.number().min(0).optional(),
  })).optional(),
}).refine((d) => {
  if (d.tipoDesconto === 'LEVE_PAGUE') {
    return d.qtdMinima != null && d.qtdCobrar != null && d.qtdCobrar <= d.qtdMinima;
  }
  return true;
}, { message: 'LEVE_PAGUE requer qtdMinima e qtdCobrar (qtdCobrar <= qtdMinima)' })
.refine((d) => new Date(d.dataFim) > new Date(d.dataInicio), {
  message: 'dataFim deve ser maior que dataInicio',
});

export const atualizarPromocaoSchema = z.object({
  nome: z.string().optional(),
  descricao: z.string().optional(),
  tipoDesconto: z.enum(['PERCENTUAL', 'VALOR_FIXO', 'LEVE_PAGUE']).optional(),
  valorDesconto: z.number().min(0).optional(),
  qtdMinima: z.number().int().positive().optional(),
  qtdCobrar: z.number().int().positive().optional(),
  dataInicio: z.string().datetime({ offset: true }).or(z.string()).optional(),
  dataFim: z.string().datetime({ offset: true }).or(z.string()).optional(),
  ativo: z.boolean().optional(),
  aplicaProdutos: z.enum(['TODOS', 'SELECIONADOS']).optional(),
  itens: z.array(z.object({
    produtoId: z.string().min(1),
    precoPromocional: z.number().min(0).optional(),
  })).optional(),
});

export const promocaoFiltroSchema = z.object({
  nome: z.string().optional(),
  tipoDesconto: z.string().optional(),
  ativo: z.boolean().optional(),
  pagina: z.coerce.number().min(1).default(1),
  limite: z.coerce.number().min(1).max(100).default(20),
});

export const criarPromocaoItemSchema = z.object({
  produtoId: z.string().min(1, 'Produto é obrigatório'),
  precoPromocional: z.number().min(0).optional(),
});

export type CriarPromocaoInput = z.infer<typeof criarPromocaoSchema>;
export type AtualizarPromocaoInput = z.infer<typeof atualizarPromocaoSchema>;
export type PromocaoFiltro = z.infer<typeof promocaoFiltroSchema>;
export type CriarPromocaoItemInput = z.infer<typeof criarPromocaoItemSchema>;
