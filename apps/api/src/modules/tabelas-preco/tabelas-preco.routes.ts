import { Router } from 'express';
import { TabelasPrecoController } from './tabelas-preco.controller';
import { TabelasPrecoService } from './tabelas-preco.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const service = new TabelasPrecoService();
const controller = new TabelasPrecoController(service);

router.use(authMiddleware);

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.excluir);
router.post('/:id/itens', controller.adicionarItem);
router.put('/:id/itens/:itemId', controller.atualizarItem);
router.delete('/:id/itens/:itemId', controller.removerItem);
router.post('/:id/calcular', controller.calcularPreco);

export default router;
