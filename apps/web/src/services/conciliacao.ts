import { api } from './api';

export interface ContaBancaria {
  id: string;
  empresaId: string;
  banco: string;
  agencia: string;
  conta: string;
  tipo: 'CORRENTE' | 'POUPANCA' | 'INVESTIMENTO';
  saldoInicial: number;
  saldoAtual: number;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface CriarContaBancariaDto {
  banco: string;
  agencia: string;
  conta: string;
  tipo?: 'CORRENTE' | 'POUPANCA' | 'INVESTIMENTO';
  saldoInicial?: number;
}

export interface MovimentacaoBancaria {
  id: string;
  contaBancariaId: string;
  dataMovimentacao: string;
  dataCompetencia: string | null;
  tipo: 'CREDITO' | 'DEBITO';
  descricao: string;
  documento: string | null;
  valor: number;
  conciliado: boolean;
  conciliacaoId: string | null;
  dataCriacao: string;
}

export interface CriarMovimentacaoDto {
  contaBancariaId: string;
  dataMovimentacao: string;
  dataCompetencia?: string;
  tipo: 'CREDITO' | 'DEBITO';
  descricao: string;
  documento?: string;
  valor: number;
}

export interface Conciliacao {
  id: string;
  empresaId: string;
  contaBancariaId: string;
  periodoIni: string;
  periodoFin: string;
  dataConciliacao: string;
  totalCreditos: number;
  totalDebitos: number;
  totalConciliado: number;
  totalNaoConciliado: number;
  observacoes: string | null;
  movimentacoes?: MovimentacaoBancaria[];
}

export interface CriarConciliacaoDto {
  contaBancariaId: string;
  periodoIni: string;
  periodoFin: string;
  observacoes?: string;
}

export interface ConciliarMovimentacaoDto {
  movimentacaoId: string;
  conciliacaoId: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const conciliacaoService = {
  listarContas: async (): Promise<ContaBancaria[]> => {
    const response = await api.get<ApiResponse<ContaBancaria[]>>('/financeiro/contas-bancarias');
    return response.data.data;
  },

  criarConta: async (data: CriarContaBancariaDto): Promise<ContaBancaria> => {
    const response = await api.post<ApiResponse<ContaBancaria>>('/financeiro/contas-bancarias', data);
    return response.data.data;
  },

  listarMovimentacoes: async (contaId: string): Promise<MovimentacaoBancaria[]> => {
    const response = await api.get<ApiResponse<MovimentacaoBancaria[]>>(`/financeiro/contas-bancarias/${contaId}/movimentacoes`);
    return response.data.data;
  },

  criarMovimentacao: async (data: CriarMovimentacaoDto): Promise<MovimentacaoBancaria> => {
    const response = await api.post<ApiResponse<MovimentacaoBancaria>>('/financeiro/movimentacoes-bancarias', data);
    return response.data.data;
  },

  desconciliarMovimentacao: async (id: string): Promise<MovimentacaoBancaria> => {
    const response = await api.put<ApiResponse<MovimentacaoBancaria>>(`/financeiro/movimentacoes-bancarias/${id}/desconciliar`);
    return response.data.data;
  },

  listarConciliacoes: async (contaId: string): Promise<Conciliacao[]> => {
    const response = await api.get<ApiResponse<Conciliacao[]>>(`/financeiro/contas-bancarias/${contaId}/conciliacoes`);
    return response.data.data;
  },

  criarConciliacao: async (data: CriarConciliacaoDto): Promise<Conciliacao> => {
    const response = await api.post<ApiResponse<Conciliacao>>('/financeiro/conciliacoes', data);
    return response.data.data;
  },

  conciliarMovimentacao: async (data: ConciliarMovimentacaoDto): Promise<MovimentacaoBancaria> => {
    const response = await api.post<ApiResponse<MovimentacaoBancaria>>('/financeiro/conciliacoes/movimentacoes', data);
    return response.data.data;
  },
};
