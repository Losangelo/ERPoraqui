import { prisma } from '@/database/prisma.service';
import appLogger from '@/shared/logger/logger';
import { 
  CriarClienteInput, 
  AtualizarClienteInput, 
  ClienteFiltro 
} from './dto/cliente.dto';

export class ClientesService {
  async criar(empresaId: string, dados: CriarClienteInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const cliente = await prisma.cliente.create({
      data: {
        ...dados,
        empresaId,
      },
    });
    appLogger.business('criar_cliente', { empresaId, clienteId: cliente.id, nome: dados.nome });
    return cliente;
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.cliente.findFirst({
      where: { id, empresaId },
    });
  }

  async listar(empresaId: string, filtros: ClienteFiltro) {
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
      prisma.cliente.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { nome: 'asc' },
      }),
      prisma.cliente.count({ where }),
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

  async atualizar(id: string, empresaId: string, dados: AtualizarClienteInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    
    const cliente = await prisma.cliente.update({
      where: { id },
      data: dados,
    });
    appLogger.business('atualizar_cliente', { empresaId, clienteId: id });
    return cliente;
  }

  async inativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    
    const cliente = await prisma.cliente.update({
      where: { id },
      data: { ativo: false },
    });
    appLogger.business('inativar_cliente', { empresaId, clienteId: id });
    return cliente;
  }

  async ativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    
    const cliente = await prisma.cliente.update({
      where: { id },
      data: { ativo: true },
    });
    appLogger.business('ativar_cliente', { empresaId, clienteId: id });
    return cliente;
  }

  private async verificarProprietario(id: string, empresaId: string) {
    const cliente = await prisma.cliente.findFirst({
      where: { id, empresaId },
    });

    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }
  }
}
