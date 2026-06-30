import { z } from 'zod';

export const adicionarItemSchema = z.object({
  produtoId: z.string().min(1, 'Produto é obrigatório'),
  quantidade: z.number().positive('Quantidade deve ser maior que zero'),
  valorUnitario: z.number().min(0, 'Valor unitário não pode ser negativo'),
  valorDesconto: z.number().min(0).default(0),
});

export const finalizarVendaSchema = z.object({
  formaPagamento: z.enum(['DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_CREDITO_PARCELADO', 'CARTAO_DEBITO', 'BOLETO', 'CHEQUE', 'CREDITO_LOJA']),
  valorPago: z.number().min(0, 'Valor pago não pode ser negativo'),
  clienteId: z.string().optional(),
  observacoes: z.string().optional(),
});

export const criarOperadorSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  pin: z.string().min(4, 'PIN deve ter pelo menos 4 dígitos').max(6, 'PIN deve ter no máximo 6 dígitos'),
});

export const abrirCaixaSchema = z.object({
  filialId: z.string().min(1, 'Filial é obrigatória'),
  operadorId: z.string().min(1, 'Operador é obrigatório'),
  saldoInicial: z.number().min(0, 'Saldo inicial não pode ser negativo'),
});

export const fecharCaixaSchema = z.object({
  observacoes: z.string().optional(),
});

export const pdvFiltroSchema = z.object({
  filialId: z.string().optional(),
  operadorId: z.string().optional(),
  clienteId: z.string().optional(),
  formaPagamento: z.enum(['DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_CREDITO_PARCELADO', 'CARTAO_DEBITO', 'BOLETO', 'CHEQUE', 'CREDITO_LOJA']).optional(),
  situacao: z.enum(['ABERTA', 'FINALIZADA', 'CANCELADA', 'ESTORNADA']).optional(),
  dataInicial: z.date().optional(),
  dataFinal: z.date().optional(),
  pagina: z.number().default(1),
  limite: z.number().default(20),
});

export const buscarProdutoSchema = z.object({
  termo: z.string().optional(),
  pagina: z.number().default(1),
  limite: z.number().default(20),
});

export type AdicionarItemInput = z.infer<typeof adicionarItemSchema>;
export type FinalizarVendaInput = z.infer<typeof finalizarVendaSchema>;
export type CriarOperadorInput = z.infer<typeof criarOperadorSchema>;
export type AbrirCaixaInput = z.infer<typeof abrirCaixaSchema>;
export type FecharCaixaInput = z.infer<typeof fecharCaixaSchema>;
export type PdvFiltro = z.infer<typeof pdvFiltroSchema>;
export type BuscarProdutoInput = z.infer<typeof buscarProdutoSchema>;
