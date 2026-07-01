import { Router } from 'express';
import { MdfeController } from './mdfe.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new MdfeController();

router.use(authMiddleware);

// Veículos
router.get('/veiculos', controller.listarVeiculos.bind(controller));
router.get('/veiculos/:id', controller.buscarVeiculo.bind(controller));
router.post('/veiculos', controller.criarVeiculo.bind(controller));
router.put('/veiculos/:id', controller.atualizarVeiculo.bind(controller));
router.delete('/veiculos/:id', controller.excluirVeiculo.bind(controller));

// Condutores
router.get('/condutores', controller.listarCondutores.bind(controller));
router.get('/condutores/:id', controller.buscarCondutor.bind(controller));
router.post('/condutores', controller.criarCondutor.bind(controller));
router.put('/condutores/:id', controller.atualizarCondutor.bind(controller));
router.delete('/condutores/:id', controller.excluirCondutor.bind(controller));

// MDF-e
router.get('/', controller.listarMdfes.bind(controller));
router.get('/:id', controller.buscarMdfe.bind(controller));
router.post('/', controller.criarMdfe.bind(controller));
router.put('/:id', controller.atualizarMdfe.bind(controller));
router.delete('/:id', controller.excluirMdfe.bind(controller));
router.post('/:id/incluir-documento', controller.incluirDocumento.bind(controller));
router.delete('/:id/documentos/:documentoId', controller.removerDocumento.bind(controller));
router.post('/:id/cancelar', controller.cancelarMdfe.bind(controller));
router.post('/:id/encerrar', controller.encerrarMdfe.bind(controller));

export default router;
