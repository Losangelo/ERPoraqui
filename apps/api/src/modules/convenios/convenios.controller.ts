import { Response } from 'express';
import { ConveniosService } from './convenios.service';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import {
  criarConvenioSchema,
  atualizarConvenioSchema,
  convenioFiltroSchema,
} from './dto/convenios.dto';

export class ConveniosController {
  private readonly service = new ConveniosService();

  criar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const dados = criarConvenioSchema.parse(req.body);
      const resultado = await this.service.criar(dados, empresaId);
      return res.status(201).json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  listar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const filtros = convenioFiltroSchema.parse(req.query);
      const resultado = await this.service.listar(filtros, empresaId);
      return res.json({ success: true, data: resultado.data, meta: resultado.meta });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  buscarPorId = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const resultado = await this.service.buscarPorId(req.params.id, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  atualizar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const dados = atualizarConvenioSchema.parse(req.body);
      const resultado = await this.service.atualizar(req.params.id, dados, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  ativar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const resultado = await this.service.ativar(req.params.id, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  suspender = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const resultado = await this.service.suspender(req.params.id, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  encerrar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const resultado = await this.service.encerrar(req.params.id, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  excluir = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const resultado = await this.service.excluir(req.params.id, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };
}
