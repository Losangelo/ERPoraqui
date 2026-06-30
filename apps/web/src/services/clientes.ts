import { api } from './api';

export interface Cliente {
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
  dataNascimento?: string;
  limiteCredito: number;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface CriarClienteDto {
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
  dataNascimento?: string;
  limiteCredito?: number;
}

export interface ClientesFiltros {
  empresaId?: string;
  nome?: string;
  documento?: string;
  tipoPessoa?: 'FISICA' | 'JURIDICA';
  ativo?: boolean;
  pagina?: number;
  limite?: number;
}

export interface ClientesResponse {
  dados: Cliente[];
  meta: {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
  };
}

export const clientesService = {
  listar: async (filtros: ClientesFiltros = {}) => {
    const params = new URLSearchParams();
    if (filtros.nome) params.append('nome', filtros.nome);
    if (filtros.documento) params.append('documento', filtros.documento);
    if (filtros.tipoPessoa) params.append('tipoPessoa', filtros.tipoPessoa);
    if (filtros.ativo !== undefined) params.append('ativo', String(filtros.ativo));
    params.append('pagina', String(filtros.pagina || 1));
    params.append('limite', String(filtros.limite || 100));
    
    const response = await api.get<ClientesResponse>(`/clientes?${params}`);
    const data = response.data;
    if (!data) return [];
    return data.dados || data || [];
  },

  buscarPorId: async (id: string) => {
    const response = await api.get<Cliente>(`/clientes/${id}`);
    return response.data;
  },

  criar: async (dados: CriarClienteDto) => {
    const response = await api.post<Cliente>('/clientes', dados);
    return response.data;
  },

  atualizar: async (id: string, dados: Partial<CriarClienteDto>) => {
    const response = await api.put<Cliente>(`/clientes/${id}`, dados);
    return response.data;
  },

  inativar: async (id: string) => {
    const response = await api.patch<Cliente>(`/clientes/${id}/inativar`);
    return response.data;
  },

  ativar: async (id: string) => {
    const response = await api.patch<Cliente>(`/clientes/${id}/ativar`);
    return response.data;
  },
};
