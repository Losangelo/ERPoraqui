import { PrismaService } from '@/database/prisma.service';
import { LicencasService } from '@/modules/licencas/licencas.service';

export class MultiEmpresaService {
  constructor(
    private prisma: PrismaService,
    private licencasService: LicencasService
  ) {}

  async listarEmpresasDoGrupo(empresaId: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
      include: {
        matriz: {
          include: {
            empresasVinculadas: true,
          },
        },
        empresasVinculadas: true,
      },
    });

    if (!empresa) {
      throw new Error('Empresa não encontrada');
    }

    if (empresa.matrizId) {
      return {
        tipo: 'filial',
        matriz: empresa.matriz,
        empresas: [empresa.matriz, ...empresa.matriz.empresasVinculadas.filter(e => e.id !== empresaId)],
      };
    }

    return {
      tipo: 'matriz',
      matriz: empresa,
      empresas: [empresa, ...empresa.empresasVinculadas],
    };
  }

  async vincularEmpresa(matrizId: string, filialId: string, solicitanteId: string) {
    const matriz = await this.prisma.empresa.findUnique({
      where: { id: matrizId },
    });

    if (!matriz) {
      throw new Error('Empresa matriz não encontrada');
    }

    const filial = await this.prisma.empresa.findUnique({
      where: { id: filialId },
    });

    if (!filial) {
      throw new Error('Empresa a ser vinculada não encontrada');
    }

    if (filial.matrizId && filial.matrizId !== matrizId) {
      throw new Error('Empresa já vinculada a outro grupo');
    }

    const temAcesso = await this.licencasService.verificarAcesso(matrizId, 'multiempresa');
    if (!temAcesso) {
      throw new Error('Módulo multi-empresa não disponível no seu plano');
    }

    const licenca = await this.licencasService.buscarLicencaAtiva(matrizId);
    if (!licenca) {
      throw new Error('Licença ativa não encontrada');
    }

    const empresasAtuais = await this.prisma.empresa.count({
      where: {
        OR: [
          { id: matrizId },
          { matrizId: matrizId },
        ],
      },
    });

    if (empresasAtuais >= 2) {
      throw new Error(`Limite de empresas atingido (${licenca.limiteEmpresas || 2}). Faça upgrade do plano.`);
    }

    const empresaVinculada = await this.prisma.empresa.update({
      where: { id: filialId },
      data: { matrizId },
      include: { matriz: true },
    });

    await this.prisma.licencaLog.create({
      data: {
        licencaId: licenca.id,
        acao: 'VINCULACAO_EMPRESA',
        descricao: `Empresa ${filial.razaoSocial} vinculada ao grupo`,
      },
    });

    return empresaVinculada;
  }

  async desvincularEmpresa(matrizId: string, filialId: string) {
    const filial = await this.prisma.empresa.findUnique({
      where: { id: filialId },
    });

    if (!filial) {
      throw new Error('Empresa não encontrada');
    }

    if (filial.matrizId !== matrizId) {
      throw new Error('Empresa não pertence a este grupo');
    }

    return this.prisma.empresa.update({
      where: { id: filialId },
      data: { matrizId: null },
    });
  }

  async criarEmpresaMatriz(data: criarEmpresaMatrizSchema) {
    const temAcesso = await this.licencasService.verificarAcesso(data.empresaMatrizId || data.usuarioEmpresaId, 'multiempresa');
    if (!temAcesso) {
      throw new Error('Módulo multi-empresa não disponível no seu plano');
    }

    const empresa = await this.prisma.empresa.create({
      data: {
        razaoSocial: data.razaoSocial,
        nomeFantasia: data.nomeFantasia,
        cnpj: data.cnpj,
        inscricaoEstadual: data.inscricaoEstadual,
        inscricaoMunicipal: data.inscricaoMunicipal,
        telefone: data.telefone,
        email: data.email,
        site: data.site,
        regimeTributario: data.regimeTributario,
        endereco: data.endereco,
        matrizId: data.empresaMatrizId,
      },
      include: { matriz: true },
    });

    return empresa;
  }

  async buscarEmpresaPorId(id: string) {
    return this.prisma.empresa.findUnique({
      where: { id },
      include: {
        matriz: true,
        empresasVinculadas: true,
      },
    });
  }

  async verificarPermissaoAcesso(empresaId: string, usuarioId: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      include: { empresa: true },
    });

    if (!usuario) {
      return false;
    }

    if (usuario.empresa.id === empresaId) {
      return true;
    }

    const empresaUsuario = usuario.empresa;
    if (empresaUsuario.matrizId) {
      return empresaUsuario.matrizId === empresaId;
    }

    const empresasVinculadas = await this.prisma.empresa.findMany({
      where: { matrizId: empresaUsuario.id },
    });

    return empresasVinculadas.some(e => e.id === empresaId);
  }
}

export interface criarEmpresaMatrizSchema {
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  telefone?: string;
  email?: string;
  site?: string;
  regimeTributario?: string;
  endereco?: any;
  empresaMatrizId?: string;
  usuarioEmpresaId?: string;
}
