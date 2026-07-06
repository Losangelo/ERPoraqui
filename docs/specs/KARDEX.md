# Especificação Técnica - Kardex (Ficha de Estoque)

## Visão Geral

Módulo de consulta ao histórico de movimentações de um produto específico com saldo acumulado (corrente). Permite visualizar todas as entradas e saídas em ordem cronológica, calcular saldo inicial/final do período e exportar para CSV.

O Kardex não possui modelo de dados próprio: utiliza a tabela `MovimentacaoEstoque` e calcula o saldo acumulado em memória.

---

## Modelo de Dados

O Kardex é uma **consulta derivada** da tabela `MovimentacaoEstoque`:

| Campo | Origem | Descrição |
|-------|--------|-----------|
| id | MovimentacaoEstoque | UUID |
| produtoId | MovimentacaoEstoque | FK Produto |
| tipoMovimentacao | MovimentacaoEstoque | ENTRADA, SAIDA, TRANSFERENCIA, AJUSTE, DEVOLUCAO |
| quantidade | MovimentacaoEstoque | Quantidade da movimentação |
| quantidadeAnterior | MovimentacaoEstoque | Saldo antes |
| quantidadeNova | MovimentacaoEstoque | Saldo depois |
| motivo | MovimentacaoEstoque | Motivo |
| dataMovimentacao | MovimentacaoEstoque | Data/hora |
| produto | Join Produto | Nome e código interno |
| **saldoAcumulado** | **Calculado em memória** | Saldo progressivo |

O campo `saldoAcumulado` **não é persistido** no banco. É calculado percorrendo as movimentações em ordem ascendente:
- ENTRADA / DEVOLUCAO: sinal positivo (+)
- SAIDA / TRANSFERENCIA / AJUSTE: sinal negativo (-)

---

## Endpoints API

O Kardex utiliza o mesmo endpoint do módulo de movimentações internas:

Base: `/api/v1/movimentacoes-internas`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/produto/:produtoId/historico` | Histórico completo com saldo acumulado |

### GET /produto/:produtoId/historico

**Query Params:** `dataInicio`, `dataFim`, `pagina` (default 1), `limite` (default 100, max 200)

**Ordenação:** Ascendente por `dataMovimentacao`

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
    "dataMovimentacao": "2026-07-06T...",
    "saldoAcumulado": 60
  }],
  "meta": { "pagina": 1, "limite": 100, "total": 0, "totalPaginas": 0 }
}
```

**Cálculo do saldo acumulado:**
```
saldo = 0
para cada movimentação em ordem ASC:
  se tipo == ENTRADA ou DEVOLUCAO:
    saldo += quantidade
  senão:
    saldo -= quantidade
  saldoAcumulado = saldo
```

---

## Frontend

### Página: KardexPage (`/estoque/kardex`)

**Componentes:**
- `KardexPage` -- Pagina principal com filtros e tabela
- **Filtros:**
  - `LookupField` (source "produtos") -- Selecao de produto com busca (atalho F2/Ctrl+L)
  - Input `dataInicio` (date)
  - Input `dataFim` (date)
  - Botao "Limpar Filtros"
- **Cards de resumo** (4 cards):
  - Saldo Inicial (calculado)
  - Total Entradas (+)
  - Total Saidas (-)
  - Saldo Final
- **Tabela:** Data/Hora, Tipo (badge colorido), Quantidade (+/- verde/vermelho), Saldo Acumulado (negrito), Motivo
- **Paginacao:** Botoes Anterior/Proxima + "Mostrando pagina X de Y (Z registros)"
- **Botao "Exportar CSV":** Gera arquivo CSV com separador `;` (ponto e virgula) e charset UTF-8
  - Colunas: Data/Hora, Tipo, Quantidade, Saldo Acumulado, Motivo
  - Nome do arquivo: `kardex_{produto}_{data}.csv`
- **Estado vazio:** Tela inicial sem produto selecionado exibe icone de busca + "Selecione um produto"

**Service (`services/estoque.ts` -- `EstoqueService`):**
- `historicoProduto(produtoId, filtros?)` -> GET `/movimentacoes-internas/produto/:produtoId/historico`

**Dependencias:** `@tanstack/react-query`, `@/components/lookup/LookupField`, `lucide-react`

---

## Regras de Negocio

1. **Consulta pontual:** O Kardex sempre consulta UM produto especifico (obrigatorio selecionar via LookupField)
2. **Saldo inicial estimado:** Calculado a partir do primeiro registro retornado (`saldoAcumulado[0] - entradaSaida[0]`). Pode nao refletir o saldo real se o periodo filtrado nao incluir todas as movimentacoes desde o inicio do produto
3. **Ordenacao ascendente:** Necessaria para o calculo correto do saldo acumulado
4. **Exportacao CSV:** Feita 100% no frontend (client-side), sem envolvimento do backend
5. **Pagina com memoria:** Mantem estado de pagina, datas e produto selecionado via React state
6. **Maximo 200 registros por pagina** (definido no backend)

---

## Diferenca entre Kardex e Movimentacoes Internas

| Aspecto | Movimentacoes Internas | Kardex |
|---------|----------------------|--------|
| Escopo | Todos os produtos | Um produto especifico |
| Ordenacao | DESC (mais recente primeiro) | ASC (mais antigo primeiro) |
| Saldo acumulado | Nao | Sim |
| Paginacao | 20 itens | 100 itens (max 200) |
| Exportacao | Nao | Sim (CSV) |
| Filtro principal | Multiplos | LookupField obrigatorio |

---

## Validações (Zod)

- `HistoricoProdutoSchema`: dataInicio, dataFim (opcionais), pagina (default 1), limite (default 100, max 200)
