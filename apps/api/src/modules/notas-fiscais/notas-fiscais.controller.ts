import { Request, Response } from 'express';
import { NotasFiscaisService } from './notas-fiscais.service';
import { criarNotaFiscalSchema, atualizarNotaFiscalSchema, cancelarNotaFiscalSchema, cartaCorrecaoSchema, configurarCertificadoSchema, notaFiscalFiltroSchema, CriarNotaFiscalInput, AtualizarNotaFiscalInput, CancelarNotaFiscalInput, CartaCorrecaoInput, ConfigurarCertificadoInput, NotaFiscalFiltro } from './dto/nota-fiscal.dto';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

interface AuthRequest extends Request {
  usuario?: {
    empresaId: string;
    id: string;
  };
}

export class NotasFiscaisController {
  private readonly notasFiscaisService: NotasFiscaisService;

  constructor() {
    this.notasFiscaisService = new NotasFiscaisService();
  }

  async criar(req: Request, res: Response) {
    try {
      const data = req.body as CriarNotaFiscalInput;
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.notasFiscaisService.criar(data, empresaId);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const query = req.query;
      const filtros: NotaFiscalFiltro = {
        filialId: query.filialId as string | undefined,
        clienteId: query.clienteId as string | undefined,
        modelo: query.modelo as any,
        situacao: query.situacao as any,
        pagina: query.pagina ? Number(query.pagina) : 1,
        limite: query.limite ? Number(query.limite) : 20,
      };
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.notasFiscaisService.listar(filtros, empresaId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.notasFiscaisService.buscarPorId(id, empresaId);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body as AtualizarNotaFiscalInput;
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.notasFiscaisService.atualizar(id, data, empresaId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async assinar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.notasFiscaisService.assinar(id, empresaId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async enviar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.notasFiscaisService.enviar(id, empresaId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async cancelar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body as CancelarNotaFiscalInput;
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.notasFiscaisService.cancelar(id, data, empresaId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async cartaCorrecao(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body as CartaCorrecaoInput;
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.notasFiscaisService.cartaCorrecao(id, data, empresaId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listarPorStatus(req: Request, res: Response) {
    try {
      const { situacao } = req.params;
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.notasFiscaisService.listarPorStatus(empresaId, situacao);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async configurarCertificado(req: Request, res: Response) {
    try {
      const data = req.body as ConfigurarCertificadoInput;
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.notasFiscaisService.configurarCertificado(data, empresaId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async buscarConfiguracao(req: Request, res: Response) {
    try {
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.notasFiscaisService.buscarConfiguracao(empresaId);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async statusSefaz(req: Request, res: Response) {
    try {
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.notasFiscaisService.statusSefaz(empresaId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async inutilizar(req: Request, res: Response) {
    try {
      const { numeroInicial, numeroFinal, serie, justificativa } = req.body;
      const empresaId = (req as AuthRequest).usuario?.empresaId;
      const result = await this.notasFiscaisService.inutilizar(numeroInicial, numeroFinal, serie, justificativa, empresaId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
