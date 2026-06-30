import { Response } from 'express';
import { PedidosVendaService } from './pedidos-venda.service';
import { 
  criarPedidoVendaSchema, 
  atualizarPedidoVendaSchema,
  pedidoVendaFiltroSchema
} from './dto/pedido-venda.dto';
import { AuthRequest } from '@/shared/middleware/auth.middleware';

export class PedidosVendaController {
  constructor(private service: PedidosVendaService) {}

  criar = async (req: AuthRequest, res: Response) => {
    const empresaId = req.usuario?.empresaId || '';
    
    try {
      const dados = criarPedidoVendaSchema.parse(req.body);
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
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }
      
      return res.json(resultado);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

  listar = async (req: AuthRequest, res: Response) => {
    const empresaId = req.usuario?.empresaId || '';
    
    try {
      const filtros = pedidoVendaFiltroSchema.parse({
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
      const dados = atualizarPedidoVendaSchema.parse(req.body);
      const resultado = await this.service.atualizar(id, empresaId, dados);
      return res.json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || error.issues?.[0]?.message || 'Validation error' });
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

  aprovar = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const empresaId = req.usuario?.empresaId || '';

    try {
      const resultado = await this.service.aprovar(id, empresaId);
      return res.json(resultado);
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  };

  enviar = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const empresaId = req.usuario?.empresaId || '';

    try {
      const resultado = await this.service.enviar(id, empresaId);
      return res.json(resultado);
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  };
}
