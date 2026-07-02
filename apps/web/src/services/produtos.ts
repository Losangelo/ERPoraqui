import { api } from './api';

export interface Produto {
  id: string;
  empresaId: string;
  codigoInterno: string;
  codigoBarras?: string;
  gtin?: string;
  nome: string;
  descricao?: string;
  descricaoDetalhada?: string;
  categoriaId?: string;
  unidadeMedidaId?: string;
  precoVenda: number;
  precoCusto: number;
  precoMinimo: number;
  quantidadeEstoque: number;
  estoqueMinimo: number;
  estoqueMaximo: number;
  pesoBruto?: number;
  pesoLiquido?: number;
  volume?: number;
  ncm?: string;
  cest?: string;
  origenMercadoria: 'NACIONAL' | 'ESTRANGEIRA_IMPORTACAO_DIRETA' | 'ESTRANGEIRA_NACIONALIZADA';
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface CriarProdutoDto {
  codigoInterno: string;
  codigoBarras?: string;
  gtin?: string;
  nome: string;
  descricao?: string;
  descricaoDetalhada?: string;
  categoriaId?: string;
  unidadeMedidaId?: string;
  precoVenda: number;
  precoCusto?: number;
  precoMinimo?: number;
  quantidadeEstoque?: number;
  estoqueMinimo?: number;
  estoqueMaximo?: number;
  pesoBruto?: number;
  pesoLiquido?: number;
  volume?: number;
  ncm?: string;
  cest?: string;
  origenMercadoria?: 'NACIONAL' | 'ESTRANGEIRA_IMPORTACAO_DIRETA' | 'ESTRANGEIRA_NACIONALIZADA';
}

export interface ProdutosFiltros {
  nome?: string;
  codigoInterno?: string;
  codigoBarras?: string;
  categoriaId?: string;
  ativo?: boolean;
  pagina?: number;
  limite?: number;
}

export interface ProdutosResponse {
  dados: Produto[];
  meta: {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
  };
}

export const produtosService = {
  listar: async (filtros: ProdutosFiltros = {}) => {
    const params = new URLSearchParams();
    if (filtros.nome) params.append('nome', filtros.nome);
    if (filtros.codigoInterno) params.append('codigoInterno', filtros.codigoInterno);
    if (filtros.codigoBarras) params.append('codigoBarras', filtros.codigoBarras);
    if (filtros.categoriaId) params.append('categoriaId', filtros.categoriaId);
    if (filtros.ativo !== undefined) params.append('ativo', String(filtros.ativo));
    params.append('pagina', String(filtros.pagina || 1));
    params.append('limite', String(filtros.limite || 100));
    
    const response = await api.get<ProdutosResponse>(`/produtos?${params}`);
    return response.data?.dados || [];
  },

  buscarPorId: async (id: string) => {
    const response = await api.get<Produto>(`/produtos/${id}`);
    return response.data;
  },

  criar: async (dados: CriarProdutoDto) => {
    const response = await api.post<Produto>('/produtos', dados);
    return response.data;
  },

  atualizar: async (id: string, dados: Partial<CriarProdutoDto>) => {
    const response = await api.put<Produto>(`/produtos/${id}`, dados);
    return response.data;
  },

  inativar: async (id: string) => {
    const response = await api.patch<Produto>(`/produtos/${id}/inativar`);
    return response.data;
  },

  ativar: async (id: string) => {
    const response = await api.patch<Produto>(`/produtos/${id}/ativar`);
    return response.data;
  },
};
