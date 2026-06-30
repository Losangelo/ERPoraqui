import { z } from 'zod';

export const criarParametroSchema = z.object({
  chave: z.string().min(1, 'Chave é obrigatória').max(100),
  valor: z.string().min(1, 'Valor é obrigatório'),
  descricao: z.string().optional(),
  tipo: z.enum(['TEXTO', 'NUMERO', 'BOOLEANO', 'DATA', 'JSON']).default('TEXTO'),
  modulo: z.enum(['GERAL', 'CADASTROS', 'VENDAS', 'COMPRAS', 'ESTOQUE', 'FINANCEIRO', 'FISCAL', 'NF_E', 'RELATORIOS']),
  ativo: z.boolean().default(true),
});

export const atualizarParametroSchema = criarParametroSchema.partial();

export type CriarParametroInput = z.infer<typeof criarParametroSchema>;
export type AtualizarParametroInput = z.infer<typeof atualizarParametroSchema>;

export const parametroResponseSchema = z.object({
  id: z.string(),
  empresaId: z.string(),
  chave: z.string(),
  valor: z.string(),
  descricao: z.string().nullable(),
  tipo: z.string(),
  modulo: z.string(),
  ativo: z.boolean(),
  dataCriacao: z.date(),
  dataAtualizacao: z.date(),
});

export type ParametroResponse = z.infer<typeof parametroResponseSchema>;

// Parâmetros comuns do sistema
export const PARAMETROS_PADRAO = {
  // Geral
  'EMPRESA_PADRAO': { tipo: 'TEXTO' as const, modulo: 'GERAL' as const, descricao: 'Empresa padrão do sistema' },
  'MOEDA_PADRAO': { tipo: 'TEXTO' as const, modulo: 'GERAL' as const, descricao: 'Moeda padrão do sistema', valor: 'BRL' },
  'DECIMAIS_QUANTIDADE': { tipo: 'NUMERO' as const, modulo: 'GERAL' as const, descricao: 'Casas decimais para quantidade', valor: '4' },
  'DECIMAIS_VALOR': { tipo: 'NUMERO' as const, modulo: 'GERAL' as const, descricao: 'Casas decimais para valores', valor: '2' },
  
  // Vendas
  'VENDAS_PERMITIR_DESCONTO': { tipo: 'BOOLEANO' as const, modulo: 'VENDAS' as const, descricao: 'Permitir desconto nas vendas', valor: 'true' },
  'VENDAS_DESCONTO_MAXIMO': { tipo: 'NUMERO' as const, modulo: 'VENDAS' as const, descricao: 'Desconto máximo permitido (%)', valor: '10' },
  'VENDAS_OBRIGAR_CLIENTE': { tipo: 'BOOLEANO' as const, modulo: 'VENDAS' as const, descricao: 'Obrigar cliente na venda', valor: 'true' },
  'VENDAS_OBRIGAR_VENDEDOR': { tipo: 'BOOLEANO' as const, modulo: 'VENDAS' as const, descricao: 'Obrigar vendedor na venda', valor: 'false' },
  
  // Estoque
  'ESTOQUE_CONTROLAR': { tipo: 'BOOLEANO' as const, modulo: 'ESTOQUE' as const, descricao: 'Controlar estoque', valor: 'true' },
  'ESTOQUE_BLOQUEAR_SEM': { tipo: 'BOOLEANO' as const, modulo: 'ESTOQUE' as const, descricao: 'Bloquear venda sem estoque', valor: 'true' },
  'ESTOQUE_ESTOQUE_NEGATIVO': { tipo: 'BOOLEANO' as const, modulo: 'ESTOQUE' as const, descricao: 'Permitir estoque negativo', valor: 'false' },
  
  // Fiscal
  'NF_E_AMBIENTE': { tipo: 'TEXTO' as const, modulo: 'NF_E' as const, descricao: 'Ambiente NF-e (1=Produção, 2=Homologação)', valor: '2' },
  'NF_E_CERTIFICADO': { tipo: 'TEXTO' as const, modulo: 'NF_E' as const, descricao: 'Caminho do certificado digital' },
  'NF_E_SENHA_CERTIFICADO': { tipo: 'TEXTO' as const, modulo: 'NF_E' as const, descricao: 'Senha do certificado digital' },
  'NF_E_IBPT_TOKEN': { tipo: 'TEXTO' as const, modulo: 'NF_E' as const, descricao: 'Token IBPT para tributária' },
};
