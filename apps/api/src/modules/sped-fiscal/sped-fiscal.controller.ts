import { Response } from 'express';
import { SpedFiscalService } from './sped-fiscal.service';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import {
  gerarSpedFiscalSchema,
  spedFiscalFiltroSchema,
  spedConfigSchema,
} from './dto/sped-fiscal.dto';

export class SpedFiscalController {
  private readonly service = new SpedFiscalService();

  gerar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const dados = gerarSpedFiscalSchema.parse(req.body);
      const resultado = await this.service.gerarSpedFiscal(dados, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  listar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const filtros = spedFiscalFiltroSchema.parse({
        pagina: Number(req.query.pagina) || 1,
        limite: Number(req.query.limite) || 20,
        periodoIni: req.query.periodoIni,
        periodoFin: req.query.periodoFin,
        situacao: req.query.situacao,
      });
      const resultado = await this.service.listar(filtros, empresaId);
      return res.json({ success: true, ...resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  buscarPorId = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const resultado = await this.service.buscarPorId(req.params.id, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: error.message } });
    }
  };

  download = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const arquivo = await this.service.download(req.params.id, empresaId);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${arquivo.nome}"`);
      return res.send(arquivo.arquivo);
    } catch (error: any) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: error.message } });
    }
  };

  getConfig = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const config = await this.service.getConfig(empresaId);
      return res.json({ success: true, data: config });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  updateConfig = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const dados = spedConfigSchema.parse(req.body);
      const config = await this.service.updateConfig(empresaId, dados);
      return res.json({ success: true, data: config });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  listarBlocos = async (_req: AuthRequest, res: Response) => {
    try {
      const blocos = this.service.listarBlocos();
      return res.json({ success: true, data: blocos });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };
}
