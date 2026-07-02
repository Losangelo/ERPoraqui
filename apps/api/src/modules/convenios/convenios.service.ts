import { prisma } from '@/database/prisma.service';
import { CriarConvenioInput, AtualizarConvenioInput, ConvenioFiltro } from './dto/convenios.dto';

export class ConveniosService {
  async criar(data: CriarConvenioInput, empresaId: string) {
    const numeroExiste = await prisma.convenio.findUnique({
      where: { empresaId_numero: { empresaId, numero: data.numero } },
    });
    if (numeroExiste) throw new Error('Já existe um convênio com este número');

    return prisma.convenio.create({
      data: {
        empresaId,
        clienteId: data.clienteId,
        numero: data.numero,
        descricao: data.descricao,
        dataInicio: data.dataInicio,
        dataFim: data.dataFim,
        valorTotal: data.valorTotal,
        observacoes: data.observacoes,
      },
      include: { cliente: true },
    });
  }

  async listar(filtros: ConvenioFiltro, empresaId: string) {
    const { pagina, limite, situacao, clienteId, search } = filtros;
    const where: any = { empresaId };
    if (situacao) where.situacao = situacao;
    if (clienteId) where.clienteId = clienteId;
    if (search) {
      where.OR = [
        { numero: { contains: search, mode: 'insensitive' } },
        { descricao: { contains: search, mode: 'insensitive' } },
        { cliente: { nome: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.convenio.findMany({
        where,
        include: { cliente: true },
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { dataCriacao: 'desc' },
      }),
      prisma.convenio.count({ where }),
    ]);

    return { data: items, meta: { total, pagina, limite, totalPaginas: Math.ceil(total / limite) } };
  }

  async buscarPorId(id: string, empresaId: string) {
    const convenio = await prisma.convenio.findFirst({
      where: { id, empresaId },
      include: { cliente: true },
    });
    if (!convenio) throw new Error('Convênio não encontrado');
    return convenio;
  }

  async atualizar(id: string, data: AtualizarConvenioInput, empresaId: string) {
    const convenio = await prisma.convenio.findFirst({ where: { id, empresaId } });
    if (!convenio) throw new Error('Convênio não encontrado');
    if (convenio.situacao === 'ENCERRADO') throw new Error('Não é possível alterar um convênio encerrado');

    return prisma.convenio.update({
      where: { id },
      data: data as any,
      include: { cliente: true },
    });
  }

  async ativar(id: string, empresaId: string) {
    const convenio = await prisma.convenio.findFirst({ where: { id, empresaId } });
    if (!convenio) throw new Error('Convênio não encontrado');
    if (convenio.situacao !== 'SUSPENSO') throw new Error('Apenas convênios suspensos podem ser reativados');

    return prisma.convenio.update({
      where: { id },
      data: { situacao: 'ATIVO' },
      include: { cliente: true },
    });
  }

  async suspender(id: string, empresaId: string) {
    const convenio = await prisma.convenio.findFirst({ where: { id, empresaId } });
    if (!convenio) throw new Error('Convênio não encontrado');
    if (convenio.situacao !== 'ATIVO') throw new Error('Apenas convênios ativos podem ser suspensos');

    return prisma.convenio.update({
      where: { id },
      data: { situacao: 'SUSPENSO' },
      include: { cliente: true },
    });
  }

  async encerrar(id: string, empresaId: string) {
    const convenio = await prisma.convenio.findFirst({ where: { id, empresaId } });
    if (!convenio) throw new Error('Convênio não encontrado');
    if (convenio.situacao === 'ENCERRADO') throw new Error('Convênio já está encerrado');

    return prisma.convenio.update({
      where: { id },
      data: { situacao: 'ENCERRADO' },
      include: { cliente: true },
    });
  }

  async excluir(id: string, empresaId: string) {
    const convenio = await prisma.convenio.findFirst({ where: { id, empresaId } });
    if (!convenio) throw new Error('Convênio não encontrado');

    await prisma.convenio.delete({ where: { id } });
    return { success: true };
  }
}
