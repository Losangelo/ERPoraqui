import { prisma } from '@/database/prisma.service';
import { 
  CriarCotacaoInput,
  ResponderCotacaoInput,
  CotacaoFiltro 
} from './dto/cotacao-compra.dto';

export class CotacoesCompraService {
  async criar(empresaId: string, dados: CriarCotacaoInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const { itens, ...cotacaoData } = dados;

    return prisma.cotacaoCompra.create({
      data: {
        ...cotacaoData,
        empresaId,
        itens: {
          create: itens,
        },
      },
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.cotacaoCompra.findFirst({
      where: { id, empresaId },
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
        respostas: {
          include: {
            fornecedor: true,
          },
        },
      },
    });
  }

  async listar(empresaId: string, filtros: CotacaoFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const { situacao, dataInicial, dataFinal, pagina, limite } = filtros;

    const where = {
      empresaId,
      ...(situacao && { situacao }),
      ...(dataInicial && dataFinal && {
        dataAbertura: {
          gte: dataInicial,
          lte: dataFinal,
        },
      }),
    };

    const [dados, total] = await Promise.all([
      prisma.cotacaoCompra.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { dataAbertura: 'desc' },
        include: {
          _count: {
            select: { itens: true, respostas: true },
          },
        },
      }),
      prisma.cotacaoCompra.count({ where }),
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

  async enviarCotacao(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    
    return prisma.cotacaoCompra.update({
      where: { id },
      data: { situacao: 'ENVIADA' },
    });
  }

  async responderCotacao(id: string, empresaId: string, fornecedorId: string, dados: ResponderCotacaoInput, valorTotal: number) {
    if (!empresaId) throw new Error('Empresa não identificada');
    
    return prisma.respostaCotacao.create({
      data: {
        cotacaoCompraId: id,
        fornecedorId,
        valorTotal,
        valorFrete: dados.valorFrete,
        valorDesconto: dados.valorDesconto,
        prazoEntrega: dados.prazoEntrega,
      },
    });
  }

  async aprobarResposta(cotacaoId: string, respostaId: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    
    await prisma.$transaction([
      prisma.respostaCotacao.update({
        where: { id: respostaId },
        data: { situacao: 'APROVADA' },
      }),
      prisma.cotacaoCompra.update({
        where: { id: cotacaoId },
        data: { situacao: 'APROVADA' },
      }),
    ]);
  }

  async cancelar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);
    
    return prisma.cotacaoCompra.update({
      where: { id },
      data: { situacao: 'CANCELADA' },
    });
  }

  private async verificarProprietario(id: string, empresaId: string) {
    const cotacao = await prisma.cotacaoCompra.findFirst({
      where: { id, empresaId },
    });

    if (!cotacao) {
      throw new Error('Cotação não encontrada');
    }
  }
}
