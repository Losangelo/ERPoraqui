import { Request, Response } from 'express';
import { PlanoContasService } from './plano-contas.service';

interface AuthRequest extends Request {
  usuario?: {
    empresaId: string;
    id: string;
  };
}

export class PlanoContasController {
  private readonly service: PlanoContasService;

  constructor() {
    this.service = new PlanoContasService();
  }

  async listar(req: Request, res: Response) {
    try {
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.service.listar(empresaId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.service.buscarPorId(id, empresaId);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const data = req.body;
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.service.criar(data, empresaId);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.service.atualizar(id, data, empresaId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async excluir(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      await this.service.excluir(id, empresaId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listarArvore(req: Request, res: Response) {
    try {
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.service.listarArvore(empresaId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
