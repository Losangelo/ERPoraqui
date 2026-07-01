import { api } from './api';

export interface Cheque {
  id: string;
  empresaId: string;
  contaBancariaId: string | null;
  clienteId: string | null;
  fornecedorId: string | null;
  numero: string;
  banco: string;
  agencia: string;
  conta: string;
  emitente: string;
  valor: number;
  dataEmissao: string;
  dataVencimento: string;
  dataCompensacao: string | null;
  tipo: 'RECEBIDO' | 'EMITIDO';
  situacao: 'EM_CARTEIRA' | 'DEPOSITADO' | 'COMPENSADO' | 'DEVOLVIDO' | 'REPASSADO' | 'CANCELADO';
  motivoDevolucao: string | null;
  observacoes: string | null;
  dataCriacao: string;
  dataAtualizacao: string;
  cliente?: { id: string; nome: string; documento: string } | null;
  fornecedor?: { id: string; nome: string; documento: string } | null;
  contaBancaria?: { id: string; banco: string; agencia: string; conta: string } | null;
}

export interface ChequeDashboard {
  totalEmCarteira: number;
  totalDepositado: number;
  totalDevolvido: number;
  totalCompensado: number;
  quantidadeEmCarteira: number;
  quantidadeDepositado: number;
  quantidadeDevolvido: number;
  quantidadeCompensado: number;
}

export interface ChequeFiltros {
  tipo?: string;
  situacao?: string;
  dataInicial?: string;
  dataFinal?: string;
  clienteId?: string;
  fornecedorId?: string;
  pagina?: number;
  limite?: number;
}

export const chequesService = {
  listar: async (params?: ChequeFiltros) => {
    const response = await api.get('/cheques', { params });
    return response.data?.data || response.data?.dados || [];
  },

  criar: (data: {
    numero: string;
    banco: string;
    agencia: string;
    conta: string;
    emitente: string;
    valor: number;
    dataEmissao: string;
    dataVencimento: string;
    tipo?: 'RECEBIDO' | 'EMITIDO';
    clienteId?: string;
    fornecedorId?: string;
    contaBancariaId?: string;
    observacoes?: string;
  }) => api.post('/cheques', data),

  buscarPorId: (id: string) => api.get(`/cheques/${id}`),

  atualizar: (id: string, data: {
    numero?: string;
    banco?: string;
    agencia?: string;
    conta?: string;
    emitente?: string;
    valor?: number;
    dataEmissao?: string;
    dataVencimento?: string;
    observacoes?: string;
  }) => api.put(`/cheques/${id}`, data),

  depositar: (id: string) => api.post(`/cheques/${id}/depositar`),

  compensar: (id: string) => api.post(`/cheques/${id}/compensar`),

  devolver: (id: string, motivoDevolucao: string) =>
    api.post(`/cheques/${id}/devolver`, { motivoDevolucao }),

  cancelar: (id: string) => api.post(`/cheques/${id}/cancelar`),

  dashboard: async () => {
    const response = await api.get('/cheques/dashboard');
    return response.data?.data || response.data || {};
  },
};
