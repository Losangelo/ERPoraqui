import { api } from './api';

export interface PlanoConta {
  id: string;
  empresaId: string;
  codigo: string;
  nome: string;
  tipo: 'SINTETICA' | 'ANALITICA';
  natureza: 'CREDORA' | 'DEVEDORA';
  nivel: number;
  contaPaiId: string | null;
  ativo: boolean;
  contaPai?: { id: string; codigo: string; nome: string };
  subcontas?: PlanoConta[];
}

export interface CriarPlanoContaDto {
  codigo: string;
  nome: string;
  tipo: 'SINTETICA' | 'ANALITICA';
  natureza: 'CREDORA' | 'DEVEDORA';
  contaPaiId?: string;
}

export const planoContasService = {
  listar: async () => {
    const response = await api.get('/plano-contas');
    return response.data as PlanoConta[];
  },

  buscarPorId: async (id: string) => {
    const response = await api.get(`/plano-contas/${id}`);
    return response.data as PlanoConta;
  },

  criar: async (data: CriarPlanoContaDto) => {
    const response = await api.post('/plano-contas', data);
    return response.data;
  },

  atualizar: async (id: string, data: Partial<CriarPlanoContaDto>) => {
    const response = await api.put(`/plano-contas/${id}`, data);
    return response.data;
  },

  excluir: async (id: string) => {
    await api.delete(`/plano-contas/${id}`);
  },

  listarArvore: async () => {
    const response = await api.get('/plano-contas/arvore');
    return response.data as PlanoConta[];
  },
};
