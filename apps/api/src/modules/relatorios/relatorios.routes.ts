import { Router } from 'express';
import { RelatoriosController } from './relatorios.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new RelatoriosController();

router.use(authMiddleware);

router.get('/data-sources', controller.listarDataSources.bind(controller));
router.get('/data-sources/:id', controller.getDataSource.bind(controller));
router.post('/executar', controller.executar.bind(controller));

router.get('/templates', controller.listarTemplates.bind(controller));
router.get('/templates/:id', controller.buscarTemplate.bind(controller));
router.post('/templates', controller.criarTemplate.bind(controller));
router.put('/templates/:id', controller.atualizarTemplate.bind(controller));
router.delete('/templates/:id', controller.excluirTemplate.bind(controller));

export default router;
