import { Router } from 'express';
import { ProdutosVariacoesController } from './produtos-variacoes.controller';
import { ProdutosVariacoesService } from './produtos-variacoes.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const service = new ProdutosVariacoesService();
const controller = new ProdutosVariacoesController(service);

router.use(authMiddleware);

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.excluir);
router.patch('/:id/inativar', controller.inativar);
router.patch('/:id/ativar', controller.ativar);

export default router;
