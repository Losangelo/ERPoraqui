import { Response } from 'express';
import { FinanceiroService } from './financeiro.service';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import { 
  criarContaReceberSchema, 
  receberContaSchema, 
  criarContaPagarSchema, 
  pagarContaSchema, 
  contaFiltroSchema,
  criarContaBancariaSchema,
  criarMovimentacaoBancariaSchema,
  conciliarMovimentacaoSchema,
  criarConciliacaoSchema,
  CriarContaReceberInput,
  ReceberContaInput,
  CriarContaPagarInput,
  PagarContaInput,
  ContaFiltro,
  CriarContaBancariaInput,
  CriarMovimentacaoBancariaInput,
  ConciliarMovimentacaoInput,
  CriarConciliacaoInput
} from './dto/financeiro.dto';

export class FinanceiroController {
  private readonly service = new FinanceiroService();

  criarContaReceber = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const dados = criarContaReceberSchema.parse(req.body);
      const resultado = await this.service.criarContaReceber(dados, empresaId);
      return res.status(201).json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  listarContasReceber = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const filtros = contaFiltroSchema.parse({
        pagina: Number(req.query.pagina) || 1,
        limite: Number(req.query.limite) || 20,
        clienteId: req.query.clienteId,
        situacao: req.query.situacao,
        dataInicial: req.query.dataInicial ? new Date(req.query.dataInicial as string) : undefined,
        dataFinal: req.query.dataFinal ? new Date(req.query.dataFinal as string) : undefined,
      });
      const resultado = await this.service.listarContasReceber(filtros, empresaId);
      return res.json({ success: true, data: resultado.data, meta: resultado.meta });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  receberConta = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const dados = receberContaSchema.parse(req.body);
      const resultado = await this.service.receberConta(id, dados, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  buscarContaReceber = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const resultado = await this.service.buscarContaReceber(id, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  atualizarContaReceber = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const dados = req.body;
      const resultado = await this.service.atualizarContaReceber(id, dados, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  excluirContaReceber = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      await this.service.excluirContaReceber(id, empresaId);
      return res.json({ success: true });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  criarContaPagar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const dados = criarContaPagarSchema.parse(req.body);
      const resultado = await this.service.criarContaPagar(dados, empresaId);
      return res.status(201).json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  listarContasPagar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const filtros = contaFiltroSchema.parse({
        pagina: Number(req.query.pagina) || 1,
        limite: Number(req.query.limite) || 20,
        fornecedorId: req.query.fornecedorId,
        situacao: req.query.situacao,
        dataInicial: req.query.dataInicial ? new Date(req.query.dataInicial as string) : undefined,
        dataFinal: req.query.dataFinal ? new Date(req.query.dataFinal as string) : undefined,
      });
      const resultado = await this.service.listarContasPagar(filtros, empresaId);
      return res.json({ success: true, data: resultado.data, meta: resultado.meta });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  pagarConta = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const dados = pagarContaSchema.parse(req.body);
      const resultado = await this.service.pagarConta(id, dados, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  buscarContaPagar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const resultado = await this.service.buscarContaPagar(id, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  atualizarContaPagar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const dados = req.body;
      const resultado = await this.service.atualizarContaPagar(id, dados, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  excluirContaPagar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      await this.service.excluirContaPagar(id, empresaId);
      return res.json({ success: true });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  dashboard = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const resultado = await this.service.dashboardFinanceiro(empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  criarContaBancaria = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const dados = criarContaBancariaSchema.parse(req.body);
      const resultado = await this.service.criarContaBancaria(dados, empresaId);
      return res.status(201).json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  listarContasBancarias = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const resultado = await this.service.listarContasBancarias(empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  criarMovimentacaoBancaria = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const dados = criarMovimentacaoBancariaSchema.parse(req.body);
      const resultado = await this.service.criarMovimentacaoBancaria(dados, empresaId);
      return res.status(201).json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  listarMovimentacoesBancarias = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const resultado = await this.service.listarMovimentacoesBancarias(id, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  criarConciliacao = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const dados = criarConciliacaoSchema.parse(req.body);
      const resultado = await this.service.criarConciliacao(dados, empresaId);
      return res.status(201).json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  listarConciliacoes = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }
      const resultado = await this.service.listarConciliacoes(id, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  conciliarMovimentacao = async (req: AuthRequest, res: Response) => {
    try {
      const dados = conciliarMovimentacaoSchema.parse(req.body);
      const resultado = await this.service.conciliarMovimentacao(dados);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  removerConciliacaoMovimentacao = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const resultado = await this.service.removerConciliacaoMovimentacao(id);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };
}
