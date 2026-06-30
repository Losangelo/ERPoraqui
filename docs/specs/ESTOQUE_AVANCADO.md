# Especificação Técnica - Estoque Avançado (Grades, Lotes, Tabelas de Preço)

## Visão Geral

Módulo de funcionalidades avançadas de produtos: variações (grades), controle de lotes e múltiplas tabelas de preço.

---

## 1. ProdutoVariação (Grade/Variação)

### Modelo de Dados

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| empresaId | String | FK Empresa |
| produtoId | String | FK Produto |
| sku | String | SKU único por empresa+produto |
| nome | String | Nome da variação (ex: "Vermelho - GG") |
| valor | String | Valor/descrição adicional |
| precoAdicional | Float | Acréscimo de preço sobre o produto base |
| estoque | Float | Estoque específico da variação |
| codigoBarras | String? | Código de barras próprio |
| ativo | Boolean | Ativar/desativar |

### Endpoints API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/v1/produtos-variacoes | Criar variação |
| GET | /api/v1/produtos-variacoes | Listar (filtro por produtoId) |
| GET | /api/v1/produtos-variacoes/:id | Buscar por ID |
| PUT | /api/v1/produtos-variacoes/:id | Atualizar |
| DELETE | /api/v1/produtos-variacoes/:id | Excluir |
| PATCH | /api/v1/produtos-variacoes/:id/inativar | Inativar |
| PATCH | /api/v1/produtos-variacoes/:id/ativar | Ativar |

### Frontend

- Página: `/produtos-variacoes`
- Tabela com SKU, Nome, Preço Adicional, Estoque
- Modal de criação/edição
- Filtro por produto

---

## 2. ProdutoLote

### Modelo de Dados

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| empresaId | String | FK Empresa |
| produtoId | String | FK Produto |
| codigoLote | String | Código do lote (único por empresa+produto) |
| dataFabricacao | DateTime? | Data de fabricação |
| dataValidade | DateTime? | Data de validade |
| quantidade | Float | Saldo atual |
| quantidadeOriginal | Float | Quantidade inicial |
| custoUnitario | Float | Custo por unidade |
| ativo | Boolean | Ativar/desativar |

### Endpoints API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/v1/produtos-lotes | Criar lote |
| GET | /api/v1/produtos-lotes | Listar (filtro por produtoId) |
| GET | /api/v1/produtos-lotes/:id | Buscar por ID |
| PUT | /api/v1/produtos-lotes/:id | Atualizar |
| PATCH | /api/v1/produtos-lotes/:id/inativar | Inativar |
| POST | /api/v1/produtos-lotes/:id/ajustar-estoque | Ajustar quantidade |

### Frontend

- Página: `/produtos-lotes`
- Tabela com Código, Fabricação, Validade, Quantidade, Custo
- Modal de criação/edição
- Modal de ajuste de estoque
- Badge de status ativo/inativo

---

## 3. TabelaPreco

### Modelo de Dados

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| empresaId | String | FK Empresa |
| nome | String | Nome da tabela (único por empresa) |
| descricao | String? | Descrição |
| tipo | Enum(VISTA, PRAZO, PROMOCAO, ESPECIAL) | Tipo de tabela |
| markupBase | Float | Markup % sobre preço de custo |
| ativo | Boolean | Ativar/desativar |

### TabelaPrecoItem

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| tabelaPrecoId | String | FK TabelaPreco |
| produtoId | String | FK Produto |
| precoVenda | Float | Preço de venda |
| precoMinimo | Float | Preço mínimo |
| descontoMaximo | Float | Desconto máximo permitido |

### Endpoints API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/v1/tabelas-preco | Criar tabela |
| GET | /api/v1/tabelas-preco | Listar |
| GET | /api/v1/tabelas-preco/:id | Buscar com itens |
| PUT | /api/v1/tabelas-preco/:id | Atualizar |
| DELETE | /api/v1/tabelas-preco/:id | Excluir |
| POST | /api/v1/tabelas-preco/:id/itens | Adicionar item |
| PUT | /api/v1/tabelas-preco/:id/itens/:itemId | Atualizar item |
| DELETE | /api/v1/tabelas-preco/:id/itens/:itemId | Remover item |
| POST | /api/v1/tabelas-preco/:id/calcular | Calcular preços via markup |

### Frontend

- Página: `/tabelas-preco`
- Lista de tabelas com expansão para itens
- CRUD inline de itens
- Botão "Calcular Preços"

---

## Regras de Negócio

1. **Variações**: Preço final = preço do produto base + precoAdicional da variação
2. **Lotes**: Controle FIFO na baixa de estoque (primeiro a vencer, primeiro a sair)
3. **Tabelas de Preço**: Podem ser usadas para precificação diferenciada por cliente/canal
4. **Cálculo de Preço**: precoVenda = custoUnitario * (1 + markupBase/100)
