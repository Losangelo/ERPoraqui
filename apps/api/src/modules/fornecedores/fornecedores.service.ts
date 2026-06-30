import { prisma } from '@/database/prisma.service';
import { 
  CriarFornecedorInput, 
  AtualizarFornecedorInput, 
  FornecedorFiltro 
} from './dto/fornecedor.dto';

export class FornecedoresService {
  async criar(empresaId: string, dados: CriarFornecedorInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const { logradouro, numero, complemento, bairro, cidade, uf, cep, ...resto } = dados;
    
    return prisma.fornecedor.create({
      data: {
        ...resto,
        empresaId,
        endereco: logradouro ? {
          logradouro,
          numero,
          complemento,
          bairro,
          cidade,
          uf,
          cep,
        } : undefined,
      },
    });
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.fornecedor.findFirst({
      where: { id, empresaId },
    });
  }

  async listar(empresaId: string, filtros: FornecedorFiltro) {
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
      prisma.fornecedor.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { nome: 'asc' },
      }),
      prisma.fornecedor.count({ where }),
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

  async atualizar(id: string, empresaId: string, dados: AtualizarFornecedorInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    
    const { logradouro, numero, complemento, bairro, cidade, uf, cep, ...resto } = dados;
    
    return prisma.fornecedor.update({
      where: { id },
      data: {
        ...resto,
        ...(logradouro && {
          endereco: {
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            uf,
            cep,
          },
        }),
      },
    });
  }

  async inativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    
    return prisma.fornecedor.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async ativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    
    return prisma.fornecedor.update({
      where: { id },
      data: { ativo: true },
    });
  }

  private async verificarProprietario(id: string, empresaId: string) {
    const fornecedor = await prisma.fornecedor.findFirst({
      where: { id, empresaId },
    });

    if (!fornecedor) {
      throw new Error('Fornecedor não encontrado');
    }
  }
}
