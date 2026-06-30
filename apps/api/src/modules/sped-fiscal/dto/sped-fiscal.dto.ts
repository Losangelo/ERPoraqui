import { z } from 'zod';

export const gerarSpedFiscalSchema = z.object({
  periodoIni: z.date(),
  periodoFin: z.date(),
  observacoes: z.string().optional(),
});

export const gerarSpedContribuicoesSchema = z.object({
  periodoIni: z.date(),
  periodoFin: z.date(),
  observacoes: z.string().optional(),
});

export const spedFiscalFiltroSchema = z.object({
  periodoIni: z.date().optional(),
  periodoFin: z.date().optional(),
  situacao: z.enum(['PENDENTE', 'EM_GERACAO', 'GERADO', 'ENVIADO', 'RECUSADO', 'ACEITO']).optional(),
  pagina: z.number().default(1),
  limite: z.number().default(20),
});

export type GerarSpedFiscalInput = z.infer<typeof gerarSpedFiscalSchema>;
export type GerarSpedContribuicoesInput = z.infer<typeof gerarSpedContribuicoesSchema>;
export type SpedFiscalFiltro = z.infer<typeof spedFiscalFiltroSchema>;
