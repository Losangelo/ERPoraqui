import { prisma } from '@/database/prisma.service';
import { CriarLicitacaoInput, AtualizarLicitacaoInput, LicitacaoFiltro } from './dto/licitacao.dto';

export class LicitacoesService {
  async criar(data: CriarLicitacaoInput, empresaId: string) {
    const numeroExiste = await prisma.licitacao.findUnique({
      where: { empresaId_numero: { empresaId, numero: data.numero } },
    });
    if (numeroExiste) throw new Error('Já existe uma licitação com este número');

    const { itens, ...dados } = data;

    return prisma.licitacao.create({
      data: {
        empresaId,
        numero: dados.numero,
        orgao: dados.orgao,
        descricao: dados.descricao,
        tipo: dados.tipo,
        dataAbertura: dados.dataAbertura,
        dataEncerramento: dados.dataEncerramento,
        valorEstimado: dados.valorEstimado,
        observacoes: dados.observacoes,
        itens: itens?.length
          ? { create: itens.map((i) => ({ produtoId: i.produtoId, quantidade: i.quantidade, valorUnitario: i.valorUnitario, marca: i.marca })) }
          : undefined,
      },
      include: { itens: { include: { produto: true } } },
    });
  }

  async listar(filtros: LicitacaoFiltro, empresaId: string) {
    const { pagina, limite, situacao, tipo, search } = filtros;
    const where: any = { empresaId };
    if (situacao) where.situacao = situacao;
    if (tipo) where.tipo = tipo;
    if (search) {
      where.OR = [
        { numero: { contains: search, mode: 'insensitive' } },
        { orgao: { contains: search, mode: 'insensitive' } },
        { descricao: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.licitacao.findMany({
        where,
        include: { itens: { include: { produto: true } } },
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { dataCriacao: 'desc' },
      }),
      prisma.licitacao.count({ where }),
    ]);

    return { data: items, meta: { total, pagina, limite, totalPaginas: Math.ceil(total / limite) } };
  }

  async buscarPorId(id: string, empresaId: string) {
    const licitacao = await prisma.licitacao.findFirst({
      where: { id, empresaId },
      include: { itens: { include: { produto: true } } },
    });
    if (!licitacao) throw new Error('Licitação não encontrada');
    return licitacao;
  }

  async atualizar(id: string, data: AtualizarLicitacaoInput, empresaId: string) {
    const licitacao = await prisma.licitacao.findFirst({ where: { id, empresaId } });
    if (!licitacao) throw new Error('Licitação não encontrada');
    if (licitacao.situacao === 'CANCELADA') throw new Error('Não é possível alterar uma licitação cancelada');

    return prisma.licitacao.update({
      where: { id },
      data: data as any,
      include: { itens: { include: { produto: true } } },
    });
  }

  async excluir(id: string, empresaId: string) {
    const licitacao = await prisma.licitacao.findFirst({ where: { id, empresaId } });
    if (!licitacao) throw new Error('Licitação não encontrada');

    await prisma.licitacaoItem.deleteMany({ where: { licitacaoId: id } });
    await prisma.licitacao.delete({ where: { id } });
    return { success: true };
  }

  async adicionarItem(licitacaoId: string, data: { produtoId: string; quantidade: number; valorUnitario: number; marca?: string }, empresaId: string) {
    const licitacao = await prisma.licitacao.findFirst({ where: { id: licitacaoId, empresaId } });
    if (!licitacao) throw new Error('Licitação não encontrada');

    return prisma.licitacaoItem.create({
      data: {
        licitacaoId,
        produtoId: data.produtoId,
        quantidade: data.quantidade,
        valorUnitario: data.valorUnitario,
        marca: data.marca,
      },
      include: { produto: true },
    });
  }

  async removerItem(licitacaoId: string, itemId: string, empresaId: string) {
    const licitacao = await prisma.licitacao.findFirst({ where: { id: licitacaoId, empresaId } });
    if (!licitacao) throw new Error('Licitação não encontrada');

    await prisma.licitacaoItem.delete({ where: { id: itemId } });
    return { success: true };
  }
}
