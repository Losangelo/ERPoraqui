import { Router } from 'express';
import { BoletosController } from './boletos.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';
import { licencaGuard } from '@/shared/middleware/licenca.middleware';

const router = Router();
const controller = new BoletosController();

router.use(authMiddleware);

router.post('/', licencaGuard('boletos'), controller.criar.bind(controller));
router.get('/', licencaGuard('boletos'), controller.listar.bind(controller));
router.get('/bancos/listar', licencaGuard('boletos'), controller.listarBancos.bind(controller));
router.get('/:id', licencaGuard('boletos'), controller.buscarPorId.bind(controller));
router.put('/:id', licencaGuard('boletos'), controller.atualizar.bind(controller));
router.post('/:id/baixar', licencaGuard('boletos'), controller.baixar.bind(controller));
router.post('/:id/cancelar', licencaGuard('boletos'), controller.cancelar.bind(controller));
router.post('/:id/segunda-via', licencaGuard('boletos'), controller.gerarSegundaVia.bind(controller));
router.post('/expirar', licencaGuard('boletos'), controller.expirarBoletosVencidos.bind(controller));
router.post('/bancos', licencaGuard('boletos'), controller.criarBanco.bind(controller));

router.post('/:id/remessa', licencaGuard('boletos'), controller.gerarRemessa.bind(controller));
router.post('/remessa/lote', licencaGuard('boletos'), controller.gerarRemessaLote.bind(controller));
router.post('/retorno/processar', licencaGuard('boletos'), controller.processarRetorno.bind(controller));
router.get('/remessa/historico', licencaGuard('boletos'), controller.listarRemessaHistorico.bind(controller));
router.get('/remessa/:id/download', licencaGuard('boletos'), controller.downloadRemessa.bind(controller));

export const boletosRoutes = router;
