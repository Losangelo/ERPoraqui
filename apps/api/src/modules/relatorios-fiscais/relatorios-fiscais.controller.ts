import { Response } from 'express';
import { RelatoriosFiscaisService } from './relatorios-fiscais.service';
import { AuthRequest } from '@/shared/middleware/auth.middleware';

export class RelatoriosFiscaisController {
  constructor(private readonly service: RelatoriosFiscaisService) {}

  resumoNotas = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }

      const { dataInicial, dataFinal } = req.query;
      if (!dataInicial || !dataFinal) {
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Data inicial e final são obrigatórias' } });
      }

      const resultado = await this.service.resumoNotas(empresaId, String(dataInicial), String(dataFinal));

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao gerar relatório',
        },
      });
    }
  };

  resumoImpostos = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }

      const { dataInicial, dataFinal } = req.query;
      if (!dataInicial || !dataFinal) {
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Data inicial e final são obrigatórias' } });
      }

      const resultado = await this.service.resumoImpostos(empresaId, String(dataInicial), String(dataFinal));

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao gerar relatório',
        },
      });
    }
  };

  spedFiscal = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }

      const { dataInicial, dataFinal } = req.query;
      if (!dataInicial || !dataFinal) {
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Data inicial e final são obrigatórias' } });
      }

      const resultado = await this.service.spedFiscal(empresaId, String(dataInicial), String(dataFinal));

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao gerar SPED Fiscal',
        },
      });
    }
  };

  spedContribuicoes = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }

      const { dataInicial, dataFinal } = req.query;
      if (!dataInicial || !dataFinal) {
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Data inicial e final são obrigatórias' } });
      }

      const resultado = await this.service.spedContribuicoes(empresaId, String(dataInicial), String(dataFinal));

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao gerar SPED Contribuições',
        },
      });
    }
  };
}
