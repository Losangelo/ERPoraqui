import { z } from 'zod';

export const criarInventarioSchema = z.object({
  filialId: z.string().min(1, 'Filial é obrigatória'),
  dataInventario: z.date(),
  tipo: z.enum(['ANUAL', 'MENSAL', 'ROTATIVO', 'EXTRAORDINARIO']),
  observacoes: z.string().optional(),
});

export const iniciarContagemSchema = z.object({
  produtoId: z.string().min(1, 'Produto é obrigatório'),
  quantidadeContada: z.number().min(0, 'Quantidade não pode ser negativa'),
  observacoes: z.string().optional(),
});

export const conciliarItensSchema = z.object({
  itemIds: z.array(z.string()).min(1, 'Pelo menos um item é obrigatório'),
  ajustarEstoque: z.boolean().default(true),
});

export const ajustarDiferencaSchema = z.object({
  produtoId: z.string().min(1, 'Produto é obrigatório'),
  novaQuantidade: z.number().min(0, 'Quantidade não pode ser negativa'),
  justificativa: z.string().min(10, 'Justificativa é obrigatória'),
});

export const inventarioFiltroSchema = z.object({
  filialId: z.string().optional(),
  tipo: z.enum(['ANUAL', 'MENSAL', 'ROTATIVO', 'EXTRAORDINARIO']).optional(),
  situacao: z.enum(['ABERTO', 'EM_CONFERENCIA', 'CONCLUIDO', 'CANCELADO']).optional(),
  dataInicial: z.date().optional(),
  dataFinal: z.date().optional(),
  pagina: z.coerce.number().min(1).default(1),
  limite: z.coerce.number().min(1).default(20),
});

export type CriarInventarioInput = z.infer<typeof criarInventarioSchema>;
export type IniciarContagemInput = z.infer<typeof iniciarContagemSchema>;
export type ConciliarItensInput = z.infer<typeof conciliarItensSchema>;
export type AjustarDiferencaInput = z.infer<typeof ajustarDiferencaSchema>;
export type InventarioFiltro = z.infer<typeof inventarioFiltroSchema>;
