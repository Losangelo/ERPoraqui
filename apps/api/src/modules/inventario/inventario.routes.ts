import { Router } from 'express';
import { InventarioController } from './inventario.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new InventarioController();

router.use(authMiddleware);

router.post('/', controller.criar.bind(controller));
router.get('/', controller.listar.bind(controller));
router.get('/:id', controller.buscarPorId.bind(controller));
router.post('/:id/contagem', controller.registrarContagem.bind(controller));
router.post('/:id/conciliar', controller.conciliarItens.bind(controller));
router.post('/:id/ajustar', controller.ajustarDiferenca.bind(controller));
router.post('/:id/cancelar', controller.cancelar.bind(controller));
router.get('/:id/divergencias', controller.relatorioDivergencias.bind(controller));

export const inventarioRoutes = router;
