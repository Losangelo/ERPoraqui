import { Router } from 'express';
import { ContratosController } from './contratos.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new ContratosController();

router.use(authMiddleware);

router.post('/', controller.criar.bind(controller));
router.get('/', controller.listar.bind(controller));
router.get('/:id', controller.buscarPorId.bind(controller));
router.put('/:id', controller.atualizar.bind(controller));
router.delete('/:id', controller.excluir.bind(controller));

router.post('/:id/ativar', controller.ativar.bind(controller));
router.post('/:id/suspender', controller.suspender.bind(controller));
router.post('/:id/encerrar', controller.encerrar.bind(controller));

router.get('/:id/medicoes', controller.listarMedicoes.bind(controller));
router.post('/:id/medicoes', controller.criarMedicao.bind(controller));
router.post('/:id/medicoes/:mid/faturar', controller.faturarMedicao.bind(controller));

export default router;
