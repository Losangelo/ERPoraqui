import { z } from 'zod';

export const criarTaxaEntregaSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  tipo: z.enum(['FIXA', 'POR_KM', 'POR_CEP', 'POR_VALOR']).default('FIXA'),
  valor: z.number().min(0, 'Valor deve ser maior ou igual a zero'),
  raioKm: z.number().positive().optional(),
  cepInicio: z.string().optional(),
  cepFim: z.string().optional(),
  valorMinimoPedido: z.number().positive().optional(),
});

export const atualizarTaxaEntregaSchema = criarTaxaEntregaSchema.partial();

export type CriarTaxaEntregaInput = z.infer<typeof criarTaxaEntregaSchema>;
export type AtualizarTaxaEntregaInput = z.infer<typeof atualizarTaxaEntregaSchema>;

export const taxaEntregaFiltroSchema = z.object({
  descricao: z.string().optional(),
  tipo: z.enum(['FIXA', 'POR_KM', 'POR_CEP', 'POR_VALOR']).optional(),
  ativo: z.boolean().optional(),
  pagina: z.number().default(1),
  limite: z.number().default(20),
});

export type TaxaEntregaFiltro = z.infer<typeof taxaEntregaFiltroSchema>;

export const calcularTaxaSchema = z.object({
  cep: z.string().optional(),
  valorPedido: z.number().min(0, 'Valor do pedido deve ser maior ou igual a zero'),
});

export type CalcularTaxaInput = z.infer<typeof calcularTaxaSchema>;
