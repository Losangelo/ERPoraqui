import { Response } from 'express';
import { TaxasEntregaService } from './taxas-entrega.service';
import {
  criarTaxaEntregaSchema,
  atualizarTaxaEntregaSchema,
  taxaEntregaFiltroSchema,
  calcularTaxaSchema,
} from './dto/taxa-entrega.dto';
import { AuthRequest } from '@/shared/middleware/auth.middleware';

export class TaxasEntregaController {
  constructor(private service: TaxasEntregaService) {}

  criar = async (req: AuthRequest, res: Response) => {
    const empresaId = req.usuario?.empresaId || '';

    try {
      const dados = criarTaxaEntregaSchema.parse(req.body);
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
        return res.status(404).json({ error: 'Taxa de entrega não encontrada' });
      }

      return res.json(resultado);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

  listar = async (req: AuthRequest, res: Response) => {
    const empresaId = req.usuario?.empresaId || '';

    try {
      const filtros = taxaEntregaFiltroSchema.parse({
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
      const dados = atualizarTaxaEntregaSchema.parse(req.body);
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

  calcular = async (req: AuthRequest, res: Response) => {
    const empresaId = req.usuario?.empresaId || '';

    try {
      const dados = calcularTaxaSchema.parse(req.body);
      const resultado = await this.service.calcular(empresaId, dados);
      return res.json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || error.issues?.[0]?.message || 'Validation error' });
    }
  };
}
