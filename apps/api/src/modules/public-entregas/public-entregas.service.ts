import { prisma } from '@/database/prisma.service';
import { SalvarAvaliacaoInput } from './dto/public-entrega.dto';

export class PublicEntregasService {
  async buscarRastreio(token: string) {
    const entrega = await prisma.entrega.findUnique({
      where: { tokenRastreio: token },
      include: {
        cliente: {
          select: { nome: true, telefone: true, email: true },
        },
        motorista: {
          select: { nome: true, telefone: true },
        },
        veiculoEntrega: {
          select: { placa: true, modelo: true, marca: true, cor: true },
        },
        tentativas: {
          orderBy: { dataTentativa: 'desc' },
          select: { dataTentativa: true, motivoFalha: true, observacoes: true },
        },
      },
    });

    if (!entrega) return null;

    return {
      situacao: entrega.situacao,
      tokenRastreio: entrega.tokenRastreio,
      dataCriacao: entrega.dataCriacao,
      dataAgendamento: entrega.dataAgendamento,
      dataSaida: entrega.dataSaida,
      dataEntrega: entrega.dataEntrega,
      dataPrevisao: entrega.dataPrevisao,
      enderecoEntrega: entrega.enderecoEntrega,
      cliente: entrega.cliente,
      motorista: entrega.motorista,
      veiculo: entrega.veiculoEntrega,
      tentativas: entrega.tentativas,
    };
  }

  async buscarAvaliacao(token: string) {
    const avaliacao = await prisma.avaliacao.findUnique({
      where: { tokenAvaliacao: token },
      include: {
        entrega: {
          select: {
            id: true,
            pedidoVendaId: true,
            cliente: {
              select: { nome: true },
            },
          },
        },
      },
    });

    if (!avaliacao) return null;

    return {
      tokenAvaliacao: avaliacao.tokenAvaliacao,
      entrega: {
        pedidoVendaId: avaliacao.entrega.pedidoVendaId,
        cliente: avaliacao.entrega.cliente,
      },
      avaliacao: avaliacao.ratingLoja !== null ? {
        ratingLoja: avaliacao.ratingLoja,
        ratingPedido: avaliacao.ratingPedido,
        ratingEntrega: avaliacao.ratingEntrega,
        comentario: avaliacao.comentario,
      } : null,
    };
  }

  async salvarAvaliacao(token: string, dados: SalvarAvaliacaoInput) {
    const avaliacao = await prisma.avaliacao.findUnique({
      where: { tokenAvaliacao: token },
    });

    if (!avaliacao) {
      throw new Error('Token de avaliação inválido');
    }

    if (avaliacao.ratingLoja !== null) {
      throw new Error('Avaliação já foi realizada');
    }

    return prisma.avaliacao.update({
      where: { id: avaliacao.id },
      data: {
        ratingLoja: dados.ratingLoja,
        ratingPedido: dados.ratingPedido,
        ratingEntrega: dados.ratingEntrega,
        comentario: dados.comentario,
      },
    });
  }
}
