import { Router } from 'express';
import { NFSeController } from './nfse.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';
import { licencaGuard } from '@/shared/middleware/licenca.middleware';

const router = Router();
const controller = new NFSeController();

router.use(authMiddleware);

router.post('/', licencaGuard('nfse'), controller.criar.bind(controller));
router.get('/', licencaGuard('nfse'), controller.listar.bind(controller));
router.get('/por-status/:situacao', licencaGuard('nfse'), controller.listarPorStatus.bind(controller));
router.get('/:id', licencaGuard('nfse'), controller.buscarPorId.bind(controller));
router.put('/:id', licencaGuard('nfse'), controller.atualizar.bind(controller));
router.delete('/:id', licencaGuard('nfse'), controller.excluir.bind(controller));
router.post('/:id/assinar', licencaGuard('nfse'), controller.assinar.bind(controller));
router.post('/:id/enviar', licencaGuard('nfse'), controller.enviar.bind(controller));
router.post('/:id/cancelar', licencaGuard('nfse'), controller.cancelar.bind(controller));

export const nfseRoutes = router;
