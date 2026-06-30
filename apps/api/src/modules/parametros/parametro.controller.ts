import { Response } from 'express';
import { ParametroService } from './parametro.service';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import { 
  criarParametroSchema, 
  atualizarParametroSchema 
} from './dto/parametro.dto';
import appLogger from '@/shared/logger/logger';

export class ParametroController {
  private readonly service = new ParametroService();

  criar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const dados = criarParametroSchema.parse(req.body);
      const resultado = await this.service.criar(empresaId, dados);

      return res.status(201).json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      appLogger.error('Erro ao criar parâmetro', error, {
        category: 'api',
        action: 'parametros:create',
      });
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao criar parâmetro',
        },
      });
    }
  };

  buscarPorId = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.buscarPorId(id, empresaId);

      if (!resultado) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Parâmetro não encontrado' },
        });
      }

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao buscar parâmetro',
        },
      });
    }
  };

  listar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { modulo, ativo, busca } = req.query;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const filtros = {
        modulo: modulo as string | undefined,
        ativo: ativo === 'true' ? true : ativo === 'false' ? false : undefined,
        busca: busca as string | undefined,
      };

      const resultado = await this.service.listar(empresaId, filtros);

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao listar parâmetros',
        },
      });
    }
  };

  atualizar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const dados = atualizarParametroSchema.parse(req.body);
      const resultado = await this.service.atualizar(id, empresaId, dados);

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao atualizar parâmetro',
        },
      });
    }
  };

  inativar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.inativar(id, empresaId);

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao inativar parâmetro',
        },
      });
    }
  };

  ativar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.ativar(id, empresaId);

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao ativar parâmetro',
        },
      });
    }
  };

  porModulo = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { modulo } = req.params;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.obterPorModulo(empresaId, modulo);

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao obter parâmetros do módulo',
        },
      });
    }
  };
}
