import { api } from './api';

export interface NFCe {
  id: string;
  empresaId: string;
  filialId: string;
  clienteId: string;
  numero: number;
  serie: string;
  modelo: string;
  chaveAcesso: string;
  dataEmissao: string;
  valorTotal: number;
  situacao: string;
  naturezaOperacao: string;
  
  // Reforma Tributária 2026 - CBS/IBS
  valorCBS?: number;
  aliquotaCBS?: number;
  valorIBS?: number;
  aliquotaIBS?: number;
  valorTotalReformaTributaria?: number;
  
  cliente?: { id: string; nome: string; documento: string };
  filial?: { id: string; nome: string };
  itens?: any[];
}

export interface NFCeFiltros {
  filialId?: string;
  clienteId?: string;
  situacao?: string;
  dataInicial?: string;
  dataFinal?: string;
  pagina?: number;
  limite?: number;
}

export interface CriarNFCeDto {
  filialId: string;
  clienteId?: string;
  naturezaOperacao?: string;
  observacoes?: string;
  informacoesComplementares?: string;
  itens: {
    produtoId?: string;
    codigo: string;
    descricao: string;
    ncm?: string;
    cfop?: string;
    unidadeComercial: string;
    quantidadeComercial: number;
    valorUnitarioComercial: number;
    valorDesconto?: number;
    icmsAliquota?: number;
    pisAliquota?: number;
    cofinsAliquota?: number;
    // Reforma Tributária 2026 - Imposto Seletivo
    isAliquota?: number;
  }[];
}

export const nfceService = {
  listar: async (filtros: NFCeFiltros = {}) => {
    const params = new URLSearchParams();
    if (filtros.filialId) params.append('filialId', filtros.filialId);
    if (filtros.situacao) params.append('situacao', filtros.situacao);
    if (filtros.dataInicial) params.append('dataInicial', filtros.dataInicial);
    if (filtros.dataFinal) params.append('dataFinal', filtros.dataFinal);
    params.append('pagina', String(filtros.pagina || 1));
    params.append('limite', String(filtros.limite || 20));
    const response = await api.get(`/nfce?${params}`);
    return response.data?.data || response.data || [];
  },

  buscarPorId: async (id: string) => {
    const response = await api.get(`/nfce/${id}`);
    return response.data as NFCe;
  },

  criar: async (dados: CriarNFCeDto) => {
    const response = await api.post('/nfce', dados);
    return response.data;
  },

  atualizar: async (id: string, dados: Partial<CriarNFCeDto>) => {
    const response = await api.put(`/nfce/${id}`, dados);
    return response.data;
  },

  assinar: async (id: string) => {
    const response = await api.post(`/nfce/${id}/assinar`);
    return response.data;
  },

  enviar: async (id: string) => {
    const response = await api.post(`/nfce/${id}/enviar`);
    return response.data;
  },

  cancelar: async (id: string, justificativa: string) => {
    const response = await api.post(`/nfce/${id}/cancelar`, { justificativa });
    return response.data;
  },

  ativarContingencia: async (id: string) => {
    const response = await api.post(`/nfce/${id}/contingencia`);
    return response.data;
  },

  listarPorStatus: async (situacao: string) => {
    const response = await api.get(`/nfce/por-status/${situacao}`);
    return response.data;
  },

  buscarConfiguracao: async () => {
    const response = await api.get('/nfce/configuracao');
    return response.data;
  },

  configurar: async (config: any) => {
    const response = await api.post('/nfce/configurar', config);
    return response.data;
  },
};
