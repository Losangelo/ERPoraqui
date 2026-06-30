import { Response } from 'express';
import { UsuariosService } from './usuarios.service';
import { UsuarioSchema, UsuarioUpdateSchema, UsuarioFiltroSchema } from './dto/usuario.dto';
import { AuthRequest } from '@/shared/middleware/auth.middleware';

export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  criar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }

      const dados = UsuarioSchema.parse(req.body);
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
          message: error.message || 'Erro ao criar usuário',
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

      const filtros = UsuarioFiltroSchema.parse({
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
          message: error.message || 'Erro ao listar usuários',
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
          message: error.message || 'Usuário não encontrado',
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
      const dados = UsuarioUpdateSchema.parse(req.body);
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
          message: error.message || 'Erro ao atualizar usuário',
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
          message: error.message || 'Erro ao excluir usuário',
        },
      });
    }
  };

  alterarSenha = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }

      const { id } = req.params;
      const { senhaAtual, novaSenha } = req.body;

      if (!senhaAtual || !novaSenha) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Senha atual e nova senha são obrigatórias' },
        });
      }

      const resultado = await this.service.alterarSenha(id, empresaId, senhaAtual, novaSenha);

      return res.json({
        success: true,
        ...resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao alterar senha',
        },
      });
    }
  };

  listarPerfis = async (_req: AuthRequest, res: Response) => {
    try {
      const resultado = await this.service.listarPerfis();

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao listar perfis',
        },
      });
    }
  };
}
