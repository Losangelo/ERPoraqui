import { Response } from 'express';
import { TabelasPrecoService } from './tabelas-preco.service';
import {
  criarTabelaPrecoSchema,
  atualizarTabelaPrecoSchema,
  tabelaPrecoFiltroSchema,
  criarTabelaPrecoItemSchema,
  atualizarTabelaPrecoItemSchema,
  calcularPrecoSchema,
} from './dto/tabela-preco.dto';
import { AuthRequest } from '@/shared/middleware/auth.middleware';

export class TabelasPrecoController {
  constructor(private service: TabelasPrecoService) {}

  criar = async (req: AuthRequest, res: Response) => {
    const empresaId = req.usuario?.empresaId || '';
    try {
      const dados = criarTabelaPrecoSchema.parse(req.body);
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
      if (!resultado) return res.status(404).json({ error: 'Tabela de preço não encontrada' });
      return res.json(resultado);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

  listar = async (req: AuthRequest, res: Response) => {
    const empresaId = req.usuario?.empresaId || '';
    try {
      const filtros = tabelaPrecoFiltroSchema.parse({
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
      const dados = atualizarTabelaPrecoSchema.parse(req.body);
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
      const resultado = await this.service.excluir(id, empresaId);
      return res.json(resultado);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

  adicionarItem = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const empresaId = req.usuario?.empresaId || '';
    try {
      const dados = criarTabelaPrecoItemSchema.parse(req.body);
      const resultado = await this.service.adicionarItem(id, empresaId, dados);
      return res.status(201).json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || error.issues?.[0]?.message || 'Validation error' });
    }
  };

  atualizarItem = async (req: AuthRequest, res: Response) => {
    const { id, itemId } = req.params;
    const empresaId = req.usuario?.empresaId || '';
    try {
      const dados = atualizarTabelaPrecoItemSchema.parse(req.body);
      const resultado = await this.service.atualizarItem(id, itemId, empresaId, dados);
      return res.json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || error.issues?.[0]?.message || 'Validation error' });
    }
  };

  removerItem = async (req: AuthRequest, res: Response) => {
    const { id, itemId } = req.params;
    const empresaId = req.usuario?.empresaId || '';
    try {
      const resultado = await this.service.removerItem(id, itemId, empresaId);
      return res.json(resultado);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

  calcularPreco = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const empresaId = req.usuario?.empresaId || '';
    try {
      const dados = calcularPrecoSchema.parse(req.body);
      const resultado = await this.service.calcularPreco(id, empresaId, dados);
      return res.json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || error.issues?.[0]?.message || 'Validation error' });
    }
  };
}
