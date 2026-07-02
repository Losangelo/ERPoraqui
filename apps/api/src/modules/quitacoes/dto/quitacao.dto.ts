import { z } from 'zod';

export const criarQuitacaoSchema = z.object({
  tipo: z.enum(['RECEBER', 'PAGAR']),
  clienteId: z.string().optional(),
  fornecedorId: z.string().optional(),
  contas: z.array(z.object({
    contaId: z.string(),
    tipoConta: z.enum(['RECEBER', 'PAGAR']),
    valorPago: z.number().positive(),
  })).min(1, 'Selecione pelo menos uma conta'),
  dataQuitacao: z.string().refine((val) => !isNaN(Date.parse(val)), 'Data inválida'),
  formaPagamento: z.string().optional(),
  observacoes: z.string().optional(),
});

export const quitacaoFiltroSchema = z.object({
  pagina: z.coerce.number().default(1),
  limite: z.coerce.number().default(20),
  tipo: z.enum(['RECEBER', 'PAGAR']).optional(),
  dataInicial: z.string().optional(),
  dataFinal: z.string().optional(),
});

export type CriarQuitacaoInput = z.infer<typeof criarQuitacaoSchema>;
export type QuitacaoFiltro = z.infer<typeof quitacaoFiltroSchema>;
