import { prisma } from '@/database/prisma.service';
import {
  CriarPromocaoInput,
  AtualizarPromocaoInput,
  PromocaoFiltro,
} from './dto/promocao.dto';

export class PromocoesService {
  async criar(empresaId: string, dados: CriarPromocaoInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const nome = dados.nome || `Promoção ${new Date().toLocaleDateString('pt-BR')}`;

    const { itens, ...campos } = dados;
    const dataInicio = new Date(campos.dataInicio);
    const dataFim = new Date(campos.dataFim);

    return prisma.promocao.create({
      data: {
        ...campos,
        nome,
        dataInicio,
        dataFim,
        empresaId,
        itens: itens ? {
          create: itens.map((i) => ({
            precoPromocional: i.precoPromocional,
            produto: { connect: { id: i.produtoId } },
          })),
        } : undefined,
      },
      include: { itens: { include: { produto: true } } },
    });
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.promocao.findFirst({
      where: { id, empresaId },
      include: {
        itens: { include: { produto: true } },
      },
    });
  }

  async listar(empresaId: string, filtros: PromocaoFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const { nome, tipoDesconto, ativo, pagina, limite } = filtros;

    const where = {
      empresaId,
      ...(nome && { nome: { contains: nome, mode: 'insensitive' as const } }),
      ...(tipoDesconto && { tipoDesconto }),
      ...(ativo !== undefined && { ativo }),
    };

    const [dados, total] = await Promise.all([
      prisma.promocao.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { dataCriacao: 'desc' },
        include: { itens: { include: { produto: true } } },
      }),
      prisma.promocao.count({ where }),
    ]);

    return {
      dados,
      meta: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) },
    };
  }

  async atualizar(id: string, empresaId: string, dados: AtualizarPromocaoInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    const { itens, ...campos } = dados;
    const updateData: Record<string, unknown> = { ...campos };

    if (campos.dataInicio) updateData.dataInicio = new Date(campos.dataInicio);
    if (campos.dataFim) updateData.dataFim = new Date(campos.dataFim);

    if (itens) {
      await prisma.promocaoItem.deleteMany({ where: { promocaoId: id } });
    }

    return prisma.promocao.update({
      where: { id },
      data: {
        ...updateData,
        ...(itens ? {
          itens: {
            create: itens.map((i) => ({
              precoPromocional: i.precoPromocional,
              produto: { connect: { id: i.produtoId } },
            })),
          },
        } : {}),
      },
      include: { itens: { include: { produto: true } } },
    });
  }

  async excluir(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    return prisma.promocao.delete({ where: { id } });
  }

  async toggleAtivo(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const promocao = await this.verificarProprietario(id, empresaId);
    return prisma.promocao.update({
      where: { id },
      data: { ativo: !promocao.ativo },
    });
  }

  async calcularPrecoPromocional(produtoId: string): Promise<number | null> {
    const agora = new Date();

    const promocaoAtiva = await prisma.promocao.findFirst({
      where: {
        ativo: true,
        dataInicio: { lte: agora },
        dataFim: { gte: agora },
        OR: [
          { aplicaProdutos: 'TODOS' },
          { itens: { some: { produtoId } } },
        ],
      },
      include: {
        itens: { where: { produtoId } },
      },
    });

    if (!promocaoAtiva) return null;

    const item = promocaoAtiva.itens?.[0];
    if (item?.precoPromocional) return item.precoPromocional;

    if (promocaoAtiva.tipoDesconto === 'PERCENTUAL') {
      const produto = await prisma.produto.findFirst({ where: { id: produtoId } });
      if (!produto?.precoVenda) return null;
      return produto.precoVenda * (1 - promocaoAtiva.valorDesconto / 100);
    }

    if (promocaoAtiva.tipoDesconto === 'VALOR_FIXO') {
      const produto = await prisma.produto.findFirst({ where: { id: produtoId } });
      if (!produto?.precoVenda) return null;
      return Math.max(0, produto.precoVenda - promocaoAtiva.valorDesconto);
    }

    return null;
  }

  private async verificarProprietario(id: string, empresaId: string) {
    const item = await prisma.promocao.findFirst({ where: { id, empresaId } });
    if (!item) throw new Error('Promoção não encontrada');
    return item;
  }
}
