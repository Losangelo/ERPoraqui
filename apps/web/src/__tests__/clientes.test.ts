import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clientesService } from '@/services/clientes';
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

describe('clientesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listar', () => {
    it('deve chamar GET com filtros', async () => {
      (api.get as any).mockResolvedValue({
        data: {
          dados: [{ id: 'cli-1', nome: 'Cliente A' }],
          meta: { total: 1 },
        },
      });

      const result = await clientesService.listar({ nome: 'Cliente' });
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('/clientes'));
      expect(result).toHaveLength(1);
    });
  });

  describe('criar', () => {
    it('deve chamar POST para criar cliente', async () => {
      const dados = { nome: 'Novo Cliente', documento: '11111111111', tipoPessoa: 'FISICA' as const };
      (api.post as any).mockResolvedValue({ data: { id: 'cli-1', ...dados } });

      const result = await clientesService.criar(dados);
      expect(api.post).toHaveBeenCalledWith('/clientes', dados);
      expect(result.id).toBe('cli-1');
    });
  });

  describe('atualizar', () => {
    it('deve chamar PUT para atualizar cliente', async () => {
      (api.put as any).mockResolvedValue({ data: { id: 'cli-1', nome: 'Atualizado' } });

      const result = await clientesService.atualizar('cli-1', { nome: 'Atualizado' });
      expect(api.put).toHaveBeenCalledWith('/clientes/cli-1', { nome: 'Atualizado' });
      expect(result.nome).toBe('Atualizado');
    });
  });

  describe('inativar', () => {
    it('deve chamar PATCH para inativar cliente', async () => {
      (api.patch as any).mockResolvedValue({ data: { id: 'cli-1', ativo: false } });

      const result = await clientesService.inativar('cli-1');
      expect(api.patch).toHaveBeenCalledWith('/clientes/cli-1/inativar');
      expect(result.ativo).toBe(false);
    });
  });
});
