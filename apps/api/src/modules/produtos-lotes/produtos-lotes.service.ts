import { prisma } from '@/database/prisma.service';
import { CriarProdutoLoteInput, AtualizarProdutoLoteInput, ProdutoLoteFiltro, AjustarEstoqueInput } from './dto/produto-lote.dto';

export class ProdutosLotesService {
  async criar(empresaId: string, dados: CriarProdutoLoteInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.produtoLote.create({
      data: { ...dados, empresaId },
    });
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.produtoLote.findFirst({
      where: { id, empresaId },
    });
  }

  async listar(empresaId: string, filtros: ProdutoLoteFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const { produtoId, ativo, pagina, limite } = filtros;

    const where = {
      empresaId,
      ...(produtoId && { produtoId }),
      ...(ativo !== undefined && { ativo }),
    };

    const [dados, total] = await Promise.all([
      prisma.produtoLote.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { dataCriacao: 'desc' },
      }),
      prisma.produtoLote.count({ where }),
    ]);

    return {
      dados,
      meta: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) },
    };
  }

  async atualizar(id: string, empresaId: string, dados: AtualizarProdutoLoteInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    return prisma.produtoLote.update({ where: { id }, data: dados });
  }

  async inativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    return prisma.produtoLote.update({ where: { id }, data: { ativo: false } });
  }

  async ajustarEstoque(id: string, empresaId: string, dados: AjustarEstoqueInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    return prisma.produtoLote.update({
      where: { id },
      data: { quantidade: dados.quantidade },
    });
  }

  private async verificarProprietario(id: string, empresaId: string) {
    const item = await prisma.produtoLote.findFirst({ where: { id, empresaId } });
    if (!item) throw new Error('Lote não encontrado');
  }
}
