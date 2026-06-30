import { z } from 'zod';

export const dashboardFiltroSchema = z.object({
  empresaId: z.string().optional(),
  periodo: z.enum(['7dias', '30dias', '90dias', 'ano']).default('30dias'),
});

export type DashboardFiltro = z.infer<typeof dashboardFiltroSchema>;

export const dashboardCompletoResponseSchema = z.object({
  cadastros: z.object({
    clientes: z.number(),
    fornecedores: z.number(),
    produtos: z.number(),
    vendedores: z.number(),
  }),
  vendas: z.object({
    mes: z.object({
      quantidade: z.number(),
      valor: z.number(),
    }),
  }),
  compras: z.object({
    mes: z.object({
      quantidade: z.number(),
      valor: z.number(),
    }),
  }),
  financeiro: z.object({
    receber: z.object({
      quantidade: z.number(),
      valor: z.number(),
    }),
    pagar: z.object({
      quantidade: z.number(),
      valor: z.number(),
    }),
    saldoProjecao: z.number(),
  }),
  estoque: z.object({
    valorTotal: z.number(),
  }),
});

export type DashboardCompletoResponse = z.infer<typeof dashboardCompletoResponseSchema>;

export const graficoVendasItemSchema = z.object({
  data: z.string(),
  valor: z.number(),
});

export const graficoVendasResponseSchema = z.array(graficoVendasItemSchema);
export type GraficoVendasResponse = z.infer<typeof graficoVendasResponseSchema>;

export const graficoDiaSemanaItemSchema = z.object({
  dia: z.string(),
  valor: z.number(),
});

export const graficoDiaSemanaResponseSchema = z.array(graficoDiaSemanaItemSchema);
export type GraficoDiaSemanaResponse = z.infer<typeof graficoDiaSemanaResponseSchema>;

export const graficoReceitasDespesasItemSchema = z.object({
  data: z.string(),
  receitas: z.number(),
  despesas: z.number(),
});

export const graficoReceitasDespesasResponseSchema = z.array(graficoReceitasDespesasItemSchema);
export type GraficoReceitasDespesasResponse = z.infer<typeof graficoReceitasDespesasResponseSchema>;

export const graficoStatusPedidosItemSchema = z.object({
  status: z.string(),
  quantidade: z.number(),
});

export const graficoStatusPedidosResponseSchema = z.array(graficoStatusPedidosItemSchema);
export type GraficoStatusPedidosResponse = z.infer<typeof graficoStatusPedidosResponseSchema>;

export const graficoEstoqueCategoriaItemSchema = z.object({
  categoria: z.string(),
  quantidade: z.number(),
});

export const graficoEstoqueCategoriaResponseSchema = z.array(graficoEstoqueCategoriaItemSchema);
export type GraficoEstoqueCategoriaResponse = z.infer<typeof graficoEstoqueCategoriaResponseSchema>;

export const graficoMaisVendidosItemSchema = z.object({
  nome: z.string(),
  codigo: z.string(),
  quantidade: z.number(),
  valor: z.number(),
});

export const graficoMaisVendidosResponseSchema = z.array(graficoMaisVendidosItemSchema);
export type GraficoMaisVendidosResponse = z.infer<typeof graficoMaisVendidosResponseSchema>;

export const indicadoresRapidosResponseSchema = z.object({
  vendasDia: z.object({
    quantidade: z.number(),
    valor: z.number(),
  }),
  pedidosDia: z.number(),
  estoque: z.object({
    abaixoMinimo: z.number(),
    estoqueZero: z.number(),
  }),
});

export type IndicadoresRapidosResponse = z.infer<typeof indicadoresRapidosResponseSchema>;
