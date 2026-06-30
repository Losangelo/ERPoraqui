import { Request, Response } from 'express';
import { NFCeService } from './nfce.service';

interface AuthRequest extends Request {
  usuario?: {
    empresaId: string;
    id: string;
  };
}

export class NFCeController {
  private readonly service: NFCeService;

  constructor() {
    this.service = new NFCeService();
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

  async listar(req: Request, res: Response) {
    try {
      const query = req.query;
      const filtros = {
        filialId: query.filialId as string | undefined,
        clienteId: query.clienteId as string | undefined,
        situacao: query.situacao as string | undefined,
        dataInicial: query.dataInicial as string | undefined,
        dataFinal: query.dataFinal as string | undefined,
        pagina: query.pagina as string | undefined,
        limite: query.limite as string | undefined,
      };
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.service.listar(filtros, empresaId);
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

  async assinar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.service.assinar(id, empresaId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async enviar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.service.enviar(id, empresaId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async cancelar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.service.cancelar(id, data, empresaId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async ativarContingencia(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.service.ativarContingencia(id, empresaId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listarPorStatus(req: Request, res: Response) {
    try {
      const { situacao } = req.params;
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.service.listarPorStatus(empresaId, situacao);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async configurar(req: Request, res: Response) {
    try {
      const data = req.body;
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.service.configurar(data, empresaId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async buscarConfiguracao(req: Request, res: Response) {
    try {
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.service.buscarConfiguracao(empresaId);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
