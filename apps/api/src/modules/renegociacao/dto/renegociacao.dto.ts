import { z } from 'zod';

export const renegociacaoFiltroSchema = z.object({
  pagina: z.coerce.number().default(1),
  limite: z.coerce.number().default(20),
  tipo: z.enum(['RECEBER', 'PAGAR']).optional(),
  situacao: z.enum(['PENDENTE', 'CONFIRMADA', 'CANCELADA']).optional(),
  clienteId: z.string().optional(),
  fornecedorId: z.string().optional(),
  dataInicial: z.string().optional(),
  dataFinal: z.string().optional(),
});

export const criarRenegociacaoSchema = z.object({
  tipo: z.enum(['RECEBER', 'PAGAR']),
  clienteId: z.string().optional(),
  fornecedorId: z.string().optional(),
  contasIds: z.array(z.string()).min(1, 'Selecione pelo menos uma conta'),
  valorDesconto: z.number().min(0).default(0),
  valorJuros: z.number().min(0).default(0),
  valorMulta: z.number().min(0).default(0),
  numeroParcelas: z.number().int().min(1).default(1),
  primeiraVencimento: z.string().refine((val) => !isNaN(Date.parse(val)), 'Data inválida'),
  observacoes: z.string().optional(),
});

export type RenegociacaoFiltro = z.infer<typeof renegociacaoFiltroSchema>;
export type CriarRenegociacaoInput = z.infer<typeof criarRenegociacaoSchema>;
