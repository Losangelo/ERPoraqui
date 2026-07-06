import { z } from 'zod';

export const criarEntregaSchema = z.object({
  pedidoVendaId: z.string().min(1, 'Pedido de venda é obrigatório'),
  clienteId: z.string().min(1, 'Cliente é obrigatório'),
  filialId: z.string().min(1, 'Filial é obrigatória'),
  motoristaId: z.string().optional(),
  veiculoId: z.string().optional(),
  transportadoraId: z.string().optional(),
  enderecoEntrega: z.any().optional(),
  dataAgendamento: z.string().datetime().optional(),
  dataPrevisao: z.string().datetime().optional(),
  valorFrete: z.number().min(0, 'Valor do frete deve ser maior ou igual a zero'),
  taxaEntregaId: z.string().optional(),
  observacoes: z.string().optional(),
});

export const atualizarEntregaSchema = criarEntregaSchema.partial();

export type CriarEntregaInput = z.infer<typeof criarEntregaSchema>;
export type AtualizarEntregaInput = z.infer<typeof atualizarEntregaSchema>;

export const entregaFiltroSchema = z.object({
  situacao: z.enum(['PENDENTE', 'AGENDADO', 'SAIU_PARA_ENTREGA', 'ENTREGUE', 'TENTATIVA_FALHOU', 'CANCELADO']).optional(),
  clienteId: z.string().optional(),
  motoristaId: z.string().optional(),
  pedidoVendaId: z.string().optional(),
  dataInicial: z.string().optional(),
  dataFinal: z.string().optional(),
  pagina: z.number().default(1),
  limite: z.number().default(20),
});

export type EntregaFiltro = z.infer<typeof entregaFiltroSchema>;
