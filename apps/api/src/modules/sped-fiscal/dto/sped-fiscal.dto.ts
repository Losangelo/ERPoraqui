import { z } from 'zod';

export const gerarSpedFiscalSchema = z.object({
  periodoIni: z.coerce.date(),
  periodoFin: z.coerce.date(),
  observacoes: z.string().optional(),
  blocos: z.array(z.string()).optional(),
});

export const spedFiscalFiltroSchema = z.object({
  periodoIni: z.coerce.date().optional(),
  periodoFin: z.coerce.date().optional(),
  situacao: z.enum(['PENDENTE', 'EM_GERACAO', 'GERADO', 'ENVIADO', 'RECUSADO', 'ACEITO']).optional(),
  pagina: z.coerce.number().default(1),
  limite: z.coerce.number().default(20),
});

export const spedConfigSchema = z.object({
  versao: z.string().default('017'),
  perfil: z.enum(['A', 'B', 'C']).default('A'),
  finalidade: z.string().default('1'),
  blocosAtivos: z.array(z.string()).default(['0', 'C', 'D', 'E', 'G', 'H']),
  tipoEscrituracao: z.string().default('0'),
  cnpjContador: z.string().optional(),
  contatoContador: z.string().optional(),
});

export type GerarSpedFiscalInput = z.infer<typeof gerarSpedFiscalSchema>;
export type SpedFiscalFiltro = z.infer<typeof spedFiscalFiltroSchema>;
export type SpedConfigInput = z.infer<typeof spedConfigSchema>;
