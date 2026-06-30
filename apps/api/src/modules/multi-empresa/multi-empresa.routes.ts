import { Router } from 'express';
import { MultiEmpresaService } from './multi-empresa.service';
import { prisma } from '@/database/prisma.service';
import { LicencasService } from '@/modules/licencas/licencas.service';
import { authMiddleware } from '@/shared/middleware/auth.middleware';
import { licencaGuard } from '@/shared/middleware/licenca.middleware';

const router = Router();
const multiEmpresaService = new MultiEmpresaService(prisma, new LicencasService(prisma));

router.use(authMiddleware);

router.get('/grupo', async (req: any, res) => {
  try {
    const empresaId = req.usuario?.empresaId;
    const result = await multiEmpresaService.listarEmpresasDoGrupo(empresaId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/vincular', licencaGuard('multiempresa'), async (req: any, res) => {
  try {
    const empresaId = req.usuario?.empresaId;
    const { filialId } = req.body;
    
    if (!filialId) {
      return res.status(400).json({ error: 'ID da empresa filial é obrigatório' });
    }
    
    const result = await multiEmpresaService.vincularEmpresa(empresaId, filialId, req.usuario?.usuarioId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/desvincular/:filialId', licencaGuard('multiempresa'), async (req: any, res) => {
  try {
    const empresaId = req.usuario?.empresaId;
    const { filialId } = req.params;
    
    const result = await multiEmpresaService.desvincularEmpresa(empresaId, filialId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/disponiveis', async (req: any, res) => {
  try {
    const empresaId = req.usuario?.empresaId;
    
    const empresas = await prisma.empresa.findMany({
      where: {
        id: { not: empresaId },
        matrizId: null,
        ativo: true,
      },
      select: {
        id: true,
        razaoSocial: true,
        nomeFantasia: true,
        cnpj: true,
      },
      orderBy: { razaoSocial: 'asc' },
    });
    
    res.json(empresas);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const result = await multiEmpresaService.buscarEmpresaPorId(id);
    res.json(result);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

export const multiEmpresaRoutes = router;
