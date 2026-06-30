import { Router } from 'express';
import { EstoqueController } from './estoque.controller';
import { EstoqueService } from './estoque.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const service = new EstoqueService();
const controller = new EstoqueController(service);

router.use(authMiddleware);

router.get('/', controller.listar);
router.get('/alertas', controller.alertas);
router.get('/:id', controller.buscarPorId);
router.post('/ajustar', controller.ajustar);

export default router;
