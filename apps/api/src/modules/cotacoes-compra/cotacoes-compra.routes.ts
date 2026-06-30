import { Router } from 'express';
import { CotacoesCompraController } from './cotacoes-compra.controller';
import { CotacoesCompraService } from './cotacoes-compra.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const service = new CotacoesCompraService();
const controller = new CotacoesCompraController(service);

router.use(authMiddleware);

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.patch('/:id/enviar', controller.enviar);
router.post('/:id/responder', controller.responder);
router.patch('/:id/respostas/:respostaId/aprovar', controller.aprobar);
router.patch('/:id/cancelar', controller.cancelar);

export default router;
