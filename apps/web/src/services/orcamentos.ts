import { api } from './api';

export interface Orcamento {
  id: string;
  empresaId: string;
  filialId: string;
  clienteId: string;
  numeroOrcamento: string;
  serie: string;
  dataEmissao: string;
  dataValidade: string;
  valorTotal: number;
  valorDesconto: number;
  valorFrete: number;
  valorOutrosAcrescimos: number;
  situacao: 'ABERTO' | 'APROVADO' | 'REPROVADO' | 'EXPIRADO' | 'CONVERTIDO';
  observacoes?: string;
  cliente?: { id: string; nome: string };
  filial?: { id: string; nome: string };
  itens?: any[];
}

export interface OrcamentosFiltros {
  clienteId?: string;
  filialId?: string;
  situacao?: string;
  dataInicial?: string;
  dataFinal?: string;
  pagina?: number;
  limite?: number;
}

export const orcamentosService = {
  listar: async (filtros: OrcamentosFiltros = {}) => {
    const params = new URLSearchParams();
    if (filtros.clienteId) params.append('clienteId', filtros.clienteId);
    if (filtros.filialId) params.append('filialId', filtros.filialId);
    if (filtros.situacao) params.append('situacao', filtros.situacao);
    if (filtros.dataInicial) params.append('dataInicial', filtros.dataInicial);
    if (filtros.dataFinal) params.append('dataFinal', filtros.dataFinal);
    params.append('pagina', String(filtros.pagina || 1));
    params.append('limite', String(filtros.limite || 20));

    const response = await api.get(`/orcamentos?${params}`);
    return response.data?.data || response.data?.dados || [];
  },

  buscarPorId: async (id: string) => {
    const response = await api.get(`/orcamentos/${id}`);
    return response.data;
  },

  criar: async (dados: any) => {
    const response = await api.post('/orcamentos', dados);
    return response.data;
  },

  atualizar: async (id: string, dados: any) => {
    const response = await api.put(`/orcamentos/${id}`, dados);
    return response.data;
  },

  excluir: async (id: string) => {
    const response = await api.delete(`/orcamentos/${id}`);
    return response.data;
  },

  aprovar: async (id: string) => {
    const response = await api.post(`/orcamentos/${id}/aprovar`);
    return response.data;
  },

  reprovar: async (id: string) => {
    const response = await api.post(`/orcamentos/${id}/reprovar`);
    return response.data;
  },

  converter: async (id: string) => {
    const response = await api.post(`/orcamentos/${id}/converter`);
    return response.data;
  },
};
