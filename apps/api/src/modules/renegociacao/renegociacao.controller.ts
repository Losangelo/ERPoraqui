import { Response } from 'express';
import { RenegociacaoService } from './renegociacao.service';
import { AuthRequest } from '@/shared/middleware/auth.middleware';

export class RenegociacaoController {
  private readonly service = new RenegociacaoService();

  listar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const resultado = await this.service.listar(empresaId, req.query as any);
      return res.json({ success: true, data: resultado.data, meta: resultado.meta });
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
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  criar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const resultado = await this.service.criar(empresaId, req.body);
      return res.status(201).json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  confirmar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const resultado = await this.service.confirmar(req.params.id, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  cancelar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const resultado = await this.service.cancelar(req.params.id, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  listarContasDisponiveis = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const tipo = req.query.tipo as string;
      const busca = req.query.busca as string | undefined;
      if (!tipo || !['RECEBER', 'PAGAR'].includes(tipo)) {
        return res.status(400).json({ success: false, error: { code: 'INVALID_TYPE', message: 'Tipo deve ser RECEBER ou PAGAR' } });
      }
      const resultado = await this.service.listarContasDisponiveis(empresaId, tipo, busca);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };
}
