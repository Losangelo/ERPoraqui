import { z } from 'zod';

const formaPagamentoEnum = z.enum(['DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'BOLETO', 'TRANSFERENCIA', 'CHEQUE']).optional();

export const criarAdiantamentoSchema = z.object({
  tipo: z.enum(['CLIENTE', 'FORNECEDOR', 'FUNCIONARIO']),
  clienteId: z.string().optional(),
  fornecedorId: z.string().optional(),
  funcionarioId: z.string().optional(),
  valor: z.number().positive('Valor deve ser positivo'),
  dataAdiantamento: z.string().refine((val) => !isNaN(Date.parse(val)), 'Data inválida'),
  dataPrevisao: z.string().optional(),
  formaPagamento: formaPagamentoEnum,
  observacoes: z.string().optional(),
});

export const adiantamentoFiltroSchema = z.object({
  pagina: z.coerce.number().default(1),
  limite: z.coerce.number().default(20),
  tipo: z.enum(['CLIENTE', 'FORNECEDOR', 'FUNCIONARIO']).optional(),
  situacao: z.enum(['ABERTO', 'QUITADO', 'CANCELADO']).optional(),
  dataInicial: z.string().optional(),
  dataFinal: z.string().optional(),
});

export type CriarAdiantamentoInput = z.infer<typeof criarAdiantamentoSchema>;
export type AdiantamentoFiltro = z.infer<typeof adiantamentoFiltroSchema>;
