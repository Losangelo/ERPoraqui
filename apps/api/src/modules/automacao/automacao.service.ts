import { PrismaService } from '@/database/prisma.service';
import { LicencasService } from '@/modules/licencas/licencas.service';

export class AutomacaoService {
  constructor(
    private prisma: PrismaService,
    private licencasService: LicencasService
  ) {}

  async verificarAcesso(empresaId: string): Promise<boolean> {
    return this.licencasService.verificarAcesso(empresaId, 'automacao');
  }

  async listarAutomacoes(empresaId: string) {
    return this.prisma.automacao.findMany({
      where: { empresaId },
      include: {
        _count: { select: { logs: true } },
      },
      orderBy: { dataCriacao: 'desc' },
    });
  }

  async buscarAutomacaoPorId(id: string) {
    return this.prisma.automacao.findUnique({
      where: { id },
      include: {
        logs: { orderBy: { dataExecucao: 'desc' }, take: 20 },
      },
    });
  }

  async criarAutomacao(empresaId: string, data: any) {
    return this.prisma.automacao.create({
      data: {
        empresaId,
        nome: data.nome,
        descricao: data.descricao,
        tipo: data.tipo,
        status: 'PAUSADA',
        trigger: data.trigger,
        acoes: data.acoes || [],
      },
    });
  }

  async atualizarAutomacao(id: string, data: any) {
    return this.prisma.automacao.update({
      where: { id },
      data: {
        nome: data.nome,
        descricao: data.descricao,
        tipo: data.tipo,
        trigger: data.trigger,
        acoes: data.acoes,
      },
    });
  }

  async excluirAutomacao(id: string) {
    return this.prisma.automacao.delete({ where: { id } });
  }

  async ativarAutomacao(id: string) {
    return this.prisma.automacao.update({
      where: { id },
      data: { status: 'ATIVA' },
    });
  }

  async pausarAutomacao(id: string) {
    return this.prisma.automacao.update({
      where: { id },
      data: { status: 'PAUSADA' },
    });
  }

  async executarAutomacao(id: string) {
    const automacao = await this.prisma.automacao.findUnique({ where: { id } });
    
    if (!automacao) {
      throw new Error('Automação não encontrada');
    }

    if (automacao.status !== 'ATIVA') {
      throw new Error('Automação não está ativa');
    }

    const trigger = automacao.trigger as any;
    const acoes = automacao.acoes as any[];
    let executado = false;
    let erro: string | null = null;
    const detalhes: any[] = [];

    try {
      switch (trigger.tipo) {
        case 'ESTOQUE_BAIXO':
          const produtosBaixoEstoque = await this.prisma.produto.findMany({
            where: {
              empresaId: automacao.empresaId,
              quantidadeEstoque: { lte: trigger.threshold || 10 },
              ativo: true,
            },
          });

          for (const produto of produtosBaixoEstoque) {
            detalhes.push({ tipo: 'ESTOQUE_BAIXO', produto: produto.nome, quantidade: produto.quantidadeEstoque });
          }
          executado = produtosBaixoEstoque.length > 0;
          break;

        case 'CONTA_VENCENDO':
          const amanha = new Date();
          amanha.setDate(amanha.getDate() + (trigger.diasAntecedencia || 3));
          amanha.setHours(0, 0, 0, 0);

          const amanhaStr = amanha.toISOString().split('T')[0];
          
          const contasVencendo = await this.prisma.contaReceber.findMany({
            where: {
              empresaId: automacao.empresaId,
              dataVencimento: { startsWith: amanhaStr },
              situacao: 'PENDENTE',
            },
            include: { cliente: true },
          });

          for (const conta of contasVencendo) {
            detalhes.push({ tipo: 'CONTA_VENCENDO', cliente: conta.cliente?.nome, valor: conta.valor });
          }
          executado = contasVencendo.length > 0;
          break;

        case 'CLIENTE_CADASTRADO':
          const hoje = new Date();
          hoje.setHours(0, 0, 0, 0);
          const hojeStr = hoje.toISOString();
          
          const novosClientes = await this.prisma.cliente.findMany({
            where: {
              empresaId: automacao.empresaId,
              createdAt: { gte: hojeStr },
            },
            take: trigger.limit || 50,
          });

          for (const cliente of novosClientes) {
            detalhes.push({ tipo: 'CLIENTE_CADASTRADO', cliente: cliente.nome, email: cliente.email });
          }
          executado = novosClientes.length > 0;
          break;

        default:
          erro = 'Trigger não implementado';
      }

      if (executado && acoes && acoes.length > 0) {
        for (const acao of acoes) {
          try {
            switch (acao.tipo) {
              case 'CRIAR_TAREFA':
                const tarefaTitulo = acao.config?.titulo || `Automação: ${automacao.nome}`;
                await this.prisma.cRMTarefa.create({
                  data: {
                    empresaId: automacao.empresaId,
                    titulo: tarefaTitulo,
                    descricao: acao.config?.descricao || `Automação executada - ${detalhes.length} registro(s) afetado(s)`,
                    tipo: acao.config?.tipoTarefa || 'OUTRO',
                    prioridade: acao.config?.prioridade || 'MEDIA',
                    responsavelId: acao.config?.responsavelId || null,
                    dataVencimento: acao.config?.dataVencimento ? new Date(acao.config.dataVencimento) : null,
                    concluida: false,
                  },
                });
                break;

              case 'ENVIAR_EMAIL':
                const emailTo = acao.config?.para || acao.config?.email;
                const emailSubject = acao.config?.assunto || `Automação: ${automacao.nome}`;
                const emailBody = acao.config?.corpo || `Automação executada com sucesso.\n\n${JSON.stringify(detalhes, null, 2)}`;
                await this.prisma.notificacao.create({
                  data: {
                    empresaId: automacao.empresaId,
                    tipo: 'EMAIL',
                    titulo: emailSubject,
                    mensagem: emailBody,
                    destinatario: emailTo,
                    lida: false,
                  },
                });
                break;

              case 'ATUALIZAR_STATUS':
                break;
            }
          } catch (acaoError: any) {
            console.error('Erro ao executar ação:', acaoError.message);
          }
        }
      }

      await this.prisma.automacao.update({
        where: { id },
        data: {
          executadaCount: { increment: executado ? 1 : 0 },
          ultimaExecucao: new Date(),
        },
      });

      await this.prisma.automacaoLog.create({
        data: {
          automacaoId: id,
          executada: executado,
          detalhes,
          erro,
        },
      });

    } catch (error: any) {
      await this.prisma.automacaoLog.create({
        data: {
          automacaoId: id,
          executada: false,
          erro: error.message,
        },
      });
      throw error;
    }

    return { executado, detalhes };
  }

  async getDashboard(empresaId: string) {
    const automacoes = await this.prisma.automacao.findMany({
      where: { empresaId },
    });

    const ativas = automacoes.filter(a => a.status === 'ATIVA').length;
    const pausadas = automacoes.filter(a => a.status === 'PAUSADA').length;
    const totalExecucoes = automacoes.reduce((sum, a) => sum + a.executadaCount, 0);

    const ultimosLogs = await this.prisma.automacaoLog.findMany({
      where: { automacao: { empresaId } },
      orderBy: { dataExecucao: 'desc' },
      take: 10,
      include: { automacao: { select: { nome: true } } },
    });

    return {
      total: automacoes.length,
      ativas,
      pausadas,
      totalExecucoes,
      ultimosLogs,
    };
  }
}
