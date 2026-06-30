import { Router } from 'express';
import { MovimentacaoEstoqueController } from './movimentacao-estoque.controller';
import { MovimentacaoEstoqueService } from './movimentacao-estoque.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const service = new MovimentacaoEstoqueService();
const controller = new MovimentacaoEstoqueController(service);

router.use(authMiddleware);

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/produto/:produtoId/historico', controller.historicoProduto);
router.get('/:id', controller.buscarPorId);

export const movimentacoesInternasRoutes = router;
