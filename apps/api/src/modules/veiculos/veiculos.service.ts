import { prisma } from '@/database/prisma.service';
import {
  CriarVeiculoInput,
  AtualizarVeiculoInput,
  VeiculoFiltro,
} from './dto/veiculo.dto';

export class VeiculosService {
  async criar(empresaId: string, dados: CriarVeiculoInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const existente = await prisma.veiculo.findUnique({
      where: { empresaId_placa: { empresaId, placa: dados.placa } },
    });
    if (existente) throw new Error(`Placa ${dados.placa} já cadastrada`);

    return prisma.veiculo.create({
      data: {
        placa: dados.placa,
        marca: dados.marca,
        modelo: dados.modelo,
        anoFabricacao: dados.ano,
        cor: dados.cor,
        capacidadeKg: dados.capacidadeKg,
        tipoVeiculo: dados.tipoVeiculo,
        observacoes: dados.observacoes,
        ativo: dados.ativo,
        empresaId,
      },
    });
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.veiculo.findFirst({
      where: { id, empresaId },
    });
  }

  async listar(empresaId: string, filtros: VeiculoFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const { placa, tipoVeiculo, ativo, pagina, limite } = filtros;

    const where = {
      empresaId,
      ...(placa && { placa: { contains: placa, mode: 'insensitive' as const } }),
      ...(tipoVeiculo && { tipoVeiculo }),
      ...(ativo !== undefined && { ativo }),
    };

    const [dados, total] = await Promise.all([
      prisma.veiculo.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { placa: 'asc' },
      }),
      prisma.veiculo.count({ where }),
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

  async atualizar(id: string, empresaId: string, dados: AtualizarVeiculoInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    return prisma.veiculo.update({
      where: { id },
      data: {
        ...(dados.placa !== undefined && { placa: dados.placa }),
        ...(dados.marca !== undefined && { marca: dados.marca }),
        ...(dados.modelo !== undefined && { modelo: dados.modelo }),
        ...(dados.ano !== undefined && { anoFabricacao: dados.ano }),
        ...(dados.cor !== undefined && { cor: dados.cor }),
        ...(dados.capacidadeKg !== undefined && { capacidadeKg: dados.capacidadeKg }),
        ...(dados.tipoVeiculo !== undefined && { tipoVeiculo: dados.tipoVeiculo }),
        ...(dados.observacoes !== undefined && { observacoes: dados.observacoes }),
        ...(dados.ativo !== undefined && { ativo: dados.ativo }),
      },
    });
  }

  async inativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    return prisma.veiculo.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async ativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    return prisma.veiculo.update({
      where: { id },
      data: { ativo: true },
    });
  }

  private async verificarProprietario(id: string, empresaId: string) {
    const veiculo = await prisma.veiculo.findFirst({
      where: { id, empresaId },
    });
    if (!veiculo) throw new Error('Veículo não encontrado');
  }
}
