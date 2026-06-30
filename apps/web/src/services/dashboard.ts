import { api } from './api';

export const dashboardService = {
  getDashboard: () => api.get('/dashboard'),
  getIndicadores: () => api.get('/dashboard/indicadores'),
  getGraficoVendas: (periodo: string = '30dias') => api.get(`/dashboard/grafico/vendas?periodo=${periodo}`),
  getGraficoVendasDiaSemana: () => api.get('/dashboard/grafico/vendas-dia-semana'),
  getGraficoReceitasDespesas: (periodo: string = '30dias') => api.get(`/dashboard/grafico/receitas-despesas?periodo=${periodo}`),
  getGraficoStatusPedidos: () => api.get('/dashboard/grafico/status-pedidos'),
  getGraficoEstoqueCategoria: () => api.get('/dashboard/grafico/estoque-categoria'),
  getGraficoMaisVendidos: (limite: number = 10) => api.get(`/dashboard/grafico/mais-vendidos?limite=${limite}`),
};
