import { Response } from 'express';
import { DashboardGerencialService } from './dashboard-gerencial.service';
import { AuthRequest } from '@/shared/middleware/auth.middleware';

export class DashboardGerencialController {
  constructor(private readonly service: DashboardGerencialService) {}

  dashboardCompleto = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }

      const resultado = await this.service.dashboardCompleto(empresaId);

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao gerar dashboard',
        },
      });
    }
  };

  graficoVendas = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }

      const { periodo } = req.query;
      const resultado = await this.service.graficoVendas(empresaId, String(periodo || '30dias'));

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao gerar gráfico',
        },
      });
    }
  };

  graficoVendasDiaSemana = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }

      const resultado = await this.service.graficoVendasPorDiaSemana(empresaId);

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao gerar gráfico',
        },
      });
    }
  };

  graficoReceitasDespesas = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }

      const { periodo } = req.query;
      const resultado = await this.service.graficoReceitasDespesas(empresaId, String(periodo || '30dias'));

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao gerar gráfico',
        },
      });
    }
  };

  graficoStatusPedidos = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }

      const resultado = await this.service.graficoStatusPedidos(empresaId);

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao gerar gráfico',
        },
      });
    }
  };

  graficoEstoqueCategoria = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }

      const resultado = await this.service.graficoEstoquePorCategoria(empresaId);

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao gerar gráfico',
        },
      });
    }
  };

  graficoMaisVendidos = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }

      const { limite } = req.query;
      const resultado = await this.service.graficoMaisVendidos(empresaId, Number(limite) || 10);

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao gerar gráfico',
        },
      });
    }
  };

  indicadoresRapidos = async (req: AuthRequest, res: Response) => {
    try {
      const empresaId = req.usuario?.empresaId;
      if (!empresaId) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Empresa não identificada' } });
      }

      const resultado = await this.service.indicadoresRapidos(empresaId);

      return res.json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERROR',
          message: error.message || 'Erro ao buscar indicadores',
        },
      });
    }
  };
}
