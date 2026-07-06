import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import conveniosRoutes from '@/modules/convenios/convenios.routes';
import { criarApp, limparMocks, mockLicencaAtiva } from './helpers';
import { mockPrisma, gerarHeaders } from './setup';

describe('Convênios', () => {
  beforeEach(() => {
    limparMocks();
    mockLicencaAtiva();
  });

  describe('GET /', () => {
    it('deve listar convênios', async () => {
      (mockPrisma.convenio.findMany as any).mockResolvedValue([
        { id: 'conv-1', empresaId: 'emp-1', clienteId: 'cli-1', descricao: 'Convênio 1', status: 'ATIVO' },
      ]);
      (mockPrisma.convenio.count as any).mockResolvedValue(1);

      const app = criarApp((a) => a.use('/', conveniosRoutes));
      const res = await request(app).get('/').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });

    it('deve retornar 401 sem token', async () => {
      const app = criarApp((a) => a.use('/', conveniosRoutes));
      const res = await request(app).get('/');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /', () => {
    it('deve criar convênio', async () => {
      (mockPrisma.convenio.create as any).mockResolvedValue({
        id: 'conv-1', empresaId: 'emp-1', numero: 'CONV-001', clienteId: 'cli-1',
        descricao: 'Convenio Teste', valorTotal: 5000, dataInicio: new Date(), situacao: 'ATIVO',
      });

      const app = criarApp((a) => a.use('/', conveniosRoutes));
      const res = await request(app)
        .post('/')
        .set(gerarHeaders())
        .send({
          clienteId: 'cli-1',
          numero: 'CONV-001',
          descricao: 'Convenio Teste',
          dataInicio: '2026-07-01',
          valorTotal: 5000,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('deve rejeitar convênio sem número', async () => {
      const app = criarApp((a) => a.use('/', conveniosRoutes));
      const res = await request(app)
        .post('/')
        .set(gerarHeaders())
        .send({ clienteId: 'cli-1' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /:id', () => {
    it('deve buscar convênio por ID', async () => {
      (mockPrisma.convenio.findFirst as any).mockResolvedValue({
        id: 'conv-1', empresaId: 'emp-1', numero: 'CONV-001',
      });

      const app = criarApp((a) => a.use('/', conveniosRoutes));
      const res = await request(app).get('/conv-1').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('conv-1');
    });
  });

  describe('PUT /:id', () => {
    it('deve atualizar convênio', async () => {
      (mockPrisma.convenio.findFirst as any).mockResolvedValue({ id: 'conv-1', empresaId: 'emp-1' });
      (mockPrisma.convenio.update as any).mockResolvedValue({ id: 'conv-1' });

      const app = criarApp((a) => a.use('/', conveniosRoutes));
      const res = await request(app)
        .put('/conv-1')
        .set(gerarHeaders())
        .send({ descricao: 'Atualizado' });

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /:id', () => {
    it('deve excluir convênio', async () => {
      (mockPrisma.convenio.findFirst as any).mockResolvedValue({ id: 'conv-1', empresaId: 'emp-1' });
      (mockPrisma.convenio.delete as any).mockResolvedValue({ id: 'conv-1' });

      const app = criarApp((a) => a.use('/', conveniosRoutes));
      const res = await request(app).delete('/conv-1').set(gerarHeaders());

      expect(res.status).toBe(200);
    });
  });

  describe('POST /:id/ativar', () => {
    it('deve ativar convênio', async () => {
      (mockPrisma.convenio.findFirst as any).mockResolvedValue({ id: 'conv-1', empresaId: 'emp-1', situacao: 'SUSPENSO' });
      (mockPrisma.convenio.update as any).mockResolvedValue({ id: 'conv-1', situacao: 'ATIVO' });

      const app = criarApp((a) => a.use('/', conveniosRoutes));
      const res = await request(app).post('/conv-1/ativar').set(gerarHeaders());

      expect(res.status).toBe(200);
    });
  });

  describe('POST /:id/suspender', () => {
    it('deve suspender convênio ativo', async () => {
      (mockPrisma.convenio.findFirst as any).mockResolvedValue({ id: 'conv-1', empresaId: 'emp-1', situacao: 'ATIVO' });
      (mockPrisma.convenio.update as any).mockResolvedValue({ id: 'conv-1', situacao: 'SUSPENSO' });

      const app = criarApp((a) => a.use('/', conveniosRoutes));
      const res = await request(app).post('/conv-1/suspender').set(gerarHeaders());
      expect(res.status).toBe(200);
    });
  });

  describe('POST /:id/encerrar', () => {
    it('deve encerrar convênio', async () => {
      (mockPrisma.convenio.findFirst as any).mockResolvedValue({ id: 'conv-1', empresaId: 'emp-1', situacao: 'ATIVO' });
      (mockPrisma.convenio.update as any).mockResolvedValue({ id: 'conv-1', situacao: 'ENCERRADO' });

      const app = criarApp((a) => a.use('/', conveniosRoutes));
      const res = await request(app).post('/conv-1/encerrar').set(gerarHeaders());
      expect(res.status).toBe(200);
    });
  });
});
