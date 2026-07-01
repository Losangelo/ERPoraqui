import { api } from './api';

export interface NotaFiscal {
  id: string;
  empresaId: string;
  filialId: string;
  clienteId: string;
  numeroNota: string;
  serie: string;
  modelo: string;
  dataEmissao: string;
  dataSaida?: string;
  tipoOperacao: string;
  finalidade: string;
  situacao: 'EM_DIGITACAO' | 'ASSINADA' | 'ENVIADA' | 'AUTORIZADA' | 'CANCELADA' | 'DENEGADA';
  chaveAcesso?: string;
  protocolo?: string;
  valorTotal: number;
  valorICMS: number;
  valorIPI: number;
  valorPIS: number;
  valorCOFINS: number;
  
  // Reforma Tributária 2026 - CBS/IBS
  valorCBS: number;
  aliquotaCBS: number;
  valorIBS: number;
  aliquotaIBS: number;
  valorIS: number;
  valorTotalReformaTributaria: number;
  
  xml?: string;
  danfe?: string;
  cliente?: { id: string; nome: string; cpfCnpj: string };
  filial?: { id: string; nome: string };
}

export interface NotaFiscalFiltros {
  filialId?: string;
  clienteId?: string;
  situacao?: string;
  dataInicial?: string;
  dataFinal?: string;
  busca?: string;
  pagina?: number;
  limite?: number;
}

export interface CriarNotaFiscalDto {
  filialId: string;
  clienteId: string;
  tipoOperacao: string;
  finalidade: string;
  naturezaOperacao?: string;
  itens: {
    produtoId: string;
    quantidade: number;
    valorUnitario: number;
    cfop: string;
    cstICMS: string;
    cstPIS: string;
    cstCOFINS: string;
  }[];
}

export const notasFiscaisService = {
  listar: async (filtros: NotaFiscalFiltros = {}) => {
    const params = new URLSearchParams();
    if (filtros.filialId) params.append('filialId', filtros.filialId);
    if (filtros.clienteId) params.append('clienteId', filtros.clienteId);
    if (filtros.situacao) params.append('situacao', filtros.situacao);
    if (filtros.dataInicial) params.append('dataInicial', filtros.dataInicial);
    if (filtros.dataFinal) params.append('dataFinal', filtros.dataFinal);
    if (filtros.busca) params.append('busca', filtros.busca);
    params.append('pagina', String(filtros.pagina || 1));
    params.append('limite', String(filtros.limite || 20));

    const response = await api.get(`/notas-fiscais?${params}`);
    return response.data?.data || response.data?.dados || [];
  },

  buscarPorId: async (id: string) => {
    const response = await api.get(`/notas-fiscais/${id}`);
    return response.data;
  },

  criar: async (dados: CriarNotaFiscalDto) => {
    const response = await api.post('/notas-fiscais', dados);
    return response.data;
  },

  atualizar: async (id: string, dados: Partial<CriarNotaFiscalDto>) => {
    const response = await api.put(`/notas-fiscais/${id}`, dados);
    return response.data;
  },

  assinar: async (id: string) => {
    const response = await api.post(`/notas-fiscais/${id}/assinar`);
    return response.data;
  },

  enviar: async (id: string) => {
    const response = await api.post(`/notas-fiscais/${id}/enviar`);
    return response.data;
  },

  cancelar: async (id: string, justificativa: string) => {
    const response = await api.post(`/notas-fiscais/${id}/cancelar`, { justificativa });
    return response.data;
  },

  cartaCorrecao: async (id: string, correcao: string) => {
    const response = await api.post(`/notas-fiscais/${id}/carta-correcao`, { correcao });
    return response.data;
  },

  buscarConfiguracao: async () => {
    const response = await api.get('/notas-fiscais/configuracao');
    return response.data;
  },

  configurarCertificado: async (certificado: Buffer, senha: string) => {
    const response = await api.post('/notas-fiscais/configurar', {
      certificado: certificado.toString('base64'),
      senha,
    });
    return response.data;
  },

  listarPorStatus: async (situacao: string) => {
    const response = await api.get(`/notas-fiscais/por-status/${situacao}`);
    return response.data;
  },
};
