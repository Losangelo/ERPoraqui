import { prisma } from '@/database/prisma.service';
import { 
  CriarEmpresaInput, 
  AtualizarEmpresaInput 
} from './dto/empresa.dto';

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

  async listarFiliais(empresaId: string) {
    return prisma.filial.findMany({
      where: { empresaId, ativo: true },
      orderBy: { razaoSocial: 'asc' },
    });
  }

  async listar() {
    const [dados, total] = await Promise.all([
      prisma.empresa.findMany({
        orderBy: { razaoSocial: 'asc' },
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
