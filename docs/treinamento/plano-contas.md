# Plano de Contas — Guia de Uso

## O que é?

O **Plano de Contas** é a estrutura hierárquica que organiza todas as contas contábeis da empresa. Ele classifica receitas, despesas, ativos, passivos e patrimônio líquido, servindo como base para o DRE, Balanço Patrimonial e ECF.

---

## Estrutura

O plano de contas é organizado em **árvore**:

```
1 - ATIVO (sintética)
├── 1.1 - Ativo Circulante (sintética)
│   ├── 1.1.1 - Caixa e Equivalentes (analítica)
│   ├── 1.1.2 - Contas a Receber (analítica)
│   └── 1.1.3 - Estoques (analítica)
├── 1.2 - Ativo Não Circulante (sintética)
│   ├── 1.2.1 - Imobilizado (analítica)
│   └── 1.2.2 - Intangível (analítica)

3 - RECEITAS (sintética)
├── 3.1 - Receita de Vendas (analítica)
├── 3.2 - Receita de Serviços (analítica)
└── 3.3 - Outras Receitas (analítica)

4 - DESPESAS (sintética)
├── 4.1 - Despesas Operacionais (analítica)
├── 4.2 - Despesas Administrativas (analítica)
└── 4.3 - Despesas Financeiras (analítica)
```

- **Sintética**: conta que agrupa sub-contas (não recebe lançamentos)
- **Analítica**: conta final (recebe lançamentos)

---

## Passo a Passo

### 1. Acessar Plano de Contas

1. Vá em **Gestão > Plano de Contas**
2. A árvore é exibida na tela

### 2. Criar uma Conta

1. Clique em **+ Nova Conta**
2. Preencha:
   - **Código**: numérico hierárquico (ex: 3.1.1)
   - **Nome**: descrição da conta (ex: "Vendas de Mercadorias")
   - **Tipo**: Ativo, Passivo, Receita, Despesa, PL
   - **Natureza**: Devedora ou Credora
   - **Conta Pai**: conta sintética acima (opcional)
3. Salve

### 3. Editar/Excluir

- Contas **analíticas** podem ser editadas se não tiverem movimentação
- Contas **sintéticas** só podem ser excluídas se vazias (sem filhas)

---

## Integrações

| Módulo | Como usa o Plano de Contas |
|--------|---------------------------|
| **DRE** | Agrupa receitas e despesas por conta |
| **ECF** | Gera saldos contábeis por conta |
| **Financeiro** | Contas a pagar/receber vinculadas a contas contábeis |
| **Relatórios** | Filtra por conta contábil |

---

## Dicas e Boas Práticas

- **Siga o padrão contábil brasileiro**: consulte seu contador para a estrutura
- **Não crie contas duplicadas**: use a busca antes de criar
- **Código consistente**: use numeração que permita inserir contas entre existentes
- **Revise anualmente**: ajuste a estrutura conforme o negócio evolui

---

## Problemas Comuns

| Problema | Solução |
|----------|---------|
| Conta não aparece no DRE | Verifique se está cadastrada corretamente como Receita/Despesa |
| Código já existe | Use numeração diferente |
| Não consigo excluir conta | Pode ter movimentação ou sub-contas vinculadas |
