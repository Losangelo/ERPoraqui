import { Response, NextFunction } from 'express';
import { LicencasService } from '@/modules/licencas/licencas.service';
import { prisma } from '@/database/prisma.service';
import { AuthRequest } from './auth.middleware';

const licencasService = new LicencasService(prisma);

export type ModuloLicenciado = 
  | 'crm' 
  | 'automacao' 
  | 'multiempresa' 
  | 'api' 
  | 'boletos' 
  | 'nfse' 
  | 'ecf' 
  | 'dre' 
  | 'planocontas';

export type TipoLimite = 'usuarios' | 'clientes' | 'produtos' | 'notas';

export function licencaGuard(modulo: ModuloLicenciado) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const empresaId = req.usuario?.empresaId;

      if (!empresaId) {
        return res.status(401).json({ 
          error: 'Empresa não identificada',
          codigo: 'EMPRESA_NAO_IDENTIFICADA'
        });
      }

      const temAcesso = await licencasService.verificarAcesso(empresaId, modulo);

      if (!temAcesso) {
        return res.status(403).json({
          error: `Módulo '${modulo}' não disponível no seu plano`,
          codigo: 'MODULO_NAO_AUTORIZADO',
          modulo,
          upgradeNecessario: true,
          message: 'Faça upgrade do seu plano para acessar este módulo'
        });
      }

      next();
    } catch (error: any) {
      return res.status(500).json({
        error: 'Erro ao verificar licença',
        codigo: 'ERRO_VERIFICACAO_LICENCA',
        message: error.message
      });
    }
  };
}

export function verificarLimiteRecurso(tipo: TipoLimite) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const empresaId = req.usuario?.empresaId;

      if (!empresaId) {
        return res.status(401).json({ 
          error: 'Empresa não identificada' 
        });
      }

      const resultado = await licencasService.verificarLimite(empresaId, tipo);

      if (!resultado.permitido) {
        return res.status(403).json({
          error: `Limite de ${tipo} atingido`,
          codigo: 'LIMITE_ATINGIDO',
          tipo,
          atual: resultado.atual,
          limite: resultado.limite,
          message: `Você atingiu o limite de ${resultado.limite} ${tipo}. Faça upgrade do plano para continuar usando.`,
          upgradeNecessario: true
        });
      }

      next();
    } catch (error: any) {
      return res.status(500).json({
        error: 'Erro ao verificar limite',
        message: error.message
      });
    }
  };
}

export async function verificarLimite(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const empresaId = req.usuario?.empresaId;
    const tipo = req.params.tipo || req.query.tipo as string;

    if (!empresaId) {
      return res.status(401).json({ 
        error: 'Empresa não identificada' 
      });
    }

    if (!tipo) {
      return res.status(400).json({ 
        error: 'Tipo de limite não especificado' 
      });
    }

    const resultado = await licencasService.verificarLimite(empresaId, tipo);

    if (!resultado.permitido) {
      return res.status(403).json({
        error: `Limite de ${tipo} atingido`,
        codigo: 'LIMITE_ATINGIDO',
        tipo,
        atual: resultado.atual,
        limite: resultado.limite,
        message: `Você atingiu o limite de ${resultado.limite} ${tipo}. Faça upgrade do plano para continuar.`
      });
    }

    (req as any).limiteInfo = resultado;
    next();
  } catch (error: any) {
    return res.status(500).json({
      error: 'Erro ao verificar limite',
      message: error.message
    });
  }
}

export async function licencaAtiva(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const empresaId = req.usuario?.empresaId;

    if (!empresaId) {
      return res.status(401).json({ 
        error: 'Empresa não identificada' 
      });
    }

    const licenca = await licencasService.buscarLicencaAtiva(empresaId);

    if (!licenca) {
      return res.status(403).json({
        error: 'Nenhuma licença ativa encontrada',
        codigo: 'SEM_LICENCA',
        message: 'Ative uma licença para usar o sistema'
      });
    }

    (req as any).licenca = licenca;
    next();
  } catch (error: any) {
    return res.status(500).json({
      error: 'Erro ao verificar licença',
      message: error.message
    });
  }
}
