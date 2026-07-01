import { api } from './api';

export interface CentroCusto {
  id: string;
  empresaId: string;
  codigo: string;
  nome: string;
  descricao: string | null;
  centroPaiId: string | null;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
  centroPai?: { id: string; codigo: string; nome: string } | null;
  subcentros?: CentroCusto[];
  _count?: {
    subcentros: number;
    contasPagar: number;
    contasReceber: number;
  };
}

export const centrosCustoService = {
  listar: async () => {
    const response = await api.get('/centros-custo');
    return response.data?.data || response.data?.dados || [];
  },

  criar: (data: {
    codigo: string;
    nome: string;
    descricao?: string;
    centroPaiId?: string;
  }) => api.post('/centros-custo', data),

  buscarPorId: (id: string) => api.get(`/centros-custo/${id}`),

  atualizar: (id: string, data: {
    codigo?: string;
    nome?: string;
    descricao?: string;
    centroPaiId?: string;
    ativo?: boolean;
  }) => api.put(`/centros-custo/${id}`, data),

  excluir: (id: string) => api.delete(`/centros-custo/${id}`),

  arvore: async () => {
    const response = await api.get('/centros-custo/arvore');
    return response.data?.data || response.data?.dados || [];
  },
};
