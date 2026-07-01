import { api } from './api';

export interface PedidoVenda {
  id: string;
  empresaId: string;
  filialId: string;
  clienteId: string;
  vendedorId?: string;
  transportadoraId?: string;
  numeroPedido: string;
  serie: string;
  dataEmissao: string;
  dataEntrega?: string;
  valorSubtotal: number;
  valorDesconto: number;
  valorFrete: number;
  valorOutrosAcrescimos: number;
  valorTotal: number;
  formaPagamento: string;
  situacao: 'PENDENTE' | 'APROVADO' | 'EM_PROCESSAMENTO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO';
  observacoes?: string;
  cliente?: { id: string; nome: string };
  filial?: { id: string; nome: string };
  vendedor?: { id: string; nome: string };
  itens?: any[];
}

export interface PedidoVendaFiltros {
  filialId?: string;
  clienteId?: string;
  vendedorId?: string;
  situacao?: string;
  dataInicial?: string;
  dataFinal?: string;
  busca?: string;
  pagina?: number;
  limite?: number;
}

export const pedidosService = {
  listar: async (filtros: PedidoVendaFiltros = {}) => {
    const params = new URLSearchParams();
    if (filtros.filialId) params.append('filialId', filtros.filialId);
    if (filtros.clienteId) params.append('clienteId', filtros.clienteId);
    if (filtros.vendedorId) params.append('vendedorId', filtros.vendedorId);
    if (filtros.situacao) params.append('situacao', filtros.situacao);
    if (filtros.dataInicial) params.append('dataInicial', filtros.dataInicial);
    if (filtros.dataFinal) params.append('dataFinal', filtros.dataFinal);
    if (filtros.busca) params.append('busca', filtros.busca);
    params.append('pagina', String(filtros.pagina || 1));
    params.append('limite', String(filtros.limite || 20));

    const response = await api.get(`/pedidos-venda?${params}`);
    return response.data?.data || response.data?.dados || [];
  },

  buscarPorId: async (id: string) => {
    const response = await api.get(`/pedidos-venda/${id}`);
    return response.data;
  },

  criar: async (dados: any) => {
    const response = await api.post('/pedidos-venda', dados);
    return response.data;
  },

  atualizar: async (id: string, dados: any) => {
    const response = await api.put(`/pedidos-venda/${id}`, dados);
    return response.data;
  },

  cancelar: async (id: string) => {
    const response = await api.patch(`/pedidos-venda/${id}/cancelar`);
    return response.data;
  },

  aprovar: async (id: string) => {
    const response = await api.patch(`/pedidos-venda/${id}/aprovar`);
    return response.data;
  },

  enviar: async (id: string) => {
    const response = await api.patch(`/pedidos-venda/${id}/enviar`);
    return response.data;
  },
};
