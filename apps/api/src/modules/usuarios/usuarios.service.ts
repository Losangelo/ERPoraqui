import { prisma } from '@/database/prisma.service';
import { UsuarioInput, UsuarioUpdateInput, UsuarioFiltro } from './dto/usuario.dto';
import bcrypt from 'bcryptjs';

export class UsuariosService {
  async criar(empresaId: string, dados: UsuarioInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const existeEmail = await prisma.usuario.findFirst({
      where: { email: dados.email, empresaId },
    });

    if (existeEmail) {
      throw new Error('Email já está em uso');
    }

    const senhaHash = await bcrypt.hash(dados.senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        empresaId,
        email: dados.email,
        nome: dados.nome,
        senha: senhaHash,
        perfil: dados.perfil || 'USUARIO',
        ativo: dados.ativo !== undefined ? dados.ativo : true,
      },
    });

    return {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      perfil: usuario.perfil,
      ativo: usuario.ativo,
      dataCriacao: usuario.dataCriacao,
    };
  }

  async listar(empresaId: string, filtros: UsuarioFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const { nome, email, perfil, ativo, pagina, limite } = filtros;

    const where: any = {
      empresaId,
      ...(nome && { nome: { contains: nome, mode: 'insensitive' } }),
      ...(email && { email: { contains: email, mode: 'insensitive' } }),
      ...(perfil && { perfil }),
      ...(ativo !== undefined && { ativo }),
    };

    const [dados, total] = await Promise.all([
      prisma.usuario.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { nome: 'asc' },
        select: {
          id: true,
          email: true,
          nome: true,
          perfil: true,
          ativo: true,
          ultimoAcesso: true,
          dataCriacao: true,
        },
      }),
      prisma.usuario.count({ where }),
    ]);

    return {
      dados,
      meta: {
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const usuario = await prisma.usuario.findFirst({
      where: { id, empresaId },
      select: {
        id: true,
        email: true,
        nome: true,
        perfil: true,
        ativo: true,
        ultimoAcesso: true,
        dataCriacao: true,
      },
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    return usuario;
  }

  async atualizar(id: string, empresaId: string, dados: UsuarioUpdateInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const usuario = await prisma.usuario.findFirst({
      where: { id, empresaId },
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    if (dados.email && dados.email !== usuario.email) {
      const existeEmail = await prisma.usuario.findFirst({
        where: { email: dados.email, empresaId },
      });
      if (existeEmail) {
        throw new Error('Email já está em uso');
      }
    }

    const dataUpdate: any = { ...dados };
    if (dados.senha) {
      dataUpdate.senha = await bcrypt.hash(dados.senha, 10);
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id },
      data: dataUpdate,
      select: {
        id: true,
        email: true,
        nome: true,
        perfil: true,
        ativo: true,
        dataCriacao: true,
      },
    });

    return usuarioAtualizado;
  }

  async excluir(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const usuario = await prisma.usuario.findFirst({
      where: { id, empresaId },
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    await prisma.usuario.delete({ where: { id } });

    return { message: 'Usuário excluído com sucesso' };
  }

  async alterarSenha(id: string, empresaId: string, senhaAtual: string, novaSenha: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const usuario = await prisma.usuario.findFirst({
      where: { id, empresaId },
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaValida) {
      throw new Error('Senha atual incorreta');
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);

    await prisma.usuario.update({
      where: { id },
      data: { senha: senhaHash },
    });

    return { message: 'Senha alterada com sucesso' };
  }

  async listarPerfis() {
    return ['ADMINISTRADOR', 'GERENTE', 'USUARIO', 'VISUALIZADOR'];
  }
}
