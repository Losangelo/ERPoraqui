import { z } from 'zod';

export const criarItemOrcamentoSchema = z.object({
  produtoId: z.string().min(1, 'Produto é obrigatório'),
  quantidade: z.number().positive('Quantidade deve ser maior que zero'),
  unidadeMedida: z.string().min(1, 'Unidade de medida é obrigatória'),
  valorUnitario: z.number().min(0, 'Valor unitário não pode ser negativo'),
  valorDesconto: z.number().min(0).default(0),
});

export const criarOrcamentoSchema = z.object({
  filialId: z.string().min(1, 'Filial é obrigatória'),
  clienteId: z.string().min(1, 'Cliente é obrigatório'),
  numeroOrcamento: z.string().min(1, 'Número do orçamento é obrigatório'),
  serie: z.string().default('1'),
  dataValidade: z.date().min(new Date(), 'Data de validade deve ser futura'),
  dataEmissao: z.date().optional(),
  valorDesconto: z.number().min(0).default(0),
  valorFrete: z.number().min(0).default(0),
  valorOutrosAcrescimos: z.number().min(0).default(0),
  observacoes: z.string().optional(),
  observacoesInternas: z.string().optional(),
  itens: z.array(criarItemOrcamentoSchema).min(1, 'Pelo menos um item é obrigatório'),
});

export const atualizarOrcamentoSchema = z.object({
  situacao: z.enum(['ABERTO', 'APROVADO', 'REPROVADO', 'EXPIRADO', 'CONVERTIDO', 'CANCELADO']).optional(),
  dataValidade: z.date().optional(),
  dataEmissao: z.date().optional(),
  valorDesconto: z.number().min(0).optional(),
  valorFrete: z.number().min(0).optional(),
  valorOutrosAcrescimos: z.number().min(0).optional(),
  observacoes: z.string().optional(),
  observacoesInternas: z.string().optional(),
});

export const orcamentoFiltroSchema = z.object({
  clienteId: z.string().optional(),
  filialId: z.string().optional(),
  situacao: z.enum(['ABERTO', 'APROVADO', 'REPROVADO', 'EXPIRADO', 'CONVERTIDO', 'CANCELADO']).optional(),
  dataInicial: z.date().optional(),
  dataFinal: z.date().optional(),
  pagina: z.number().default(1),
  limite: z.number().default(20),
});

export type CriarOrcamentoInput = z.infer<typeof criarOrcamentoSchema>;
export type AtualizarOrcamentoInput = z.infer<typeof atualizarOrcamentoSchema>;
export type OrcamentoFiltro = z.infer<typeof orcamentoFiltroSchema>;
export type CriarItemOrcamentoInput = z.infer<typeof criarItemOrcamentoSchema>;
