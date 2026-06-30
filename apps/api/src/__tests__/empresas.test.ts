import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { empresasRoutes } from '@/modules/empresas/empresas.routes';
import { criarApp, limparMocks, mockLicencaAtiva } from './helpers';
import { mockPrisma, gerarHeaders } from './setup';

describe('Empresas', () => {
  beforeEach(() => {
    limparMocks();
    mockLicencaAtiva();
  });

  describe('GET /empresas', () => {
    it('deve listar empresas', async () => {
      const empresas = [
        { id: 'emp-1', razaoSocial: 'Empresa 1', cnpj: '11111111000101' },
        { id: 'emp-2', razaoSocial: 'Empresa 2', cnpj: '22222222000101' },
      ];

      (mockPrisma.empresa.findMany as any).mockResolvedValue(empresas);
      (mockPrisma.empresa.count as any).mockResolvedValue(2);

      const app = criarApp((app) => {
        app.use('/empresas', empresasRoutes);
      });

      const response = await request(app)
        .get('/empresas')
        .set(gerarHeaders());

      expect(response.status).toBe(200);
      expect(response.body.dados).toHaveLength(2);
    });

    it('deve retornar 401 sem token', async () => {
      const app = criarApp((app) => {
        app.use('/empresas', empresasRoutes);
      });

      const response = await request(app).get('/empresas');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /empresas/:id', () => {
    it('deve buscar empresa por ID', async () => {
      (mockPrisma.empresa.findUnique as any).mockResolvedValue({
        id: 'emp-1',
        razaoSocial: 'Empresa Teste',
        cnpj: '11111111000101',
      });

      const app = criarApp((app) => {
        app.use('/empresas', empresasRoutes);
      });

      const response = await request(app)
        .get('/empresas/emp-1')
        .set(gerarHeaders());

      expect(response.status).toBe(200);
      expect(response.body.razaoSocial).toBe('Empresa Teste');
    });

    it('deve retornar 404 quando empresa não existe', async () => {
      (mockPrisma.empresa.findUnique as any).mockResolvedValue(null);

      const app = criarApp((app) => {
        app.use('/empresas', empresasRoutes);
      });

      const response = await request(app)
        .get('/empresas/emp-inexistente')
        .set(gerarHeaders());

      expect(response.status).toBe(404);
    });
  });

  describe('GET /empresas/:id/filiais', () => {
    it('deve listar filiais de uma empresa', async () => {
      const filiais = [
        { id: 'fil-1', empresaId: 'emp-1', razaoSocial: 'Filial 1', cnpj: '11111111000102', ativo: true },
        { id: 'fil-2', empresaId: 'emp-1', razaoSocial: 'Filial 2', cnpj: '11111111000103', ativo: true },
      ];

      (mockPrisma.filial.findMany as any).mockResolvedValue(filiais);

      const app = criarApp((app) => {
        app.use('/empresas', empresasRoutes);
      });

      const response = await request(app)
        .get('/empresas/emp-1/filiais')
        .set(gerarHeaders());

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].razaoSocial).toBe('Filial 1');
    });

    it('deve retornar array vazio quando empresa não tem filiais', async () => {
      (mockPrisma.filial.findMany as any).mockResolvedValue([]);

      const app = criarApp((app) => {
        app.use('/empresas', empresasRoutes);
      });

      const response = await request(app)
        .get('/empresas/emp-1/filiais')
        .set(gerarHeaders());

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });

    it('deve filtrar apenas filiais ativas', async () => {
      const filiaisAtivas = [
        { id: 'fil-1', empresaId: 'emp-1', razaoSocial: 'Filial Ativa', cnpj: '11111111000102', ativo: true },
      ];

      (mockPrisma.filial.findMany as any).mockImplementation(async ({ where }: any) => {
        return where.ativo === true ? filiaisAtivas : [];
      });

      const app = criarApp((app) => {
        app.use('/empresas', empresasRoutes);
      });

      const response = await request(app)
        .get('/empresas/emp-1/filiais')
        .set(gerarHeaders());

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(mockPrisma.filial.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ ativo: true }),
        })
      );
    });
  });

  describe('POST /empresas', () => {
    it('deve criar empresa', async () => {
      (mockPrisma.empresa.create as any).mockResolvedValue({
        id: 'emp-1',
        razaoSocial: 'Nova Empresa',
        cnpj: '33333333000101',
      });

      const app = criarApp((app) => {
        app.use('/empresas', empresasRoutes);
      });

      const response = await request(app)
        .post('/empresas')
        .set(gerarHeaders())
        .send({
          razaoSocial: 'Nova Empresa',
          cnpj: '33333333000101',
        });

      expect(response.status).toBe(201);
      expect(response.body.razaoSocial).toBe('Nova Empresa');
    });

    it('deve rejeitar criação sem razaoSocial', async () => {
      const app = criarApp((app) => {
        app.use('/empresas', empresasRoutes);
      });

      const response = await request(app)
        .post('/empresas')
        .set(gerarHeaders())
        .send({ cnpj: '33333333000101' });

      expect(response.status).toBe(400);
    });
  });
});
