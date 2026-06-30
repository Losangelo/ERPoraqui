import { api } from './api';

export interface NotaServico {
  id: string;
  empresaId: string;
  filialId: string;
  clienteId?: string;
  numero: number;
  serie: string;
  codigoVerificacao?: string;
  dataEmissao: string;
  dataPrestacao?: string;
  competencia?: string;
  tipoRps: string;
  naturezaOperacao: string;
  regimeTributario: string;
  optanteSimplesNacional: boolean;
  incentivoFiscal: boolean;
  valorServicos: number;
  valorDeducoes: number;
  valorPis: number;
  valorCofins: number;
  valorInss: number;
  valorIr: number;
  valorCsll: number;
  valorIss: number;
  valorIssRetido: number;
  baseCalculo: number;
  aliquotaIss: number;
  valorTotal: number;
  valorLiquido: number;
  tomadorNome?: string;
  tomadorCnpjCpf?: string;
  tomadorInscricaoMunicipal?: string;
  tomadorEndereco?: string;
  tomadorNumero?: string;
  tomadorComplemento?: string;
  tomadorBairro?: string;
  tomadorCidade?: string;
  tomadorUf?: string;
  tomadorCep?: string;
  tomadorTelefone?: string;
  tomadorEmail?: string;
  servicoproduto?: string;
  codigoMunicipio?: string;
  codigoServico?: string;
  discriminacao?: string;
  situacao: string;
  statusSefaz?: string;
  mensagemSefaz?: string;
  numeroNfse?: string;
  dataAutorizacao?: string;
  protocolo?: string;
  observacoes?: string;
  dataCriacao: string;
  filial?: { id: string; nome: string; razaoSocial: string };
  cliente?: { id: string; nome: string; documento: string };
  itens?: ItemServico[];
}

export interface ItemServico {
  id: string;
  notaServicoId: string;
  numeroItem: number;
  codigo: string;
  discriminacao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  tributavel: boolean;
  issAliquota: number;
  issValor: number;
}

export interface NFSeFiltros {
  empresaId?: string;
  filialId?: string;
  clienteId?: string;
  situacao?: string;
  dataInicial?: string;
  dataFinal?: string;
  pagina?: number;
  limite?: number;
}

export interface CriarNFSeDto {
  empresaId: string;
  filialId: string;
  clienteId?: string;
  competencia?: string;
  tipoRps?: 'RPS' | 'RPS_CONJUGADO' | 'CUPOM';
  naturezaOperacao?: string;
  regimeTributario?: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL' | 'ISENTO';
  optanteSimplesNacional?: boolean;
  incentivoFiscal?: boolean;
  tomadorNome?: string;
  tomadorCnpjCpf?: string;
  tomadorInscricaoMunicipal?: string;
  tomadorEndereco?: string;
  tomadorNumero?: string;
  tomadorComplemento?: string;
  tomadorBairro?: string;
  tomadorCidade?: string;
  tomadorUf?: string;
  tomadorCep?: string;
  tomadorTelefone?: string;
  tomadorEmail?: string;
  servicoproduto?: string;
  codigoMunicipio?: string;
  codigoServico?: string;
  discriminacao?: string;
  observacoes?: string;
  itens?: {
    codigo: string;
    discriminacao: string;
    quantidade?: number;
    valorUnitario: number;
    tributavel?: boolean;
    issAliquota?: number;
  }[];
}

export const nfseService = {
  listar: async (filtros: NFSeFiltros) => {
    const params = new URLSearchParams();
    if (filtros.pagina) params.append('page', filtros.pagina.toString());
    if (filtros.limite) params.append('limit', filtros.limite.toString());
    if (filtros.empresaId) params.append('empresaId', filtros.empresaId);
    const response = await api.get(`/nfse?${params.toString()}`);
    return response.data?.data || response.data || [];
  },

  buscarPorId: async (id: string) => {
    const response = await api.get(`/nfse/${id}`);
    return response.data;
  },

  criar: async (dto: CriarNFSeDto) => {
    const response = await api.post('/nfse', dto);
    return response.data;
  },

  atualizar: async (id: string, dto: Partial<CriarNFSeDto>) => {
    const response = await api.put(`/nfse/${id}`, dto);
    return response.data;
  },

  excluir: async (id: string) => {
    const response = await api.delete(`/nfse/${id}`);
    return response.data;
  },

  listarPorStatus: async (empresaId: string, situacao: string) => {
    const response = await api.get(`/nfse/por-status/${situacao}?empresaId=${empresaId}`);
    return response.data;
  },

  assinar: async (id: string) => {
    const response = await api.post(`/nfse/${id}/assinar`);
    return response.data;
  },

  enviar: async (id: string) => {
    const response = await api.post(`/nfse/${id}/enviar`);
    return response.data;
  },

  cancelar: async (id: string, motivo: string) => {
    const response = await api.post(`/nfse/${id}/cancelar`, { motivo });
    return response.data;
  },
};
