import { Router } from 'express';
import { PedidosCompraController } from './pedidos-compra.controller';
import { PedidosCompraService } from './pedidos-compra.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const service = new PedidosCompraService();
const controller = new PedidosCompraController(service);

router.use(authMiddleware);

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.patch('/:id/cancelar', controller.cancelar);

export default router;
