import { Router } from 'express';
import { NotasFiscaisController } from './notas-fiscais.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';
import { verificarLimiteRecurso } from '@/shared/middleware/licenca.middleware';

const router = Router();
const controller = new NotasFiscaisController();

router.use(authMiddleware);

router.post('/', verificarLimiteRecurso('notas'), controller.criar.bind(controller));
router.get('/', controller.listar.bind(controller));
router.get('/configuracao', controller.buscarConfiguracao.bind(controller));
router.get('/por-status/:situacao', controller.listarPorStatus.bind(controller));
router.get('/:id', controller.buscarPorId.bind(controller));
router.put('/:id', controller.atualizar.bind(controller));
router.post('/:id/assinar', controller.assinar.bind(controller));
router.post('/:id/enviar', controller.enviar.bind(controller));
router.post('/:id/cancelar', controller.cancelar.bind(controller));
router.post('/:id/carta-correcao', controller.cartaCorrecao.bind(controller));
router.post('/inutilizar', controller.inutilizar.bind(controller));
router.post('/configurar', controller.configurarCertificado.bind(controller));
router.get('/sefaz/status', controller.statusSefaz.bind(controller));

export const notasFiscaisRoutes = router;
