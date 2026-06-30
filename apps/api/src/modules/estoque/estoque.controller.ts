import { Response } from 'express';
import { EstoqueService } from './estoque.service';
import { estoqueFiltroSchema, ajusteEstoqueSchema } from './dto/estoque.dto';
import { AuthRequest } from '@/shared/middleware/auth.middleware';

export class EstoqueController {
  constructor(private service: EstoqueService) {}

  listar = async (req: AuthRequest, res: Response) => {
    const filtros = estoqueFiltroSchema.parse({
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

  buscarPorId = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const empresaId = req.usuario?.empresaId || '';
    
    try {
      const resultado = await this.service.buscarPorId(id, empresaId);
      return res.json(resultado);
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  };

  alertas = async (req: AuthRequest, res: Response) => {
    const empresaId = req.usuario?.empresaId || '';
    
    try {
      const resultado = await this.service.alertasEstoque(empresaId);
      return res.json(resultado);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

  ajustar = async (req: AuthRequest, res: Response) => {
    const dados = ajusteEstoqueSchema.parse(req.body);
    const empresaId = req.usuario?.empresaId || '';
    
    try {
      const resultado = await this.service.ajustarEstoque(empresaId, dados);
      return res.json(resultado);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };
}
