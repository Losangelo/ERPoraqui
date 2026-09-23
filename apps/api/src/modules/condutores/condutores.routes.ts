import { Router } from 'express';
import { CondutoresController } from './condutores.controller';
import { CondutoresService } from './condutores.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const service = new CondutoresService();
const controller = new CondutoresController(service);

router.use(authMiddleware);

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.patch('/:id/inativar', controller.inativar);
router.patch('/:id/ativar', controller.ativar);

export default router;
