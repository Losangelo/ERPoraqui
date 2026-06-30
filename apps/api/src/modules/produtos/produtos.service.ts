import { prisma } from '@/database/prisma.service';
import { 
  CriarProdutoInput, 
  AtualizarProdutoInput, 
  ProdutoFiltro 
} from './dto/produto.dto';

export class ProdutosService {
  async criar(empresaId: string, dados: CriarProdutoInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.produto.create({
      data: {
        ...dados,
        empresaId,
      },
    });
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.produto.findFirst({
      where: { id, empresaId },
    });
  }

  async listar(empresaId: string, filtros: ProdutoFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const { nome, codigoInterno, codigoBarras, categoriaId, ativo, pagina, limite } = filtros;

    const where = {
      empresaId,
      ...(nome && { nome: { contains: nome, mode: 'insensitive' as const } }),
      ...(codigoInterno && { codigoInterno: { contains: codigoInterno } }),
      ...(codigoBarras && { codigoBarras: { contains: codigoBarras } }),
      ...(categoriaId && { categoriaId }),
      ...(ativo !== undefined && { ativo }),
    };

    const [dados, total] = await Promise.all([
      prisma.produto.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { nome: 'asc' },
      }),
      prisma.produto.count({ where }),
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

  async atualizar(id: string, empresaId: string, dados: AtualizarProdutoInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    
    return prisma.produto.update({
      where: { id },
      data: dados,
    });
  }

  async inativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    
    return prisma.produto.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async ativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    
    return prisma.produto.update({
      where: { id },
      data: { ativo: true },
    });
  }

  private async verificarProprietario(id: string, empresaId: string) {
    const produto = await prisma.produto.findFirst({
      where: { id, empresaId },
    });

    if (!produto) {
      throw new Error('Produto não encontrado');
    }
  }
}
