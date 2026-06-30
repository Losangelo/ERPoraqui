import { api } from './api';

export const fluxoCaixaService = {
  listar: (params?: any) => api.get('/fluxo-caixa', { params }),
  criar: (data: any) => api.post('/fluxo-caixa', data),
  buscarPorId: (id: string) => api.get(`/fluxo-caixa/${id}`),
  saldo: () => api.get('/fluxo-caixa/saldo'),
  resumo: (data: string) => api.get(`/fluxo-caixa/resumo/${data}`),
  categorias: () => api.get('/fluxo-caixa/categorias'),
};

export const financeiroService = {
  // Contas a Receber
  listarReceber: async (params?: any) => {
    const response = await api.get('/financeiro/contas-receber', { params });
    return response.data?.data || response.data || [];
  },
  criarReceber: (data: any) => api.post('/financeiro/contas-receber', data),
  buscarReceber: (id: string) => api.get(`/financeiro/contas-receber/${id}`),
  atualizarReceber: (id: string, data: any) => api.put(`/financeiro/contas-receber/${id}`, data),
  excluirReceber: (id: string) => api.delete(`/financeiro/contas-receber/${id}`),
  
  // Contas a Pagar
  listarPagar: async (params?: any) => {
    const response = await api.get('/financeiro/contas-pagar', { params });
    return response.data?.data || response.data || [];
  },
  criarPagar: (data: any) => api.post('/financeiro/contas-pagar', data),
  buscarPagar: (id: string) => api.get(`/financeiro/contas-pagar/${id}`),
  atualizarPagar: (id: string, data: any) => api.put(`/financeiro/contas-pagar/${id}`, data),
  excluirPagar: (id: string) => api.delete(`/financeiro/contas-pagar/${id}`),
  
  // Dashboard
  dashboard: () => api.get('/financeiro/dashboard'),
};

export const relatoriosService = {
  resumoNotas: (dataInicial: string, dataFinal: string) => 
    api.get('/relatorios-fiscais/resumo-notas', { params: { dataInicial, dataFinal } }),
  resumoImpostos: (dataInicial: string, dataFinal: string) => 
    api.get('/relatorios-fiscais/resumo-impostos', { params: { dataInicial, dataFinal } }),
  spedFiscal: (dataInicial: string, dataFinal: string) => 
    api.get('/relatorios-fiscais/sped-fiscal', { params: { dataInicial, dataFinal } }),
  spedContribuicoes: (dataInicial: string, dataFinal: string) => 
    api.get('/relatorios-fiscais/sped-contribuicoes', { params: { dataInicial, dataFinal } }),
};
