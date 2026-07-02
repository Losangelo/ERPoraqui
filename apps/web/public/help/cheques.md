# Cheques — Guia de Uso

## O que é?

O módulo de Cheques gerencia o ciclo de vida completo de cheques: desde o recebimento de clientes até a compensação bancária, passando por depósito, devolução e eventuais cancelamentos.

---

## Ciclo de Vida do Cheque

```
Receber → Depositar → Compensar
   ↓                         ↓
Devolver ← (saldo insuficiente, etc.)
   ↓
Cancelar (se não for possível renegociar)
```

### Estados

| Estado | Significado |
|--------|-------------|
| **EMITIDO** | Cheque recebido do cliente, aguardando depósito |
| **DEPOSITADO** | Enviado ao banco, aguardando compensação |
| **COMPENSADO** | Valor creditado na conta — cheque quitado |
| **DEVOLVIDO** | Banco devolveu (sem fundos, data errada, etc.) |
| **CANCELADO** | Cheque cancelado manualmente |

---

## Fluxo Completo

### 1. Receber Cheque
- Na venda ou recebimento, registre o cheque com:
  - **Banco, agência e conta**
  - **Número do cheque**
  - **Valor, data e emitente** (cliente)
  - **Data de depósito** (quando pretende depositar)

### 2. Depositar
- Quando for levar ao banco, marque como **Depositado**
- Acompanhe no dashboard a previsão de compensação

### 3. Compensar
- Após confirmar com o banco, marque como **Compensado**
- O valor é consolidado no financeiro

### 4. Devolução
- Se o banco devolver (sem fundos, contra-ordem, assinatura diferente):
  - Marque como **Devolvido**
  - O sistema registra automaticamente o motivo
  - Entre em contato com o cliente para renegociar

### 5. Cancelamento
- Use para cheques que não serão mais processados
- Exemplo: cliente pagou em dinheiro após emissão do cheque

---

## Dicas e Truques

### Dashboard de Cheques
- A página principal mostra um **dashboard** com:
  - Total em cheques **a depositar** (EMITIDO)
  - Total **em processamento** (DEPOSITADO)
  - Total **compensado** no mês
- Use para ter uma visão rápida do fluxo de cheques

### Controle de Devoluções
- Cheques devolvidos geram **alerta** para a equipe financeira
- Cadastre o **motivo da devolução** (sem fundos, conta encerrada, etc.)
- Acompanhe clientes com histórico de devolução — evite receber cheques deles no futuro

### Integração Financeira
- Cheques **compensados** geram entrada automática no Contas a Receber
- Cheques **devolvidos** geram ajuste negativo
- O saldo do cliente reflete o status dos cheques

### Depósito Programado
- Organize os cheques por **data de depósito** — deposite lotes no mesmo dia
- Use o filtro por data no sistema para planejar as idas ao banco

---

## Boas Práticas

- **Confira a data do cheque** — não aceite cheques pré-datados com data muito distante
- **Registre o banco corretamente** — facilita a conciliação bancária
- **Deposite o quanto antes** — minimiza risco de devolução
- **Clientes com devolução frequente**: peça outra forma de pagamento
- **Mantenha o histórico**: cheques compensados ficam registrados para consulta
- **Concilie com o extrato bancário**: confira se todos os depositados foram compensados

---

## Armadilhas Comuns

- ❌ **Aceitar cheque sem conferir dados**: banco, agência, conta, número — tudo obrigatório
- ❌ **Deixar cheque muito tempo sem depositar**: risco de devolução aumenta
- ❌ **Não registrar devoluções**: perde o histórico do cliente
- ❌ **Confundir datas**: data do cheque ≠ data de depósito
- ✅ **Deposite rápido, acompanhe a compensação, registre devoluções**
