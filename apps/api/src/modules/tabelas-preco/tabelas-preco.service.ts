import { prisma } from '@/database/prisma.service';
import {
  CriarTabelaPrecoInput,
  AtualizarTabelaPrecoInput,
  TabelaPrecoFiltro,
  CriarTabelaPrecoItemInput,
  AtualizarTabelaPrecoItemInput,
  CalcularPrecoInput,
} from './dto/tabela-preco.dto';

export class TabelasPrecoService {
  async criar(empresaId: string, dados: CriarTabelaPrecoInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.tabelaPreco.create({
      data: { ...dados, empresaId },
    });
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.tabelaPreco.findFirst({
      where: { id, empresaId },
      include: {
        itens: {
          include: { produto: true },
        },
      },
    });
  }

  async listar(empresaId: string, filtros: TabelaPrecoFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const { nome, tipo, ativo, pagina, limite } = filtros;

    const where = {
      empresaId,
      ...(nome && { nome: { contains: nome, mode: 'insensitive' as const } }),
      ...(tipo && { tipo }),
      ...(ativo !== undefined && { ativo }),
    };

    const [dados, total] = await Promise.all([
      prisma.tabelaPreco.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { nome: 'asc' },
      }),
      prisma.tabelaPreco.count({ where }),
    ]);

    return {
      dados,
      meta: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) },
    };
  }

  async atualizar(id: string, empresaId: string, dados: AtualizarTabelaPrecoInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    return prisma.tabelaPreco.update({ where: { id }, data: dados });
  }

  async excluir(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    return prisma.tabelaPreco.delete({ where: { id } });
  }

  async adicionarItem(tabelaPrecoId: string, empresaId: string, dados: CriarTabelaPrecoItemInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(tabelaPrecoId, empresaId);
    return prisma.tabelaPrecoItem.create({
      data: { ...dados, tabelaPrecoId },
    });
  }

  async atualizarItem(tabelaPrecoId: string, itemId: string, empresaId: string, dados: AtualizarTabelaPrecoItemInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(tabelaPrecoId, empresaId);
    return prisma.tabelaPrecoItem.update({
      where: { id: itemId },
      data: dados,
    });
  }

  async removerItem(tabelaPrecoId: string, itemId: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(tabelaPrecoId, empresaId);
    return prisma.tabelaPrecoItem.delete({
      where: { id: itemId },
    });
  }

  async calcularPreco(tabelaPrecoId: string, empresaId: string, dados: CalcularPrecoInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const tabela = await prisma.tabelaPreco.findFirst({
      where: { id: tabelaPrecoId, empresaId },
    });
    if (!tabela) throw new Error('Tabela de preço não encontrada');

    const precoCusto = dados.precoCusto || (
      await prisma.produto.findFirst({ where: { id: dados.produtoId } })
    )?.precoCusto || 0;

    const markupAplicado = tabela.markupBase;
    const precoCalculado = precoCusto * (1 + markupAplicado / 100);

    return {
      produtoId: dados.produtoId,
      precoCusto,
      markupBase: markupAplicado,
      precoCalculado: Math.round(precoCalculado * 100) / 100,
    };
  }

  private async verificarProprietario(id: string, empresaId: string) {
    const item = await prisma.tabelaPreco.findFirst({ where: { id, empresaId } });
    if (!item) throw new Error('Tabela de preço não encontrada');
  }
}
