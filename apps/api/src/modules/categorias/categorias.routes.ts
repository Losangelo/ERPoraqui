import { Router } from 'express';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const service = new CategoriasService();
const controller = new CategoriasController(service);

router.use(authMiddleware);

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/arvore', controller.listarArvore);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.excluir);

export const categoriasRoutes = router;
