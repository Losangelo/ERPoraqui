import { Router } from 'express';
import { OrcamentosController } from './orcamentos.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new OrcamentosController();

router.use(authMiddleware);

router.post('/', controller.criar.bind(controller));
router.get('/', controller.listar.bind(controller));
router.get('/:id', controller.buscarPorId.bind(controller));
router.put('/:id', controller.atualizar.bind(controller));
router.delete('/:id', controller.excluir.bind(controller));
router.post('/:id/aprovar', controller.aprobar.bind(controller));
router.post('/:id/reprovar', controller.reprovar.bind(controller));
router.post('/:id/converter', controller.converterEmPedido.bind(controller));
router.post('/expirar', controller.expirarOrcamentosVencidos.bind(controller));

export const orcamentosRoutes = router;
