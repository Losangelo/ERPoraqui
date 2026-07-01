import { prisma } from '@/shared/database/prisma-client';
import type {
  VeiculoInput,
  VeiculoUpdate,
  CondutorInput,
  CondutorUpdate,
  CriarMdfeInput,
  AtualizarMdfeInput,
  MdfeFiltro,
  IncluirDocumentoInput,
} from './dto/mdfe.dto';

const MDFE_INCLUDE = {
  veiculo: true,
  condutor: true,
  documentos: true,
  eventos: { orderBy: { dataEvento: 'desc' as const } },
};

export class MdfeService {
  // ==================== VEÍCULOS ====================

  async listarVeiculos(empresaId: string) {
    return prisma.veiculo.findMany({ where: { empresaId }, orderBy: { placa: 'asc' } });
  }

  async buscarVeiculo(id: string, empresaId: string) {
    const veiculo = await prisma.veiculo.findFirst({ where: { id, empresaId } });
    if (!veiculo) throw new Error('Veículo não encontrado');
    return veiculo;
  }

  async criarVeiculo(dados: VeiculoInput, empresaId: string) {
    const existente = await prisma.veiculo.findUnique({ where: { empresaId_placa: { empresaId, placa: dados.placa } } });
    if (existente) throw new Error(`Placa ${dados.placa} já cadastrada`);
    return prisma.veiculo.create({ data: { ...dados, empresaId } });
  }

  async atualizarVeiculo(id: string, dados: VeiculoUpdate, empresaId: string) {
    await this.buscarVeiculo(id, empresaId);
    return prisma.veiculo.update({ where: { id }, data: dados });
  }

  async excluirVeiculo(id: string, empresaId: string) {
    await this.buscarVeiculo(id, empresaId);
    const emUso = await prisma.mdfe.count({ where: { veiculoId: id, situacao: { notIn: ['CANCELADO', 'ENCERRADO'] } } });
    if (emUso > 0) throw new Error('Veículo vinculado a MDF-e não encerrado');
    return prisma.veiculo.delete({ where: { id } });
  }

  // ==================== CONDUTORES ====================

  async listarCondutores(empresaId: string) {
    return prisma.condutor.findMany({ where: { empresaId }, orderBy: { nome: 'asc' } });
  }

  async buscarCondutor(id: string, empresaId: string) {
    const condutor = await prisma.condutor.findFirst({ where: { id, empresaId } });
    if (!condutor) throw new Error('Condutor não encontrado');
    return condutor;
  }

  async criarCondutor(dados: CondutorInput, empresaId: string) {
    const existente = await prisma.condutor.findUnique({ where: { empresaId_cpf: { empresaId, cpf: dados.cpf } } });
    if (existente) throw new Error(`CPF ${dados.cpf} já cadastrado`);
    return prisma.condutor.create({ data: { ...dados, empresaId } });
  }

  async atualizarCondutor(id: string, dados: CondutorUpdate, empresaId: string) {
    await this.buscarCondutor(id, empresaId);
    return prisma.condutor.update({ where: { id }, data: dados });
  }

  async excluirCondutor(id: string, empresaId: string) {
    await this.buscarCondutor(id, empresaId);
    const emUso = await prisma.mdfe.count({ where: { condutorId: id, situacao: { notIn: ['CANCELADO', 'ENCERRADO'] } } });
    if (emUso > 0) throw new Error('Condutor vinculado a MDF-e não encerrado');
    return prisma.condutor.delete({ where: { id } });
  }

  // ==================== MDF-E ====================

  async listarMdfes(filtros: MdfeFiltro, empresaId: string) {
    const where: any = { empresaId };
    if (filtros.situacao) where.situacao = filtros.situacao;
    if (filtros.periodoIni || filtros.periodoFin) {
      where.dataEmissao = {};
      if (filtros.periodoIni) where.dataEmissao.gte = filtros.periodoIni;
      if (filtros.periodoFin) where.dataEmissao.lte = filtros.periodoFin;
    }
    const [data, total] = await Promise.all([
      prisma.mdfe.findMany({
        where,
        include: MDFE_INCLUDE,
        orderBy: { dataEmissao: 'desc' },
        skip: (filtros.pagina - 1) * filtros.limite,
        take: filtros.limite,
      }),
      prisma.mdfe.count({ where }),
    ]);
    return { data, total, pagina: filtros.pagina, totalPaginas: Math.ceil(total / filtros.limite) };
  }

  async buscarMdfe(id: string, empresaId: string) {
    const mdfe = await prisma.mdfe.findFirst({ where: { id, empresaId }, include: MDFE_INCLUDE });
    if (!mdfe) throw new Error('MDF-e não encontrado');
    return mdfe;
  }

  async criarMdfe(dados: CriarMdfeInput, empresaId: string) {
    const { documentos, ...resto } = dados;
    const ultimo = await prisma.mdfe.findFirst({
      where: { empresaId, filialId: resto.filialId },
      orderBy: { numero: 'desc' },
      select: { numero: true },
    });
    const proximoNumero = (ultimo?.numero ?? 0) + 1;
    const chaveAcesso = this.gerarChaveAcesso(empresaId, proximoNumero);
    return prisma.mdfe.create({
      data: {
        ...resto,
        empresaId,
        numero: proximoNumero,
        chaveAcesso,
        documentos: documentos.length > 0 ? { create: documentos } : undefined,
      },
      include: MDFE_INCLUDE,
    });
  }

  async atualizarMdfe(id: string, dados: AtualizarMdfeInput, empresaId: string) {
    await this.buscarMdfe(id, empresaId);
    const { documentos, ...resto } = dados;
    const updateData: any = { ...resto };
    if (documentos) {
      await prisma.mdfeDocumento.deleteMany({ where: { mdfeId: id } });
      updateData.documentos = { create: documentos };
    }
    return prisma.mdfe.update({
      where: { id },
      data: updateData,
      include: MDFE_INCLUDE,
    });
  }

  async excluirMdfe(id: string, empresaId: string) {
    const mdfe = await this.buscarMdfe(id, empresaId);
    if (mdfe.situacao !== 'EM_DIGITACAO') throw new Error('Só é possível excluir MDF-e em digitação');
    await prisma.mdfe.delete({ where: { id } });
    return { success: true };
  }

  // ==================== EVENTOS ====================

  async incluirDocumento(mdfeId: string, dados: IncluirDocumentoInput, empresaId: string) {
    await this.buscarMdfe(mdfeId, empresaId);
    const mdfe = await prisma.mdfe.update({
      where: { id: mdfeId },
      data: {
        documentos: { create: dados },
        qtdTotalDocumentos: { increment: 1 },
      },
      include: MDFE_INCLUDE,
    });
    return mdfe;
  }

  async removerDocumento(mdfeId: string, documentoId: string, empresaId: string) {
    await this.buscarMdfe(mdfeId, empresaId);
    await prisma.mdfeDocumento.delete({ where: { id: documentoId } });
    return prisma.mdfe.update({
      where: { id: mdfeId },
      data: { qtdTotalDocumentos: { decrement: 1 } },
      include: MDFE_INCLUDE,
    });
  }

  async cancelarMdfe(id: string, empresaId: string) {
    const mdfe = await this.buscarMdfe(id, empresaId);
    if (mdfe.situacao !== 'AUTORIZADO') throw new Error('Só é possível cancelar MDF-e autorizado');
    await prisma.mdfeEvento.create({
      data: { mdfeId: id, tipo: 'CANCELAMENTO', descricao: 'Cancelamento solicitado' },
    });
    return prisma.mdfe.update({
      where: { id },
      data: { situacao: 'CANCELADO' },
      include: MDFE_INCLUDE,
    });
  }

  async encerrarMdfe(id: string, empresaId: string) {
    const mdfe = await this.buscarMdfe(id, empresaId);
    if (mdfe.situacao !== 'AUTORIZADO') throw new Error('Só é possível encerrar MDF-e autorizado');
    await prisma.mdfeEvento.create({
      data: { mdfeId: id, tipo: 'ENCERRAMENTO', descricao: 'Encerramento solicitado' },
    });
    return prisma.mdfe.update({
      where: { id },
      data: { situacao: 'ENCERRADO', dataEncerramento: new Date() },
      include: MDFE_INCLUDE,
    });
  }

  // ==================== UTILITÁRIOS ====================

  private gerarChaveAcesso(empresaId: string, numero: number): string {
    const uf = '35';
    const ano = new Date().getFullYear().toString();
    const mes = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const cnpjRaw = empresaId.replace(/\D/g, '').padStart(14, '0').slice(0, 14);
    const modelo = '58';
    const serie = '001';
    const numStr = numero.toString().padStart(9, '0');
    const tpEmis = '1';
    const codigo = '00000000';
    const base = `${uf}${ano}${mes}${cnpjRaw}${modelo}${serie}${numStr}${tpEmis}${codigo}`;
    const dv = this.calcularDVChave(base);
    return `${base}${dv}`;
  }

  private calcularDVChave(chave: string): string {
    let soma = 0;
    let peso = 2;
    for (let i = chave.length - 1; i >= 0; i--) {
      soma += parseInt(chave[i], 10) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    const resto = soma % 11;
    const dv = resto < 2 ? 0 : 11 - resto;
    return dv.toString();
  }
}
