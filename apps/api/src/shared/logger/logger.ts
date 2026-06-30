import pino from 'pino';
import { Request } from 'express';

export enum LogCategory {
  AUTH = 'auth',
  DATABASE = 'database',
  API = 'api',
  BUSINESS = 'business',
  VALIDATION = 'validation',
  SECURITY = 'security',
  SYSTEM = 'system',
}

export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug',
}

export interface LogMetadata {
  category: LogCategory;
  action: string;
  userId?: string;
  empresaId?: string;
  requestId?: string;
  [key: string]: unknown;
}

const loggerConfig = {
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      levelFirst: true,
    }
  } : undefined,
};

const logger = pino(loggerConfig);

let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
  }
  return prisma;
}

async function saveToDatabase(
  category: string,
  action: string,
  level: string,
  message: string,
  details?: Record<string, unknown>,
  userId?: string,
  empresaId?: string,
  ip?: string,
  userAgent?: string
) {
  try {
    const db = await getPrisma();
    await db.logSistema.create({
      data: {
        categoria: category,
        acao: action,
        nivel: level,
        mensagem: message,
        detalhes: details || {},
        usuarioId: userId,
        empresaId: empresaId,
        ip: ip,
        userAgent: userAgent,
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to save log to database');
  }
}

export const appLogger = {
  async info(message: string, metadata?: LogMetadata) {
    logger.info({ ...metadata }, message);
    
    if (metadata?.category) {
      await saveToDatabase(
        metadata.category,
        metadata.action,
        LogLevel.INFO,
        message,
        metadata,
        metadata.userId,
        metadata.empresaId
      );
    }
  },

  async warn(message: string, metadata?: LogMetadata) {
    logger.warn({ ...metadata }, message);
    
    if (metadata?.category) {
      await saveToDatabase(
        metadata.category,
        metadata.action,
        LogLevel.WARN,
        message,
        metadata,
        metadata.userId,
        metadata.empresaId
      );
    }
  },

  async error(message: string, error?: Error, metadata?: LogMetadata) {
    const errorDetails = error ? {
      message: error.message,
      stack: error.stack,
      name: error.name,
    } : undefined;
    
    logger.error({ ...metadata, error: errorDetails }, message);
    
    if (metadata?.category) {
      await saveToDatabase(
        metadata.category,
        metadata.action,
        LogLevel.ERROR,
        message,
        { ...metadata, ...errorDetails },
        metadata.userId,
        metadata.empresaId
      );
    }
  },

  debug(message: string, metadata?: LogMetadata) {
    logger.debug({ ...metadata }, message);
  },

  async http(req: Request, statusCode: number, responseTime: number) {
    const userId = (req as any).user?.id;
    const empresaId = (req as any).user?.empresaId;
    const userAgent = req.get('user-agent');

    const logData = {
      category: LogCategory.API,
      action: `${req.method} ${req.route?.path || req.url}`,
      userId,
      empresaId,
      method: req.method,
      url: req.url,
      statusCode,
      responseTime,
      ip: req.ip,
      userAgent,
    };

    if (statusCode >= 400) {
      logger.warn(logData, `${req.method} ${req.url} ${statusCode} - ${responseTime}ms`);
    } else {
      logger.info(logData, `${req.method} ${req.url} ${statusCode} - ${responseTime}ms`);
    }

    await saveToDatabase(
      LogCategory.API,
      `${req.method} ${req.url}`,
      statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO,
      `${req.method} ${req.url} - ${statusCode} - ${responseTime}ms`,
      { method: req.method, statusCode, responseTime, url: req.url },
      userId,
      empresaId,
      req.ip,
      userAgent
    );
  },

  async auth(action: string, success: boolean, metadata?: Partial<LogMetadata>) {
    const message = `Auth: ${action} - ${success ? 'SUCCESS' : 'FAILED'}`;
    
    if (success) {
      logger.info({ category: LogCategory.AUTH, action, success, ...metadata }, message);
    } else {
      logger.warn({ category: LogCategory.AUTH, action, success, ...metadata }, message);
    }

    await saveToDatabase(
      LogCategory.AUTH,
      action,
      success ? LogLevel.INFO : LogLevel.WARN,
      message,
      { success, ...metadata },
      metadata?.userId,
      metadata?.empresaId
    );
  },

  async database(action: string, duration: number, metadata?: Partial<LogMetadata>) {
    logger.debug({ category: LogCategory.DATABASE, action, duration, ...metadata }, `Database: ${action} - ${duration}ms`);
  },

  async business(action: string, metadata?: Partial<LogMetadata>) {
    logger.info({ category: LogCategory.BUSINESS, action, ...metadata }, `Business: ${action}`);
    
    await saveToDatabase(
      LogCategory.BUSINESS,
      action,
      LogLevel.INFO,
      `Business: ${action}`,
      metadata,
      metadata?.userId,
      metadata?.empresaId
    );
  },

  async validation(action: string, errors: string[], metadata?: Partial<LogMetadata>) {
    logger.warn({ category: LogCategory.VALIDATION, action, errors, ...metadata }, `Validation: ${action} - ${errors.length} errors`);
    
    await saveToDatabase(
      LogCategory.VALIDATION,
      action,
      LogLevel.WARN,
      `Validation: ${action} - ${errors.length} errors`,
      { errors, ...metadata },
      metadata?.userId,
      metadata?.empresaId
    );
  },

  async security(action: string, metadata?: Partial<LogMetadata>) {
    logger.warn({ category: LogCategory.SECURITY, action, ...metadata }, `Security: ${action}`);
    
    await saveToDatabase(
      LogCategory.SECURITY,
      action,
      LogLevel.WARN,
      `Security: ${action}`,
      metadata,
      metadata?.userId,
      metadata?.empresaId
    );
  },

  async getLogs(filters: {
    categoria?: string;
    nivel?: string;
    usuarioId?: string;
    empresaId?: string;
    dataInicio?: Date;
    dataFim?: Date;
    busca?: string;
    pagina?: number;
    limite?: number;
  }) {
    const { categoria, nivel, usuarioId, empresaId, dataInicio, dataFim, busca, pagina = 1, limite = 50 } = filters;
    const db = await getPrisma();

    const where: any = {};

    if (categoria) where.categoria = categoria;
    if (nivel) where.nivel = nivel;
    if (usuarioId) where.usuarioId = usuarioId;
    if (empresaId) where.empresaId = empresaId;
    
    if (dataInicio || dataFim) {
      where.dataCriacao = {};
      if (dataInicio) where.dataCriacao.gte = dataInicio;
      if (dataFim) where.dataCriacao.lte = dataFim;
    }

    if (busca) {
      where.OR = [
        { mensagem: { contains: busca, mode: 'insensitive' } },
        { acao: { contains: busca, mode: 'insensitive' } },
      ];
    }

    const [dados, total] = await Promise.all([
      db.logSistema.findMany({
        where,
        orderBy: { dataCriacao: 'desc' },
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      db.logSistema.count({ where }),
    ]);

    return {
      dados,
      meta: {
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  },

  async getStats(empresaId?: string) {
    const where = empresaId ? { empresaId } : {};
    const db = await getPrisma();

    const [porCategoria, porNivel, totalHoje, ultimosErros] = await Promise.all([
      db.logSistema.groupBy({
        by: ['categoria'],
        where,
        _count: true,
      }),
      db.logSistema.groupBy({
        by: ['nivel'],
        where,
        _count: true,
      }),
      db.logSistema.count({
        where: {
          ...where,
          dataCriacao: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      db.logSistema.findMany({
        where: { ...where, nivel: 'error' },
        orderBy: { dataCriacao: 'desc' },
        take: 10,
      }),
    ]);

    return {
      porCategoria: porCategoria.map((c: any) => ({ categoria: c.categoria, quantidade: c._count })),
      porNivel: porNivel.map((n: any) => ({ nivel: n.nivel, quantidade: n._count })),
      totalHoje,
      ultimosErros,
    };
  },
};

export default appLogger;
