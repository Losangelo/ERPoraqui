import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import clientesRoutes from '@/modules/clientes/clientes.routes';
import { criarApp, limparMocks, mockLicencaAtiva } from './helpers';
import { mockPrisma, gerarHeaders } from './setup';

describe('Clientes', () => {
  beforeEach(() => {
    limparMocks();
    mockLicencaAtiva();
  });

  describe('GET /clientes', () => {
    it('deve listar clientes', async () => {
      const clientes = [
        {
          id: 'cli-1',
          empresaId: 'emp-1',
          nome: 'Cliente A',
          documento: '11111111111',
          tipoPessoa: 'FISICA',
          ativo: true,
        },
        {
          id: 'cli-2',
          empresaId: 'emp-1',
          nome: 'Cliente B',
          documento: '22222222222',
          tipoPessoa: 'FISICA',
          ativo: true,
        },
      ];

      (mockPrisma.cliente.findMany as any).mockResolvedValue(clientes);
      (mockPrisma.cliente.count as any).mockResolvedValue(2);

      const app = criarApp((app) => {
        app.use('/clientes', clientesRoutes);
      });

      const response = await request(app)
        .get('/clientes')
        .set(gerarHeaders());

      expect(response.status).toBe(200);
      expect(response.body.dados).toHaveLength(2);
    });

    it('deve retornar 401 sem token', async () => {
      const app = criarApp((app) => {
        app.use('/clientes', clientesRoutes);
      });

      const response = await request(app).get('/clientes');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /clientes/:id', () => {
    it('deve buscar cliente por ID', async () => {
      (mockPrisma.cliente.findFirst as any).mockResolvedValue({
        id: 'cli-1',
        empresaId: 'emp-1',
        nome: 'Cliente Teste',
        documento: '11111111111',
        tipoPessoa: 'FISICA',
        ativo: true,
      });

      const app = criarApp((app) => {
        app.use('/clientes', clientesRoutes);
      });

      const response = await request(app)
        .get('/clientes/cli-1')
        .set(gerarHeaders());

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe('Cliente Teste');
    });

    it('deve retornar 404 quando cliente não existe', async () => {
      (mockPrisma.cliente.findFirst as any).mockResolvedValue(null);

      const app = criarApp((app) => {
        app.use('/clientes', clientesRoutes);
      });

      const response = await request(app)
        .get('/clientes/cli-inexistente')
        .set(gerarHeaders());

      expect(response.status).toBe(404);
    });
  });

  describe('POST /clientes', () => {
    it('deve criar cliente', async () => {
      (mockPrisma.cliente.create as any).mockResolvedValue({
        id: 'cli-1',
        empresaId: 'emp-1',
        nome: 'Novo Cliente',
        documento: '33333333333',
        tipoPessoa: 'FISICA',
        telefone: '11999999999',
        email: 'cliente@teste.com',
        ativo: true,
      });

      const app = criarApp((app) => {
        app.use('/clientes', clientesRoutes);
      });

      const response = await request(app)
        .post('/clientes')
        .set(gerarHeaders())
        .send({
          nome: 'Novo Cliente',
          documento: '33333333333',
          tipoPessoa: 'FISICA',
          telefone: '11999999999',
          email: 'cliente@teste.com',
        });

      expect(response.status).toBe(201);
      expect(response.body.nome).toBe('Novo Cliente');
    });

    it('deve rejeitar criação sem nome', async () => {
      const app = criarApp((app) => {
        app.use('/clientes', clientesRoutes);
      });

      const response = await request(app)
        .post('/clientes')
        .set(gerarHeaders())
        .send({
          documento: '33333333333',
          tipoPessoa: 'FISICA',
        });

      expect(response.status).toBe(400);
    });

    it('deve rejeitar criação sem documento', async () => {
      const app = criarApp((app) => {
        app.use('/clientes', clientesRoutes);
      });

      const response = await request(app)
        .post('/clientes')
        .set(gerarHeaders())
        .send({
          nome: 'Cliente sem doc',
          tipoPessoa: 'FISICA',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /clientes/:id', () => {
    it('deve atualizar cliente', async () => {
      (mockPrisma.cliente.findFirst as any).mockResolvedValue({
        id: 'cli-1',
        empresaId: 'emp-1',
        nome: 'Cliente Antigo',
      });

      (mockPrisma.cliente.update as any).mockResolvedValue({
        id: 'cli-1',
        empresaId: 'emp-1',
        nome: 'Cliente Atualizado',
        documento: '11111111111',
      });

      const app = criarApp((app) => {
        app.use('/clientes', clientesRoutes);
      });

      const response = await request(app)
        .put('/clientes/cli-1')
        .set(gerarHeaders())
        .send({ nome: 'Cliente Atualizado' });

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe('Cliente Atualizado');
    });
  });

  describe('PATCH /clientes/:id/inativar', () => {
    it('deve inativar cliente', async () => {
      (mockPrisma.cliente.findFirst as any).mockResolvedValue({
        id: 'cli-1',
        empresaId: 'emp-1',
      });

      (mockPrisma.cliente.update as any).mockResolvedValue({
        id: 'cli-1',
        ativo: false,
      });

      const app = criarApp((app) => {
        app.use('/clientes', clientesRoutes);
      });

      const response = await request(app)
        .patch('/clientes/cli-1/inativar')
        .set(gerarHeaders());

      expect(response.status).toBe(200);
      expect(response.body.ativo).toBe(false);
    });
  });
});
