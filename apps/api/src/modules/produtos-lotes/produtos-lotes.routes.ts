import { Router } from 'express';
import { ProdutosLotesController } from './produtos-lotes.controller';
import { ProdutosLotesService } from './produtos-lotes.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const service = new ProdutosLotesService();
const controller = new ProdutosLotesController(service);

router.use(authMiddleware);

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.patch('/:id/inativar', controller.inativar);
router.post('/:id/ajustar-estoque', controller.ajustarEstoque);

export default router;
