import { Router } from 'express';
import { EntregasController } from './entregas.controller';
import { EntregasService } from './entregas.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const service = new EntregasService();
const controller = new EntregasController(service);

router.use(authMiddleware);

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.patch('/:id/agendar', controller.agendar);
router.patch('/:id/saiu-para-entrega', controller.saiuParaEntrega);
router.patch('/:id/entregue', controller.entregue);
router.patch('/:id/tentativa-falhou', controller.tentativaFalhou);
router.patch('/:id/cancelar', controller.cancelar);

export default router;
