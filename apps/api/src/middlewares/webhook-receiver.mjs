/**
 * Webhook receiver — Central de Licenças → ERP Oraqui
 * Valida HMAC-SHA256 dos webhooks entregues pela Central.
 */

import type { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import { licencaConfig } from '../../config/licenca.mjs';
import appLogger from '../../middlewares/logger';

export type OnWebhook = (payload: any) => Promise<void> | void;

export function createWebhookReceiver(secret: string, onWebhook: OnWebhook) {
  return async (req: Request, res: Response): Promise<void> => {
    const signature = req.headers['x-hub-signature-256'] as string | undefined;
    if (!signature) {
      res.status(401).json({ error: 'Assinatura ausente.' });
      return;
    }

    const rawBody = JSON.stringify(req.body);
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    const received = signature.replace(/^sha256=/, '');

    const timingSafe = crypto.timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(received, 'hex')
    );

    if (!timingSafe) {
      res.status(401).json({ error: 'Assinatura inválida do webhook.' });
      return;
    }

    await onWebhook(req.body);
    res.status(200).json({ received: true });
  };
}

export function registerWebhookRoute(app: any): void {
  if (!licencaConfig.webhookSecret) {
    appLogger.error('[Webhook] QGL_WEBHOOK_SECRET não definido — rota de webhook não registrada.', {
      category: 'licenses',
      projectSlug: 'erporaqui'
    });
    return;
  }

  const receiver = createWebhookReceiver(licencaConfig.webhookSecret, async (payload: any) => {
    appLogger.info('[Webhook] Evento recebido da Central', {
      category: 'licenses',
      eventType: payload.eventType,
      userId: payload.userId,
      status: payload.status
    });
  });

  app.post('/api/licenca/webhook', receiver);
}
