import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import authRoutes from '@/modules/auth/auth.routes';
import { criarApp, limparMocks } from './helpers';
import { mockPrisma, gerarHeaders } from './setup';

describe('Auth', () => {
  beforeEach(() => {
    limparMocks();
  });

  describe('POST /login', () => {
    it('deve autenticar com credenciais válidas', async () => {
      const senhaHash = await bcrypt.hash('senha123', 10);

      (mockPrisma.usuario.findUnique as any).mockResolvedValue({
        id: 'user-1',
        empresaId: 'emp-1',
        email: 'teste@teste.com',
        nome: 'Teste',
        senha: senhaHash,
        perfil: 'ADMINISTRADOR',
        ativo: true,
        empresa: { id: 'emp-1', razaoSocial: 'Empresa Teste', nomeFantasia: 'Teste' },
      });

      const app = criarApp((app) => {
        app.use('/auth', authRoutes);
      });

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'teste@teste.com', senha: 'senha123' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.usuario.email).toBe('teste@teste.com');
    });

    it('deve rejeitar senha inválida', async () => {
      const senhaHash = await bcrypt.hash('senha123', 10);

      (mockPrisma.usuario.findUnique as any).mockResolvedValue({
        id: 'user-1',
        empresaId: 'emp-1',
        email: 'teste@teste.com',
        nome: 'Teste',
        senha: senhaHash,
        perfil: 'ADMINISTRADOR',
        ativo: true,
        empresa: null,
      });

      const app = criarApp((app) => {
        app.use('/auth', authRoutes);
      });

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'teste@teste.com', senha: 'senha_errada' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Credenciais inválidas');
    });

    it('deve rejeitar email inexistente', async () => {
      (mockPrisma.usuario.findUnique as any).mockResolvedValue(null);

      const app = criarApp((app) => {
        app.use('/auth', authRoutes);
      });

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'naoexiste@teste.com', senha: 'senha123' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Credenciais inválidas');
    });

    it('deve rejeitar email e senha vazios', async () => {
      const app = criarApp((app) => {
        app.use('/auth', authRoutes);
      });

      const response = await request(app)
        .post('/auth/login')
        .send({});

      expect(response.status).toBe(400);
    });
  });
});
