import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import garantiasRoutes from '@/modules/garantias/garantias.routes';
import { criarApp, limparMocks, mockLicencaAtiva } from './helpers';
import { mockPrisma, gerarHeaders } from './setup';

describe('Garantias', () => {
  beforeEach(() => {
    limparMocks();
    mockLicencaAtiva();
  });

  describe('GET /garantias', () => {
    it('deve listar garantias', async () => {
      (mockPrisma.garantia.findMany as any).mockResolvedValue([
        {
          id: 'g-1', empresaId: 'emp-1', numero: 'GAR-001', status: 'ATIVA',
          cliente: { id: 'cli-1', nome: 'Cliente A' },
          produto: { id: 'prod-1', nome: 'Produto X' },
        },
      ]);
      (mockPrisma.garantia.count as any).mockResolvedValue(1);

      const app = criarApp((a) => a.use('/garantias', garantiasRoutes));
      const res = await request(app).get('/garantias').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('POST /garantias', () => {
    it('deve criar garantia', async () => {
      (mockPrisma.garantia.findUnique as any).mockResolvedValue(null);
      (mockPrisma.garantia.create as any).mockResolvedValue({
        id: 'g-1', empresaId: 'emp-1', numero: 'GAR-001', status: 'ATIVA',
        cliente: { id: 'cli-1', nome: 'Cliente A' },
        produto: { id: 'prod-1', nome: 'Produto X' },
      });

      const app = criarApp((a) => a.use('/garantias', garantiasRoutes));
      const res = await request(app)
        .post('/garantias')
        .set(gerarHeaders())
        .send({
          numero: 'GAR-001', clienteId: 'cli-1', produtoId: 'prod-1',
          dataInicio: '2026-01-01', prazoDias: 365, cobertura: 'Garantia total',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('deve rejeitar garantia duplicada', async () => {
      (mockPrisma.garantia.findUnique as any).mockResolvedValue({ id: 'g-existente' });

      const app = criarApp((a) => a.use('/garantias', garantiasRoutes));
      const res = await request(app)
        .post('/garantias')
        .set(gerarHeaders())
        .send({
          numero: 'GAR-001', clienteId: 'cli-1', produtoId: 'prod-1',
          dataInicio: '2026-01-01', prazoDias: 365,
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /garantias/:id', () => {
    it('deve buscar garantia por ID', async () => {
      (mockPrisma.garantia.findFirst as any).mockResolvedValue({
        id: 'g-1', empresaId: 'emp-1', numero: 'GAR-001',
        cliente: { id: 'cli-1', nome: 'Cliente A' },
        produto: { id: 'prod-1', nome: 'Produto X' },
      });

      const app = criarApp((a) => a.use('/garantias', garantiasRoutes));
      const res = await request(app).get('/garantias/g-1').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('g-1');
    });
  });

  describe('DELETE /garantias/:id', () => {
    it('deve excluir garantia', async () => {
      (mockPrisma.garantia.findFirst as any).mockResolvedValue({ id: 'g-1', empresaId: 'emp-1' });
      (mockPrisma.garantia.delete as any).mockResolvedValue({ id: 'g-1' });

      const app = criarApp((a) => a.use('/garantias', garantiasRoutes));
      const res = await request(app).delete('/garantias/g-1').set(gerarHeaders());

      expect(res.status).toBe(200);
    });
  });

  describe('Verificar elegibilidade', () => {
    it('deve retornar elegível quando garantia vigente existe', async () => {
      (mockPrisma.garantia.findMany as any).mockResolvedValue([
        { id: 'g-1', empresaId: 'emp-1', status: 'ATIVA', dataFim: new Date(Date.now() + 86400000) },
      ]);

      const app = criarApp((a) => a.use('/garantias', garantiasRoutes));
      const res = await request(app).get('/garantias/prod-1/cli-1/verificar').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.data.elegivel).toBe(true);
    });

    it('deve retornar não elegível quando sem garantia', async () => {
      (mockPrisma.garantia.findMany as any).mockResolvedValue([]);
      (mockPrisma.garantiaRegra.findFirst as any).mockResolvedValue(null);

      const app = criarApp((a) => a.use('/garantias', garantiasRoutes));
      const res = await request(app).get('/garantias/prod-1/cli-1/verificar').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.data.elegivel).toBe(false);
    });
  });

  describe('Regras', () => {
    it('GET /garantias/regras deve listar regras', async () => {
      (mockPrisma.garantiaRegra.findMany as any).mockResolvedValue([
        { id: 'r-1', empresaId: 'emp-1', prazoDias: 365, ativo: true },
      ]);

      const app = criarApp((a) => a.use('/garantias', garantiasRoutes));
      const res = await request(app).get('/garantias/regras').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });

    it('POST /garantias/regras deve criar regra', async () => {
      (mockPrisma.garantiaRegra.findFirst as any).mockResolvedValue(null);
      (mockPrisma.garantiaRegra.create as any).mockResolvedValue({
        id: 'r-1', empresaId: 'emp-1', prazoDias: 365, tipo: 'FABRICA', ativo: true,
      });

      const app = criarApp((a) => a.use('/garantias', garantiasRoutes));
      const res = await request(app)
        .post('/garantias/regras')
        .set(gerarHeaders())
        .send({ prazoDias: 365, tipo: 'FABRICA', cobertura: 'Total', produtoId: 'prod-1' });

      expect(res.status).toBe(201);
    });

    it('PUT /garantias/regras/:id deve atualizar regra', async () => {
      (mockPrisma.garantiaRegra.findFirst as any).mockResolvedValue({ id: 'r-1', empresaId: 'emp-1' });
      (mockPrisma.garantiaRegra.update as any).mockResolvedValue({ id: 'r-1', prazoDias: 730 });

      const app = criarApp((a) => a.use('/garantias', garantiasRoutes));
      const res = await request(app)
        .put('/garantias/regras/r-1')
        .set(gerarHeaders())
        .send({ prazoDias: 730 });

      expect(res.status).toBe(200);
    });

    it('DELETE /garantias/regras/:id deve excluir regra', async () => {
      (mockPrisma.garantiaRegra.findFirst as any).mockResolvedValue({ id: 'r-1', empresaId: 'emp-1' });
      (mockPrisma.garantiaRegra.delete as any).mockResolvedValue({ id: 'r-1' });

      const app = criarApp((a) => a.use('/garantias', garantiasRoutes));
      const res = await request(app).delete('/garantias/regras/r-1').set(gerarHeaders());

      expect(res.status).toBe(200);
    });
  });
});
