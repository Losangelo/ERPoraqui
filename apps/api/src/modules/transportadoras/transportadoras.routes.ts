import { Router } from 'express';
import { TransportadorasController } from './transportadoras.controller';
import { TransportadorasService } from './transportadoras.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const service = new TransportadorasService();
const controller = new TransportadorasController(service);

router.use(authMiddleware);

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.patch('/:id/inativar', controller.inativar);
router.patch('/:id/ativar', controller.ativar);

export default router;
