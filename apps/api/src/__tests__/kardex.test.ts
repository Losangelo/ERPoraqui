import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { movimentacoesInternasRoutes } from '@/modules/movimentacoes-internas/movimentacao-estoque.routes';
import { criarApp, limparMocks, mockLicencaAtiva } from './helpers';
import { mockPrisma, gerarHeaders } from './setup';

describe('Kardex (Histórico Produto)', () => {
  beforeEach(() => {
    limparMocks();
    mockLicencaAtiva();
  });

  describe('GET /produto/:produtoId/historico', () => {
    it('deve retornar histórico com paginação e saldo acumulado', async () => {
      (mockPrisma.movimentacaoEstoque.findMany as any).mockResolvedValue([
        {
          id: 'mov-1', produtoId: 'prod-1', tipo: 'ENTRADA', quantidade: 10,
          saldoAcumulado: 10, dataHora: new Date(), observacao: 'Compra',
        },
      ]);
      (mockPrisma.movimentacaoEstoque.count as any).mockResolvedValue(1);

      const app = criarApp((a) => a.use('/movimentacoes', movimentacoesInternasRoutes));
      const res = await request(app)
        .get('/movimentacoes/produto/prod-1/historico')
        .set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.meta.total).toBe(1);
    });

    it('deve filtrar por período', async () => {
      (mockPrisma.movimentacaoEstoque.findMany as any).mockResolvedValue([]);
      (mockPrisma.movimentacaoEstoque.count as any).mockResolvedValue(0);

      const app = criarApp((a) => a.use('/movimentacoes', movimentacoesInternasRoutes));
      const res = await request(app)
        .get('/movimentacoes/produto/prod-1/historico')
        .query({ dataInicio: '2026-01-01', dataFim: '2026-12-31' })
        .set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });

    it('deve retornar 401 sem token', async () => {
      const app = criarApp((a) => a.use('/movimentacoes', movimentacoesInternasRoutes));
      const res = await request(app).get('/movimentacoes/produto/prod-1/historico');
      expect(res.status).toBe(401);
    });
  });
});
