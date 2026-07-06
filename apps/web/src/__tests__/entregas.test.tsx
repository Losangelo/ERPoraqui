import { describe, it, expect, vi, beforeEach } from 'vitest';
import { entregasService } from '@/services/entregas';
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

describe('EntregasService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listar', () => {
    it('deve chamar GET com filtros', async () => {
      (api.get as any).mockResolvedValue({
        data: {
          dados: [{ id: 'ent-1', numero: 1, status: 'PENDENTE' }],
          meta: { total: 1, pagina: 1 },
        },
      });

      const result = await entregasService.listar({ status: 'PENDENTE' });

      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('/entregas'));
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('status=PENDENTE'));
      expect(result).toHaveLength(1);
    });

    it('deve retornar array vazio quando não há dados', async () => {
      (api.get as any).mockResolvedValue({ data: [] });

      const result = await entregasService.listar();
      expect(result).toEqual([]);
    });
  });

  describe('criar', () => {
    it('deve chamar POST com dados da entrega', async () => {
      (api.post as any).mockResolvedValue({
        data: { id: 'ent-1', numero: 1 },
      });

      const result = await entregasService.criar({
        clienteId: 'cli-1',
        enderecoEntrega: { logradouro: 'Rua A', numero: '100', bairro: 'Centro', cidade: 'São Paulo', uf: 'SP', cep: '01000-000' },
      });

      expect(api.post).toHaveBeenCalledWith(
        expect.stringContaining('/entregas'),
        expect.objectContaining({ clienteId: 'cli-1' }),
      );
      expect(result.id).toBe('ent-1');
    });
  });

  describe('agendar', () => {
    it('deve chamar PATCH para agendar', async () => {
      (api.patch as any).mockResolvedValue({
        data: { id: 'ent-1', status: 'AGENDADO' },
      });

      const result = await entregasService.agendar('ent-1', { dataAgendamento: '2026-07-02T14:00:00Z' });

      expect(api.patch).toHaveBeenCalledWith(
        expect.stringContaining('/entregas/ent-1/agendar'),
        expect.any(Object),
      );
      expect(result.status).toBe('AGENDADO');
    });
  });

  describe('saiuParaEntrega', () => {
    it('deve chamar PATCH para saiu-para-entrega', async () => {
      (api.patch as any).mockResolvedValue({
        data: { id: 'ent-1', status: 'SAIU_PARA_ENTREGA' },
      });

      const result = await entregasService.saiuParaEntrega('ent-1');

      expect(api.patch).toHaveBeenCalledWith(
        expect.stringContaining('/entregas/ent-1/saiu-para-entrega'),
      );
      expect(result.status).toBe('SAIU_PARA_ENTREGA');
    });
  });

  describe('entregue', () => {
    it('deve chamar PATCH para entregue', async () => {
      (api.patch as any).mockResolvedValue({
        data: { id: 'ent-1', status: 'ENTREGUE' },
      });

      const result = await entregasService.entregue('ent-1');
      expect(result.status).toBe('ENTREGUE');
    });
  });

  describe('tentativaFalhou', () => {
    it('deve chamar PATCH para tentativa-falhou', async () => {
      (api.patch as any).mockResolvedValue({
        data: { id: 'ent-1', status: 'TENTATIVA_FALHOU' },
      });

      const result = await entregasService.tentativaFalhou('ent-1', { motivoFalha: 'Cliente ausente' });
      expect(result.status).toBe('TENTATIVA_FALHOU');
    });
  });

  describe('cancelar', () => {
    it('deve chamar PATCH para cancelar', async () => {
      (api.patch as any).mockResolvedValue({
        data: { id: 'ent-1', status: 'CANCELADO' },
      });

      const result = await entregasService.cancelar('ent-1');
      expect(result.status).toBe('CANCELADO');
    });
  });

  describe('Motoristas', () => {
    it('deve listar motoristas', async () => {
      (api.get as any).mockResolvedValue({
        data: { dados: [{ id: 'mot-1', nome: 'João' }] },
      });

      const result = await entregasService.listarMotoristas();
      expect(result).toHaveLength(1);
    });

    it('deve criar motorista', async () => {
      (api.post as any).mockResolvedValue({
        data: { id: 'mot-1', nome: 'João' },
      });

      const result = await entregasService.criarMotorista({ nome: 'João', cpf: '12345678901', cnh: '123456', cnhCategoria: 'B', telefone: '11999999999' });
      expect(result.id).toBe('mot-1');
    });
  });

  describe('Veículos', () => {
    it('deve listar veículos', async () => {
      (api.get as any).mockResolvedValue({
        data: { dados: [{ id: 'vei-1', placa: 'ABC-1234' }] },
      });

      const result = await entregasService.listarVeiculos();
      expect(result).toHaveLength(1);
    });

    it('deve criar veículo', async () => {
      (api.post as any).mockResolvedValue({
        data: { id: 'vei-1', placa: 'ABC-1234' },
      });

      const result = await entregasService.criarVeiculo({ placa: 'ABC-1234', modelo: 'Fiorino' });
      expect(result.id).toBe('vei-1');
    });
  });

  describe('Taxas', () => {
    it('deve listar taxas', async () => {
      (api.get as any).mockResolvedValue({
        data: { dados: [{ id: 'tax-1', nome: 'Taxa Fixa', tipo: 'FIXA', valor: 15 }] },
      });

      const result = await entregasService.listarTaxas();
      expect(result).toHaveLength(1);
    });

    it('deve calcular taxa', async () => {
      (api.post as any).mockResolvedValue({
        data: { taxaId: 'tax-1', valor: 20 },
      });

      const result = await entregasService.calcularTaxa({ cep: '01000-000' });
      expect(result.valor).toBe(20);
    });
  });
});
