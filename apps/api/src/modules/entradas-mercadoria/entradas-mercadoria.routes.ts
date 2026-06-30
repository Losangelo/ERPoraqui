import { Router } from 'express';
import { EntradasMercadoriaController } from './entradas-mercadoria.controller';
import { EntradasMercadoriaService } from './entradas-mercadoria.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const service = new EntradasMercadoriaService();
const controller = new EntradasMercadoriaController(service);

router.use(authMiddleware);

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.patch('/:id/confirmar', controller.confirmar);
router.patch('/:id/cancelar', controller.cancelar);

export default router;
