# Especificação Técnica - Módulo de Conciliação Bancária

## Visão Geral

Conciliação de extratos bancários com movimentações financeiras do sistema. Permite importar/cadastrar movimentações bancárias, criar conciliações por período e vincular movimentações à conciliação.

---

## Modelo de Dados

### ContaBancaria

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| empresaId | String | FK Empresa |
| banco | String | Nome/código do banco |
| agencia | String | Agência |
| conta | String | Número da conta |
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
| conciliado | Boolean | Flag de conciliação |
| conciliacaoId | String? | FK Conciliação |

### Conciliacao

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| empresaId | String | FK Empresa |
| contaBancariaId | String | FK Conta bancária |
| periodoIni | DateTime | Início do período |
| periodoFin | DateTime | Fim do período |
| dataConciliacao | DateTime | Data da conciliação |
| totalCreditos | Float | Total créditos |
| totalDebitos | Float | Total débitos |
| totalConciliado | Float | Total conciliado |
| totalNaoConciliado | Float | Total não conciliado |
| observacoes | String? | Observações |

### Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/v1/financeiro/contas-bancarias | Criar conta bancária |
| GET | /api/v1/financeiro/contas-bancarias | Listar contas |
| GET | /api/v1/financeiro/contas-bancarias/:id/movimentacoes | Listar movimentações da conta |
| GET | /api/v1/financeiro/contas-bancarias/:id/conciliacoes | Listar conciliações da conta |
| POST | /api/v1/financeiro/movimentacoes-bancarias | Criar movimentação (extrato manual) |
| PUT | /api/v1/financeiro/movimentacoes-bancarias/:id/desconciliar | Desvincular movimentação da conciliação |
| POST | /api/v1/financeiro/conciliacoes | Criar conciliação (abrir período) |
| POST | /api/v1/financeiro/conciliacoes/movimentacoes | Conciliar movimentação (vincular) |

### Frontend

- Página: `/financeiro/conciliacao` (separada via `ConciliacaoPage.tsx`)
- Tabs: Contas Bancárias | Movimentações | Conciliações
- Painel esquerdo: lista de contas bancárias
- Painel direito: movimentações da conta selecionada com filtros (descrição, conciliado)
- 4 dialogs: Nova Conta, Nova Movimentação, Nova Conciliação, Detalhes Conciliação
- Ações: conciliar/desconciliar movimentação individualmente
- Badge visual: verde (conciliado), amarelo (não conciliado)

### Regras de Negócio

1. Movimentação conciliada não pode ser excluída nem editada
2. Conciliação é por período (datas início/fim) e conta bancária
3. Ao conciliar, sistema atualiza totalCreditos/totalDebitos da conciliação
4. Desconciliar remove o vínculo e atualiza os totais
5. Movimentação pode ser desconciliada se a conciliação não estiver fechada
6. Saldo atual da conta bancária é atualizado manualmente (não automático)
