import { Request, Response } from 'express';
import { NFSeService } from './nfse.service';
import { z } from 'zod';

const createNFSeSchema = z.object({
  empresaId: z.string(),
  filialId: z.string(),
  clienteId: z.string().optional(),
  competencia: z.string().optional(),
  tipoRps: z.enum(['RPS', 'RPS_CONJUGADO', 'CUPOM']).optional(),
  naturezaOperacao: z.string().optional(),
  regimeTributario: z.enum(['SIMPLES_NACIONAL', 'LUCRO_PRESUMIDO', 'LUCRO_REAL', 'ISENTO']).optional(),
  optanteSimplesNacional: z.boolean().optional(),
  incentivoFiscal: z.boolean().optional(),
  tomadorNome: z.string().optional(),
  tomadorCnpjCpf: z.string().optional(),
  tomadorInscricaoMunicipal: z.string().optional(),
  tomadorEndereco: z.string().optional(),
  tomadorNumero: z.string().optional(),
  tomadorComplemento: z.string().optional(),
  tomadorBairro: z.string().optional(),
  tomadorCidade: z.string().optional(),
  tomadorUf: z.string().optional(),
  tomadorCep: z.string().optional(),
  tomadorTelefone: z.string().optional(),
  tomadorEmail: z.string().optional(),
  servicoproduto: z.string().optional(),
  codigoMunicipio: z.string().optional(),
  codigoServico: z.string().optional(),
  discriminacao: z.string().optional(),
  observacoes: z.string().optional(),
  itens: z.array(z.object({
    codigo: z.string(),
    discriminacao: z.string(),
    quantidade: z.number().optional(),
    valorUnitario: z.number(),
    tributavel: z.boolean().optional(),
    issAliquota: z.number().optional(),
  })).optional(),
});

export class NFSeController {
  private service = new NFSeService();

  async criar(req: Request, res: Response) {
    try {
      const dto = createNFSeSchema.parse(req.body);
      const nota = await this.service.criar(dto);
      res.status(201).json({ success: true, data: nota });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const empresaId = req.query.empresaId as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const result = await this.service.listar(empresaId, page, limit);
      res.json({ success: true, data: result.data, meta: result.meta });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const nota = await this.service.buscarPorId(id);
      
      if (!nota) {
        return res.status(404).json({ success: false, error: { message: 'NFSe não encontrada' } });
      }
      
      res.json({ success: true, data: nota });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto = createNFSeSchema.partial().parse(req.body);
      const nota = await this.service.atualizar(id, dto);
      res.json({ success: true, data: nota });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  }

  async excluir(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.service.excluir(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  }

  async listarPorStatus(req: Request, res: Response) {
    try {
      const empresaId = req.query.empresaId as string;
      const { situacao } = req.params;
      const notas = await this.service.listarPorStatus(empresaId, situacao);
      res.json({ success: true, data: notas });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  async assinar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const nota = await this.service.assinar(id);
      res.json({ success: true, data: nota });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  }

  async enviar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const nota = await this.service.enviar(id);
      res.json({ success: true, data: nota });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  }

  async cancelar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { motivo } = req.body;
      const nota = await this.service.cancelar(id, motivo);
      res.json({ success: true, data: nota });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  }
}
