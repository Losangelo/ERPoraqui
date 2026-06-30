import { z } from 'zod';

export const criarItemEntradaSchema = z.object({
  produtoId: z.string().min(1, 'Produto é obrigatório'),
  quantidade: z.number().positive('Quantidade deve ser maior que zero'),
  quantidadeRecebida: z.number().default(0),
  unidadeMedida: z.string().min(1, 'Unidade de medida é obrigatória'),
  valorUnitario: z.number().min(0, 'Valor unitário não pode ser negativo'),
  valorDesconto: z.number().min(0).default(0),
});

export const criarEntradaMercadoriaSchema = z.object({
  pedidoCompraId: z.string().min(1, 'Pedido de compra é obrigatório'),
  numeroNota: z.string().min(1, 'Número da nota é obrigatório'),
  serieNota: z.string().default('1'),
  dataEmissao: z.date().optional(),
  valorFrete: z.number().min(0).default(0),
  valorDesconto: z.number().min(0).default(0),
  observacoes: z.string().optional(),
  itens: z.array(criarItemEntradaSchema).min(1, 'Pelo menos um item é obrigatório'),
});

export const entradaFiltroSchema = z.object({
  pedidoCompraId: z.string().optional(),
  situacao: z.enum(['PENDENTE', 'EM_RECEBIMENTO', 'RECEBIDO', 'CANCELADO']).optional(),
  dataInicial: z.date().optional(),
  dataFinal: z.date().optional(),
  pagina: z.number().default(1),
  limite: z.number().default(20),
});

export type CriarEntradaMercadoriaInput = z.infer<typeof criarEntradaMercadoriaSchema>;
export type CriarItemEntradaInput = z.infer<typeof criarItemEntradaSchema>;
export type EntradaFiltro = z.infer<typeof entradaFiltroSchema>;
