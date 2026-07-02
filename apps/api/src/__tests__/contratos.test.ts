import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import contratosRoutes from '@/modules/contratos/contratos.routes';
import { criarApp, limparMocks, mockLicencaAtiva } from './helpers';
import { mockPrisma, gerarHeaders } from './setup';

describe('Contratos', () => {
  beforeEach(() => {
    limparMocks();
    mockLicencaAtiva();
  });

  describe('GET /contratos', () => {
    it('deve listar contratos', async () => {
      (mockPrisma.contrato.findMany as any).mockResolvedValue([
        {
          id: 'ct-1', empresaId: 'emp-1', numero: 'CT-001', clienteId: 'cli-1',
          cliente: { id: 'cli-1', nome: 'Cliente A' },
          dataInicio: new Date(), dataFim: new Date(), valor: 5000,
          status: 'ATIVO',
        },
      ]);
      (mockPrisma.contrato.count as any).mockResolvedValue(1);

      const app = criarApp((a) => a.use('/contratos', contratosRoutes));
      const res = await request(app).get('/contratos').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });

    it('deve retornar 401 sem token', async () => {
      const app = criarApp((a) => a.use('/contratos', contratosRoutes));
      const res = await request(app).get('/contratos');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /contratos', () => {
    it('deve criar contrato com dados válidos', async () => {
      (mockPrisma.contrato.findUnique as any).mockResolvedValue(null);
      (mockPrisma.contrato.create as any).mockResolvedValue({
        id: 'ct-1', empresaId: 'emp-1', numero: 'CT-001', status: 'RASCUNHO',
        clienteId: 'cli-1', valor: 10000,
        dataInicio: new Date(), descricao: 'Contrato de serviço',
      });

      const app = criarApp((a) => a.use('/contratos', contratosRoutes));
      const res = await request(app)
        .post('/contratos')
        .set(gerarHeaders())
        .send({
          numero: 'CT-001', clienteId: 'cli-1', descricao: 'Contrato de serviço',
          dataInicio: '2026-01-01', dataFim: '2026-12-31', valor: 10000,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.numero).toBe('CT-001');
    });

    it('deve rejeitar contrato duplicado', async () => {
      (mockPrisma.contrato.findUnique as any).mockResolvedValue({ id: 'ct-existente' });

      const app = criarApp((a) => a.use('/contratos', contratosRoutes));
      const res = await request(app)
        .post('/contratos')
        .set(gerarHeaders())
        .send({
          numero: 'CT-001', clienteId: 'cli-1', dataInicio: '2026-01-01',
          dataFim: '2026-12-31', valor: 10000,
        });

      expect(res.status).toBe(400);
    });

    it('deve rejeitar criação sem campos obrigatórios', async () => {
      const app = criarApp((a) => a.use('/contratos', contratosRoutes));
      const res = await request(app)
        .post('/contratos')
        .set(gerarHeaders())
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe('GET /contratos/:id', () => {
    it('deve buscar contrato por ID', async () => {
      (mockPrisma.contrato.findFirst as any).mockResolvedValue({
        id: 'ct-1', empresaId: 'emp-1', numero: 'CT-001',
        cliente: { id: 'cli-1', nome: 'Cliente A' },
      });

      const app = criarApp((a) => a.use('/contratos', contratosRoutes));
      const res = await request(app).get('/contratos/ct-1').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('ct-1');
    });

    it('deve retornar erro para contrato inexistente', async () => {
      (mockPrisma.contrato.findFirst as any).mockResolvedValue(null);

      const app = criarApp((a) => a.use('/contratos', contratosRoutes));
      const res = await request(app).get('/contratos/ct-x').set(gerarHeaders());

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /contratos/:id', () => {
    it('deve atualizar contrato', async () => {
      (mockPrisma.contrato.findFirst as any).mockResolvedValue({ id: 'ct-1', empresaId: 'emp-1', status: 'RASCUNHO' });
      (mockPrisma.contrato.update as any).mockResolvedValue({ id: 'ct-1', valor: 15000 });

      const app = criarApp((a) => a.use('/contratos', contratosRoutes));
      const res = await request(app)
        .put('/contratos/ct-1')
        .set(gerarHeaders())
        .send({ valor: 15000 });

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /contratos/:id', () => {
    it('deve excluir contrato em rascunho', async () => {
      (mockPrisma.contrato.findFirst as any).mockResolvedValue({ id: 'ct-1', empresaId: 'emp-1', status: 'RASCUNHO' });
      (mockPrisma.contratoMedicao.deleteMany as any).mockResolvedValue({ count: 0 });
      (mockPrisma.contrato.delete as any).mockResolvedValue({ id: 'ct-1' });

      const app = criarApp((a) => a.use('/contratos', contratosRoutes));
      const res = await request(app).delete('/contratos/ct-1').set(gerarHeaders());

      expect(res.status).toBe(200);
    });

    it('deve rejeitar exclusão de contrato ativo', async () => {
      (mockPrisma.contrato.findFirst as any).mockResolvedValue({ id: 'ct-1', empresaId: 'emp-1', status: 'ATIVO' });

      const app = criarApp((a) => a.use('/contratos', contratosRoutes));
      const res = await request(app).delete('/contratos/ct-1').set(gerarHeaders());

      expect(res.status).toBe(400);
    });
  });

  describe('Ciclo de vida', () => {
    it('deve ativar contrato em rascunho', async () => {
      (mockPrisma.contrato.findFirst as any).mockResolvedValue({ id: 'ct-1', empresaId: 'emp-1', status: 'RASCUNHO' });
      (mockPrisma.contrato.update as any).mockResolvedValue({ id: 'ct-1', status: 'ATIVO' });

      const app = criarApp((a) => a.use('/contratos', contratosRoutes));
      const res = await request(app).post('/contratos/ct-1/ativar').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('deve rejeitar ativação de contrato já ativo', async () => {
      (mockPrisma.contrato.findFirst as any).mockResolvedValue({ id: 'ct-1', empresaId: 'emp-1', status: 'ATIVO' });

      const app = criarApp((a) => a.use('/contratos', contratosRoutes));
      const res = await request(app).post('/contratos/ct-1/ativar').set(gerarHeaders());

      expect(res.status).toBe(400);
    });

    it('deve suspender contrato ativo', async () => {
      (mockPrisma.contrato.findFirst as any).mockResolvedValue({ id: 'ct-1', empresaId: 'emp-1', status: 'ATIVO' });
      (mockPrisma.contrato.update as any).mockResolvedValue({ id: 'ct-1', status: 'SUSPENSO' });

      const app = criarApp((a) => a.use('/contratos', contratosRoutes));
      const res = await request(app).post('/contratos/ct-1/suspender').set(gerarHeaders());

      expect(res.status).toBe(200);
    });

    it('deve encerrar contrato ativo', async () => {
      (mockPrisma.contrato.findFirst as any).mockResolvedValue({ id: 'ct-1', empresaId: 'emp-1', status: 'ATIVO' });
      (mockPrisma.contrato.update as any).mockResolvedValue({ id: 'ct-1', status: 'ENCERRADO' });

      const app = criarApp((a) => a.use('/contratos', contratosRoutes));
      const res = await request(app).post('/contratos/ct-1/encerrar').set(gerarHeaders());

      expect(res.status).toBe(200);
    });
  });

  describe('Medições', () => {
    it('deve listar medições de um contrato', async () => {
      (mockPrisma.contrato.findFirst as any).mockResolvedValue({ id: 'ct-1', empresaId: 'emp-1' });
      (mockPrisma.contratoMedicao.findMany as any).mockResolvedValue([
        { id: 'm-1', contratoId: 'ct-1', periodo: '2026-07', valor: 5000, status: 'PENDENTE' },
      ]);

      const app = criarApp((a) => a.use('/contratos', contratosRoutes));
      const res = await request(app).get('/contratos/ct-1/medicoes').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });

    it('deve criar medição', async () => {
      (mockPrisma.contrato.findFirst as any).mockResolvedValue({ id: 'ct-1', empresaId: 'emp-1', status: 'ATIVO' });
      (mockPrisma.contratoMedicao.findFirst as any).mockResolvedValue(null);
      (mockPrisma.contratoMedicao.create as any).mockResolvedValue({
        id: 'm-1', contratoId: 'ct-1', periodo: '2026-07', valor: 5000, status: 'PENDENTE',
      });

      const app = criarApp((a) => a.use('/contratos', contratosRoutes));
      const res = await request(app)
        .post('/contratos/ct-1/medicoes')
        .set(gerarHeaders())
        .send({ periodo: '2026-07', valor: 5000, dataVencimento: '2026-08-15' });

      expect(res.status).toBe(201);
    });

    it('deve rejeitar medição duplicada no mesmo período', async () => {
      (mockPrisma.contrato.findFirst as any).mockResolvedValue({ id: 'ct-1', empresaId: 'emp-1', status: 'ATIVO' });
      (mockPrisma.contratoMedicao.findFirst as any).mockResolvedValue({ id: 'm-existente' });

      const app = criarApp((a) => a.use('/contratos', contratosRoutes));
      const res = await request(app)
        .post('/contratos/ct-1/medicoes')
        .set(gerarHeaders())
        .send({ periodo: '2026-07', valor: 5000, dataVencimento: '2026-08-15' });

      expect(res.status).toBe(400);
    });

    it('deve faturar medição', async () => {
      (mockPrisma.contrato.findFirst as any).mockResolvedValue({ id: 'ct-1', empresaId: 'emp-1' });
      (mockPrisma.contratoMedicao.findFirst as any).mockResolvedValue({ id: 'm-1', status: 'PENDENTE' });
      (mockPrisma.contratoMedicao.update as any).mockResolvedValue({ id: 'm-1', status: 'FATURADO' });

      const app = criarApp((a) => a.use('/contratos', contratosRoutes));
      const res = await request(app).post('/contratos/ct-1/medicoes/m-1/faturar').set(gerarHeaders());

      expect(res.status).toBe(200);
    });
  });
});
