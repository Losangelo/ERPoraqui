import { Router } from 'express';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';
import { verificarLimiteRecurso } from '@/shared/middleware/licenca.middleware';

const router = Router();
const service = new UsuariosService();
const controller = new UsuariosController(service);

router.use(authMiddleware);

router.post('/', verificarLimiteRecurso('usuarios'), controller.criar);
router.get('/', controller.listar);
router.get('/perfis', controller.listarPerfis);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.patch('/:id/senha', controller.alterarSenha);
router.delete('/:id', controller.excluir);

export const usuariosRoutes = router;
