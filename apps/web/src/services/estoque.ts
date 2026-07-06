import { api } from './api';

export interface MovimentacaoEstoque {
  id: string;
  empresaId: string;
  produtoId: string;
  produto?: { id: string; nome: string; codigoInterno?: string };
  tipoMovimentacao: 'ENTRADA' | 'SAIDA' | 'TRANSFERENCIA' | 'AJUSTE' | 'DEVOLUCAO';
  quantidade: number;
  quantidadeAnterior: number;
  quantidadeNova: number;
  motivo?: string;
  dataMovimentacao: string;
  saldoAcumulado?: number;
}

export interface Categoria {
  id: string;
  empresaId: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

export interface UnidadeMedida {
  id: string;
  empresaId: string;
  simbolo: string;
  descricao: string;
  fracionada: boolean;
  ativo: boolean;
}

export interface Empresa {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  telefone?: string;
  email?: string;
  site?: string;
  regimeTributario: string;
  ativo: boolean;
  filiais?: Filial[];
}

export interface Filial {
  id: string;
  empresaId: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual?: string;
  telefone?: string;
  email?: string;
  filialMatriz: boolean;
  numeroNF: number;
  serieNF: string;
  ativo: boolean;
}

export const EstoqueService = {
  async listarMovimentacoes(filtros?: any): Promise<MovimentacaoEstoque[]> {
    const params = new URLSearchParams();
    if (filtros?.produtoId) params.append('produtoId', filtros.produtoId);
    if (filtros?.tipoMovimentacao) params.append('tipo', filtros.tipoMovimentacao);
    params.append('pagina', '1');
    params.append('limite', '100');
    const response = await api.get(`/movimentacoes-internas?${params}`);
    return response.data?.data || [];
  },

  async criarMovimentacao(data: Partial<MovimentacaoEstoque>): Promise<MovimentacaoEstoque> {
    const response = await api.post('/movimentacoes-internas', data);
    return response.data;
  },

  async historicoProduto(
    produtoId: string,
    filtros?: { dataInicio?: string; dataFim?: string; pagina?: number; limite?: number }
  ): Promise<{ dados: MovimentacaoEstoque[]; meta: { pagina: number; limite: number; total: number; totalPaginas: number } }> {
    const params = new URLSearchParams();
    if (filtros?.dataInicio) params.append('dataInicio', filtros.dataInicio);
    if (filtros?.dataFim) params.append('dataFim', filtros.dataFim);
    if (filtros?.pagina) params.append('pagina', String(filtros.pagina));
    if (filtros?.limite) params.append('limite', String(filtros.limite));
    const response = await api.get(`/movimentacoes-internas/produto/${produtoId}/historico?${params}`);
    return response.data;
  },
};

export const categoriasService = {
  async listar(): Promise<Categoria[]> {
    const response = await api.get('/categorias?pagina=1&limite=100');
    return response.data?.data || response.data?.dados || [];
  },

  async buscarPorId(id: string): Promise<Categoria> {
    const response = await api.get(`/categorias/${id}`);
    return response.data;
  },

  async criar(data: Partial<Categoria>): Promise<Categoria> {
    const response = await api.post('/categorias', data);
    return response.data;
  },

  async atualizar(id: string, data: Partial<Categoria>): Promise<Categoria> {
    const response = await api.put(`/categorias/${id}`, data);
    return response.data;
  },

  async excluir(id: string): Promise<void> {
    await api.delete(`/categorias/${id}`);
  },
};

export const unidadesService = {
  async listar(): Promise<UnidadeMedida[]> {
    const response = await api.get('/unidades-medida?pagina=1&limite=100');
    return response.data?.data || response.data?.dados || [];
  },

  async buscarPorId(id: string): Promise<UnidadeMedida> {
    const response = await api.get(`/unidades-medida/${id}`);
    return response.data;
  },

  async criar(data: Partial<UnidadeMedida>): Promise<UnidadeMedida> {
    const response = await api.post('/unidades-medida', data);
    return response.data;
  },

  async atualizar(id: string, data: Partial<UnidadeMedida>): Promise<UnidadeMedida> {
    const response = await api.put(`/unidades-medida/${id}`, data);
    return response.data;
  },

  async excluir(id: string): Promise<void> {
    await api.delete(`/unidades-medida/${id}`);
  },
};

export const empresasService = {
  async listar(): Promise<Empresa[]> {
    const response = await api.get('/empresas');
    return response.data;
  },

  async buscarPorId(id: string): Promise<Empresa> {
    const response = await api.get(`/empresas/${id}`);
    return response.data;
  },

  async criar(data: Partial<Empresa>): Promise<Empresa> {
    const response = await api.post('/empresas', data);
    return response.data;
  },

  async atualizar(id: string, data: Partial<Empresa>): Promise<Empresa> {
    const response = await api.put(`/empresas/${id}`, data);
    return response.data;
  },

  async listarFiliais(empresaId: string): Promise<Filial[]> {
    const response = await api.get(`/empresas/${empresaId}/filiais`);
    return response.data;
  },

  async criarFilial(empresaId: string, data: any): Promise<Filial> {
    const sanitized = { ...data, cnpj: data.cnpj?.replace(/\D/g, '') };
    for (const key of ['logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'uf', 'cep', 'inscricaoEstadual', 'inscricaoMunicipal', 'telefone', 'email', 'nomeFantasia']) {
      if (sanitized[key] === '') sanitized[key] = undefined;
    }
    const response = await api.post(`/empresas/${empresaId}/filiais`, sanitized);
    return response.data;
  },

  async buscarFilial(empresaId: string, filialId: string): Promise<Filial> {
    const response = await api.get(`/empresas/${empresaId}/filiais/${filialId}`);
    return response.data;
  },

  async atualizarFilial(empresaId: string, filialId: string, data: any): Promise<Filial> {
    const sanitized = { ...data, cnpj: data.cnpj?.replace(/\D/g, '') };
    for (const key of ['logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'uf', 'cep', 'inscricaoEstadual', 'inscricaoMunicipal', 'telefone', 'email', 'nomeFantasia']) {
      if (sanitized[key] === '') sanitized[key] = undefined;
    }
    const response = await api.put(`/empresas/${empresaId}/filiais/${filialId}`, sanitized);
    return response.data;
  },

  async removerFilial(empresaId: string, filialId: string): Promise<void> {
    await api.delete(`/empresas/${empresaId}/filiais/${filialId}`);
  },
};
