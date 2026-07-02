import { Router } from 'express';
import { AdiantamentoController } from './adiantamentos.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new AdiantamentoController();

router.use(authMiddleware);

router.get('/', controller.listar.bind(controller));
router.get('/:id', controller.buscarPorId.bind(controller));
router.post('/', controller.criar.bind(controller));
router.put('/:id', controller.atualizar.bind(controller));
router.post('/:id/quitar', controller.quitar.bind(controller));
router.post('/:id/cancelar', controller.cancelar.bind(controller));
router.delete('/:id', controller.excluir.bind(controller));

export default router;
