import { prisma } from '@/database/prisma.service';
import {
  CriarVeiculoEntregaInput,
  AtualizarVeiculoEntregaInput,
  VeiculoEntregaFiltro,
} from './dto/veiculo-entrega.dto';

export class VeiculosEntregasService {
  async criar(empresaId: string, dados: CriarVeiculoEntregaInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    return prisma.veiculoEntrega.create({
      data: {
        placa: dados.placa,
        marca: dados.marca,
        modelo: dados.modelo,
        ano: dados.ano,
        cor: dados.cor,
        capacidadeKg: dados.capacidadeKg,
        tipo: dados.tipo,
        proprietarioId: dados.proprietarioId,
        observacoes: dados.observacoes,
        empresaId,
      },
    });
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.veiculoEntrega.findFirst({
      where: { id, empresaId },
    });
  }

  async listar(empresaId: string, filtros: VeiculoEntregaFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const { placa, tipo, ativo, pagina, limite } = filtros;

    const where = {
      empresaId,
      ...(placa && { placa: { contains: placa, mode: 'insensitive' as const } }),
      ...(tipo && { tipo }),
      ...(ativo !== undefined && { ativo }),
    };

    const [dados, total] = await Promise.all([
      prisma.veiculoEntrega.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { placa: 'asc' },
      }),
      prisma.veiculoEntrega.count({ where }),
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

  async atualizar(id: string, empresaId: string, dados: AtualizarVeiculoEntregaInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    return prisma.veiculoEntrega.update({
      where: { id },
      data: {
        ...(dados.placa !== undefined && { placa: dados.placa }),
        ...(dados.marca !== undefined && { marca: dados.marca }),
        ...(dados.modelo !== undefined && { modelo: dados.modelo }),
        ...(dados.ano !== undefined && { ano: dados.ano }),
        ...(dados.cor !== undefined && { cor: dados.cor }),
        ...(dados.capacidadeKg !== undefined && { capacidadeKg: dados.capacidadeKg }),
        ...(dados.tipo !== undefined && { tipo: dados.tipo }),
        ...(dados.proprietarioId !== undefined && { proprietarioId: dados.proprietarioId }),
        ...(dados.observacoes !== undefined && { observacoes: dados.observacoes }),
      },
    });
  }

  async inativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    return prisma.veiculoEntrega.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async ativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    return prisma.veiculoEntrega.update({
      where: { id },
      data: { ativo: true },
    });
  }

  private async verificarProprietario(id: string, empresaId: string) {
    const veiculo = await prisma.veiculoEntrega.findFirst({
      where: { id, empresaId },
    });

    if (!veiculo) {
      throw new Error('Veículo não encontrado');
    }
  }
}
