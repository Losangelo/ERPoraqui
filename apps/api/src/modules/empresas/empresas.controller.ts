import { Request, Response } from 'express';
import { EmpresasService } from './empresas.service';
import { 
  criarEmpresaSchema, 
  atualizarEmpresaSchema 
} from './dto/empresa.dto';
import { 
  criarFilialSchema, 
  atualizarFilialSchema 
} from './dto/filial.dto';

export class EmpresasController {
  constructor(private service: EmpresasService) {}

  criar = async (req: Request, res: Response) => {
    try {
      const dados = criarEmpresaSchema.parse(req.body);
      const resultado = await this.service.criar(dados);
      return res.status(201).json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || error.issues?.[0]?.message || 'Validation error' });
    }
  };

  buscarPorId = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    try {
      const resultado = await this.service.buscarPorId(id);
      
      if (!resultado) {
        return res.status(404).json({ error: 'Empresa não encontrada' });
      }
      
      return res.json(resultado);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

  listarFiliais = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const resultado = await this.service.listarFiliais(id);
      return res.json(resultado);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

  criarFilial = async (req: Request, res: Response) => {
    try {
      const dados = criarFilialSchema.parse(req.body);
      const resultado = await this.service.criarFilial(dados);
      return res.status(201).json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || error.issues?.[0]?.message || 'Validation error' });
    }
  };

  buscarFilial = async (req: Request, res: Response) => {
    const { filialId } = req.params;

    try {
      const resultado = await this.service.buscarFilialPorId(filialId);
      if (!resultado) return res.status(404).json({ error: 'Filial não encontrada' });
      return res.json(resultado);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

  atualizarFilial = async (req: Request, res: Response) => {
    const { filialId } = req.params;

    try {
      const dados = atualizarFilialSchema.parse(req.body);
      const resultado = await this.service.atualizarFilial(filialId, dados);
      return res.json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || error.issues?.[0]?.message || 'Validation error' });
    }
  };

  removerFilial = async (req: Request, res: Response) => {
    const { filialId } = req.params;

    try {
      await this.service.removerFilial(filialId);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

  listar = async (_req: Request, res: Response) => {
    try {
      const resultado = await this.service.listar();
      return res.json(resultado);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

  atualizar = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    try {
      const dados = atualizarEmpresaSchema.parse(req.body);
      const resultado = await this.service.atualizar(id, dados);
      return res.json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || error.issues?.[0]?.message || 'Validation error' });
    }
  };

  inativar = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    try {
      const resultado = await this.service.inativar(id);
      return res.json(resultado);
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  };

  ativar = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    try {
      const resultado = await this.service.ativar(id);
      return res.json(resultado);
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  };
}
