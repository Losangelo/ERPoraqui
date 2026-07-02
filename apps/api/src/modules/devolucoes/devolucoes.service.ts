import { prisma } from '@/database/prisma.service';
import { CriarDevolucaoInput, AtualizarDevolucaoInput, DevolucaoFiltro } from './dto/devolucoes.dto';

export class DevolucoesService {
  async criar(data: CriarDevolucaoInput, empresaId: string) {
    const numeroExiste = await prisma.devolucao.findUnique({
      where: { empresaId_numero: { empresaId, numero: data.numero } },
    });
    if (numeroExiste) throw new Error('Já existe uma devolução com este número');

    const { itens, ...devolucaoData } = data;

    return prisma.devolucao.create({
      data: {
        empresaId,
        clienteId: devolucaoData.clienteId,
        pedidoVendaId: devolucaoData.pedidoVendaId,
        numero: devolucaoData.numero,
        motivo: devolucaoData.motivo,
        observacoes: devolucaoData.observacoes,
        itens: {
          create: itens.map((item) => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            valor: item.valor,
            condicao: item.condicao,
            numeroSerie: item.numeroSerie,
          })),
        },
      },
      include: { cliente: true, itens: { include: { produto: true } } },
    });
  }

  async listar(filtros: DevolucaoFiltro, empresaId: string) {
    const { pagina, limite, status, motivo, clienteId, search } = filtros;
    const where: any = { empresaId };
    if (status) where.status = status;
    if (motivo) where.motivo = motivo;
    if (clienteId) where.clienteId = clienteId;
    if (search) {
      where.OR = [
        { numero: { contains: search, mode: 'insensitive' } },
        { cliente: { nome: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.devolucao.findMany({
        where,
        include: {
          cliente: true,
          itens: { include: { produto: true } },
        },
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { dataCriacao: 'desc' },
      }),
      prisma.devolucao.count({ where }),
    ]);

    return { data: items, meta: { total, pagina, limite, totalPaginas: Math.ceil(total / limite) } };
  }

  async buscarPorId(id: string, empresaId: string) {
    const devolucao = await prisma.devolucao.findFirst({
      where: { id, empresaId },
      include: {
        cliente: true,
        pedidoVenda: true,
        itens: { include: { produto: true } },
      },
    });
    if (!devolucao) throw new Error('Devolução não encontrada');
    return devolucao;
  }

  async atualizar(id: string, data: AtualizarDevolucaoInput, empresaId: string) {
    const devolucao = await prisma.devolucao.findFirst({ where: { id, empresaId } });
    if (!devolucao) throw new Error('Devolução não encontrada');
    if (devolucao.status === 'DESTINADO' || devolucao.status === 'CANCELADO') {
      throw new Error('Não é possível alterar uma devolução destinada ou cancelada');
    }

    return prisma.devolucao.update({
      where: { id },
      data: data as any,
      include: { cliente: true, itens: { include: { produto: true } } },
    });
  }

  async aprovarInspecao(id: string, empresaId: string) {
    const devolucao = await prisma.devolucao.findFirst({ where: { id, empresaId } });
    if (!devolucao) throw new Error('Devolução não encontrada');
    if (devolucao.status !== 'INSPECAO') throw new Error('Devolução não está em inspeção');

    return prisma.devolucao.update({
      where: { id },
      data: { status: 'APROVADO' },
      include: { cliente: true, itens: { include: { produto: true } } },
    });
  }

  async rejeitar(id: string, empresaId: string, motivo?: string) {
    const devolucao = await prisma.devolucao.findFirst({ where: { id, empresaId } });
    if (!devolucao) throw new Error('Devolução não encontrada');
    if (devolucao.status === 'DESTINADO' || devolucao.status === 'CANCELADO') {
      throw new Error('Devolução já foi finalizada');
    }

    return prisma.devolucao.update({
      where: { id },
      data: { status: 'REJEITADO', laudoTecnico: motivo },
    });
  }

  async destinar(id: string, empresaId: string, destino: string) {
    const devolucao = await prisma.devolucao.findFirst({ where: { id, empresaId } });
    if (!devolucao) throw new Error('Devolução não encontrada');
    if (devolucao.status !== 'APROVADO') throw new Error('Devolução precisa ser aprovada antes de destinar');

    const destinoValido = ['REPARO', 'SUBSTITUICAO', 'CREDITO', 'DESCARTE'];
    if (!destinoValido.includes(destino)) throw new Error('Destino inválido');

    return prisma.devolucao.update({
      where: { id },
      data: { status: 'DESTINADO', destino: destino as any },
      include: { cliente: true, itens: { include: { produto: true } } },
    });
  }

  async excluir(id: string, empresaId: string) {
    const devolucao = await prisma.devolucao.findFirst({ where: { id, empresaId } });
    if (!devolucao) throw new Error('Devolução não encontrada');
    if (devolucao.status !== 'SOLICITACAO') throw new Error('Apenas devoluções em solicitação podem ser excluídas');

    await prisma.devolucaoItem.deleteMany({ where: { devolucaoId: id } });
    await prisma.devolucao.delete({ where: { id } });
    return { success: true };
  }
}
