import { Router } from 'express';
import { PromocoesController } from './promocoes.controller';
import { PromocoesService } from './promocoes.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const service = new PromocoesService();
const controller = new PromocoesController(service);

router.use(authMiddleware);

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.excluir);
router.patch('/:id/toggle-ativo', controller.toggleAtivo);
router.get('/calcular-preco/:produtoId', controller.calcularPrecoPromocional);

export default router;
