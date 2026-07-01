import { prisma } from '@/shared/database/prisma-client';

interface DataSourceColumn {
  key: string
  label: string
  type: 'string' | 'number' | 'date' | 'boolean'
}

interface DataSource {
  id: string
  nome: string
  descricao: string
  colunas: DataSourceColumn[]
  query: (empresaId: string, colunas: string[], filtros: any[]) => Promise<any[]>
}

const dataSources: DataSource[] = [
  {
    id: 'clientes',
    nome: 'Clientes',
    descricao: 'Cadastro de clientes PF/PJ',
    colunas: [
      { key: 'nome', label: 'Nome', type: 'string' },
      { key: 'cpfCnpj', label: 'CPF/CNPJ', type: 'string' },
      { key: 'telefone', label: 'Telefone', type: 'string' },
      { key: 'email', label: 'E-mail', type: 'string' },
      { key: 'cidade', label: 'Cidade', type: 'string' },
      { key: 'uf', label: 'UF', type: 'string' },
      { key: 'tipoPessoa', label: 'Tipo Pessoa', type: 'string' },
      { key: 'ativo', label: 'Ativo', type: 'boolean' },
      { key: 'dataCadastro', label: 'Data Cadastro', type: 'date' },
    ],
    query: async (empresaId, colunas) => {
      const select = colunas.reduce((acc, c) => ({ ...acc, [c]: true }), { empresaId: true })
      return prisma.cliente.findMany({ where: { empresaId }, select, orderBy: { nome: 'asc' } })
    },
  },
  {
    id: 'produtos',
    nome: 'Produtos',
    descricao: 'Cadastro de produtos',
    colunas: [
      { key: 'nome', label: 'Nome', type: 'string' },
      { key: 'codigo', label: 'Código', type: 'string' },
      { key: 'ncm', label: 'NCM', type: 'string' },
      { key: 'unidade', label: 'Unidade', type: 'string' },
      { key: 'precoVenda', label: 'Preço Venda', type: 'number' },
      { key: 'precoCusto', label: 'Preço Custo', type: 'number' },
      { key: 'estoqueAtual', label: 'Estoque Atual', type: 'number' },
      { key: 'categoria', label: 'Categoria', type: 'string' },
      { key: 'ativo', label: 'Ativo', type: 'boolean' },
    ],
    query: async (empresaId, colunas) => {
      const select = colunas.reduce((acc, c) => ({ ...acc, [c]: true }), { empresaId: true })
      return prisma.produto.findMany({ where: { empresaId }, select, orderBy: { nome: 'asc' } })
    },
  },
  {
    id: 'pedidos-venda',
    nome: 'Pedidos de Venda',
    descricao: 'Pedidos de venda emitidos',
    colunas: [
      { key: 'numero', label: 'Número', type: 'string' },
      { key: 'cliente', label: 'Cliente', type: 'string' },
      { key: 'dataEmissao', label: 'Data Emissão', type: 'date' },
      { key: 'total', label: 'Total', type: 'number' },
      { key: 'status', label: 'Status', type: 'string' },
      { key: 'formaPagamento', label: 'Forma Pagamento', type: 'string' },
    ],
    query: async (empresaId, colunas) => {
      const rows = await prisma.pedidoVenda.findMany({
        where: { empresaId },
        include: { cliente: { select: { nome: true } } },
        orderBy: { dataEmissao: 'desc' },
        take: 500,
      })
      return rows.map(r => ({
        numero: r.numero,
        cliente: r.cliente?.nome || '-',
        dataEmissao: r.dataEmissao,
        total: r.total,
        status: r.status,
        formaPagamento: r.formaPagamento,
      }))
    },
  },
  {
    id: 'pedidos-compra',
    nome: 'Pedidos de Compra',
    descricao: 'Pedidos de compra emitidos',
    colunas: [
      { key: 'numero', label: 'Número', type: 'string' },
      { key: 'fornecedor', label: 'Fornecedor', type: 'string' },
      { key: 'dataEmissao', label: 'Data Emissão', type: 'date' },
      { key: 'total', label: 'Total', type: 'number' },
      { key: 'status', label: 'Status', type: 'string' },
    ],
    query: async (empresaId, colunas) => {
      const rows = await prisma.pedidoCompra.findMany({
        where: { empresaId },
        include: { fornecedor: { select: { nome: true } } },
        orderBy: { dataEmissao: 'desc' },
        take: 500,
      })
      return rows.map(r => ({
        numero: r.numero,
        fornecedor: r.fornecedor?.nome || '-',
        dataEmissao: r.dataEmissao,
        total: r.total,
        status: r.status,
      }))
    },
  },
  {
    id: 'contas-receber',
    nome: 'Contas a Receber',
    descricao: 'Contas a receber abertas',
    colunas: [
      { key: 'cliente', label: 'Cliente', type: 'string' },
      { key: 'descricao', label: 'Descrição', type: 'string' },
      { key: 'valor', label: 'Valor', type: 'number' },
      { key: 'dataVencimento', label: 'Vencimento', type: 'date' },
      { key: 'situacao', label: 'Situação', type: 'string' },
      { key: 'dataPagamento', label: 'Data Pagamento', type: 'date' },
    ],
    query: async (empresaId, colunas) => {
      const rows = await prisma.contaReceber.findMany({
        where: { empresaId },
        include: { cliente: { select: { nome: true } } },
        orderBy: { dataVencimento: 'desc' },
        take: 500,
      })
      return rows.map(r => ({
        cliente: r.cliente?.nome || '-',
        descricao: r.descricao,
        valor: r.valor,
        dataVencimento: r.dataVencimento,
        situacao: r.situacao,
        dataPagamento: r.dataPagamento,
      }))
    },
  },
  {
    id: 'contas-pagar',
    nome: 'Contas a Pagar',
    descricao: 'Contas a pagar abertas',
    colunas: [
      { key: 'fornecedor', label: 'Fornecedor', type: 'string' },
      { key: 'descricao', label: 'Descrição', type: 'string' },
      { key: 'valor', label: 'Valor', type: 'number' },
      { key: 'dataVencimento', label: 'Vencimento', type: 'date' },
      { key: 'situacao', label: 'Situação', type: 'string' },
    ],
    query: async (empresaId, colunas) => {
      const rows = await prisma.contaPagar.findMany({
        where: { empresaId },
        include: { fornecedor: { select: { nome: true } } },
        orderBy: { dataVencimento: 'desc' },
        take: 500,
      })
      return rows.map(r => ({
        fornecedor: r.fornecedor?.nome || '-',
        descricao: r.descricao,
        valor: r.valor,
        dataVencimento: r.dataVencimento,
        situacao: r.situacao,
      }))
    },
  },
  {
    id: 'notas-fiscais',
    nome: 'NF-e Emitidas',
    descricao: 'Notas fiscais eletrônicas emitidas',
    colunas: [
      { key: 'numero', label: 'Número', type: 'string' },
      { key: 'cliente', label: 'Cliente', type: 'string' },
      { key: 'dataEmissao', label: 'Data Emissão', type: 'date' },
      { key: 'valorTotal', label: 'Valor Total', type: 'number' },
      { key: 'situacao', label: 'Situação', type: 'string' },
      { key: 'naturezaOperacao', label: 'Natureza', type: 'string' },
    ],
    query: async (empresaId, colunas) => {
      const rows = await prisma.notaFiscal.findMany({
        where: { empresaId },
        include: { cliente: { select: { nome: true } } },
        orderBy: { dataEmissao: 'desc' },
        take: 500,
      })
      return rows.map(r => ({
        numero: r.numero,
        cliente: r.cliente?.nome || '-',
        dataEmissao: r.dataEmissao,
        valorTotal: r.valorTotal,
        situacao: r.situacao,
        naturezaOperacao: r.naturezaOperacao,
      }))
    },
  },
  {
    id: 'notas-servico',
    nome: 'NFSe Emitidas',
    descricao: 'Notas fiscais de serviço emitidas',
    colunas: [
      { key: 'numero', label: 'Número', type: 'string' },
      { key: 'tomador', label: 'Tomador', type: 'string' },
      { key: 'dataEmissao', label: 'Data Emissão', type: 'date' },
      { key: 'valorTotal', label: 'Valor Total', type: 'number' },
      { key: 'situacao', label: 'Situação', type: 'string' },
    ],
    query: async (empresaId, colunas) => {
      const rows = await prisma.notaServico.findMany({
        where: { empresaId },
        orderBy: { dataEmissao: 'desc' },
        take: 500,
      })
      return rows.map(r => ({
        numero: r.numero,
        tomador: r.tomadorNome || '-',
        dataEmissao: r.dataEmissao,
        valorTotal: r.valorTotal,
        situacao: r.situacao,
      }))
    },
  },
]

export class RelatoriosService {
  listarDataSources() {
    return dataSources.map(d => ({
      id: d.id,
      nome: d.nome,
      descricao: d.descricao,
      colunas: d.colunas,
    }))
  }

  getDataSource(id: string) {
    return dataSources.find(d => d.id === id) || null
  }

  async executar(empresaId: string, dataSource: string, colunas: string[], filtros: any[] = []) {
    const fonte = this.getDataSource(dataSource)
    if (!fonte) throw new Error(`Fonte de dados "${dataSource}" não encontrada`)

    const colunasValidas = colunas.filter(c => fonte.colunas.some(col => col.key === c))
    if (colunasValidas.length === 0) throw new Error('Nenhuma coluna válida selecionada')

    const results = await fonte.query(empresaId, colunasValidas, filtros)

    return {
      dataSource: fonte.nome,
      colunas: colunasValidas,
      linhas: results,
      total: results.length,
    }
  }

  // Templates
  async listarTemplates(empresaId: string) {
    return prisma.reportTemplate.findMany({ where: { empresaId }, orderBy: { dataCriacao: 'desc' } })
  }

  async buscarTemplate(id: string, empresaId: string) {
    const t = await prisma.reportTemplate.findFirst({ where: { id, empresaId } })
    if (!t) throw new Error('Template não encontrado')
    return t
  }

  async criarTemplate(empresaId: string, dados: { nome: string; descricao?: string; dataSource: string; colunas: string[]; filtros?: any; formato?: string }) {
    return prisma.reportTemplate.create({ data: { ...dados, empresaId } })
  }

  async atualizarTemplate(id: string, empresaId: string, dados: any) {
    await this.buscarTemplate(id, empresaId)
    return prisma.reportTemplate.update({ where: { id }, data: dados })
  }

  async excluirTemplate(id: string, empresaId: string) {
    await this.buscarTemplate(id, empresaId)
    return prisma.reportTemplate.delete({ where: { id } })
  }
}
