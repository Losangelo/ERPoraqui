import { PrismaService } from '@/database/prisma.service';
import { LicencasService } from '@/modules/licencas/licencas.service';

export class APIPublicaService {
  constructor(
    private prisma: PrismaService,
    private licencasService: LicencasService
  ) {}

  async verificarAcessoAPI(chaveAPI: string): Promise<{ valido: boolean; empresa?: any; modulo?: string }> {
    if (!chaveAPI) {
      return { valido: false };
    }

    const licenca = await this.prisma.licenca.findFirst({
      where: {
        chave: chaveAPI,
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
    });

    if (!licenca) {
      return { valido: false };
    }

    if (!licenca.moduloApi) {
      return { 
        valido: false, 
        empresa: licenca.empresa,
        modulo: 'API não disponível no seu plano'
      };
    }

    return { 
      valido: true, 
      empresa: licenca.empresa 
    };
  }

  async gerarChaveAPI(empresaId: string): Promise<string> {
    const licenca = await this.licencasService.buscarLicencaAtiva(empresaId);
    
    if (!licenca) {
      throw new Error('Licença ativa não encontrada');
    }

    if (!licenca.moduloApi) {
      throw new Error('Módulo API não disponível no seu plano');
    }

    const chave = this.gerarChave();
    
    await this.prisma.licenca.update({
      where: { id: licenca.id },
      data: { chave },
    });

    return chave;
  }

  private gerarChave(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let chave = 'API-';
    for (let i = 0; i < 20; i++) {
      chave += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return chave;
  }

  async listarEndpointsPublicos() {
    return [
      {
        path: '/api/v1/public/clientes',
        metodo: 'GET',
        descricao: 'Listar clientes',
        autenticacao: 'Bearer Token (chave de API)',
      },
      {
        path: '/api/v1/public/clientes/:id',
        metodo: 'GET',
        descricao: 'Buscar cliente por ID',
        autenticacao: 'Bearer Token (chave de API)',
      },
      {
        path: '/api/v1/public/produtos',
        metodo: 'GET',
        descricao: 'Listar produtos',
        autenticacao: 'Bearer Token (chave de API)',
      },
      {
        path: '/api/v1/public/produtos/:id',
        metodo: 'GET',
        descricao: 'Buscar produto por ID',
        autenticacao: 'Bearer Token (chave de API)',
      },
      {
        path: '/api/v1/public/pedidos',
        metodo: 'GET',
        descricao: 'Listar pedidos',
        autenticacao: 'Bearer Token (chave de API)',
      },
      {
        path: '/api/v1/public/pedidos',
        metodo: 'POST',
        descricao: 'Criar pedido',
        autenticacao: 'Bearer Token (chave de API)',
      },
    ];
  }
}
