import { api } from './api';

export interface Inventario {
  id: string;
  empresaId: string;
  filialId: string;
  dataInventario: string;
  tipo: 'GERAL' | 'PARCIAL' | 'ROTATIVO';
  situacao: 'ABERTO' | 'EM_CONFERENCIA' | 'CONCLUIDO' | 'CANCELADO';
  observacoes?: string;
  dataFechamento?: string;
  filial?: { id: string; nome: string };
  _count?: { itens: number };
}

export interface InventarioFiltros {
  filialId?: string;
  tipo?: string;
  situacao?: string;
  dataInicial?: string;
  dataFinal?: string;
  pagina?: number;
  limite?: number;
}

export const inventarioService = {
  listar: async (filtros: InventarioFiltros = {}) => {
    const params = new URLSearchParams();
    if (filtros.filialId) params.append('filialId', filtros.filialId);
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.situacao) params.append('situacao', filtros.situacao);
    if (filtros.dataInicial) params.append('dataInicial', filtros.dataInicial);
    if (filtros.dataFinal) params.append('dataFinal', filtros.dataFinal);
    params.append('pagina', String(filtros.pagina || 1));
    params.append('limite', String(filtros.limite || 20));

    const response = await api.get(`/inventario?${params}`);
    return response.data?.data || response.data || [];
  },

  buscarPorId: async (id: string) => {
    const response = await api.get(`/inventario/${id}`);
    return response.data;
  },

  criar: async (dados: any) => {
    const response = await api.post('/inventario', dados);
    return response.data;
  },

  registrarContagem: async (id: string, dados: any) => {
    const response = await api.post(`/inventario/${id}/contagem`, dados);
    return response.data;
  },

  conciliar: async (id: string, dados: any) => {
    const response = await api.post(`/inventario/${id}/conciliar`, dados);
    return response.data;
  },

  ajustar: async (id: string, dados: any) => {
    const response = await api.post(`/inventario/${id}/ajustar`, dados);
    return response.data;
  },

  cancelar: async (id: string) => {
    const response = await api.post(`/inventario/${id}/cancelar`);
    return response.data;
  },

  divergencias: async (id: string) => {
    const response = await api.get(`/inventario/${id}/divergencias`);
    return response.data;
  },
};
