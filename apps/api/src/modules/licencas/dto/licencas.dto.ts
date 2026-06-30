import { z } from 'zod';

export const criarPlanoSchema = z.object({
  nome: z.string().min(1, 'Nome e obrigatorio'),
  descricao: z.string().optional(),
  tipoCobranca: z.enum(['MENSAL', 'ANUAL', 'DEFINITIVO']),
  precoMensal: z.number().optional(),
  precoAnual: z.number().optional(),
  precoDefinitivo: z.number().optional(),
  limiteUsuarios: z.number().default(5),
  limiteClientes: z.number().default(1000),
  limiteProdutos: z.number().default(5000),
  limiteNotasFiscais: z.number().default(1000),
  moduloCrm: z.boolean().default(false),
  moduloAutomacao: z.boolean().default(false),
  moduloMultiEmpresa: z.boolean().default(false),
  moduloApi: z.boolean().default(false),
  moduloBoletos: z.boolean().default(true),
  moduloNfse: z.boolean().default(true),
  moduloEcf: z.boolean().default(true),
  moduloDre: z.boolean().default(true),
  moduloPlanoContas: z.boolean().default(true),
  ativo: z.boolean().default(true),
  ordem: z.number().default(0),
});

export const atualizarPlanoSchema = criarPlanoSchema.partial();

export const ativarLicencaSchema = z.object({
  empresaId: z.string().min(1, 'Empresa e obrigatoria'),
  planoId: z.string().min(1, 'Plano e obrigatorio'),
  tipoCobranca: z.enum(['MENSAL', 'ANUAL', 'DEFINITIVO']),
  chave: z.string().optional(),
});

export const renewalLicencaSchema = z.object({
  licencaId: z.string().min(1, 'Licenca e obrigatoria'),
  tipoCobranca: z.enum(['MENSAL', 'ANUAL', 'DEFINITIVO']),
  valorPago: z.number().positive('Valor deve ser positivo'),
});

export type CriarPlanoDto = z.infer<typeof criarPlanoSchema>;
export type AtualizarPlanoDto = z.infer<typeof atualizarPlanoSchema>;
export type AtivarLicencaDto = z.infer<typeof ativarLicencaSchema>;
export type RenewalLicencaDto = z.infer<typeof renewalLicencaSchema>;
