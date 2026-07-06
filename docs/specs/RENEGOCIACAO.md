# Especificação Técnica - Módulo de Renegociação

## Visão Geral

Renegociação de contas a receber (clientes) e a pagar (fornecedores). Permite selecionar múltiplas contas, aplicar descontos/juros/multas, criar novo parcelamento e gerar novas parcelas automaticamente.

---

## Modelo de Dados

### Renegociacao

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| empresaId | String | FK Empresa |
| clienteId | String? | FK Cliente (receber) |
| fornecedorId | String? | FK Fornecedor (pagar) |
| tipo | String | RECEBER, PAGAR |
| valorTotal | Float | Soma das contas originais |
| valorDesconto | Float | Desconto concedido |
| valorJuros | Float | Juros aplicados |
| valorMulta | Float | Multa aplicada |
| valorFinal | Float | Valor final (total - desconto + juros + multa) |
| numeroParcelas | Int | Quantidade de parcelas |
| primeiraVencimento | DateTime | Data do primeiro vencimento |
| situacao | String | PENDENTE, CONFIRMADA, CANCELADA |
| observacoes | String? | Observações |

### RenegociacaoConta

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| renegociacaoId | String | FK Renegociação |
| contaId | String | ID da conta original |
| tipoConta | String | RECEBER, PAGAR |

### RenegociacaoParcela

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| renegociacaoId | String | FK Renegociação |
| numeroParcela | Int | Nº da parcela |
| dataVencimento | DateTime | Data de vencimento |
| valor | Float | Valor da parcela |
| situacao | String | ABERTA, PAGA, VENCIDA |

### Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/v1/renegociacao | Listar renegociações (filtros: tipo, situação, período) |
| GET | /api/v1/renegociacao/disponiveis | Listar contas disponíveis p/ renegociação |
| GET | /api/v1/renegociacao/:id | Buscar |
| POST | /api/v1/renegociacao | Criar renegociação |
| POST | /api/v1/renegociacao/:id/confirmar | Confirmar (gerar parcelas, baixar originais) |
| POST | /api/v1/renegociacao/:id/cancelar | Cancelar |

### Frontend

- Página: `/financeiro/renegociacao`
- LookupField para buscar cliente/fornecedor
- Seleção tipo (RECEBER/PAGAR)
- Listagem de contas disponíveis com checkboxes
- Inputs: desconto, juros, multa, número parcelas, primeira data
- Tabela de parcelas simulada antes de confirmar
- Ações: Confirmar (aplica), Cancelar, Visualizar detalhes
- Badges: Pendente (warning), Confirmada (success), Cancelada (secondary)

### Regras de Negócio

1. Ao confirmar, contas originais são marcadas como RENEGOCIADO
2. Novas parcelas são geradas conforme numeroParcelas e primeiraVencimento (intervalo 30 dias)
3. Contas já pagas ou canceladas não podem ser renegociadas
4. valorFinal = (valorTotal - valorDesconto) + valorJuros + valorMulta
5. Renegociação pendente pode ser cancelada; confirmada não pode ser alterada
6. Unique(empresaId) para cada renegociação
