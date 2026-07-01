import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { pino } from 'pino';

import { prisma } from '@/database/prisma.service';
import { LicencasService } from '@/modules/licencas/licencas.service';

import { clientesRoutes } from './modules/clientes';
import { produtosRoutes } from './modules/produtos';
import { fornecedoresRoutes } from './modules/fornecedores';
import { empresasRoutes } from './modules/empresas';
import { transportadorasRoutes } from './modules/transportadoras';
import { vendedoresRoutes } from './modules/vendedores';
import { pedidosVendaRoutes } from './modules/pedidos-venda';
import { orcamentosRoutes } from './modules/orcamentos';
import { pedidosCompraRoutes } from './modules/pedidos-compra';
import { cotacoesCompraRoutes } from './modules/cotacoes-compra';
import { entradasMercadoriaRoutes } from './modules/entradas-mercadoria';
import { estoqueRoutes } from './modules/estoque';
import { financeiroRoutes } from './modules/financeiro';
import { movimentacoesInternasRoutes } from './modules/movimentacoes-internas';
import { fluxoCaixaRoutes } from './modules/fluxo-caixa';
import { relatoriosFiscaisRoutes } from './modules/relatorios-fiscais';
import { dashboardGerencialRoutes } from './modules/dashboard-gerencial';
import { notasFiscaisRoutes } from './modules/notas-fiscais';
import { usuariosRoutes } from './modules/usuarios';
import { categoriasRoutes } from './modules/categorias';
import { unidadesMedidaRoutes } from './modules/unidades-medida';
import { logsRoutes } from './modules/logs/logs.routes';
import { boletosRoutes } from './modules/boletos';
import { pdvRoutes } from './modules/pdv';
import { inventarioRoutes } from './modules/inventario';
import { parametrosRoutes } from './modules/parametros';
import { dreRoutes } from './modules/dre';
import { planoContasRoutes } from './modules/plano-contas';
import { nfceRoutes } from './modules/nfce';
import { ecfRoutes } from './modules/ecf';
import { nfseRoutes } from './modules/nfse';
import licencasRoutes from './modules/licencas/licencas.routes';
import { multiEmpresaRoutes } from './modules/multi-empresa/multi-empresa.routes';
import { crmRoutes } from './modules/crm/crm.routes';
import { apiPublicaRoutes } from './modules/api-publica/api-publica.routes';
import { automacaoRoutes } from './modules/automacao/automacao.routes';
import chequesRoutes from './modules/cheques/cheques.routes';
import centrosCustoRoutes from './modules/centros-custo/centros-custo.routes';
import spedFiscalRoutes from './modules/sped-fiscal/sped-fiscal.routes';
import mdfeRoutes from './modules/mdfe/mdfe.routes';
import { produtosVariacoesRoutes } from './modules/produtos-variacoes';
import { produtosLotesRoutes } from './modules/produtos-lotes';
import { tabelasPrecoRoutes } from './modules/tabelas-preco';
import authRoutes from './modules/auth/auth.routes';
import appLogger from './shared/logger/logger';

dotenv.config();

process.on('unhandledRejection', (reason: any) => {
  logger.error({ err: reason }, 'Unhandled Rejection - process kept alive');
});

const app = express();
const logger = pino();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
}));

app.options('*', cors());

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    appLogger.http(req, res.statusCode, duration);
  });
  next();
});

app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/clientes', clientesRoutes);
app.use('/api/v1/produtos', produtosRoutes);
app.use('/api/v1/fornecedores', fornecedoresRoutes);
app.use('/api/v1/empresas', empresasRoutes);
app.use('/api/v1/transportadoras', transportadorasRoutes);
app.use('/api/v1/vendedores', vendedoresRoutes);
app.use('/api/v1/pedidos-venda', pedidosVendaRoutes);
app.use('/api/v1/orcamentos', orcamentosRoutes);
app.use('/api/v1/pedidos-compra', pedidosCompraRoutes);
app.use('/api/v1/cotacoes-compra', cotacoesCompraRoutes);
app.use('/api/v1/entradas-mercadoria', entradasMercadoriaRoutes);
app.use('/api/v1/estoque', estoqueRoutes);
app.use('/api/v1/financeiro', financeiroRoutes);
app.use('/api/v1/movimentacoes-internas', movimentacoesInternasRoutes);
app.use('/api/v1/fluxo-caixa', fluxoCaixaRoutes);
app.use('/api/v1/relatorios-fiscais', relatoriosFiscaisRoutes);
app.use('/api/v1/dashboard', dashboardGerencialRoutes);
app.use('/api/v1/notas-fiscais', notasFiscaisRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1/categorias', categoriasRoutes);
app.use('/api/v1/unidades-medida', unidadesMedidaRoutes);
app.use('/api/v1/logs', logsRoutes);
app.use('/api/v1/boletos', boletosRoutes);
app.use('/api/v1/pdv', pdvRoutes);
app.use('/api/v1/inventario', inventarioRoutes);
app.use('/api/v1/parametros', parametrosRoutes);
app.use('/api/v1/dre', dreRoutes);
app.use('/api/v1/plano-contas', planoContasRoutes);
app.use('/api/v1/nfce', nfceRoutes);
app.use('/api/v1/ecf', ecfRoutes);
app.use('/api/v1/nfse', nfseRoutes);
app.use('/api/v1/licencas', licencasRoutes);
app.use('/api/v1/multi-empresa', multiEmpresaRoutes);
app.use('/api/v1/crm', crmRoutes);
app.use('/api/v1/public', apiPublicaRoutes);
app.use('/api/v1/automacao', automacaoRoutes);
app.use('/api/v1/produtos-variacoes', produtosVariacoesRoutes);
app.use('/api/v1/produtos-lotes', produtosLotesRoutes);
app.use('/api/v1/tabelas-preco', tabelasPrecoRoutes);
app.use('/api/v1/cheques', chequesRoutes);
app.use('/api/v1/centros-custo', centrosCustoRoutes);
app.use('/api/v1/sped-fiscal', spedFiscalRoutes);
app.use('/api/v1/mdfe', mdfeRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err.message);
  logger.error({ err }, 'Application error');
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    },
  });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`);

  // Seed planos e licencas na inicializacao
  try {
    const licencasService = new LicencasService(prisma);
    const seedResult = await licencasService.seedPlanosPadrao();
    if (seedResult.message !== 'Planos ja existem') {
      logger.info('Planos padrao seedados com sucesso');
    }
    const licencasResult = await licencasService.seedLicencasParaEmpresas();
    if (licencasResult.message !== 'Nenhuma empresa encontrada para vincular licenca') {
      logger.info(`Seed de licencas: ${licencasResult.message}`);
    }
  } catch (err) {
    logger.error({ err }, 'Erro ao seedar dados na inicializacao');
  }
});

export default app;
