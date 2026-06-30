import { Router } from 'express';
import { ProdutosController } from './produtos.controller';
import { ProdutosService } from './produtos.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';
import { verificarLimiteRecurso } from '@/shared/middleware/licenca.middleware';

const router = Router();
const service = new ProdutosService();
const controller = new ProdutosController(service);

router.use(authMiddleware);

router.post('/', verificarLimiteRecurso('produtos'), controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.patch('/:id/inativar', controller.inativar);
router.patch('/:id/ativar', controller.ativar);

export default router;
