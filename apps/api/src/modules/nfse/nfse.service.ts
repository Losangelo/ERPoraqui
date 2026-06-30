import { prisma } from '@/database/prisma.service';
import { z } from 'zod';
import appLogger from '@/shared/logger/logger';
import { LogCategory } from '@/shared/logger/logger';

const createNFSeSchema = z.object({
  empresaId: z.string(),
  filialId: z.string(),
  clienteId: z.string().optional(),
  competencia: z.string().optional(),
  tipoRps: z.enum(['RPS', 'RPS_CONJUGADO', 'CUPOM']).optional(),
  naturezaOperacao: z.string().optional(),
  regimeTributario: z.enum(['SIMPLES_NACIONAL', 'LUCRO_PRESUMIDO', 'LUCRO_REAL', 'ISENTO']).optional(),
  optanteSimplesNacional: z.boolean().optional(),
  incentivoFiscal: z.boolean().optional(),
  tomadorNome: z.string().optional(),
  tomadorCnpjCpf: z.string().optional(),
  tomadorInscricaoMunicipal: z.string().optional(),
  tomadorEndereco: z.string().optional(),
  tomadorNumero: z.string().optional(),
  tomadorComplemento: z.string().optional(),
  tomadorBairro: z.string().optional(),
  tomadorCidade: z.string().optional(),
  tomadorUf: z.string().optional(),
  tomadorCep: z.string().optional(),
  tomadorTelefone: z.string().optional(),
  tomadorEmail: z.string().optional(),
  servicoproduto: z.string().optional(),
  codigoMunicipio: z.string().optional(),
  codigoServico: z.string().optional(),
  discriminacao: z.string().optional(),
  observacoes: z.string().optional(),
  itens: z.array(z.object({
    codigo: z.string(),
    discriminacao: z.string(),
    quantidade: z.number().optional(),
    valorUnitario: z.number(),
    tributavel: z.boolean().optional(),
    issAliquota: z.number().optional(),
  })).optional(),
});

const updateNFSeSchema = createNFSeSchema.partial();

type CreateNFSeDTO = z.infer<typeof createNFSeSchema>;
type UpdateNFSeDTO = z.infer<typeof updateNFSeSchema>;

export class NFSeService {
  async listar(empresaId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [notas, total] = await Promise.all([
      prisma.notaServico.findMany({
        where: { empresaId },
        skip,
        take: limit,
        orderBy: { dataEmissao: 'desc' },
        include: {
          filial: true,
          cliente: true,
          itens: true,
        },
      }),
      prisma.notaServico.count({ where: { empresaId } }),
    ]);

    return {
      data: notas,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async buscarPorId(id: string) {
    return prisma.notaServico.findUnique({
      where: { id },
      include: {
        filial: true,
        cliente: true,
        itens: true,
      },
    });
  }

  async criar(dto: CreateNFSeDTO) {
    const { itens, ...notaData } = dto;

    const ultimoNumero = await prisma.notaServico.findFirst({
      where: { empresaId: dto.empresaId },
      orderBy: { numero: 'desc' },
    });

    const novoNumero = (ultimoNumero?.numero || 0) + 1;

    const valorServicos = itens?.reduce((sum, item) => sum + (item.valorUnitario * (item.quantidade || 1)), 0) || 0;
    const valorIss = valorServicos * (itens?.[0]?.issAliquota || 0) / 100;
    const valorTotal = valorServicos;

    const nota = await prisma.notaServico.create({
      data: {
        ...notaData,
        numero: novoNumero,
        valorServicos,
        valorIss,
        valorTotal,
        valorLiquido: valorServicos - valorIss,
        itens: itens ? {
          create: itens.map((item, index) => ({
            numeroItem: index + 1,
            codigo: item.codigo,
            discriminacao: item.discriminacao,
            quantidade: item.quantidade || 1,
            valorUnitario: item.valorUnitario,
            valorTotal: item.valorUnitario * (item.quantidade || 1),
            tributavel: item.tributavel ?? true,
            issAliquota: item.issAliquota || 0,
            issValor: (item.valorUnitario * (item.quantidade || 1)) * ((item.issAliquota || 0) / 100),
          })),
        } : undefined,
      },
      include: {
        filial: true,
        cliente: true,
        itens: true,
      },
    });

    appLogger.business('criar_nota_servico', { notaId: nota.id, empresaId: dto.empresaId });
    return nota;
  }

  async atualizar(id: string, dto: UpdateNFSeDTO) {
    const { itens, ...notaData } = dto;

    if (itens) {
      await prisma.itemServico.deleteMany({ where: { notaServicoId: id } });
    }

    const valorServicos = itens?.reduce((sum, item) => sum + (item.valorUnitario * (item.quantidade || 1)), 0) || 0;
    const valorIss = valorServicos ? valorServicos * (itens?.[0]?.issAliquota || 0) / 100 : undefined;

    const nota = await prisma.notaServico.update({
      where: { id },
      data: {
        ...notaData,
        valorServicos,
        valorIss,
        valorTotal: valorServicos,
        valorLiquido: valorServicos ? valorServicos - (valorIss || 0) : undefined,
        itens: itens ? {
          create: itens.map((item, index) => ({
            numeroItem: index + 1,
            codigo: item.codigo,
            discriminacao: item.discriminacao,
            quantidade: item.quantidade || 1,
            valorUnitario: item.valorUnitario,
            valorTotal: item.valorUnitario * (item.quantidade || 1),
            tributavel: item.tributavel ?? true,
            issAliquota: item.issAliquota || 0,
            issValor: (item.valorUnitario * (item.quantidade || 1)) * ((item.issAliquota || 0) / 100),
          })),
        } : undefined,
      },
      include: {
        filial: true,
        cliente: true,
        itens: true,
      },
    });

    appLogger.business('atualizar_nota_servico', { notaId: id });
    return nota;
  }

  async excluir(id: string) {
    const nota = await prisma.notaServico.findUnique({ where: { id } });
    
    if (nota?.situacao === 'AUTORIZADA') {
      throw new Error('Não é possível excluir uma NFSe autorizada. Cancele-a primeiro.');
    }

    await prisma.notaServico.delete({ where: { id } });
    appLogger.business('excluir_nota_servico', { notaId: id });
    return { success: true };
  }

  async listarPorStatus(empresaId: string, situacao: string) {
    return prisma.notaServico.findMany({
      where: { empresaId, situacao: situacao as any },
      orderBy: { dataEmissao: 'desc' },
      include: {
        filial: true,
        cliente: true,
        itens: true,
      },
    });
  }

  async assinar(id: string) {
    const nota = await prisma.notaServico.findUnique({ where: { id } });
    
    if (!nota) {
      throw new Error('NFSe não encontrada');
    }

    if (nota.situacao !== 'EM_DIGITACAO') {
      throw new Error('Apenas NFSe em digitação pode ser assinada');
    }

    const codigoVerificacao = this.gerarCodigoVerificacao();

    const atualizada = await prisma.notaServico.update({
      where: { id },
      data: {
        situacao: 'ASSINADA',
        codigoVerificacao,
      },
    });

    appLogger.business('assinar_nota_servico', { notaId: id });
    return atualizada;
  }

  async enviar(id: string) {
    const nota = await prisma.notaServico.findUnique({ where: { id } });
    
    if (!nota) {
      throw new Error('NFSe não encontrada');
    }

    if (nota.situacao !== 'ASSINADA') {
      throw new Error('A NFSe deve estar assinada para ser enviada');
    }

    const numeroNfse = `${nota.numero.toString().padStart(8, '0')}`;
    const protocolo = `PROT${Date.now()}`;

    const atualizada = await prisma.notaServico.update({
      where: { id },
      data: {
        situacao: 'AUTORIZADA',
        numeroNfse,
        protocolo,
        dataAutorizacao: new Date(),
        statusSefaz: '100',
        mensagemSefaz: 'NFSe autorizada com sucesso',
      },
    });

    appLogger.business('enviar_nota_servico', { notaId: id, numeroNfse });
    return atualizada;
  }

  async cancelar(id: string, motivo: string) {
    const nota = await prisma.notaServico.findUnique({ where: { id } });
    
    if (!nota) {
      throw new Error('NFSe não encontrada');
    }

    if (nota.situacao !== 'AUTORIZADA') {
      throw new Error('Apenas NFSe autorizada pode ser cancelada');
    }

    const atualizada = await prisma.notaServico.update({
      where: { id },
      data: {
        situacao: 'CANCELADA',
        observacoes: nota.observacoes ? `${nota.observacoes}\nCancelamento: ${motivo}` : `Cancelamento: ${motivo}`,
      },
    });

    appLogger.business('cancelar_nota_servico', { notaId: id, motivo });
    return atualizada;
  }

  private gerarCodigoVerificacao(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
