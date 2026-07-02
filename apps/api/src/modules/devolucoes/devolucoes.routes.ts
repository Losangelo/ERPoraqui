import { Router } from 'express';
import { DevolucoesController } from './devolucoes.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new DevolucoesController();

router.use(authMiddleware);

router.post('/', controller.criar.bind(controller));
router.get('/', controller.listar.bind(controller));
router.get('/:id', controller.buscarPorId.bind(controller));
router.put('/:id', controller.atualizar.bind(controller));
router.delete('/:id', controller.excluir.bind(controller));

router.post('/:id/aprovar', controller.aprovarInspecao.bind(controller));
router.post('/:id/rejeitar', controller.rejeitar.bind(controller));
router.post('/:id/destinar', controller.destinar.bind(controller));

export default router;
