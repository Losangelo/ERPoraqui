import { Router } from 'express';
import { ConveniosController } from './convenios.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new ConveniosController();

router.use(authMiddleware);

router.post('/', controller.criar.bind(controller));
router.get('/', controller.listar.bind(controller));
router.get('/:id', controller.buscarPorId.bind(controller));
router.put('/:id', controller.atualizar.bind(controller));
router.delete('/:id', controller.excluir.bind(controller));

router.post('/:id/ativar', controller.ativar.bind(controller));
router.post('/:id/suspender', controller.suspender.bind(controller));
router.post('/:id/encerrar', controller.encerrar.bind(controller));

export default router;
