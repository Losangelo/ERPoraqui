import { Router } from 'express';
import { RelatoriosFiscaisController } from './relatorios-fiscais.controller';
import { RelatoriosFiscaisService } from './relatorios-fiscais.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const service = new RelatoriosFiscaisService();
const controller = new RelatoriosFiscaisController(service);

router.use(authMiddleware);

router.get('/resumo-notas', controller.resumoNotas);
router.get('/resumo-impostos', controller.resumoImpostos);
router.get('/sped-fiscal', controller.spedFiscal);
router.get('/sped-contribuicoes', controller.spedContribuicoes);

export const relatoriosFiscaisRoutes = router;
