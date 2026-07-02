# Estoque Avançado — Guia de Uso

## O que é?

O Estoque Avançado adiciona três funcionalidades poderosas ao controle de produtos: **variações (grades)**, **lotes** e **tabelas de preço**. Esses recursos transformam o cadastro básico de produtos em um sistema completo para varejo, indústria e distribuição.

---

## 1. Variações (Grades)

### O que são?
Variações permitem criar **diferentes versões de um mesmo produto** — como cor, tamanho, material. Cada variação é um SKU único com seu próprio estoque.

**Exemplo:** Camisa "Polo Azul" — mesmo produto, mas com estoques separados para P, M, G, GG.

### Como Configurar
1. Cadastre o **produto base** (Camisa Polo)
2. Crie as **variações** (Cor: Azul -> Tamanho: P, M, G)
3. Cada variação tem seu próprio **saldo em estoque**
4. Cada variação pode ter seu próprio **código de barras**

### Dicas
- **Variações inativáveis**: uma variação pode ser inativada sem afetar o produto ou outras variações
- **Preço por variação**: cada variação pode ter seu próprio preço
- **Grade e estoque**: o estoque é controlado por variação — não confunda com o estoque do produto base
- **Código de barras**: cadastre um código de barras diferente para cada variação (facilita no PDV)

### Exemplo Prático
```
Produto: Camisa Polo (código 001)
├── Azul / P (SKU: 001-AZU-P) → estoque: 10
├── Azul / M (SKU: 001-AZU-M) → estoque: 15
├── Azul / G (SKU: 001-AZU-G) → estoque: 8
├── Preto / P (SKU: 001-PRE-P) → estoque: 12
└── Preto / M (SKU: 001-PRE-M) → estoque: 5
```

---

## 2. Lotes

### O que são?
Lotes permitem rastrear grupos de produtos com **data de fabricação, validade e origem**. Ideal para indústria, alimentos, medicamentos e produtos perecíveis.

### Como Funciona
- Cada entrada de mercadoria gera um **lote** com número, data de fabricação e validade
- O estoque é controlado **por lote** — você sabe exatamente qual lote está vendendo
- Na venda (NF-e/PDV), você seleciona de qual lote está retirando

### Dicas
- **Ajuste manual**: é possível ajustar o estoque de um lote específico (quebra, perda, amostra)
- **Validade**: o sistema alerta sobre lotes próximos do vencimento
- **Rastreabilidade**: em caso de recall, você sabe exatamente para quem vendeu cada lote
- **Primeiro que vence, primeiro que sai**: organize as vendas por data de validade

### Exemplo Prático
```
Produto: Leite Integral (caixa 1L)
├── Lote L001 (fab: 01/06/2026, val: 01/09/2026) → estoque: 100 cx
├── Lote L002 (fab: 15/06/2026, val: 15/09/2026) → estoque: 200 cx
└── Lote L003 (fab: 20/06/2026, val: 20/09/2026) → estoque: 150 cx

→ Na venda, priorize o L001 (vence primeiro)
```

---

## 3. Tabelas de Preço

### O que são?
Tabelas de preço permitem definir **preços diferentes para diferentes canais ou clientes** sem precisar alterar o preço base do produto.

### Exemplos de Uso
| Tabela | Público | Markup |
|--------|---------|--------|
| **Tabela Padrão** | Consumidor final | Preço cheio |
| **Tabela Atacado** | Clientes com muito volume | -15% |
| **Tabela Distribuidor** | Revendedores parceiros | -25% |
| **Promoção Verão** | Todos | -10% |
| **Tabela Funcionário** | Colaboradores | -30% |

### Como Configurar
1. Crie a **tabela** (nome, público-alvo, período de validade)
2. Adicione os **itens** (produto + preço específico)
3. Use a opção **calcular markup** para definir preço baseado no custo
4. Atribua a tabela a um **cliente ou grupo de clientes**
5. No pedido de venda, selecione a tabela → os preços são aplicados automaticamente

### Dicas
- **Cálculo automático de markup**: defina a margem desejada e o sistema calcula o preço de venda
- **Período de validade**: tabelas promocionais podem ter data de início e fim
- **Herança**: se um produto não tem preço na tabela, o sistema usa o preço padrão do cadastro
- **Múltiplas tabelas**: um mesmo produto pode estar em várias tabelas com preços diferentes

---

## 4. Kardex (Saldo Acumulado)

### O que é?
O Kardex mostra o **histórico completo de movimentação** de um produto com saldo acumulado. Permite rastrear cada entrada e saída e ver como o saldo evoluiu ao longo do tempo.

### Como Acessar
1. Acesse **Estoque > Kardex** ou busque "Kardex" no Ctrl+K
2. Selecione o **produto** com o LookupField
3. Escolha o **período** (datas início e fim)
4. Visualize a tabela com todas as movimentações ordenadas por data

### Informações Exibidas
| Coluna | Descrição |
|--------|-----------|
| Data/Hora | Quando ocorreu a movimentação |
| Tipo | Entrada, Saída, Ajuste, Transferência |
| Documento | Número do pedido/nota vinculado |
| Quantidade | Unidades movimentadas |
| Saldo Acumulado | Saldo após esta movimentação |
| Observação | Motivo ou referência |

### Recursos
- **Filtro por data**: análise diária, semanal ou mensal
- **Filtro por produto**: histórico de um produto específico
- **Exportar CSV**: download para análise em Excel
- **Saldo inicial/final**: cards de resumo no topo da página

### Dicas
- Use o Kardex para **auditoria de estoque** — confira se o saldo lógico corresponde ao físico
- Investigue **divergências** filtrando por período e tipo de movimentação
- Exporte o CSV mensalmente para **conferência com inventário físico**

---

## Boas Práticas Gerais

### Variações
- Crie variações **apenas quando necessário** — produto sem grade não precisa
- Mantenha o **estoque por variação** sempre atualizado
- Use **código de barras único** por variação para agilizar no PDV

### Lotes
- Registre **todo lote que entra** — não pule essa etapa
- **Datas de validade**: confira na entrada e registre corretamente
- **Venda por lote**: sempre selecione o lote na emissão da NF-e
- **Lotes vencidos**: inative lotes vencidos para não serem vendidos acidentalmente

### Tabelas de Preço
- **Revise as tabelas periodicamente** — preços mudam com o mercado
- **Teste o markup** antes de aplicar — margem muito baixa pode gerar prejuízo
- Tabelas promocionais: **defina validade** para não esquecer de desativar
- **Comunique a equipe** sobre novas tabelas para evitar vender com preço errado

---

## Armadilhas Comuns

| Armadilha | Problema | Solução |
|-----------|----------|---------|
| **Variação sem estoque** | Produto aparece disponível mas não tem estoque | Inicie com saldo correto |
| **Lote sem validade** | Produto perecível sem data | Sempre informe a validade |
| **Tabela sem validade** | Promoção que nunca termina | Defina data de fim |
| **Preço de variação diferente do base** | Confusão na hora da venda | Mantenha consistência |
| **Lotes misturados no estoque** | Perda de rastreabilidade | Controle por lote na entrada |
| **Esquecer de inativar lote vencido** | Venda de produto vencido | Inative assim que vencer |

---

## Resumo: Quando Usar Cada Recurso

| Recurso | Use quando... |
|---------|---------------|
| **Variações** | O produto tem múltiplas cores, tamanhos ou versões |
| **Lotes** | O produto tem validade ou precisa de rastreabilidade |
| **Tabelas de Preço** | Você tem diferentes canais de venda com preços diferentes |
| **Kardex** | Precisa ver o histórico de movimentação de um produto |
