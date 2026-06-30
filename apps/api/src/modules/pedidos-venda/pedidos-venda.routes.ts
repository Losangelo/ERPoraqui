import { Router } from 'express';
import { PedidosVendaController } from './pedidos-venda.controller';
import { PedidosVendaService } from './pedidos-venda.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const service = new PedidosVendaService();
const controller = new PedidosVendaController(service);

router.use(authMiddleware);

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.patch('/:id/cancelar', controller.cancelar);
router.patch('/:id/aprovar', controller.aprovar);
router.patch('/:id/enviar', controller.enviar);

export default router;
