import { vi } from 'vitest';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = 'test-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

const modelMock = () => ({
  findUnique: vi.fn(),
  findFirst: vi.fn(),
  findMany: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  count: vi.fn(),
  createMany: vi.fn(),
  deleteMany: vi.fn(),
  groupBy: vi.fn(),
  aggregate: vi.fn(),
});

export const mockPrisma = {
  usuario: modelMock(),
  empresa: modelMock(),
  filial: modelMock(),
  cliente: modelMock(),
  produto: modelMock(),
  fornecedor: modelMock(),
  transportadora: modelMock(),
  vendedor: modelMock(),
  categoria: modelMock(),
  unidadeMedida: modelMock(),
  pedidoVenda: modelMock(),
  itemPedidoVenda: modelMock(),
  pedidoCompra: modelMock(),
  itemPedidoCompra: modelMock(),
  contaReceber: modelMock(),
  contaPagar: modelMock(),
  caixa: modelMock(),
  operadorPDV: modelMock(),
  vendaPDV: modelMock(),
  itemVendaPDV: modelMock(),
  orcamento: modelMock(),
  cotacaoCompra: modelMock(),
  entradaMercadoria: modelMock(),
  movimentacaoEstoque: modelMock(),
  logSistema: modelMock(),
  licenca: modelMock(),
  plano: modelMock(),
  licencaLog: modelMock(),
  configuracaoNF: modelMock(),
  notaFiscal: modelMock(),
  fluxoCaixa: modelMock(),
  parametroSistema: modelMock(),
  inventario: modelMock(),
  ecf: modelMock(),
  banco: modelMock(),
  boleto: modelMock(),
  $transaction: vi.fn((cb: any) => cb(mockPrisma)),
};

vi.mock('@/database/prisma.service', () => ({
  prisma: mockPrisma,
}));

vi.mock('@prisma/client', () => ({}));

export function gerarToken(usuarioId: string = 'user-1', empresaId: string = 'emp-1'): string {
  return jwt.sign(
    { usuarioId, empresaId },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
}

export function gerarHeaders(token?: string): Record<string, string> {
  const t = token || gerarToken();
  return {
    Authorization: `Bearer ${t}`,
    'Content-Type': 'application/json',
  };
}
