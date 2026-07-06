import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import pedidosVendaRoutes from '@/modules/pedidos-venda/pedidos-venda.routes';
import { criarApp, limparMocks, mockLicencaAtiva } from './helpers';
import { mockPrisma, gerarHeaders } from './setup';

describe('PedidosVenda', () => {
  beforeEach(() => {
    limparMocks();
    mockLicencaAtiva();
  });

  describe('A_VISTA → fluxoCaixa', () => {
    it('deve criar fluxoCaixa ao confirmar pedido A_VISTA', async () => {
      (mockPrisma.pedidoVenda.findFirst as any).mockResolvedValue({
        id: 'ped-av-1',
        empresaId: 'emp-1',
        situacao: 'EM_ABERTO',
        condicaoPagamento: 'A_VISTA',
      });

      (mockPrisma.pedidoVenda.update as any).mockResolvedValue({
        id: 'ped-av-1',
        empresaId: 'emp-1',
        situacao: 'CONFIRMADO',
        numeroPedido: 'PV000010',
        valorTotal: 2500,
        clienteId: 'cli-1',
      });

      (mockPrisma.fluxoCaixa.create as any).mockResolvedValue({
        id: 'fc-av-1',
        tipo: 'ENTRADA',
      });

      const app = criarApp((app) => {
        app.use('/pedidos-venda', pedidosVendaRoutes);
      });

      const response = await request(app)
        .patch('/pedidos-venda/ped-av-1/aprovar')
        .set(gerarHeaders());

      expect(response.status).toBe(200);
      expect(mockPrisma.fluxoCaixa.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tipo: 'ENTRADA',
            categoria: 'VENDAS_PEDIDO',
            referenciaTipo: 'PEDIDO_VENDA',
          }),
        }),
      );
    });

    it('não deve criar fluxoCaixa para pedido A_PRAZO (já gera contasReceber)', async () => {
      (mockPrisma.pedidoVenda.findFirst as any).mockResolvedValue({
        id: 'ped-ap-1',
        empresaId: 'emp-1',
        situacao: 'EM_ABERTO',
        condicaoPagamento: 'A_PRAZO',
      });

      (mockPrisma.pedidoVenda.update as any).mockResolvedValue({
        id: 'ped-ap-1',
        empresaId: 'emp-1',
        situacao: 'CONFIRMADO',
        numeroPedido: 'PV000011',
        valorTotal: 3000,
        clienteId: 'cli-1',
        quantidadeParcelas: 3,
        intervaloParcelas: 30,
      });

      const app = criarApp((app) => {
        app.use('/pedidos-venda', pedidosVendaRoutes);
      });

      const response = await request(app)
        .patch('/pedidos-venda/ped-ap-1/aprovar')
        .set(gerarHeaders());

      expect(response.status).toBe(200);
      expect(mockPrisma.fluxoCaixa.create).not.toHaveBeenCalled();
    });
  });


  describe('PATCH /pedidos-venda/:id/aprovar', () => {
    it('deve aprovar pedido com PATCH', async () => {
      (mockPrisma.pedidoVenda.findFirst as any).mockResolvedValue({
        id: 'ped-1',
        empresaId: 'emp-1',
        situacao: 'EM_ABERTO',
      });

      (mockPrisma.pedidoVenda.update as any).mockResolvedValue({
        id: 'ped-1',
        empresaId: 'emp-1',
        situacao: 'CONFIRMADO',
        numeroPedido: 'PV000001',
      });

      const app = criarApp((app) => {
        app.use('/pedidos-venda', pedidosVendaRoutes);
      });

      const response = await request(app)
        .patch('/pedidos-venda/ped-1/aprovar')
        .set(gerarHeaders());

      expect(response.status).toBe(200);
      expect(response.body.situacao).toBe('CONFIRMADO');
    });

    it('deve retornar 404 ao aprovar pedido inexistente', async () => {
      (mockPrisma.pedidoVenda.findFirst as any).mockResolvedValue(null);

      const app = criarApp((app) => {
        app.use('/pedidos-venda', pedidosVendaRoutes);
      });

      const response = await request(app)
        .patch('/pedidos-venda/ped-inexistente/aprovar')
        .set(gerarHeaders());

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /pedidos-venda/:id/enviar', () => {
    it('deve enviar pedido com PATCH', async () => {
      (mockPrisma.pedidoVenda.findFirst as any).mockResolvedValue({
        id: 'ped-1',
        empresaId: 'emp-1',
        situacao: 'CONFIRMADO',
      });

      (mockPrisma.pedidoVenda.update as any).mockResolvedValue({
        id: 'ped-1',
        empresaId: 'emp-1',
        situacao: 'ENVIADO',
        numeroPedido: 'PV000001',
      });

      const app = criarApp((app) => {
        app.use('/pedidos-venda', pedidosVendaRoutes);
      });

      const response = await request(app)
        .patch('/pedidos-venda/ped-1/enviar')
        .set(gerarHeaders());

      expect(response.status).toBe(200);
      expect(response.body.situacao).toBe('ENVIADO');
    });
  });

  describe('PATCH /pedidos-venda/:id/cancelar', () => {
    it('deve cancelar pedido com PATCH', async () => {
      (mockPrisma.pedidoVenda.findFirst as any).mockResolvedValue({
        id: 'ped-1',
        empresaId: 'emp-1',
        situacao: 'EM_ABERTO',
      });

      (mockPrisma.pedidoVenda.update as any).mockResolvedValue({
        id: 'ped-1',
        empresaId: 'emp-1',
        situacao: 'CANCELADO',
      });

      const app = criarApp((app) => {
        app.use('/pedidos-venda', pedidosVendaRoutes);
      });

      const response = await request(app)
        .patch('/pedidos-venda/ped-1/cancelar')
        .set(gerarHeaders());

      expect(response.status).toBe(200);
      expect(response.body.situacao).toBe('CANCELADO');
    });
  });

  describe('POST /pedidos-venda', () => {
    it('deve criar pedido de venda', async () => {
      const pedidoCriado = {
        id: 'ped-1',
        empresaId: 'emp-1',
        filialId: 'fil-1',
        clienteId: 'cli-1',
        numeroPedido: 'PV202606300001',
        situacao: 'EM_ABERTO',
        valorTotal: 1500,
        itens: [
          {
            id: 'item-1',
            produtoId: 'prod-1',
            quantidade: 2,
            valorUnitario: 750,
            valorTotal: 1500,
          },
        ],
        cliente: { id: 'cli-1', nome: 'Cliente Teste' },
        filial: { id: 'fil-1', nomeFantasia: 'Filial Teste' },
      };

      (mockPrisma.pedidoVenda.create as any).mockResolvedValue(pedidoCriado);

      const app = criarApp((app) => {
        app.use('/pedidos-venda', pedidosVendaRoutes);
      });

      const response = await request(app)
        .post('/pedidos-venda')
        .set(gerarHeaders())
        .send({
          filialId: 'fil-1',
          clienteId: 'cli-1',
          valorFrete: 0,
          valorDesconto: 0,
          valorOutrosAcrescimos: 0,
          condicaoPagamento: 'A_VISTA',
          itens: [
            {
              produtoId: 'prod-1',
              codigoInterno: '001',
              unidadeMedida: 'UN',
              quantidade: 2,
              valorUnitario: 750,
              valorDesconto: 0,
            },
          ],
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBe('ped-1');
      expect(response.body.valorTotal).toBe(1500);
    });

    it('deve rejeitar pedido sem itens', async () => {
      const app = criarApp((app) => {
        app.use('/pedidos-venda', pedidosVendaRoutes);
      });

      const response = await request(app)
        .post('/pedidos-venda')
        .set(gerarHeaders())
        .send({
          filialId: 'fil-1',
          clienteId: 'cli-1',
          itens: [],
        });

      expect(response.status).toBe(400);
    });

    it('deve rejeitar pedido sem cliente', async () => {
      const app = criarApp((app) => {
        app.use('/pedidos-venda', pedidosVendaRoutes);
      });

      const response = await request(app)
        .post('/pedidos-venda')
        .set(gerarHeaders())
        .send({
          filialId: 'fil-1',
          itens: [{ produtoId: 'prod-1', quantidade: 1, valorUnitario: 100 }],
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /pedidos-venda', () => {
    it('deve listar pedidos de venda', async () => {
      const pedidos = [
        { id: 'ped-1', numeroPedido: 'PV000001', valorTotal: 1500, situacao: 'EM_ABERTO' },
        { id: 'ped-2', numeroPedido: 'PV000002', valorTotal: 2500, situacao: 'CONFIRMADO' },
      ];

      (mockPrisma.pedidoVenda.findMany as any).mockResolvedValue(pedidos);
      (mockPrisma.pedidoVenda.count as any).mockResolvedValue(2);

      const app = criarApp((app) => {
        app.use('/pedidos-venda', pedidosVendaRoutes);
      });

      const response = await request(app)
        .get('/pedidos-venda')
        .set(gerarHeaders());

      expect(response.status).toBe(200);
      expect(response.body.dados).toHaveLength(2);
    });
  });
});
