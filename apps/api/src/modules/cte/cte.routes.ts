import { Router } from 'express';
import { CteController } from './cte.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new CteController();

router.use(authMiddleware);

router.get('/', controller.listar.bind(controller));
router.get('/:id', controller.buscar.bind(controller));
router.post('/', controller.criar.bind(controller));
router.put('/:id', controller.atualizar.bind(controller));
router.delete('/:id', controller.excluir.bind(controller));
router.post('/:id/cancelar', controller.cancelar.bind(controller));

export default router;
