import { PrismaService } from '@/database/prisma.service';

export class LicencasService {
  constructor(private prisma: PrismaService) {}

  // ==================== PLANOS ====================

  async listarPlanos() {
    return this.prisma.plano.findMany({
      where: { ativo: true },
      orderBy: { ordem: 'asc' },
    });
  }

  async buscarPlanoPorId(id: string) {
    const plano = await this.prisma.plano.findUnique({
      where: { id },
    });
    if (!plano) {
      throw new Error('Plano nao encontrado');
    }
    return plano;
  }

  async criarPlano(data: criarPlanoSchema) {
    return this.prisma.plano.create({
      data: {
        ...data,
        precoMensal: data.precoMensal ? String(data.precoMensal) : undefined,
        precoAnual: data.precoAnual ? String(data.precoAnual) : undefined,
        precoDefinitivo: data.precoDefinitivo ? String(data.precoDefinitivo) : undefined,
      },
    });
  }

  async atualizarPlano(id: string, data: atualizarPlanoSchema) {
    await this.buscarPlanoPorId(id);
    
    return this.prisma.plano.update({
      where: { id },
      data: {
        ...data,
        precoMensal: data.precoMensal ? String(data.precoMensal) : undefined,
        precoAnual: data.precoAnual ? String(data.precoAnual) : undefined,
        precoDefinitivo: data.precoDefinitivo ? String(data.precoDefinitivo) : undefined,
      },
    });
  }

  async deletarPlano(id: string) {
    await this.buscarPlanoPorId(id);
    
    // Soft delete - apenas desativa
    return this.prisma.plano.update({
      where: { id },
      data: { ativo: false },
    });
  }

  // ==================== LICENÇAS ====================

  async listarLicencas(empresaId?: string) {
    return this.prisma.licenca.findMany({
      where: empresaId ? { empresaId } : undefined,
      include: {
        empresa: true,
        plano: true,
      },
      orderBy: { dataCriacao: 'desc' },
    });
  }

  async buscarLicencaPorId(id: string) {
    const licenca = await this.prisma.licenca.findUnique({
      where: { id },
      include: {
        empresa: true,
        plano: true,
        logs: { orderBy: { dataCriacao: 'desc' } },
      },
    });
    if (!licenca) {
      throw new Error('Licenca nao encontrada');
    }
    return licenca;
  }

  async buscarLicencaPorChave(chave: string) {
    const licenca = await this.prisma.licenca.findUnique({
      where: { chave },
      include: {
        empresa: true,
        plano: true,
      },
    });
    return licenca;
  }

  async buscarLicencaAtiva(empresaId: string) {
    const licenca = await this.prisma.licenca.findFirst({
      where: { 
        empresaId,
        status: 'ATIVA',
        OR: [
          { dataExpiracao: null },
          { dataExpiracao: { gte: new Date() } }
        ]
      },
      include: {
        empresa: true,
        plano: true,
      },
      orderBy: { dataCriacao: 'desc' },
    });
    return licenca;
  }

  async ativarLicenca(data: ativarLicencaSchema & { chave?: string }) {
    // Verificar se empresa existe
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: data.empresaId },
    });
    if (!empresa) {
      throw new Error('Empresa nao encontrada');
    }

    // Verificar se plano existe
    const plano = await this.buscarPlanoPorId(data.planoId);

    // Gerar chave se nao informada
    const chave = data.chave || this.gerarChaveLicenca();

    // Calcular data de expiracao
    let dataExpiracao: Date | null = null;
    if (data.tipoCobranca !== 'DEFINITIVO') {
      const meses = data.tipoCobranca === 'ANUAL' ? 12 : 1;
      dataExpiracao = new Date();
      dataExpiracao.setMonth(dataExpiracao.getMonth() + meses);
    }

    // Criar licença
    const licenca = await this.prisma.licenca.create({
      data: {
        empresaId: data.empresaId,
        planoId: data.planoId,
        chave,
        tipoCobranca: data.tipoCobranca,
        dataInicio: new Date(),
        dataExpiracao,
        status: 'ATIVA',
        limiteUsuarios: plano.limiteUsuarios,
        limiteClientes: plano.limiteClientes,
        limiteProdutos: plano.limiteProdutos,
        limiteNotasFiscais: plano.limiteNotasFiscais,
        limiteEmpresas: plano.limiteEmpresas,
        moduloCrm: plano.moduloCrm,
        moduloAutomacao: plano.moduloAutomacao,
        moduloMultiEmpresa: plano.moduloMultiEmpresa,
        moduloApi: plano.moduloApi,
      },
      include: {
        empresa: true,
        plano: true,
      },
    });

    // Criar log
    await this.prisma.licencaLog.create({
      data: {
        licencaId: licenca.id,
        acao: 'ATIVACAO',
        descricao: `Licenca ativada - Plano ${plano.nome}`,
      },
    });

    return licenca;
  }

  async renewLicenca(data: renewalLicencaSchema) {
    const licenca = await this.buscarLicencaPorId(data.licencaId);

    // Calcular nova data de expiracao
    let novaDataExpiracao = licenca.dataExpiracao || new Date();
    if (data.tipoCobranca === 'ANUAL') {
      novaDataExpiracao.setFullYear(novaDataExpiracao.getFullYear() + 1);
    } else if (data.tipoCobranca === 'MENSAL') {
      novaDataExpiracao.setMonth(novaDataExpiracao.getMonth() + 1);
    }

    // Atualizar licença
    const licencaAtualizada = await this.prisma.licenca.update({
      where: { id: data.licencaId },
      data: {
        dataExpiracao: novaDataExpiracao,
        dataPagamento: new Date(),
        valorPago: String(data.valorPago),
        status: 'ATIVA',
        tipoCobranca: data.tipoCobranca,
      },
      include: {
        empresa: true,
        plano: true,
      },
    });

    // Criar log
    await this.prisma.licencaLog.create({
      data: {
        licencaId: data.licencaId,
        acao: 'RENOVACAO',
        descricao: `Licenca renovada - ${data.tipoCobranca}`,
        valor: String(data.valorPago),
      },
    });

    return licencaAtualizada;
  }

  async verificarAcesso(empresaId: string, modulo: string): Promise<boolean> {
    const licenca = await this.buscarLicencaAtiva(empresaId);
    
    if (!licenca) {
      return false;
    }

    // Módulos disponíveis em todos os planos
    const modulosBasicos = ['cadastros', 'vendas', 'estoque', 'financeiro', 'nfe', 'nfce'];
    if (modulosBasicos.includes(modulo)) {
      return true;
    }

    // Módulos controlados por licença
    switch (modulo) {
      case 'crm':
        return licenca.moduloCrm;
      case 'automacao':
        return licenca.moduloAutomacao;
      case 'multiempresa':
        return licenca.moduloMultiEmpresa;
      case 'api':
        return licenca.moduloApi;
      case 'boletos':
        return licenca.plano.moduloBoletos;
      case 'nfse':
        return licenca.plano.moduloNfse;
      case 'ecf':
        return licenca.plano.moduloEcf;
      case 'dre':
        return licenca.plano.moduloDre;
      case 'planocontas':
        return licenca.plano.moduloPlanoContas;
      default:
        return false;
    }
  }

  async verificarLimite(empresaId: string, tipo: string): Promise<{ permitido: boolean; atual: number; limite: number }> {
    const licenca = await this.buscarLicencaAtiva(empresaId);
    
    if (!licenca) {
      return { permitido: false, atual: 0, limite: 0 };
    }

    let limite = 0;
    let atual = 0;

    switch (tipo) {
      case 'usuarios':
        limite = licenca.limiteUsuarios || 0;
        atual = licenca.usuariosAtivos;
        break;
      case 'clientes':
        limite = licenca.limiteClientes || 0;
        atual = licenca.clientesAtivos;
        break;
      case 'produtos':
        limite = licenca.limiteProdutos || 0;
        atual = licenca.produtosAtivos;
        break;
      case 'notas':
        limite = licenca.limiteNotasFiscais || 0;
        atual = licenca.notasEsteMes;
        break;
    }

    return {
      permitido: atual < limite,
      atual,
      limite,
    };
  }

  async getInfoLicenca(empresaId: string) {
    const licenca = await this.buscarLicencaAtiva(empresaId);
    
    if (!licenca) {
      return null;
    }

    // Buscar contagens atuais
    const [totalClientes, totalProdutos, totalUsuarios] = await Promise.all([
      this.prisma.cliente.count({ where: { empresaId } }),
      this.prisma.produto.count({ where: { empresaId } }),
      this.prisma.usuario.count({ where: { empresaId } }),
    ]);

    // Calcular dias restantes
    let diasRestantes = null;
    if (licenca.dataExpiracao) {
      const diff = licenca.dataExpiracao.getTime() - new Date().getTime();
      diasRestantes = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    return {
      ...licenca,
      contagens: {
        clientes: { atual: totalClientes, limite: licenca.limiteClientes },
        produtos: { atual: totalProdutos, limite: licenca.limiteProdutos },
        usuarios: { atual: totalUsuarios, limite: licenca.limiteUsuarios },
        notas: { atual: licenca.notasEsteMes, limite: licenca.limiteNotasFiscais },
      },
      diasRestantes,
      modulos: {
        crm: licenca.moduloCrm,
        automacao: licenca.moduloAutomacao,
        multiEmpresa: licenca.moduloMultiEmpresa,
        api: licenca.moduloApi,
        boletos: licenca.plano.moduloBoletos,
        nfse: licenca.plano.moduloNfse,
        ecf: licenca.plano.moduloEcf,
        dre: licenca.plano.moduloDre,
        planoContas: licenca.plano.moduloPlanoContas,
      },
    };
  }

  private gerarChaveLicenca(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let chave = '';
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) chave += '-';
      chave += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return chave;
  }

  // ==================== SEEDER DE PLANOS PADRÃO ====================

  async seedLicencasParaEmpresas(planoId?: string) {
    const empresas = await this.prisma.empresa.findMany();

    if (empresas.length === 0) {
      return { message: 'Nenhuma empresa encontrada para vincular licenca' };
    }

    let plano = planoId
      ? await this.prisma.plano.findUnique({ where: { id: planoId } })
      : await this.prisma.plano.findFirst({ where: { nome: 'BASIC' } });

    if (!plano) {
      return { message: 'Nenhum plano encontrado para criar licenca' };
    }

    let criadas = 0;
    for (const empresa of empresas) {
      const licencaExistente = await this.prisma.licenca.findFirst({
        where: { empresaId: empresa.id, status: 'ATIVA' },
      });
      if (licencaExistente) continue;

      const chave = this.gerarChaveLicenca();
      await this.prisma.licenca.create({
        data: {
          empresaId: empresa.id,
          planoId: plano.id,
          chave,
          tipoCobranca: 'DEFINITIVO',
          dataInicio: new Date(),
          dataExpiracao: null,
          status: 'ATIVA',
          limiteUsuarios: plano.limiteUsuarios,
          limiteClientes: plano.limiteClientes,
          limiteProdutos: plano.limiteProdutos,
          limiteNotasFiscais: plano.limiteNotasFiscais,
          limiteEmpresas: plano.limiteEmpresas,
          moduloCrm: plano.moduloCrm,
          moduloAutomacao: plano.moduloAutomacao,
          moduloMultiEmpresa: plano.moduloMultiEmpresa,
          moduloApi: plano.moduloApi,
          usuariosAtivos: 0,
          clientesAtivos: 0,
          produtosAtivos: 0,
          notasEsteMes: 0,
        },
      });
      criadas++;
    }

    return { message: `Licencas criadas para ${criadas} empresas` };
  }

  async seedPlanosPadrao() {
    const planosExistentes = await this.prisma.plano.count();
    if (planosExistentes > 0) {
      return { message: 'Planos ja existem' };
    }

    const planos = [
      {
        nome: 'BASIC',
        descricao: 'Plano basico com todas as funcoes essenciais do ERP',
        tipoCobranca: 'MENSAL' as const,
        precoMensal: '97.00',
        precoAnual: '970.00',
        precoDefinitivo: '1997.00',
        limiteUsuarios: 3,
        limiteClientes: 500,
        limiteProdutos: 1000,
        limiteNotasFiscais: 500,
        limiteEmpresas: 1,
        moduloCrm: true,
        moduloAutomacao: false,
        moduloMultiEmpresa: false,
        moduloApi: false,
        moduloBoletos: true,
        moduloNfse: true,
        moduloEcf: true,
        moduloDre: true,
        moduloPlanoContas: true,
        ordem: 1,
      },
      {
        nome: 'PROFISSIONAL',
        descricao: 'Plano profissional com CRM e funcoes avancadas',
        tipoCobranca: 'MENSAL' as const,
        precoMensal: '197.00',
        precoAnual: '1970.00',
        precoDefinitivo: '3997.00',
        limiteUsuarios: 10,
        limiteClientes: 3000,
        limiteProdutos: 5000,
        limiteNotasFiscais: 2000,
        limiteEmpresas: 3,
        moduloCrm: true,
        moduloAutomacao: false,
        moduloMultiEmpresa: true,
        moduloApi: false,
        moduloBoletos: true,
        moduloNfse: true,
        moduloEcf: true,
        moduloDre: true,
        moduloPlanoContas: true,
        ordem: 2,
      },
      {
        nome: 'PREMIUM',
        descricao: 'Plano premium com todos os modulos e recursos',
        tipoCobranca: 'MENSAL' as const,
        precoMensal: '397.00',
        precoAnual: '3970.00',
        precoDefinitivo: '7997.00',
        limiteUsuarios: 50,
        limiteClientes: 10000,
        limiteProdutos: 20000,
        limiteNotasFiscais: 10000,
        limiteEmpresas: 10,
        moduloCrm: true,
        moduloAutomacao: true,
        moduloMultiEmpresa: true,
        moduloApi: true,
        moduloBoletos: true,
        moduloNfse: true,
        moduloEcf: true,
        moduloDre: true,
        moduloPlanoContas: true,
        ordem: 3,
      },
    ];

    for (const plano of planos) {
      await this.prisma.plano.create({ data: plano });
    }

    const planoBasic = await this.prisma.plano.findFirst({ where: { nome: 'BASIC' } });
    if (planoBasic) {
      await this.seedLicencasParaEmpresas(planoBasic.id);
    }

    return { message: 'Planos criados com sucesso', planos };
  }
}
