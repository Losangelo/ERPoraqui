import { Router } from 'express';
import { EmpresasController } from './empresas.controller';
import { EmpresasService } from './empresas.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const service = new EmpresasService();
const controller = new EmpresasController(service);

router.use(authMiddleware);

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.get('/:id/filiais', controller.listarFiliais);
router.post('/:id/filiais', controller.criarFilial);
router.get('/:id/filiais/:filialId', controller.buscarFilial);
router.put('/:id/filiais/:filialId', controller.atualizarFilial);
router.delete('/:id/filiais/:filialId', controller.removerFilial);
router.put('/:id', controller.atualizar);
router.patch('/:id/inativar', controller.inativar);
router.patch('/:id/ativar', controller.ativar);

export const empresasRoutes = router;
