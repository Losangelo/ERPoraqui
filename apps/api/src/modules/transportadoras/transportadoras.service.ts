import { prisma } from '@/database/prisma.service';
import { 
  CriarTransportadoraInput, 
  AtualizarTransportadoraInput,
  TransportadoraFiltro 
} from './dto/transportadora.dto';

export class TransportadorasService {
  async criar(empresaId: string, dados: CriarTransportadoraInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const { logradouro, numero, complemento, bairro, cidade, uf, cep, ...resto } = dados;
    
    return prisma.transportadora.create({
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
    return prisma.transportadora.findFirst({
      where: { id, empresaId },
    });
  }

  async listar(empresaId: string, filtros: TransportadoraFiltro) {
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
      prisma.transportadora.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { nome: 'asc' },
      }),
      prisma.transportadora.count({ where }),
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

  async atualizar(id: string, empresaId: string, dados: AtualizarTransportadoraInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    
    const { logradouro, numero, complemento, bairro, cidade, uf, cep, ...resto } = dados;
    
    return prisma.transportadora.update({
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
    
    return prisma.transportadora.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async ativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    
    return prisma.transportadora.update({
      where: { id },
      data: { ativo: true },
    });
  }

  private async verificarProprietario(id: string, empresaId: string) {
    const transportadora = await prisma.transportadora.findFirst({
      where: { id, empresaId },
    });

    if (!transportadora) {
      throw new Error('Transportadora não encontrada');
    }
  }
}
