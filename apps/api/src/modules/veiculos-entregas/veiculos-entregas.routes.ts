import { Router } from 'express';
import { VeiculosEntregasController } from './veiculos-entregas.controller';
import { VeiculosEntregasService } from './veiculos-entregas.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const service = new VeiculosEntregasService();
const controller = new VeiculosEntregasController(service);

router.use(authMiddleware);

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.patch('/:id/inativar', controller.inativar);
router.patch('/:id/ativar', controller.ativar);

export default router;
