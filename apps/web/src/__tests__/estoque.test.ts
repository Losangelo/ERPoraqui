import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EstoqueService } from '@/services/estoque';
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

describe('EstoqueService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listarMovimentacoes', () => {
    it('deve extrair dados de response.data.data', async () => {
      (api.get as any).mockResolvedValue({
        data: {
          data: [{ id: 'mov-1', tipo: 'ENTRADA', quantidade: 10 }],
        },
      });

      const result = await EstoqueService.listarMovimentacoes({});
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('mov-1');
    });

    it('deve retornar array vazio quando não há dados', async () => {
      (api.get as any).mockResolvedValue({ data: {} });

      const result = await EstoqueService.listarMovimentacoes({});
      expect(result).toEqual([]);
    });
  });
});
