/**
 * Configuração da integração com a Central de Licenças — ERP Oraqui
 * Mesma convenção QGL_* dos demais satélites.
 */

export const licencaConfig = {
  centralUrl: process.env.QGL_CENTRAL_URL || '',
  centralJwksUrl: process.env.QGL_CENTRAL_JWKS_URL || '',
  centralApiKey: process.env.QGL_CENTRAL_API_KEY || '',
  centralSsoPublicKey: process.env.QGL_CENTRAL_SSO_PUBLIC_KEY || '',
  webhookSecret: process.env.QGL_WEBHOOK_SECRET || '',
  projectSlug: process.env.QGL_PROJECT_SLUG || 'erporaqui',
  offlineGraceHours: Number(process.env.QGL_OFFLINE_GRACE_HOURS || 5),
  jwksCachePath: process.env.QGL_JWKS_CACHE_PATH || '.jwks-cache.json'
};

export function licencaAtiva() {
  return Boolean(licencaConfig.centralJwksUrl && licencaConfig.centralApiKey);
}

export function ssoPublicKey() {
  if (!licencaConfig.centralSsoPublicKey) {
    throw new Error('QGL_CENTRAL_SSO_PUBLIC_KEY não configurada');
  }
  return Buffer.from(licencaConfig.centralSsoPublicKey, 'base64').toString('utf8');
}
