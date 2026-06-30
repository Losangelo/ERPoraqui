import { Router, Request, Response } from 'express';
import appLogger from '../../shared/logger/logger';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { categoria, nivel, busca, pagina, limite, dataInicio, dataFim } = req.query;

    const result = await appLogger.getLogs({
      categoria: categoria as string,
      nivel: nivel as string,
      busca: busca as string,
      pagina: pagina ? Number(pagina) : 1,
      limite: limite ? Number(limite) : 50,
      dataInicio: dataInicio ? new Date(dataInicio as string) : undefined,
      dataFim: dataFim ? new Date(dataFim as string) : undefined,
    });

    res.json(result);
  } catch (error) {
    appLogger.error('Erro ao buscar logs', error as Error, { category: 'api', action: 'logs:list' });
    res.status(500).json({ error: 'Erro ao buscar logs' });
  }
});

router.get('/estatisticas', async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.query;
    const stats = await appLogger.getStats(empresaId as string);
    res.json(stats);
  } catch (error) {
    appLogger.error('Erro ao buscar estatísticas', error as Error, { category: 'api', action: 'logs:stats' });
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

export const logsRoutes = router;
