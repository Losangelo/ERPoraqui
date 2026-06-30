import { api } from '@/services/api';

export interface Plano {
  id: string;
  nome: string;
  descricao?: string;
  tipoCobranca: 'MENSAL' | 'ANUAL' | 'DEFINITIVO';
  precoMensal?: string;
  precoAnual?: string;
  precoDefinitivo?: string;
  limiteUsuarios: number;
  limiteClientes: number;
  limiteProdutos: number;
  limiteNotasFiscais: number;
  moduloCrm: boolean;
  moduloAutomacao: boolean;
  moduloMultiEmpresa: boolean;
  moduloApi: boolean;
  moduloBoletos: boolean;
  moduloNfse: boolean;
  moduloEcf: boolean;
  moduloDre: boolean;
  moduloPlanoContas: boolean;
  ativo: boolean;
  ordem: number;
}

export interface Licenca {
  id: string;
  empresaId: string;
  planoId: string;
  chave: string;
  tipoCobranca: string;
  dataInicio: string;
  dataExpiracao?: string;
  status: 'ATIVA' | 'EXPIRADA' | 'CANCELADA' | 'SUSPENSA';
  valorPago?: string;
  dataPagamento?: string;
  limiteUsuarios?: number;
  limiteClientes?: number;
  limiteProdutos?: number;
  limiteNotasFiscais?: number;
  usuariosAtivos: number;
  clientesAtivos: number;
  produtosAtivos: number;
  notasEsteMes: number;
  moduloCrm: boolean;
  moduloAutomacao: boolean;
  moduloMultiEmpresa: boolean;
  moduloApi: boolean;
  empresa?: { razaoSocial: string };
  plano?: Plano;
}

export interface InfoLicenca {
  id: string;
  tipoCobranca: string;
  status: string;
  dataInicio: string;
  dataExpiracao?: string;
  chave: string;
  contagens: {
    clientes: { atual: number; limite: number };
    produtos: { atual: number; limite: number };
    usuarios: { atual: number; limite: number };
    notas: { atual: number; limite: number };
  };
  diasRestantes?: number;
  modulos: {
    crm: boolean;
    automacao: boolean;
    multiEmpresa: boolean;
    api: boolean;
    boletos: boolean;
    nfse: boolean;
    ecf: boolean;
    dre: boolean;
    planoContas: boolean;
  };
  plano?: Plano;
}

export const licencasService = {
  async listarPlanos(): Promise<Plano[]> {
    const { data } = await api.get('/licencas/planos');
    return data;
  },

  async buscarPlano(id: string): Promise<Plano> {
    const { data } = await api.get(`/licencas/planos/${id}`);
    return data;
  },

  async criarPlano(plano: Partial<Plano>): Promise<Plano> {
    const { data } = await api.post('/licencas/planos', plano);
    return data;
  },

  async atualizarPlano(id: string, plano: Partial<Plano>): Promise<Plano> {
    const { data } = await api.put(`/licencas/planos/${id}`, plano);
    return data;
  },

  async deletarPlano(id: string): Promise<void> {
    await api.delete(`/licencas/planos/${id}`);
  },

  async listarLicencas(empresaId?: string): Promise<Licenca[]> {
    const params = empresaId ? { empresaId } : {};
    const { data } = await api.get('/licencas', { params });
    return data;
  },

  async minhaLicenca(): Promise<InfoLicenca | null> {
    const { data } = await api.get('/licencas/minha');
    return data;
  },

  async verificarAcesso(modulo: string): Promise<{ modulo: string; acesso: boolean }> {
    const { data } = await api.get(`/licencas/verificar/${modulo}`);
    return data;
  },

  async verificarLimite(tipo: string): Promise<{ permitido: boolean; atual: number; limite: number }> {
    const { data } = await api.get(`/licencas/limite/${tipo}`);
    return data;
  },

  async ativarLicenca(empresaId: string, planoId: string, tipoCobranca: string): Promise<Licenca> {
    const { data } = await api.post('/licencas/ativar', {
      empresaId,
      planoId,
      tipoCobranca,
    });
    return data;
  },

  async renewLicenca(licencaId: string, tipoCobranca: string, valorPago: number): Promise<Licenca> {
    const { data } = await api.post('/licencas/renovar', {
      licencaId,
      tipoCobranca,
      valorPago,
    });
    return data;
  },

  async validarChave(chave: string): Promise<{ valida: boolean; empresa?: string; plano?: string }> {
    const { data } = await api.get(`/licencas/publica/validar/${chave}`);
    return data;
  },

  async seedPlanos(): Promise<{ message: string }> {
    const { data } = await api.post('/licencas/seed-planos');
    return data;
  },
};
