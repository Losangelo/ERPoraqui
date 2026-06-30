import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pdvService } from '@/services/pdv';
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

describe('pdvService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('abrirCaixa', () => {
    it('deve chamar POST para abrir caixa', async () => {
      const dados = { filialId: 'fil-1', operadorId: 'oper-1', saldoInicial: 100 };
      (api.post as any).mockResolvedValue({
        data: { success: true, data: { id: 'cx-1', ...dados, situacao: 'ABERTO' } },
      });

      const result = await pdvService.abrirCaixa(dados);
      expect(api.post).toHaveBeenCalledWith('/pdv/caixa/abrir', dados);
      expect(result.success).toBe(true);
    });
  });

  describe('buscarCaixaAberto', () => {
    it('deve chamar GET com filialId', async () => {
      (api.get as any).mockResolvedValue({
        data: {
          success: true,
          data: { id: 'cx-1', filialId: 'fil-1', situacao: 'ABERTO' },
        },
      });

      const result = await pdvService.buscarCaixaAberto('fil-1');
      expect(api.get).toHaveBeenCalledWith('/pdv/caixa/aberto?filialId=fil-1');
      expect(result.success).toBe(true);
    });
  });

  describe('fecharCaixa', () => {
    it('deve chamar POST para fechar caixa', async () => {
      (api.post as any).mockResolvedValue({
        data: { success: true, data: { id: 'cx-1', situacao: 'FECHADO' } },
      });

      const result = await pdvService.fecharCaixa('cx-1', { saldoFinal: 500 });
      expect(api.post).toHaveBeenCalledWith('/pdv/caixa/cx-1/fechar', { saldoFinal: 500 });
      expect(result.success).toBe(true);
    });
  });
});
