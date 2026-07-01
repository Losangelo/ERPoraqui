import { api } from './api';

export interface ProdutoVariacao {
  id: string;
  empresaId: string;
  produtoId: string;
  sku: string;
  nome: string;
  valor: string;
  precoAdicional: number;
  estoque: number;
  codigoBarras?: string;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface CriarProdutoVariacaoDto {
  produtoId: string;
  sku: string;
  nome: string;
  valor: string;
  precoAdicional: number;
  estoque: number;
  codigoBarras?: string;
  ativo?: boolean;
}

export interface ProdutoVariacaoFiltros {
  produtoId?: string;
  ativo?: boolean;
  pagina?: number;
  limite?: number;
}

export interface ProdutosVariacoesResponse {
  dados: ProdutoVariacao[];
  meta: {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
  };
}

export const produtosVariacoesService = {
  listar: async (filtros: ProdutoVariacaoFiltros = {}) => {
    const params = new URLSearchParams();
    if (filtros.produtoId) params.append('produtoId', filtros.produtoId);
    if (filtros.ativo !== undefined) params.append('ativo', String(filtros.ativo));
    params.append('pagina', String(filtros.pagina || 1));
    params.append('limite', String(filtros.limite || 100));

    const response = await api.get<ProdutosVariacoesResponse>(`/produtos-variacoes?${params}`);
    return response.data?.data || [];
  },

  buscarPorId: async (id: string) => {
    const response = await api.get<ProdutoVariacao>(`/produtos-variacoes/${id}`);
    return response.data;
  },

  criar: async (dados: CriarProdutoVariacaoDto) => {
    const response = await api.post<ProdutoVariacao>('/produtos-variacoes', dados);
    return response.data;
  },

  atualizar: async (id: string, dados: Partial<CriarProdutoVariacaoDto>) => {
    const response = await api.put<ProdutoVariacao>(`/produtos-variacoes/${id}`, dados);
    return response.data;
  },

  excluir: async (id: string) => {
    await api.delete(`/produtos-variacoes/${id}`);
  },

  inativar: async (id: string) => {
    const response = await api.patch<ProdutoVariacao>(`/produtos-variacoes/${id}/inativar`);
    return response.data;
  },

  ativar: async (id: string) => {
    const response = await api.patch<ProdutoVariacao>(`/produtos-variacoes/${id}/ativar`);
    return response.data;
  },
};
