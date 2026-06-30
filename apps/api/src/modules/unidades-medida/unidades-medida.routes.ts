import { Router } from 'express';
import { UnidadesMedidaController } from './unidades-medida.controller';
import { UnidadesMedidaService } from './unidades-medida.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const service = new UnidadesMedidaService();
const controller = new UnidadesMedidaController(service);

router.use(authMiddleware);

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/ativas', controller.listarAtivas);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.excluir);

export const unidadesMedidaRoutes = router;
