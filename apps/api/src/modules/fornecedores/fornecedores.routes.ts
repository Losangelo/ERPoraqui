import { Router } from 'express';
import { FornecedoresController } from './fornecedores.controller';
import { FornecedoresService } from './fornecedores.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const service = new FornecedoresService();
const controller = new FornecedoresController(service);

router.use(authMiddleware);

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.patch('/:id/inativar', controller.inativar);
router.patch('/:id/ativar', controller.ativar);

export default router;
