import { api } from './api';

export interface Convenio {
  id: string;
  empresaId: string;
  clienteId: string;
  numero: string;
  descricao: string;
  dataInicio: string;
  dataFim?: string;
  valorTotal: number;
  situacao: string;
  observacoes?: string;
  dataCriacao: string;
  dataAtualizacao: string;
  cliente?: { id: string; nome: string; documento: string };
}

export interface ConvenioInput {
  clienteId: string;
  numero: string;
  descricao: string;
  dataInicio: Date;
  dataFim?: Date;
  valorTotal: number;
  observacoes?: string;
}

export const conveniosService = {
  async listar(params?: Record<string, string>) {
    const searchParams = new URLSearchParams(params);
    const res = await api.get(`/convenios?${searchParams}`);
    return res.data;
  },

  async buscarPorId(id: string) {
    const res = await api.get(`/convenios/${id}`);
    return res.data;
  },

  async criar(data: ConvenioInput) {
    const res = await api.post('/convenios', data);
    return res.data;
  },

  async atualizar(id: string, data: Partial<ConvenioInput>) {
    const res = await api.put(`/convenios/${id}`, data);
    return res.data;
  },

  async ativar(id: string) {
    const res = await api.post(`/convenios/${id}/ativar`);
    return res.data;
  },

  async suspender(id: string) {
    const res = await api.post(`/convenios/${id}/suspender`);
    return res.data;
  },

  async encerrar(id: string) {
    const res = await api.post(`/convenios/${id}/encerrar`);
    return res.data;
  },

  async excluir(id: string) {
    const res = await api.delete(`/convenios/${id}`);
    return res.data;
  },
};
