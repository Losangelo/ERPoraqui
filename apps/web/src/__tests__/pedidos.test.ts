import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pedidosService } from '@/services/pedidos';
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

describe('pedidosService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listar', () => {
    it('deve chamar GET com filtros', async () => {
      (api.get as any).mockResolvedValue({
        data: {
          dados: [
            { id: 'ped-1', numeroPedido: 'PV000001', valorTotal: 1500, situacao: 'EM_ABERTO' },
          ],
          meta: { total: 1, pagina: 1 },
        },
      });

      const result = await pedidosService.listar({ situacao: 'EM_ABERTO', pagina: 1, limite: 20 });

      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('/pedidos-venda'));
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('situacao=EM_ABERTO'));
      expect(result).toHaveLength(1);
    });

    it('deve retornar array vazio quando resposta não tem dados', async () => {
      (api.get as any).mockResolvedValue({ data: [] });

      const result = await pedidosService.listar();
      expect(result).toEqual([]);
    });

    it('deve extrair dados de response.data.dados', async () => {
      (api.get as any).mockResolvedValue({
        data: {
          dados: [{ id: 'ped-1' }],
          meta: { total: 1 },
        },
      });

      const result = await pedidosService.listar();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('ped-1');
    });
  });

  describe('aprovar', () => {
    it('deve chamar PATCH para aprovar', async () => {
      (api.patch as any).mockResolvedValue({
        data: { id: 'ped-1', situacao: 'CONFIRMADO' },
      });

      const result = await pedidosService.aprovar('ped-1');

      expect(api.patch).toHaveBeenCalledWith('/pedidos-venda/ped-1/aprovar');
      expect(result.situacao).toBe('CONFIRMADO');
    });
  });

  describe('enviar', () => {
    it('deve chamar PATCH para enviar', async () => {
      (api.patch as any).mockResolvedValue({
        data: { id: 'ped-1', situacao: 'ENVIADO' },
      });

      const result = await pedidosService.enviar('ped-1');

      expect(api.patch).toHaveBeenCalledWith('/pedidos-venda/ped-1/enviar');
      expect(result.situacao).toBe('ENVIADO');
    });
  });

  describe('cancelar', () => {
    it('deve chamar PATCH para cancelar', async () => {
      (api.patch as any).mockResolvedValue({
        data: { id: 'ped-1', situacao: 'CANCELADO' },
      });

      const result = await pedidosService.cancelar('ped-1');

      expect(api.patch).toHaveBeenCalledWith('/pedidos-venda/ped-1/cancelar');
      expect(result.situacao).toBe('CANCELADO');
    });
  });

  describe('criar', () => {
    it('deve chamar POST para criar', async () => {
      const dados = {
        filialId: 'fil-1',
        clienteId: 'cli-1',
        itens: [{ produtoId: 'prod-1', quantidade: 2, valorUnitario: 100 }],
      };

      (api.post as any).mockResolvedValue({
        data: { id: 'ped-1', ...dados },
      });

      const result = await pedidosService.criar(dados);

      expect(api.post).toHaveBeenCalledWith('/pedidos-venda', dados);
      expect(result.id).toBe('ped-1');
    });
  });

  describe('buscarPorId', () => {
    it('deve chamar GET para buscar por ID', async () => {
      (api.get as any).mockResolvedValue({
        data: { id: 'ped-1', numeroPedido: 'PV000001' },
      });

      const result = await pedidosService.buscarPorId('ped-1');

      expect(api.get).toHaveBeenCalledWith('/pedidos-venda/ped-1');
      expect(result.id).toBe('ped-1');
    });
  });
});
