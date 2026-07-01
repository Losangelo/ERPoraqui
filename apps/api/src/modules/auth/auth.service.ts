import { prisma } from '@/database/prisma.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginInput } from './dto/auth.dto';

export class AuthService {
  async register(data: { email: string; senha: string; nome: string; empresa: { razaoSocial: string; cnpj: string } }) {
    const existeUsuario = await prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (existeUsuario) {
      throw new Error('Email já está em uso');
    }

    let empresa = await prisma.empresa.findUnique({
      where: { cnpj: data.empresa.cnpj },
    });

    if (!empresa) {
      empresa = await prisma.empresa.create({
        data: {
          razaoSocial: data.empresa.razaoSocial,
          cnpj: data.empresa.cnpj,
        },
      });
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        empresaId: empresa.id,
        email: data.email,
        nome: data.nome,
        senha: senhaHash,
        perfil: 'ADMINISTRADOR',
        ativo: true,
      },
    });

    // Criar licenca BASICA automatica para a nova empresa
    try {
      const planoBasic = await prisma.plano.findFirst({ where: { nome: 'BASIC' } });
      if (planoBasic) {
        const licencaExistente = await prisma.licenca.findFirst({
          where: { empresaId: empresa.id, status: 'ATIVA' },
        });
        if (!licencaExistente) {
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          let chave = '';
          for (let i = 0; i < 16; i++) {
            if (i > 0 && i % 4 === 0) chave += '-';
            chave += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          await prisma.licenca.create({
            data: {
              empresaId: empresa.id,
              planoId: planoBasic.id,
              chave,
              tipoCobranca: 'DEFINITIVO',
              dataInicio: new Date(),
              dataExpiracao: null,
              status: 'ATIVA',
              limiteUsuarios: planoBasic.limiteUsuarios,
              limiteClientes: planoBasic.limiteClientes,
              limiteProdutos: planoBasic.limiteProdutos,
              limiteNotasFiscais: planoBasic.limiteNotasFiscais,
              limiteEmpresas: planoBasic.limiteEmpresas,
              moduloCrm: planoBasic.moduloCrm,
              moduloAutomacao: planoBasic.moduloAutomacao,
              moduloMultiEmpresa: planoBasic.moduloMultiEmpresa,
              moduloApi: planoBasic.moduloApi,
              usuariosAtivos: 0,
              clientesAtivos: 0,
              produtosAtivos: 0,
              notasEsteMes: 0,
            },
          });
        }
      }
    } catch {
      // Falha ao criar licenca nao deve impedir o registro
    }

    const token = jwt.sign(
      { usuarioId: usuario.id, empresaId: usuario.empresaId },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );

    return {
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        perfil: usuario.perfil,
      },
      empresa: {
        id: empresa.id,
        razaoSocial: empresa.razaoSocial,
      },
      token,
    };
  }

  async login(dados: LoginInput) {
    const usuario = await prisma.usuario.findUnique({
      where: { email: dados.email },
      include: {
        empresa: true,
      },
    });

    if (!usuario) {
      throw new Error('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(dados.senha, usuario.senha);

    if (!senhaValida) {
      throw new Error('Credenciais inválidas');
    }

    if (!usuario.ativo) {
      throw new Error('Usuário inativo');
    }

    const token = jwt.sign(
      { usuarioId: usuario.id, empresaId: usuario.empresaId },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { usuarioId: usuario.id },
      process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
      { expiresIn: '7d' }
    );

    return {
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        perfil: usuario.perfil,
      },
      empresa: usuario.empresa ? {
        id: usuario.empresa.id,
        razaoSocial: usuario.empresa.razaoSocial,
        nomeFantasia: usuario.empresa.nomeFantasia,
      } : null,
      token,
      refreshToken,
    };
  }
}
