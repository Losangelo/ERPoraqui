import { z } from 'zod';

export const criarItemPedidoCompraSchema = z.object({
  produtoId: z.string().min(1, 'Produto é obrigatório'),
  quantidade: z.number().positive('Quantidade deve ser maior que zero'),
  unidadeMedida: z.string().min(1, 'Unidade de medida é obrigatória'),
  valorUnitario: z.number().min(0, 'Valor unitário não pode ser negativo'),
  valorDesconto: z.number().min(0).default(0),
});

function gerarNumeroPedido(): string {
  const agora = new Date();
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `PC${agora.getFullYear()}${String(agora.getMonth() + 1).padStart(2, '0')}${String(agora.getDate()).padStart(2, '0')}${seq}`;
}

export const criarPedidoCompraSchema = z.object({
  fornecedorId: z.string().min(1, 'Fornecedor é obrigatório'),
  numeroPedido: z.string().default(gerarNumeroPedido),
  serie: z.string().default('1'),
  tipoOperacao: z.enum(['VENDA', 'DEVOLUCAO', 'CONSIGNACAO', 'REMESSA']).default('VENDA'),
  dataEmissao: z.date().optional(),
  dataEntrega: z.date().optional(),
  valorDesconto: z.number().min(0).default(0),
  valorFrete: z.number().min(0).default(0),
  observacoes: z.string().optional(),
  // Condições de pagamento
  condicaoPagamento: z.enum(['A_VISTA', 'A_PRAZO', 'PARCELADO']).optional().default('A_VISTA'),
  quantidadeParcelas: z.number().int().positive().optional().default(1),
  intervaloParcelas: z.number().int().positive().optional().default(30),
  primeiraParcelaDias: z.number().int().optional().default(0),
  itens: z.array(criarItemPedidoCompraSchema).min(1, 'Pelo menos um item é obrigatório'),
});

export const atualizarPedidoCompraSchema = z.object({
  situacao: z.enum(['EM_ABERTO', 'CONFIRMADO', 'EM_PRODUCAO', 'ENVIADO', 'ENTREGUE', 'CANCELADO']).optional(),
  dataEmissao: z.date().optional(),
  dataEntrega: z.date().optional(),
  valorDesconto: z.number().min(0).optional(),
  valorFrete: z.number().min(0).optional(),
  observacoes: z.string().optional(),
  condicaoPagamento: z.enum(['A_VISTA', 'A_PRAZO', 'PARCELADO']).optional(),
  quantidadeParcelas: z.number().int().positive().optional(),
  intervaloParcelas: z.number().int().positive().optional(),
  primeiraParcelaDias: z.number().int().optional(),
});

export const pedidoCompraFiltroSchema = z.object({
  fornecedorId: z.string().optional(),
  situacao: z.enum(['EM_ABERTO', 'CONFIRMADO', 'EM_PRODUCAO', 'ENVIADO', 'ENTREGUE', 'CANCELADO']).optional(),
  dataInicial: z.date().optional(),
  dataFinal: z.date().optional(),
  pagina: z.number().default(1),
  limite: z.number().default(20),
});

export type CriarPedidoCompraInput = z.infer<typeof criarPedidoCompraSchema>;
export type AtualizarPedidoCompraInput = z.infer<typeof atualizarPedidoCompraSchema>;
export type PedidoCompraFiltro = z.infer<typeof pedidoCompraFiltroSchema>;
export type CriarItemPedidoCompraInput = z.infer<typeof criarItemPedidoCompraSchema>;
