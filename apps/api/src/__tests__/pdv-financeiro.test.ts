import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { pdvRoutes } from '@/modules/pdv/pdv.routes';
import { criarApp, limparMocks, mockLicencaAtiva } from './helpers';
import { mockPrisma, gerarHeaders } from './setup';

describe('PDV - Integração Financeira', () => {
  beforeEach(() => {
    limparMocks();
    mockLicencaAtiva();
  });

  describe('finalizarVenda → fluxoCaixa (à vista)', () => {
    it('deve criar fluxoCaixa ENTRADA ao finalizar venda com DINHEIRO', async () => {
      const app = criarApp((app) => {
        app.use('/pdv', pdvRoutes);
      });

      // Adicionar item ao carrinho
      (mockPrisma.vendaPDV.findFirst as any).mockResolvedValueOnce({
        id: 'venda-1', empresaId: 'emp-1', situacao: 'ABERTA',
      });
      (mockPrisma.produto.findFirst as any).mockResolvedValueOnce({
        id: 'prod-1', empresaId: 'emp-1', ativo: true,
        nome: 'Teste', quantidadeEstoque: 10, precoVenda: 100,
      });
      (mockPrisma.vendaPDV.update as any).mockResolvedValueOnce({
        id: 'venda-1', subtotal: 100, valorDesconto: 0, valorTotal: 100,
      });

      await request(app)
        .post('/pdv/venda/venda-1/itens')
        .set(gerarHeaders())
        .send({ produtoId: 'prod-1', quantidade: 1, valorUnitario: 100 });

      // Finalizar venda
      (mockPrisma.vendaPDV.findFirst as any).mockResolvedValueOnce({
        id: 'venda-1', empresaId: 'emp-1', situacao: 'ABERTA',
        subtotal: 100, valorDesconto: 0, valorTotal: 100, numeroCupom: '000001',
      });
      (mockPrisma.vendaPDV.update as any).mockResolvedValueOnce({
        id: 'venda-1', empresaId: 'emp-1', situacao: 'FINALIZADA',
        numeroCupom: '000001', valorTotal: 100, clienteId: null,
      });
      (mockPrisma.produto.update as any).mockResolvedValueOnce({ id: 'prod-1' });
      (mockPrisma.fluxoCaixa.create as any).mockResolvedValueOnce({
        id: 'fc-1', empresaId: 'emp-1', tipo: 'ENTRADA', valor: 100,
      });

      const response = await request(app)
        .post('/pdv/venda/venda-1/finalizar')
        .set(gerarHeaders())
        .send({ formaPagamento: 'DINHEIRO', valorPago: 100 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockPrisma.fluxoCaixa.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            empresaId: 'emp-1',
            tipo: 'ENTRADA',
            categoria: 'VENDAS_PDV',
            valor: 100,
            referenciaTipo: 'VENDA_PDV',
          }),
        }),
      );
    });

    it('deve criar fluxoCaixa ENTRADA ao finalizar venda com PIX', async () => {
      const app = criarApp((app) => {
        app.use('/pdv', pdvRoutes);
      });

      (mockPrisma.vendaPDV.findFirst as any).mockResolvedValueOnce({
        id: 'venda-2', empresaId: 'emp-1', situacao: 'ABERTA',
      });
      (mockPrisma.produto.findFirst as any).mockResolvedValueOnce({
        id: 'prod-1', empresaId: 'emp-1', ativo: true,
        nome: 'Teste', quantidadeEstoque: 10, precoVenda: 250,
      });
      (mockPrisma.vendaPDV.update as any).mockResolvedValueOnce({
        id: 'venda-2', subtotal: 250, valorDesconto: 0, valorTotal: 250,
      });

      await request(app)
        .post('/pdv/venda/venda-2/itens')
        .set(gerarHeaders())
        .send({ produtoId: 'prod-1', quantidade: 1, valorUnitario: 250 });

      (mockPrisma.vendaPDV.findFirst as any).mockResolvedValueOnce({
        id: 'venda-2', empresaId: 'emp-1', situacao: 'ABERTA',
        subtotal: 250, valorDesconto: 0, valorTotal: 250, numeroCupom: '000002',
      });
      (mockPrisma.vendaPDV.update as any).mockResolvedValueOnce({
        id: 'venda-2', empresaId: 'emp-1', situacao: 'FINALIZADA',
        numeroCupom: '000002', valorTotal: 250, clienteId: null,
      });
      (mockPrisma.produto.update as any).mockResolvedValueOnce({ id: 'prod-1' });
      (mockPrisma.fluxoCaixa.create as any).mockResolvedValueOnce({
        id: 'fc-2', tipo: 'ENTRADA',
      });

      const response = await request(app)
        .post('/pdv/venda/venda-2/finalizar')
        .set(gerarHeaders())
        .send({ formaPagamento: 'PIX', valorPago: 250 });

      expect(response.status).toBe(200);
      expect(mockPrisma.fluxoCaixa.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ tipo: 'ENTRADA', formaPagamento: 'PIX' }),
        }),
      );
    });

    it('deve criar fluxoCaixa ENTRADA ao finalizar venda com CARTAO_DEBITO', async () => {
      const app = criarApp((app) => {
        app.use('/pdv', pdvRoutes);
      });

      (mockPrisma.vendaPDV.findFirst as any).mockResolvedValueOnce({
        id: 'venda-3', empresaId: 'emp-1', situacao: 'ABERTA',
      });
      (mockPrisma.produto.findFirst as any).mockResolvedValueOnce({
        id: 'prod-1', empresaId: 'emp-1', ativo: true,
        nome: 'Teste', quantidadeEstoque: 5, precoVenda: 80,
      });
      (mockPrisma.vendaPDV.update as any).mockResolvedValueOnce({
        id: 'venda-3', subtotal: 80, valorDesconto: 0, valorTotal: 80,
      });

      await request(app)
        .post('/pdv/venda/venda-3/itens')
        .set(gerarHeaders())
        .send({ produtoId: 'prod-1', quantidade: 1, valorUnitario: 80 });

      (mockPrisma.vendaPDV.findFirst as any).mockResolvedValueOnce({
        id: 'venda-3', empresaId: 'emp-1', situacao: 'ABERTA',
        subtotal: 80, valorDesconto: 0, valorTotal: 80, numeroCupom: '000003',
      });
      (mockPrisma.vendaPDV.update as any).mockResolvedValueOnce({
        id: 'venda-3', empresaId: 'emp-1', situacao: 'FINALIZADA',
        numeroCupom: '000003', valorTotal: 80, clienteId: null,
      });
      (mockPrisma.produto.update as any).mockResolvedValueOnce({ id: 'prod-1' });
      (mockPrisma.fluxoCaixa.create as any).mockResolvedValueOnce({ id: 'fc-3' });

      const response = await request(app)
        .post('/pdv/venda/venda-3/finalizar')
        .set(gerarHeaders())
        .send({ formaPagamento: 'CARTAO_DEBITO', valorPago: 80 });

      expect(response.status).toBe(200);
      expect(mockPrisma.fluxoCaixa.create).toHaveBeenCalled();
    });
  });

  describe('finalizarVenda → contaReceber (crédito)', () => {
    it('deve criar contaReceber ao finalizar venda com CARTAO_CREDITO', async () => {
      const app = criarApp((app) => {
        app.use('/pdv', pdvRoutes);
      });

      (mockPrisma.vendaPDV.findFirst as any).mockResolvedValueOnce({
        id: 'venda-4', empresaId: 'emp-1', situacao: 'ABERTA',
      });
      (mockPrisma.produto.findFirst as any).mockResolvedValueOnce({
        id: 'prod-1', empresaId: 'emp-1', ativo: true,
        nome: 'Teste', quantidadeEstoque: 10, precoVenda: 500,
      });
      (mockPrisma.vendaPDV.update as any).mockResolvedValueOnce({
        id: 'venda-4', subtotal: 500, valorDesconto: 0, valorTotal: 500,
      });

      await request(app)
        .post('/pdv/venda/venda-4/itens')
        .set(gerarHeaders())
        .send({ produtoId: 'prod-1', quantidade: 1, valorUnitario: 500 });

      (mockPrisma.vendaPDV.findFirst as any).mockResolvedValueOnce({
        id: 'venda-4', empresaId: 'emp-1', situacao: 'ABERTA',
        subtotal: 500, valorDesconto: 0, valorTotal: 500, numeroCupom: '000004',
      });
      (mockPrisma.vendaPDV.update as any).mockResolvedValueOnce({
        id: 'venda-4', empresaId: 'emp-1', situacao: 'FINALIZADA',
        numeroCupom: '000004', valorTotal: 500, clienteId: 'cli-1',
      });
      (mockPrisma.produto.update as any).mockResolvedValueOnce({ id: 'prod-1' });
      (mockPrisma.contaReceber.create as any).mockResolvedValueOnce({
        id: 'cr-1', empresaId: 'emp-1', clienteId: 'cli-1', valorOriginal: 500,
      });

      const response = await request(app)
        .post('/pdv/venda/venda-4/finalizar')
        .set(gerarHeaders())
        .send({ formaPagamento: 'CARTAO_CREDITO', valorPago: 500, clienteId: 'cli-1' });

      expect(response.status).toBe(200);
      expect(mockPrisma.contaReceber.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            empresaId: 'emp-1',
            clienteId: 'cli-1',
            valorOriginal: 500,
          }),
        }),
      );
    });

    it('deve criar contaReceber ao finalizar venda com CARTAO_CREDITO_PARCELADO', async () => {
      const app = criarApp((app) => {
        app.use('/pdv', pdvRoutes);
      });

      (mockPrisma.vendaPDV.findFirst as any).mockResolvedValueOnce({
        id: 'venda-5', empresaId: 'emp-1', situacao: 'ABERTA',
      });
      (mockPrisma.produto.findFirst as any).mockResolvedValueOnce({
        id: 'prod-1', empresaId: 'emp-1', ativo: true,
        nome: 'Teste', quantidadeEstoque: 20, precoVenda: 1200,
      });
      (mockPrisma.vendaPDV.update as any).mockResolvedValueOnce({
        id: 'venda-5', subtotal: 1200, valorDesconto: 0, valorTotal: 1200,
      });

      await request(app)
        .post('/pdv/venda/venda-5/itens')
        .set(gerarHeaders())
        .send({ produtoId: 'prod-1', quantidade: 1, valorUnitario: 1200 });

      (mockPrisma.vendaPDV.findFirst as any).mockResolvedValueOnce({
        id: 'venda-5', empresaId: 'emp-1', situacao: 'ABERTA',
        subtotal: 1200, valorDesconto: 0, valorTotal: 1200, numeroCupom: '000005',
      });
      (mockPrisma.vendaPDV.update as any).mockResolvedValueOnce({
        id: 'venda-5', situacao: 'FINALIZADA', numeroCupom: '000005',
        valorTotal: 1200, clienteId: 'cli-2',
      });
      (mockPrisma.produto.update as any).mockResolvedValueOnce({ id: 'prod-1' });
      (mockPrisma.contaReceber.create as any).mockResolvedValueOnce({ id: 'cr-2' });

      const response = await request(app)
        .post('/pdv/venda/venda-5/finalizar')
        .set(gerarHeaders())
        .send({ formaPagamento: 'CARTAO_CREDITO_PARCELADO', valorPago: 1200, clienteId: 'cli-2' });

      expect(response.status).toBe(200);
      expect(mockPrisma.contaReceber.create).toHaveBeenCalled();
    });

    it('deve criar contaReceber ao finalizar venda com BOLETO', async () => {
      const app = criarApp((app) => {
        app.use('/pdv', pdvRoutes);
      });

      (mockPrisma.vendaPDV.findFirst as any).mockResolvedValueOnce({
        id: 'venda-6', empresaId: 'emp-1', situacao: 'ABERTA',
      });
      (mockPrisma.produto.findFirst as any).mockResolvedValueOnce({
        id: 'prod-1', empresaId: 'emp-1', ativo: true,
        nome: 'Teste', quantidadeEstoque: 15, precoVenda: 300,
      });
      (mockPrisma.vendaPDV.update as any).mockResolvedValueOnce({
        id: 'venda-6', subtotal: 300, valorDesconto: 0, valorTotal: 300,
      });

      await request(app)
        .post('/pdv/venda/venda-6/itens')
        .set(gerarHeaders())
        .send({ produtoId: 'prod-1', quantidade: 1, valorUnitario: 300 });

      (mockPrisma.vendaPDV.findFirst as any).mockResolvedValueOnce({
        id: 'venda-6', empresaId: 'emp-1', situacao: 'ABERTA',
        subtotal: 300, valorDesconto: 0, valorTotal: 300, numeroCupom: '000006',
      });
      (mockPrisma.vendaPDV.update as any).mockResolvedValueOnce({
        id: 'venda-6', situacao: 'FINALIZADA', numeroCupom: '000006',
        valorTotal: 300, clienteId: 'cli-3',
      });
      (mockPrisma.produto.update as any).mockResolvedValueOnce({ id: 'prod-1' });
      (mockPrisma.contaReceber.create as any).mockResolvedValueOnce({ id: 'cr-3' });

      const response = await request(app)
        .post('/pdv/venda/venda-6/finalizar')
        .set(gerarHeaders())
        .send({ formaPagamento: 'BOLETO', valorPago: 300, clienteId: 'cli-3' });

      expect(response.status).toBe(200);
      expect(mockPrisma.contaReceber.create).toHaveBeenCalled();
    });
  });

  describe('fecharCaixa → fluxoCaixa consolidado', () => {
    it('deve criar fluxoCaixa ENTRADA ao fechar caixa com vendas', async () => {
      (mockPrisma.caixa.findFirst as any).mockResolvedValue({
        id: 'cx-1', empresaId: 'emp-1', filialId: 'fil-1',
        situacao: 'ABERTO', saldoInicial: 100,
        operador: { id: 'oper-1', nome: 'Teste' },
        dataAbertura: new Date(Date.now() - 86400000).toISOString(),
      });

      (mockPrisma.vendaPDV.findMany as any).mockResolvedValue([
        { valorTotal: 200 }, { valorTotal: 150 },
      ]);

      (mockPrisma.caixa.update as any).mockResolvedValue({
        id: 'cx-1', situacao: 'FECHADO', saldoFinal: 450, totalEntradas: 350,
      });

      (mockPrisma.fluxoCaixa.create as any).mockResolvedValue({ id: 'fc-cx-1' });

      const app = criarApp((app) => {
        app.use('/pdv', pdvRoutes);
      });

      const response = await request(app)
        .post('/pdv/caixa/cx-1/fechar')
        .set(gerarHeaders())
        .send({ observacoes: 'Fechamento diário' });

      expect(response.status).toBe(200);
      expect(mockPrisma.fluxoCaixa.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            empresaId: 'emp-1', tipo: 'ENTRADA',
            categoria: 'FECHAMENTO_CAIXA', valor: 350,
            referenciaTipo: 'FECHAMENTO_CAIXA',
          }),
        }),
      );
    });

    it('não deve criar fluxoCaixa ao fechar caixa sem vendas', async () => {
      (mockPrisma.caixa.findFirst as any).mockResolvedValue({
        id: 'cx-2', empresaId: 'emp-1', filialId: 'fil-1',
        situacao: 'ABERTO', saldoInicial: 0,
        operador: { id: 'oper-1', nome: 'Teste' },
        dataAbertura: new Date().toISOString(),
      });

      (mockPrisma.vendaPDV.findMany as any).mockResolvedValue([]);

      (mockPrisma.caixa.update as any).mockResolvedValue({
        id: 'cx-2', situacao: 'FECHADO', saldoFinal: 0, totalEntradas: 0,
      });

      const app = criarApp((app) => {
        app.use('/pdv', pdvRoutes);
      });

      const response = await request(app)
        .post('/pdv/caixa/cx-2/fechar')
        .set(gerarHeaders())
        .send({});

      expect(response.status).toBe(200);
      expect(mockPrisma.fluxoCaixa.create).not.toHaveBeenCalled();
    });
  });
});
