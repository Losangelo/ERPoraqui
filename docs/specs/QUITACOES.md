# Especificação Técnica - Módulo de Quitações em Lote

## Visão Geral

Quitação em lote de contas a receber (clientes) e a pagar (fornecedores). Permite selecionar múltiplas contas de uma só vez, informar valor pago individual e gerar baixa consolidada.

---

## Modelo de Dados

### Quitacao

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| empresaId | String | FK Empresa |
| clienteId | String? | FK Cliente |
| fornecedorId | String? | FK Fornecedor |
| tipo | String | RECEBER, PAGAR |
| valorTotal | Float | Valor total quitado |
| dataQuitacao | DateTime | Data da quitação |
| formaPagamento | String? | Forma de pagamento |
| observacoes | String? | Observações |

### QuitacaoConta

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| quitacaoId | String | FK Quitação |
| contaId | String | ID da conta |
| tipoConta | String | RECEBER, PAGAR |
| valorPago | Float | Valor pago na conta |

### Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/v1/quitacoes | Listar quitações |
| GET | /api/v1/quitacoes/disponiveis | Listar contas disponíveis (query: tipo) |
| GET | /api/v1/quitacoes/:id | Buscar |
| POST | /api/v1/quitacoes | Criar quitação em lote |

### Frontend

- Página: `/financeiro/quitacoes`
- LookupField para cliente/fornecedor conforme tipo
- Seletor tipo: RECEBER | PAGAR
- Após selecionar cliente/fornecedor, carrega contas disponíveis
- Checkbox para selecionar múltiplas contas
- Input valor pago por conta (pré-preenchido com valorOriginal)
- Dialog de detalhes da quitação (contas incluídas)
- Badges por situação

### Regras de Negócio

1. Ao criar quitação, todas as contas selecionadas são marcadas como PAGO
2. Contas já pagas ou canceladas não aparecem como disponíveis
3. valorPago por conta pode ser diferente do valorOriginal (pagamento parcial)
4. Registra dataPagamento/dataRecebimento na conta original
5. Gera lançamentos no fluxo de caixa para cada conta quitada
6. Unique(quitacaoId, contaId, tipoConta) para evitar duplicidade na associação
