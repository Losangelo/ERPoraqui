import { z } from 'zod';

export const RelatorioFiscalFiltroSchema = z.object({
  tipo: z.enum(['SPED_FISCAL', 'SPED_CONTRIBUICOES', 'RESUMO_NOTAS', 'RESUMO_IMPOSTOS']).optional(),
  dataInicial: z.string().optional(),
  dataFinal: z.string().optional(),
  pagina: z.number().int().positive().default(1),
  limite: z.number().int().positive().max(100).default(20),
});

export type RelatorioFiscalFiltro = z.infer<typeof RelatorioFiscalFiltroSchema>;
