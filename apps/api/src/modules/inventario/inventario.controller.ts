import { Response } from 'express';
import { InventarioService } from './inventario.service';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import { criarInventarioSchema, iniciarContagemSchema, conciliarItensSchema, ajustarDiferencaSchema, inventarioFiltroSchema, CriarInventarioInput, IniciarContagemInput, ConciliarItensInput, AjustarDiferencaInput, InventarioFiltro } from './dto/inventario.dto';

export class InventarioController {
  private readonly service = new InventarioService();

  criar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const dados = criarInventarioSchema.parse(req.body);
      const resultado = await this.service.criar(empresaId, dados);
      return res.status(201).json({ success: true, data: resultado });
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
      const filtros = inventarioFiltroSchema.parse({
        pagina: Number(req.query.pagina) || 1,
        limite: Number(req.query.limite) || 20,
        filialId: req.query.filialId,
        tipo: req.query.tipo,
        situacao: req.query.situacao,
        dataInicial: req.query.dataInicial ? new Date(req.query.dataInicial as string) : undefined,
        dataFinal: req.query.dataFinal ? new Date(req.query.dataFinal as string) : undefined,
      });
      const resultado = await this.service.listar(empresaId, filtros);
      return res.json({ success: true, data: resultado.data, meta: resultado.meta });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  buscarPorId = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const resultado = await this.service.buscarPorId(id, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: error.message } });
    }
  };

  registrarContagem = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const dados = iniciarContagemSchema.parse(req.body);
      const resultado = await this.service.registrarContagem(id, dados, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  conciliarItens = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const dados = conciliarItensSchema.parse(req.body);
      const resultado = await this.service.conciliarItens(id, dados, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  ajustarDiferenca = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const dados = ajustarDiferencaSchema.parse(req.body);
      const resultado = await this.service.ajustarDiferenca(id, dados, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  cancelar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const resultado = await this.service.cancelar(id, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  relatorioDivergencias = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const resultado = await this.service.relatorioDivergencias(id, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };
}
