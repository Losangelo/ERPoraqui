import { Router } from 'express';
import { ParametroController } from './parametro.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new ParametroController();

router.use(authMiddleware);

router.post('/', controller.criar.bind(controller));
router.get('/', controller.listar.bind(controller));
router.get('/modulo/:modulo', controller.porModulo.bind(controller));
router.get('/:id', controller.buscarPorId.bind(controller));
router.put('/:id', controller.atualizar.bind(controller));
router.patch('/:id/inativar', controller.inativar.bind(controller));
router.patch('/:id/ativar', controller.ativar.bind(controller));

export const parametrosRoutes = router;
