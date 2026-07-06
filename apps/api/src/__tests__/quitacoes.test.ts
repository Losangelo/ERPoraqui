import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { quitacoesRoutes } from '@/modules/quitacoes';
import { criarApp, limparMocks, mockLicencaAtiva } from './helpers';
import { mockPrisma, gerarHeaders } from './setup';

describe('Quitações', () => {
  beforeEach(() => {
    limparMocks();
    mockLicencaAtiva();
  });

  describe('GET /', () => {
    it('deve listar quitações', async () => {
      (mockPrisma.quitacao.findMany as any).mockResolvedValue([
        { id: 'quit-1', empresaId: 'emp-1', tipo: 'RECEBER', valorTotal: 5000 },
      ]);
      (mockPrisma.quitacao.count as any).mockResolvedValue(1);

      const app = criarApp((a) => a.use('/', quitacoesRoutes));
      const res = await request(app).get('/').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });

    it('deve retornar 401 sem token', async () => {
      const app = criarApp((a) => a.use('/', quitacoesRoutes));
      const res = await request(app).get('/');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /disponiveis', () => {
    it('deve listar contas disponíveis para quitação', async () => {
      (mockPrisma.contaReceber.findMany as any).mockResolvedValue([
        { id: 'cr-1', clienteId: 'cli-1', valor: 1000, saldoDevedor: 500 },
      ]);

      const app = criarApp((a) => a.use('/', quitacoesRoutes));
      const res = await request(app)
        .get('/disponiveis')
        .query({ tipo: 'RECEBER' })
        .set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('deve rejeitar tipo inválido', async () => {
      const app = criarApp((a) => a.use('/', quitacoesRoutes));
      const res = await request(app)
        .get('/disponiveis')
        .query({ tipo: 'INVALIDO' })
        .set(gerarHeaders());

      expect(res.status).toBe(400);
    });
  });

  describe('POST /', () => {
    it('deve criar quitação em lote', async () => {
      (mockPrisma.quitacao.create as any).mockResolvedValue({
        id: 'quit-1', empresaId: 'emp-1', tipo: 'RECEBER', valorTotal: 3000,
      });

      const app = criarApp((a) => a.use('/', quitacoesRoutes));
      const res = await request(app)
        .post('/')
        .set(gerarHeaders())
        .send({
          tipo: 'RECEBER',
          clienteId: 'cli-1',
          dataQuitacao: '2026-07-05',
          contas: [
            { contaId: 'cr-1', tipoConta: 'RECEBER', valorPago: 1000 },
            { contaId: 'cr-2', tipoConta: 'RECEBER', valorPago: 2000 },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('deve rejeitar quitação sem contas', async () => {
      const app = criarApp((a) => a.use('/', quitacoesRoutes));
      const res = await request(app)
        .post('/')
        .set(gerarHeaders())
        .send({ tipo: 'RECEBER', dataQuitacao: '2026-07-05' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /:id', () => {
    it('deve buscar quitação por ID', async () => {
      (mockPrisma.quitacao.findFirst as any).mockResolvedValue({
        id: 'quit-1', empresaId: 'emp-1',
      });

      const app = criarApp((a) => a.use('/', quitacoesRoutes));
      const res = await request(app).get('/quit-1').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('quit-1');
    });
  });
});
