import { Router } from 'express';
import { PlanoContasController } from './plano-contas.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';
import { licencaGuard } from '@/shared/middleware/licenca.middleware';

const router = Router();
const controller = new PlanoContasController();

router.use(authMiddleware);

router.get('/', licencaGuard('planocontas'), controller.listar.bind(controller));
router.get('/:id', licencaGuard('planocontas'), controller.buscarPorId.bind(controller));
router.post('/', licencaGuard('planocontas'), controller.criar.bind(controller));
router.put('/:id', licencaGuard('planocontas'), controller.atualizar.bind(controller));
router.delete('/:id', licencaGuard('planocontas'), controller.excluir.bind(controller));
router.get('/arvore', licencaGuard('planocontas'), controller.listarArvore.bind(controller));

export const planoContasRoutes = router;
