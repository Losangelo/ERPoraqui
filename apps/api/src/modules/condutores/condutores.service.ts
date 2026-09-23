import { prisma } from '@/database/prisma.service';
import {
  CriarCondutorInput,
  AtualizarCondutorInput,
  CondutorFiltro,
} from './dto/condutor.dto';

export class CondutoresService {
  async criar(empresaId: string, dados: CriarCondutorInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    if (dados.cpf) {
      const existente = await prisma.condutor.findUnique({
        where: { empresaId_cpf: { empresaId, cpf: dados.cpf } },
      });
      if (existente) throw new Error(`CPF ${dados.cpf} já cadastrado`);
    }

    return prisma.condutor.create({
      data: {
        nome: dados.nome,
        cpf: dados.cpf ?? '',
        tipoCondutor: dados.tipoCondutor,
        cnh: dados.cnh,
        cnhCategoria: dados.cnhCategoria,
        cnhVencimento: dados.cnhVencimento,
        telefone: dados.telefone,
        email: dados.email || null,
        observacoes: dados.observacoes,
        ativo: dados.ativo,
        empresaId,
      },
    });
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.condutor.findFirst({
      where: { id, empresaId },
    });
  }

  async listar(empresaId: string, filtros: CondutorFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const { nome, ativo, tipoCondutor, pagina, limite } = filtros;

    const where = {
      empresaId,
      ...(nome && { nome: { contains: nome, mode: 'insensitive' as const } }),
      ...(ativo !== undefined && { ativo }),
      ...(tipoCondutor && { tipoCondutor }),
    };

    const [dados, total] = await Promise.all([
      prisma.condutor.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { nome: 'asc' },
      }),
      prisma.condutor.count({ where }),
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

  async atualizar(id: string, empresaId: string, dados: AtualizarCondutorInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    return prisma.condutor.update({
      where: { id },
      data: {
        ...(dados.nome !== undefined && { nome: dados.nome }),
        ...(dados.cpf !== undefined && { cpf: dados.cpf }),
        ...(dados.tipoCondutor !== undefined && { tipoCondutor: dados.tipoCondutor }),
        ...(dados.cnh !== undefined && { cnh: dados.cnh }),
        ...(dados.cnhCategoria !== undefined && { cnhCategoria: dados.cnhCategoria }),
        ...(dados.cnhVencimento !== undefined && { cnhVencimento: dados.cnhVencimento }),
        ...(dados.telefone !== undefined && { telefone: dados.telefone }),
        ...(dados.email !== undefined && { email: dados.email }),
        ...(dados.observacoes !== undefined && { observacoes: dados.observacoes }),
        ...(dados.ativo !== undefined && { ativo: dados.ativo }),
      },
    });
  }

  async inativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    return prisma.condutor.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async ativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    return prisma.condutor.update({
      where: { id },
      data: { ativo: true },
    });
  }

  private async verificarProprietario(id: string, empresaId: string) {
    const condutor = await prisma.condutor.findFirst({
      where: { id, empresaId },
    });
    if (!condutor) throw new Error('Condutor não encontrado');
  }
}
