import { Response } from 'express';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import { MovimentacaoEstoqueService } from './movimentacao-estoque.service';
import { MovimentacaoEstoqueSchema, MovimentacaoEstoqueFiltroSchema, HistoricoProdutoSchema } from './dto/movimentacao-estoque.dto';

export class MovimentacaoEstoqueController {
  constructor(private readonly service: MovimentacaoEstoqueService) {}

  criar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }

      const dados = MovimentacaoEstoqueSchema.parse(req.body);
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
          message: error.message || 'Erro ao criar movimentação',
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

      const filtros = MovimentacaoEstoqueFiltroSchema.parse({
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
          message: error.message || 'Erro ao listar movimentações',
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
          message: error.message || 'Movimentação não encontrada',
        },
      });
    }
  };

  historicoProduto = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }

      const { produtoId } = req.params;
      const filtros = HistoricoProdutoSchema.parse(req.query);
      const resultado = await this.service.historicoProduto(produtoId, empresaId, filtros);

      return res.json({
        success: true,
        data: resultado.dados,
        meta: resultado.meta,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao buscar histórico',
        },
      });
    }
  };
}
