import { prisma } from '@/database/prisma.service';
import { 
  CriarVendedorInput, 
  AtualizarVendedorInput,
  VendedorFiltro 
} from './dto/vendedor.dto';

export class VendedoresService {
  async criar(empresaId: string, dados: CriarVendedorInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    
    return prisma.vendedor.create({
      data: {
        ...dados,
        empresaId,
      },
    });
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.vendedor.findFirst({
      where: { id, empresaId },
    });
  }

  async listar(empresaId: string, filtros: VendedorFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const { nome, documento, tipoPessoa, ativo, pagina, limite } = filtros;

    const where = {
      empresaId,
      ...(nome && { nome: { contains: nome, mode: 'insensitive' as const } }),
      ...(documento && { documento: { contains: documento } }),
      ...(tipoPessoa && { tipoPessoa }),
      ...(ativo !== undefined && { ativo }),
    };

    const [dados, total] = await Promise.all([
      prisma.vendedor.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { nome: 'asc' },
      }),
      prisma.vendedor.count({ where }),
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

  async atualizar(id: string, empresaId: string, dados: AtualizarVendedorInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    
    return prisma.vendedor.update({
      where: { id },
      data: dados,
    });
  }

  async inativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    
    return prisma.vendedor.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async ativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    
    return prisma.vendedor.update({
      where: { id },
      data: { ativo: true },
    });
  }

  private async verificarProprietario(id: string, empresaId: string) {
    const vendedor = await prisma.vendedor.findFirst({
      where: { id, empresaId },
    });

    if (!vendedor) {
      throw new Error('Vendedor não encontrado');
    }
  }
}
