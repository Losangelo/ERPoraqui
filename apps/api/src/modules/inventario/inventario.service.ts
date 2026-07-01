
import { prisma } from '@/database/prisma.service';
import appLogger from '@/shared/logger/logger';
import { criarInventarioSchema, iniciarContagemSchema, conciliarItensSchema, ajustarDiferencaSchema, inventarioFiltroSchema, CriarInventarioInput, IniciarContagemInput, ConciliarItensInput, AjustarDiferencaInput, InventarioFiltro } from './dto/inventario.dto';

export class InventarioService {
  async criar(empresaId: string, data: CriarInventarioInput) {
    const parsed = criarInventarioSchema.parse(data);

    const filial = await prisma.filial.findFirst({
      where: { id: parsed.filialId, empresaId },
    });

    if (!filial) {
      throw new Error('Filial não encontrada');
    }

    const inventarioAberto = await prisma.inventario.findFirst({
      where: {
        filialId: parsed.filialId,
        situacao: { in: ['ABERTO', 'EM_CONFERENCIA'] },
      },
    });

    if (inventarioAberto) {
      throw new Error('Já existe um inventário aberto para esta filial');
    }

    const produtos = await prisma.produto.findMany({
      where: { empresaId, ativo: true },
    });

    const inventario = await prisma.inventario.create({
      data: {
        empresaId,
        filialId: parsed.filialId,
        dataInventario: parsed.dataInventario,
        tipo: parsed.tipo,
        situacao: 'ABERTO',
        observacoes: parsed.observacoes,
        itens: {
          create: produtos.map((produto) => ({
            produtoId: produto.id,
            quantidadeSistema: produto.quantidadeEstoque,
            quantidadeContada: null,
            diferenca: null,
            custoUnitario: produto.precoCusto,
            valorDiferenca: null,
            situacao: 'PENDENTE',
          })),
        },
      },
      include: {
        filial: true,
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });

    return inventario;
  }

  async buscarPorId(id: string, empresaId: string) {
    const inventario = await prisma.inventario.findFirst({
      where: { id, empresaId },
      include: {
        filial: true,
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });

    if (!inventario) {
      throw new Error('Inventário não encontrado');
    }

    return inventario;
  }

  async listar(empresaId: string, filtros: InventarioFiltro) {
    const parsed = filtros;

    const where: any = { empresaId };

    if (parsed.filialId) where.filialId = parsed.filialId;
    if (parsed.tipo) where.tipo = parsed.tipo;
    if (parsed.situacao) where.situacao = parsed.situacao;

    if (parsed.dataInicial || parsed.dataFinal) {
      where.dataInventario = {};
      if (parsed.dataInicial) where.dataInventario.gte = parsed.dataInicial;
      if (parsed.dataFinal) where.dataInventario.lte = parsed.dataFinal;
    }

    const skip = (parsed.pagina - 1) * parsed.limite;

    const [inventarios, total] = await Promise.all([
      prisma.inventario.findMany({
        where,
        skip,
        take: parsed.limite,
        orderBy: { dataInventario: 'desc' },
        include: {
          filial: true,
          _count: {
            select: { itens: true },
          },
        },
      }),
      prisma.inventario.count({ where }),
    ]);

    return {
      data: inventarios,
      meta: {
        total,
        pagina: parsed.pagina,
        limite: parsed.limite,
        totalPaginas: Math.ceil(total / parsed.limite),
      },
    };
  }

  async registrarContagem(inventarioId: string, data: IniciarContagemInput, empresaId: string) {
    const parsed = iniciarContagemSchema.parse(data);

    const inventario = await prisma.inventario.findFirst({
      where: { id: inventarioId, empresaId },
      include: { itens: true },
    });

    if (!inventario) {
      throw new Error('Inventário não encontrado');
    }

    if (inventario.situacao === 'CONCLUIDO') {
      throw new Error('Inventário já concluído');
    }

    if (inventario.situacao === 'CANCELADO') {
      throw new Error('Inventário cancelado');
    }

    const item = inventario.itens.find((i) => i.produtoId === parsed.produtoId);

    if (!item) {
      throw new Error('Produto não encontrado no inventário');
    }

    const diferenca = parsed.quantidadeContada - item.quantidadeSistema;
    const valorDiferenca = diferenca * item.custoUnitario;

    const itemAtualizado = await prisma.itemInventario.update({
      where: { id: item.id },
      data: {
        quantidadeContada: parsed.quantidadeContada,
        diferenca,
        valorDiferenca,
        situacao: 'CONTADO',
        observacoes: parsed.observacoes,
        dataContagem: new Date(),
      },
      include: {
        produto: true,
      },
    });

    await prisma.inventario.update({
      where: { id: inventarioId },
      data: { situacao: 'EM_CONFERENCIA' },
    });

    return itemAtualizado;
  }

  async conciliarItens(inventarioId: string, data: ConciliarItensInput, empresaId: string) {
    const parsed = conciliarItensSchema.parse(data);

    const inventario = await prisma.inventario.findFirst({
      where: { id: inventarioId, empresaId },
    });

    if (!inventario) {
      throw new Error('Inventário não encontrado');
    }

    if (inventario.situacao !== 'EM_CONFERENCIA') {
      throw new Error('Inventário deve estar em conferência para conciliar');
    }

    const itens = await prisma.itemInventario.findMany({
      where: {
        id: { in: parsed.itemIds },
        inventarioId,
      },
    });

    if (itens.length !== parsed.itemIds.length) {
      throw new Error('Alguns itens não foram encontrados');
    }

    if (parsed.ajustarEstoque) {
      for (const item of itens) {
        if (item.quantidadeContada !== null && item.diferenca !== 0) {
          await prisma.produto.update({
            where: { id: item.produtoId },
            data: {
              quantidadeEstoque: item.quantidadeContada,
            },
          });
        }

        await prisma.itemInventario.update({
          where: { id: item.id },
          data: {
            situacao: 'CONCILIADO',
            dataConciliacao: new Date(),
          },
        });
      }
    }

    const itensPendentes = await prisma.itemInventario.count({
      where: {
        inventarioId,
        situacao: { in: ['PENDENTE', 'CONTADO'] },
      },
    });

    if (itensPendentes === 0) {
      await prisma.inventario.update({
        where: { id: inventarioId },
        data: {
          situacao: 'CONCLUIDO',
          dataFechamento: new Date(),
        },
      });
    }

    return {
      message: `${itens.length} itens conciliados`,
      estoqueAdjustado: parsed.ajustarEstoque,
    };
  }

  async ajustarDiferenca(inventarioId: string, data: AjustarDiferencaInput, empresaId: string) {
    const parsed = ajustarDiferencaSchema.parse(data);

    const inventario = await prisma.inventario.findFirst({
      where: { id: inventarioId, empresaId },
    });

    if (!inventario) {
      throw new Error('Inventário não encontrado');
    }

    if (inventario.situacao === 'CONCLUIDO') {
      throw new Error('Inventário já concluído');
    }

    const item = await prisma.itemInventario.findFirst({
      where: {
        inventarioId,
        produtoId: parsed.produtoId,
      },
    });

    if (!item) {
      throw new Error('Produto não encontrado no inventário');
    }

    const diferenca = parsed.novaQuantidade - item.quantidadeSistema;

    await prisma.itemInventario.update({
      where: { id: item.id },
      data: {
        quantidadeContada: parsed.novaQuantidade,
        diferenca,
        valorDiferenca: diferenca * item.custoUnitario,
        situacao: 'AJUSTADO',
        observacoes: `Ajuste: ${parsed.justificativa}`,
        dataContagem: new Date(),
      },
    });

    await prisma.produto.update({
      where: { id: parsed.produtoId },
      data: {
        quantidadeEstoque: parsed.novaQuantidade,
      },
    });

    return {
      message: 'Estoque ajustado',
      produtoId: parsed.produtoId,
      quantidadeAnterior: item.quantidadeSistema,
      quantidadeNova: parsed.novaQuantidade,
      diferenca,
    };
  }

  async cancelar(inventarioId: string, empresaId: string) {
    const inventario = await prisma.inventario.findFirst({
      where: { id: inventarioId, empresaId },
    });

    if (!inventario) {
      throw new Error('Inventário não encontrado');
    }

    if (inventario.situacao === 'CONCLUIDO') {
      throw new Error('Inventário concluído não pode ser cancelado');
    }

    return prisma.inventario.update({
      where: { id: inventarioId },
      data: { situacao: 'CANCELADO' },
    });
  }

  async relatorioDivergencias(inventarioId: string, empresaId: string) {
    const inventario = await prisma.inventario.findFirst({
      where: { id: inventarioId, empresaId },
    });

    if (!inventario) {
      throw new Error('Inventário não encontrado');
    }

    const divergencias = await prisma.itemInventario.findMany({
      where: {
        inventarioId,
        diferenca: { not: 0 },
      },
      include: {
        produto: true,
      },
      orderBy: { diferenca: 'desc' },
    });

    const totalDivergencia = divergencias.reduce((acc, item) => {
      return acc + (item.valorDiferenca || 0);
    }, 0);

    const positivo = divergencias.filter((d) => d.diferenca! > 0);
    const negativo = divergencias.filter((d) => d.diferenca! < 0);

    return {
      inventario: {
        id: inventario.id,
        dataInventario: inventario.dataInventario,
        tipo: inventario.tipo,
        situacao: inventario.situacao,
      },
      totalItensDivergentes: divergencias.length,
      totalDivergenciaValor: totalDivergencia,
      itensAcima: positivo.map((d) => ({
        produto: d.produto.nome,
        quantidadeSistema: d.quantidadeSistema,
        quantidadeContada: d.quantidadeContada,
        diferenca: d.diferenca,
        valor: d.valorDiferenca,
      })),
      itensAbaixo: negativo.map((d) => ({
        produto: d.produto.nome,
        quantidadeSistema: d.quantidadeSistema,
        quantidadeContada: d.quantidadeContada,
        diferenca: d.diferenca,
        valor: d.valorDiferenca,
      })),
    };
  }
}
