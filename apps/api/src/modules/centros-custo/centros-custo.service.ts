import { prisma } from '@/database/prisma.service';
import {
  criarCentroCustoSchema,
  atualizarCentroCustoSchema,
  CriarCentroCustoInput,
  AtualizarCentroCustoInput,
} from './dto/centro-custo.dto';

export class CentrosCustoService {
  async criar(data: CriarCentroCustoInput, empresaId: string) {
    const parsed = criarCentroCustoSchema.parse(data);

    if (parsed.centroPaiId) {
      const centroPai = await prisma.centroCusto.findFirst({
        where: { id: parsed.centroPaiId, empresaId },
      });

      if (!centroPai) {
        throw new Error('Centro de custo pai não encontrado');
      }
    }

    return prisma.centroCusto.create({
      data: {
        empresaId,
        codigo: parsed.codigo,
        nome: parsed.nome,
        descricao: parsed.descricao || null,
        centroPaiId: parsed.centroPaiId || null,
      },
      include: {
        centroPai: { select: { id: true, codigo: true, nome: true } },
      },
    });
  }

  async listar(empresaId: string) {
    return prisma.centroCusto.findMany({
      where: { empresaId },
      orderBy: { codigo: 'asc' },
      include: {
        centroPai: { select: { id: true, codigo: true, nome: true } },
        _count: { select: { subcentros: true, contasPagar: true, contasReceber: true } },
      },
    });
  }

  async buscarPorId(id: string, empresaId: string) {
    const centro = await prisma.centroCusto.findFirst({
      where: { id, empresaId },
      include: {
        centroPai: { select: { id: true, codigo: true, nome: true } },
        subcentros: {
          where: { ativo: true },
          orderBy: { codigo: 'asc' },
          select: { id: true, codigo: true, nome: true, descricao: true, ativo: true },
        },
      },
    });

    if (!centro) {
      throw new Error('Centro de custo não encontrado');
    }

    return centro;
  }

  async atualizar(id: string, data: AtualizarCentroCustoInput, empresaId: string) {
    const parsed = atualizarCentroCustoSchema.parse(data);

    const centro = await prisma.centroCusto.findFirst({
      where: { id, empresaId },
    });

    if (!centro) {
      throw new Error('Centro de custo não encontrado');
    }

    if (parsed.centroPaiId && parsed.centroPaiId === id) {
      throw new Error('Um centro de custo não pode ser pai de si mesmo');
    }

    if (parsed.centroPaiId) {
      const centroPai = await prisma.centroCusto.findFirst({
        where: { id: parsed.centroPaiId, empresaId },
      });

      if (!centroPai) {
        throw new Error('Centro de custo pai não encontrado');
      }
    }

    return prisma.centroCusto.update({
      where: { id },
      data: {
        codigo: parsed.codigo || centro.codigo,
        nome: parsed.nome || centro.nome,
        descricao: parsed.descricao !== undefined ? parsed.descricao : centro.descricao,
        centroPaiId: parsed.centroPaiId !== undefined ? parsed.centroPaiId : centro.centroPaiId,
        ativo: parsed.ativo !== undefined ? parsed.ativo : centro.ativo,
      },
      include: {
        centroPai: { select: { id: true, codigo: true, nome: true } },
      },
    });
  }

  async excluir(id: string, empresaId: string) {
    const centro = await prisma.centroCusto.findFirst({
      where: { id, empresaId },
      include: {
        _count: { select: { subcentros: true, contasPagar: true, contasReceber: true } },
      },
    });

    if (!centro) {
      throw new Error('Centro de custo não encontrado');
    }

    return prisma.centroCusto.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async arvore(empresaId: string) {
    const todos = await prisma.centroCusto.findMany({
      where: { empresaId },
      orderBy: { codigo: 'asc' },
    });

    const montarArvore = (paiId: string | null): any[] => {
      return todos
        .filter(c => c.centroPaiId === paiId)
        .map(c => ({
          ...c,
          subcentros: montarArvore(c.id),
        }));
    };

    return montarArvore(null);
  }
}
