import { Response } from 'express';
import { EntradasMercadoriaService } from './entradas-mercadoria.service';
import { 
  criarEntradaMercadoriaSchema,
  entradaFiltroSchema
} from './dto/entrada-mercadoria.dto';
import { AuthRequest } from '@/shared/middleware/auth.middleware';

export class EntradasMercadoriaController {
  constructor(private service: EntradasMercadoriaService) {}

  criar = async (req: AuthRequest, res: Response) => {
    const dados = criarEntradaMercadoriaSchema.parse(req.body);
    const empresaId = req.usuario?.empresaId || '';
    
    try {
      const resultado = await this.service.criar(empresaId, dados);
      return res.status(201).json(resultado);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

  buscarPorId = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const empresaId = req.usuario?.empresaId || '';
    
    try {
      const resultado = await this.service.buscarPorId(id, empresaId);
      
      if (!resultado) {
        return res.status(404).json({ error: 'Entrada não encontrada' });
      }
      
      return res.json(resultado);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

  listar = async (req: AuthRequest, res: Response) => {
    const filtros = entradaFiltroSchema.parse({
      ...req.query,
      pagina: Number(req.query.pagina) || 1,
      limite: Number(req.query.limite) || 20,
    });
    
    const empresaId = req.usuario?.empresaId || '';
    
    try {
      const resultado = await this.service.listar(empresaId, filtros);
      return res.json(resultado);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

  confirmar = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const empresaId = req.usuario?.empresaId || '';
    
    try {
      const resultado = await this.service.confirmarRecebimento(id, empresaId);
      return res.json(resultado);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

  cancelar = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const empresaId = req.usuario?.empresaId || '';
    
    try {
      const resultado = await this.service.cancelar(id, empresaId);
      return res.json(resultado);
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  };
}
