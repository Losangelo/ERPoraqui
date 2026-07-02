import { z } from 'zod';

export const criarDevolucaoSchema = z.object({
  clienteId: z.string().min(1, 'Cliente é obrigatório'),
  pedidoVendaId: z.string().optional(),
  numero: z.string().min(1, 'Número da devolução é obrigatório'),
  motivo: z.enum(['DEFEITO', 'TROCA', 'ARREPENDIMENTO', 'AVARIA']),
  observacoes: z.string().optional(),
  itens: z.array(z.object({
    produtoId: z.string().min(1, 'Produto é obrigatório'),
    quantidade: z.number().positive('Quantidade deve ser positiva'),
    valor: z.number().nonnegative(),
    condicao: z.enum(['NOVO', 'DEFEITO', 'AVARIADO']).default('NOVO'),
    numeroSerie: z.string().optional(),
  })).min(1, 'Pelo menos um item é obrigatório'),
});

export const atualizarDevolucaoSchema = z.object({
  observacoes: z.string().optional(),
  laudoTecnico: z.string().optional(),
});

export const devolucaoFiltroSchema = z.object({
  pagina: z.coerce.number().default(1),
  limite: z.coerce.number().default(20),
  status: z.enum(['SOLICITACAO', 'INSPECAO', 'APROVADO', 'REJEITADO', 'DESTINADO', 'CANCELADO']).optional(),
  motivo: z.enum(['DEFEITO', 'TROCA', 'ARREPENDIMENTO', 'AVARIA']).optional(),
  clienteId: z.string().optional(),
  search: z.string().optional(),
});

export type CriarDevolucaoInput = z.infer<typeof criarDevolucaoSchema>;
export type AtualizarDevolucaoInput = z.infer<typeof atualizarDevolucaoSchema>;
export type DevolucaoFiltro = z.infer<typeof devolucaoFiltroSchema>;
