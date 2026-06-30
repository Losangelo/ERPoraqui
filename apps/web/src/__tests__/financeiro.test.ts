import { describe, it, expect, vi, beforeEach } from 'vitest';
import { financeiroService } from '@/services/financeiro';
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

describe('financeiroService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listarReceber', () => {
    it('deve extrair dados de response.data.data', async () => {
      (api.get as any).mockResolvedValue({
        data: {
          data: [{ id: 'cr-1', valorOriginal: 1500 }],
        },
      });

      const result = await financeiroService.listarReceber();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('cr-1');
    });

    it('deve lidar com response.data sendo array', async () => {
      (api.get as any).mockResolvedValue({
        data: [{ id: 'cr-1' }, { id: 'cr-2' }],
      });

      const result = await financeiroService.listarReceber();
      expect(result).toHaveLength(2);
    });

    it('deve chamar api.get com params', async () => {
      (api.get as any).mockResolvedValue({ data: [] });

      await financeiroService.listarReceber({ situacao: 'ABERTA' });

      expect(api.get).toHaveBeenCalledWith('/financeiro/contas-receber', {
        params: { situacao: 'ABERTA' },
      });
    });
  });

  describe('listarPagar', () => {
    it('deve extrair dados de response.data.data', async () => {
      (api.get as any).mockResolvedValue({
        data: {
          data: [{ id: 'cp-1', valorOriginal: 2500 }],
        },
      });

      const result = await financeiroService.listarPagar();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('cp-1');
    });

    it('deve lidar com response.data sendo array', async () => {
      (api.get as any).mockResolvedValue({
        data: [{ id: 'cp-1' }],
      });

      const result = await financeiroService.listarPagar();
      expect(result).toHaveLength(1);
    });
  });
});
