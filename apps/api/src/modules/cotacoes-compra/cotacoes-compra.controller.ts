import { Response } from 'express';
import { CotacoesCompraService } from './cotacoes-compra.service';
import { 
  criarCotacaoSchema,
  responderCotacaoSchema,
  cotacaoFiltroSchema
} from './dto/cotacao-compra.dto';
import { AuthRequest } from '@/shared/middleware/auth.middleware';

export class CotacoesCompraController {
  constructor(private service: CotacoesCompraService) {}

  criar = async (req: AuthRequest, res: Response) => {
    const dados = criarCotacaoSchema.parse(req.body);
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
        return res.status(404).json({ error: 'Cotação não encontrada' });
      }
      
      return res.json(resultado);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

  listar = async (req: AuthRequest, res: Response) => {
    const filtros = cotacaoFiltroSchema.parse({
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

  enviar = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const empresaId = req.usuario?.empresaId || '';
    
    try {
      const resultado = await this.service.enviarCotacao(id, empresaId);
      return res.json(resultado);
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  };

  responder = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { fornecedorId, valorTotal } = req.body;
    const dados = responderCotacaoSchema.parse(req.body);
    const empresaId = req.usuario?.empresaId || '';
    
    try {
      const resultado = await this.service.responderCotacao(id, empresaId, fornecedorId, dados, valorTotal);
      return res.status(201).json(resultado);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

  aprobar = async (req: AuthRequest, res: Response) => {
    const { id, respostaId } = req.params;
    const empresaId = req.usuario?.empresaId || '';
    
    try {
      const resultado = await this.service.aprobarResposta(id, respostaId, empresaId);
      return res.json(resultado);
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
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
