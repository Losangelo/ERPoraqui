import { prisma } from '@/database/prisma.service';
import type { CriarCteInput, AtualizarCteInput, CteFiltro } from './dto/cte.dto';

const CTE_INCLUDE = {
  tomador: true,
  remetente: true,
  destinatario: true,
} as const;

export class CteService {
  async listar(filtros: CteFiltro, empresaId: string) {
    const where: Record<string, unknown> = { empresaId };
    if (filtros.situacao) where.situacao = filtros.situacao;
    if (filtros.periodoIni || filtros.periodoFin) {
      const dataEmissao: Record<string, Date> = {};
      if (filtros.periodoIni) dataEmissao.gte = filtros.periodoIni;
      if (filtros.periodoFin) dataEmissao.lte = filtros.periodoFin;
      where.dataEmissao = dataEmissao;
    }
    const [data, total] = await Promise.all([
      prisma.cte.findMany({
        where,
        include: CTE_INCLUDE,
        orderBy: { dataEmissao: 'desc' },
        skip: (filtros.pagina - 1) * filtros.limite,
        take: filtros.limite,
      }),
      prisma.cte.count({ where }),
    ]);
    return { data, total, pagina: filtros.pagina, totalPaginas: Math.ceil(total / filtros.limite) };
  }

  async buscar(id: string, empresaId: string) {
    const cte = await prisma.cte.findFirst({ where: { id, empresaId }, include: CTE_INCLUDE });
    if (!cte) throw new Error('CT-e não encontrado');
    return cte;
  }

  async criar(dados: CriarCteInput, empresaId: string) {
    const ultimo = await prisma.cte.findFirst({
      where: { empresaId, filialId: dados.filialId },
      orderBy: { numero: 'desc' },
      select: { numero: true },
    });
    const proximoNumero = (ultimo?.numero ?? 0) + 1;
    const chaveAcesso = this.gerarChaveAcesso(empresaId, proximoNumero);
    return prisma.cte.create({
      data: {
        empresaId,
        filialId: dados.filialId,
        numero: proximoNumero,
        chaveAcesso,
        serie: '1',
        tomadorId: dados.tomadorId,
        tomadorTipo: dados.tomadorTipo,
        remetenteId: dados.remetenteId,
        destinatarioId: dados.destinatarioId,
        tipoServico: dados.tipoServico,
        valorFrete: dados.valorFrete,
        valorCarga: dados.valorCarga,
        naturezaCarga: dados.naturezaCarga,
        especieCarga: dados.especieCarga,
        peso: dados.peso,
        volumes: dados.volumes,
      },
      include: CTE_INCLUDE,
    });
  }

  async atualizar(id: string, dados: AtualizarCteInput, empresaId: string) {
    await this.buscar(id, empresaId);
    return prisma.cte.update({ where: { id }, data: dados as any, include: CTE_INCLUDE });
  }

  async excluir(id: string, empresaId: string) {
    const cte = await this.buscar(id, empresaId);
    if (cte.situacao !== 'EM_DIGITACAO') throw new Error('Só é possível excluir CT-e em digitação');
    await prisma.cte.delete({ where: { id } });
    return { success: true };
  }

  async cancelar(id: string, empresaId: string) {
    const cte = await this.buscar(id, empresaId);
    if (cte.situacao !== 'EM_DIGITACAO' && cte.situacao !== 'AUTORIZADO') {
      throw new Error('Só é possível cancelar CT-e em digitação ou autorizado');
    }
    return prisma.cte.update({
      where: { id },
      data: { situacao: 'CANCELADO' },
      include: CTE_INCLUDE,
    });
  }

  private gerarChaveAcesso(empresaId: string, numero: number): string {
    const uf = '35';
    const ano = new Date().getFullYear().toString();
    const mes = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const cnpjRaw = empresaId.replace(/\D/g, '').padStart(14, '0').slice(0, 14);
    const modelo = '57';
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
