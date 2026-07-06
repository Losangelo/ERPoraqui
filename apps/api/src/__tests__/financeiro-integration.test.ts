import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import financeiroRoutes from '@/modules/financeiro/financeiro.routes';
import { criarApp, limparMocks, mockLicencaAtiva } from './helpers';
import { mockPrisma, gerarHeaders } from './setup';

describe('Financeiro - Integração com FluxoCaixa', () => {
  beforeEach(() => {
    limparMocks();
    mockLicencaAtiva();
  });

  describe('receberConta → fluxoCaixa', () => {
    it('deve criar fluxoCaixa ENTRADA ao receber uma conta', async () => {
      (mockPrisma.contaReceber.findFirst as any).mockResolvedValue({
        id: 'cr-1',
        empresaId: 'emp-1',
        clienteId: 'cli-1',
        numeroDocumento: 'NF-001',
        valorOriginal: 1000,
        situacao: 'ABERTA',
      });

      (mockPrisma.contaReceber.update as any).mockResolvedValue({
        id: 'cr-1',
        situacao: 'PAGO',
        valorRecebido: 1000,
      });

      (mockPrisma.fluxoCaixa.create as any).mockResolvedValue({
        id: 'fc-1',
        empresaId: 'emp-1',
        tipo: 'ENTRADA',
        valor: 1000,
      });

      const app = criarApp((app) => {
        app.use('/financeiro', financeiroRoutes);
      });

      const response = await request(app)
        .post('/financeiro/contas-receber/cr-1/receber')
        .set(gerarHeaders())
        .send({
          formaPagamento: 'PIX',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockPrisma.fluxoCaixa.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            empresaId: 'emp-1',
            tipo: 'ENTRADA',
            categoria: 'RECEBIMENTO_CONTA',
            valor: 1000,
            formaPagamento: 'PIX',
            referenciaTipo: 'CONTA_RECEBER',
          }),
        }),
      );
    });

    it('deve criar fluxoCaixa com valor total incluindo juros e multa', async () => {
      (mockPrisma.contaReceber.findFirst as any).mockResolvedValue({
        id: 'cr-2',
        empresaId: 'emp-1',
        clienteId: 'cli-1',
        numeroDocumento: 'NF-002',
        valorOriginal: 1000,
        situacao: 'ABERTA',
      });

      (mockPrisma.contaReceber.update as any).mockResolvedValue({
        id: 'cr-2',
        situacao: 'PAGO',
        valorRecebido: 1100,
      });

      (mockPrisma.fluxoCaixa.create as any).mockResolvedValue({ id: 'fc-2' });

      const app = criarApp((app) => {
        app.use('/financeiro', financeiroRoutes);
      });

      const response = await request(app)
        .post('/financeiro/contas-receber/cr-2/receber')
        .set(gerarHeaders())
        .send({
          formaPagamento: 'PIX',
          valorRecebido: 1000,
          valorJuros: 50,
          valorMulta: 50,
        });

      expect(response.status).toBe(200);
      expect(mockPrisma.fluxoCaixa.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            valor: 1100,
          }),
        }),
      );
    });

    it('deve gerar erro ao receber conta já paga e não criar fluxoCaixa', async () => {
      (mockPrisma.contaReceber.findFirst as any).mockResolvedValue({
        id: 'cr-3',
        empresaId: 'emp-1',
        clienteId: 'cli-1',
        numeroDocumento: 'NF-003',
        valorOriginal: 500,
        situacao: 'PAGO',
      });

      const app = criarApp((app) => {
        app.use('/financeiro', financeiroRoutes);
      });

      const response = await request(app)
        .post('/financeiro/contas-receber/cr-3/receber')
        .set(gerarHeaders())
        .send({ formaPagamento: 'DINHEIRO' });

      expect(response.status).toBe(400);
      expect(mockPrisma.fluxoCaixa.create).not.toHaveBeenCalled();
    });
  });

  describe('pagarConta → fluxoCaixa', () => {
    it('deve criar fluxoCaixa SAIDA ao pagar uma conta', async () => {
      (mockPrisma.contaPagar.findFirst as any).mockResolvedValue({
        id: 'cp-1',
        empresaId: 'emp-1',
        fornecedorId: 'for-1',
        numeroDocumento: 'NF-COMPRA-001',
        valorOriginal: 2000,
        situacao: 'ABERTA',
      });

      (mockPrisma.contaPagar.update as any).mockResolvedValue({
        id: 'cp-1',
        situacao: 'PAGO',
        valorPago: 2000,
      });

      (mockPrisma.fluxoCaixa.create as any).mockResolvedValue({
        id: 'fc-3',
        tipo: 'SAIDA',
        valor: 2000,
      });

      const app = criarApp((app) => {
        app.use('/financeiro', financeiroRoutes);
      });

      const response = await request(app)
        .post('/financeiro/contas-pagar/cp-1/pagar')
        .set(gerarHeaders())
        .send({ formaPagamento: 'BOLETO' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockPrisma.fluxoCaixa.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            empresaId: 'emp-1',
            tipo: 'SAIDA',
            categoria: 'PAGAMENTO_CONTA',
            valor: 2000,
            referenciaTipo: 'CONTA_PAGAR',
          }),
        }),
      );
    });

    it('deve criar fluxoCaixa SAIDA com valor descontado', async () => {
      (mockPrisma.contaPagar.findFirst as any).mockResolvedValue({
        id: 'cp-2',
        empresaId: 'emp-1',
        fornecedorId: 'for-1',
        numeroDocumento: 'NF-COMPRA-002',
        valorOriginal: 2000,
        situacao: 'ABERTA',
      });

      (mockPrisma.contaPagar.update as any).mockResolvedValue({
        id: 'cp-2',
        situacao: 'PAGO',
        valorPago: 1900,
      });

      (mockPrisma.fluxoCaixa.create as any).mockResolvedValue({ id: 'fc-4' });

      const app = criarApp((app) => {
        app.use('/financeiro', financeiroRoutes);
      });

      const response = await request(app)
        .post('/financeiro/contas-pagar/cp-2/pagar')
        .set(gerarHeaders())
        .send({
          formaPagamento: 'TRANSFERENCIA',
          valorPago: 2000,
          valorDesconto: 100,
        });

      expect(response.status).toBe(200);
      expect(mockPrisma.fluxoCaixa.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            valor: 1900,
          }),
        }),
      );
    });

    it('deve bloquear pagamento de conta já paga', async () => {
      (mockPrisma.contaPagar.findFirst as any).mockResolvedValue({
        id: 'cp-3',
        empresaId: 'emp-1',
        fornecedorId: 'for-1',
        numeroDocumento: 'NF-COMPRA-003',
        valorOriginal: 1000,
        situacao: 'PAGO',
      });

      const app = criarApp((app) => {
        app.use('/financeiro', financeiroRoutes);
      });

      const response = await request(app)
        .post('/financeiro/contas-pagar/cp-3/pagar')
        .set(gerarHeaders())
        .send({ formaPagamento: 'DINHEIRO' });

      expect(response.status).toBe(400);
      expect(mockPrisma.fluxoCaixa.create).not.toHaveBeenCalled();
    });
  });
});
