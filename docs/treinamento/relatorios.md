# Relatórios (Report Engine) — Guia de Uso

## O que é?

O **Motor de Relatórios** é uma ferramenta flexível que permite **criar relatórios personalizados** sem precisar de programação. Selecione a fonte de dados, escolha as colunas, aplique filtros e gere tabelas, CSV ou XLSX.

---

## Fontes de Dados Disponíveis

| Fonte | O que contém | Ideal para |
|-------|-------------|------------|
| **Clientes** | Nome, CPF/CNPJ, telefone, email, endereço, data cadastro | Análise de base de clientes |
| **Produtos** | Nome, NCM, preço, estoque, categoria | Inventário, precificação |
| **Pedidos de Venda** | Número, cliente, valor, data, status, vendedor | Acompanhamento de vendas |
| **Pedidos de Compra** | Número, fornecedor, valor, data, status | Controle de compras |
| **Contas a Receber** | Cliente, valor, data vencimento, status, centro custo | Fluxo de recebimentos |
| **Contas a Pagar** | Fornecedor, valor, data vencimento, status, centro custo | Controle de pagamentos |
| **NF-e** | Número, chave, cliente, valor, CFOP, data emissão | Relatórios fiscais |
| **NFSe** | Número, tomador, valor, ISS, data emissão | Relatórios de serviços |

---

## Como Criar um Relatório

```
1. Escolher Fonte → 2. Selecionar Colunas → 3. Aplicar Filtros → 4. Visualizar → 5. Exportar
```

### 1. Escolha a Fonte de Dados
- Selecione no painel esquerdo qual fonte quer consultar
- Cada fonte tem seu próprio conjunto de colunas disponíveis

### 2. Selecione as Colunas
- Marque as colunas que deseja ver no relatório
- Apenas as colunas selecionadas aparecerão na tabela
- Dica: selecione **apenas o necessário** — muitas colunas poluem a visualização

### 3. Aplique Filtros
- Refine os dados: por período, status, cliente, valor, etc.
- Exemplos:
  - Clientes: "ativos" ou "inativos"
  - Pedidos: "últimos 30 dias"
  - Contas: "em aberto" ou "pagas"
  - NF-e: "por mês"

### 4. Visualize o Preview
- A tabela é exibida no painel direito com formatação automática
- Datas aparecem no formato brasileiro (dd/mm/aaaa)
- Valores com R$ e duas casas decimais
- Booleanos como Sim/Não

### 5. Exporte
- **CSV**: abre em Excel, LibreOffice ou Google Sheets — ideal para tratar os dados
- **XLSX**: planilha formatada, pronta para imprimir ou enviar

---

## Templates de Relatórios

### O que são?
Templates são **relatórios salvos** que você pode reutilizar. Configure uma vez, use muitas vezes.

### Como Usar
1. Monte o relatório com as colunas e filtros desejados
2. Clique em **Salvar Template** e dê um nome
3. Da próxima vez, clique no template para carregar tudo automaticamente
4. Atualize o template se precisar ajustar os filtros

### Exemplos de Templates Úteis

| Template | Fonte | Colunas | Filtro |
|----------|-------|---------|--------|
| **Clientes Ativos** | Clientes | Nome, CPF, Telefone, Email, Cidade | ativo = Sim |
| **Vendas do Mês** | Pedidos Venda | Número, Cliente, Data, Valor, Status | mês atual |
| **Contas a Vencer** | Contas Receber | Cliente, Valor, Data Vencimento, Dias | status = Aberto |
| **Estoque Baixo** | Produtos | Nome, Estoque, Preço | estoque < 10 |
| **NF-e do Período** | NF-e | Número, Cliente, Valor, CFOP | período personalizado |

---

## Dicas e Truques

### Para Análise Rápida
- **Vendas do mês**: fonte Pedidos Venda, filtro por mês atual, agrupe por vendedor
- **Clientes inadimplentes**: fonte Contas a Receber, filtro "Em Aberto" com vencimento vencido
- **Produtos parados**: fonte Produtos, coluna "Última Venda" — veja o que não vende há 60+ dias

### Filtros Inteligentes
- Combine **múltiplos filtros** para refinar ao máximo
- Ex: "Contas a Receber" + status "Aberto" + data "últimos 15 dias" + valor "> R\$ 1.000"

### Exportação CSV
- O CSV abre no Excel como "Texto" — use **Dados > De Texto/CSV** se os valores não separarem
- Configure o separador como **ponto e vírgula (;)** se estiver no Excel português

### Templates para Equipe
- Crie templates e **compartilhe com a equipe** — todos usam o mesmo padrão
- Ex: relatório de comissão de vendedores com as mesmas colunas todo mês

---

## Boas Práticas

- **Nomeie os templates** de forma descritiva: "Clientes Ativos - SP" em vez de "Relatório 1"
- **Atualize filtros** sazonalmente: "Vendas Dezembro" vira "Vendas Janeiro" no mês seguinte
- **Exporte CSV** para análises no Excel, **XLSX** para relatórios prontos
- **Evite relatórios muito grandes**: muitos dados podem ficar lentos
- **Revise os templates** periodicamente — alguma coluna mudou de nome?

---

## Armadilhas Comuns

- ❌ **Muitas colunas**: relatório poluído, difícil de ler
- ❌ **Sem filtros**: todos os dados de uma vez — lentidão e poluição visual
- ❌ **Template desatualizado**: filtro de "janeiro" em julho
- ❌ **CSV abrindo bagunçado**: configure o separador no Excel como ";"
- ❌ **Esquecer de salvar**: perdeu a configuração do relatório
- ✅ **Crie templates, salve, reutilize** — produtividade máxima
