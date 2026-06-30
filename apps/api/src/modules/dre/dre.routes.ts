import { Router } from 'express';
import { DREService } from './dre.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';
import { licencaGuard } from '@/shared/middleware/licenca.middleware';

const router = Router();
const dreService = new DREService();

router.use(authMiddleware);

router.get('/', licencaGuard('dre'), dreService.gerarDRE.bind(dreService));
router.get('/mensal', licencaGuard('dre'), dreService.gerarDREMensal.bind(dreService));
router.get('/anual', licencaGuard('dre'), dreService.gerarDREAnual.bind(dreService));
router.get('/comparativo', licencaGuard('dre'), dreService.gerarDREComparativo.bind(dreService));

export const dreRoutes = router;
