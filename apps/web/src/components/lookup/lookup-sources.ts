import { Cliente } from '@/services/clientes';

export interface LookupColumn {
  key: string;
  label: string;
  width?: string;
  render?: (item: any) => string;
}

export interface LookupSourceConfig {
  endpoint: string;
  searchParam: string;
  valueField: string;
  labelField: string;
  columns: LookupColumn[];
  displayLabel: (item: any) => string;
  filterParams?: Record<string, string>;
}

function cpfCnpj(val?: string) {
  if (!val) return '';
  const digits = val.replace(/\D/g, '');
  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  if (digits.length === 14) {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return val;
}

function telefone(val?: string) {
  if (!val) return '';
  const digits = val.replace(/\D/g, '');
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return val;
}

export const lookupSources: Record<string, LookupSourceConfig> = {
  clientes: {
    endpoint: '/clientes',
    searchParam: 'nome',
    valueField: 'id',
    labelField: 'nome',
    columns: [
      { key: 'nome', label: 'Nome', render: (c: Cliente) => c.nome },
      { key: 'documento', label: 'CPF/CNPJ', render: (c: Cliente) => cpfCnpj(c.documento) },
      { key: 'telefone', label: 'Telefone', render: (c: Cliente) => telefone(c.telefone) },
      { key: 'cidade', label: 'Cidade', render: (c: Cliente) => `${c.cidade || ''}${c.uf ? `/${c.uf}` : ''}` },
    ],
    displayLabel: (c: Cliente) => `${c.nome}${c.documento ? ` (${cpfCnpj(c.documento)})` : ''}`,
  },

  produtos: {
    endpoint: '/produtos',
    searchParam: 'nome',
    valueField: 'id',
    labelField: 'nome',
    columns: [
      { key: 'codigoInterno', label: 'Código', render: (p: any) => p.codigoInterno || '-' },
      { key: 'nome', label: 'Produto', render: (p: any) => p.nome },
      { key: 'ncm', label: 'NCM', render: (p: any) => p.ncm || '-' },
      { key: 'precoVenda', label: 'Preço', render: (p: any) => `R$ ${Number(p.precoVenda || 0).toFixed(2)}` },
    ],
    displayLabel: (p: any) => `${p.nome}${p.codigoInterno ? ` (#${p.codigoInterno})` : ''}`,
  },

  fornecedores: {
    endpoint: '/fornecedores',
    searchParam: 'nome',
    valueField: 'id',
    labelField: 'nome',
    columns: [
      { key: 'nome', label: 'Nome', render: (f: any) => f.nome },
      { key: 'documento', label: 'CNPJ/CPF', render: (f: any) => cpfCnpj(f.documento) },
      { key: 'telefone', label: 'Telefone', render: (f: any) => telefone(f.telefone) },
    ],
    displayLabel: (f: any) => `${f.nome}${f.documento ? ` (${cpfCnpj(f.documento)})` : ''}`,
  },

  vendedores: {
    endpoint: '/vendedores',
    searchParam: 'nome',
    valueField: 'id',
    labelField: 'nome',
    columns: [
      { key: 'nome', label: 'Nome', render: (v: any) => v.nome },
      { key: 'comissao', label: 'Comissão', render: (v: any) => v.percentualComissao ? `${v.percentualComissao}%` : '-' },
    ],
    displayLabel: (v: any) => v.nome,
  },

  transportadoras: {
    endpoint: '/transportadoras',
    searchParam: 'nome',
    valueField: 'id',
    labelField: 'nome',
    columns: [
      { key: 'nome', label: 'Nome', render: (t: any) => t.nome },
      { key: 'documento', label: 'CNPJ/CPF', render: (t: any) => cpfCnpj(t.documento) },
    ],
    displayLabel: (t: any) => `${t.nome}${t.documento ? ` (${cpfCnpj(t.documento)})` : ''}`,
  },
};
