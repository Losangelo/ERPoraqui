import { prisma } from '@/database/prisma.service';
import { EstoqueFiltro, AjusteEstoqueInput } from './dto/estoque.dto';

export class EstoqueService {
  async listar(empresaId: string, filtros: EstoqueFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const { categoriaId, nome, codigoInterno, pagina, limite } = filtros;

    const where: any = {
      empresaId,
      ...(categoriaId && { categoriaId }),
      ...(nome && { nome: { contains: nome, mode: 'insensitive' as const } }),
      ...(codigoInterno && { codigoInterno: { contains: codigoInterno } }),
    };

    const [dados, total] = await Promise.all([
      prisma.produto.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { nome: 'asc' },
        select: {
          id: true,
          codigoInterno: true,
          codigoBarras: true,
          nome: true,
          quantidadeEstoque: true,
          estoqueMinimo: true,
          estoqueMaximo: true,
          precoVenda: true,
          precoCusto: true,
          categoria: {
            select: { id: true, nome: true },
          },
          unidadeMedida: {
            select: { id: true, simbolo: true },
          },
        },
      }),
      prisma.produto.count({ where }),
    ]);

    const dadosFormatados = dados.map((produto) => ({
      ...produto,
      quantidadeEstoque: Number(produto.quantidadeEstoque),
      estoqueMinimo: Number(produto.estoqueMinimo),
      estoqueMaximo: Number(produto.estoqueMaximo),
      precoVenda: Number(produto.precoVenda),
      precoCusto: Number(produto.precoCusto),
      abaixoEstoqueMinimo: Number(produto.quantidadeEstoque) <= Number(produto.estoqueMinimo),
      acimaEstoqueMaximo: Number(produto.quantidadeEstoque) >= Number(produto.estoqueMaximo),
    }));

    return {
      dados: dadosFormatados,
      meta: {
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    
    const produto = await prisma.produto.findFirst({
      where: { id, empresaId },
      select: {
        id: true,
        codigoInterno: true,
        codigoBarras: true,
        nome: true,
        descricao: true,
        quantidadeEstoque: true,
        estoqueMinimo: true,
        estoqueMaximo: true,
        precoVenda: true,
        precoCusto: true,
        precoMinimo: true,
        categoria: {
          select: { id: true, nome: true },
        },
        unidadeMedida: {
          select: { id: true, simbolo: true, descricao: true },
        },
      },
    });

    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    return {
      ...produto,
      quantidadeEstoque: Number(produto.quantidadeEstoque),
      estoqueMinimo: Number(produto.estoqueMinimo),
      estoqueMaximo: Number(produto.estoqueMaximo),
      precoVenda: Number(produto.precoVenda),
      precoCusto: Number(produto.precoCusto),
      precoMinimo: Number(produto.precoMinimo),
      abaixoEstoqueMinimo: Number(produto.quantidadeEstoque) <= Number(produto.estoqueMinimo),
    };
  }

  async alertasEstoque(empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const produtos = await prisma.produto.findMany({
      where: {
        empresaId,
        ativo: true,
      },
      select: {
        id: true,
        codigoInterno: true,
        nome: true,
        quantidadeEstoque: true,
        estoqueMinimo: true,
        estoqueMaximo: true,
        categoria: {
          select: { nome: true },
        },
      },
      orderBy: { quantidadeEstoque: 'asc' },
    });

    const abaixoMinimo = produtos.filter((p) => Number(p.quantidadeEstoque) <= Number(p.estoqueMinimo));
    const acimaMaximo = produtos.filter((p) => Number(p.quantidadeEstoque) >= Number(p.estoqueMaximo));
    const estoqueZerado = produtos.filter((p) => Number(p.quantidadeEstoque) === 0);

    return {
      abaixoMinimo: abaixoMinimo.map((p) => ({
        ...p,
        quantidadeEstoque: Number(p.quantidadeEstoque),
        estoqueMinimo: Number(p.estoqueMinimo),
      })),
      acimaMaximo: acimaMaximo.map((p) => ({
        ...p,
        quantidadeEstoque: Number(p.quantidadeEstoque),
        estoqueMaximo: Number(p.estoqueMaximo),
      })),
      estoqueZerado: estoqueZerado.map((p) => ({
        ...p,
        quantidadeEstoque: Number(p.quantidadeEstoque),
      })),
      total: {
        abaixoMinimo: abaixoMinimo.length,
        acimaMaximo: acimaMaximo.length,
        estoqueZerado: estoqueZerado.length,
      },
    };
  }

  async ajustarEstoque(empresaId: string, dados: AjusteEstoqueInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const produto = await prisma.produto.findFirst({
      where: { id: dados.produtoId, empresaId },
    });

    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    let novaQuantidade: number;

    switch (dados.tipo) {
      case 'ENTRADA':
        novaQuantidade = Number(produto.quantidadeEstoque) + dados.quantidade;
        break;
      case 'SAIDA':
        novaQuantidade = Number(produto.quantidadeEstoque) - dados.quantidade;
        if (novaQuantidade < 0) {
          throw new Error('Estoque insuficiente para esta operação');
        }
        break;
      case 'AJUSTE':
        novaQuantidade = dados.quantidade;
        break;
      default:
        throw new Error('Tipo de ajuste inválido');
    }

    return prisma.produto.update({
      where: { id: dados.produtoId },
      data: { quantidadeEstoque: novaQuantidade },
    });
  }
}
