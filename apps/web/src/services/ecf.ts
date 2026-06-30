import { api } from './api';

export interface ECF {
  id: string;
  empresaId: string;
  identificacao: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  numeroFabricacao: string;
  versaoSB: string;
  dataInstalacao: string;
  ativo: boolean;
}

export interface Cupom {
  id: string;
  ecfId: string;
  numeroCupom: number;
  coo: number;
  ccf: number;
  dataEmissao: string;
  subtotal: number;
  valorDesconto: number;
  valorAcrescimo: number;
  valorTotal: number;
  formaPagamento: string;
  valorPagamento: number;
  valorTroco: number;
  situacao: string;
  itens: ItemCupom[];
}

export interface ItemCupom {
  id: string;
  codigo: string;
  descricao: string;
  quantidade: number;
  unidadeMedida: string;
  valorUnitario: number;
  valorTotal: number;
}

export interface ReducaoZ {
  id: string;
  ecfId: string;
  dataMovimento: string;
  numeroReducao: number;
  cro: number;
  crz: number;
  valorVendaBruta: number;
  valorTotalSuprimento: number;
  valorTotalSangria: number;
  situacao: string;
}

export const ecfService = {
  listar: async () => {
    const response = await api.get('/ecf');
    return response.data as ECF[];
  },

  buscar: async (id: string) => {
    const response = await api.get(`/ecf/${id}`);
    return response.data as ECF;
  },

  criar: async (data: Partial<ECF>) => {
    const response = await api.post('/ecf', data);
    return response.data;
  },

  atualizar: async (id: string, data: Partial<ECF>) => {
    const response = await api.put(`/ecf/${id}`, data);
    return response.data;
  },

  excluir: async (id: string) => {
    await api.delete(`/ecf/${id}`);
  },

  listarCupons: async (ecfId: string) => {
    const response = await api.get(`/ecf/${ecfId}/cupons`);
    return response.data as Cupom[];
  },

  abrirCupom: async (ecfId: string) => {
    const response = await api.post(`/ecf/${ecfId}/cupom`, {});
    return response.data as Cupom;
  },

  adicionarItem: async (ecfId: string, cupomId: string, item: any) => {
    const response = await api.post(`/ecf/${ecfId}/cupom/${cupomId}/item`, item);
    return response.data;
  },

  finalizarCupom: async (ecfId: string, cupomId: string, data: { formaPagamento: string; valorPagamento: number }) => {
    const response = await api.post(`/ecf/${ecfId}/cupom/${cupomId}/finalizar`, data);
    return response.data as Cupom;
  },

  cancelarCupom: async (ecfId: string, cupomId: string, justificativa: string) => {
    const response = await api.post(`/ecf/${ecfId}/cupom/${cupomId}/cancelar`, { justificativa });
    return response.data;
  },

  listarReducoesZ: async (ecfId: string) => {
    const response = await api.get(`/ecf/${ecfId}/reducoes-z`);
    return response.data as ReducaoZ[];
  },

  criarReducaoZ: async (ecfId: string, data: any) => {
    const response = await api.post(`/ecf/${ecfId}/reducao-z`, data);
    return response.data;
  },

  criarSuprimento: async (ecfId: string, data: { valor: number; tipo: string; observacoes?: string }) => {
    const response = await api.post(`/ecf/${ecfId}/suprimento`, data);
    return response.data;
  },

  criarSangria: async (ecfId: string, data: { valor: number; motivo: string; observacoes?: string }) => {
    const response = await api.post(`/ecf/${ecfId}/sangria`, data);
    return response.data;
  },
};
