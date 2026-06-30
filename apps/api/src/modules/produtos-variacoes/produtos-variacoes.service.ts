import { prisma } from '@/database/prisma.service';
import { CriarProdutoVariacaoInput, AtualizarProdutoVariacaoInput, ProdutoVariacaoFiltro } from './dto/produto-variacao.dto';

export class ProdutosVariacoesService {
  async criar(empresaId: string, dados: CriarProdutoVariacaoInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.produtoVariacao.create({
      data: { ...dados, empresaId },
    });
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.produtoVariacao.findFirst({
      where: { id, empresaId },
    });
  }

  async listar(empresaId: string, filtros: ProdutoVariacaoFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const { produtoId, ativo, pagina, limite } = filtros;

    const where = {
      empresaId,
      ...(produtoId && { produtoId }),
      ...(ativo !== undefined && { ativo }),
    };

    const [dados, total] = await Promise.all([
      prisma.produtoVariacao.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { nome: 'asc' },
      }),
      prisma.produtoVariacao.count({ where }),
    ]);

    return {
      dados,
      meta: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) },
    };
  }

  async atualizar(id: string, empresaId: string, dados: AtualizarProdutoVariacaoInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    return prisma.produtoVariacao.update({ where: { id }, data: dados });
  }

  async excluir(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    return prisma.produtoVariacao.delete({ where: { id } });
  }

  async inativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    return prisma.produtoVariacao.update({ where: { id }, data: { ativo: false } });
  }

  async ativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    return prisma.produtoVariacao.update({ where: { id }, data: { ativo: true } });
  }

  private async verificarProprietario(id: string, empresaId: string) {
    const item = await prisma.produtoVariacao.findFirst({ where: { id, empresaId } });
    if (!item) throw new Error('Variação não encontrada');
  }
}
