import { Router } from 'express';
import { CRMService } from './crm.service';
import { prisma } from '@/database/prisma.service';
import { LicencasService } from '@/modules/licencas/licencas.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';
import { licencaGuard } from '@/shared/middleware/licenca.middleware';

const router = Router();
const crmService = new CRMService(prisma, new LicencasService(prisma));

router.use(authMiddleware);

async function verificarLicenca(req: any, res: any, next: any) {
  try {
    const empresaId = req.usuario?.empresaId;
    const temAcesso = await crmService.verificarAcesso(empresaId);
    
    if (!temAcesso) {
      return res.status(403).json({
        error: 'Módulo CRM não disponível no seu plano',
        codigo: 'CRM_NAO_AUTORIZADO',
        upgradeNecessario: true,
      });
    }
    
    next();
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

router.use(verificarLicenca);

// ==================== DASHBOARD ====================

router.get('/dashboard', async (req: any, res) => {
  try {
    const empresaId = req.usuario?.empresaId;
    const result = await crmService.getDashboard(empresaId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PIPELINES ====================

router.get('/pipelines', async (req: any, res) => {
  try {
    const empresaId = req.usuario?.empresaId;
    const result = await crmService.listarPipelines(empresaId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/pipelines', async (req: any, res) => {
  try {
    const empresaId = req.usuario?.empresaId;
    const result = await crmService.criarPipeline(empresaId, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/pipelines/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const result = await crmService.atualizarPipeline(id, req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/pipelines/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    await crmService.excluirPipeline(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== OPORTUNIDADES ====================

router.get('/oportunidades', async (req: any, res) => {
  try {
    const empresaId = req.usuario?.empresaId;
    const { pipelineId, status, clienteId } = req.query;
    const result = await crmService.listarOportunidades(empresaId, {
      pipelineId: pipelineId as string,
      status: status as string,
      clienteId: clienteId as string,
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/oportunidades/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const result = await crmService.buscarOportunidadePorId(id);
    res.json(result);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/oportunidades', async (req: any, res) => {
  try {
    const empresaId = req.usuario?.empresaId;
    const result = await crmService.criarOportunidade(empresaId, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/oportunidades/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const result = await crmService.atualizarOportunidade(id, req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/oportunidades/:id/mudar-estagio', async (req: any, res) => {
  try {
    const { id } = req.params;
    const { pipelineId } = req.body;
    const result = await crmService.mudarEstagio(id, pipelineId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/oportunidades/:id/ganhar', async (req: any, res) => {
  try {
    const { id } = req.params;
    const { criarPedido } = req.body;
    const result = await crmService.marcarGanha(id, criarPedido);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/oportunidades/:id/perder', async (req: any, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    const result = await crmService.marcarPerdida(id, motivo);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== TAREFAS ====================

router.get('/tarefas', async (req: any, res) => {
  try {
    const empresaId = req.usuario?.empresaId;
    const { oportunidadeId, responsavelId, concluida } = req.query;
    const result = await crmService.listarTarefas(empresaId, {
      oportunidadeId: oportunidadeId as string,
      responsavelId: responsavelId as string,
      concluida: concluida === 'true' ? true : concluida === 'false' ? false : undefined,
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/tarefas', async (req: any, res) => {
  try {
    const empresaId = req.usuario?.empresaId;
    const result = await crmService.criarTarefa(empresaId, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/tarefas/:id/concluir', async (req: any, res) => {
  try {
    const { id } = req.params;
    const result = await crmService.concluirTarefa(id);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== INTERAÇÕES ====================

router.get('/interacoes', async (req: any, res) => {
  try {
    const empresaId = req.usuario?.empresaId;
    const { oportunidadeId, clienteId } = req.query;
    const result = await crmService.listarInteracoes(empresaId, {
      oportunidadeId: oportunidadeId as string,
      clienteId: clienteId as string,
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/interacoes', async (req: any, res) => {
  try {
    const empresaId = req.usuario?.empresaId;
    const usuarioId = req.usuario?.usuarioId;
    const result = await crmService.criarInteracao(empresaId, usuarioId, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== VISÃO 360º ====================

router.get('/cliente/:id/visao-360', async (req: any, res) => {
  try {
    const { id } = req.params;
    const result = await crmService.getVisao360Cliente(id);
    res.json(result);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// ==================== CAMPANHAS (PREMIUM) ====================

router.get('/campanhas', async (req: any, res) => {
  try {
    const empresaId = req.usuario?.empresaId;
    const result = await crmService.listarCampanhas(empresaId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/campanhas/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const result = await crmService.buscarCampanhaPorId(id);
    res.json(result);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/campanhas', async (req: any, res) => {
  try {
    const empresaId = req.usuario?.empresaId;
    const result = await crmService.criarCampanha(empresaId, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/campanhas/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const result = await crmService.atualizarCampanha(id, req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/campanhas/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    await crmService.excluirCampanha(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/campanhas/:id/executar', async (req: any, res) => {
  try {
    const { id } = req.params;
    const result = await crmService.executarCampanha(id);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/campanhas/:id/pausar', async (req: any, res) => {
  try {
    const { id } = req.params;
    const result = await crmService.pausarCampanha(id);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/campanhas/:id/finalizar', async (req: any, res) => {
  try {
    const { id } = req.params;
    const result = await crmService.finalizarCampanha(id);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== SEED ====================

router.post('/seed-pipelines', async (req: any, res) => {
  try {
    const empresaId = req.usuario?.empresaId;
    const result = await crmService.seedPipelinesPadrao(empresaId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export const crmRoutes = router;
