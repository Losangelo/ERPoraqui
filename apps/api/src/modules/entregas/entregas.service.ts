import { prisma } from '@/database/prisma.service';
import {
  CriarEntregaInput,
  AtualizarEntregaInput,
  EntregaFiltro,
} from './dto/entrega.dto';
import { SituacaoEntrega } from '@prisma/client';

export class EntregasService {
  async criar(empresaId: string, dados: CriarEntregaInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const entrega = await prisma.entrega.create({
      data: {
        pedidoVendaId: dados.pedidoVendaId,
        clienteId: dados.clienteId,
        filialId: dados.filialId,
        empresaId,
        motoristaId: dados.motoristaId,
        veiculoId: dados.veiculoId,
        transportadoraId: dados.transportadoraId,
        enderecoEntrega: dados.enderecoEntrega,
        dataAgendamento: dados.dataAgendamento ? new Date(dados.dataAgendamento) : undefined,
        dataPrevisao: dados.dataPrevisao ? new Date(dados.dataPrevisao) : undefined,
        valorFrete: dados.valorFrete,
        taxaEntregaId: dados.taxaEntregaId,
        observacoes: dados.observacoes,
        tokenRastreio: this.gerarTokenRastreio(),
      },
    });

    await this.criarNotificacaoEmail(empresaId, entrega.clienteId || dados.clienteId,
      `Entrega #${entrega.id.substring(0, 8)} criada`,
      `Sua entrega foi criada com sucesso. Token de rastreio: ${entrega.tokenRastreio}`
    );

    return entrega;
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.entrega.findFirst({
      where: { id, empresaId },
      include: {
        motorista: true,
        veiculoEntrega: true,
        cliente: true,
        pedidoVenda: true,
        tentativas: { orderBy: { dataTentativa: 'desc' } },
        taxaEntrega: true,
        avaliacao: true,
        transportadora: true,
      },
    });
  }

  async listar(empresaId: string, filtros: EntregaFiltro) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const { situacao, clienteId, motoristaId, pedidoVendaId, dataInicial, dataFinal, pagina, limite } = filtros;

    const where: any = { empresaId };

    if (situacao) where.situacao = situacao;
    if (clienteId) where.clienteId = clienteId;
    if (motoristaId) where.motoristaId = motoristaId;
    if (pedidoVendaId) where.pedidoVendaId = pedidoVendaId;
    if (dataInicial || dataFinal) {
      where.dataCriacao = {};
      if (dataInicial) where.dataCriacao.gte = new Date(dataInicial);
      if (dataFinal) where.dataCriacao.lte = new Date(dataFinal);
    }

    const [dados, total] = await Promise.all([
      prisma.entrega.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { dataCriacao: 'desc' },
        include: {
          motorista: true,
          veiculoEntrega: true,
          cliente: true,
          taxaEntrega: true,
        },
      }),
      prisma.entrega.count({ where }),
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

  async atualizar(id: string, empresaId: string, dados: AtualizarEntregaInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    const updateData: any = { ...dados };

    if (dados.dataAgendamento) updateData.dataAgendamento = new Date(dados.dataAgendamento);
    if (dados.dataPrevisao) updateData.dataPrevisao = new Date(dados.dataPrevisao);

    return prisma.entrega.update({
      where: { id },
      data: updateData,
    });
  }

  async agendar(id: string, empresaId: string, dataAgendamento: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    const entrega = await prisma.entrega.update({
      where: { id },
      data: {
        dataAgendamento: dataAgendamento ? new Date(dataAgendamento) : undefined,
        situacao: 'AGENDADO',
      },
    });

    await this.criarNotificacaoEmail(empresaId, entrega.clienteId || '',
      `Entrega #${entrega.id.substring(0, 8)} agendada`,
      `Sua entrega foi agendada para ${dataAgendamento ? new Date(dataAgendamento).toLocaleString('pt-BR') : 'em breve'}.`
    );

    return entrega;
  }

  async saiuParaEntrega(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    const entrega = await prisma.entrega.update({
      where: { id },
      data: {
        dataSaida: new Date(),
        situacao: 'SAIU_PARA_ENTREGA',
      },
    });

    await this.criarNotificacaoEmail(empresaId, entrega.clienteId || '',
      `Entrega #${entrega.id.substring(0, 8)} saiu para entrega`,
      `Sua entrega saiu para entrega. Acompanhe pelo token: ${entrega.tokenRastreio}`
    );

    return entrega;
  }

  async entregue(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    const entrega = await prisma.entrega.update({
      where: { id },
      data: {
        dataEntrega: new Date(),
        situacao: 'ENTREGUE',
      },
    });

    await prisma.avaliacao.create({
      data: {
        empresaId,
        entregaId: entrega.id,
        tokenAvaliacao: this.gerarTokenRastreio(),
      },
    });

    await this.criarNotificacaoEmail(empresaId, entrega.clienteId || '',
      `Entrega #${entrega.id.substring(0, 8)} entregue`,
      `Sua entrega foi realizada com sucesso! Avalie sua experiência: ${process.env.FRONTEND_URL || 'http://localhost:3003'}/rastreio/${entrega.tokenRastreio}`
    );

    return entrega;
  }

  async tentativaFalhou(id: string, empresaId: string, motivoFalha?: string, observacoes?: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    const entrega = await prisma.entrega.update({
      where: { id },
      data: { situacao: 'TENTATIVA_FALHOU' },
    });

    await prisma.entregaTentativa.create({
      data: {
        entregaId: entrega.id,
        motivoFalha,
        observacoes,
      },
    });

    await this.criarNotificacaoEmail(empresaId, entrega.clienteId || '',
      `Tentativa de entrega #${entrega.id.substring(0, 8)} falhou`,
      `Não foi possível realizar a entrega. Motivo: ${motivoFalha || 'Não informado'}.`
    );

    return entrega;
  }

  async cancelar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    const entrega = await prisma.entrega.update({
      where: { id },
      data: { situacao: 'CANCELADO' },
    });

    await this.criarNotificacaoEmail(empresaId, entrega.clienteId || '',
      `Entrega #${entrega.id.substring(0, 8)} cancelada`,
      `Sua entrega foi cancelada.`
    );

    return entrega;
  }

  private async verificarProprietario(id: string, empresaId: string) {
    const entrega = await prisma.entrega.findFirst({
      where: { id, empresaId },
    });

    if (!entrega) {
      throw new Error('Entrega não encontrada');
    }
  }

  private gerarTokenRastreio(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < 16; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  private async criarNotificacaoEmail(empresaId: string, clienteId: string, titulo: string, mensagem: string) {
    if (!clienteId) return;

    try {
      const cliente = await prisma.cliente.findUnique({
        where: { id: clienteId },
        select: { email: true },
      });

      await prisma.notificacao.create({
        data: {
          empresaId,
          tipo: 'EMAIL',
          titulo,
          mensagem,
          destinatario: cliente?.email || undefined,
        },
      });
    } catch {
      // Notificação não crítica - falha silenciosa
    }
  }
}
