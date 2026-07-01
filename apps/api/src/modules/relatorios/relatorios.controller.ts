import { Response } from 'express';
import { RelatoriosService } from './relatorios.service';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import { z } from 'zod';

const executarSchema = z.object({
  dataSource: z.string(),
  colunas: z.array(z.string()).min(1),
  filtros: z.array(z.any()).optional(),
});

const templateSchema = z.object({
  nome: z.string().min(1).max(100),
  descricao: z.string().optional(),
  dataSource: z.string(),
  colunas: z.array(z.string()).min(1),
  filtros: z.array(z.any()).optional(),
  formato: z.string().optional(),
});

export class RelatoriosController {
  private readonly service = new RelatoriosService();

  listarDataSources = async (_req: AuthRequest, res: Response) => {
    try {
      const sources = this.service.listarDataSources();
      return res.json({ success: true, data: sources });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  getDataSource = async (req: AuthRequest, res: Response) => {
    try {
      const source = this.service.getDataSource(req.params.id);
      if (!source) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Fonte não encontrada' } });
      return res.json({ success: true, data: source });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  executar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const dados = executarSchema.parse(req.body);
      const resultado = await this.service.executar(empresaId, dados.dataSource, dados.colunas, dados.filtros);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  listarTemplates = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const templates = await this.service.listarTemplates(empresaId);
      return res.json({ success: true, data: templates });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  buscarTemplate = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const template = await this.service.buscarTemplate(req.params.id, empresaId);
      return res.json({ success: true, data: template });
    } catch (error: any) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: error.message } });
    }
  };

  criarTemplate = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const dados = templateSchema.parse(req.body);
      const template = await this.service.criarTemplate(empresaId, dados);
      return res.status(201).json({ success: true, data: template });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  atualizarTemplate = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const dados = templateSchema.partial().parse(req.body);
      const template = await this.service.atualizarTemplate(req.params.id, empresaId, dados);
      return res.json({ success: true, data: template });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  excluirTemplate = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const resultado = await this.service.excluirTemplate(req.params.id, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: error.message } });
    }
  };
}
