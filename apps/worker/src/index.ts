import amqp from 'amqplib';
import nodemailer from 'nodemailer';
import pino from 'pino';

const logger = pino({ name: 'worker-email' });

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const QUEUE = 'email';

const smtpConfig = {
  host: process.env.SMTP_HOST || '',
  port: parseInt(process.env.SMTP_PORT || '587'),
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
  from: process.env.EMAIL_FROM || 'noreply@erporaqui.com.br',
};

const transporter = smtpConfig.host
  ? nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.port === 465,
      auth: { user: smtpConfig.user, pass: smtpConfig.pass },
    })
  : null;

interface EmailJob {
  to: string;
  subject: string;
  html: string;
  entregaId?: string;
}

async function processEmail(job: EmailJob) {
  if (!transporter) {
    logger.warn({ to: job.to, subject: job.subject }, 'SMTP not configured, skipping email');
    return;
  }
  try {
    await transporter.sendMail({
      from: smtpConfig.from,
      to: job.to,
      subject: job.subject,
      html: job.html,
    });
    logger.info({ to: job.to, subject: job.subject, entregaId: job.entregaId }, 'Email sent successfully');
  } catch (error: any) {
    logger.error({ error: error.message, to: job.to, subject: job.subject }, 'Failed to send email');
    throw error;
  }
}

async function start() {
  logger.info('Worker starting...');

  if (!smtpConfig.host) {
    logger.warn('SMTP not configured. Worker will log emails but not send them.');
  }

  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE, { durable: true });
    channel.prefetch(1);

    logger.info(`Worker connected to RabbitMQ, waiting for jobs in queue "${QUEUE}"`);

    channel.consume(QUEUE, async (msg) => {
      if (!msg) return;

      try {
        const job: EmailJob = JSON.parse(msg.content.toString());
        logger.info({ job }, 'Processing email job');
        await processEmail(job);
        channel.ack(msg);
      } catch (error: any) {
        logger.error({ error: error.message }, 'Error processing email job');
        // Reject and requeue up to 3 times
        const retries = (msg.properties.headers?.['x-retry'] as number) || 0;
        if (retries < 3) {
          channel.sendToQueue(QUEUE, msg.content, {
            headers: { 'x-retry': retries + 1 },
            persistent: true,
          });
        }
        channel.ack(msg);
      }
    });

    connection.on('close', () => {
      logger.error('RabbitMQ connection closed. Reconnecting in 5s...');
      setTimeout(start, 5000);
    });

    connection.on('error', (err) => {
      logger.error({ err }, 'RabbitMQ connection error');
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to connect to RabbitMQ. Retrying in 10s...');
    setTimeout(start, 10000);
  }
}

start();
