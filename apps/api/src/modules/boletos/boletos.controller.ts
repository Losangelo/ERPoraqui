import { Response } from 'express';
import { BoletosService } from './boletos.service';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import { 
  criarBoletoSchema, 
  atualizarBoletoSchema, 
  baixarBoletoSchema, 
  boletoFiltroSchema, 
  criarBancoSchema, 
  gerarRemessaSchema,
  gerarRemessaLoteSchema,
  processarRetornoSchema,
  CriarBoletoInput, 
  AtualizarBoletoInput, 
  BaixarBoletoInput, 
  BoletoFiltro, 
  CriarBancoInput,
  GerarRemessaInput,
  GerarRemessaLoteInput,
  ProcessarRetornoInput,
} from './dto/boleto.dto';
import appLogger from '@/shared/logger/logger';

export class BoletosController {
  private readonly service = new BoletosService();

  criar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const dados = criarBoletoSchema.parse(req.body);
      const resultado = await this.service.criar(empresaId, dados);

      return res.status(201).json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      appLogger.error('Erro ao criar boleto', error, {
        category: 'api',
        action: 'boletos:create',
      });
      return res.status(400).json({
        success: false,
        error: { code: 'ERROR', message: error.message || 'Erro ao criar boleto' },
      });
    }
  };

  listar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const filtros: BoletoFiltro = {
        pagina: Number(req.query.pagina) || 1,
        limite: Number(req.query.limite) || 20,
        contaReceberId: req.query.contaReceberId as string | undefined,
        situacao: req.query.situacao as any,
        dataInicial: req.query.dataInicial ? new Date(req.query.dataInicial as string) : undefined,
        dataFinal: req.query.dataFinal ? new Date(req.query.dataFinal as string) : undefined,
      };

      const resultado = await this.service.listar(empresaId, filtros);

      return res.json({
        success: true,
        data: resultado.data,
        meta: resultado.meta,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'ERROR', message: error.message || 'Erro ao listar boletos' },
      });
    }
  };

  buscarPorId = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.buscarPorId(id, empresaId);

      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: error.message || 'Boleto não encontrado' },
      });
    }
  };

  atualizar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const dados = atualizarBoletoSchema.parse(req.body);
      const resultado = await this.service.atualizar(id, empresaId, dados);

      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'ERROR', message: error.message || 'Erro ao atualizar boleto' },
      });
    }
  };

  baixar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const dados = baixarBoletoSchema.parse(req.body);
      const resultado = await this.service.baixar(id, empresaId, dados);

      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'ERROR', message: error.message || 'Erro ao baixar boleto' },
      });
    }
  };

  cancelar = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.cancelar(id, empresaId);

      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'ERROR', message: error.message || 'Erro ao cancelar boleto' },
      });
    }
  };

  gerarSegundaVia = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.gerarSegundaVia(id, empresaId);

      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'ERROR', message: error.message || 'Erro ao gerar segunda via' },
      });
    }
  };

  expirarBoletosVencidos = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;

      if (!empresaId) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } 
        });
      }

      const resultado = await this.service.expirarBoletosVencidos(empresaId);

      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'ERROR', message: error.message || 'Erro ao expirar boletos' },
      });
    }
  };

  listarBancos = async (_req: AuthRequest, res: Response) => {
    try {
      const resultado = await this.service.listarBancos();
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'ERROR', message: error.message || 'Erro ao listar bancos' },
      });
    }
  };

  criarBanco = async (req: AuthRequest, res: Response) => {
    try {
      const dados = criarBancoSchema.parse(req.body);
      const resultado = await this.service.criarBanco(dados);

      return res.status(201).json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'ERROR', message: error.message || 'Erro ao criar banco' },
      });
    }
  };

  gerarRemessa = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;

      if (!empresaId) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' },
        });
      }

      const dados: GerarRemessaInput = {
        tipoArquivo: req.body.tipoArquivo || 'CNAB400',
      };

      const resultado = await this.service.gerarRemessa(id, empresaId, dados);

      return res.status(201).json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'ERROR', message: error.message || 'Erro ao gerar remessa' },
      });
    }
  };

  gerarRemessaLote = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;

      if (!empresaId) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' },
        });
      }

      const dados: GerarRemessaLoteInput = {
        boletoIds: req.body.boletoIds,
        tipoArquivo: req.body.tipoArquivo || 'CNAB400',
      };

      const resultado = await this.service.gerarRemessaLote(empresaId, dados);

      return res.status(201).json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'ERROR', message: error.message || 'Erro ao gerar remessa em lote' },
      });
    }
  };

  processarRetorno = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;

      if (!empresaId) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' },
        });
      }

      const dados: ProcessarRetornoInput = {
        conteudo: req.body.conteudo,
        tipoArquivo: req.body.tipoArquivo || 'CNAB400',
        nomeArquivo: req.body.nomeArquivo,
      };

      const resultado = await this.service.processarRetorno(empresaId, dados);

      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'ERROR', message: error.message || 'Erro ao processar retorno' },
      });
    }
  };

  listarRemessaHistorico = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;

      if (!empresaId) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' },
        });
      }

      const pagina = Number(req.query.pagina) || 1;
      const limite = Number(req.query.limite) || 20;

      const resultado = await this.service.listarRemessaHistorico(empresaId, pagina, limite);

      return res.json({
        success: true,
        data: resultado.data,
        meta: resultado.meta,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'ERROR', message: error.message || 'Erro ao listar histórico' },
      });
    }
  };

  downloadRemessa = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      const { id } = req.params;

      if (!empresaId) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' },
        });
      }

      const resultado = await this.service.downloadRemessa(id, empresaId);

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${resultado.nomeArquivo}"`);

      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: error.message || 'Remessa não encontrada' },
      });
    }
  };
}
