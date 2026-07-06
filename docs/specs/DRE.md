# Especificação Técnica - Módulo DRE (Demonstração do Resultado)

## Visão Geral

Geração da Demonstração do Resultado do Exercício a partir do plano de contas e dos lançamentos contábeis, com variações mensal, anual e comparativo entre períodos.

---

## Modelo de Dados

A DRE é gerada dinamicamente (leitura dos lançamentos contábeis), sem tabela própria. Utiliza as tabelas:

- **PlanoConta** — estrutura de contas de resultado (natureza CREDORA/DEVEDORA)
- **LancamentoContabil** — movimentações do período

### Estrutura da DRE (gerada)

1. **Receita Bruta** (contas de receita, natureza CREDORA)
2. Deduções e Impostos
3. **Receita Líquida**
4. Custos das Mercadorias/Serviços
5. **Lucro Bruto**
6. Despesas Operacionais
7. **Resultado Operacional**
8. Resultado Financeiro
9. **Resultado Antes IR/CSLL**
10. Provisões
11. **Resultado Líquido**

### Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/v1/dre | Gerar DRE de um período (query: dataInicial, dataFinal) |
| GET | /api/v1/dre/mensal | DRE mensal (query: mes, ano) |
| GET | /api/v1/dre/anual | DRE anual (query: ano) |
| GET | /api/v1/dre/comparativo | Comparativo entre dois períodos (query: periodo1Ini, periodo1Fin, periodo2Ini, periodo2Fin) |

### Frontend

- Página: `/dre`
- Seletor de período (mês/ano ou data inicial/final)
- Tabela estruturada com contas agrupadas por nível
- Colunas: conta, saldo período anterior, saldo período atual, variação (%)
- Licença guard via `licencaGuard('dre')`
- Download/export dos dados

### Regras de Negócio

1. DRE utiliza contas do plano de contas com natureza de resultado
2. Contas sintéticas exibem subtotais (soma das filhas)
3. Contas CREDORA aumentam o resultado, DEVEDORA diminuem
4. Períodos comparativos mostram variação absoluta e percentual
5. DRE mensal acumula do início do ano até o mês selecionado
6. DRE anual considera todo o exercício
