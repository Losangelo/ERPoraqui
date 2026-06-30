import { prisma } from '@/database/prisma.service';
import appLogger from '@/shared/logger/logger';
import { 
  CriarParametroInput, 
  AtualizarParametroInput 
} from './dto/parametro.dto';

export class ParametroService {
  async criar(empresaId: string, dados: CriarParametroInput) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const existente = await prisma.parametroSistema.findFirst({
      where: { empresaId, chave: dados.chave },
    });

    if (existente) {
      throw new Error('Parâmetro com esta chave já existe');
    }

    const parametro = await prisma.parametroSistema.create({
      data: {
        ...dados,
        empresaId,
      },
    });

    appLogger.business('criar_parametro', { empresaId, parametroId: parametro.id, chave: dados.chave });
    return parametro;
  }

  async buscarPorId(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.parametroSistema.findFirst({
      where: { id, empresaId },
    });
  }

  async buscarPorChave(chave: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    return prisma.parametroSistema.findFirst({
      where: { empresaId, chave, ativo: true },
    });
  }

  async listar(empresaId: string, filtros: { modulo?: string; ativo?: boolean; busca?: string }) {
    if (!empresaId) throw new Error('Empresa não identificada');
    const { modulo, ativo, busca } = filtros;

    const where = {
      empresaId,
      ...(modulo && { modulo: modulo as any }),
      ...(ativo !== undefined && { ativo }),
      ...(busca && {
        OR: [
          { chave: { contains: busca, mode: 'insensitive' as const } },
          { descricao: { contains: busca, mode: 'insensitive' as const } },
        ],
      }),
    };

    const parametros = await prisma.parametroSistema.findMany({
      where,
      orderBy: { chave: 'asc' },
    });

    return parametros;
  }

  async atualizar(id: string, empresaId: string, dados: AtualizarParametroInput) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    const parametro = await prisma.parametroSistema.update({
      where: { id },
      data: dados,
    });

    appLogger.business('atualizar_parametro', { empresaId, parametroId: id });
    return parametro;
  }

  async inativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    const parametro = await prisma.parametroSistema.update({
      where: { id },
      data: { ativo: false },
    });

    appLogger.business('inativar_parametro', { empresaId, parametroId: id });
    return parametro;
  }

  async ativar(id: string, empresaId: string) {
    if (!empresaId) throw new Error('Empresa não identificada');
    await this.verificarProprietario(id, empresaId);

    const parametro = await prisma.parametroSistema.update({
      where: { id },
      data: { ativo: true },
    });

    appLogger.business('ativar_parametro', { empresaId, parametroId: id });
    return parametro;
  }

  async obterPorModulo(empresaId: string, modulo: string) {
    if (!empresaId) throw new Error('Empresa não identificada');

    const parametros = await prisma.parametroSistema.findMany({
      where: { empresaId, modulo: modulo as any, ativo: true },
    });

    const resultado: Record<string, string> = {};
    parametros.forEach(p => {
      resultado[p.chave] = p.valor;
    });

    return resultado;
  }

  private async verificarProprietario(id: string, empresaId: string) {
    const parametro = await prisma.parametroSistema.findFirst({
      where: { id, empresaId },
    });

    if (!parametro) {
      throw new Error('Parâmetro não encontrado');
    }
  }
}
