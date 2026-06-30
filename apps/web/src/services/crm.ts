import { api } from './api';

export interface Pipeline {
  id: string;
  nome: string;
  descricao?: string;
  cor: string;
  ordem: number;
}

export interface Oportunidade {
  id: string;
  titulo: string;
  descricao?: string;
  valor: number;
  probabilidade: number;
  estagio: string;
  status: 'ABERTA' | 'GANHA' | 'PERDIDA' | 'CANCELADA';
  clienteId?: string;
  pipelineId: string;
  dataFechamentoEsperado?: string;
  dataFechamentoReal?: string;
  pipeline?: Pipeline;
  itens?: OportunidadeItem[];
  tarefas?: Tarefa[];
  interacoes?: Interacao[];
}

export interface OportunidadeItem {
  id: string;
  produtoId?: string;
  produtoNome: string;
  quantidade: number;
  precoUnitario: number;
  desconto: number;
  total: number;
}

export interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: 'REUNIAO' | 'LIGACAO' | 'EMAIL' | 'VISITA' | 'DEMONSTRACAO' | 'PROPOSTA' | 'OUTRO';
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  responsavelId?: string;
  dataVencimento?: string;
  dataConclusao?: string;
  concluida: boolean;
  oportunidade?: { id: string; titulo: string };
}

export interface Interacao {
  id: string;
  tipo: 'LIGACAO' | 'EMAIL' | 'REUNIAO' | 'WHATSAPP' | 'VISITA' | 'DEMONSTRACAO' | 'OUTRO';
  titulo: string;
  descricao?: string;
  duracaoMinutos?: number;
  data: string;
}

export interface Visao360 {
  cliente: any;
  oportunidades: Oportunidade[];
  interacoesRecentes: Interacao[];
  tarefasPendentes: Tarefa[];
  financeiro: {
    faturasPendentes: any[];
    totalPendente: number;
  };
  notasFiscais: any[];
  totalComprado: number;
}

export interface DashboardCRM {
  oportunidades: {
    total: number;
    valorTotal: number;
    valorPonderado: number;
  };
  porEstagio: Record<string, { count: number; valor: number }>;
  tarefasPendentes: number;
  ultimosFechamentos: any[];
}

export const crmService = {
  async getDashboard(): Promise<DashboardCRM> {
    const response = await api.get('/crm/dashboard');
    return response.data;
  },

  async getPipelines(): Promise<Pipeline[]> {
    const response = await api.get('/crm/pipelines');
    return response.data;
  },

  async criarPipeline(data: Partial<Pipeline>): Promise<Pipeline> {
    const response = await api.post('/crm/pipelines', data);
    return response.data;
  },

  async atualizarPipeline(id: string, data: Partial<Pipeline>): Promise<Pipeline> {
    const response = await api.put(`/crm/pipelines/${id}`, data);
    return response.data;
  },

  async excluirPipeline(id: string): Promise<void> {
    await api.delete(`/crm/pipelines/${id}`);
  },

  async getOportunidades(filtros?: { pipelineId?: string; status?: string }): Promise<Oportunidade[]> {
    const response = await api.get('/crm/oportunidades', { params: filtros });
    return response.data;
  },

  async getOportunidade(id: string): Promise<Oportunidade> {
    const response = await api.get(`/crm/oportunidades/${id}`);
    return response.data;
  },

  async criarOportunidade(data: {
    pipelineId: string;
    titulo: string;
    descricao?: string;
    valor: number;
    probabilidade?: number;
    clienteId?: string;
    dataFechamentoEsperado?: string;
    itens?: Partial<OportunidadeItem>[];
  }): Promise<Oportunidade> {
    const response = await api.post('/crm/oportunidades', data);
    return response.data;
  },

  async atualizarOportunidade(id: string, data: Partial<Oportunidade>): Promise<Oportunidade> {
    const response = await api.put(`/crm/oportunidades/${id}`, data);
    return response.data;
  },

  async mudarEstagio(id: string, pipelineId: string): Promise<Oportunidade> {
    const response = await api.post(`/crm/oportunidades/${id}/mudar-estagio`, { pipelineId });
    return response.data;
  },

  async marcarGanha(id: string, criarPedido: boolean = false): Promise<any> {
    const response = await api.post(`/crm/oportunidades/${id}/ganhar`, { criarPedido });
    return response.data;
  },

  async marcarPerdida(id: string, motivo?: string): Promise<Oportunidade> {
    const response = await api.post(`/crm/oportunidades/${id}/perder`, { motivo });
    return response.data;
  },

  async getTarefas(filtros?: { oportunidadeId?: string; concluida?: boolean }): Promise<Tarefa[]> {
    const response = await api.get('/crm/tarefas', { params: filtros });
    return response.data;
  },

  async criarTarefa(data: {
    oportunidadeId?: string;
    titulo: string;
    descricao?: string;
    tipo?: string;
    prioridade?: string;
    responsavelId?: string;
    dataVencimento?: string;
  }): Promise<Tarefa> {
    const response = await api.post('/crm/tarefas', data);
    return response.data;
  },

  async concluirTarefa(id: string): Promise<Tarefa> {
    const response = await api.post(`/crm/tarefas/${id}/concluir`);
    return response.data;
  },

  async getInteracoes(filtros?: { oportunidadeId?: string }): Promise<Interacao[]> {
    const response = await api.get('/crm/interacoes', { params: filtros });
    return response.data;
  },

  async criarInteracao(data: {
    oportunidadeId?: string;
    clienteId?: string;
    tipo: string;
    titulo: string;
    descricao?: string;
    duracaoMinutos?: number;
  }): Promise<Interacao> {
    const response = await api.post('/crm/interacoes', data);
    return response.data;
  },

  async getVisao360Cliente(clienteId: string): Promise<Visao360> {
    const response = await api.get(`/crm/cliente/${clienteId}/visao-360`);
    return response.data;
  },

  async getCampanhas(): Promise<any[]> {
    const response = await api.get('/crm/campanhas');
    return response.data;
  },

  async criarCampanha(data: {
    nome: string;
    descricao?: string;
    tipoSegmento: string;
    produtoId?: string;
    diasInatividade?: number;
    valorMinimo?: number;
  }): Promise<any> {
    const response = await api.post('/crm/campanhas', data);
    return response.data;
  },

  async executarCampanha(id: string): Promise<any> {
    const response = await api.post(`/crm/campanhas/${id}/executar`);
    return response.data;
  },

  async pausarCampanha(id: string): Promise<any> {
    const response = await api.post(`/crm/campanhas/${id}/pausar`);
    return response.data;
  },

  async finalizarCampanha(id: string): Promise<any> {
    const response = await api.post(`/crm/campanhas/${id}/finalizar`);
    return response.data;
  },

  async excluirCampanha(id: string): Promise<void> {
    await api.delete(`/crm/campanhas/${id}`);
  },
};
