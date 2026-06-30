import { Router } from 'express';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';
import { verificarLimiteRecurso } from '@/shared/middleware/licenca.middleware';

const router = Router();
const service = new ClientesService();
const controller = new ClientesController(service);

router.use(authMiddleware);

router.post('/', verificarLimiteRecurso('clientes'), controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.patch('/:id/inativar', controller.inativar);
router.patch('/:id/ativar', controller.ativar);

export default router;
