import express from 'express';
import { mockPrisma } from './setup';

export function criarApp(routes: (app: express.Application) => void) {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  routes(app);
  return app;
}

export function mockLicencaAtiva(empresaId = 'emp-1') {
  (mockPrisma.licenca.findFirst as any).mockResolvedValue({
    id: 'lic-1',
    empresaId,
    planoId: 'plano-1',
    status: 'ATIVA',
    dataExpiracao: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    limiteUsuarios: 10,
    limiteClientes: 1000,
    limiteProdutos: 5000,
    limiteNotasFiscais: 2000,
    clientesAtivos: 5,
    usuariosAtivos: 3,
    produtosAtivos: 10,
    notasEsteMes: 50,
    moduloCrm: true,
    moduloAutomacao: true,
    moduloMultiEmpresa: true,
    moduloApi: true,
    plano: {
      moduloBoletos: true,
      moduloNfse: true,
      moduloEcf: true,
      moduloDre: true,
      moduloPlanoContas: true,
    },
  });
}

export function mockSemLicenca() {
  (mockPrisma.licenca.findFirst as any).mockResolvedValue(null);
}

export function limparMocks() {
  for (const key of Object.keys(mockPrisma)) {
    const model = (mockPrisma as any)[key];
    if (model && typeof model === 'object') {
      for (const methodKey of Object.keys(model)) {
        const fn = model[methodKey];
        if (fn && typeof fn === 'function' && 'mockReset' in fn) {
          fn.mockReset();
        }
      }
    }
  }
}
