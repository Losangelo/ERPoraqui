import { api } from './api';

export interface Adiantamento {
  id: string;
  empresaId: string;
  clienteId: string | null;
  fornecedorId: string | null;
  funcionarioId: string | null;
  tipo: string;
  valor: number;
  dataAdiantamento: string;
  dataPrevisao: string | null;
  situacao: string;
  formaPagamento: string | null;
  observacoes: string | null;
  dataCriacao: string;
  dataAtualizacao: string;
  cliente?: { id: string; nome: string; documento: string } | null;
  fornecedor?: { id: string; nome: string; documento: string } | null;
}

export interface CriarAdiantamento {
  tipo: string;
  clienteId?: string;
  fornecedorId?: string;
  funcionarioId?: string;
  valor: number;
  dataAdiantamento: string;
  dataPrevisao?: string;
  formaPagamento?: string;
  observacoes?: string;
}

export const adiantamentoService = {
  listar: async (params?: Record<string, unknown>) => {
    const response = await api.get('/adiantamentos', { params });
    return response.data?.data || response.data?.dados || [];
  },
  buscarPorId: async (id: string) => {
    const response = await api.get(`/adiantamentos/${id}`);
    return response.data;
  },
  criar: (data: CriarAdiantamento) => api.post('/adiantamentos', data),
  atualizar: (id: string, data: Partial<CriarAdiantamento>) => api.put(`/adiantamentos/${id}`, data),
  quitar: (id: string) => api.post(`/adiantamentos/${id}/quitar`),
  cancelar: (id: string) => api.post(`/adiantamentos/${id}/cancelar`),
  excluir: (id: string) => api.delete(`/adiantamentos/${id}`),
};
