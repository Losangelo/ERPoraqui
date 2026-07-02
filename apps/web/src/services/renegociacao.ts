import { api } from './api';

export interface Renegociacao {
  id: string;
  empresaId: string;
  clienteId: string | null;
  fornecedorId: string | null;
  tipo: string;
  valorTotal: number;
  valorDesconto: number;
  valorJuros: number;
  valorMulta: number;
  valorFinal: number;
  numeroParcelas: number;
  primeiraVencimento: string;
  situacao: string;
  observacoes: string | null;
  dataCriacao: string;
  dataAtualizacao: string;
  cliente?: { id: string; nome: string; documento: string } | null;
  fornecedor?: { id: string; nome: string; documento: string } | null;
  contas: RenegociacaoConta[];
  parcelas: RenegociacaoParcela[];
}

export interface RenegociacaoConta {
  id: string;
  renegociacaoId: string;
  contaId: string;
  tipoConta: string;
}

export interface RenegociacaoParcela {
  id: string;
  renegociacaoId: string;
  numeroParcela: number;
  dataVencimento: string;
  valor: number;
  situacao: string;
}

export interface CriarRenegociacao {
  tipo: string;
  clienteId?: string;
  fornecedorId?: string;
  contasIds: string[];
  valorDesconto: number;
  valorJuros: number;
  valorMulta: number;
  numeroParcelas: number;
  primeiraVencimento: string;
  observacoes?: string;
}

export const renegociacaoService = {
  listar: async (params?: Record<string, unknown>) => {
    const response = await api.get('/renegociacao', { params });
    return response.data?.data || response.data?.dados || [];
  },
  buscarPorId: async (id: string) => {
    const response = await api.get(`/renegociacao/${id}`);
    return response.data;
  },
  criar: (data: CriarRenegociacao) => api.post('/renegociacao', data),
  confirmar: (id: string) => api.post(`/renegociacao/${id}/confirmar`),
  cancelar: (id: string) => api.post(`/renegociacao/${id}/cancelar`),
  listarContasDisponiveis: async (tipo: string, busca?: string) => {
    const params: Record<string, string> = { tipo };
    if (busca) params.busca = busca;
    const response = await api.get('/renegociacao/disponiveis', { params });
    return response.data?.data || response.data?.dados || [];
  },
};
