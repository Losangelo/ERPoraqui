import { Router } from 'express';
import { DashboardGerencialController } from './dashboard-gerencial.controller';
import { DashboardGerencialService } from './dashboard-gerencial.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const service = new DashboardGerencialService();
const controller = new DashboardGerencialController(service);

router.use(authMiddleware);

router.get('/', controller.dashboardCompleto);
router.get('/indicadores', controller.indicadoresRapidos);

router.get('/grafico/vendas', controller.graficoVendas);
router.get('/grafico/vendas-dia-semana', controller.graficoVendasDiaSemana);
router.get('/grafico/receitas-despesas', controller.graficoReceitasDespesas);
router.get('/grafico/status-pedidos', controller.graficoStatusPedidos);
router.get('/grafico/estoque-categoria', controller.graficoEstoqueCategoria);
router.get('/grafico/mais-vendidos', controller.graficoMaisVendidos);

export const dashboardGerencialRoutes = router;
