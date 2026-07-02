import { Router } from 'express';
import { RenegociacaoController } from './renegociacao.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new RenegociacaoController();

router.use(authMiddleware);

router.get('/', controller.listar.bind(controller));
router.get('/disponiveis', controller.listarContasDisponiveis.bind(controller));
router.get('/:id', controller.buscarPorId.bind(controller));
router.post('/', controller.criar.bind(controller));
router.post('/:id/confirmar', controller.confirmar.bind(controller));
router.post('/:id/cancelar', controller.cancelar.bind(controller));

export default router;
