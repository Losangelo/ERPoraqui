import { Response } from 'express';
import { PromocoesService } from './promocoes.service';
import {
  criarPromocaoSchema,
  atualizarPromocaoSchema,
  promocaoFiltroSchema,
} from './dto/promocao.dto';
import { AuthRequest } from '@/shared/middleware/auth.middleware';

export class PromocoesController {
  constructor(private service: PromocoesService) {}

  criar = async (req: AuthRequest, res: Response) => {
    const empresaId = req.usuario?.empresaId || '';
    try {
      const dados = criarPromocaoSchema.parse(req.body);
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
      if (!resultado) return res.status(404).json({ error: 'Promoção não encontrada' });
      return res.json(resultado);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

  listar = async (req: AuthRequest, res: Response) => {
    const empresaId = req.usuario?.empresaId || '';
    try {
      const filtros = promocaoFiltroSchema.parse({
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
      const dados = atualizarPromocaoSchema.parse(req.body);
      const resultado = await this.service.atualizar(id, empresaId, dados);
      return res.json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || error.issues?.[0]?.message || 'Validation error' });
    }
  };

  excluir = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const empresaId = req.usuario?.empresaId || '';
    try {
      await this.service.excluir(id, empresaId);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

  toggleAtivo = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const empresaId = req.usuario?.empresaId || '';
    try {
      const resultado = await this.service.toggleAtivo(id, empresaId);
      return res.json(resultado);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

  calcularPrecoPromocional = async (req: AuthRequest, res: Response) => {
    const { produtoId } = req.params;
    try {
      const preco = await this.service.calcularPrecoPromocional(produtoId);
      return res.json({ produtoId, precoPromocional: preco });
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };
}
