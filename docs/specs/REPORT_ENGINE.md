# Motor de Relatórios Genérico — Especificação Técnica

## 1. Visão Geral

Motor config-driven para criação, execução e agendamento de relatórios. Permite ao usuário selecionar fontes de dados, colunas, filtros e formato sem escrever SQL.

### Arquitetura (2-tier)
1. **Data Sources Layer**: queries pré-definidas contra o banco PostgreSQL
2. **Render Layer**: conversão do resultado para formato escolhido (tabela, CSV, XLSX)

## 2. Prisma Model

```prisma
model ReportTemplate {
  id          String   @id @default(cuid()) @map("_id")
  empresaId   String
  nome        String
  descricao   String?
  dataSource  String   // clientes, produtos, pedidos-venda, etc
  colunas     Json     // ["nome", "cpf", "telefone"]
  filtros     Json?    // [{ campo: "uf", operador: "eq", valor: "SP" }]
  formato     String   @default("table") // table, csv, xlsx
  ativo       Boolean  @default(true)
  dataCriacao DateTime @default(now())
  dataAtualizacao DateTime @updatedAt

  empresa Empresa @relation(fields: [empresaId], references: [id])

  @@map("report_templates")
}
```

## 3. Data Sources Registry

Cada fonte define colunas, tipos e função de query. Registradas em `ReportRegistry`.

### Fontes Iniciais
| Data Source | Descrição | Colunas Principais |
|------------|-----------|-------------------|
| clientes | Clientes PF/PJ | id, nome, cpfCnpj, telefone, email, cidade, uf, ativo |
| produtos | Produtos | id, nome, codigo, ncm, unidade, precoVenda, estoque, ativo |
| pedidos-venda | Pedidos de Venda | id, numero, cliente, data, total, status, formaPagamento |
| pedidos-compra | Pedidos de Compra | id, numero, fornecedor, data, total, status |
| contas-receber | Contas a Receber | id, cliente, descricao, valor, vencimento, situacao |
| contas-pagar | Contas a Pagar | id, fornecedor, descricao, valor, vencimento, situacao |
| fluxo-caixa | Fluxo de Caixa | id, descricao, tipo, valor, data, categoria |
| notas-fiscais | NF-e emitidas | id, numero, cliente, data, valor, situacao |
| notas-servico | NFSe emitidas | id, numero, tomador, data, valor, situacao |

## 4. API Endpoints

| Method | Path | Descrição |
|--------|------|-----------|
| GET    | /api/v1/relatorios/data-sources | Lista fontes de dados disponíveis |
| GET    | /api/v1/relatorios/data-sources/:id/columns | Colunas de uma fonte |
| POST   | /api/v1/relatorios/executar | Executa relatório (fonte + colunas + filtros) retorna JSON |
| GET    | /api/v1/relatorios/templates | Lista templates salvos |
| POST   | /api/v1/relatorios/templates | Salva template |
| GET    | /api/v1/relatorios/templates/:id | Busca template |
| PUT    | /api/v1/relatorios/templates/:id | Atualiza template |
| DELETE | /api/v1/relatorios/templates/:id | Exclui template |

## 5. Formatos de Saída

| Formato | Implementação |
|---------|-------------|
| table   | JSON → tabela HTML via shadcn Table (frontend) |
| csv     | JSON → CSV via utils/export.ts |
| xlsx    | JSON → XLSX via utils/export.ts + SheetJS |

## 6. Fluxo do Usuário

1. Abre página "Relatórios"
2. Seleciona fonte de dados (ex: Clientes)
3. Marca colunas desejadas (ex: Nome, CPF, Cidade, Telefone)
4. Adiciona filtros (ex: UF = SP)
5. Clica "Executar" → preview em tabela
6. Escolhe formato (CSV/XLSX) e faz download
7. Opcional: salva como template para reuso
