import { prisma } from '@/database/prisma.service';
import {
  criarChequeSchema,
  atualizarChequeSchema,
  devolverChequeSchema,
  chequeFiltroSchema,
  CriarChequeInput,
  AtualizarChequeInput,
  DevolverChequeInput,
  ChequeFiltro,
} from './dto/cheque.dto';

export class ChequesService {
  async criar(data: CriarChequeInput, empresaId: string) {
    const parsed = criarChequeSchema.parse(data);

    return prisma.cheque.create({
      data: {
        empresaId,
        contaBancariaId: parsed.contaBancariaId || null,
        clienteId: parsed.clienteId || null,
        fornecedorId: parsed.fornecedorId || null,
        numero: parsed.numero,
        banco: parsed.banco,
        agencia: parsed.agencia,
        conta: parsed.conta,
        emitente: parsed.emitente,
        valor: parsed.valor,
        dataEmissao: parsed.dataEmissao,
        dataVencimento: parsed.dataVencimento,
        tipo: parsed.tipo,
        observacoes: parsed.observacoes,
      },
      include: {
        cliente: { select: { id: true, nome: true, documento: true } },
        fornecedor: { select: { id: true, nome: true, documento: true } },
        contaBancaria: { select: { id: true, banco: true, agencia: true, conta: true } },
      },
    });
  }

  async listar(filtros: ChequeFiltro, empresaId: string) {
    const parsed = chequeFiltroSchema.parse(filtros);

    const where: any = { empresaId };

    if (parsed.tipo) where.tipo = parsed.tipo;
    if (parsed.situacao) where.situacao = parsed.situacao;
    if (parsed.clienteId) where.clienteId = parsed.clienteId;
    if (parsed.fornecedorId) where.fornecedorId = parsed.fornecedorId;

    if (parsed.dataInicial || parsed.dataFinal) {
      where.dataVencimento = {};
      if (parsed.dataInicial) where.dataVencimento.gte = parsed.dataInicial;
      if (parsed.dataFinal) where.dataVencimento.lte = parsed.dataFinal;
    }

    const skip = (parsed.pagina - 1) * parsed.limite;

    const [dados, total] = await Promise.all([
      prisma.cheque.findMany({
        where,
        skip,
        take: parsed.limite,
        orderBy: { dataVencimento: 'asc' },
        include: {
          cliente: { select: { id: true, nome: true, documento: true } },
          fornecedor: { select: { id: true, nome: true, documento: true } },
          contaBancaria: { select: { id: true, banco: true, agencia: true, conta: true } },
        },
      }),
      prisma.cheque.count({ where }),
    ]);

    return {
      data: dados,
      meta: {
        total,
        pagina: parsed.pagina,
        limite: parsed.limite,
        totalPaginas: Math.ceil(total / parsed.limite),
      },
    };
  }

  async buscarPorId(id: string, empresaId: string) {
    const cheque = await prisma.cheque.findFirst({
      where: { id, empresaId },
      include: {
        cliente: { select: { id: true, nome: true, documento: true } },
        fornecedor: { select: { id: true, nome: true, documento: true } },
        contaBancaria: { select: { id: true, banco: true, agencia: true, conta: true } },
      },
    });

    if (!cheque) {
      throw new Error('Cheque não encontrado');
    }

    return cheque;
  }

  async atualizar(id: string, data: AtualizarChequeInput, empresaId: string) {
    const parsed = atualizarChequeSchema.parse(data);

    const cheque = await prisma.cheque.findFirst({
      where: { id, empresaId },
    });

    if (!cheque) {
      throw new Error('Cheque não encontrado');
    }

    if (cheque.situacao === 'CANCELADO') {
      throw new Error('Não é possível alterar um cheque cancelado');
    }

    return prisma.cheque.update({
      where: { id },
      data: {
        numero: parsed.numero || cheque.numero,
        banco: parsed.banco || cheque.banco,
        agencia: parsed.agencia || cheque.agencia,
        conta: parsed.conta || cheque.conta,
        emitente: parsed.emitente || cheque.emitente,
        valor: parsed.valor || cheque.valor,
        dataEmissao: parsed.dataEmissao ? new Date(parsed.dataEmissao) : cheque.dataEmissao,
        dataVencimento: parsed.dataVencimento ? new Date(parsed.dataVencimento) : cheque.dataVencimento,
        observacoes: parsed.observacoes !== undefined ? parsed.observacoes : cheque.observacoes,
      },
      include: {
        cliente: { select: { id: true, nome: true, documento: true } },
        fornecedor: { select: { id: true, nome: true, documento: true } },
        contaBancaria: { select: { id: true, banco: true, agencia: true, conta: true } },
      },
    });
  }

  async depositar(id: string, empresaId: string) {
    const cheque = await prisma.cheque.findFirst({
      where: { id, empresaId },
    });

    if (!cheque) {
      throw new Error('Cheque não encontrado');
    }

    if (cheque.situacao !== 'EM_CARTEIRA') {
      throw new Error('Apenas cheques em carteira podem ser depositados');
    }

    return prisma.cheque.update({
      where: { id },
      data: { situacao: 'DEPOSITADO' },
    });
  }

  async compensar(id: string, empresaId: string) {
    const cheque = await prisma.cheque.findFirst({
      where: { id, empresaId },
    });

    if (!cheque) {
      throw new Error('Cheque não encontrado');
    }

    if (cheque.situacao !== 'DEPOSITADO') {
      throw new Error('Apenas cheques depositados podem ser compensados');
    }

    return prisma.cheque.update({
      where: { id },
      data: {
        situacao: 'COMPENSADO',
        dataCompensacao: new Date(),
      },
    });
  }

  async devolver(id: string, data: DevolverChequeInput, empresaId: string) {
    const parsed = devolverChequeSchema.parse(data);

    const cheque = await prisma.cheque.findFirst({
      where: { id, empresaId },
    });

    if (!cheque) {
      throw new Error('Cheque não encontrado');
    }

    if (cheque.situacao === 'COMPENSADO') {
      throw new Error('Não é possível devolver um cheque já compensado');
    }

    if (cheque.situacao === 'CANCELADO') {
      throw new Error('Não é possível devolver um cheque cancelado');
    }

    return prisma.cheque.update({
      where: { id },
      data: {
        situacao: 'DEVOLVIDO',
        motivoDevolucao: parsed.motivoDevolucao,
      },
    });
  }

  async cancelar(id: string, empresaId: string) {
    const cheque = await prisma.cheque.findFirst({
      where: { id, empresaId },
    });

    if (!cheque) {
      throw new Error('Cheque não encontrado');
    }

    if (cheque.situacao === 'COMPENSADO') {
      throw new Error('Não é possível cancelar um cheque já compensado');
    }

    return prisma.cheque.update({
      where: { id },
      data: { situacao: 'CANCELADO' },
    });
  }

  async dashboard(empresaId: string) {
    const [emCarteira, depositado, devolvido, compensado] = await Promise.all([
      prisma.cheque.aggregate({
        where: { empresaId, situacao: 'EM_CARTEIRA' },
        _sum: { valor: true },
        _count: true,
      }),
      prisma.cheque.aggregate({
        where: { empresaId, situacao: 'DEPOSITADO' },
        _sum: { valor: true },
        _count: true,
      }),
      prisma.cheque.aggregate({
        where: { empresaId, situacao: 'DEVOLVIDO' },
        _sum: { valor: true },
        _count: true,
      }),
      prisma.cheque.aggregate({
        where: { empresaId, situacao: 'COMPENSADO' },
        _sum: { valor: true },
        _count: true,
      }),
    ]);

    return {
      totalEmCarteira: Number(emCarteira._sum.valor || 0),
      totalDepositado: Number(depositado._sum.valor || 0),
      totalDevolvido: Number(devolvido._sum.valor || 0),
      totalCompensado: Number(compensado._sum.valor || 0),
      quantidadeEmCarteira: emCarteira._count,
      quantidadeDepositado: depositado._count,
      quantidadeDevolvido: devolvido._count,
      quantidadeCompensado: compensado._count,
    };
  }
}
