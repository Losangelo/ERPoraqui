import { Response } from 'express';
import { UnidadesMedidaService } from './unidades-medida.service';
import { UnidadeMedidaSchema, UnidadeMedidaUpdateSchema, UnidadeMedidaFiltroSchema } from './dto/unidade-medida.dto';
import { AuthRequest } from '@/shared/middleware/auth.middleware';

export class UnidadesMedidaController {
  constructor(private readonly service: UnidadesMedidaService) {}

  criar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }

      const dados = UnidadeMedidaSchema.parse(req.body);
      const resultado = await this.service.criar(empresaId, dados);

      return res.status(201).json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message || 'Erro ao criar unidade de medida',
        },
      });
    }
  };

  listar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }

      const filtros = UnidadeMedidaFiltroSchema.parse({
        ...req.query,
        pagina: req.query.pagina ? Number(req.query.pagina) : 1,
        limite: req.query.limite ? Number(req.query.limite) : 20,
      });

      const resultado = await this.service.listar(empresaId, filtros);

      return res.json({
        success: true,
        data: resultado.dados,
        meta: resultado.meta,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message || 'Erro ao listar unidades de medida',
        },
      });
    }
  };

  buscarPorId = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }

      const { id } = req.params;
      const resultado = await this.service.buscarPorId(id, empresaId);

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: error.message || 'Unidade de medida não encontrada',
        },
      });
    }
  };

  atualizar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }

      const { id } = req.params;
      const dados = UnidadeMedidaUpdateSchema.parse(req.body);
      const resultado = await this.service.atualizar(id, empresaId, dados);

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message || 'Erro ao atualizar unidade de medida',
        },
      });
    }
  };

  excluir = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }

      const { id } = req.params;
      const resultado = await this.service.excluir(id, empresaId);

      return res.json({
        success: true,
        ...resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao excluir unidade de medida',
        },
      });
    }
  };

  listarAtivas = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }

      const resultado = await this.service.listarAtivas(empresaId);

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao listar unidades de medida',
        },
      });
    }
  };
}
