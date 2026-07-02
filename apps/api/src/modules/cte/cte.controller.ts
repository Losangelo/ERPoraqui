import { Response } from 'express';
import { CteService } from './cte.service';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import { criarCteSchema, atualizarCteSchema, cteFiltroSchema } from './dto/cte.dto';

export class CteController {
  private readonly service = new CteService();

  listar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const filtros = cteFiltroSchema.parse({
        pagina: Number(req.query.pagina) || 1,
        limite: Number(req.query.limite) || 20,
        situacao: req.query.situacao,
        periodoIni: req.query.periodoIni,
        periodoFin: req.query.periodoFin,
      });
      const resultado = await this.service.listar(filtros, empresaId);
      return res.json({ success: true, ...resultado });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao listar CT-e';
      return res.status(400).json({ success: false, error: { code: 'ERROR', message } });
    }
  };

  buscar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const cte = await this.service.buscar(req.params.id, empresaId);
      return res.json({ success: true, data: cte });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'CT-e não encontrado';
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message } });
    }
  };

  criar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const dados = criarCteSchema.parse(req.body);
      const cte = await this.service.criar(dados, empresaId);
      return res.status(201).json({ success: true, data: cte });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao criar CT-e';
      return res.status(400).json({ success: false, error: { code: 'ERROR', message } });
    }
  };

  atualizar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const dados = atualizarCteSchema.parse(req.body);
      const cte = await this.service.atualizar(req.params.id, dados, empresaId);
      return res.json({ success: true, data: cte });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar CT-e';
      return res.status(400).json({ success: false, error: { code: 'ERROR', message } });
    }
  };

  excluir = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const resultado = await this.service.excluir(req.params.id, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao excluir CT-e';
      return res.status(400).json({ success: false, error: { code: 'ERROR', message } });
    }
  };

  cancelar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const cte = await this.service.cancelar(req.params.id, empresaId);
      return res.json({ success: true, data: cte });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao cancelar CT-e';
      return res.status(400).json({ success: false, error: { code: 'ERROR', message } });
    }
  };
}
