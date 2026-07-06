import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import renegociacaoRoutes from '@/modules/renegociacao/renegociacao.routes';
import { criarApp, limparMocks, mockLicencaAtiva } from './helpers';
import { mockPrisma, gerarHeaders } from './setup';

describe('Renegociação', () => {
  beforeEach(() => {
    limparMocks();
    mockLicencaAtiva();
  });

  describe('GET /', () => {
    it('deve listar renegociações', async () => {
      (mockPrisma.renegociacao.findMany as any).mockResolvedValue([
        { id: 'ren-1', empresaId: 'emp-1', descricao: 'Renegociação 1', valorTotal: 5000, situacao: 'PENDENTE' },
      ]);
      (mockPrisma.renegociacao.count as any).mockResolvedValue(1);

      const app = criarApp((a) => a.use('/', renegociacaoRoutes));
      const res = await request(app).get('/').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('GET /disponiveis', () => {
    it('deve listar contas disponíveis para renegociação', async () => {
      (mockPrisma.contaReceber.findMany as any).mockResolvedValue([
        { id: 'cr-1', clienteId: 'cli-1', valor: 1000, saldoDevedor: 1000 },
      ]);

      const app = criarApp((a) => a.use('/', renegociacaoRoutes));
      const res = await request(app)
        .get('/disponiveis')
        .query({ tipo: 'RECEBER' })
        .set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('deve rejeitar tipo inválido', async () => {
      const app = criarApp((a) => a.use('/', renegociacaoRoutes));
      const res = await request(app)
        .get('/disponiveis')
        .query({ tipo: 'INVALIDO' })
        .set(gerarHeaders());

      expect(res.status).toBe(400);
    });
  });

  describe('POST /', () => {
    it('deve criar renegociação', async () => {
      (mockPrisma.contaReceber.findMany as any).mockResolvedValue([{ id: 'cr-1', valorOriginal: 5000 }]);
      (mockPrisma.contaReceber.updateMany as any).mockResolvedValue({ count: 1 });
      (mockPrisma.$transaction as any).mockImplementation(async (cb: any) => cb(mockPrisma));
      (mockPrisma.renegociacao.create as any).mockResolvedValue({
        id: 'ren-1', empresaId: 'emp-1', tipo: 'RECEBER', situacao: 'PENDENTE',
      });

      const app = criarApp((a) => a.use('/', renegociacaoRoutes));
      const res = await request(app)
        .post('/')
        .set(gerarHeaders())
        .send({
          tipo: 'RECEBER',
          clienteId: 'cli-1',
          contasIds: ['cr-1'],
          primeiraVencimento: '2026-08-15',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /:id/confirmar', () => {
    it('deve confirmar renegociação pendente', async () => {
      (mockPrisma.renegociacao.findFirst as any).mockResolvedValue({ id: 'ren-1', empresaId: 'emp-1', situacao: 'PENDENTE' });
      (mockPrisma.renegociacao.update as any).mockResolvedValue({ id: 'ren-1', situacao: 'CONFIRMADA' });

      const app = criarApp((a) => a.use('/', renegociacaoRoutes));
      const res = await request(app).post('/ren-1/confirmar').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /:id/cancelar', () => {
    it('deve cancelar renegociação pendente', async () => {
      (mockPrisma.renegociacao.findFirst as any).mockResolvedValue({ id: 'ren-1', empresaId: 'emp-1', situacao: 'PENDENTE', contas: [] });
      (mockPrisma.$transaction as any).mockImplementation(async (cb: any) => cb(mockPrisma));
      (mockPrisma.renegociacao.update as any).mockResolvedValue({ id: 'ren-1', situacao: 'CANCELADA' });

      const app = criarApp((a) => a.use('/', renegociacaoRoutes));
      const res = await request(app).post('/ren-1/cancelar').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /:id', () => {
    it('deve buscar renegociação por ID', async () => {
      (mockPrisma.renegociacao.findFirst as any).mockResolvedValue({
        id: 'ren-1', empresaId: 'emp-1',
      });

      const app = criarApp((a) => a.use('/', renegociacaoRoutes));
      const res = await request(app).get('/ren-1').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('ren-1');
    });
  });

  describe('Auth', () => {
    it('deve retornar 401 sem token', async () => {
      const app = criarApp((a) => a.use('/', renegociacaoRoutes));
      const res = await request(app).get('/');
      expect(res.status).toBe(401);
    });
  });
});
