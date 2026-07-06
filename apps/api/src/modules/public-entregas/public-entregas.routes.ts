import { Router } from 'express';
import { PublicEntregasController } from './public-entregas.controller';
import { PublicEntregasService } from './public-entregas.service';

const router = Router();
const service = new PublicEntregasService();
const controller = new PublicEntregasController(service);

router.get('/rastreio/:token', controller.buscarRastreio);
router.get('/avaliar/:token', controller.buscarAvaliacao);
router.post('/avaliar/:token', controller.salvarAvaliacao);

export default router;
