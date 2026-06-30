import { Router } from 'express';
import { AutomacaoService } from './automacao.service';
import { prisma } from '@/database/prisma.service';
import { LicencasService } from '@/modules/licencas/licencas.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();
const automacaoService = new AutomacaoService(prisma, new LicencasService(prisma));

router.use(authMiddleware);

async function verificarLicenca(req: any, res: any, next: any) {
  try {
    const empresaId = req.usuario?.empresaId;
    const temAcesso = await automacaoService.verificarAcesso(empresaId);
    
    if (!temAcesso) {
      return res.status(403).json({
        error: 'Módulo Automação não disponível no seu plano',
        codigo: 'AUTOMACAO_NAO_AUTORIZADO',
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
    const result = await automacaoService.getDashboard(empresaId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== AUTOMAÇÕES ====================

router.get('/', async (req: any, res) => {
  try {
    const empresaId = req.usuario?.empresaId;
    const result = await automacaoService.listarAutomacoes(empresaId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const result = await automacaoService.buscarAutomacaoPorId(id);
    if (!result) {
      return res.status(404).json({ error: 'Automação não encontrada' });
    }
    res.json(result);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/', async (req: any, res) => {
  try {
    const empresaId = req.usuario?.empresaId;
    const result = await automacaoService.criarAutomacao(empresaId, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const result = await automacaoService.atualizarAutomacao(id, req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    await automacaoService.excluirAutomacao(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== CONTROLE ====================

router.post('/:id/ativar', async (req: any, res) => {
  try {
    const { id } = req.params;
    const result = await automacaoService.ativarAutomacao(id);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/pausar', async (req: any, res) => {
  try {
    const { id } = req.params;
    const result = await automacaoService.pausarAutomacao(id);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/executar', async (req: any, res) => {
  try {
    const { id } = req.params;
    const result = await automacaoService.executarAutomacao(id);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export const automacaoRoutes = router;
