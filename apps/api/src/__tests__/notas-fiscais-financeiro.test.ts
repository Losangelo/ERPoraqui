import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { notasFiscaisRoutes } from '@/modules/notas-fiscais/notas-fiscais.routes';
import { criarApp, limparMocks, mockLicencaAtiva } from './helpers';
import { mockPrisma, gerarHeaders } from './setup';

vi.mock('@/shared/sefaz-client', () => ({
  SefazClient: vi.fn().mockImplementation(function () {
    return {
      autorizar: vi.fn().mockResolvedValue({ codigoRecibo: 'rec-123' }),
      consultarRecibo: vi.fn().mockResolvedValue({
        sucesso: true,
        codigo: '100',
        motivo: 'Autorizado',
        protocolo: 'prot-123',
        xmlRetorno: '<xml></xml>',
      }),
    };
  }),
}));

describe('NotasFiscais - Integração Financeira', () => {
  beforeEach(() => {
    limparMocks();
    mockLicencaAtiva();
  });

  describe('NF-e autorizada → contaReceber', () => {
    it('deve criar contaReceber ao autorizar NF-e com cliente', async () => {
      (mockPrisma.notaFiscal.findFirst as any).mockResolvedValue({
        id: 'nf-1',
        empresaId: 'emp-1',
        clienteId: 'cli-1',
        modelo: 'NFE',
        numero: 1,
        chaveAcesso: '35200600000000000000000000000000000000000000',
        valorTotal: 1500,
        situacao: 'ASSINADA',
        xmlEnvio: '<xml>nfe</xml>',
      });

      (mockPrisma.configuracaoNF.findUnique as any).mockResolvedValue({
        empresaId: 'emp-1',
        certificadoDigital: 'fake-cert',
        senhaCertificado: '1234',
        uf: 'SP',
        ambiente: 'homologacao',
      });

      (mockPrisma.notaFiscal.update as any).mockResolvedValue({
        id: 'nf-1',
        situacao: 'AUTORIZADA',
        chaveAcesso: '35200600000000000000000000000000000000000000',
        valorTotal: 1500,
        clienteId: 'cli-1',
      });

      (mockPrisma.contaReceber.create as any).mockResolvedValue({
        id: 'cr-1',
        empresaId: 'emp-1',
        clienteId: 'cli-1',
        valorOriginal: 1500,
      });

      const app = criarApp((app) => {
        app.use('/notas-fiscais', notasFiscaisRoutes);
      });

      const response = await request(app)
        .post('/notas-fiscais/nf-1/enviar')
        .set(gerarHeaders());

      expect(response.status).toBe(200);
      expect(response.body.situacao).toBe('AUTORIZADA');
      expect(mockPrisma.contaReceber.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            empresaId: 'emp-1',
            clienteId: 'cli-1',
            valorOriginal: 1500,
            numeroDocumento: '35200600000000000000000000000000000000000000',
          }),
        }),
      );
    });

    it('deve criar contaReceber para NFCe autorizada com cliente', async () => {
      (mockPrisma.notaFiscal.findFirst as any).mockResolvedValue({
        id: 'nf-2',
        empresaId: 'emp-1',
        clienteId: 'cli-2',
        modelo: 'NFCE',
        numero: 50,
        chaveAcesso: '35200600000000000000000000000000000000000001',
        valorTotal: 89.90,
        situacao: 'ASSINADA',
        xmlEnvio: '<xml>nfce</xml>',
      });

      (mockPrisma.configuracaoNF.findUnique as any).mockResolvedValue({
        empresaId: 'emp-1',
        certificadoDigital: 'fake-cert',
        senhaCertificado: '1234',
      });

      (mockPrisma.notaFiscal.update as any).mockResolvedValue({
        id: 'nf-2',
        situacao: 'AUTORIZADA',
        valorTotal: 89.90,
        clienteId: 'cli-2',
      });

      (mockPrisma.contaReceber.create as any).mockResolvedValue({ id: 'cr-2' });

      const app = criarApp((app) => {
        app.use('/notas-fiscais', notasFiscaisRoutes);
      });

      const response = await request(app)
        .post('/notas-fiscais/nf-2/enviar')
        .set(gerarHeaders());

      expect(response.status).toBe(200);
      expect(mockPrisma.contaReceber.create).toHaveBeenCalled();
    });

    it('não deve criar contaReceber para NF-e autorizada sem cliente', async () => {
      (mockPrisma.notaFiscal.findFirst as any).mockResolvedValue({
        id: 'nf-3',
        empresaId: 'emp-1',
        clienteId: null,
        modelo: 'NFE',
        numero: 2,
        chaveAcesso: '35200600000000000000000000000000000000000002',
        valorTotal: 500,
        situacao: 'ASSINADA',
        xmlEnvio: '<xml>nfe</xml>',
      });

      (mockPrisma.configuracaoNF.findUnique as any).mockResolvedValue({
        empresaId: 'emp-1',
        certificadoDigital: 'fake-cert',
        senhaCertificado: '1234',
      });

      (mockPrisma.notaFiscal.update as any).mockResolvedValue({
        id: 'nf-3',
        situacao: 'AUTORIZADA',
      });

      const app = criarApp((app) => {
        app.use('/notas-fiscais', notasFiscaisRoutes);
      });

      const response = await request(app)
        .post('/notas-fiscais/nf-3/enviar')
        .set(gerarHeaders());

      expect(response.status).toBe(200);
      expect(mockPrisma.contaReceber.create).not.toHaveBeenCalled();
    });

    it('não deve criar contaReceber para NF-e sem clienteId', async () => {
      (mockPrisma.notaFiscal.findFirst as any).mockResolvedValue({
        id: 'nf-4',
        empresaId: 'emp-1',
        clienteId: 'cli-1',
        modelo: 'NFE',
        numero: 3,
        chaveAcesso: '35200600000000000000000000000000000000000003',
        valorTotal: 3000,
        situacao: 'ASSINADA',
        xmlEnvio: '<xml>nfe</xml>',
        pedidoVendaId: 'ped-1',
      });

      (mockPrisma.configuracaoNF.findUnique as any).mockResolvedValue({
        empresaId: 'emp-1',
        certificadoDigital: 'fake-cert',
        senhaCertificado: '1234',
      });

      (mockPrisma.notaFiscal.update as any).mockResolvedValue({
        id: 'nf-4',
        situacao: 'AUTORIZADA',
      });

      const app = criarApp((app) => {
        app.use('/notas-fiscais', notasFiscaisRoutes);
      });

      const response = await request(app)
        .post('/notas-fiscais/nf-4/enviar')
        .set(gerarHeaders());

      expect(response.status).toBe(200);
      expect(mockPrisma.contaReceber.create).not.toHaveBeenCalled();
    });
  });
});
