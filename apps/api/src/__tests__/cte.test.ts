import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import cteRoutes from '@/modules/cte/cte.routes';
import { criarApp, limparMocks, mockLicencaAtiva } from './helpers';
import { mockPrisma, gerarHeaders } from './setup';

describe('CT-e', () => {
  beforeEach(() => {
    limparMocks();
    mockLicencaAtiva();
  });

  describe('GET /', () => {
    it('deve listar CT-es', async () => {
      (mockPrisma.cte.findMany as any).mockResolvedValue([
        { id: 'cte-1', empresaId: 'emp-1', chave: '57250601010101010101660123456789012345678901', situacao: 'AUTORIZADO' },
      ]);
      (mockPrisma.cte.count as any).mockResolvedValue(1);

      const app = criarApp((a) => a.use('/', cteRoutes));
      const res = await request(app).get('/').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });

    it('deve retornar 401 sem token', async () => {
      const app = criarApp((a) => a.use('/', cteRoutes));
      const res = await request(app).get('/');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /', () => {
    it('deve criar CT-e', async () => {
      (mockPrisma.cte.create as any).mockResolvedValue({
        id: 'cte-1', empresaId: 'emp-1', chave: '57250601010101010101660123456789012345678901',
        tomadorId: 'cli-1', remetenteId: 'cli-2', destinatarioId: 'cli-3',
        valorFrete: 500, valorCarga: 5000, situacao: 'PENDENTE',
      });

      const app = criarApp((a) => a.use('/', cteRoutes));
      const res = await request(app)
        .post('/')
        .set(gerarHeaders())
        .send({
          filialId: 'fil-1',
          tomadorId: 'cli-1',
          tomadorTipo: 'REMETENTE',
          remetenteId: 'cli-2',
          destinatarioId: 'cli-3',
          tipoServico: 'NORMAL',
          valorFrete: 500,
          valorCarga: 5000,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('deve rejeitar CT-e sem tomador', async () => {
      const app = criarApp((a) => a.use('/', cteRoutes));
      const res = await request(app)
        .post('/')
        .set(gerarHeaders())
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe('GET /:id', () => {
    it('deve buscar CT-e por ID', async () => {
      (mockPrisma.cte.findFirst as any).mockResolvedValue({
        id: 'cte-1', empresaId: 'emp-1', chave: '57250601010101010101660123456789012345678901',
      });

      const app = criarApp((a) => a.use('/', cteRoutes));
      const res = await request(app).get('/cte-1').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('cte-1');
    });

    it('deve retornar 404 para CT-e inexistente', async () => {
      (mockPrisma.cte.findFirst as any).mockResolvedValue(null);

      const app = criarApp((a) => a.use('/', cteRoutes));
      const res = await request(app).get('/cte-x').set(gerarHeaders());

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /:id', () => {
    it('deve atualizar CT-e pendente', async () => {
      (mockPrisma.cte.findFirst as any).mockResolvedValue({ id: 'cte-1', empresaId: 'emp-1', situacao: 'PENDENTE' });
      (mockPrisma.cte.update as any).mockResolvedValue({ id: 'cte-1', valorFrete: 600 });

      const app = criarApp((a) => a.use('/', cteRoutes));
      const res = await request(app)
        .put('/cte-1')
        .set(gerarHeaders())
        .send({ valorFrete: 600 });

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /:id', () => {
    it('deve excluir CT-e em digitação', async () => {
      (mockPrisma.cte.findFirst as any).mockResolvedValue({ id: 'cte-1', empresaId: 'emp-1', situacao: 'EM_DIGITACAO' });
      (mockPrisma.cte.delete as any).mockResolvedValue({ id: 'cte-1' });

      const app = criarApp((a) => a.use('/', cteRoutes));
      const res = await request(app).delete('/cte-1').set(gerarHeaders());

      expect(res.status).toBe(200);
    });

    it('deve rejeitar exclusão de CT-e autorizado', async () => {
      (mockPrisma.cte.findFirst as any).mockResolvedValue({ id: 'cte-1', empresaId: 'emp-1', situacao: 'AUTORIZADO' });

      const app = criarApp((a) => a.use('/', cteRoutes));
      const res = await request(app).delete('/cte-1').set(gerarHeaders());

      expect(res.status).toBe(400);
    });
  });

  describe('POST /:id/cancelar', () => {
    it('deve cancelar CT-e autorizado', async () => {
      (mockPrisma.cte.findFirst as any).mockResolvedValue({ id: 'cte-1', empresaId: 'emp-1', situacao: 'AUTORIZADO' });
      (mockPrisma.cte.update as any).mockResolvedValue({ id: 'cte-1', situacao: 'CANCELADO' });

      const app = criarApp((a) => a.use('/', cteRoutes));
      const res = await request(app).post('/cte-1/cancelar').set(gerarHeaders());

      expect(res.status).toBe(200);
    });
  });
});
