import { prisma } from '@/database/prisma.service';
import type { Prisma } from '@prisma/client';
import { 
  CriarFornecedorInput, 
  AtualizarFornecedorInput, 
  FornecedorFiltro 
} from './dto/fornecedor.dto';

export class FornecedoresService {
  private flatten<T extends { endereco?: any }>(item: T) {
    const { endereco, ...rest } = item as any;
    return { ...rest, ...(endereco || {}) };
  }

  async criar(empresaId: string, dados: CriarFornecedorInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const { logradouro, numero, complemento, bairro, cidade, uf, cep, ...resto } = dados;
    
    const result = await prisma.fornecedor.create({
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
      } as Prisma.FornecedorUncheckedCreateInput,
    });
    return this.flatten(result);
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const result = await prisma.fornecedor.findFirst({
      where: { id, empresaId },
    });
    return result ? this.flatten(result) : null;
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
      dados: dados.map(this.flatten),
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
    
    const endereco: any = {};
    if (logradouro !== undefined) endereco.logradouro = logradouro;
    if (numero !== undefined) endereco.numero = numero;
    if (complemento !== undefined) endereco.complemento = complemento;
    if (bairro !== undefined) endereco.bairro = bairro;
    if (cidade !== undefined) endereco.cidade = cidade;
    if (uf !== undefined) endereco.uf = uf;
    if (cep !== undefined) endereco.cep = cep;

    const hasEndereco = Object.keys(endereco).length > 0;

    const result = await prisma.fornecedor.update({
      where: { id },
      data: {
        ...resto,
        ...(hasEndereco ? { endereco } : {}),
      },
    });
    return this.flatten(result);
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
