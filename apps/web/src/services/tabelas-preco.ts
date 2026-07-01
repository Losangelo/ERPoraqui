import { api } from './api';

export interface TabelaPrecoItem {
  id: string;
  tabelaPrecoId: string;
  produtoId: string;
  precoVenda: number;
  precoMinimo: number;
  descontoMaximo: number;
  produto?: { id: string; nome: string; codigoInterno: string };
}

export interface TabelaPreco {
  id: string;
  empresaId: string;
  nome: string;
  descricao: string | null;
  tipo: 'VISTA' | 'PRAZO' | 'PROMOCAO' | 'ESPECIAL';
  markupBase: number;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
  itens?: TabelaPrecoItem[];
}

export interface TabelaPrecoFiltros {
  nome?: string;
  tipo?: string;
  ativo?: boolean;
  pagina?: number;
  limite?: number;
}

export const tabelasPrecoService = {
  listar: async (filtros?: TabelaPrecoFiltros) => {
    const response = await api.get('/tabelas-preco', { params: filtros });
    return response.data?.data || response.data?.dados || [];
  },

  buscarPorId: async (id: string) => {
    const response = await api.get(`/tabelas-preco/${id}`);
    return response.data?.data || response.data;
  },

  criar: (data: {
    nome: string;
    descricao?: string;
    tipo: 'VISTA' | 'PRAZO' | 'PROMOCAO' | 'ESPECIAL';
    markupBase: number;
    ativo?: boolean;
  }) => api.post('/tabelas-preco', data),

  atualizar: (id: string, data: {
    nome?: string;
    descricao?: string;
    tipo?: 'VISTA' | 'PRAZO' | 'PROMOCAO' | 'ESPECIAL';
    markupBase?: number;
    ativo?: boolean;
  }) => api.put(`/tabelas-preco/${id}`, data),

  excluir: (id: string) => api.delete(`/tabelas-preco/${id}`),

  listarItens: async (tabelaPrecoId: string) => {
    const response = await api.get(`/tabelas-preco/${tabelaPrecoId}/itens`);
    return response.data?.data || response.data?.dados || [];
  },

  adicionarItem: (tabelaPrecoId: string, data: {
    produtoId: string;
    precoVenda: number;
    precoMinimo: number;
    descontoMaximo: number;
  }) => api.post(`/tabelas-preco/${tabelaPrecoId}/itens`, data),

  atualizarItem: (tabelaPrecoId: string, itemId: string, data: {
    precoVenda?: number;
    precoMinimo?: number;
    descontoMaximo?: number;
  }) => api.put(`/tabelas-preco/${tabelaPrecoId}/itens/${itemId}`, data),

  removerItem: (tabelaPrecoId: string, itemId: string) =>
    api.delete(`/tabelas-preco/${tabelaPrecoId}/itens/${itemId}`),

  calcularPrecos: (id: string) =>
    api.post(`/tabelas-preco/${id}/calcular-precos`),
};
