import { Router } from 'express';
import { ECFController } from './ecf.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';
import { licencaGuard } from '@/shared/middleware/licenca.middleware';

const router = Router();
const controller = new ECFController();

router.use(authMiddleware);

router.get('/', licencaGuard('ecf'), controller.listarECF.bind(controller));
router.post('/', licencaGuard('ecf'), controller.criarECF.bind(controller));
router.get('/:id', licencaGuard('ecf'), controller.buscarECF.bind(controller));
router.put('/:id', licencaGuard('ecf'), controller.atualizarECF.bind(controller));
router.delete('/:id', licencaGuard('ecf'), controller.excluirECF.bind(controller));

router.get('/:ecfId/reducoes-z', licencaGuard('ecf'), controller.listarReducoesZ.bind(controller));
router.post('/:ecfId/reducao-z', licencaGuard('ecf'), controller.criarReducaoZ.bind(controller));
router.get('/:ecfId/reducao-z/:id', licencaGuard('ecf'), controller.buscarReducaoZ.bind(controller));

router.post('/:ecfId/cupom', licencaGuard('ecf'), controller.abrirCupom.bind(controller));
router.post('/:ecfId/cupom/:cupomId/item', licencaGuard('ecf'), controller.adicionarItem.bind(controller));
router.post('/:ecfId/cupom/:cupomId/finalizar', licencaGuard('ecf'), controller.finalizarCupom.bind(controller));
router.post('/:ecfId/cupom/:cupomId/cancelar', licencaGuard('ecf'), controller.cancelarCupom.bind(controller));

router.get('/:ecfId/cupons', licencaGuard('ecf'), controller.listarCupons.bind(controller));

router.post('/:ecfId/suprimento', licencaGuard('ecf'), controller.criarSuprimento.bind(controller));
router.post('/:ecfId/sangria', licencaGuard('ecf'), controller.criarSangria.bind(controller));

export const ecfRoutes = router;
