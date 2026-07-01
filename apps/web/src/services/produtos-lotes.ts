import { api } from './api';

export interface ProdutoLote {
  id: string;
  empresaId: string;
  produtoId: string;
  codigoLote: string;
  dataFabricacao?: string;
  dataValidade?: string;
  quantidade: number;
  quantidadeOriginal: number;
  custoUnitario: number;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface CriarProdutoLoteDto {
  produtoId: string;
  codigoLote: string;
  dataFabricacao?: string;
  dataValidade?: string;
  quantidade: number;
  quantidadeOriginal: number;
  custoUnitario: number;
  ativo?: boolean;
}

export interface ProdutoLoteFiltros {
  produtoId?: string;
  ativo?: boolean;
  pagina?: number;
  limite?: number;
}

export interface ProdutosLotesResponse {
  dados: ProdutoLote[];
  meta: {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
  };
}

export interface AjustarEstoqueDto {
  quantidade: number;
  motivo?: string;
}

export const produtosLotesService = {
  listar: async (filtros: ProdutoLoteFiltros = {}) => {
    const params = new URLSearchParams();
    if (filtros.produtoId) params.append('produtoId', filtros.produtoId);
    if (filtros.ativo !== undefined) params.append('ativo', String(filtros.ativo));
    params.append('pagina', String(filtros.pagina || 1));
    params.append('limite', String(filtros.limite || 100));

    const response = await api.get<ProdutosLotesResponse>(`/produtos-lotes?${params}`);
    return response.data?.data || [];
  },

  buscarPorId: async (id: string) => {
    const response = await api.get<ProdutoLote>(`/produtos-lotes/${id}`);
    return response.data;
  },

  criar: async (dados: CriarProdutoLoteDto) => {
    const response = await api.post<ProdutoLote>('/produtos-lotes', dados);
    return response.data;
  },

  atualizar: async (id: string, dados: Partial<CriarProdutoLoteDto>) => {
    const response = await api.put<ProdutoLote>(`/produtos-lotes/${id}`, dados);
    return response.data;
  },

  inativar: async (id: string) => {
    const response = await api.patch<ProdutoLote>(`/produtos-lotes/${id}/inativar`);
    return response.data;
  },

  ajustarEstoque: async (id: string, dados: AjustarEstoqueDto) => {
    const response = await api.post<ProdutoLote>(`/produtos-lotes/${id}/ajustar-estoque`, dados);
    return response.data;
  },
};
