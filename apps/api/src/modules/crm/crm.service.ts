import { PrismaService } from '@/database/prisma.service';
import { LicencasService } from '@/modules/licencas/licencas.service';

export class CRMService {
  constructor(
    private prisma: PrismaService,
    private licencasService: LicencasService
  ) {}

  async verificarAcesso(empresaId: string): Promise<boolean> {
    return this.licencasService.verificarAcesso(empresaId, 'crm');
  }

  // ==================== PIPELINES ====================

  async listarPipelines(empresaId: string) {
    return this.prisma.cRMPipeline.findMany({
      where: { empresaId, ativo: true },
      orderBy: { ordem: 'asc' },
    });
  }

  async criarPipeline(empresaId: string, data: any) {
    const pipeline = await this.prisma.cRMPipeline.create({
      data: {
        empresaId,
        nome: data.nome,
        descricao: data.descricao,
        cor: data.cor,
        ordem: data.ordem || 0,
      },
    });
    return pipeline;
  }

  async atualizarPipeline(id: string, data: any) {
    return this.prisma.cRMPipeline.update({
      where: { id },
      data: {
        nome: data.nome,
        descricao: data.descricao,
        cor: data.cor,
        ordem: data.ordem,
      },
    });
  }

  async excluirPipeline(id: string) {
    const oportunidades = await this.prisma.cRMOportunidade.count({
      where: { pipelineId: id, status: 'ABERTA' },
    });

    if (oportunidades > 0) {
      throw new Error('Não é possível excluir pipeline com oportunidades abertas');
    }

    return this.prisma.cRMPipeline.update({
      where: { id },
      data: { ativo: false },
    });
  }

  // ==================== OPORTUNIDADES ====================

  async listarOportunidades(empresaId: string, filtros?: {
    pipelineId?: string;
    status?: string;
    clienteId?: string;
  }) {
    const where: any = { empresaId };

    if (filtros?.pipelineId) where.pipelineId = filtros.pipelineId;
    if (filtros?.status) where.status = filtros.status;
    if (filtros?.clienteId) where.clienteId = filtros.clienteId;

    return this.prisma.cRMOportunidade.findMany({
      where,
      include: {
        pipeline: true,
        itens: true,
        _count: {
          select: { tarefas: true, interacoes: true },
        },
      },
      orderBy: { dataCriacao: 'desc' },
    });
  }

  async buscarOportunidadePorId(id: string) {
    return this.prisma.cRMOportunidade.findUnique({
      where: { id },
      include: {
        pipeline: true,
        itens: true,
        tarefas: {
          where: { concluida: false },
          orderBy: { dataVencimento: 'asc' },
        },
        interacoes: {
          orderBy: { data: 'desc' },
          take: 10,
        },
        historico: {
          orderBy: { dataCriacao: 'desc' },
          take: 20,
        },
      },
    });
  }

  async criarOportunidade(empresaId: string, data: any) {
    const pipeline = await this.prisma.cRMPipeline.findUnique({
      where: { id: data.pipelineId },
    });

    const oportunidade = await this.prisma.cRMOportunidade.create({
      data: {
        empresaId,
        pipelineId: data.pipelineId,
        clienteId: data.clienteId,
        titulo: data.titulo,
        descricao: data.descricao,
        valor: data.valor,
        probabilidade: data.probabilidade || 50,
        estagio: pipeline?.nome || 'Aberto',
        dataFechamentoEsperado: data.dataFechamentoEsperado,
        status: 'ABERTA',
        itens: {
          create: (data.itens || []).map((item: any) => ({
            produtoId: item.produtoId,
            produtoNome: item.produtoNome,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
            desconto: item.desconto || 0,
            total: (item.quantidade * item.precoUnitario) - (item.desconto || 0),
          })),
        },
      },
      include: {
        pipeline: true,
        itens: true,
      },
    });

    await this.prisma.cRMOportunidadeHistorico.create({
      data: {
        oportunidadeId: oportunidade.id,
        acao: 'CRIACAO',
        descricao: 'Oportunidade criada',
      },
    });

    return oportunidade;
  }

  async atualizarOportunidade(id: string, data: any) {
    const atual = await this.prisma.cRMOportunidade.findUnique({ where: { id } });

    const updateData: any = {};
    if (data.titulo) updateData.titulo = data.titulo;
    if (data.descricao) updateData.descricao = data.descricao;
    if (data.valor) updateData.valor = data.valor;
    if (data.probabilidade) updateData.probabilidade = data.probabilidade;
    if (data.pipelineId) {
      const pipeline = await this.prisma.cRMPipeline.findUnique({
        where: { id: data.pipelineId },
      });
      updateData.pipelineId = data.pipelineId;
      updateData.estagio = pipeline?.nome;
    }

    const oportunidade = await this.prisma.cRMOportunidade.update({
      where: { id },
      data: updateData,
      include: { pipeline: true, itens: true },
    });

    if (data.pipelineId && atual?.pipelineId !== data.pipelineId) {
      await this.prisma.cRMOportunidadeHistorico.create({
        data: {
          oportunidadeId: id,
          estagioAnterior: atual?.estagio,
          estagioNovo: oportunidade.estagio,
          acao: 'ESTAGIO',
          descricao: `Mudou de "${atual?.estagio}" para "${oportunidade.estagio}"`,
        },
      });
    }

    return oportunidade;
  }

  async mudarEstagio(id: string, novoPipelineId: string) {
    const pipeline = await this.prisma.cRMPipeline.findUnique({
      where: { id: novoPipelineId },
    });

    const atual = await this.prisma.cRMOportunidade.findUnique({ where: { id } });

    const oportunidade = await this.prisma.cRMOportunidade.update({
      where: { id },
      data: {
        pipelineId: novoPipelineId,
        estagio: pipeline?.nome,
      },
      include: { pipeline: true },
    });

    await this.prisma.cRMOportunidadeHistorico.create({
      data: {
        oportunidadeId: id,
        estagioAnterior: atual?.estagio,
        estagioNovo: pipeline?.nome,
        acao: 'ESTAGIO',
        descricao: `Oportunidade movida para "${pipeline?.nome}"`,
      },
    });

    return oportunidade;
  }

  async marcarGanha(id: string, criarPedido: boolean = false) {
    const oportunidade = await this.prisma.cRMOportunidade.update({
      where: { id },
      data: {
        status: 'GANHA',
        dataFechamentoReal: new Date(),
      },
      include: { itens: true, pipeline: true },
    });

    await this.prisma.cRMOportunidadeHistorico.create({
      data: {
        oportunidadeId: id,
        acao: 'GANHA',
        descricao: 'Oportunidade marcada como GANHA',
      },
    });

    if (criarPedido) {
      const pedido = await this.criarPedidoAPartirDeOportunidade(oportunidade);
      await this.prisma.cRMOportunidade.update({
        where: { id },
        data: { pedidoId: pedido.id },
      });
      return { oportunidade, pedido };
    }

    return { oportunidade };
  }

  async marcarPerdida(id: string, motivo?: string) {
    const oportunidade = await this.prisma.cRMOportunidade.update({
      where: { id },
      data: {
        status: 'PERDIDA',
        dataFechamentoReal: new Date(),
      },
    });

    await this.prisma.cRMOportunidadeHistorico.create({
      data: {
        oportunidadeId: id,
        acao: 'PERDIDA',
        descricao: motivo || 'Oportunidade marcada como PERDIDA',
      },
    });

    return oportunidade;
  }

  private async criarPedidoAPartirDeOportunidade(oportunidade: any) {
    const empresaId = oportunidade.empresaId;
    const filial = await this.prisma.filial.findFirst({
      where: { empresaId },
    });

    if (!filial) {
      throw new Error('Filial não encontrada para criar pedido');
    }

    const itensPedido = await Promise.all(
      oportunidade.itens.map(async (item: any) => {
        let produtoId = item.produtoId;
        if (!produtoId) {
          const produto = await this.prisma.produto.findFirst({
            where: { empresaId, nome: { contains: item.produtoNome } },
          });
          produtoId = produto?.id;
        }
        return {
          produtoId,
          quantidade: item.quantidade,
          unidadeMedida: 'UN',
          valorUnitario: item.precoUnitario,
          valorDesconto: item.desconto,
          valorTotal: item.total,
        };
      })
    );

    const numeroPedido = await this.gerarNumeroPedido(empresaId);

    const pedido = await this.prisma.pedidoVenda.create({
      data: {
        empresaId,
        filialId: filial.id,
        clienteId: oportunidade.clienteId,
        numeroPedido,
        serie: '1',
        tipoOperacao: 'VENDA',
        situacao: 'CONFIRMADO',
        dataEmissao: new Date(),
        valorTotal: oportunidade.valor,
        valorDesconto: 0,
        valorFrete: 0,
        itens: {
          create: itensPedido.filter(i => i.produtoId),
        },
      },
    });

    return pedido;
  }

  private async gerarNumeroPedido(empresaId: string): Promise<string> {
    const ano = new Date().getFullYear();
    const ultimoPedido = await this.prisma.pedidoVenda.findFirst({
      where: { empresaId },
      orderBy: { dataCriacao: 'desc' },
    });

    let sequencial = 1;
    if (ultimoPedido) {
      const ultimoNumero = ultimoPedido.numeroPedido;
      const match = ultimoNumero.match(/(\d+)$/);
      if (match) {
        sequencial = parseInt(match[1]) + 1;
      }
    }

    return `PV-${ano}-${sequencial.toString().padStart(5, '0')}`;
  }

  // ==================== TAREFAS ====================

  async listarTarefas(empresaId: string, filtros?: {
    oportunidadeId?: string;
    responsavelId?: string;
    concluida?: boolean;
  }) {
    const where: any = { empresaId };
    if (filtros?.oportunidadeId) where.oportunidadeId = filtros.oportunidadeId;
    if (filtros?.responsavelId) where.responsavelId = filtros.responsavelId;
    if (filtros?.concluida !== undefined) where.concluida = filtros.concluida;

    return this.prisma.cRMTarefa.findMany({
      where,
      include: {
        oportunidade: { select: { id: true, titulo: true } },
      },
      orderBy: [{ prioridade: 'desc' }, { dataVencimento: 'asc' }],
    });
  }

  async criarTarefa(empresaId: string, data: any) {
    return this.prisma.cRMTarefa.create({
      data: {
        empresaId,
        oportunidadeId: data.oportunidadeId,
        titulo: data.titulo,
        descricao: data.descricao,
        tipo: data.tipo || 'OUTRO',
        prioridade: data.prioridade || 'MEDIA',
        responsavelId: data.responsavelId,
        dataVencimento: data.dataVencimento,
      },
    });
  }

  async concluirTarefa(id: string) {
    return this.prisma.cRMTarefa.update({
      where: { id },
      data: {
        concluida: true,
        dataConclusao: new Date(),
      },
    });
  }

  // ==================== INTERAÇÕES ====================

  async listarInteracoes(empresaId: string, filtros?: {
    oportunidadeId?: string;
    clienteId?: string;
  }) {
    const where: any = { empresaId };
    if (filtros?.oportunidadeId) where.oportunidadeId = filtros.oportunidadeId;
    if (filtros?.clienteId) where.clienteId = filtros.clienteId;

    return this.prisma.cRMInteracao.findMany({
      where,
      orderBy: { data: 'desc' },
      take: 50,
    });
  }

  async criarInteracao(empresaId: string, usuarioId: string, data: any) {
    return this.prisma.cRMInteracao.create({
      data: {
        empresaId,
        oportunidadeId: data.oportunidadeId,
        clienteId: data.clienteId,
        tipo: data.tipo,
        titulo: data.titulo,
        descricao: data.descricao,
        duracaoMinutos: data.duracaoMinutos,
        arquivoUrl: data.arquivoUrl,
        usuarioId,
      },
    });
  }

  // ==================== VISÃO 360º ====================

  async getVisao360Cliente(clienteId: string) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: clienteId },
    });

    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    const oportunidades = await this.prisma.cRMOportunidade.findMany({
      where: { clienteId, status: 'ABERTA' },
      include: { pipeline: true },
      orderBy: { dataCriacao: 'desc' },
    });

    const interacoesRecentes = await this.prisma.cRMInteracao.findMany({
      where: { clienteId },
      orderBy: { data: 'desc' },
      take: 10,
    });

    const tarefasPendentes = await this.prisma.cRMTarefa.findMany({
      where: {
        clienteId: undefined,
        oportunidade: { clienteId },
        concluida: false,
      },
      include: { oportunidade: { select: { id: true, titulo: true } } },
    });

    const faturasPendentes = await this.prisma.contaReceber.findMany({
      where: {
        clienteId,
        situacao: { in: ['PENDENTE', 'VENCIDA'] },
      },
      orderBy: { dataVencimento: 'asc' },
    });

    const notasFiscais = await this.prisma.notaFiscal.findMany({
      where: { clienteId },
      orderBy: { dataEmissao: 'desc' },
      take: 10,
    });

    const totalComprado = await this.prisma.pedidoVenda.aggregate({
      where: { clienteId, situacao: 'CONFIRMADO' },
      _sum: { valorTotal: true },
    });

    return {
      cliente,
      oportunidades,
      interacoesRecentes,
      tarefasPendentes,
      financeiro: {
        faturasPendentes,
        totalPendente: faturasPendentes.reduce((sum, f) => sum + Number(f.valor), 0),
      },
      notasFiscais,
      totalComprado: totalComprado._sum.valorTotal || 0,
    };
  }

  // ==================== SEEDER ====================

  async seedPipelinesPadrao(empresaId: string) {
    const existente = await this.prisma.cRMPipeline.count({ where: { empresaId } });
    if (existente > 0) {
      return { message: 'Pipelines já existem' };
    }

    const pipelines = [
      { nome: 'Prospecção', descricao: 'Novos contatos e leads', cor: '#6b7280', ordem: 1 },
      { nome: 'Qualificação', descricao: 'Identificando necessidades', cor: '#3b82f6', ordem: 2 },
      { nome: 'Proposta', descricao: 'Enviando propostas', cor: '#f59e0b', ordem: 3 },
      { nome: 'Negociação', descricao: 'Em negociação', cor: '#8b5cf6', ordem: 4 },
      { nome: 'Fechamento', descricao: 'Fechamento', cor: '#10b981', ordem: 5 },
    ];

    for (const p of pipelines) {
      await this.prisma.cRMPipeline.create({
        data: { empresaId, ...p },
      });
    }

    return { message: 'Pipelines criados com sucesso', pipelines };
  }

  // ==================== DASHBOARD ====================

  async getDashboard(empresaId: string) {
    const oportunidades = await this.prisma.cRMOportunidade.findMany({
      where: { empresaId, status: 'ABERTA' },
    });

    const totalValor = oportunidades.reduce((sum, o) => sum + Number(o.valor), 0);
    const valorPonderado = oportunidades.reduce(
      (sum, o) => sum + (Number(o.valor) * o.probabilidade) / 100,
      0
    );

    const porEstagio: Record<string, { count: number; valor: number }> = {};
    for (const o of oportunidades) {
      if (!porEstagio[o.estagio]) {
        porEstagio[o.estagio] = { count: 0, valor: 0 };
      }
      porEstagio[o.estagio].count++;
      porEstagio[o.estagio].valor += Number(o.valor);
    }

    const tarefasPendentes = await this.prisma.cRMTarefa.count({
      where: { empresaId, concluida: false },
    });

    const ultimosFechamentos = await this.prisma.cRMOportunidade.findMany({
      where: { empresaId, status: { in: ['GANHA', 'PERDIDA'] } },
      orderBy: { dataFechamentoReal: 'desc' },
      take: 5,
      include: { pipeline: { select: { nome: true } } },
    });

    return {
      oportunidades: {
        total: oportunidades.length,
        valorTotal: totalValor,
        valorPonderado,
      },
      porEstagio,
      tarefasPendentes,
      ultimosFechamentos,
    };
  }

  // ==================== CAMPANHAS (PREMIUM) ====================

  async listarCampanhas(empresaId: string) {
    return this.prisma.cRMCampanha.findMany({
      where: { empresaId },
      orderBy: { dataCriacao: 'desc' },
    });
  }

  async buscarCampanhaPorId(id: string) {
    return this.prisma.cRMCampanha.findUnique({
      where: { id },
    });
  }

  async criarCampanha(empresaId: string, data: any) {
    return this.prisma.cRMCampanha.create({
      data: {
        empresaId,
        nome: data.nome,
        descricao: data.descricao,
        tipoSegmento: data.tipoSegmento || 'todos',
        produtoId: data.produtoId,
        diasInatividade: data.diasInatividade,
        valorMinimo: data.valorMinimo,
        status: 'RASCUNHO',
      },
    });
  }

  async atualizarCampanha(id: string, data: any) {
    return this.prisma.cRMCampanha.update({
      where: { id },
      data: {
        nome: data.nome,
        descricao: data.descricao,
        tipoSegmento: data.tipoSegmento,
        produtoId: data.produtoId,
        diasInatividade: data.diasInatividade,
        valorMinimo: data.valorMinimo,
      },
    });
  }

  async excluirCampanha(id: string) {
    return this.prisma.cRMCampanha.delete({ where: { id } });
  }

  async executarCampanha(id: string) {
    const campanha = await this.prisma.cRMCampanha.findUnique({ where: { id } });
    
    if (!campanha) {
      throw new Error('Campanha não encontrada');
    }

    let clientes: any[] = [];

    switch (campanha.tipoSegmento) {
      case 'todos':
        clientes = await this.prisma.cliente.findMany({
          where: { empresaId: campanha.empresaId, ativo: true },
        });
        break;
      case 'inativos':
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() - (campanha.diasInatividade || 30));
        
        clientes = await this.prisma.cliente.findMany({
          where: {
            empresaId: campanha.empresaId,
            ativo: true,
          },
        });

        const clientesComPedido = await this.prisma.pedidoVenda.findMany({
          where: {
            empresaId: campanha.empresaId,
            dataEmissao: { gte: dataLimite },
          },
          select: { clienteId: true },
        });
        
        const idsComPedido = new Set(clientesComPedido.map(p => p.clienteId));
        clientes = clientes.filter(c => !idsComPedido.has(c.id));
        break;
      case 'por_produto':
        if (campanha.produtoId) {
          const pedidos = await this.prisma.pedidoVenda.findMany({
            where: { empresaId: campanha.empresaId },
            include: { itens: { where: { produtoId: campanha.produtoId } } },
          });
          const clienteIds = new Set(pedidos.filter(p => p.itens.length > 0).map(p => p.clienteId));
          clientes = await this.prisma.cliente.findMany({
            where: { empresaId: campanha.empresaId, id: { in: Array.from(clienteIds) }, ativo: true },
          });
        }
        break;
      case 'por_valor':
        if (campanha.valorMinimo) {
          const pedidos = await this.prisma.pedidoVenda.groupBy({
            by: ['clienteId'],
            where: { empresaId: campanha.empresaId, valorTotal: { gte: Number(campanha.valorMinimo) } },
            _sum: { valorTotal: true },
          });
          const clienteIds = pedidos.map(p => p.clienteId);
          clientes = await this.prisma.cliente.findMany({
            where: { empresaId: campanha.empresaId, id: { in: clienteIds }, ativo: true },
          });
        }
        break;
    }

    await this.prisma.cRMCampanha.update({
      where: { id },
      data: {
        status: 'ATIVA',
        clientesTarget: clientes.length,
        dataInicio: new Date(),
      },
    });

    return {
      campanha,
      clientesAlvo: clientes.length,
      clientes: clientes.map(c => ({ id: c.id, nome: c.nome, email: c.email })),
    };
  }

  async pausarCampanha(id: string) {
    return this.prisma.cRMCampanha.update({
      where: { id },
      data: { status: 'PAUSADA' },
    });
  }

  async finalizarCampanha(id: string) {
    return this.prisma.cRMCampanha.update({
      where: { id },
      data: { 
        status: 'FINALIZADA',
        dataFim: new Date(),
      },
    });
  }
}
