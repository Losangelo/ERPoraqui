import { api } from './api';

export interface LicitacaoItem {
  id: string;
  licitacaoId: string;
  produtoId: string;
  quantidade: number;
  valorUnitario: number;
  marca?: string;
  produto?: { id: string; nome: string; codigoInterno: string };
}

export interface Licitacao {
  id: string;
  empresaId: string;
  numero: string;
  orgao: string;
  descricao: string;
  tipo: string;
  dataAbertura: string;
  dataEncerramento?: string;
  valorEstimado: number;
  situacao: string;
  observacoes?: string;
  dataCriacao: string;
  dataAtualizacao: string;
  itens?: LicitacaoItem[];
}

export interface LicitacaoInput {
  numero: string;
  orgao: string;
  descricao: string;
  tipo: string;
  dataAbertura: Date;
  dataEncerramento?: Date;
  valorEstimado: number;
  observacoes?: string;
  itens?: { produtoId: string; quantidade: number; valorUnitario: number; marca?: string }[];
}

export const licitacoesService = {
  async listar(params?: Record<string, string>) {
    const searchParams = new URLSearchParams(params);
    const res = await api.get(`/licitacoes?${searchParams}`);
    return res.data;
  },

  async buscarPorId(id: string) {
    const res = await api.get(`/licitacoes/${id}`);
    return res.data;
  },

  async criar(data: LicitacaoInput) {
    const res = await api.post('/licitacoes', data);
    return res.data;
  },

  async atualizar(id: string, data: Partial<LicitacaoInput>) {
    const res = await api.put(`/licitacoes/${id}`, data);
    return res.data;
  },

  async excluir(id: string) {
    const res = await api.delete(`/licitacoes/${id}`);
    return res.data;
  },

  async adicionarItem(licitacaoId: string, data: { produtoId: string; quantidade: number; valorUnitario: number; marca?: string }) {
    const res = await api.post(`/licitacoes/${licitacaoId}/itens`, data);
    return res.data;
  },

  async removerItem(licitacaoId: string, itemId: string) {
    const res = await api.delete(`/licitacoes/${licitacaoId}/itens/${itemId}`);
    return res.data;
  },
};
