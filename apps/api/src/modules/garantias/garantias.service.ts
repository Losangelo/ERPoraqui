import { prisma } from '@/database/prisma.service';
import { CriarGarantiaInput, AtualizarGarantiaInput, GarantiaFiltro, CriarGarantiaRegraInput, AtualizarGarantiaRegraInput } from './dto/garantias.dto';

export class GarantiasService {
  async criar(data: CriarGarantiaInput, empresaId: string) {
    const numeroExiste = await prisma.garantia.findUnique({
      where: { empresaId_numero: { empresaId, numero: data.numero } },
    });
    if (numeroExiste) throw new Error('Já existe uma garantia com este número');

    const dataFim = new Date(data.dataInicio);
    dataFim.setDate(dataFim.getDate() + data.prazoDias);

    return prisma.garantia.create({
      data: {
        empresaId,
        clienteId: data.clienteId,
        produtoId: data.produtoId,
        vendaId: data.vendaId,
        numero: data.numero,
        tipo: data.tipo ?? 'FABRICA',
        prazoDias: data.prazoDias,
        dataInicio: data.dataInicio,
        dataFim,
        cobertura: data.cobertura,
        observacoes: data.observacoes,
      },
      include: { cliente: true, produto: true },
    });
  }

  async listar(filtros: GarantiaFiltro, empresaId: string) {
    const { pagina, limite, status, tipo, clienteId, produtoId, search } = filtros;
    const where: any = { empresaId };
    if (status) where.status = status;
    if (tipo) where.tipo = tipo;
    if (clienteId) where.clienteId = clienteId;
    if (produtoId) where.produtoId = produtoId;
    if (search) {
      where.OR = [
        { numero: { contains: search, mode: 'insensitive' } },
        { cliente: { nome: { contains: search, mode: 'insensitive' } } },
        { produto: { nome: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.garantia.findMany({
        where,
        include: { cliente: true, produto: true },
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { dataCriacao: 'desc' },
      }),
      prisma.garantia.count({ where }),
    ]);

    return { data: items, meta: { total, pagina, limite, totalPaginas: Math.ceil(total / limite) } };
  }

  async buscarPorId(id: string, empresaId: string) {
    const garantia = await prisma.garantia.findFirst({
      where: { id, empresaId },
      include: { cliente: true, produto: true },
    });
    if (!garantia) throw new Error('Garantia não encontrada');
    return garantia;
  }

  async atualizar(id: string, data: AtualizarGarantiaInput, empresaId: string) {
    const garantia = await prisma.garantia.findFirst({ where: { id, empresaId } });
    if (!garantia) throw new Error('Garantia não encontrada');
    if (garantia.status === 'CANCELADA') throw new Error('Não é possível alterar uma garantia cancelada');

    return prisma.garantia.update({
      where: { id },
      data: data as any,
      include: { cliente: true, produto: true },
    });
  }

  async excluir(id: string, empresaId: string) {
    const garantia = await prisma.garantia.findFirst({ where: { id, empresaId } });
    if (!garantia) throw new Error('Garantia não encontrada');

    await prisma.garantia.delete({ where: { id } });
    return { success: true };
  }

  async verificarElegibilidade(produtoId: string, clienteId: string, empresaId: string) {
    const garantias = await prisma.garantia.findMany({
      where: {
        empresaId,
        clienteId,
        produtoId,
        status: 'ATIVA',
        dataFim: { gte: new Date() },
      },
    });

    if (garantias.length > 0) {
      return { elegivel: true, garantia: garantias[0] };
    }

    const regra = await prisma.garantiaRegra.findFirst({
      where: {
        empresaId,
        ativo: true,
        OR: [
          { produtoId },
          { produtoId: null, categoriaId: null },
        ],
      },
      orderBy: { produtoId: 'desc' },
    });

    if (regra) {
      return { elegivel: true, regra };
    }

    return { elegivel: false, motivo: 'Nenhuma garantia vigente ou regra aplicável encontrada' };
  }

  // Regras
  async listarRegras(empresaId: string) {
    return prisma.garantiaRegra.findMany({
      where: { empresaId },
      orderBy: { dataCriacao: 'desc' },
    });
  }

  async criarRegra(data: CriarGarantiaRegraInput, empresaId: string) {
    if (!data.produtoId && !data.categoriaId) {
      throw new Error('Defina um produto ou uma categoria para a regra');
    }

    return prisma.garantiaRegra.create({
      data: {
        empresaId,
        produtoId: data.produtoId,
        categoriaId: data.categoriaId,
        prazoDias: data.prazoDias,
        tipo: data.tipo ?? 'FABRICA',
        cobertura: data.cobertura,
        termos: data.termos,
        ativo: data.ativo ?? true,
      },
    });
  }

  async atualizarRegra(id: string, data: AtualizarGarantiaRegraInput, empresaId: string) {
    const regra = await prisma.garantiaRegra.findFirst({ where: { id, empresaId } });
    if (!regra) throw new Error('Regra não encontrada');

    return prisma.garantiaRegra.update({
      where: { id },
      data: data as any,
    });
  }

  async excluirRegra(id: string, empresaId: string) {
    const regra = await prisma.garantiaRegra.findFirst({ where: { id, empresaId } });
    if (!regra) throw new Error('Regra não encontrada');

    await prisma.garantiaRegra.delete({ where: { id } });
    return { success: true };
  }
}
