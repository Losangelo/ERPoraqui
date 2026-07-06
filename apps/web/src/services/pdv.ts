import { api } from './api';

export interface VendaPDV {
  id: string;
  empresaId: string;
  filialId: string;
  operadorId?: string;
  clienteId?: string;
  numeroCupom: string;
  subtotal: number;
  valorTotal: number;
  valorDesconto: number;
  formaPagamento: string;
  valorPago: number;
  valorTroco: number;
  situacao: 'ABERTA' | 'FINALIZADA' | 'CANCELADA';
  dataVenda: string;
  cliente?: { id: string; nome: string };
  operador?: { id: string; nome: string };
  filial?: { id: string; nome: string };
  itens?: any[];
}

export interface Caixa {
  id: string;
  empresaId: string;
  filialId: string;
  operadorId: string;
  dataAbertura: string;
  dataFechamento?: string;
  saldoInicial: number;
  saldoFinal?: number;
  totalEntradas: number;
  totalSaidas: number;
  situacao: 'ABERTO' | 'FECHADO';
  operador?: { nome: string };
  filial?: { nome: string };
}

export interface PdvFiltros {
  filialId?: string;
  operadorId?: string;
  clienteId?: string;
  formaPagamento?: string;
  situacao?: string;
  dataInicial?: string;
  dataFinal?: string;
  pagina?: number;
  limite?: number;
}

export interface ProdutoPDV {
  id: string;
  codigoInterno: string;
  codigoBarras?: string;
  nome: string;
  precoVenda: number;
  quantidadeEstoque: number;
  unidadeMedida?: { sigla: string };
}

export const pdvService = {
  listarVendas: async (filtros: PdvFiltros = {}) => {
    const params = new URLSearchParams();
    if (filtros.filialId) params.append('filialId', filtros.filialId);
    if (filtros.operadorId) params.append('operadorId', filtros.operadorId);
    if (filtros.clienteId) params.append('clienteId', filtros.clienteId);
    if (filtros.formaPagamento) params.append('formaPagamento', filtros.formaPagamento);
    if (filtros.situacao) params.append('situacao', filtros.situacao);
    if (filtros.dataInicial) params.append('dataInicial', filtros.dataInicial);
    if (filtros.dataFinal) params.append('dataFinal', filtros.dataFinal);
    params.append('pagina', String(filtros.pagina || 1));
    params.append('limite', String(filtros.limite || 20));

    const response = await api.get(`/pdv/vendas?${params}`);
    return response.data?.data || response.data?.dados || [];
  },

  buscarCaixaAberto: async (filialId?: string) => {
    const params = filialId ? `?filialId=${filialId}` : '';
    const response = await api.get(`/pdv/caixa/aberto${params}`);
    return response.data;
  },

  abrirCaixa: async (dados: any) => {
    const response = await api.post('/pdv/caixa/abrir', dados);
    return response.data;
  },

  fecharCaixa: async (id: string, dados: any) => {
    const response = await api.post(`/pdv/caixa/${id}/fechar`, dados);
    return response.data;
  },

  iniciarVenda: async (dados: any) => {
    const response = await api.post('/pdv/venda/iniciar', dados);
    return response.data;
  },

  adicionarItem: async (vendaId: string, dados: any) => {
    const response = await api.post(`/pdv/venda/${vendaId}/itens`, dados);
    return response.data;
  },

  finalizarVenda: async (vendaId: string, dados: any) => {
    const response = await api.post(`/pdv/venda/${vendaId}/finalizar`, dados);
    return response.data;
  },

  cancelarVenda: async (vendaId: string) => {
    const response = await api.post(`/pdv/venda/${vendaId}/cancelar`);
    return response.data;
  },

  listarProdutos: async (termo?: string, pagina = 1, limite = 20) => {
    let params = `?pagina=${pagina}&limite=${limite}`;
    if (termo) params += `&termo=${encodeURIComponent(termo)}`;
    const response = await api.get(`/pdv/produtos${params}`);
    return response.data;
  },

  buscarPorCodigoBarras: async (codigo: string) => {
    const response = await api.get(`/pdv/produtos/barras/${encodeURIComponent(codigo)}`);
    return response.data;
  },

  removerItem: async (vendaId: string, produtoId: string) => {
    const response = await api.delete(`/pdv/venda/${vendaId}/itens/${produtoId}`);
    return response.data;
  },

  atualizarQuantidade: async (vendaId: string, produtoId: string, quantidade: number) => {
    const response = await api.put(`/pdv/venda/${vendaId}/itens/${produtoId}/quantidade`, { quantidade });
    return response.data;
  },

  buscarVenda: async (vendaId: string) => {
    const response = await api.get(`/pdv/vendas/${vendaId}`);
    return response.data;
  },
};
