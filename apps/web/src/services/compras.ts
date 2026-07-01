import { api } from './api';

export interface PedidoCompra {
  id: string;
  empresaId: string;
  fornecedorId: string;
  fornecedor?: { id: string; nome: string };
  numeroPedido: string;
  serie: string;
  tipoOperacao: string;
  situacao: string;
  dataEmissao?: string;
  dataEntrega?: string;
  valorTotal: number;
  valorDesconto: number;
  valorFrete: number;
  observacoes?: string;
  condicaoPagamento?: string;
  quantidadeParcelas?: number;
  itens?: ItemPedidoCompra[];
  dataCriacao: string;
}

export interface ItemPedidoCompra {
  id: string;
  produtoId: string;
  produto?: { id: string; nome: string };
  quantidade: number;
  quantidadeRecebida: number;
  unidadeMedida: string;
  valorUnitario: number;
  valorTotal: number;
}

export interface CotacaoCompra {
  id: string;
  empresaId: string;
  numeroCotacao: string;
  serie: string;
  situacao: string;
  dataAbertura: string;
  dataValidade?: string;
  observacoes?: string;
  itens?: ItemCotacaoCompra[];
  dataCriacao: string;
}

export interface ItemCotacaoCompra {
  id: string;
  produtoId: string;
  produto?: { id: string; nome: string };
  quantidade: number;
  unidadeMedida: string;
  observacoes?: string;
}

export interface EntradaMercadoria {
  id: string;
  empresaId: string;
  pedidoCompraId: string;
  pedidoCompra?: { numeroPedido: string };
  numeroNota: string;
  serieNota: string;
  dataEmissao?: string;
  dataEntrada: string;
  valorTotal: number;
  valorFrete: number;
  valorDesconto: number;
  observacoes?: string;
  situacao: string;
  itens?: ItemEntrada[];
  dataCriacao: string;
}

export interface ItemEntrada {
  id: string;
  produtoId: string;
  produto?: { id: string; nome: string };
  quantidade: number;
  unidadeMedida: string;
  valorUnitario: number;
  valorTotal: number;
}

export const comprasService = {
  // Pedidos de Compra
  async listarPedidos(filtros?: any): Promise<PedidoCompra[]> {
    const params = new URLSearchParams();
    if (filtros?.fornecedorId) params.append('fornecedorId', filtros.fornecedorId);
    if (filtros?.situacao) params.append('situacao', filtros.situacao);
    params.append('pagina', '1');
    params.append('limite', '100');
    const response = await api.get(`/pedidos-compra?${params}`);
    return response.data?.data || response.data?.dados || [];
  },

  async buscarPedido(id: string): Promise<PedidoCompra> {
    const response = await api.get(`/pedidos-compra/${id}`);
    return response.data;
  },

  async criarPedido(data: Partial<PedidoCompra>): Promise<PedidoCompra> {
    const response = await api.post('/pedidos-compra', data);
    return response.data;
  },

  async atualizarPedido(id: string, data: Partial<PedidoCompra>): Promise<PedidoCompra> {
    const response = await api.put(`/pedidos-compra/${id}`, data);
    return response.data;
  },

  async cancelarPedido(id: string): Promise<void> {
    await api.patch(`/pedidos-compra/${id}/cancelar`);
  },

  // Cotações de Compra
  async listarCotacoes(filtros?: any): Promise<CotacaoCompra[]> {
    const params = new URLSearchParams();
    if (filtros?.situacao) params.append('situacao', filtros.situacao);
    params.append('pagina', '1');
    params.append('limite', '100');
    const response = await api.get(`/cotacoes-compra?${params}`);
    return response.data?.data || response.data?.dados || [];
  },

  async buscarCotacao(id: string): Promise<CotacaoCompra> {
    const response = await api.get(`/cotacoes-compra/${id}`);
    return response.data;
  },

  async criarCotacao(data: Partial<CotacaoCompra>): Promise<CotacaoCompra> {
    const response = await api.post('/cotacoes-compra', data);
    return response.data;
  },

  async atualizarCotacao(id: string, data: Partial<CotacaoCompra>): Promise<CotacaoCompra> {
    const response = await api.put(`/cotacoes-compra/${id}`, data);
    return response.data;
  },

  async excluirCotacao(id: string): Promise<void> {
    await api.delete(`/cotacoes-compra/${id}`);
  },

  // Entradas de Mercadoria
  async listarEntradas(filtros?: any): Promise<EntradaMercadoria[]> {
    const params = new URLSearchParams();
    if (filtros?.pedidoCompraId) params.append('pedidoCompraId', filtros.pedidoCompraId);
    if (filtros?.situacao) params.append('situacao', filtros.situacao);
    params.append('pagina', '1');
    params.append('limite', '100');
    const response = await api.get(`/entradas-mercadoria?${params}`);
    return response.data?.data || response.data?.dados || [];
  },

  async buscarEntrada(id: string): Promise<EntradaMercadoria> {
    const response = await api.get(`/entradas-mercadoria/${id}`);
    return response.data;
  },

  async criarEntrada(data: Partial<EntradaMercadoria>): Promise<EntradaMercadoria> {
    const response = await api.post('/entradas-mercadoria', data);
    return response.data;
  },

  async confirmarEntrada(id: string): Promise<EntradaMercadoria> {
    const response = await api.patch(`/entradas-mercadoria/${id}/confirmar`);
    return response.data;
  },

  async cancelarEntrada(id: string): Promise<void> {
    await api.patch(`/entradas-mercadoria/${id}/cancelar`);
  },
};
