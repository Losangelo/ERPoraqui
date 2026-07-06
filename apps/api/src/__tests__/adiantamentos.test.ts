import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { adiantamentosRoutes } from '@/modules/adiantamentos';
import { criarApp, limparMocks, mockLicencaAtiva } from './helpers';
import { mockPrisma, gerarHeaders } from './setup';

describe('Adiantamentos', () => {
  beforeEach(() => {
    limparMocks();
    mockLicencaAtiva();
  });

  describe('GET /', () => {
    it('deve listar adiantamentos', async () => {
      (mockPrisma.adiantamento.findMany as any).mockResolvedValue([
        { id: 'ad-1', empresaId: 'emp-1', descricao: 'Adiantamento 1', valor: 1000, situacao: 'PENDENTE' },
      ]);
      (mockPrisma.adiantamento.count as any).mockResolvedValue(1);

      const app = criarApp((a) => a.use('/', adiantamentosRoutes));
      const res = await request(app).get('/').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });

    it('deve retornar 401 sem token', async () => {
      const app = criarApp((a) => a.use('/', adiantamentosRoutes));
      const res = await request(app).get('/');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /', () => {
    it('deve criar adiantamento', async () => {
      (mockPrisma.adiantamento.create as any).mockResolvedValue({
        id: 'ad-1', empresaId: 'emp-1', valor: 2000, tipo: 'FUNCIONARIO', situacao: 'ABERTO',
        dataAdiantamento: new Date(),
      });

      const app = criarApp((a) => a.use('/', adiantamentosRoutes));
      const res = await request(app)
        .post('/')
        .set(gerarHeaders())
        .send({
          tipo: 'FUNCIONARIO',
          funcionarioId: 'func-1',
          valor: 2000,
          dataAdiantamento: '2026-07-05',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('deve rejeitar adiantamento sem valor', async () => {
      const app = criarApp((a) => a.use('/', adiantamentosRoutes));
      const res = await request(app)
        .post('/')
        .set(gerarHeaders())
        .send({ tipo: 'CLIENTE' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /:id', () => {
    it('deve buscar adiantamento por ID', async () => {
      (mockPrisma.adiantamento.findFirst as any).mockResolvedValue({
        id: 'ad-1', empresaId: 'emp-1',
      });

      const app = criarApp((a) => a.use('/', adiantamentosRoutes));
      const res = await request(app).get('/ad-1').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('ad-1');
    });
  });

  describe('PUT /:id', () => {
    it('deve atualizar adiantamento', async () => {
      (mockPrisma.adiantamento.findFirst as any).mockResolvedValue({ id: 'ad-1', empresaId: 'emp-1' });
      (mockPrisma.adiantamento.update as any).mockResolvedValue({ id: 'ad-1' });

      const app = criarApp((a) => a.use('/', adiantamentosRoutes));
      const res = await request(app)
        .put('/ad-1')
        .set(gerarHeaders())
        .send({ observacoes: 'Atualizado' });

      expect(res.status).toBe(200);
    });
  });

  describe('POST /:id/quitar', () => {
    it('deve quitar adiantamento', async () => {
      (mockPrisma.adiantamento.findFirst as any).mockResolvedValue({ id: 'ad-1', empresaId: 'emp-1', situacao: 'ABERTO' });
      (mockPrisma.adiantamento.update as any).mockResolvedValue({ id: 'ad-1', situacao: 'QUITADO' });

      const app = criarApp((a) => a.use('/', adiantamentosRoutes));
      const res = await request(app).post('/ad-1/quitar').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /:id/cancelar', () => {
    it('deve cancelar adiantamento', async () => {
      (mockPrisma.adiantamento.findFirst as any).mockResolvedValue({ id: 'ad-1', empresaId: 'emp-1', situacao: 'ABERTO' });
      (mockPrisma.adiantamento.update as any).mockResolvedValue({ id: 'ad-1', situacao: 'CANCELADO' });

      const app = criarApp((a) => a.use('/', adiantamentosRoutes));
      const res = await request(app).post('/ad-1/cancelar').set(gerarHeaders());

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /:id', () => {
    it('deve excluir adiantamento pendente', async () => {
      (mockPrisma.adiantamento.findFirst as any).mockResolvedValue({ id: 'ad-1', empresaId: 'emp-1', situacao: 'ABERTO' });
      (mockPrisma.adiantamento.delete as any).mockResolvedValue({ id: 'ad-1' });

      const app = criarApp((a) => a.use('/', adiantamentosRoutes));
      const res = await request(app).delete('/ad-1').set(gerarHeaders());

      expect(res.status).toBe(200);
    });
  });
});
