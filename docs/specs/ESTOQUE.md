# Especificação Técnica - Estoque (Básico)

## Visão Geral

Módulo de consulta e ajuste básico de estoque. Permite visualizar o saldo atual de todos os produtos, alertas de estoque mínimo/máximo e realizar ajustes manuais (entrada, saída, ajuste).

> **Nota:** Para funcionalidades avançadas (variações, lotes, tabelas de preço), veja `ESTOQUE_AVANCADO.md`.

---

## Modelo de Dados

Baseia-se no modelo `Produto` do Prisma:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| empresaId | String | FK Empresa |
| codigoInterno | String | Código interno (único por empresa) |
| codigoBarras | String? | Código de barras |
| gtin | String? | GTIN |
| nome | String | Nome do produto |
| descricao | String? | Descrição |
| categoriaId | String? | FK Categoria |
| unidadeMedidaId | String? | FK UnidadeMedida |
| precoVenda | Float | Preço de venda |
| precoCusto | Float | Preço de custo |
| precoMinimo | Float | Preço mínimo |
| quantidadeEstoque | Float | Saldo atual em estoque |
| estoqueMinimo | Float | Quantidade mínima (alerta) |
| estoqueMaximo | Float | Quantidade máxima (alerta) |
| pesoBruto | Float? | Peso bruto |
| pesoLiquido | Float? | Peso líquido |
| volume | Float? | Volume |
| ncm | String? | NCM |
| cest | String? | CEST |
| origemMercadoria | OrigemMercadoria | Origem (NACIONAL, etc.) |
| ativo | Boolean | Ativo |

**Relacionamentos:** Categoria, UnidadeMedida, MovimentacaoEstoque[], ItemInventario[]

---

## Endpoints API

Base: `/api/v1/estoque` (autenticado via `authMiddleware`)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Listar produtos com estoque (filtros: categoriaId, nome, codigoInterno, pagina, limite) |
| GET | `/alertas` | Alertas de estoque (abaixo mínimo, acima máximo, zerado) |
| GET | `/:id` | Detalhes do produto com saldo |
| POST | `/ajustar` | Ajustar estoque manualmente |

### GET / (Listar)

**Query Params:** `categoriaId`, `nome`, `codigoInterno`, `pagina` (default 1), `limite` (default 20)

**Response (200):**
```json
{
  "dados": [{
    "id": "string",
    "codigoInterno": "string",
    "nome": "string",
    "quantidadeEstoque": 0,
    "estoqueMinimo": 0,
    "estoqueMaximo": 0,
    "precoVenda": 0,
    "precoCusto": 0,
    "categoria": { "id": "string", "nome": "string" },
    "unidadeMedida": { "id": "string", "simbolo": "string" },
    "abaixoEstoqueMinimo": false,
    "acimaEstoqueMaximo": false
  }],
  "meta": { "pagina": 1, "limite": 20, "total": 0, "totalPaginas": 0 }
}
```

### GET /alertas

**Response (200):**
```json
{
  "abaixoMinimo": [{ "id": "string", "nome": "string", "quantidadeEstoque": 0, "estoqueMinimo": 0 }],
  "acimaMaximo": [{ "id": "string", "nome": "string", "quantidadeEstoque": 0, "estoqueMaximo": 0 }],
  "estoqueZerado": [{ "id": "string", "nome": "string", "quantidadeEstoque": 0 }],
  "total": { "abaixoMinimo": 0, "acimaMaximo": 0, "estoqueZerado": 0 }
}
```

### POST /ajustar

**Body:**
```json
{
  "produtoId": "string (obrigatório)",
  "quantidade": 10,
  "tipo": "ENTRADA | SAIDA | AJUSTE",
  "motivo": "string (opcional)"
}
```

**Comportamento por tipo:**
- `ENTRADA`: novaQtd = qtdAtual + qtd
- `SAIDA`: novaQtd = qtdAtual - qtd (bloqueia se resultado < 0)
- `AJUSTE`: novaQtd = qtd (substitui o saldo)

---

## Frontend

### Página: EstoquePage (`/estoque`)

**Componentes:**
- `EstoquePage` — Página principal de consulta
- Cards de resumo: Produtos, Total Unidades, Valor Total Estoque
- Campo de busca textual (filtro por nome)
- Tabela com colunas: Código, Produto, Estoque, Valor Unit., Valor Total, Ações
- Dialog "Detalhes do Produto" ao clicar no ícone "olho"

**Service (`services/estoque.ts`):**
- O módulo de estoque básico usa o `produtosService` e `EstoqueService` (que na verdade serve para movimentações internas e kardex)
- A listagem usa `produtosService.listar()`

**Dependências:** `@/services/produtos`

---

## Regras de Negócio

1. **Multi-empresa:** Todas as consultas são filtradas por `empresaId` do usuário autenticado
2. **Estoque negativo:** Bloqueado via regra de negócio no `ajustar` (valida se saldo >= 0)
3. **Alertas:** Calculados dinamicamente comparando `quantidadeEstoque` com `estoqueMinimo` e `estoqueMaximo`
4. **Paginação:** Default 20 itens por página, máximo não definido explicitamente
5. **Ajuste manual não gera movimentação:** O endpoint `/ajustar` apenas atualiza `quantidadeEstoque`, sem registrar na tabela `MovimentacaoEstoque`

---

## Validações (Zod)

- `estoqueFiltroSchema`: categoriaId, nome, codigoInterno, pagina, limite (todos opcionais)
- `ajusteEstoqueSchema`: produtoId (required), quantidade (number), tipo (enum ENTRADA|SAIDA|AJUSTE), motivo (optional)
