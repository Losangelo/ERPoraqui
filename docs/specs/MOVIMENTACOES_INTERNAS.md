# Especificação Técnica - Movimentações Internas de Estoque

## Visão Geral

Módulo de movimentações internas de estoque. Registra entradas, saídas, transferências, ajustes e devoluções de produtos, atualizando o saldo em tempo real via transação atômica.

Diferente do ajuste manual do módulo básico (`/estoque/ajustar`), este módulo **obrigatoriamente** cria um registro histórico na tabela `MovimentacaoEstoque`, servindo também como base para o Kardex.

---

## Modelo de Dados

### MovimentacaoEstoque

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| empresaId | String | FK Empresa |
| produtoId | String | FK Produto |
| tipoMovimentacao | TipoMovimentacao | ENTRADA, SAIDA, TRANSFERENCIA, AJUSTE, DEVOLUCAO |
| quantidade | Float | Quantidade movimentada |
| quantidadeAnterior | Float | Saldo antes da operação |
| quantidadeNova | Float | Saldo após a operação |
| motivo | String? | Motivo/observação |
| dataMovimentacao | DateTime | Data/hora do registro |
| dataCriacao | DateTime | Timestamp de criação |

**Relacionamentos:** Empresa, Produto

```prisma
enum TipoMovimentacao {
  ENTRADA
  SAIDA
  TRANSFERENCIA
  AJUSTE
  DEVOLUCAO
}
```

---

## Endpoints API

Base: `/api/v1/movimentacoes-internas` (autenticado via `authMiddleware`)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/` | Criar movimentação |
| GET | `/` | Listar movimentações (com filtros) |
| GET | `/produto/:produtoId/historico` | Histórico de um produto (Kardex-like) |
| GET | `/:id` | Buscar movimentação por ID |

### POST / (Criar)

**Body:**
```json
{
  "produtoId": "string (obrigatório)",
  "tipoMovimentacao": "ENTRADA | SAIDA | TRANSFERENCIA | AJUSTE | DEVOLUCAO",
  "quantidade": 10,
  "motivo": "string (opcional)"
}
```

**Comportamento (executado em transação `$transaction`):**
1. Valida produto existe e pertence à empresa
2. Calcula nova quantidade conforme o tipo
3. Cria registro em `MovimentacaoEstoque`
4. Atualiza `Produto.quantidadeEstoque`

**Regras por tipo:**
- `ENTRADA` / `DEVOLUCAO`: soma ao saldo
- `SAIDA`: subtrai (bloqueia se saldo < 0)
- `TRANSFERENCIA`: subtrai (bloqueia se saldo < 0)
- `AJUSTE`: substitui o saldo

**Response (201):**
```json
{
  "success": true,
  "data": { "id": "string", "produtoId": "...", "tipoMovimentacao": "...", "quantidade": 10, ... }
}
```

### GET / (Listar)

**Query Params:** `produtoId`, `tipo` (tipoMovimentacao), `dataInicial`, `dataFinal`, `pagina`, `limite`

**Response (200):**
```json
{
  "success": true,
  "data": [{
    "id": "string",
    "produtoId": "string",
    "produto": { "id": "string", "codigoInterno": "string", "nome": "string" },
    "tipoMovimentacao": "ENTRADA",
    "quantidade": 10,
    "quantidadeAnterior": 50,
    "quantidadeNova": 60,
    "motivo": "string",
    "dataMovimentacao": "2026-07-06T..."
  }],
  "meta": { "pagina": 1, "limite": 20, "total": 0, "totalPaginas": 0 }
}
```

### GET /produto/:produtoId/historico

**Query Params:** `dataInicio`, `dataFim`, `pagina`, `limite` (max 200)

**Diferenciais:**
- Ordenação ascendente por `dataMovimentacao`
- Campo calculado `saldoAcumulado` incremental (não salvo no banco)

**Response (200):**
```json
{
  "success": true,
  "data": [{
    ...movimentacao,
    "saldoAcumulado": 60
  }],
  "meta": { "pagina": 1, "limite": 100, "total": 0, "totalPaginas": 0 }
}
```

---

## Frontend

### Página: MovimentacoesPage (`/estoque/movimentacoes`)

**Componentes:**
- `MovimentacoesPage` — Página principal
- Cards de resumo: Total, Entradas, Saídas
- Tabela de histórico com colunas: Data, Produto, Tipo, Quantidade, Motivo
- Dialog "Nova Movimentação" com formulário:
  - Select de Produto (busca via `produtosService`)
  - Select de Tipo (ENTRADA, SAIDA, TRANSFERENCIA, AJUSTE, DEVOLUCAO) com ícones coloridos
  - Input numérico de Quantidade
  - Input textual de Motivo
- Toast/alert nativo para sucesso/erro

**Service (`services/estoque.ts` — `EstoqueService`):**
- `EstoqueService.listarMovimentacoes(filtros?)` → GET `/movimentacoes-internas`
- `EstoqueService.criarMovimentacao(data)` → POST `/movimentacoes-internas`
- `EstoqueService.historicoProduto(produtoId, filtros?)` → GET `/movimentacoes-internas/produto/:produtoId/historico`

**Dependências:** `@/services/produtos` (para buscar lista de produtos), TanStack Query

---

## Regras de Negócio

1. **Transação atômica:** Criação da movimentação + atualização do saldo do produto são feitas em `$transaction` do Prisma
2. **Saldo negativo bloqueado:** Operações de SAIDA e TRANSFERENCIA validam saldo suficiente antes de prosseguir
3. **Multi-empresa:** Toda operação valida `empresaId` do usuário contra o produto
4. **Kardex:** O endpoint `/produto/:produtoId/historico` calcula `saldoAcumulado` em memória (não persistido), somando/subtraindo incrementalmente na ordem cronológica
5. **Paginação:** Listagem default 20, histórico default 100 (max 200)
6. **Tipos:** 5 tipos definidos — ENTRADA, SAIDA, TRANSFERENCIA, AJUSTE, DEVOLUCAO

---

## Validações (Zod)

- `MovimentacaoEstoqueSchema`: produtoId (required), tipoMovimentacao (enum), quantidade (positive), motivo (optional)
- `MovimentacaoEstoqueFiltroSchema`: produtoId, tipoMovimentacao, dataInicial, dataFinal (opcionais), pagina (default 1), limite (default 20, max 100)
- `HistoricoProdutoSchema`: dataInicio, dataFim (opcionais), pagina (default 1), limite (default 100, max 200)
