import { Response } from 'express';
import { MdfeService } from './mdfe.service';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import {
  veiculoSchema,
  veiculoUpdateSchema,
  condutorSchema,
  condutorUpdateSchema,
  criarMdfeSchema,
  atualizarMdfeSchema,
  mdfeFiltroSchema,
  incluirDocumentoSchema,
} from './dto/mdfe.dto';

export class MdfeController {
  private readonly service = new MdfeService();

  // ==================== VEÍCULOS ====================

  listarVeiculos = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const veiculos = await this.service.listarVeiculos(empresaId);
      return res.json({ success: true, data: veiculos });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  buscarVeiculo = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const veiculo = await this.service.buscarVeiculo(req.params.id, empresaId);
      return res.json({ success: true, data: veiculo });
    } catch (error: any) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: error.message } });
    }
  };

  criarVeiculo = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const dados = veiculoSchema.parse(req.body);
      const veiculo = await this.service.criarVeiculo(dados, empresaId);
      return res.status(201).json({ success: true, data: veiculo });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  atualizarVeiculo = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const dados = veiculoUpdateSchema.parse(req.body);
      const veiculo = await this.service.atualizarVeiculo(req.params.id, dados, empresaId);
      return res.json({ success: true, data: veiculo });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  excluirVeiculo = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const resultado = await this.service.excluirVeiculo(req.params.id, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  // ==================== CONDUTORES ====================

  listarCondutores = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const condutores = await this.service.listarCondutores(empresaId);
      return res.json({ success: true, data: condutores });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  buscarCondutor = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const condutor = await this.service.buscarCondutor(req.params.id, empresaId);
      return res.json({ success: true, data: condutor });
    } catch (error: any) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: error.message } });
    }
  };

  criarCondutor = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const dados = condutorSchema.parse(req.body);
      const condutor = await this.service.criarCondutor(dados, empresaId);
      return res.status(201).json({ success: true, data: condutor });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  atualizarCondutor = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const dados = condutorUpdateSchema.parse(req.body);
      const condutor = await this.service.atualizarCondutor(req.params.id, dados, empresaId);
      return res.json({ success: true, data: condutor });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  excluirCondutor = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const resultado = await this.service.excluirCondutor(req.params.id, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  // ==================== MDF-E ====================

  listarMdfes = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const filtros = mdfeFiltroSchema.parse({
        pagina: Number(req.query.pagina) || 1,
        limite: Number(req.query.limite) || 20,
        situacao: req.query.situacao,
        periodoIni: req.query.periodoIni,
        periodoFin: req.query.periodoFin,
      });
      const resultado = await this.service.listarMdfes(filtros, empresaId);
      return res.json({ success: true, ...resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  buscarMdfe = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const mdfe = await this.service.buscarMdfe(req.params.id, empresaId);
      return res.json({ success: true, data: mdfe });
    } catch (error: any) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: error.message } });
    }
  };

  criarMdfe = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const dados = criarMdfeSchema.parse(req.body);
      const mdfe = await this.service.criarMdfe(dados, empresaId);
      return res.status(201).json({ success: true, data: mdfe });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  atualizarMdfe = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const dados = atualizarMdfeSchema.parse(req.body);
      const mdfe = await this.service.atualizarMdfe(req.params.id, dados, empresaId);
      return res.json({ success: true, data: mdfe });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  excluirMdfe = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const resultado = await this.service.excluirMdfe(req.params.id, empresaId);
      return res.json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  cancelarMdfe = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const mdfe = await this.service.cancelarMdfe(req.params.id, empresaId);
      return res.json({ success: true, data: mdfe });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  encerrarMdfe = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const mdfe = await this.service.encerrarMdfe(req.params.id, empresaId);
      return res.json({ success: true, data: mdfe });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  incluirDocumento = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const dados = incluirDocumentoSchema.parse(req.body);
      const mdfe = await this.service.incluirDocumento(req.params.id, dados, empresaId);
      return res.json({ success: true, data: mdfe });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };

  removerDocumento = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      const { documentoId } = req.params;
      const mdfe = await this.service.removerDocumento(req.params.id, documentoId, empresaId);
      return res.json({ success: true, data: mdfe });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { code: 'ERROR', message: error.message } });
    }
  };
}
