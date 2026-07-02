import { Router } from 'express';
import { QuitacaoController } from './quitacoes.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new QuitacaoController();

router.use(authMiddleware);

router.get('/', controller.listar.bind(controller));
router.get('/disponiveis', controller.listarContasDisponiveis.bind(controller));
router.get('/:id', controller.buscarPorId.bind(controller));
router.post('/', controller.criar.bind(controller));

export default router;
