/**
 * Endpoint público POST /api/licenca/sso/bootstrap — ERP Oraqui
 * Valida handoff SSO da Central e vincula/cria conta local.
 */

import { Request, Response, NextFunction } from 'express';
import { consumeSsoToken, type SsoUserInfo } from '@qglicencas/satellite';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma.mjs';
import appLogger from '../../middlewares/logger';

interface BootstrapSsoBody {
  token: string;
  licenseToken: string;
}

export async function handleSsoBootstrap(
  req: Request<{}, any, BootstrapSsoBody>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { token, licenseToken } = req.body;

  if (!token || !licenseToken) {
    res.status(400).json({ error: 'token e licenseToken são obrigatórios' });
    return;
  }

  try {
    // 1. Validar token SSO com chave pública da Central
    const sso = consumeSsoToken(token, ssoPublicKey());

    const { centralUserId, email, name, status: licenseStatus, passwordHash } = sso;

    // 2. Validar license token via JWKS da Central (fail-closed)
    const publicKeyPem = ssoPublicKey();
    let decoded: any;
    try {
      decoded = jwt.verify(licenseToken, publicKeyPem, { algorithms: ['RS256'] });
    } catch {
      res.status(401).json({ error: 'License token inválido ou expirado' });
      return;
    }

    // Confere que o token é para este projeto
    if (decoded.project_id !== licencaConfig.projectSlug) {
      appLogger.security('sso-bootstrap_license_projeto_invalido', {
        category: 'licenses',
        projectId: decoded.project_id,
        esperado: licencaConfig.projectSlug
      });
      res.status(401).json({ error: 'License token não pertence a este projeto' });
      return;
    }

    // 3. Busca ou cria o usuário
    let usuario = await prisma.users.findUnique({ where: { email: email.toLowerCase() });

    if (!usuario) {
      usuario = await prisma.users.create({
        data: {
          email: email.toLowerCase(),
          name: name || email.split('@')[0],
          role: 'USER',
          passwordHash: passwordHash || '',
          centralUserId,
          licenseToken,
          licenseStatus
        }
      });
      res.json({
        requerLogin: false,
        message: 'Conta criada a partir do funil! Acesso liberado.',
        license: {
          status: decoded.status,
          plan: decoded.plan,
          modulos: decoded.modulos,
          limites: decoded.limites,
          trialEndsAt: decoded.trial_ends_at,
          valid_until: decoded.valid_until
        }
      });
    } else {
      // Vincula licença à conta existente
      await prisma.users.update({
        where: { id: usuario.id },
        data: { centralUserId, licenseToken, licenseStatus }
      });
      res.json({
        requerLogin: true,
        message: 'Conta existente. Faça login com sua senha.',
        license: {
          status: decoded.status,
          plan: decoded.plan,
          trialEndsAt: decoded.trial_ends_at,
          valid_until: decoded.valid_until
        }
      });
    }
  } catch (error) {
    appLogger.error('Erro no bootstrap SSO', error, { category: 'licenses' });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
