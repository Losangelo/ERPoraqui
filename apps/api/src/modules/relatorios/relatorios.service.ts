import { prisma } from '@/database/prisma.service';

interface DataSourceColumn {
  key: string
  label: string
  type: 'string' | 'number' | 'date' | 'boolean' | 'currency'
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
  {
    id: 'vendas-por-periodo',
    nome: 'Vendas por Período',
    descricao: 'Vendas por período (agregado por item)',
    colunas: [
      { key: 'dataVenda', label: 'Data da Venda', type: 'date' },
      { key: 'cliente', label: 'Cliente', type: 'string' },
      { key: 'produto', label: 'Produto', type: 'string' },
      { key: 'quantidade', label: 'Quantidade', type: 'number' },
      { key: 'valorUnitario', label: 'Valor Unitário', type: 'currency' },
      { key: 'valorTotal', label: 'Valor Total', type: 'currency' },
      { key: 'comissao', label: 'Comissão', type: 'currency' },
    ],
    query: async (empresaId) => {
      const rows = await prisma.pedidoVenda.findMany({
        where: { empresaId },
        include: {
          cliente: { select: { nome: true } },
          itens: {
            include: { produto: { select: { nome: true } } },
          },
        },
        orderBy: { dataEmissao: 'desc' },
        take: 500,
      })
      const results: any[] = []
      for (const pedido of rows) {
        if (!pedido.itens || pedido.itens.length === 0) {
          results.push({
            dataVenda: pedido.dataEmissao,
            cliente: pedido.cliente?.nome || '-',
            produto: '-',
            quantidade: 0,
            valorUnitario: 0,
            valorTotal: pedido.valorTotal,
            comissao: 0,
          })
        } else {
          for (const item of pedido.itens) {
            results.push({
              dataVenda: pedido.dataEmissao,
              cliente: pedido.cliente?.nome || '-',
              produto: item.produto?.nome || '-',
              quantidade: item.quantidade,
              valorUnitario: item.valorUnitario,
              valorTotal: item.valorTotal,
              comissao: 0,
            })
          }
        }
      }
      return results
    },
  },
  {
    id: 'comissoes',
    nome: 'Comissões de Vendedores',
    descricao: 'Comissões configuradas por vendedor',
    colunas: [
      { key: 'vendedor', label: 'Vendedor', type: 'string' },
      { key: 'periodo', label: 'Período', type: 'string' },
      { key: 'qtdVendas', label: 'Qtd Vendas', type: 'number' },
      { key: 'totalVendido', label: 'Total Vendido', type: 'currency' },
      { key: 'percentualComissao', label: '% Comissão', type: 'number' },
      { key: 'valorComissao', label: 'Valor Comissão', type: 'currency' },
    ],
    query: async (empresaId) => {
      const rows = await prisma.vendedor.findMany({
        where: { empresaId, ativo: true },
        orderBy: { nome: 'asc' },
      })
      return rows.map(v => ({
        vendedor: v.nome,
        periodo: '',
        qtdVendas: 0,
        totalVendido: 0,
        percentualComissao: v.comissao,
        valorComissao: 0,
      }))
    },
  },
  {
    id: 'lucratividade',
    nome: 'Lucratividade por Produto',
    descricao: 'Margem de lucro por produto com base nas vendas',
    colunas: [
      { key: 'produto', label: 'Produto', type: 'string' },
      { key: 'codigo', label: 'Código', type: 'string' },
      { key: 'precoCusto', label: 'Preço Custo', type: 'currency' },
      { key: 'precoVenda', label: 'Preço Venda', type: 'currency' },
      { key: 'margemPercentual', label: 'Margem %', type: 'number' },
      { key: 'qtdVendida', label: 'Qtd Vendida', type: 'number' },
      { key: 'lucroTotal', label: 'Lucro Total', type: 'currency' },
    ],
    query: async (empresaId) => {
      const rows = await prisma.produto.findMany({
        where: { empresaId, ativo: true },
        include: {
          itensPedidoVenda: {
            select: { quantidade: true },
          },
        },
        orderBy: { nome: 'asc' },
      })
      return rows.map(p => {
        const qtdVendida = p.itensPedidoVenda.reduce((sum, i) => sum + i.quantidade, 0)
        const margem = p.precoVenda > 0
          ? Math.round(((p.precoVenda - p.precoCusto) / p.precoVenda) * 10000) / 100
          : 0
        const lucroTotal = Math.round((p.precoVenda - p.precoCusto) * qtdVendida * 100) / 100
        return {
          produto: p.nome,
          codigo: p.codigoInterno,
          precoCusto: p.precoCusto,
          precoVenda: p.precoVenda,
          margemPercentual: margem,
          qtdVendida,
          lucroTotal,
        }
      })
    },
  },
  {
    id: 'fluxo-caixa',
    nome: 'Fluxo de Caixa',
    descricao: 'Movimentações financeiras com saldo acumulado',
    colunas: [
      { key: 'data', label: 'Data', type: 'date' },
      { key: 'tipo', label: 'Tipo', type: 'string' },
      { key: 'categoria', label: 'Categoria', type: 'string' },
      { key: 'descricao', label: 'Descrição', type: 'string' },
      { key: 'valor', label: 'Valor', type: 'currency' },
      { key: 'saldoAcumulado', label: 'Saldo Acumulado', type: 'currency' },
    ],
    query: async (empresaId) => {
      const rows = await prisma.fluxoCaixa.findMany({
        where: { empresaId },
        orderBy: { dataMovimentacao: 'asc' },
        take: 500,
      })
      let saldo = 0
      return rows.map(r => {
        saldo += r.tipo === 'ENTRADA' ? r.valor : -r.valor
        return {
          data: r.dataMovimentacao,
          tipo: r.tipo === 'ENTRADA' ? 'Entrada' : 'Saída',
          categoria: r.categoria,
          descricao: r.descricao,
          valor: r.valor,
          saldoAcumulado: Math.round(saldo * 100) / 100,
        }
      })
    },
  },
  {
    id: 'dre',
    nome: 'Demonstração de Resultados (DRE)',
    descricao: 'Receitas e despesas agregadas por categoria',
    colunas: [
      { key: 'conta', label: 'Conta', type: 'string' },
      { key: 'tipo', label: 'Tipo', type: 'string' },
      { key: 'valor', label: 'Valor', type: 'currency' },
      { key: 'percentualReceitaLiquida', label: '% Receita Líquida', type: 'number' },
      { key: 'periodo', label: 'Período', type: 'string' },
    ],
    query: async (empresaId) => {
      const rows = await prisma.fluxoCaixa.findMany({
        where: { empresaId },
        take: 500,
      })
      const totalReceitas = rows
        .filter(r => r.tipo === 'ENTRADA')
        .reduce((sum, r) => sum + r.valor, 0)
      const grouped: Record<string, { tipo: string; valor: number }> = {}
      for (const r of rows) {
        const chave = r.categoria
        const tipo = r.tipo === 'ENTRADA' ? 'Receita' : 'Despesa'
        if (!grouped[chave]) grouped[chave] = { tipo, valor: 0 }
        grouped[chave].valor += r.valor
      }
      return Object.entries(grouped).map(([conta, data]) => ({
        conta,
        tipo: data.tipo,
        valor: Math.round(data.valor * 100) / 100,
        percentualReceitaLiquida: totalReceitas > 0
          ? Math.round((data.valor / totalReceitas) * 10000) / 100
          : 0,
        periodo: '',
      }))
    },
  },
  {
    id: 'estoque-geral',
    nome: 'Estoque Geral',
    descricao: 'Posição de estoque atual de todos os produtos',
    colunas: [
      { key: 'produto', label: 'Produto', type: 'string' },
      { key: 'codigo', label: 'Código', type: 'string' },
      { key: 'categoria', label: 'Categoria', type: 'string' },
      { key: 'qtdEstoque', label: 'Qtd Estoque', type: 'number' },
      { key: 'precoCusto', label: 'Preço Custo', type: 'currency' },
      { key: 'precoVenda', label: 'Preço Venda', type: 'currency' },
      { key: 'valorEstoque', label: 'Valor Estoque', type: 'currency' },
    ],
    query: async (empresaId) => {
      const rows = await prisma.produto.findMany({
        where: { empresaId, ativo: true },
        include: { categoria: { select: { nome: true } } },
        orderBy: { nome: 'asc' },
      })
      return rows.map(p => ({
        produto: p.nome,
        codigo: p.codigoInterno,
        categoria: p.categoria?.nome || '-',
        qtdEstoque: p.quantidadeEstoque,
        precoCusto: p.precoCusto,
        precoVenda: p.precoVenda,
        valorEstoque: Math.round(p.quantidadeEstoque * p.precoCusto * 100) / 100,
      }))
    },
  },
  {
    id: 'sped-contribuicoes',
    nome: 'SPED Contribuições (PIS/COFINS)',
    descricao: 'Apuração de PIS e COFINS por item de nota fiscal',
    colunas: [
      { key: 'periodo', label: 'Período', type: 'string' },
      { key: 'produtoServico', label: 'Produto/Serviço', type: 'string' },
      { key: 'baseCalculo', label: 'Base Cálculo', type: 'currency' },
      { key: 'aliquotaPIS', label: 'Alíquota PIS', type: 'number' },
      { key: 'valorPIS', label: 'Valor PIS', type: 'currency' },
      { key: 'aliquotaCOFINS', label: 'Alíquota COFINS', type: 'number' },
      { key: 'valorCOFINS', label: 'Valor COFINS', type: 'currency' },
    ],
    query: async (empresaId) => {
      const rows = await prisma.notaFiscal.findMany({
        where: { empresaId },
        include: {
          itens: {
            select: {
              descricao: true,
              valorTotalLiquido: true,
              pisAliquota: true,
              pisValor: true,
              cofinsAliquota: true,
              cofinsValor: true,
            },
          },
        },
        orderBy: { dataEmissao: 'desc' },
        take: 200,
      })
      const results: any[] = []
      for (const nf of rows) {
        for (const item of nf.itens) {
          results.push({
            periodo: nf.dataEmissao
              ? `${String(nf.dataEmissao.getMonth() + 1).padStart(2, '0')}/${nf.dataEmissao.getFullYear()}`
              : '-',
            produtoServico: item.descricao,
            baseCalculo: item.valorTotalLiquido,
            aliquotaPIS: item.pisAliquota,
            valorPIS: item.pisValor,
            aliquotaCOFINS: item.cofinsAliquota,
            valorCOFINS: item.cofinsValor,
          })
        }
      }
      return results
    },
  },
  {
    id: 'contas-vencidas',
    nome: 'Contas Vencidas',
    descricao: 'Contas a receber e a pagar vencidas',
    colunas: [
      { key: 'tipo', label: 'Tipo', type: 'string' },
      { key: 'clienteFornecedor', label: 'Cliente/Fornecedor', type: 'string' },
      { key: 'documento', label: 'Documento', type: 'string' },
      { key: 'vencimento', label: 'Vencimento', type: 'date' },
      { key: 'valor', label: 'Valor', type: 'currency' },
      { key: 'diasAtraso', label: 'Dias Atraso', type: 'number' },
    ],
    query: async (empresaId) => {
      const agora = new Date()
      const [receber, pagar] = await Promise.all([
        prisma.contaReceber.findMany({
          where: {
            empresaId,
            situacao: { in: ['ABERTA', 'VENCIDO'] },
            dataVencimento: { lte: agora },
          },
          include: { cliente: { select: { nome: true } } },
          orderBy: { dataVencimento: 'asc' },
          take: 500,
        }),
        prisma.contaPagar.findMany({
          where: {
            empresaId,
            situacao: { in: ['ABERTA', 'VENCIDO'] },
            dataVencimento: { lte: agora },
          },
          include: { fornecedor: { select: { nome: true } } },
          orderBy: { dataVencimento: 'asc' },
          take: 500,
        }),
      ])
      const results: any[] = [
        ...receber.map(r => ({
          tipo: 'Receber',
          clienteFornecedor: r.cliente?.nome || '-',
          documento: r.numeroDocumento,
          vencimento: r.dataVencimento,
          valor: r.valorOriginal,
          diasAtraso: Math.floor((agora.getTime() - r.dataVencimento.getTime()) / (1000 * 60 * 60 * 24)),
        })),
        ...pagar.map(p => ({
          tipo: 'Pagar',
          clienteFornecedor: p.fornecedor?.nome || '-',
          documento: p.numeroDocumento,
          vencimento: p.dataVencimento,
          valor: p.valorOriginal,
          diasAtraso: Math.floor((agora.getTime() - p.dataVencimento.getTime()) / (1000 * 60 * 60 * 24)),
        })),
      ]
      return results.sort((a, b) => b.diasAtraso - a.diasAtraso)
    },
  },
  {
    id: 'centro-custo',
    nome: 'Resultado por Centro de Custo',
    descricao: 'Receitas e despesas agregadas por centro de custo',
    colunas: [
      { key: 'centroCusto', label: 'Centro de Custo', type: 'string' },
      { key: 'receitas', label: 'Receitas', type: 'currency' },
      { key: 'despesas', label: 'Despesas', type: 'currency' },
      { key: 'saldo', label: 'Saldo', type: 'currency' },
      { key: 'periodo', label: 'Período', type: 'string' },
    ],
    query: async (empresaId) => {
      const centros = await prisma.centroCusto.findMany({
        where: { empresaId, ativo: true },
        include: {
          contasReceber: {
            where: { situacao: { in: ['ABERTA', 'VENCIDO', 'PAGO'] } },
            select: { valorOriginal: true },
          },
          contasPagar: {
            where: { situacao: { in: ['ABERTA', 'VENCIDO', 'PAGO'] } },
            select: { valorOriginal: true },
          },
        },
        orderBy: { nome: 'asc' },
      })
      return centros.map(c => {
        const receitas = c.contasReceber.reduce((sum, r) => sum + r.valorOriginal, 0)
        const despesas = c.contasPagar.reduce((sum, p) => sum + p.valorOriginal, 0)
        return {
          centroCusto: c.nome,
          receitas: Math.round(receitas * 100) / 100,
          despesas: Math.round(despesas * 100) / 100,
          saldo: Math.round((receitas - despesas) * 100) / 100,
          periodo: '',
        }
      })
    },
  },
  {
    id: 'cheques',
    nome: 'Cheques em Carteira',
    descricao: 'Cheques recebidos e emitidos em carteira',
    colunas: [
      { key: 'banco', label: 'Banco', type: 'string' },
      { key: 'agencia', label: 'Agência', type: 'string' },
      { key: 'conta', label: 'Conta', type: 'string' },
      { key: 'emitente', label: 'Emitente', type: 'string' },
      { key: 'valor', label: 'Valor', type: 'currency' },
      { key: 'vencimento', label: 'Vencimento', type: 'date' },
      { key: 'situacao', label: 'Situação', type: 'string' },
      { key: 'diasAteVencimento', label: 'Dias até Vencimento', type: 'number' },
    ],
    query: async (empresaId) => {
      const agora = new Date()
      agora.setHours(0, 0, 0, 0)
      const rows = await prisma.cheque.findMany({
        where: { empresaId },
        orderBy: { dataVencimento: 'asc' },
        take: 500,
      })
      return rows.map(c => {
        const venc = new Date(c.dataVencimento)
        venc.setHours(0, 0, 0, 0)
        const diff = Math.ceil((venc.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24))
        return {
          banco: c.banco,
          agencia: c.agencia,
          conta: c.conta,
          emitente: c.emitente,
          valor: c.valor,
          vencimento: c.dataVencimento,
          situacao: c.situacao,
          diasAteVencimento: diff,
        }
      })
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
