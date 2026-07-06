# Relatórios — Módulo Geral — Especificação Técnica

## 1. Visão Geral

Módulo de relatórios genérico (frontend + backend) que consome o **Motor de Relatórios** (ver `REPORT_ENGINE.md` para detalhes do engine). Permite ao usuário selecionar fonte de dados, escolher colunas, aplicar filtros, visualizar resultado em tabela e exportar em CSV ou XLSX. Inclui gerenciamento de templates para reuso.

> **Nota:** Este documento cobre a integração frontend/backend do módulo de relatórios. O engine em si (data sources, queries, renderização) é detalhado no `REPORT_ENGINE.md`.

## 2. Modelo de Dados (Prisma)

### ReportTemplate
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| empresaId | String | FK → Empresa |
| nome | String | Nome do template |
| descricao | String? | Descrição opcional |
| dataSource | String | ID da fonte (ex: "clientes") |
| colunas | Json | Array de colunas selecionadas |
| filtros | Json? | Array de filtros [{campo, operador, valor}] |
| formato | String | table \| csv \| xlsx (default: table) |
| ativo | Boolean | (default: true) |
| dataCriacao | DateTime | |
| dataAtualizacao | DateTime | |

### Data Sources Registry (18 fontes no total)

| ID | Nome | Colunas |
|----|------|---------|
| clientes | Clientes | nome, cpfCnpj, telefone, email, cidade, uf, tipoPessoa, ativo, dataCadastro |
| produtos | Produtos | nome, codigo, ncm, unidade, precoVenda, precoCusto, estoqueAtual, categoria, ativo |
| pedidos-venda | Pedidos de Venda | numero, cliente, dataEmissao, total, status, formaPagamento |
| pedidos-compra | Pedidos de Compra | numero, fornecedor, dataEmissao, total, status |
| contas-receber | Contas a Receber | cliente, descricao, valor, dataVencimento, situacao, dataPagamento |
| contas-pagar | Contas a Pagar | fornecedor, descricao, valor, dataVencimento, situacao |
| notas-fiscais | NF-e Emitidas | numero, cliente, dataEmissao, valorTotal, situacao, naturezaOperacao |
| notas-servico | NFSe Emitidas | numero, tomador, dataEmissao, valorTotal, situacao |
| vendas-por-periodo | Vendas por Período | dataVenda, cliente, produto, quantidade, valorUnitario, valorTotal, comissao |
| comissoes | Comissões de Vendedores | vendedor, periodo, qtdVendas, totalVendido, percentualComissao, valorComissao |
| lucratividade | Lucratividade por Produto | produto, codigo, precoCusto, precoVenda, margemPercentual, qtdVendida, lucroTotal |
| fluxo-caixa | Fluxo de Caixa | data, tipo, categoria, descricao, valor, saldoAcumulado |
| dre | DRE | conta, tipo, valor, percentualReceitaLiquida, periodo |
| estoque-geral | Estoque Geral | produto, codigo, categoria, qtdEstoque, precoCusto, precoVenda, valorEstoque |
| sped-contribuicoes | SPED Contribuições | periodo, produtoServico, baseCalculo, aliquotaPIS, valorPIS, aliquotaCOFINS, valorCOFINS |
| contas-vencidas | Contas Vencidas | tipo, clienteFornecedor, documento, vencimento, valor, diasAtraso |
| centro-custo | Resultado por Centro de Custo | centroCusto, receitas, despesas, saldo, periodo |
| cheques | Cheques em Carteira | banco, agencia, conta, emitente, valor, vencimento, situacao, diasAteVencimento |

## 3. API Endpoints

Base: `/api/v1/relatorios` (autenticação JWT obrigatória)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/data-sources` | Lista fontes disponíveis com colunas |
| GET | `/data-sources/:id` | Detalhes de uma fonte específica |
| POST | `/executar` | Executa relatório (body: { dataSource, colunas, filtros? }) |
| GET | `/templates` | Lista templates salvos da empresa |
| GET | `/templates/:id` | Busca template por ID |
| POST | `/templates` | Salva novo template |
| PUT | `/templates/:id` | Atualiza template |
| DELETE | `/templates/:id` | Exclui template |

### Executar Body
```json
{
  "dataSource": "clientes",
  "colunas": ["nome", "cpfCnpj", "cidade", "uf"],
  "filtros": [{ "campo": "uf", "operador": "eq", "valor": "SP" }]
}
```

### Executar Response
```json
{
  "success": true,
  "data": {
    "dataSource": "Clientes",
    "colunas": ["nome", "cpfCnpj", "cidade", "uf"],
    "linhas": [ { "nome": "João", "cpfCnpj": "123...", "cidade": "São Paulo", "uf": "SP" } ],
    "total": 150
  }
}
```

## 4. Frontend

**Página:** `RelatoriosPage.tsx` — rota `/relatorios`

### Componentes
- **Layout grid:** Sidebar esquerda (fonte + colunas + filtros) | Área direita (resultado)
- **Select fonte de dados:** Lista carregada de `/relatorios/data-sources`
- **Checkboxes colunas:** Lista de colunas da fonte selecionada (max-height scroll)
- **Filtros dinâmicos:** Select campo + Input valor + botão remover + botão adicionar
- **Select formato:** Tabela, CSV, XLSX
- **Botão Executar:** Se formato = table; **Botão Download:** Se formato = CSV/XLSX
- **Resultado:** Tabela com scroll (max 200 linhas visíveis) + contagem total
- **Templates:** Toggle show/hide, tabela com ações Carregar/Excluir
- **Salvar Template:** Input nome + descrição + botão Salvar (expansível)

### Exportação (`utils/export.ts`)
```typescript
exportarCSV(dados, colunas, nomeArquivo)
exportarXLSX(dados, colunas, nomeArquivo)
```

## 5. Regras de Negócio

1. **Empresa isolada:** Todos os dados filtrados por `empresaId`
2. **Colunas válidas:** São ignoradas colunas não existentes na fonte; retorna erro se nenhuma coluna válida
3. **Limite de linhas:** Data sources limitam a 500 registros (take); frontend exibe no máximo 200
4. **Templates:** Privados por empresa; CRUD completo via API
5. **Formatos:** Tabela renderiza no frontend; CSV/XLSX disparam download direto

## 6. Validações

- `empresaId` obrigatório (token JWT)
- dataSource deve existir no registry
- colunas: array não vazio, mínimo 1 coluna
- nome do template: 1-100 caracteres, obrigatório
- Tratamento de erro padrão com try/catch
