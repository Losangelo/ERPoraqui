import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { pdvRoutes } from '@/modules/pdv/pdv.routes';
import { criarApp, limparMocks, mockLicencaAtiva } from './helpers';
import { mockPrisma, gerarHeaders } from './setup';

describe('PDV', () => {
  beforeEach(() => {
    limparMocks();
    mockLicencaAtiva();
  });

  describe('POST /pdv/caixa/abrir', () => {
    it('deve abrir caixa com dados válidos', async () => {
      (mockPrisma.operadorPDV.findFirst as any).mockResolvedValue({
        id: 'oper-1',
        empresaId: 'emp-1',
        nome: 'Operador Teste',
        ativo: true,
      });

      (mockPrisma.filial.findFirst as any).mockResolvedValue({
        id: 'fil-1',
        empresaId: 'emp-1',
        razaoSocial: 'Filial Teste',
        ativo: true,
      });

      (mockPrisma.caixa.findFirst as any).mockResolvedValue(null);

      (mockPrisma.caixa.create as any).mockResolvedValue({
        id: 'cx-1',
        empresaId: 'emp-1',
        filialId: 'fil-1',
        operadorId: 'oper-1',
        saldoInicial: 100,
        situacao: 'ABERTO',
        dataAbertura: new Date().toISOString(),
      });

      const app = criarApp((app) => {
        app.use('/pdv', pdvRoutes);
      });

      const response = await request(app)
        .post('/pdv/caixa/abrir')
        .set(gerarHeaders())
        .send({
          filialId: 'fil-1',
          operadorId: 'oper-1',
          saldoInicial: 100,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.situacao).toBe('ABERTO');
    });

    it('deve rejeitar abertura sem filial', async () => {
      const app = criarApp((app) => {
        app.use('/pdv', pdvRoutes);
      });

      const response = await request(app)
        .post('/pdv/caixa/abrir')
        .set(gerarHeaders())
        .send({
          operadorId: 'oper-1',
          saldoInicial: 100,
        });

      expect(response.status).toBe(400);
    });

    it('deve rejeitar abertura com caixa já aberto', async () => {
      (mockPrisma.caixa.findFirst as any).mockResolvedValue({
        id: 'cx-existente',
        empresaId: 'emp-1',
        filialId: 'fil-1',
        situacao: 'ABERTO',
      });

      const app = criarApp((app) => {
        app.use('/pdv', pdvRoutes);
      });

      const response = await request(app)
        .post('/pdv/caixa/abrir')
        .set(gerarHeaders())
        .send({
          filialId: 'fil-1',
          operadorId: 'oper-1',
          saldoInicial: 100,
        });

      expect(response.status).toBe(400);
    });

    it('deve retornar 401 sem token', async () => {
      const app = criarApp((app) => {
        app.use('/pdv', pdvRoutes);
      });

      const response = await request(app)
        .post('/pdv/caixa/abrir')
        .send({
          filialId: 'fil-1',
          operadorId: 'oper-1',
          saldoInicial: 100,
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /pdv/caixa/aberto', () => {
    it('deve retornar caixa aberto quando existe', async () => {
      const caixaAberto = {
        id: 'cx-1',
        empresaId: 'emp-1',
        filialId: 'fil-1',
        operadorId: 'oper-1',
        saldoInicial: 100,
        situacao: 'ABERTO',
        dataAbertura: new Date().toISOString(),
      };

      (mockPrisma.caixa.findFirst as any).mockResolvedValue(caixaAberto);

      const app = criarApp((app) => {
        app.use('/pdv', pdvRoutes);
      });

      const response = await request(app)
        .get('/pdv/caixa/aberto')
        .query({ filialId: 'fil-1' })
        .set(gerarHeaders());

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.situacao).toBe('ABERTO');
    });

    it('deve retornar null quando não há caixa aberto', async () => {
      (mockPrisma.caixa.findFirst as any).mockResolvedValue(null);

      const app = criarApp((app) => {
        app.use('/pdv', pdvRoutes);
      });

      const response = await request(app)
        .get('/pdv/caixa/aberto')
        .query({ filialId: 'fil-1' })
        .set(gerarHeaders());

      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
    });
  });
});
