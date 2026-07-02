# Centro de Custo — Guia de Uso

## O que é?

Centro de Custo é uma **categoria financeira** que permite organizar receitas e despesas por departamento, projeto ou área da empresa. Cada lançamento financeiro pode ser "marcado" com um centro de custo para saber exatamente onde o dinheiro está sendo gasto ou gerado.

---

## Estrutura em Árvore

Os centros de custo são organizados em **hierarquia** (pai/filho):

```
Empresa
├── Comercial
│   ├── Vendas Internas
│   ├── Vendas Externas
│   └── Pós-Vendas
├── Operações
│   ├── Produção
│   ├── Logística
│   └── Estoque
├── Administrativo
│   ├── RH
│   ├── Financeiro
│   └── Jurídico
└── Projetos
    ├── Projeto Alpha
    └── Projeto Beta
```

A estrutura em árvore permite análises em diferentes níveis:
- **Visão consolidada**: quanto a "Comercial" inteira gastou?
- **Visão detalhada**: quanto "Vendas Externas" gastou individualmente?

---

## Como Funciona na Prática

### 1. Crie os Centros de Custo
- Defina a estrutura hierárquica da sua empresa
- Crie centros de custo para cada departamento, projeto ou área relevante
- Use o **código** para identificar rapidamente (ex: "ADM-FIN" = Administrativo/Financeiro)

### 2. Vincule nos Lançamentos
- **Contas a Pagar**: ao lançar uma despesa, selecione o centro de custo
- **Contas a Receber**: ao lançar uma receita, selecione o centro de custo
- **Fluxo de Caixa**: ao registrar movimentações, selecione o centro de custo

### 3. Analise os Resultados
- Consulte relatórios financeiros **por centro de custo**
- Compare: qual departamento mais gastou? Qual mais gerou receita?
- Identifique centros com custos acima do orçado

---

## Dicas e Truques

### Como Estruturar
- **Não crie centros de custo muito granulares** — senão vira burocracia
- **Nem muito genéricos** — senão não agrega valor à análise
- O ideal é ter entre **5 e 15 centros de custo** ativos
- Pense: "Para cada real gasto, quero saber onde foi"

### Centro de Custo vs. Categoria
| Categoria | Centro de Custo |
|-----------|-----------------|
| "O quê" foi gasto? (ex: Material de Escritório) | "Onde" foi gasto? (ex: RH, Financeiro) |
| É o tipo de despesa | É a área responsável |
| Ex: Aluguel, Salários, Energia | Ex: Administrativo, Produção, Vendas |

### Exemplos por Tipo de Empresa

**Comércio:**
- Vendas (balcão, online, representantes)
- Administrativo
- Logística (recebimento, expedição)
- Marketing

**Indústria:**
- Produção (linha 1, linha 2)
- PCP (Planejamento)
- Qualidade
- Manutenção
- Administrativo

**Serviços:**
- Consultoria (projetos A, B, C)
- Suporte Técnico
- Desenvolvimento
- Administrativo

### Dica de Ouro
- Use centro de custo também para **projetos temporários**
- Ex: "Implantação ERP" — quando o projeto acabar, pode inativar o centro
- Assim você mensura exatamente quanto cada projeto custou

---

## Boas Práticas

- **Mantenha a hierarquia simples** — máximo 3 níveis (Departamento > Setor > Atividade)
- **Inative centros de custo antigos** em vez de excluir (preserva o histórico)
- **Todos os lançamentos** devem ter um centro de custo — sem exceção
- **Revise a estrutura** a cada semestre para ver se ainda faz sentido
- **Treine a equipe** para sempre selecionar o centro de custo correto

---

## Armadilhas Comuns

- ❌ **Centro de custo genérico demais** ("Outros") — virou lixeira de lançamentos
- ❌ **Lançamento sem centro de custo** — análise fica incompleta
- ❌ **Estrutura muito profunda** (5+ níveis) — ninguém consegue usar
- ❌ **Criar e nunca revisar** — centros obsoletos poluem o cadastro
- ❌ **Misturar função com projeto** — departamento permanente vs. projeto temporário
- ✅ **Cada lançamento deve ter UM e APENAS UM centro de custo**

---

## Exemplo Prático

**Cenário:** Sua empresa teve as seguintes despesas no mês:

| Despesa | Valor | Centro de Custo |
|---------|-------|-----------------|
| Aluguel do escritório | R\$ 5.000 | Administrativo |
| Salário do vendedor | R\$ 4.000 | Vendas |
| Matéria-prima | R\$ 15.000 | Produção |
| Material de escritório | R\$ 200 | Administrativo |
| Combustível da entrega | R\$ 800 | Logística |

**Análise:**
- Administrativo: R\$ 5.200
- Vendas: R\$ 4.000
- Produção: R\$ 15.000
- Logística: R\$ 800

→ **Produção** foi o centro com maior custo — talvez precise revisar processos.
→ **Logística** teve custo baixo, mas pode estar subdimensionada.
