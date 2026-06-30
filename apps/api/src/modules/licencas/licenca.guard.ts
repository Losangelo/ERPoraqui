import { Request, Response, NextFunction } from 'express';
import { LicencasService } from './licencas.service';

export function licencaGuard(modulo: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const empresaId = (req as any).user?.empresaId;
      const perfil = (req as any).user?.perfil;

      if (!empresaId) {
        return res.status(403).json({ error: 'Empresa nao identificada' });
      }

      // Admin sempre tem acesso total
      if (perfil === 'ADMINISTRADOR') {
        return next();
      }

      if (modulo) {
        const service = new LicencasService();
        const temAcesso = await service.verificarAcesso(empresaId, modulo);
        
        if (!temAcesso) {
          return res.status(403).json({ error: `Modulo '${modulo}' nao disponivel na sua licenca` });
        }
      }

      next();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
