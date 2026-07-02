import { api } from './api';

export interface QuitacaoConta {
  id: string;
  quitacaoId: string;
  contaId: string;
  tipoConta: string;
  valorPago: number;
}

export interface Quitacao {
  id: string;
  empresaId: string;
  clienteId: string | null;
  fornecedorId: string | null;
  tipo: string;
  valorTotal: number;
  dataQuitacao: string;
  formaPagamento: string | null;
  observacoes: string | null;
  dataCriacao: string;
  dataAtualizacao: string;
  cliente?: { id: string; nome: string; documento: string } | null;
  fornecedor?: { id: string; nome: string; documento: string } | null;
  contas: QuitacaoConta[];
}

export interface ContaDisponivel {
  id: string;
  numeroDocumento: string;
  numeroParcela: number;
  totalParcelas: number;
  dataVencimento: string;
  valorOriginal: number;
  situacao: string;
  cliente?: { id: string; nome: string };
  fornecedor?: { id: string; nome: string };
}

export interface CriarQuitacao {
  tipo: string;
  clienteId?: string;
  fornecedorId?: string;
  contas: { contaId: string; tipoConta: string; valorPago: number }[];
  dataQuitacao: string;
  formaPagamento?: string;
  observacoes?: string;
}

export const quitacaoService = {
  listar: async (params?: Record<string, unknown>) => {
    const response = await api.get('/quitacoes', { params });
    return response.data?.data || response.data?.dados || [];
  },
  buscarPorId: async (id: string) => {
    const response = await api.get(`/quitacoes/${id}`);
    return response.data;
  },
  criar: (data: CriarQuitacao) => api.post('/quitacoes', data),
  listarContasDisponiveis: async (tipo: string) => {
    const response = await api.get('/quitacoes/disponiveis', { params: { tipo } });
    return response.data?.data || response.data?.dados || [];
  },
};
