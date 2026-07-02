import { Router } from 'express';
import { GarantiasController } from './garantias.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new GarantiasController();

router.use(authMiddleware);

router.get('/regras', controller.listarRegras.bind(controller));
router.post('/regras', controller.criarRegra.bind(controller));
router.put('/regras/:id', controller.atualizarRegra.bind(controller));
router.delete('/regras/:id', controller.excluirRegra.bind(controller));

router.post('/', controller.criar.bind(controller));
router.get('/', controller.listar.bind(controller));
router.get('/:id', controller.buscarPorId.bind(controller));
router.put('/:id', controller.atualizar.bind(controller));
router.delete('/:id', controller.excluir.bind(controller));

router.get('/:produtoId/:clienteId/verificar', controller.verificarElegibilidade.bind(controller));

export default router;
