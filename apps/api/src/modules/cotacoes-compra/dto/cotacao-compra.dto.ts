import { z } from 'zod';

export const criarItemCotacaoSchema = z.object({
  produtoId: z.string().min(1, 'Produto é obrigatório'),
  quantidade: z.number().positive('Quantidade deve ser maior que zero'),
  unidadeMedida: z.string().min(1, 'Unidade de medida é obrigatória'),
  observacoes: z.string().optional(),
});

export const criarCotacaoSchema = z.object({
  numeroCotacao: z.string().min(1, 'Número da cotação é obrigatório'),
  serie: z.string().default('1'),
  dataValidade: z.date().optional(),
  observacoes: z.string().optional(),
  itens: z.array(criarItemCotacaoSchema).min(1, 'Pelo menos um item é obrigatório'),
});

export const responderCotacaoSchema = z.object({
  valorFrete: z.number().min(0).default(0),
  valorDesconto: z.number().min(0).default(0),
  prazoEntrega: z.string().optional(),
});

export const cotacaoFiltroSchema = z.object({
  situacao: z.enum(['ABERTA', 'ENVIADA', 'RESPONDIDA', 'APROVADA', 'REPROVADA', 'CANCELADA']).optional(),
  dataInicial: z.date().optional(),
  dataFinal: z.date().optional(),
  pagina: z.number().default(1),
  limite: z.number().default(20),
});

export type CriarCotacaoInput = z.infer<typeof criarCotacaoSchema>;
export type CriarItemCotacaoInput = z.infer<typeof criarItemCotacaoSchema>;
export type ResponderCotacaoInput = z.infer<typeof responderCotacaoSchema>;
export type CotacaoFiltro = z.infer<typeof cotacaoFiltroSchema>;
