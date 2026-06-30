import { api } from './api';

export interface Empresa {
  id: string;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  telefone?: string;
  email?: string;
  ativo: boolean;
}

export interface GrupoEmpresarial {
  tipo: 'matriz' | 'filial';
  matriz: Empresa;
  empresas: Empresa[];
}

export const multiEmpresaService = {
  async getGrupo(): Promise<GrupoEmpresarial> {
    const response = await api.get('/multi-empresa/grupo');
    return response.data;
  },

  async getEmpresasDisponiveis(): Promise<Empresa[]> {
    const response = await api.get('/multi-empresa/disponiveis');
    return response.data;
  },

  async vincularEmpresa(filialId: string): Promise<Empresa> {
    const response = await api.post('/multi-empresa/vincular', { filialId });
    return response.data;
  },

  async desvincularEmpresa(filialId: string): Promise<void> {
    await api.post(`/multi-empresa/desvincular/${filialId}`);
  },

  async getEmpresa(id: string): Promise<Empresa> {
    const response = await api.get(`/multi-empresa/${id}`);
    return response.data;
  },
};
