import { Router } from 'express';
import { FluxoCaixaController } from './fluxo-caixa.controller';
import { FluxoCaixaService } from './fluxo-caixa.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const service = new FluxoCaixaService();
const controller = new FluxoCaixaController(service);

router.use(authMiddleware);

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/saldo', controller.saldoAtual);
router.get('/resumo/:data', controller.resumoDiario);
router.get('/categorias', controller.categorias);
router.get('/:id', controller.buscarPorId);

export const fluxoCaixaRoutes = router;
