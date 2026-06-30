import { Response } from 'express';
import { TransportadorasService } from './transportadoras.service';
import { 
  criarTransportadoraSchema, 
  atualizarTransportadoraSchema,
  transportadoraFiltroSchema
} from './dto/transportadora.dto';
import { AuthRequest } from '@/shared/middleware/auth.middleware';

export class TransportadorasController {
  constructor(private service: TransportadorasService) {}

  criar = async (req: AuthRequest, res: Response) => {
    const empresaId = req.usuario?.empresaId || '';
    
    try {
      const dados = criarTransportadoraSchema.parse(req.body);
      const resultado = await this.service.criar(empresaId, dados);
      return res.status(201).json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || error.issues?.[0]?.message || 'Validation error' });
    }
  };

  buscarPorId = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const empresaId = req.usuario?.empresaId || '';
    
    try {
      const resultado = await this.service.buscarPorId(id, empresaId);
      
      if (!resultado) {
        return res.status(404).json({ error: 'Transportadora não encontrada' });
      }
      
      return res.json(resultado);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

  listar = async (req: AuthRequest, res: Response) => {
    const empresaId = req.usuario?.empresaId || '';
    
    try {
      const filtros = transportadoraFiltroSchema.parse({
        ...req.query,
        pagina: Number(req.query.pagina) || 1,
        limite: Number(req.query.limite) || 20,
      });
      const resultado = await this.service.listar(empresaId, filtros);
      return res.json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || error.issues?.[0]?.message || 'Validation error' });
    }
  };

  atualizar = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const empresaId = req.usuario?.empresaId || '';
    
    try {
      const dados = atualizarTransportadoraSchema.parse(req.body);
      const resultado = await this.service.atualizar(id, empresaId, dados);
      return res.json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || error.issues?.[0]?.message || 'Validation error' });
    }
  };

  inativar = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const empresaId = req.usuario?.empresaId || '';
    
    try {
      const resultado = await this.service.inativar(id, empresaId);
      return res.json(resultado);
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  };

  ativar = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const empresaId = req.usuario?.empresaId || '';
    
    try {
      const resultado = await this.service.ativar(id, empresaId);
      return res.json(resultado);
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  };
}
