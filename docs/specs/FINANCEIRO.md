# Especificação Técnica - Módulo Financeiro

## Visão Geral

Gestão de contas a receber, contas a pagar, contas bancárias, movimentações bancárias e dashboard financeiro. Centraliza o fluxo financeiro do ERP.

---

## Modelo de Dados

### ContaReceber

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| empresaId | String | FK Empresa |
| clienteId | String | FK Cliente |
| pedidoVendaId | String? | FK Pedido de venda |
| numeroDocumento | String | Número do documento |
| numeroParcela | Int | Nº da parcela |
| totalParcelas | Int | Total de parcelas |
| dataVencimento | DateTime | Data de vencimento |
| dataEmissao | DateTime | Data de emissão |
| valorOriginal | Float | Valor original |
| valorRecebido | Float | Valor recebido |
| valorDesconto | Float | Desconto |
| valorJuros | Float | Juros |
| valorMulta | Float | Multa |
| situacao | SituacaoConta | ABERTA, PAGO, VENCIDO, CANCELADO, BAIXADO, RENEGOCIADO |
| formaPagamento | FormaPagamento? | DINHEIRO, PIX, CARTAO_CREDITO, CARTAO_DEBITO, BOLETO, TRANSFERENCIA, CHEQUE |
| dataRecebimento | DateTime? | Data de recebimento |
| centroCustoId | String? | FK Centro de custo |
| observacoes | String? | Observações |

### ContaPagar

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| empresaId | String | FK Empresa |
| fornecedorId | String | FK Fornecedor |
| pedidoCompraId | String? | FK Pedido de compra |
| numeroDocumento | String | Número do documento |
| numeroParcela | Int | Nº da parcela |
| totalParcelas | Int | Total de parcelas |
| dataVencimento | DateTime | Data de vencimento |
| dataEmissao | DateTime | Data de emissão |
| valorOriginal | Float | Valor original |
| valorPago | Float | Valor pago |
| valorDesconto | Float | Desconto |
| valorJuros | Float | Juros |
| valorMulta | Float | Multa |
| situacao | SituacaoConta | ABERTA, PAGO, VENCIDO, CANCELADO, BAIXADO, RENEGOCIADO |
| formaPagamento | FormaPagamento? | Forma de pagamento |
| dataPagamento | DateTime? | Data de pagamento |
| centroCustoId | String? | FK Centro de custo |
| observacoes | String? | Observações |

### ContaBancaria

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| empresaId | String | FK Empresa |
| banco | String | Código/nome do banco |
| agencia | String | Agência |
| conta | String | Conta corrente |
| tipo | TipoContaBancaria | CORRENTE, POUPANCA, INVESTIMENTO |
| saldoInicial | Float | Saldo inicial |
| saldoAtual | Float | Saldo atual |
| ativo | Boolean | Ativo |

### MovimentacaoBancaria

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| contaBancariaId | String | FK Conta bancária |
| dataMovimentacao | DateTime | Data da movimentação |
| dataCompetencia | DateTime? | Data competência |
| tipo | TipoMovimentoBancario | CREDITO, DEBITO |
| descricao | String | Descrição |
| documento | String? | Nº documento |
| valor | Float | Valor |
| conciliado | Boolean | Está conciliado |
| conciliacaoId | String? | FK Conciliação |

### Enums

```
SituacaoConta: ABERTA | PAGO | VENCIDO | CANCELADO | BAIXADO | RENEGOCIADO
FormaPagamento: DINHEIRO | PIX | CARTAO_CREDITO | CARTAO_DEBITO | BOLETO | TRANSFERENCIA | CHEQUE
TipoContaBancaria: CORRENTE | POUPANCA | INVESTIMENTO
TipoMovimentoBancario: CREDITO | DEBITO
```

### Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/v1/financeiro/contas-receber | Criar conta a receber |
| GET | /api/v1/financeiro/contas-receber | Listar (filtros: cliente, situação, período) |
| GET | /api/v1/financeiro/contas-receber/:id | Buscar |
| PUT | /api/v1/financeiro/contas-receber/:id | Atualizar |
| DELETE | /api/v1/financeiro/contas-receber/:id | Excluir |
| POST | /api/v1/financeiro/contas-receber/:id/receber | Receber (baixar) |
| POST | /api/v1/financeiro/contas-pagar | Criar conta a pagar |
| GET | /api/v1/financeiro/contas-pagar | Listar |
| GET | /api/v1/financeiro/contas-pagar/:id | Buscar |
| PUT | /api/v1/financeiro/contas-pagar/:id | Atualizar |
| DELETE | /api/v1/financeiro/contas-pagar/:id | Excluir |
| POST | /api/v1/financeiro/contas-pagar/:id/pagar | Pagar (baixar) |
| POST | /api/v1/financeiro/contas-bancarias | Criar conta bancária |
| GET | /api/v1/financeiro/contas-bancarias | Listar |
| GET | /api/v1/financeiro/contas-bancarias/:id/movimentacoes | Listar movimentações |
| GET | /api/v1/financeiro/contas-bancarias/:id/conciliacoes | Listar conciliações |
| POST | /api/v1/financeiro/movimentacoes-bancarias | Criar movimentação |
| PUT | /api/v1/financeiro/movimentacoes-bancarias/:id/desconciliar | Desconciliar movimentação |
| POST | /api/v1/financeiro/conciliacoes | Criar conciliação |
| POST | /api/v1/financeiro/conciliacoes/movimentacoes | Conciliar movimentação |
| GET | /api/v1/financeiro/dashboard | Dashboard financeiro |

### Frontend

- Páginas: `/contas-receber`, `/contas-pagar`
- Dashboard cards: total a receber, total a pagar, saldo líquido, contas vencidas
- Filtros por cliente/fornecedor, situação, período
- Dialog de recebimento/pagamento com juros, desconto, multa, forma de pagamento
- Recebimento atualiza saldo e gera lançamento no fluxo de caixa

### Regras de Negócio

1. Ao receber/pagar conta, gerar automaticamente entrada/saída no fluxo de caixa
2. Valor recebido default = valorOriginal - valorDesconto + valorJuros + valorMulta
3. Conta vencida (dataVencimento < hoje e situacao = ABERTA) atualizada automaticamente
4. Exclusão apenas permitida se situacao = ABERTA
5. Conta bancária com unique(empresaId, banco, agencia, conta)
6. Movimentação bancária pode ser conciliada a uma conciliação
