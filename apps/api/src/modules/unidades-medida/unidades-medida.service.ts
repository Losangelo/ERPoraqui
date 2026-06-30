import { prisma } from '@/database/prisma.service';
import { UnidadeMedidaInput, UnidadeMedidaUpdateInput, UnidadeMedidaFiltro } from './dto/unidade-medida.dto';

export class UnidadesMedidaService {
  async criar(empresaId: string, dados: UnidadeMedidaInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const existe = await prisma.unidadeMedida.findFirst({
      where: { empresaId, simbolo: dados.simbolo.toUpperCase() },
    });

    if (existe) {
      throw new Error('Unidade de medida com este símbolo já existe');
    }

    const unidade = await prisma.unidadeMedida.create({
      data: {
        empresaId,
        simbolo: dados.simbolo.toUpperCase(),
        descricao: dados.descricao,
        fracionada: dados.fracionada || false,
        ativo: dados.ativo !== undefined ? dados.ativo : true,
      },
    });

    return unidade;
  }

  async listar(empresaId: string, filtros: UnidadeMedidaFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const { simbolo, descricao, ativo, pagina, limite } = filtros;

    const where: any = {
      empresaId,
      ...(simbolo && { simbolo: { contains: simbolo, mode: 'insensitive' } }),
      ...(descricao && { descricao: { contains: descricao, mode: 'insensitive' } }),
      ...(ativo !== undefined && { ativo }),
    };

    const [dados, total] = await Promise.all([
      prisma.unidadeMedida.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { simbolo: 'asc' },
        include: {
          _count: {
            select: { produtos: true },
          },
        },
      }),
      prisma.unidadeMedida.count({ where }),
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

    const unidade = await prisma.unidadeMedida.findFirst({
      where: { id, empresaId },
      include: {
        _count: {
          select: { produtos: true },
        },
      },
    });

    if (!unidade) {
      throw new Error('Unidade de medida não encontrada');
    }

    return unidade;
  }

  async atualizar(id: string, empresaId: string, dados: UnidadeMedidaUpdateInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const unidade = await prisma.unidadeMedida.findFirst({
      where: { id, empresaId },
    });

    if (!unidade) {
      throw new Error('Unidade de medida não encontrada');
    }

    if (dados.simbolo && dados.simbolo.toUpperCase() !== unidade.simbolo) {
      const existe = await prisma.unidadeMedida.findFirst({
        where: { empresaId, simbolo: dados.simbolo.toUpperCase() },
      });
      if (existe) {
        throw new Error('Unidade de medida com este símbolo já existe');
      }
      dados.simbolo = dados.simbolo.toUpperCase();
    }

    const unidadeAtualizada = await prisma.unidadeMedida.update({
      where: { id },
      data: dados,
    });

    return unidadeAtualizada;
  }

  async excluir(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const unidade = await prisma.unidadeMedida.findFirst({
      where: { id, empresaId },
    });

    if (!unidade) {
      throw new Error('Unidade de medida não encontrada');
    }

    const produtos = await prisma.produto.count({
      where: { unidadeMedidaId: id },
    });

    if (produtos > 0) {
      throw new Error('Não é possível excluir unidade de medida com produtos associados');
    }

    await prisma.unidadeMedida.delete({ where: { id } });

    return { message: 'Unidade de medida excluída com sucesso' };
  }

  async listarAtivas(empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const unidades = await prisma.unidadeMedida.findMany({
      where: { empresaId, ativo: true },
      orderBy: { simbolo: 'asc' },
    });

    return unidades;
  }
}
