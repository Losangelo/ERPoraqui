import nodemailer from 'nodemailer';
import { emailConfig } from './email.config';
import appLogger from '@/shared/logger/logger';

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    if (emailConfig.enabled) {
      this.transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.port === 465,
        auth: { user: emailConfig.user, pass: emailConfig.pass },
      });
    }
  }

  async send(to: string, subject: string, html: string): Promise<boolean> {
    if (!emailConfig.enabled || !this.transporter) {
      appLogger.warn(`Email not sent (SMTP not configured). To: ${to}, Subject: ${subject}`);
      return false;
    }
    try {
      await this.transporter.sendMail({
        from: emailConfig.from,
        to,
        subject,
        html,
      });
      appLogger.info(`Email sent to ${to}: ${subject}`);
      return true;
    } catch (error: any) {
      appLogger.error(`Failed to send email to ${to}`, error);
      return false;
    }
  }
}

export const emailService = new EmailService();
