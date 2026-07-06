# Renegociação de Contas — Guia de Uso

## O que é?

O módulo de Renegociação permite **renegociar contas a receber e a pagar** que estão em aberto ou vencidas. Você pode aplicar descontos, juros, multas e parcelar o valor final em novas parcelas.

---

## Fluxo Completo

```
Selecionar Contas → Aplicar Descontos/Juros → Definir Parcelamento → Confirmar → Novas Contas Geradas
```

---

## Passo a Passo

### 1. Acessar o Módulo

1. Vá em **Financeiro > Renegociação**
2. A tela mostra o histórico de renegociações realizadas

### 2. Criar Nova Renegociação

1. Clique em **+ Nova Renegociação**
2. Selecione o **tipo**: Receber (clientes) ou Pagar (fornecedores)
3. Escolha o **cliente/fornecedor**
4. Selecione as **contas** que deseja renegociar:
   - Marque as contas em aberto/vencidas
   - Os valores são somados automaticamente

### 3. Aplicar Condições

Configure as novas condições:

| Campo | Descrição |
|-------|-----------|
| **Desconto** | Percentual de desconto sobre o total |
| **Juros** | Percentual de juros sobre o total |
| **Multa** | Valor fixo de multa |
| **Número de Parcelas** | Em quantas vezes será parcelado |
| **Primeiro Vencimento** | Data da primeira parcela |

### 4. Preview e Confirmação

1. O sistema exibe um **preview** das parcelas geradas
2. Verifique valores, quantidades e datas
3. Clique em **Criar Renegociação** — status fica como **Pendente**
4. Na listagem, clique em **Confirmar** para efetivar
5. Ao confirmar:
   - Contas originais são marcadas como **Renegociadas**
   - Novas contas são geradas com os novos valores/datas

### 5. Cancelar Renegociação

Se desistir (antes de confirmar):

1. Localize a renegociação pendente
2. Clique em **Cancelar**
3. As contas originais permanecem inalteradas

---

## Dicas e Boas Práticas

- **Ofereça desconto para pagamento à vista**: pode ser melhor que parcelar
- **Registre o motivo**: anote na descrição por que a renegociação foi feita
- **Acompanhe as novas parcelas**: elas entram no fluxo de caixa normalmente
- **Limite de parcelas**: evite parcelar em muitas vezes para não comprometer o fluxo

---

## Problemas Comuns

| Problema | Solução |
|----------|---------|
| Conta já renegociada aparece | Filtre por status "EM_ABERTO" |
| Parcelas não geraram | Verifique se a renegociação foi confirmada (não apenas criada) |
| Valor do preview não fecha | Revise descontos, juros e multa aplicados |
