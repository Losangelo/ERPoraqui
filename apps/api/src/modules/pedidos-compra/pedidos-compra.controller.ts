import { Response } from 'express';
import { PedidosCompraService } from './pedidos-compra.service';
import { 
  criarPedidoCompraSchema, 
  atualizarPedidoCompraSchema,
  pedidoCompraFiltroSchema
} from './dto/pedido-compra.dto';
import { AuthRequest } from '@/shared/middleware/auth.middleware';

export class PedidosCompraController {
  constructor(private service: PedidosCompraService) {}

  criar = async (req: AuthRequest, res: Response) => {
    try {
      const dados = criarPedidoCompraSchema.parse(req.body);
      const empresaId = req.usuario?.empresaId || '';
      const resultado = await this.service.criar(empresaId, dados);
      return res.status(201).json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || error.issues?.[0]?.message || 'Erro de validação' });
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
    try {
      const filtros = pedidoCompraFiltroSchema.parse({
        ...req.query,
        pagina: Number(req.query.pagina) || 1,
        limite: Number(req.query.limite) || 20,
      });
      const empresaId = req.usuario?.empresaId || '';
      const resultado = await this.service.listar(empresaId, filtros);
      return res.json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Erro ao listar pedidos' });
    }
  };

  atualizar = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const dados = atualizarPedidoCompraSchema.parse(req.body);
      const empresaId = req.usuario?.empresaId || '';
      const resultado = await this.service.atualizar(id, empresaId, dados);
      return res.json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Erro ao atualizar pedido' });
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
