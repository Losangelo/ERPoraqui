# Especificação Técnica - Módulo Fluxo de Caixa

## Visão Geral

Registro e consulta de entradas e saídas financeiras diárias, saldo atual, resumo por período e categorização dos movimentos.

---

## Modelo de Dados

### FluxoCaixa

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| empresaId | String | FK Empresa |
| tipo | TipoFluxoCaixa | ENTRADA, SAIDA |
| categoria | String | Categoria do movimento |
| descricao | String | Descrição |
| valor | Float | Valor |
| formaPagamento | FormaPagamento | Forma de pagamento |
| dataMovimentacao | DateTime | Data da movimentação |
| referenciaId | String? | ID da referência (conta, venda, etc) |
| referenciaTipo | String? | Tipo da referência |
| centroCustoId | String? | FK Centro de custo |

### Enums

```
TipoFluxoCaixa: ENTRADA | SAIDA
FormaPagamento: DINHEIRO | PIX | CARTAO_CREDITO | CARTAO_DEBITO | BOLETO | TRANSFERENCIA | CHEQUE
```

### Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/v1/fluxo-caixa | Criar lançamento |
| GET | /api/v1/fluxo-caixa | Listar (filtros: tipo, categoria, período) |
| GET | /api/v1/fluxo-caixa/saldo | Saldo atual (entradas - saídas) |
| GET | /api/v1/fluxo-caixa/resumo/:data | Resumo diário de uma data |
| GET | /api/v1/fluxo-caixa/categorias | Listar categorias |
| GET | /api/v1/fluxo-caixa/:id | Buscar por ID |

### Frontend

- Página: `/fluxo-caixa`
- Dashboard: saldo atual, total entradas/saídas do período
- Tabela de lançamentos com filtros por tipo, categoria, data
- Dialog de criação com campos: tipo, categoria, descrição, valor, forma pagamento, data, centro de custo
- Resumo diário: entradas vs saídas por dia

### Regras de Negócio

1. Lançamentos de entrada com valor positivo, saída com valor positivo (tipo define direção)
2. Ao receber/pagar contas (módulo financeiro), gerar lançamento automático no fluxo de caixa
3. Categorias são livres (string), sem tabela fixa
4. Saldo calculado como soma de ENTRADA - soma de SAIDA
5. Paginação com 20 itens por página
