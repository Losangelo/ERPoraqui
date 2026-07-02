import { prisma } from '@/database/prisma.service';
import { CriarContratoInput, AtualizarContratoInput, ContratoFiltro, CriarMedicaoInput } from './dto/contratos.dto';

export class ContratosService {
  async criar(data: CriarContratoInput, empresaId: string) {
    const numeroExiste = await prisma.contrato.findUnique({
      where: { empresaId_numero: { empresaId, numero: data.numero } },
    });
    if (numeroExiste) throw new Error('Já existe um contrato com este número');

    return prisma.contrato.create({
      data: {
        empresaId,
        clienteId: data.clienteId,
        numero: data.numero,
        descricao: data.descricao,
        dataInicio: data.dataInicio,
        dataFim: data.dataFim,
        valor: data.valor,
        tipoReajuste: data.tipoReajuste,
        periodicidade: data.periodicidade ?? 'MENSAL',
        observacoes: data.observacoes,
      },
      include: { cliente: true },
    });
  }

  async listar(filtros: ContratoFiltro, empresaId: string) {
    const { pagina, limite, status, clienteId, search } = filtros;
    const where: any = { empresaId };
    if (status) where.status = status;
    if (clienteId) where.clienteId = clienteId;
    if (search) {
      where.OR = [
        { numero: { contains: search, mode: 'insensitive' } },
        { descricao: { contains: search, mode: 'insensitive' } },
        { cliente: { nome: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.contrato.findMany({
        where,
        include: { cliente: true, medicoes: { orderBy: { periodo: 'desc' }, take: 3 } },
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { dataCriacao: 'desc' },
      }),
      prisma.contrato.count({ where }),
    ]);

    return { data: items, meta: { total, pagina, limite, totalPaginas: Math.ceil(total / limite) } };
  }

  async buscarPorId(id: string, empresaId: string) {
    const contrato = await prisma.contrato.findFirst({
      where: { id, empresaId },
      include: { cliente: true, medicoes: { orderBy: { periodo: 'desc' } } },
    });
    if (!contrato) throw new Error('Contrato não encontrado');
    return contrato;
  }

  async atualizar(id: string, data: AtualizarContratoInput, empresaId: string) {
    const contrato = await prisma.contrato.findFirst({ where: { id, empresaId } });
    if (!contrato) throw new Error('Contrato não encontrado');
    if (contrato.status === 'ENCERRADO') throw new Error('Não é possível alterar um contrato encerrado');

    return prisma.contrato.update({
      where: { id },
      data: data as any,
      include: { cliente: true },
    });
  }

  async ativar(id: string, empresaId: string) {
    const contrato = await prisma.contrato.findFirst({ where: { id, empresaId } });
    if (!contrato) throw new Error('Contrato não encontrado');
    if (contrato.status !== 'RASCUNHO') throw new Error('Apenas contratos em rascunho podem ser ativados');

    return prisma.contrato.update({
      where: { id },
      data: { status: 'ATIVO' },
      include: { cliente: true },
    });
  }

  async suspender(id: string, empresaId: string) {
    const contrato = await prisma.contrato.findFirst({ where: { id, empresaId } });
    if (!contrato) throw new Error('Contrato não encontrado');
    if (contrato.status !== 'ATIVO') throw new Error('Apenas contratos ativos podem ser suspensos');

    return prisma.contrato.update({
      where: { id },
      data: { status: 'SUSPENSO' },
      include: { cliente: true },
    });
  }

  async encerrar(id: string, empresaId: string) {
    const contrato = await prisma.contrato.findFirst({ where: { id, empresaId } });
    if (!contrato) throw new Error('Contrato não encontrado');
    if (contrato.status === 'ENCERRADO') throw new Error('Contrato já está encerrado');

    return prisma.contrato.update({
      where: { id },
      data: { status: 'ENCERRADO' },
      include: { cliente: true },
    });
  }

  async excluir(id: string, empresaId: string) {
    const contrato = await prisma.contrato.findFirst({ where: { id, empresaId } });
    if (!contrato) throw new Error('Contrato não encontrado');
    if (contrato.status !== 'RASCUNHO') throw new Error('Apenas contratos em rascunho podem ser excluídos');

    await prisma.contratoMedicao.deleteMany({ where: { contratoId: id } });
    await prisma.contrato.delete({ where: { id } });
    return { success: true };
  }

  async listarMedicoes(contratoId: string, empresaId: string) {
    const contrato = await prisma.contrato.findFirst({ where: { id: contratoId, empresaId } });
    if (!contrato) throw new Error('Contrato não encontrado');

    return prisma.contratoMedicao.findMany({
      where: { contratoId },
      orderBy: { periodo: 'desc' },
    });
  }

  async criarMedicao(contratoId: string, data: CriarMedicaoInput, empresaId: string) {
    const contrato = await prisma.contrato.findFirst({ where: { id: contratoId, empresaId } });
    if (!contrato) throw new Error('Contrato não encontrado');
    if (contrato.status !== 'ATIVO') throw new Error('Apenas contratos ativos podem receber medições');

    const existe = await prisma.contratoMedicao.findFirst({
      where: { contratoId, periodo: data.periodo },
    });
    if (existe) throw new Error('Já existe medição para este período');

    return prisma.contratoMedicao.create({
      data: {
        contratoId,
        periodo: data.periodo,
        valor: data.valor,
        dataVencimento: data.dataVencimento,
      },
    });
  }

  async faturarMedicao(contratoId: string, medicaoId: string, empresaId: string) {
    const contrato = await prisma.contrato.findFirst({ where: { id: contratoId, empresaId } });
    if (!contrato) throw new Error('Contrato não encontrado');

    const medicao = await prisma.contratoMedicao.findFirst({
      where: { id: medicaoId, contratoId },
    });
    if (!medicao) throw new Error('Medição não encontrada');
    if (medicao.status !== 'PENDENTE') throw new Error('Medição já foi faturada ou cancelada');

    return prisma.contratoMedicao.update({
      where: { id: medicaoId },
      data: { status: 'FATURADO' },
    });
  }
}
