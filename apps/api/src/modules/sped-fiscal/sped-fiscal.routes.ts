import { Router } from 'express';
import { SpedFiscalController } from './sped-fiscal.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new SpedFiscalController();

router.use(authMiddleware);

router.get('/blocos', controller.listarBlocos.bind(controller));
router.get('/config', controller.getConfig.bind(controller));
router.put('/config', controller.updateConfig.bind(controller));
router.post('/gerar', controller.gerar.bind(controller));
router.get('/', controller.listar.bind(controller));
router.get('/:id', controller.buscarPorId.bind(controller));
router.get('/:id/download', controller.download.bind(controller));

export default router;
