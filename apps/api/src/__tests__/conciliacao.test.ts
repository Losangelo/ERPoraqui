import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import financeiroRoutes from '@/modules/financeiro/financeiro.routes';
import { criarApp, limparMocks, mockLicencaAtiva } from './helpers';
import { mockPrisma, gerarHeaders } from './setup';

describe('Conciliação Bancária', () => {
  beforeEach(() => {
    limparMocks();
    mockLicencaAtiva();
  });

  describe('POST /conciliacoes', () => {
    it('deve criar conciliação', async () => {
      (mockPrisma.contaBancaria.findFirst as any).mockResolvedValue({ id: 'cb-1', empresaId: 'emp-1' });
      (mockPrisma.movimentacaoBancaria.findMany as any).mockResolvedValue([]);
      (mockPrisma.conciliacao.create as any).mockResolvedValue({
        id: 'conc-1', contaBancariaId: 'cb-1',
        periodoIni: new Date(), periodoFin: new Date(),
      });

      const app = criarApp((a) => a.use('/financeiro', financeiroRoutes));
      const res = await request(app)
        .post('/financeiro/conciliacoes')
        .set(gerarHeaders())
        .send({
          contaBancariaId: 'cb-1',
          periodoIni: new Date('2026-07-01'),
          periodoFin: new Date('2026-07-31'),
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('conc-1');
    });

    it('deve rejeitar conciliação sem dados obrigatórios', async () => {
      const app = criarApp((a) => a.use('/financeiro', financeiroRoutes));
      const res = await request(app)
        .post('/financeiro/conciliacoes')
        .set(gerarHeaders())
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe('POST /conciliacoes/movimentacoes', () => {
    it('deve conciliar movimentação', async () => {
      (mockPrisma.movimentacaoBancaria.update as any).mockResolvedValue({
        id: 'mov-1', conciliacaoId: 'conc-1',
      });

      const app = criarApp((a) => a.use('/financeiro', financeiroRoutes));
      const res = await request(app)
        .post('/financeiro/conciliacoes/movimentacoes')
        .set(gerarHeaders())
        .send({ movimentacaoId: 'mov-1', conciliacaoId: 'conc-1' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /contas-bancarias/:id/conciliacoes', () => {
    it('deve listar conciliações da conta', async () => {
      (mockPrisma.conciliacao.findMany as any).mockResolvedValue([
        { id: 'conc-1', contaBancariaId: 'cb-1' },
      ]);

      const app = criarApp((a) => a.use('/financeiro', financeiroRoutes));
      const res = await request(app)
        .get('/financeiro/contas-bancarias/cb-1/conciliacoes')
        .set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('GET /contas-bancarias/:id/movimentacoes', () => {
    it('deve listar movimentações bancárias', async () => {
      (mockPrisma.contaBancaria.findFirst as any).mockResolvedValue({ id: 'cb-1', empresaId: 'emp-1' });
      (mockPrisma.movimentacaoBancaria.findMany as any).mockResolvedValue([
        { id: 'mov-1', contaBancariaId: 'cb-1', descricao: 'Depósito', valor: 5000 },
      ]);

      const app = criarApp((a) => a.use('/financeiro', financeiroRoutes));
      const res = await request(app)
        .get('/financeiro/contas-bancarias/cb-1/movimentacoes')
        .set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('PUT /movimentacoes-bancarias/:id/desconciliar', () => {
    it('deve remover conciliação de movimentação', async () => {
      (mockPrisma.movimentacaoBancaria.update as any).mockResolvedValue({
        id: 'mov-1', conciliacaoId: null,
      });

      const app = criarApp((a) => a.use('/financeiro', financeiroRoutes));
      const res = await request(app)
        .put('/financeiro/movimentacoes-bancarias/mov-1/desconciliar')
        .set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Auth', () => {
    it('deve retornar 401 sem token', async () => {
      const app = criarApp((a) => a.use('/financeiro', financeiroRoutes));
      const res = await request(app).get('/financeiro/conciliacoes');
      expect(res.status).toBe(401);
    });
  });
});
