import { Router } from 'express';
import { LicitacoesController } from './licitacoes.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new LicitacoesController();

router.use(authMiddleware);

router.post('/', controller.criar.bind(controller));
router.get('/', controller.listar.bind(controller));
router.get('/:id', controller.buscarPorId.bind(controller));
router.put('/:id', controller.atualizar.bind(controller));
router.delete('/:id', controller.excluir.bind(controller));

router.post('/:id/itens', controller.adicionarItem.bind(controller));
router.delete('/:id/itens/:itemId', controller.removerItem.bind(controller));

export default router;
