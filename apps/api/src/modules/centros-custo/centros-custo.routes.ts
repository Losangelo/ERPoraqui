import { Router } from 'express';
import { CentrosCustoController } from './centros-custo.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new CentrosCustoController();

router.use(authMiddleware);

router.post('/', controller.criar.bind(controller));
router.get('/', controller.listar.bind(controller));
router.get('/arvore', controller.arvore.bind(controller));
router.get('/:id', controller.buscarPorId.bind(controller));
router.put('/:id', controller.atualizar.bind(controller));
router.delete('/:id', controller.excluir.bind(controller));

export default router;
