import { Router } from 'express';
import { LicencasService } from './licencas.service';
import { prisma } from '../../database/prisma.service';

const router = Router();
const service = new LicencasService(prisma);

// ==================== PLANOS ====================

router.get('/planos', async (req: any, res) => {
  try {
    const result = await service.listarPlanos();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/planos/:id', async (req: any, res) => {
  try {
    const result = await service.buscarPlanoPorId(req.params.id);
    res.json(result);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/planos', async (req: any, res) => {
  try {
    const result = await service.criarPlano(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/planos/:id', async (req: any, res) => {
  try {
    const result = await service.atualizarPlano(req.params.id, req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/planos/:id', async (req: any, res) => {
  try {
    await service.deletarPlano(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== LICENÇAS ====================

router.get('/', async (req: any, res) => {
  try {
    const { empresaId } = req.query;
    const result = await service.listarLicencas(empresaId as string);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/minha', async (req: any, res) => {
  try {
    const empresaId = req.user?.empresaId;
    const result = await service.getInfoLicenca(empresaId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/verificar/:modulo', async (req: any, res) => {
  try {
    const { modulo } = req.params;
    const empresaId = req.user?.empresaId;
    const temAcesso = await service.verificarAcesso(empresaId, modulo);
    res.json({ modulo, acesso: temAcesso });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/limite/:tipo', async (req: any, res) => {
  try {
    const { tipo } = req.params;
    const empresaId = req.user?.empresaId;
    const result = await service.verificarLimite(empresaId, tipo);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req: any, res) => {
  try {
    const result = await service.buscarLicencaPorId(req.params.id);
    res.json(result);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/ativar', async (req: any, res) => {
  try {
    const result = await service.ativarLicenca(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/renovar', async (req: any, res) => {
  try {
    const result = await service.renewLicenca(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== SEED ====================

router.post('/seed-planos', async (req: any, res) => {
  try {
    const result = await service.seedPlanosPadrao();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PÚBLICO ====================

router.get('/publica/validar/:chave', async (req: any, res) => {
  try {
    const { chave } = req.params;
    const licenca = await service.buscarLicencaPorChave(chave);
    if (!licenca) {
      return res.json({ valida: false, message: 'Chave invalida' });
    }
    
    const valida = licenca.status === 'ATIVA' && 
      (!licenca.dataExpiracao || new Date(licenca.dataExpiracao) >= new Date());
    
    res.json({
      valida,
      empresa: (licenca as any).empresa?.razaoSocial,
      plano: (licenca as any).plano?.nome,
      expiracao: licenca.dataExpiracao,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
