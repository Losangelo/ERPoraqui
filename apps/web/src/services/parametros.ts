import { api } from './api';

export interface Parametro {
  id: string;
  empresaId: string;
  modulo: string;
  chave: string;
  valor: string;
  descricao?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ParametrosFiltros {
  modulo?: string;
  ativo?: boolean;
  busca?: string;
}

export const parametrosService = {
  listar: async (filtros: ParametrosFiltros = {}) => {
    const params = new URLSearchParams();
    if (filtros.modulo) params.append('modulo', filtros.modulo);
    if (filtros.ativo !== undefined) params.append('ativo', String(filtros.ativo));
    if (filtros.busca) params.append('busca', filtros.busca);

    const response = await api.get(`/parametros?${params}`);
    return response.data?.data || response.data?.dados || [];
  },

  buscarPorId: async (id: string) => {
    const response = await api.get(`/parametros/${id}`);
    return response.data;
  },

  porModulo: async (modulo: string) => {
    const response = await api.get(`/parametros/modulo/${modulo}`);
    return response.data;
  },

  criar: async (dados: Partial<Parametro>) => {
    const response = await api.post('/parametros', dados);
    return response.data;
  },

  atualizar: async (id: string, dados: Partial<Parametro>) => {
    const response = await api.put(`/parametros/${id}`, dados);
    return response.data;
  },

  inativar: async (id: string) => {
    const response = await api.patch(`/parametros/${id}/inativar`);
    return response.data;
  },

  ativar: async (id: string) => {
    const response = await api.patch(`/parametros/${id}/ativar`);
    return response.data;
  },
};
