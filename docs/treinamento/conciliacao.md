# Conciliação Bancária — Guia de Uso

## O que é?

A Conciliação Bancária compara os lançamentos do **extrato bancário** com as **contas registradas no sistema**, identificando divergências para garantir que tudo está correto.

---

## Por que conciliar?

- **Evita pagamentos em duplicidade**
- **Identifica taxas e tarifas não lançadas**
- **Garante que o saldo contábil bate com o saldo bancário**
- **Obrigatório para fechamento contábil mensal**

---

## Passo a Passo

### 1. Acessar o Painel de Conciliação

1. Vá em **Financeiro > Conciliação Bancária**
2. O painel exibe duas colunas:
   - **Esquerda**: lançamentos do extrato bancário
   - **Direita**: contas a pagar/receber do sistema

### 2. Importar Extrato Bancário

1. No painel, clique em **Importar Extrato**
2. Selecione o arquivo: OFX, CSV ou XLSX
3. Selecione a **conta bancária** correspondente
4. Clique em **Importar**
5. Os lançamentos aparecem na coluna esquerda

### 3. Conciliar Lançamentos

Você pode:

- **Conciliar automaticamente**: sistema sugere correspondências (por valor, data, CPF/CNPJ)
- **Conciliar manualmente**: arraste um lançamento do extrato para a conta correspondente

### 4. Ações por Tipo de Divergência

| Divergência | O que fazer |
|-------------|-------------|
| Lançamento no extrato sem conta no sistema | Criar conta manualmente ou identificar taxa |
| Conta no sistema sem extrato | Investigar se o pagamento não foi processado |
| Valor diferente | Verificar juros, multas ou descontos |
| Tarifa bancária | Criar conta a pagar avulsa para a tarifa |

### 5. Finalizar Conciliação

1. Após conciliar todos os itens, clique em **Finalizar Período**
2. O saldo contábil deve ser igual ao saldo bancário
3. Relatório de conciliação é gerado automaticamente

---

## Dicas e Boas Práticas

- **Concilie semanalmente** — mensal acumula muito trabalho
- **Confira o saldo inicial** antes de começar
- **Tarifas bancárias** são fontes comuns de divergência — crie contas a pagar para elas
- **Exporte o relatório** de conciliação ao finalizar para arquivo

---

## Problemas Comuns

| Problema | Solução |
|----------|---------|
| Saldo não fecha após conciliar | Verifique lançamentos não conciliados em ambos os lados |
| Extrato não importa | Converta para OFX ou CSV padrão |
| Lançamento duplicado | Use a função "Excluir" no lançamento do extrato |
