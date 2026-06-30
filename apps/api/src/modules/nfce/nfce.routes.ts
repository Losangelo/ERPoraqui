import { Router } from 'express';
import { NFCeController } from './nfce.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new NFCeController();

router.use(authMiddleware);

router.post('/', controller.criar.bind(controller));
router.get('/', controller.listar.bind(controller));
router.get('/configuracao', controller.buscarConfiguracao.bind(controller));
router.get('/por-status/:situacao', controller.listarPorStatus.bind(controller));
router.get('/:id', controller.buscarPorId.bind(controller));
router.put('/:id', controller.atualizar.bind(controller));
router.post('/:id/assinar', controller.assinar.bind(controller));
router.post('/:id/enviar', controller.enviar.bind(controller));
router.post('/:id/cancelar', controller.cancelar.bind(controller));
router.post('/:id/contingencia', controller.ativarContingencia.bind(controller));
router.post('/configurar', controller.configurar.bind(controller));

export const nfceRoutes = router;
