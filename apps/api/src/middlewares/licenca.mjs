/**
 * Middleware enforceLicense — ERP Oraqui
 * Valida license token nas rotas protegidas (fail-closed).
 */

import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { licencaConfig, ssoPublicKey } from '../../config/licenca.mjs';
import appLogger from '../../middlewares/logger';

export type LicenseRequest = Request & { license?: any };

export function enforceLicense(
  req: LicenseRequest,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers['authorization'] as string | undefined;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token de licença não fornecido.', code: 'NO_TOKEN' });
    return;
  }

  const token = header.slice('Bearer '.length);

  try {
    const decoded = jwt.verify(token, ssoPublicKey(), { algorithms: ['RS256'] });

    if (decoded.project_id !== licencaConfig.projectSlug) {
      res.status(401).json({ error: 'License token de outro projeto.', code: 'INVALID_PROJECT' });
      return;
    }

    if (decoded.status === 'suspended' || decoded.status === 'canceled') {
      res.status(403).json({
        code: 'ACCOUNT_SUSPENDED',
        error: 'Acesso suspenso. Entre em contato para reativar sua assinatura.'
      });
      return;
    }

    req.license = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token de licença inválido ou expirado.', code: 'INVALID_TOKEN' });
  }
}
