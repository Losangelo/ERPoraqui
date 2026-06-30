import { Router } from 'express';
import { APIPublicaService } from './api-publica.service';
import { prisma } from '@/database/prisma.service';
import { LicencasService } from '@/modules/licencas/licencas.service';
import { licencaGuard } from '@/shared/middleware/licenca.middleware';

const router = Router();
const apiService = new APIPublicaService(prisma, new LicencasService(prisma));

router.get('/endpoints', async (req, res) => {
  try {
    const endpoints = await apiService.listarEndpointsPublicos();
    res.json({ 
      message: 'API Pública do ERPoraqui',
      version: '1.0.0',
      endpoints 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/gerar-chave', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.substring(7);
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as {
      empresaId: string;
    };

    const chave = await apiService.gerarChaveAPI(decoded.empresaId);
    res.json({ chave });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.use(licencaGuard('api'));

router.get('/clientes', async (req: any, res) => {
  try {
    const authHeader = req.headers.authorization;
    const chaveAPI = authHeader?.replace('Bearer ', '');
    
    const acesso = await apiService.verificarAcessoAPI(chaveAPI);
    if (!acesso.valido) {
      return res.status(403).json({ error: 'Acesso API não autorizado' });
    }

    const clientes = await prisma.cliente.findMany({
      where: { empresaId: acesso.empresa.id, ativo: true },
      take: 100,
    });

    res.json(clientes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/clientes/:id', async (req: any, res) => {
  try {
    const authHeader = req.headers.authorization;
    const chaveAPI = authHeader?.replace('Bearer ', '');
    
    const acesso = await apiService.verificarAcessoAPI(chaveAPI);
    if (!acesso.valido) {
      return res.status(403).json({ error: 'Acesso API não autorizado' });
    }

    const cliente = await prisma.cliente.findFirst({
      where: { id: req.params.id, empresaId: acesso.empresa.id },
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json(cliente);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/produtos', async (req: any, res) => {
  try {
    const authHeader = req.headers.authorization;
    const chaveAPI = authHeader?.replace('Bearer ', '');
    
    const acesso = await apiService.verificarAcessoAPI(chaveAPI);
    if (!acesso.valido) {
      return res.status(403).json({ error: 'Acesso API não autorizado' });
    }

    const produtos = await prisma.produto.findMany({
      where: { empresaId: acesso.empresa.id, ativo: true },
      take: 100,
    });

    res.json(produtos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/produtos/:id', async (req: any, res) => {
  try {
    const authHeader = req.headers.authorization;
    const chaveAPI = authHeader?.replace('Bearer ', '');
    
    const acesso = await apiService.verificarAcessoAPI(chaveAPI);
    if (!acesso.valido) {
      return res.status(403).json({ error: 'Acesso API não autorizado' });
    }

    const produto = await prisma.produto.findFirst({
      where: { id: req.params.id, empresaId: acesso.empresa.id },
    });

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(produto);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export const apiPublicaRoutes = router;
