import { api } from './api';

export interface PromocaoItem {
  id: string;
  promocaoId: string;
  produtoId: string;
  precoPromocional: number | null;
  produto?: { id: string; nome: string; codigoInterno: string };
}

export interface Promocao {
  id: string;
  empresaId: string;
  nome: string;
  descricao: string | null;
  tipoDesconto: 'PERCENTUAL' | 'VALOR_FIXO' | 'LEVE_PAGUE';
  valorDesconto: number;
  qtdMinima: number | null;
  qtdCobrar: number | null;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
  aplicaProdutos: 'TODOS' | 'SELECIONADOS';
  dataCriacao: string;
  dataAtualizacao: string;
  itens?: PromocaoItem[];
}

export interface PromocaoFiltros {
  nome?: string;
  tipoDesconto?: string;
  ativo?: boolean;
  pagina?: number;
  limite?: number;
}

export const promocoesService = {
  listar: async (filtros?: PromocaoFiltros) => {
    const response = await api.get('/promocoes', { params: filtros });
    return response.data?.data || response.data?.dados || [];
  },

  buscarPorId: async (id: string) => {
    const response = await api.get(`/promocoes/${id}`);
    return response.data?.data || response.data;
  },

  criar: (data: {
    nome?: string;
    descricao?: string;
    tipoDesconto: 'PERCENTUAL' | 'VALOR_FIXO' | 'LEVE_PAGUE';
    valorDesconto: number;
    qtdMinima?: number;
    qtdCobrar?: number;
    dataInicio: string;
    dataFim: string;
    ativo?: boolean;
    aplicaProdutos?: 'TODOS' | 'SELECIONADOS';
    itens?: { produtoId: string; precoPromocional?: number }[];
  }) => api.post('/promocoes', data),

  atualizar: (id: string, data: {
    nome?: string;
    descricao?: string;
    tipoDesconto?: 'PERCENTUAL' | 'VALOR_FIXO' | 'LEVE_PAGUE';
    valorDesconto?: number;
    qtdMinima?: number;
    qtdCobrar?: number;
    dataInicio?: string;
    dataFim?: string;
    ativo?: boolean;
    aplicaProdutos?: 'TODOS' | 'SELECIONADOS';
    itens?: { produtoId: string; precoPromocional?: number }[];
  }) => api.put(`/promocoes/${id}`, data),

  excluir: (id: string) => api.delete(`/promocoes/${id}`),

  toggleAtivo: (id: string) => api.patch(`/promocoes/${id}/toggle-ativo`),

  calcularPrecoPromocional: async (produtoId: string) => {
    const response = await api.get(`/promocoes/calcular-preco/${produtoId}`);
    return response.data?.precoPromocional as number | null;
  },
};
