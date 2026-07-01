import { Response } from 'express';
import { PdvService } from './pdv.service';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import { 
  adicionarItemSchema, 
  finalizarVendaSchema, 
  criarOperadorSchema, 
  abrirCaixaSchema, 
  fecharCaixaSchema, 
  pdvFiltroSchema, 
  buscarProdutoSchema, 
  AdicionarItemInput, 
  FinalizarVendaInput, 
  CriarOperadorInput, 
  AbrirCaixaInput, 
  FecharCaixaInput, 
  PdvFiltro, 
  BuscarProdutoInput 
} from './dto/pdv.dto';
import appLogger from '@/shared/logger/logger';

export class PdvController {
  private readonly service = new PdvService();

  iniciarVenda = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { filialId, operadorId } = req.body;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.iniciarVenda(empresaId, filialId, operadorId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  adicionarItem = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { vendaId } = req.params;
      const dados = adicionarItemSchema.parse(req.body);

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.adicionarItem(empresaId, vendaId, dados);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  removerItem = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { vendaId, produtoId } = req.params;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.removerItem(empresaId, vendaId, produtoId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  atualizarQuantidade = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { vendaId, produtoId } = req.params;
      const { quantidade } = req.body;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.atualizarQuantidade(empresaId, vendaId, produtoId, quantidade);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  finalizarVenda = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { vendaId } = req.params;
      const dados = finalizarVendaSchema.parse(req.body);

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.finalizarVenda(empresaId, vendaId, dados);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  cancelarVenda = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { vendaId } = req.params;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.cancelarVenda(empresaId, vendaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  buscarProdutos = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const filtros = buscarProdutoSchema.parse({
        termo: req.query.termo,
        pagina: Number(req.query.pagina) || 1,
        limite: Number(req.query.limite) || 20,
      });

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.buscarProdutos(empresaId, filtros);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  buscarPorCodigoBarras = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { codigo } = req.params;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.buscarPorCodigoBarras(empresaId, codigo);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: error.message } });
    }
  };

  criarOperador = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const dados = criarOperadorSchema.parse(req.body);

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.criarOperador(empresaId, dados);
      return res.status(201).json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  listarOperadores = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.listarOperadores(empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  autenticarOperador = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { nome, pin } = req.body;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.autenticarOperador(empresaId, nome, pin);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  abrirCaixa = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const dados = abrirCaixaSchema.parse(req.body);

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.abrirCaixa(empresaId, dados);
      return res.status(201).json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  fecharCaixa = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { caixaId } = req.params;
      const dados = fecharCaixaSchema.parse(req.body);

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.fecharCaixa(empresaId, caixaId, dados);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  buscarCaixaAberto = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { filialId } = req.query;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.buscarCaixaAberto(empresaId, filialId as string);
      return res.json({ success: true, data: resultado ?? null });
    } catch (error: any) {
      if (error.message === 'Nenhum caixa aberto nesta filial') {
        return res.json({ success: true, data: null });
      }
      return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  };

  listarVendas = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const filtros = pdvFiltroSchema.parse({
        pagina: Number(req.query.pagina) || 1,
        limite: Number(req.query.limite) || 20,
        filialId: req.query.filialId,
        operadorId: req.query.operadorId,
        clienteId: req.query.clienteId,
        formaPagamento: req.query.formaPagamento,
        situacao: req.query.situacao,
        dataInicial: req.query.dataInicial ? new Date(req.query.dataInicial as string) : undefined,
        dataFinal: req.query.dataFinal ? new Date(req.query.dataFinal as string) : undefined,
      });

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.listarVendas(empresaId, filtros);
      return res.json({ success: true, data: resultado.data, meta: resultado.meta });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  buscarVenda = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { vendaId } = req.params;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.buscarVenda(empresaId, vendaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: error.message } });
    }
  };
}
