import { Response } from 'express';
import { OrcamentosService } from './orcamentos.service';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import { 
  criarOrcamentoSchema, 
  atualizarOrcamentoSchema, 
  orcamentoFiltroSchema,
  CriarOrcamentoInput, 
  AtualizarOrcamentoInput, 
  OrcamentoFiltro 
} from './dto/orcamento.dto';
import appLogger, { LogCategory } from '@/shared/logger/logger';

export class OrcamentosController {
  private readonly service = new OrcamentosService();

  criar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const dados = criarOrcamentoSchema.parse(req.body);
      const resultado = await this.service.criar(empresaId, dados);

      return res.status(201).json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      appLogger.error('Erro ao criar orçamento', error, {
        category: LogCategory.API,
        action: 'orcamentos:create',
      });
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao criar orçamento',
        },
      });
    }
  };

  listar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const filtros: OrcamentoFiltro = {
        pagina: Number(req.query.pagina) || 1,
        limite: Number(req.query.limite) || 20,
        clienteId: req.query.clienteId as string | undefined,
        filialId: req.query.filialId as string | undefined,
        situacao: req.query.situacao as any,
        dataInicial: req.query.dataInicial ? new Date(req.query.dataInicial as string) : undefined,
        dataFinal: req.query.dataFinal ? new Date(req.query.dataFinal as string) : undefined,
      };

      const resultado = await this.service.listar(empresaId, filtros);

      return res.json({
        success: true,
        data: resultado.data,
        meta: resultado.meta,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao listar orçamentos',
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

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: error.message || 'Orçamento não encontrado',
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

      const dados = atualizarOrcamentoSchema.parse(req.body);
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
          message: error.message || 'Erro ao atualizar orçamento',
        },
      });
    }
  };

  excluir = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.excluir(id, empresaId);

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao excluir orçamento',
        },
      });
    }
  };

  aprobar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.aprovar(id, empresaId);

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao aprovar orçamento',
        },
      });
    }
  };

  reprovar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.reprovar(id, empresaId);

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao reprovar orçamento',
        },
      });
    }
  };

  converterEmPedido = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.converterEmPedido(id, empresaId);

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao converter orçamento em pedido',
        },
      });
    }
  };

  expirarOrcamentosVencidos = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.expirarOrcamentosVencidos(empresaId);

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao expirar orçamentos',
        },
      });
    }
  };
}
