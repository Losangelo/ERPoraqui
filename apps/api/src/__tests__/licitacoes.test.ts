import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import licitacoesRoutes from '@/modules/licitacoes/licitacoes.routes';
import { criarApp, limparMocks, mockLicencaAtiva } from './helpers';
import { mockPrisma, gerarHeaders } from './setup';

describe('Licitações', () => {
  beforeEach(() => {
    limparMocks();
    mockLicencaAtiva();
  });

  describe('GET /', () => {
    it('deve listar licitações', async () => {
      (mockPrisma.licitacao.findMany as any).mockResolvedValue([
        { id: 'lic-1', empresaId: 'emp-1', numero: 'LIC-001', descricao: 'Aquisição de material', situacao: 'EM_ANDAMENTO' },
      ]);
      (mockPrisma.licitacao.count as any).mockResolvedValue(1);

      const app = criarApp((a) => a.use('/', licitacoesRoutes));
      const res = await request(app).get('/').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });

    it('deve retornar 401 sem token', async () => {
      const app = criarApp((a) => a.use('/', licitacoesRoutes));
      const res = await request(app).get('/');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /', () => {
    it('deve criar licitação', async () => {
      (mockPrisma.licitacao.create as any).mockResolvedValue({
        id: 'lic-1', empresaId: 'emp-1', numero: 'LIC-001', descricao: 'Aquisição de material',
        orgao: 'Prefeitura', tipo: 'PREGAO', situacao: 'EM_ANDAMENTO',
      });

      const app = criarApp((a) => a.use('/', licitacoesRoutes));
      const res = await request(app)
        .post('/')
        .set(gerarHeaders())
        .send({
          numero: 'LIC-001',
          orgao: 'Prefeitura Municipal',
          descricao: 'Aquisição de material',
          tipo: 'PREGAO',
          dataAbertura: '2026-07-01',
          valorEstimado: 50000,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('deve rejeitar licitação sem número', async () => {
      const app = criarApp((a) => a.use('/', licitacoesRoutes));
      const res = await request(app)
        .post('/')
        .set(gerarHeaders())
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe('GET /:id', () => {
    it('deve buscar licitação por ID', async () => {
      (mockPrisma.licitacao.findFirst as any).mockResolvedValue({
        id: 'lic-1', empresaId: 'emp-1', numero: 'LIC-001',
      });

      const app = criarApp((a) => a.use('/', licitacoesRoutes));
      const res = await request(app).get('/lic-1').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('lic-1');
    });
  });

  describe('PUT /:id', () => {
    it('deve atualizar licitação', async () => {
      (mockPrisma.licitacao.findFirst as any).mockResolvedValue({ id: 'lic-1', empresaId: 'emp-1' });
      (mockPrisma.licitacao.update as any).mockResolvedValue({ id: 'lic-1' });

      const app = criarApp((a) => a.use('/', licitacoesRoutes));
      const res = await request(app)
        .put('/lic-1')
        .set(gerarHeaders())
        .send({ descricao: 'Atualizado' });

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /:id', () => {
    it('deve excluir licitação', async () => {
      (mockPrisma.licitacao.findFirst as any).mockResolvedValue({ id: 'lic-1', empresaId: 'emp-1' });
      (mockPrisma.licitacaoItem.deleteMany as any).mockResolvedValue({ count: 0 });
      (mockPrisma.licitacao.delete as any).mockResolvedValue({ id: 'lic-1' });

      const app = criarApp((a) => a.use('/', licitacoesRoutes));
      const res = await request(app).delete('/lic-1').set(gerarHeaders());

      expect(res.status).toBe(200);
    });
  });

  describe('POST /:id/itens', () => {
    it('deve adicionar item à licitação', async () => {
      (mockPrisma.licitacao.findFirst as any).mockResolvedValue({ id: 'lic-1', empresaId: 'emp-1' });
      (mockPrisma.licitacaoItem.create as any).mockResolvedValue({
        id: 'item-1', licitacaoId: 'lic-1', produtoId: 'prod-1', quantidade: 10, valorUnitario: 50,
      });

      const app = criarApp((a) => a.use('/', licitacoesRoutes));
      const res = await request(app)
        .post('/lic-1/itens')
        .set(gerarHeaders())
        .send({ produtoId: 'prod-1', quantidade: 10, valorUnitario: 50 });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe('DELETE /:id/itens/:itemId', () => {
    it('deve remover item da licitação', async () => {
      (mockPrisma.licitacao.findFirst as any).mockResolvedValue({ id: 'lic-1', empresaId: 'emp-1' });
      (mockPrisma.licitacaoItem.delete as any).mockResolvedValue({ id: 'item-1' });

      const app = criarApp((a) => a.use('/', licitacoesRoutes));
      const res = await request(app).delete('/lic-1/itens/item-1').set(gerarHeaders());

      expect(res.status).toBe(200);
    });
  });
});
