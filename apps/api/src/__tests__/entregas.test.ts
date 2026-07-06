import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import entregasRoutes from '@/modules/entregas/entregas.routes';
import { criarApp, limparMocks, mockLicencaAtiva } from './helpers';
import { mockPrisma, gerarHeaders } from './setup';

const entregaMock = {
  id: 'ent-1',
  empresaId: 'emp-1',
  filialId: 'fil-1',
  pedidoVendaId: null,
  clienteId: 'cli-1',
  motoristaId: null,
  veiculoId: null,
  numero: 1,
  status: 'PENDENTE',
  tokenRastreio: '550e8400-e29b-41d4-a716-446655440000',
  enderecoEntrega: { logradouro: 'Rua A', numero: '100', bairro: 'Centro', cidade: 'São Paulo', uf: 'SP', cep: '01000-000' },
  dataPedido: new Date('2026-07-01'),
  dataAgendamento: null,
  dataInicio: null,
  dataConclusao: null,
  observacoes: null,
  contatoNome: 'Maria',
  contatoTelefone: '11999999999',
  createdAt: new Date(),
  updatedAt: new Date(),
  cliente: { id: 'cli-1', nome: 'Cliente Teste' },
  motorista: null,
  veiculo: null,
};

describe('Entregas API', () => {
  beforeEach(() => {
    limparMocks();
    mockLicencaAtiva();
  });

  describe('GET /', () => {
    it('deve listar entregas', async () => {
      (mockPrisma.entrega.findMany as any).mockResolvedValue([entregaMock]);
      (mockPrisma.entrega.count as any).mockResolvedValue(1);

      const app = criarApp((a) => a.use('/', entregasRoutes));
      const res = await request(app).get('/').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.dados).toHaveLength(1);
      expect(res.body.meta.total).toBe(1);
    });

    it('deve retornar 401 sem token', async () => {
      const app = criarApp((a) => a.use('/', entregasRoutes));
      const res = await request(app).get('/');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /', () => {
    it('deve criar entrega com dados válidos', async () => {
      (mockPrisma.entrega.create as any).mockResolvedValue(entregaMock);

      const app = criarApp((a) => a.use('/', entregasRoutes));
      const res = await request(app)
        .post('/')
        .set(gerarHeaders())
        .send({
          clienteId: 'cli-1',
          enderecoEntrega: { logradouro: 'Rua A', numero: '100', bairro: 'Centro', cidade: 'São Paulo', uf: 'SP', cep: '01000-000' },
          contatoNome: 'Maria',
          contatoTelefone: '11999999999',
        });

      expect(res.status).toBe(201);
    });

    it('deve rejeitar entrega sem clienteId', async () => {
      const app = criarApp((a) => a.use('/', entregasRoutes));
      const res = await request(app)
        .post('/')
        .set(gerarHeaders())
        .send({ enderecoEntrega: {} });
      expect(res.status).toBe(400);
    });

    it('deve gerar tokenRastreio automaticamente', async () => {
      const created = { ...entregaMock, tokenRastreio: '550e8400-e29b-41d4-a716-446655440000' };
      (mockPrisma.entrega.create as any).mockResolvedValue(created);

      const app = criarApp((a) => a.use('/', entregasRoutes));
      const res = await request(app)
        .post('/')
        .set(gerarHeaders())
        .send({
          clienteId: 'cli-1',
          enderecoEntrega: { logradouro: 'Rua A', numero: '100', bairro: 'Centro', cidade: 'São Paulo', uf: 'SP', cep: '01000-000' },
        });

      expect(res.status).toBe(201);
      expect(res.body.tokenRastreio).toBeDefined();
      expect(res.body.tokenRastreio).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });
  });

  describe('GET /:id', () => {
    it('deve buscar entrega por ID', async () => {
      (mockPrisma.entrega.findFirst as any).mockResolvedValue(entregaMock);

      const app = criarApp((a) => a.use('/', entregasRoutes));
      const res = await request(app).get('/ent-1').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.id).toBe('ent-1');
    });

    it('deve retornar 404 para entrega inexistente', async () => {
      (mockPrisma.entrega.findFirst as any).mockResolvedValue(null);

      const app = criarApp((a) => a.use('/', entregasRoutes));
      const res = await request(app).get('/inexistente').set(gerarHeaders());
      expect(res.status).toBe(404);
    });
  });

  describe('Status transitions', () => {
    it('deve agendar entrega (PENDENTE → AGENDADO)', async () => {
      const pendente = { ...entregaMock, status: 'PENDENTE', motoristaId: 'mot-1', veiculoId: 'vei-1' };
      (mockPrisma.entrega.findFirst as any).mockResolvedValue(pendente);
      (mockPrisma.entrega.update as any).mockResolvedValue({ ...pendente, status: 'AGENDADO', dataAgendamento: new Date() });

      const app = criarApp((a) => a.use('/', entregasRoutes));
      const res = await request(app)
        .patch('/ent-1/agendar')
        .set(gerarHeaders())
        .send({ dataAgendamento: '2026-07-02T14:00:00Z' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('AGENDADO');
    });

    it('deve falhar ao agendar sem motorista', async () => {
      const semMotorista = { ...entregaMock, status: 'PENDENTE', motoristaId: null, veiculoId: null };
      (mockPrisma.entrega.findFirst as any).mockResolvedValue(semMotorista);

      const app = criarApp((a) => a.use('/', entregasRoutes));
      const res = await request(app)
        .patch('/ent-1/agendar')
        .set(gerarHeaders())
        .send({ dataAgendamento: '2026-07-02T14:00:00Z' });

      expect(res.status).toBe(400);
    });

    it('deve sair para entrega (AGENDADO → SAIU_PARA_ENTREGA)', async () => {
      const agendado = { ...entregaMock, status: 'AGENDADO', motoristaId: 'mot-1', veiculoId: 'vei-1' };
      (mockPrisma.entrega.findFirst as any).mockResolvedValue(agendado);
      (mockPrisma.entrega.update as any).mockResolvedValue({ ...agendado, status: 'SAIU_PARA_ENTREGA', dataInicio: new Date() });

      const app = criarApp((a) => a.use('/', entregasRoutes));
      const res = await request(app).patch('/ent-1/saiu-para-entrega').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('SAIU_PARA_ENTREGA');
    });

    it('deve entregar (SAIU_PARA_ENTREGA → ENTREGUE)', async () => {
      const saiu = { ...entregaMock, status: 'SAIU_PARA_ENTREGA', motoristaId: 'mot-1', veiculoId: 'vei-1' };
      (mockPrisma.entrega.findFirst as any).mockResolvedValue(saiu);
      (mockPrisma.entrega.update as any).mockResolvedValue({ ...saiu, status: 'ENTREGUE', dataConclusao: new Date() });

      const app = criarApp((a) => a.use('/', entregasRoutes));
      const res = await request(app).patch('/ent-1/entregue').set(gerarHeaders());

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ENTREGUE');
    });

    it('deve registrar tentativa falha (SAIU_PARA_ENTREGA → TENTATIVA_FALHOU)', async () => {
      const saiu = { ...entregaMock, status: 'SAIU_PARA_ENTREGA' };
      (mockPrisma.entrega.findFirst as any).mockResolvedValue(saiu);
      (mockPrisma.entrega.update as any).mockResolvedValue({ ...saiu, status: 'TENTATIVA_FALHOU' });

      const app = criarApp((a) => a.use('/', entregasRoutes));
      const res = await request(app)
        .patch('/ent-1/tentativa-falhou')
        .set(gerarHeaders())
        .send({ motivoFalha: 'Cliente ausente' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('TENTATIVA_FALHOU');
    });

    it('deve cancelar entrega (qualquer → CANCELADO)', async () => {
      const pendente = { ...entregaMock, status: 'PENDENTE' };
      (mockPrisma.entrega.findFirst as any).mockResolvedValue(pendente);
      (mockPrisma.entrega.update as any).mockResolvedValue({ ...pendente, status: 'CANCELADO' });

      const app = criarApp((a) => a.use('/', entregasRoutes));
      const res = await request(app)
        .patch('/ent-1/cancelar')
        .set(gerarHeaders())
        .send({ motivo: 'Cliente desistiu' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('CANCELADO');
    });

    it('deve rejeitar cancelamento de entrega já ENTREGUE', async () => {
      const entregue = { ...entregaMock, status: 'ENTREGUE' };
      (mockPrisma.entrega.findFirst as any).mockResolvedValue(entregue);

      const app = criarApp((a) => a.use('/', entregasRoutes));
      const res = await request(app)
        .patch('/ent-1/cancelar')
        .set(gerarHeaders())
        .send({ motivo: 'Teste' });

      expect(res.status).toBe(400);
    });
  });

  describe('Public rastreio endpoint', () => {
    it('deve retornar dados sanitizados da entrega por token', async () => {
      (mockPrisma.entrega.findFirst as any).mockResolvedValue({
        ...entregaMock,
        tentativas: [],
        motorista: { nome: 'João' },
        avaliacoes: null,
      });

      const app = criarApp((a) => a.use('/', entregasRoutes));
      const res = await request(app).get('/public/rastreio/550e8400-e29b-41d4-a716-446655440000');

      expect(res.status).toBe(200);
      expect(res.body.numero).toBe(1);
      expect(res.body.status).toBe('PENDENTE');
      expect(res.body.enderecoEntrega).toBeDefined();
      expect(res.body.motorista).toBeDefined();
      expect(res.body.avaliacao).toBeDefined();
    });

    it('deve retornar 404 para token inválido', async () => {
      (mockPrisma.entrega.findFirst as any).mockResolvedValue(null);

      const app = criarApp((a) => a.use('/', entregasRoutes));
      const res = await request(app).get('/public/rastreio/token-invalido');
      expect(res.status).toBe(404);
    });
  });

  describe('Public avaliar endpoint', () => {
    it('deve criar avaliação para entrega ENTREGUE', async () => {
      const entregue = { ...entregaMock, status: 'ENTREGUE' };
      (mockPrisma.entrega.findFirst as any).mockResolvedValue(entregue);
      (mockPrisma.avaliacao.create as any).mockResolvedValue({
        id: 'av-1',
        entregaId: 'ent-1',
        clienteId: 'cli-1',
        nota: 5,
        comentario: 'Excelente!',
        createdAt: new Date(),
      });

      const app = criarApp((a) => a.use('/', entregasRoutes));
      const res = await request(app)
        .post('/public/avaliar')
        .send({
          token: '550e8400-e29b-41d4-a716-446655440000',
          nota: 5,
          comentario: 'Excelente!',
        });

      expect(res.status).toBe(201);
      expect(res.body.nota).toBe(5);
    });

    it('deve rejeitar avaliação para entrega não ENTREGUE', async () => {
      const pendente = { ...entregaMock, status: 'PENDENTE' };
      (mockPrisma.entrega.findFirst as any).mockResolvedValue(pendente);

      const app = criarApp((a) => a.use('/', entregasRoutes));
      const res = await request(app)
        .post('/public/avaliar')
        .send({
          token: '550e8400-e29b-41d4-a716-446655440000',
          nota: 5,
        });

      expect(res.status).toBe(400);
    });

    it('deve rejeitar avaliação sem nota', async () => {
      const app = criarApp((a) => a.use('/', entregasRoutes));
      const res = await request(app)
        .post('/public/avaliar')
        .send({ token: '550e8400-e29b-41d4-a716-446655440000' });
      expect(res.status).toBe(400);
    });
  });
});
