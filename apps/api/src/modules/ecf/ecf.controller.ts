import { Request, Response } from 'express';
import { ECFService } from './ecf.service';

interface AuthRequest extends Request {
  usuario?: { empresaId: string; id: string };
}

export class ECFController {
  private readonly service: ECFService;

  constructor() {
    this.service = new ECFService();
  }

  async listarECF(req: Request, res: Response) {
    try {
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.service.listarECF(empresaId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async criarECF(req: Request, res: Response) {
    try {
      const data = req.body;
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.service.criarECF(data, empresaId);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async buscarECF(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.buscarECF(id);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async atualizarECF(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await this.service.atualizarECF(id, data);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async excluirECF(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.service.excluirECF(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listarReducoesZ(req: Request, res: Response) {
    try {
      const { ecfId } = req.params;
      const result = await this.service.listarReducoesZ(ecfId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async criarReducaoZ(req: Request, res: Response) {
    try {
      const { ecfId } = req.params;
      const data = req.body;
      const result = await this.service.criarReducaoZ(ecfId, data);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async buscarReducaoZ(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.buscarReducaoZ(id);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async abrirCupom(req: Request, res: Response) {
    try {
      const { ecfId } = req.params;
      const data = req.body;
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.service.abrirCupom(ecfId, data, empresaId);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async adicionarItem(req: Request, res: Response) {
    try {
      const { cupomId } = req.params;
      const data = req.body;
      const result = await this.service.adicionarItem(cupomId, data);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async finalizarCupom(req: Request, res: Response) {
    try {
      const { cupomId } = req.params;
      const data = req.body;
      const result = await this.service.finalizarCupom(cupomId, data);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async cancelarCupom(req: Request, res: Response) {
    try {
      const { cupomId } = req.params;
      const data = req.body;
      const result = await this.service.cancelarCupom(cupomId, data);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listarCupons(req: Request, res: Response) {
    try {
      const { ecfId } = req.params;
      const result = await this.service.listarCupons(ecfId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async criarSuprimento(req: Request, res: Response) {
    try {
      const { ecfId } = req.params;
      const data = req.body;
      const result = await this.service.criarSuprimento(ecfId, data);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async criarSangria(req: Request, res: Response) {
    try {
      const { ecfId } = req.params;
      const data = req.body;
      const result = await this.service.criarSangria(ecfId, data);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
