import { api } from './api';

export interface DREPeriodo {
  dataInicial: string;
  dataFinal: string;
}

export interface DREData {
  periodo: DREPeriodo;
  receitaBruta: number;
  devolucoesAbatimentos: number;
  receitaLiquida: number;
  custoMercadoriasVendidas: number;
  lucroBruto: number;
  despesasOperacionais: {
    total: number;
    detalhamento: Record<string, number>;
  };
  resultadoFinanceiro: number;
  lucroOperacional: number;
  impostos: number;
  lucroLiquido: number;
  margemLucro: number;
}

export interface DREMensal {
  ano: number;
  meses: {
    mes: number;
    nome: string;
    receitaBruta: number;
    despesasTotais: number;
    resultado: number;
  }[];
  totalReceita: number;
  totalDespesas: number;
  resultadoAnual: number;
}

export interface DREComparativo {
  periodo1: { dataInicial: string; dataFinal: string; receitaBruta: number; lucroLiquido: number };
  periodo2: { dataInicial: string; dataFinal: string; receitaBruta: number; lucroLiquido: number };
  variacao: { receitaBruta: number; lucroLiquido: number };
}

export const dreService = {
  gerarDRE: async (dataInicial?: string, dataFinal?: string) => {
    const params = new URLSearchParams();
    if (dataInicial) params.append('dataInicial', dataInicial);
    if (dataFinal) params.append('dataFinal', dataFinal);
    const response = await api.get(`/dre?${params}`);
    return response.data as DREData;
  },

  gerarDREMensal: async (ano?: number) => {
    const params = new URLSearchParams();
    if (ano) params.append('ano', String(ano));
    const response = await api.get(`/dre/mensal?${params}`);
    return response.data as DREMensal;
  },

  gerarDREAnual: async (anos: number = 3) => {
    const response = await api.get(`/dre/anual?anos=${anos}`);
    return response.data;
  },

  gerarDREComparativo: async (dataInicial1: string, dataFinal1: string, dataInicial2: string, dataFinal2: string) => {
    const response = await api.get(`/dre/comparativo?dataInicial1=${dataInicial1}&dataFinal1=${dataFinal1}&dataInicial2=${dataInicial2}&dataFinal2=${dataFinal2}`);
    return response.data as DREComparativo;
  },
};
