import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import devolucoesRoutes from '@/modules/devolucoes/devolucoes.routes';
import { criarApp, limparMocks, mockLicencaAtiva } from './helpers';
import { mockPrisma, gerarHeaders } from './setup';

describe('Devoluções', () => {
  beforeEach(() => {
    limparMocks();
    mockLicencaAtiva();
  });

  describe('GET /devolucoes', () => {
    it('deve listar devoluções', async () => {
      (mockPrisma.devolucao.findMany as any).mockResolvedValue([
        {
          id: 'd-1', empresaId: 'emp-1', numero: 'DEV-001', status: 'SOLICITACAO',
          cliente: { id: 'cli-1', nome: 'Cliente A' },
          itens: [{ id: 'i-1', produto: { nome: 'Produto X' } }],
        },
      ]);
      (mockPrisma.devolucao.count as any).mockResolvedValue(1);

      const app = criarApp((a) => a.use('/devolucoes', devolucoesRoutes));
      const res = await request(app).get('/devolucoes').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /devolucoes', () => {
    it('deve criar devolução com itens', async () => {
      (mockPrisma.devolucao.findUnique as any).mockResolvedValue(null);
      (mockPrisma.devolucao.create as any).mockResolvedValue({
        id: 'd-1', empresaId: 'emp-1', numero: 'DEV-001', status: 'SOLICITACAO',
        cliente: { id: 'cli-1', nome: 'Cliente A' },
        itens: [{ id: 'i-1', produtoId: 'prod-1', quantidade: 2, valor: 100 }],
      });

      const app = criarApp((a) => a.use('/devolucoes', devolucoesRoutes));
      const res = await request(app)
        .post('/devolucoes')
        .set(gerarHeaders())
        .send({
          numero: 'DEV-001', clienteId: 'cli-1', pedidoVendaId: 'v-1',
          motivo: 'DEFEITO',
          itens: [{ produtoId: 'prod-1', quantidade: 2, valor: 100, condicao: 'DEFEITO' }],
        });

      expect(res.status).toBe(201);
    });

    it('deve rejeitar devolução sem itens', async () => {
      const app = criarApp((a) => a.use('/devolucoes', devolucoesRoutes));
      const res = await request(app)
        .post('/devolucoes')
        .set(gerarHeaders())
        .send({ numero: 'DEV-001', clienteId: 'cli-1', motivo: 'DEFEITO', itens: [] });

      expect(res.status).toBe(400);
    });

    it('deve rejeitar número duplicado', async () => {
      (mockPrisma.devolucao.findUnique as any).mockResolvedValue({ id: 'd-existente' });

      const app = criarApp((a) => a.use('/devolucoes', devolucoesRoutes));
      const res = await request(app)
        .post('/devolucoes')
        .set(gerarHeaders())
        .send({
          numero: 'DEV-001', clienteId: 'cli-1', motivo: 'DEFEITO',
          itens: [{ produtoId: 'prod-1', quantidade: 1, valor: 50, condicao: 'DEFEITO' }],
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /devolucoes/:id', () => {
    it('deve buscar devolução por ID', async () => {
      (mockPrisma.devolucao.findFirst as any).mockResolvedValue({
        id: 'd-1', empresaId: 'emp-1', numero: 'DEV-001',
        cliente: { id: 'cli-1', nome: 'Cliente A' },
        itens: [{ id: 'i-1', produto: { nome: 'Produto X' } }],
      });

      const app = criarApp((a) => a.use('/devolucoes', devolucoesRoutes));
      const res = await request(app).get('/devolucoes/d-1').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('d-1');
    });
  });

  describe('PUT /devolucoes/:id', () => {
    it('deve atualizar devolução em solicitação', async () => {
      (mockPrisma.devolucao.findFirst as any).mockResolvedValue({ id: 'd-1', empresaId: 'emp-1', status: 'SOLICITACAO' });
      (mockPrisma.devolucao.update as any).mockResolvedValue({ id: 'd-1', observacoes: 'Atualizado' });

      const app = criarApp((a) => a.use('/devolucoes', devolucoesRoutes));
      const res = await request(app)
        .put('/devolucoes/d-1')
        .set(gerarHeaders())
        .send({ observacoes: 'Atualizado' });

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /devolucoes/:id', () => {
    it('deve rejeitar exclusão de devolução que não existe', async () => {
      (mockPrisma.devolucao.findFirst as any).mockResolvedValue(null);

      const app = criarApp((a) => a.use('/devolucoes', devolucoesRoutes));
      const res = await request(app).delete('/devolucoes/d-x').set(gerarHeaders());

      expect(res.status).toBe(400);
    });
  });

  describe('Fluxo de aprovação', () => {
    it('deve aprovar inspeção de devolução', async () => {
      (mockPrisma.devolucao.findFirst as any).mockResolvedValue({ id: 'd-1', empresaId: 'emp-1', status: 'INSPECAO' });
      (mockPrisma.devolucao.update as any).mockResolvedValue({ id: 'd-1', status: 'APROVADO' });

      const app = criarApp((a) => a.use('/devolucoes', devolucoesRoutes));
      const res = await request(app).post('/devolucoes/d-1/aprovar').set(gerarHeaders());

      expect(res.status).toBe(200);
    });

    it('deve rejeitar aprovação de devolução não inspecionada', async () => {
      (mockPrisma.devolucao.findFirst as any).mockResolvedValue({ id: 'd-1', empresaId: 'emp-1', status: 'SOLICITACAO' });

      const app = criarApp((a) => a.use('/devolucoes', devolucoesRoutes));
      const res = await request(app).post('/devolucoes/d-1/aprovar').set(gerarHeaders());

      expect(res.status).toBe(400);
    });
  });

  describe('Rejeição', () => {
    it('deve rejeitar devolução inspecionada', async () => {
      (mockPrisma.devolucao.findFirst as any).mockResolvedValue({ id: 'd-1', empresaId: 'emp-1', status: 'INSPECAO' });
      (mockPrisma.devolucao.update as any).mockResolvedValue({ id: 'd-1', status: 'REJEITADO' });

      const app = criarApp((a) => a.use('/devolucoes', devolucoesRoutes));
      const res = await request(app).post('/devolucoes/d-1/rejeitar').set(gerarHeaders());

      expect(res.status).toBe(200);
    });
  });

  describe('Destinação', () => {
    it('deve definir destinação para devolução aprovada', async () => {
      (mockPrisma.devolucao.findFirst as any).mockResolvedValue({ id: 'd-1', empresaId: 'emp-1', status: 'APROVADO' });
      (mockPrisma.devolucao.update as any).mockResolvedValue({ id: 'd-1', status: 'DESTINADO', destino: 'SUBSTITUICAO' });

      const app = criarApp((a) => a.use('/devolucoes', devolucoesRoutes));
      const res = await request(app)
        .post('/devolucoes/d-1/destinar')
        .set(gerarHeaders())
        .send({ destino: 'SUBSTITUICAO' });

      expect(res.status).toBe(200);
    });

    it('deve rejeitar destinação sem campo obrigatório', async () => {
      (mockPrisma.devolucao.findFirst as any).mockResolvedValue({ id: 'd-1', empresaId: 'emp-1', status: 'APROVADO' });

      const app = criarApp((a) => a.use('/devolucoes', devolucoesRoutes));
      const res = await request(app).post('/devolucoes/d-1/destinar').set(gerarHeaders()).send({});

      expect(res.status).toBe(400);
    });
  });
});
