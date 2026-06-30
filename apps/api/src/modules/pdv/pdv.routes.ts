import { Router } from 'express';
import { PdvController } from './pdv.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new PdvController();

router.use(authMiddleware);

router.post('/venda/iniciar', controller.iniciarVenda.bind(controller));
router.post('/venda/:vendaId/itens', controller.adicionarItem.bind(controller));
router.delete('/venda/:vendaId/itens/:produtoId', controller.removerItem.bind(controller));
router.put('/venda/:vendaId/itens/:produtoId/quantidade', controller.atualizarQuantidade.bind(controller));
router.post('/venda/:vendaId/finalizar', controller.finalizarVenda.bind(controller));
router.post('/venda/:vendaId/cancelar', controller.cancelarVenda.bind(controller));

router.get('/produtos', controller.buscarProdutos.bind(controller));
router.get('/produtos/barras/:codigo', controller.buscarPorCodigoBarras.bind(controller));

router.post('/operadores', controller.criarOperador.bind(controller));
router.get('/operadores', controller.listarOperadores.bind(controller));
router.post('/operadores/autenticar', controller.autenticarOperador.bind(controller));

router.post('/caixa/abrir', controller.abrirCaixa.bind(controller));
router.post('/caixa/:caixaId/fechar', controller.fecharCaixa.bind(controller));
router.get('/caixa/aberto', controller.buscarCaixaAberto.bind(controller));

router.get('/vendas', controller.listarVendas.bind(controller));
router.get('/vendas/:vendaId', controller.buscarVenda.bind(controller));

export const pdvRoutes = router;
