import { Router } from 'express';
import { SpedFiscalController } from './sped-fiscal.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new SpedFiscalController();

router.use(authMiddleware);

router.post('/gerar', controller.gerar.bind(controller));
router.get('/', controller.listar.bind(controller));
router.get('/:id', controller.buscarPorId.bind(controller));
router.get('/:id/download', controller.download.bind(controller));
router.post('/contribuicoes/gerar', controller.gerarContribuicoes.bind(controller));
router.get('/contribuicoes', controller.listarContribuicoes.bind(controller));
router.get('/contribuicoes/:id/download', controller.downloadContribuicoes.bind(controller));

export default router;
