# Especificação Técnica — Módulo Produtos

## 1. Visão Geral

Módulo responsável pelo catálogo de produtos. Gerencia código interno, código de barras (EAN/GTIN), NCM, CEST, origem da mercadoria, preços (custo/venda/mínimo), controle de estoque (atual/mínimo/máximo), pesos, volumes e vinculação com categorias e unidades de medida. Multi-empresa por design.

## 2. Data Model (Prisma Schema)

**Modelo:** `Produto` — tabela `produtos`

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| id | String | PK | Identificador único |
| empresaId | String | FK → Empresa | Vínculo multi-empresa |
| codigoInterno | String | NOT NULL, unique(empresaId, codigoInterno) | SKU / código interno |
| codigoBarras | String? | | Código de barras (EAN-13) |
| gtin | String? | | Global Trade Item Number |
| nome | String | NOT NULL | Nome do produto |
| descricao | String? | | Descrição curta |
| descricaoDetalhada | String? | | Descrição detalhada |
| categoriaId | String? | FK → Categoria | Categoria do produto |
| unidadeMedidaId | String? | FK → UnidadeMedida | Unidade de medida |
| precoVenda | Float | NOT NULL | Preço de venda |
| precoCusto | Float | @default(0) | Preço de custo |
| precoMinimo | Float | @default(0) | Preço mínimo |
| quantidadeEstoque | Float | @default(0) | Estoque atual |
| estoqueMinimo | Float | @default(0) | Estoque mínimo |
| estoqueMaximo | Float | @default(0) | Estoque máximo |
| pesoBruto | Float? | | Peso bruto (kg) |
| pesoLiquido | Float? | | Peso líquido (kg) |
| volume | Float? | | Volume (m³) |
| ncm | String? | 8 dígitos | NCM fiscal |
| cest | String? | | CEST fiscal |
| origenMercadoria | OrigemMercadoria | @default(NACIONAL) | Origem da mercadoria |
| ativo | Boolean | @default(true) | Status |
| dataCriacao | DateTime | @default(now()) | Auditoria |
| dataAtualizacao | DateTime | @updatedAt | Auditoria |

**Unique:** `@@unique([empresaId, codigoInterno])`

**Relacionamentos:**
- `empresa → Empresa`
- `categoria → Categoria?`
- `unidadeMedida → UnidadeMedida?`
- `variacoes → ProdutoVariacao[]`
- `lotes → ProdutoLote[]`
- `tabelasPreco → TabelaPrecoItem[]`
- `movimentacoesEstoque → MovimentacaoEstoque[]`
- `itensPedidoVenda → ItemPedidoVenda[]`
- `itensPedidoCompra → ItemPedidoCompra[]`
- `itensOrcamento → ItemOrcamento[]`
- `itensVendaPDV → ItemVendaPDV[]`
- `itensNotaFiscal → ItemNotaFiscal[]`
- `itensInventario → ItemInventario[]`
- `garantias → Garantia[]`
- `devolucaoItens → DevolucaoItem[]`
- `licitacoesItens → LicitacaoItem[]`
- `promocoesItens → PromocaoItem[]`

## 3. API Endpoints

**Base:** `/api/v1/produtos`
**Autenticação:** `authMiddleware` (JWT)
**Controle de licença:** `verificarLimiteRecurso('produtos')` no POST

| Método | Rota | Descrição | Controller |
|---|---|---|---|
| POST | `/` | Criar produto | `criar` |
| GET | `/` | Listar produtos | `listar` |
| GET | `/:id` | Buscar por ID | `buscarPorId` |
| PUT | `/:id` | Atualizar produto | `atualizar` |
| PATCH | `/:id/inativar` | Inativar | `inativar` |
| PATCH | `/:id/ativar` | Reativar | `ativar` |

### Query Params (GET /)
- `nome`, `codigoInterno`, `codigoBarras`, `categoriaId`, `ativo`
- `pagina` (default 1), `limite` (default 20, max 500)

## 4. DTOs (Zod Schemas)

**`criarProdutoSchema`:**
- `codigoInterno`: z.string().min(1).max(50) — obrigatório
- `codigoBarras`, `gtin`: opcionais
- `nome`: z.string().min(1).max(255) — obrigatório
- `descricao`, `descricaoDetalhada`: opcionais
- `categoriaId`, `unidadeMedidaId`: opcionais (FKs)
- `precoVenda`: z.number().min(0) — obrigatório
- `precoCusto`: z.number().min(0).default(0)
- `precoMinimo`: z.number().min(0).default(0)
- `quantidadeEstoque`, `estoqueMinimo`, `estoqueMaximo`: z.number().min(0).default(0)
- `pesoBruto`, `pesoLiquido`, `volume`: opcionais
- `ncm`: z.string().length(8).optional()
- `cest`: string opcional
- `origenMercadoria`: enum NACIONAL / ESTRANGEIRA_IMPORTACAO_DIRETA / ESTRANGEIRA_NACIONALIZADA
- `ativo`: z.boolean().default(true)

**`atualizarProdutoSchema`:** `criarProdutoSchema.partial()`

## 5. Frontend — ProductsPage

**Arquivo:** `apps/web/src/pages/products/ProductsPage.tsx`
**Serviço:** `apps/web/src/services/produtos.ts`

### Componentes
- **Tabela:** Cód. Interno, Nome, Cód. Barras, NCM, Preço Venda (formatado R$), Estoque (badge vermelho se ≤ mínimo), Status, Ações (Editar)
- **Dialog formulário (3 colunas):**
  - Linha 1: Código Interno, Código Barras, GTIN
  - Linha 2: Nome (full width)
  - Linha 3: Descrição (full width)
  - Linha 4: NCM, CEST, Origem
  - Linha 5: Preço Custo, Preço Venda, Preço Mínimo
  - Linha 6: Estoque Atual, Estoque Mínimo, Estoque Máximo
- **Search:** Filtro por nome

### Service (`produtosService`)

| Método | Rota |
|---|---|
| `listar(filtros)` | GET /produtos |
| `buscarPorId(id)` | GET /produtos/:id |
| `criar(dados)` | POST /produtos |
| `atualizar(id, dados)` | PUT /produtos/:id |
| `inativar(id)` | PATCH /produtos/:id/inativar |
| `ativar(id)` | PATCH /produtos/:id/ativar |

## 6. Regras de Negócio

1. **Unique** `[empresaId, codigoInterno]` — não permite dois produtos com mesmo código interno na mesma empresa
2. NCM deve ter **exatamente 8 dígitos**
3. Preço de venda é obrigatório, custo/mínimo default 0
4. Estoque mínimo/máximo são apenas **referenciais** (não bloqueiam operações)
5. Origem da mercadoria: NACIONAL (default), ESTRANGEIRA_IMPORTACAO_DIRETA, ESTRANGEIRA_NACIONALIZADA
6. Soft delete via `ativo = false`
7. Categoria e Unidade de Medida são relacionamentos opcionais

## 7. Validações

- Todos os valores monetários/estoque devem ser ≥ 0
- NCM com 8 dígitos obrigatórios para emissão de NF-e
- Paginação: página ≥ 1, limite 1..500

## 8. Integrações

| Módulo | Tipo | Descrição |
|---|---|---|
| Categorias | FK | Classificação do produto |
| UnidadesMedida | FK | Unidade de venda/estoque |
| PedidosVenda | FK | Itens de pedido |
| PedidosCompra | FK | Itens de compra |
| Orçamentos | FK | Itens de orçamento |
| PDV | FK | Itens de venda PDV |
| NF-e / NFC-e | FK | Itens de nota fiscal |
| Estoque | FK | Movimentações de estoque |
| TabelasPreco | FK | Itens de tabela de preço |
| Promoções | FK | Itens em promoção |
| Garantias | FK | Produto garantido |
| Devoluções | FK | Itens devolvidos |
| Licitações | FK | Itens de licitação |
| LookupField | UI | Fonte para lookup de produtos |
