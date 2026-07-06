import { Router } from 'express';
import { TaxasEntregaController } from './taxas-entrega.controller';
import { TaxasEntregaService } from './taxas-entrega.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const service = new TaxasEntregaService();
const controller = new TaxasEntregaController(service);

router.use(authMiddleware);

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.patch('/:id/inativar', controller.inativar);
router.patch('/:id/ativar', controller.ativar);
router.post('/calcular', controller.calcular);

export default router;
