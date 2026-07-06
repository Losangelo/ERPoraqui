import { prisma } from '@/database/prisma.service';
import { 
  CriarEmpresaInput, 
  AtualizarEmpresaInput 
} from './dto/empresa.dto';
import { 
  CriarFilialInput, 
  AtualizarFilialInput 
} from './dto/filial.dto';

export class EmpresasService {
  async criar(dados: CriarEmpresaInput) {
    const { logradouro, numero, complemento, bairro, cidade, uf, cep, ...resto } = dados;
    
    return prisma.empresa.create({
      data: {
        ...resto,
        endereco: logradouro ? {
          logradouro,
          numero,
          complemento,
          bairro,
          cidade,
          uf,
          cep,
        } : undefined,
      },
    });
  }

  async buscarPorId(id: string) {
    return prisma.empresa.findUnique({
      where: { id },
    });
  }

  async listarFiliais(empresaId: string, filtro?: { ativo?: boolean }) {
    return prisma.filial.findMany({
      where: { empresaId, ...filtro },
      orderBy: { razaoSocial: 'asc' },
      include: { empresa: { select: { razaoSocial: true, nomeFantasia: true } } },
    });
  }

  async criarFilial(dados: CriarFilialInput) {
    const { logradouro, numero, complemento, bairro, cidade, uf, cep, ...resto } = dados;
    return prisma.filial.create({
      data: {
        ...resto,
        endereco: logradouro ? { logradouro, numero, complemento, bairro, cidade, uf, cep } : undefined,
      },
      include: { empresa: { select: { razaoSocial: true, nomeFantasia: true } } },
    });
  }

  async buscarFilialPorId(id: string) {
    return prisma.filial.findUnique({
      where: { id },
      include: { empresa: { select: { razaoSocial: true, nomeFantasia: true } } },
    });
  }

  async atualizarFilial(id: string, dados: AtualizarFilialInput) {
    const { logradouro, numero, complemento, bairro, cidade, uf, cep, ...resto } = dados;
    return prisma.filial.update({
      where: { id },
      data: {
        ...resto,
        ...(logradouro && { endereco: { logradouro, numero, complemento, bairro, cidade, uf, cep } }),
      },
      include: { empresa: { select: { razaoSocial: true, nomeFantasia: true } } },
    });
  }

  async removerFilial(id: string) {
    const emUso = await Promise.all([
      prisma.pedidoVenda.count({ where: { filialId: id } }),
      prisma.vendaPDV.count({ where: { filialId: id } }),
      prisma.caixa.count({ where: { filialId: id } }),
      prisma.notaFiscal.count({ where: { filialId: id } }),
    ]);
    const total = emUso.reduce((a, b) => a + b, 0);
    if (total > 0) {
      throw new Error(`Filial não pode ser removida pois está vinculada a ${total} registro(s)`);
    }
    return prisma.filial.delete({ where: { id } });
  }

  async listar() {
    const [dados, total] = await Promise.all([
      prisma.empresa.findMany({
        orderBy: { razaoSocial: 'asc' },
        include: { filiais: true },
      }),
      prisma.empresa.count(),
    ]);

    return {
      dados,
      meta: {
        pagina: 1,
        limite: total,
        total,
        totalPaginas: 1,
      },
    };
  }

  async atualizar(id: string, dados: AtualizarEmpresaInput) {
    const { logradouro, numero, complemento, bairro, cidade, uf, cep, ...resto } = dados;
    
    return prisma.empresa.update({
      where: { id },
      data: {
        ...resto,
        ...(logradouro && {
          endereco: {
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            uf,
            cep,
          },
        }),
      },
    });
  }

  async inativar(id: string) {
    return prisma.empresa.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async ativar(id: string) {
    return prisma.empresa.update({
      where: { id },
      data: { ativo: true },
    });
  }
}
