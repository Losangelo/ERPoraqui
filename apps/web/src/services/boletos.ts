import { api } from './api';

export interface Boleto {
  id: string;
  empresaId: string;
  contaReceberId: string;
  bancoId: string | null;
  numeroBoleto: string;
  numeroDocumento: string;
  dataVencimento: string;
  valorOriginal: number;
  valorJuros: number;
  valorMulta: number;
  valorDesconto: number;
  valorPago: number;
  situacao: 'EMITIDO' | 'ENVIADO' | 'BAIXADO' | 'BAIXADO_MANUALMENTE' | 'VENCIDO' | 'CANCELADO';
  linhaDigitavel?: string;
  codigoBarras?: string;
  contaReceber?: { cliente: { nome: string }; numeroDocumento: string };
  banco?: { nome: string };
}

export interface BoletosFiltros {
  contaReceberId?: string;
  situacao?: string;
  dataInicial?: string;
  dataFinal?: string;
  pagina?: number;
  limite?: number;
}

export const boletosService = {
  listar: async (filtros: BoletosFiltros = {}) => {
    const params = new URLSearchParams();
    if (filtros.contaReceberId) params.append('contaReceberId', filtros.contaReceberId);
    if (filtros.situacao) params.append('situacao', filtros.situacao);
    if (filtros.dataInicial) params.append('dataInicial', filtros.dataInicial);
    if (filtros.dataFinal) params.append('dataFinal', filtros.dataFinal);
    params.append('pagina', String(filtros.pagina || 1));
    params.append('limite', String(filtros.limite || 20));

    const response = await api.get(`/boletos?${params}`);
    return response.data?.data || response.data?.dados || [];
  },

  buscarPorId: async (id: string) => {
    const response = await api.get(`/boletos/${id}`);
    return response.data;
  },

  criar: async (dados: any) => {
    const response = await api.post('/boletos', dados);
    return response.data;
  },

  baixar: async (id: string, dados: any) => {
    const response = await api.post(`/boletos/${id}/baixar`, dados);
    return response.data;
  },

  cancelar: async (id: string) => {
    const response = await api.post(`/boletos/${id}/cancelar`);
    return response.data;
  },

  segundaVia: async (id: string) => {
    const response = await api.post(`/boletos/${id}/segunda-via`);
    return response.data;
  },
};
