import { prisma } from '@/database/prisma.service';
import {
  CriarTaxaEntregaInput,
  AtualizarTaxaEntregaInput,
  TaxaEntregaFiltro,
  CalcularTaxaInput,
} from './dto/taxa-entrega.dto';

export class TaxasEntregaService {
  async criar(empresaId: string, dados: CriarTaxaEntregaInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    return prisma.taxaEntrega.create({
      data: {
        descricao: dados.descricao,
        tipo: dados.tipo,
        valor: dados.valor,
        raioKm: dados.raioKm,
        cepInicio: dados.cepInicio,
        cepFim: dados.cepFim,
        valorMinimoPedido: dados.valorMinimoPedido,
        empresaId,
      },
    });
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.taxaEntrega.findFirst({
      where: { id, empresaId },
    });
  }

  async listar(empresaId: string, filtros: TaxaEntregaFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const { descricao, tipo, ativo, pagina, limite } = filtros;

    const where = {
      empresaId,
      ...(descricao && { descricao: { contains: descricao, mode: 'insensitive' as const } }),
      ...(tipo && { tipo }),
      ...(ativo !== undefined && { ativo }),
    };

    const [dados, total] = await Promise.all([
      prisma.taxaEntrega.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { descricao: 'asc' },
      }),
      prisma.taxaEntrega.count({ where }),
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

  async atualizar(id: string, empresaId: string, dados: AtualizarTaxaEntregaInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    return prisma.taxaEntrega.update({
      where: { id },
      data: {
        ...(dados.descricao !== undefined && { descricao: dados.descricao }),
        ...(dados.tipo !== undefined && { tipo: dados.tipo }),
        ...(dados.valor !== undefined && { valor: dados.valor }),
        ...(dados.raioKm !== undefined && { raioKm: dados.raioKm }),
        ...(dados.cepInicio !== undefined && { cepInicio: dados.cepInicio }),
        ...(dados.cepFim !== undefined && { cepFim: dados.cepFim }),
        ...(dados.valorMinimoPedido !== undefined && { valorMinimoPedido: dados.valorMinimoPedido }),
      },
    });
  }

  async inativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    return prisma.taxaEntrega.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async ativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    return prisma.taxaEntrega.update({
      where: { id },
      data: { ativo: true },
    });
  }

  async calcular(empresaId: string, dados: CalcularTaxaInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const { cep, valorPedido } = dados;

    const taxasAtivas = await prisma.taxaEntrega.findMany({
      where: { empresaId, ativo: true },
      orderBy: { valor: 'asc' },
    });

    if (taxasAtivas.length === 0) {
      throw new Error('Nenhuma taxa de entrega ativa encontrada');
    }

    let taxaSelecionada = taxasAtivas.find(t => t.tipo === 'FIXA');

    if (cep) {
      const cepNumerico = cep.replace(/\D/g, '');

      const taxaPorCep = taxasAtivas.find(t => {
        if (t.tipo !== 'POR_CEP') return false;
        if (!t.cepInicio || !t.cepFim) return false;

        const cepInicioNum = parseInt(t.cepInicio.replace(/\D/g, ''), 10);
        const cepFimNum = parseInt(t.cepFim.replace(/\D/g, ''), 10);
        const cepNum = parseInt(cepNumerico, 10);

        return cepNum >= cepInicioNum && cepNum <= cepFimNum;
      });

      if (taxaPorCep) {
        taxaSelecionada = taxaPorCep;
      }
    }

    if (!taxaSelecionada) {
      throw new Error('Nenhuma taxa de entrega aplicável encontrada');
    }

    if (taxaSelecionada.valorMinimoPedido && valorPedido < taxaSelecionada.valorMinimoPedido) {
      throw new Error(
        `Valor mínimo do pedido não atingido. Mínimo: R$ ${taxaSelecionada.valorMinimoPedido.toFixed(2)}`
      );
    }

    return {
      taxaId: taxaSelecionada.id,
      valor: taxaSelecionada.valor,
      descricao: taxaSelecionada.descricao,
    };
  }

  private async verificarProprietario(id: string, empresaId: string) {
    const taxa = await prisma.taxaEntrega.findFirst({
      where: { id, empresaId },
    });

    if (!taxa) {
      throw new Error('Taxa de entrega não encontrada');
    }
  }
}
