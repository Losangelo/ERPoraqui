import { api } from './api';

export interface Fornecedor {
  id: string;
  empresaId: string;
  nome: string;
  tipoPessoa: 'FISICA' | 'JURIDICA';
  documento: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  telefone?: string;
  telefoneCelular?: string;
  email?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface CriarFornecedorDto {
  nome: string;
  tipoPessoa: 'FISICA' | 'JURIDICA';
  documento: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  telefone?: string;
  telefoneCelular?: string;
  email?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
}

export interface FornecedoresFiltros {
  nome?: string;
  documento?: string;
  tipoPessoa?: 'FISICA' | 'JURIDICA';
  ativo?: boolean;
  pagina?: number;
  limite?: number;
}

export interface FornecedoresResponse {
  dados: Fornecedor[];
  meta: {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
  };
}

export const fornecedoresService = {
  listar: async (filtros: FornecedoresFiltros = {}) => {
    const params = new URLSearchParams();
    if (filtros.nome) params.append('nome', filtros.nome);
    if (filtros.documento) params.append('documento', filtros.documento);
    if (filtros.tipoPessoa) params.append('tipoPessoa', filtros.tipoPessoa);
    if (filtros.ativo !== undefined) params.append('ativo', String(filtros.ativo));
    params.append('pagina', String(filtros.pagina || 1));
    params.append('limite', String(filtros.limite || 100));
    
    const response = await api.get<FornecedoresResponse>(`/fornecedores?${params}`);
    return response.data?.dados || response.data || [];
  },

  buscarPorId: async (id: string) => {
    const response = await api.get<Fornecedor>(`/fornecedores/${id}`);
    return response.data;
  },

  criar: async (dados: CriarFornecedorDto) => {
    const response = await api.post<Fornecedor>('/fornecedores', dados);
    return response.data;
  },

  atualizar: async (id: string, dados: Partial<CriarFornecedorDto>) => {
    const response = await api.put<Fornecedor>(`/fornecedores/${id}`, dados);
    return response.data;
  },

  inativar: async (id: string) => {
    const response = await api.patch<Fornecedor>(`/fornecedores/${id}/inativar`);
    return response.data;
  },

  ativar: async (id: string) => {
    const response = await api.patch<Fornecedor>(`/fornecedores/${id}/ativar`);
    return response.data;
  },
};
