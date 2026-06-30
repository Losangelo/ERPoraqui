import { describe, it, expect, vi, beforeEach } from 'vitest';
import { comprasService } from '@/services/compras';
import { api } from '@/services/api';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('comprasService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listarPedidos', () => {
    it('deve chamar GET para listar pedidos de compra', async () => {
      (api.get as any).mockResolvedValue({
        data: {
          dados: [
            { id: 'pc-1', numeroPedido: 'PC000001', fornecedor: { nome: 'Fornecedor A' } },
          ],
        },
      });

      const result = await comprasService.listarPedidos();

      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('/pedidos-compra'));
      expect(result).toHaveLength(1);
    });

    it('deve extrair dados de response.data.dados', async () => {
      (api.get as any).mockResolvedValue({
        data: {
          dados: [{ id: 'pc-1' }],
        },
      });

      const result = await comprasService.listarPedidos();
      expect(result).toHaveLength(1);
    });
  });

  describe('cancelarPedido', () => {
    it('deve chamar PATCH para cancelar pedido de compra', async () => {
      (api.patch as any).mockResolvedValue({ data: {} });

      await comprasService.cancelarPedido('pc-1');

      expect(api.patch).toHaveBeenCalledWith('/pedidos-compra/pc-1/cancelar');
    });
  });

  describe('criarPedido', () => {
    it('deve chamar POST para criar pedido de compra', async () => {
      const dados = { fornecedorId: 'for-1', itens: [] };
      (api.post as any).mockResolvedValue({ data: { id: 'pc-1', ...dados } });

      const result = await comprasService.criarPedido(dados);

      expect(api.post).toHaveBeenCalledWith('/pedidos-compra', dados);
      expect(result.id).toBe('pc-1');
    });
  });
});
