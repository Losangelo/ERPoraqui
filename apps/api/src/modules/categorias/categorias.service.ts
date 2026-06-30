import { prisma } from '@/database/prisma.service';
import { CategoriaInput, CategoriaUpdateInput, CategoriaFiltro } from './dto/categoria.dto';

export class CategoriasService {
  async criar(empresaId: string, dados: CategoriaInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    if (dados.categoriaPaiId) {
      const categoriaPai = await prisma.categoria.findFirst({
        where: { id: dados.categoriaPaiId, empresaId },
      });
      if (!categoriaPai) {
        throw new Error('Categoria pai não encontrada');
      }
    }

    const categoria = await prisma.categoria.create({
      data: {
        empresaId,
        nome: dados.nome,
        descricao: dados.descricao,
        categoriaPaiId: dados.categoriaPaiId,
        ativo: dados.ativo !== undefined ? dados.ativo : true,
      },
    });

    return categoria;
  }

  async listar(empresaId: string, filtros: CategoriaFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const { nome, ativo, pagina, limite } = filtros;

    const where: any = {
      empresaId,
      ...(nome && { nome: { contains: nome, mode: 'insensitive' } }),
      ...(ativo !== undefined && { ativo }),
    };

    const [dados, total] = await Promise.all([
      prisma.categoria.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { nome: 'asc' },
        include: {
          categoriaPai: {
            select: { id: true, nome: true },
          },
          _count: {
            select: { produtos: true, subcategorias: true },
          },
        },
      }),
      prisma.categoria.count({ where }),
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

    const categoria = await prisma.categoria.findFirst({
      where: { id, empresaId },
      include: {
        categoriaPai: {
          select: { id: true, nome: true },
        },
        subcategorias: {
          select: { id: true, nome: true },
        },
        _count: {
          select: { produtos: true },
        },
      },
    });

    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }

    return categoria;
  }

  async atualizar(id: string, empresaId: string, dados: CategoriaUpdateInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const categoria = await prisma.categoria.findFirst({
      where: { id, empresaId },
    });

    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }

    if (dados.categoriaPaiId !== undefined && dados.categoriaPaiId !== null) {
      if (dados.categoriaPaiId === id) {
        throw new Error('Categoria não pode ser filha de si mesma');
      }
      const categoriaPai = await prisma.categoria.findFirst({
        where: { id: dados.categoriaPaiId, empresaId },
      });
      if (!categoriaPai) {
        throw new Error('Categoria pai não encontrada');
      }
    }

    const categoriaAtualizada = await prisma.categoria.update({
      where: { id },
      data: dados,
    });

    return categoriaAtualizada;
  }

  async excluir(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const categoria = await prisma.categoria.findFirst({
      where: { id, empresaId },
    });

    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }

    const subcategorias = await prisma.categoria.count({
      where: { categoriaPaiId: id },
    });

    if (subcategorias > 0) {
      throw new Error('Não é possível excluir categoria com subcategorias');
    }

    const produtos = await prisma.produto.count({
      where: { categoriaId: id },
    });

    if (produtos > 0) {
      throw new Error('Não é possível excluir categoria com produtos associados');
    }

    await prisma.categoria.delete({ where: { id } });

    return { message: 'Categoria excluída com sucesso' };
  }

  async listarArvore(empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const categorias = await prisma.categoria.findMany({
      where: { empresaId, ativo: true },
      orderBy: { nome: 'asc' },
      include: {
        subcategorias: {
          where: { ativo: true },
          orderBy: { nome: 'asc' },
          include: {
            subcategorias: {
              where: { ativo: true },
              orderBy: { nome: 'asc' },
            },
          },
        },
      },
    });

    return categorias;
  }
}
