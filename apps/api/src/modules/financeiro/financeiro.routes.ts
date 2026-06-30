import { Router } from 'express';
import { FinanceiroController } from './financeiro.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new FinanceiroController();

router.use(authMiddleware);

router.post('/contas-receber', controller.criarContaReceber.bind(controller));
router.get('/contas-receber', controller.listarContasReceber.bind(controller));
router.get('/contas-receber/:id', controller.buscarContaReceber.bind(controller));
router.put('/contas-receber/:id', controller.atualizarContaReceber.bind(controller));
router.delete('/contas-receber/:id', controller.excluirContaReceber.bind(controller));
router.post('/contas-receber/:id/receber', controller.receberConta.bind(controller));

router.post('/contas-pagar', controller.criarContaPagar.bind(controller));
router.get('/contas-pagar', controller.listarContasPagar.bind(controller));
router.get('/contas-pagar/:id', controller.buscarContaPagar.bind(controller));
router.put('/contas-pagar/:id', controller.atualizarContaPagar.bind(controller));
router.delete('/contas-pagar/:id', controller.excluirContaPagar.bind(controller));
router.post('/contas-pagar/:id/pagar', controller.pagarConta.bind(controller));

router.post('/contas-bancarias', controller.criarContaBancaria.bind(controller));
router.get('/contas-bancarias', controller.listarContasBancarias.bind(controller));
router.get('/contas-bancarias/:id/movimentacoes', controller.listarMovimentacoesBancarias.bind(controller));
router.get('/contas-bancarias/:id/conciliacoes', controller.listarConciliacoes.bind(controller));

router.post('/movimentacoes-bancarias', controller.criarMovimentacaoBancaria.bind(controller));
router.put('/movimentacoes-bancarias/:id/desconciliar', controller.removerConciliacaoMovimentacao.bind(controller));

router.post('/conciliacoes', controller.criarConciliacao.bind(controller));
router.post('/conciliacoes/movimentacoes', controller.conciliarMovimentacao.bind(controller));

router.get('/dashboard', controller.dashboard.bind(controller));

export default router;
