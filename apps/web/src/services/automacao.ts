import { api } from './api';

export interface Automacao {
  id: string;
  nome: string;
  descricao?: string;
  tipo: string;
  status: 'ATIVA' | 'PAUSADA';
  trigger: {
    tipo: 'ESTOQUE_BAIXO' | 'CONTA_VENCENDO' | 'CLIENTE_CADASTRADO';
    threshold?: number;
    diasAntecedencia?: number;
  };
  acoes: {
    tipo: 'CRIAR_TAREFA' | 'ENVIAR_EMAIL' | 'ATUALIZAR_STATUS';
    config?: Record<string, any>;
  }[];
  executadaCount: number;
  ultimaExecucao?: string;
  dataCriacao: string;
  _count?: { logs: number };
}

export interface AutomacaoLog {
  id: string;
  automacaoId: string;
  executada: boolean;
  detalhes: any[];
  erro?: string;
  dataExecucao: string;
  automacao?: { nome: string };
}

export interface AutomacaoDashboard {
  total: number;
  ativas: number;
  pausadas: number;
  totalExecucoes: number;
  ultimosLogs: AutomacaoLog[];
}

export const automacaoService = {
  async getDashboard(): Promise<AutomacaoDashboard> {
    const response = await api.get('/automacao/dashboard');
    return response.data;
  },

  async listar(): Promise<Automacao[]> {
    const response = await api.get('/automacao');
    return response.data;
  },

  async buscarPorId(id: string): Promise<Automacao> {
    const response = await api.get(`/automacao/${id}`);
    return response.data;
  },

  async criar(data: Partial<Automacao>): Promise<Automacao> {
    const response = await api.post('/automacao', data);
    return response.data;
  },

  async atualizar(id: string, data: Partial<Automacao>): Promise<Automacao> {
    const response = await api.put(`/automacao/${id}`, data);
    return response.data;
  },

  async excluir(id: string): Promise<void> {
    await api.delete(`/automacao/${id}`);
  },

  async ativar(id: string): Promise<Automacao> {
    const response = await api.post(`/automacao/${id}/ativar`);
    return response.data;
  },

  async pausar(id: string): Promise<Automacao> {
    const response = await api.post(`/automacao/${id}/pausar`);
    return response.data;
  },

  async executar(id: string): Promise<{ executado: boolean; detalhes: any[] }> {
    const response = await api.post(`/automacao/${id}/executar`);
    return response.data;
  },
};
