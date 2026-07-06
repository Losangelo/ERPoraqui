import { prisma } from '@/database/prisma.service';
import {
  CriarMotoristaInput,
  AtualizarMotoristaInput,
  MotoristaFiltro,
} from './dto/motorista.dto';

export class MotoristasService {
  async criar(empresaId: string, dados: CriarMotoristaInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    return prisma.motorista.create({
      data: {
        nome: dados.nome,
        cpf: dados.cpf,
        tipo: dados.tipo,
        cnh: dados.cnh,
        cnhCategoria: dados.cnhCategoria,
        telefone: dados.telefone,
        email: dados.email,
        observacoes: dados.observacoes,
        empresaId,
      },
    });
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.motorista.findFirst({
      where: { id, empresaId },
    });
  }

  async listar(empresaId: string, filtros: MotoristaFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const { nome, ativo, tipo, pagina, limite } = filtros;

    const where = {
      empresaId,
      ...(nome && { nome: { contains: nome, mode: 'insensitive' as const } }),
      ...(ativo !== undefined && { ativo }),
      ...(tipo && { tipo }),
    };

    const [dados, total] = await Promise.all([
      prisma.motorista.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { nome: 'asc' },
      }),
      prisma.motorista.count({ where }),
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

  async atualizar(id: string, empresaId: string, dados: AtualizarMotoristaInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    return prisma.motorista.update({
      where: { id },
      data: {
        ...(dados.nome !== undefined && { nome: dados.nome }),
        ...(dados.cpf !== undefined && { cpf: dados.cpf }),
        ...(dados.tipo !== undefined && { tipo: dados.tipo }),
        ...(dados.cnh !== undefined && { cnh: dados.cnh }),
        ...(dados.cnhCategoria !== undefined && { cnhCategoria: dados.cnhCategoria }),
        ...(dados.telefone !== undefined && { telefone: dados.telefone }),
        ...(dados.email !== undefined && { email: dados.email }),
        ...(dados.observacoes !== undefined && { observacoes: dados.observacoes }),
      },
    });
  }

  async inativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    return prisma.motorista.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async ativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    return prisma.motorista.update({
      where: { id },
      data: { ativo: true },
    });
  }

  private async verificarProprietario(id: string, empresaId: string) {
    const motorista = await prisma.motorista.findFirst({
      where: { id, empresaId },
    });

    if (!motorista) {
      throw new Error('Motorista não encontrado');
    }
  }
}
