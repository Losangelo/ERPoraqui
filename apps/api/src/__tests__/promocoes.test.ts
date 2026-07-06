import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import promocoesRoutes from '@/modules/promocoes/promocoes.routes';
import { criarApp, limparMocks, mockLicencaAtiva } from './helpers';
import { mockPrisma, gerarHeaders } from './setup';

describe('Promoções', () => {
  beforeEach(() => {
    limparMocks();
    mockLicencaAtiva();
  });

  describe('GET /', () => {
    it('deve listar promoções', async () => {
      (mockPrisma.promocao.findMany as any).mockResolvedValue([
        { id: 'promo-1', empresaId: 'emp-1', descricao: 'Promoção 1', tipo: 'PERCENTUAL', valor: 10, ativo: true },
      ]);
      (mockPrisma.promocao.count as any).mockResolvedValue(1);

      const app = criarApp((a) => a.use('/', promocoesRoutes));
      const res = await request(app).get('/').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.dados).toHaveLength(1);
      expect(res.body.meta.total).toBe(1);
    });

    it('deve retornar 401 sem token', async () => {
      const app = criarApp((a) => a.use('/', promocoesRoutes));
      const res = await request(app).get('/');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /', () => {
    it('deve criar promoção com dados válidos', async () => {
      (mockPrisma.promocao.create as any).mockResolvedValue({
        id: 'promo-1', empresaId: 'emp-1', descricao: '10% off', tipo: 'PERCENTUAL', valor: 10,
        dataInicio: new Date(), dataFim: new Date(), ativo: true,
      });

      const app = criarApp((a) => a.use('/', promocoesRoutes));
      const res = await request(app)
        .post('/')
        .set(gerarHeaders())
        .send({
          descricao: '10% off', tipo: 'PERCENTUAL', valor: 10,
          dataInicio: '2026-07-01', dataFim: '2026-07-31',
        });

      expect(res.status).toBe(201);
      expect(res.body.id).toBe('promo-1');
    });

    it('deve rejeitar promoção sem tipo', async () => {
      const app = criarApp((a) => a.use('/', promocoesRoutes));
      const res = await request(app)
        .post('/')
        .set(gerarHeaders())
        .send({ descricao: 'Teste' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /:id', () => {
    it('deve buscar promoção por ID', async () => {
      (mockPrisma.promocao.findFirst as any).mockResolvedValue({
        id: 'promo-1', empresaId: 'emp-1', descricao: 'Promoção 1',
      });

      const app = criarApp((a) => a.use('/', promocoesRoutes));
      const res = await request(app).get('/promo-1').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.id).toBe('promo-1');
    });

    it('deve retornar 404 para promoção inexistente', async () => {
      (mockPrisma.promocao.findFirst as any).mockResolvedValue(null);

      const app = criarApp((a) => a.use('/', promocoesRoutes));
      const res = await request(app).get('/promo-x').set(gerarHeaders());

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /:id', () => {
    it('deve atualizar promoção', async () => {
      (mockPrisma.promocao.findFirst as any).mockResolvedValue({ id: 'promo-1', empresaId: 'emp-1' });
      (mockPrisma.promocao.update as any).mockResolvedValue({ id: 'promo-1', descricao: 'Atualizada' });

      const app = criarApp((a) => a.use('/', promocoesRoutes));
      const res = await request(app)
        .put('/promo-1')
        .set(gerarHeaders())
        .send({ descricao: 'Atualizada' });

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /:id', () => {
    it('deve excluir promoção', async () => {
      (mockPrisma.promocao.findFirst as any).mockResolvedValue({ id: 'promo-1', empresaId: 'emp-1' });
      (mockPrisma.promocaoItem.deleteMany as any).mockResolvedValue({ count: 0 });
      (mockPrisma.promocao.delete as any).mockResolvedValue({ id: 'promo-1' });

      const app = criarApp((a) => a.use('/', promocoesRoutes));
      const res = await request(app).delete('/promo-1').set(gerarHeaders());

      expect(res.status).toBe(204);
    });
  });

  describe('PATCH /:id/toggle-ativo', () => {
    it('deve alternar ativo', async () => {
      (mockPrisma.promocao.findFirst as any).mockResolvedValue({ id: 'promo-1', empresaId: 'emp-1', ativo: true });
      (mockPrisma.promocao.update as any).mockResolvedValue({ id: 'promo-1', ativo: false });

      const app = criarApp((a) => a.use('/', promocoesRoutes));
      const res = await request(app).patch('/promo-1/toggle-ativo').set(gerarHeaders());

      expect(res.status).toBe(200);
    });
  });
});
