import { prisma } from '@/database/prisma.service';

export class PlanoContasService {
  async listar(empresaId: string) {
    return prisma.planoConta.findMany({
      where: { empresaId, ativo: true },
      orderBy: [{ nivel: 'asc' }, { codigo: 'asc' }],
      include: {
        contaPai: {
          select: { id: true, codigo: true, nome: true },
        },
      },
    });
  }

  async buscarPorId(id: string, empresaId: string) {
    const conta = await prisma.planoConta.findFirst({
      where: { id, empresaId },
      include: {
        contaPai: true,
        subcontas: {
          where: { ativo: true },
          orderBy: { codigo: 'asc' },
        },
      },
    });

    if (!conta) throw new Error('Conta não encontrada');
    return conta;
  }

  async criar(data: {
    codigo: string;
    nome: string;
    tipo: 'SINTETICA' | 'ANALITICA';
    natureza: 'CREDORA' | 'DEVEDORA';
    contaPaiId?: string;
  }, empresaId: string) {
    const nivel = data.contaPaiId 
      ? await this.getNivelContaPai(data.contaPaiId) + 1 
      : 1;

    const conta = await prisma.planoConta.create({
      data: {
        empresaId,
        codigo: data.codigo,
        nome: data.nome,
        tipo: data.tipo,
        natureza: data.natureza,
        nivel,
        contaPaiId: data.contaPaiId || null,
      },
    });

    return conta;
  }

  async atualizar(id: string, data: {
    nome?: string;
    natureza?: 'CREDORA' | 'DEVEDORA';
    ativo?: boolean;
  }, empresaId: string) {
    const conta = await prisma.planoConta.findFirst({
      where: { id, empresaId },
    });

    if (!conta) throw new Error('Conta não encontrada');

    return prisma.planoConta.update({
      where: { id },
      data: {
        nome: data.nome,
        natureza: data.natureza,
        ativo: data.ativo,
      },
    });
  }

  async excluir(id: string, empresaId: string) {
    const conta = await prisma.planoConta.findFirst({
      where: { id, empresaId },
      include: { subcontas: { where: { ativo: true } } },
    });

    if (!conta) throw new Error('Conta não encontrada');

    if (conta.subcontas.length > 0) {
      throw new Error('Não é possível excluir conta que possui subcontas');
    }

    const hasLancamentos = await prisma.lancamentoContabil.count({
      where: { planoContaId: id },
    });

    if (hasLancamentos > 0) {
      return prisma.planoConta.update({
        where: { id },
        data: { ativo: false },
      });
    }

    return prisma.planoConta.delete({ where: { id } });
  }

  async listarArvore(empresaId: string) {
    const contas = await prisma.planoConta.findMany({
      where: { empresaId, ativo: true },
      orderBy: [{ nivel: 'asc' }, { codigo: 'asc' }],
      include: {
        subcontas: {
          where: { ativo: true },
          include: {
            subcontas: {
              where: { ativo: true },
              include: {
                subcontas: { where: { ativo: true } },
              },
            },
          },
        },
      },
    });

    return contas.filter(c => !c.contaPaiId);
  }

  private async getNivelContaPai(contaPaiId: string): Promise<number> {
    const conta = await prisma.planoConta.findUnique({
      where: { id: contaPaiId },
      select: { nivel: true },
    });
    return conta?.nivel || 0;
  }
}

export default new PlanoContasService();
