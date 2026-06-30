import { Router } from 'express';
import { ChequesController } from './cheques.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new ChequesController();

router.use(authMiddleware);

router.post('/', controller.criar.bind(controller));
router.get('/', controller.listar.bind(controller));
router.get('/dashboard', controller.dashboard.bind(controller));
router.get('/:id', controller.buscarPorId.bind(controller));
router.put('/:id', controller.atualizar.bind(controller));
router.post('/:id/depositar', controller.depositar.bind(controller));
router.post('/:id/compensar', controller.compensar.bind(controller));
router.post('/:id/devolver', controller.devolver.bind(controller));
router.post('/:id/cancelar', controller.cancelar.bind(controller));

export default router;
