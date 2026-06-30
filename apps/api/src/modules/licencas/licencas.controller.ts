import { Request, Response } from 'express';
import { LicencasService } from './licencas.service';
import { 
  criarPlanoSchema, 
  atualizarPlanoSchema, 
  ativarLicencaSchema,
  renewalLicencaSchema 
} from './dto/licencas.dto';

export class LicencasController {
  private service: LicencasService;

  constructor() {
    this.service = new LicencasService();
  }

  // ==================== PLANOS ====================

  async listarPlanos(req: Request, res: Response) {
    try {
      const result = await this.service.listarPlanos();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async buscarPlano(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.buscarPlanoPorId(id);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async criarPlano(req: Request, res: Response) {
    try {
      const data = criarPlanoSchema.parse(req.body);
      const result = await this.service.criarPlano(data);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async atualizarPlano(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = atualizarPlanoSchema.parse(req.body);
      const result = await this.service.atualizarPlano(id, data);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletarPlano(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.service.deletarPlano(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // ==================== LICENÇAS ====================

  async listarLicencas(req: Request, res: Response) {
    try {
      const { empresaId } = req.query;
      const result = await this.service.listarLicencas(empresaId as string);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async minhaLicenca(req: Request, res: Response) {
    try {
      const empresaId = (req as any).user?.empresaId;
      const result = await this.service.getInfoLicenca(empresaId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async verificarAcesso(req: Request, res: Response) {
    try {
      const { modulo } = req.params;
      const empresaId = (req as any).user?.empresaId;
      const temAcesso = await this.service.verificarAcesso(empresaId, modulo);
      res.json({ modulo, acesso: temAcesso });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async verificarLimite(req: Request, res: Response) {
    try {
      const { tipo } = req.params;
      const empresaId = (req as any).user?.empresaId;
      const result = await this.service.verificarLimite(empresaId, tipo);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async buscarLicenca(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.buscarLicencaPorId(id);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async ativarLicenca(req: Request, res: Response) {
    try {
      const data = ativarLicencaSchema.parse(req.body);
      const result = await this.service.ativarLicenca(data);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async renewLicenca(req: Request, res: Response) {
    try {
      const data = renewalLicencaSchema.parse(req.body);
      const result = await this.service.renewLicenca(data);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async seedPlanos(req: Request, res: Response) {
    try {
      const result = await this.service.seedPlanosPadrao();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // ==================== LICENÇA PÚBLICA ====================

  async validarChave(req: Request, res: Response) {
    try {
      const { chave } = req.params;
      const licenca = await this.service.buscarLicencaPorChave(chave);
      if (!licenca) {
        return res.json({ valida: false, message: 'Chave invalida' });
      }
      
      const valida = licenca.status === 'ATIVA' && 
        (!licenca.dataExpiracao || new Date(licenca.dataExpiracao) >= new Date());
      
      res.json({
        valida,
        empresa: (licenca as any).empresa?.razaoSocial,
        plano: (licenca as any).plano?.nome,
        expiracao: licenca.dataExpiracao,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
