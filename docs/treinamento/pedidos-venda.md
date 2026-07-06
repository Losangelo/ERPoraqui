# Pedidos de Venda — Guia de Uso

## O que são Pedidos de Venda?

Pedidos de venda registram as vendas de produtos para clientes, com controle de itens, valores e condições de pagamento. Diferente do PDV (venda rápida no balcão), o pedido de venda passa por um fluxo de aprovação:

`EM_ABERTO → CONFIRMADO → EM_PRODUCAO → ENVIADO → ENTREGUE`

ou

`EM_ABERTO → CANCELADO`

---

## Acessando a Tela

1. Clique em **Vendas** > **Pedidos**
2. Você verá a lista de pedidos com filtros por status
3. Clique em **+ Novo Pedido** para criar

---

## Criando um Pedido — Passo a Passo

### 1. Dados do Pedido

| Campo | Descrição | Como Preencher |
|-------|-----------|----------------|
| **Cliente** | Cliente comprador | Comece a digitar nome, CPF ou CNPJ e selecione da lista |
| **Vendedor** | Vendedor responsável (opcional) | Busque pelo nome |
| **Transportadora** | Empresa que fará a entrega (opcional) | Busque pelo nome ou CNPJ |
| **Filial** | Filial que está vendendo | Selecione na lista |
| **Data de Entrega** | Previsão de entrega (opcional) | Selecione a data no calendário |

### 2. Itens do Pedido

1. Clique em **Adicionar Item**
2. Busque o produto no campo de busca:
   - Digite parte do nome ou código de barras
   - Uma lista de cards aparece com: foto, nome, preço, estoque, código de barras, NCM
3. Selecione o produto desejado
4. Preencha:
   - **Quantidade**: número de unidades
   - **Valor Unitário**: preço unitário (vem preenchido automaticamente)
   - **Desconto (%)**: percentual de desconto por item (opcional)
5. O total do item é calculado automaticamente
6. Para remover um item, clique no **X** ao lado

### 3. Condição de Pagamento

| Opção | Descrição | Campos Adicionais |
|-------|-----------|-------------------|
| **A Vista** | Pagamento único | Nenhum |
| **A Prazo** | Parcelado com intervalo fixo | Quantidade de parcelas, intervalo entre parcelas (dias), primeira parcela em (dias) |
| **Parcelado** | Parcelamento personalizado | Mesmo que A Prazo |

### 4. Valores Totais

O sistema calcula automaticamente:

- **Subtotal**: soma de todos os itens
- **Frete**: valor do frete (preencha se houver)
- **Desconto**: desconto sobre o total (preencha se houver)
- **Acréscimos**: taxas adicionais (preencha se houver)
- **Total**: subtotal + frete + acréscimos - desconto

### 5. Observações

- **Observações**: texto visível para o cliente (aparece em relatórios)
- **Observações Internas**: texto apenas para uso da equipe (não aparece para o cliente)

### 6. Salvar

Clique em **Salvar** para criar o pedido. O sistema valida:
- Filial obrigatória
- Cliente obrigatório
- Pelo menos 1 item com dados completos

---

## Gerenciando Pedidos

### Lista de Pedidos

A tela principal exibe uma tabela com:
- Número do pedido
- Cliente
- Data de emissão
- Valor total
- Situação (com cores)
- Ações disponíveis

### Ações por Situação

| Situação | Ações Disponíveis |
|----------|-------------------|
| **EM_ABERTO** | Aprovar, Cancelar |
| **CONFIRMADO** | Marcar como Em Produção |
| **EM_PRODUCAO** | Marcar como Enviado |
| **ENVIADO** | Marcar como Entregue |
| **ENTREGUE** | Nenhuma (finalizado) |
| **CANCELADO** | Nenhuma (finalizado) |

### Como Aprovar um Pedido

1. Na lista, localize o pedido EM_ABERTO
2. Clique no ícone de **check** (verde) na coluna de ações
3. Ao aprovar:
   - Pedido à vista: gera entrada no fluxo de caixa
   - Pedido a prazo: gera contas a receber parceladas

### Como Cancelar um Pedido

1. Na lista, localize o pedido EM_ABERTO
2. Clique no ícone de **X** (vermelho) na coluna de ações

---

## Dicas e Truques

- **Busca rápida**: use o campo de filtro por status para localizar pedidos
- **LookupField inteligente**: ao buscar cliente/produto/vendedor, você pode buscar por nome, CPF, CNPJ, código de barras
- **Grid de Produtos**: ao buscar um produto, um painel lateral mostra cards com informações detalhadas
- **Desconto por item**: você pode dar desconto em cada item individualmente
- **Clique no pedido**: clique em qualquer linha da tabela para ver os detalhes completos

---

## Armadilhas Comuns

- ❌ **Esquecer a filial**: a filial é obrigatória e cada filial tem seu próprio estoque e numeração
- ❌ **Item sem quantidade**: o sistema exige quantidade > 0 para cada item
- ❌ **Aprovar sem conferir**: após aprovado, o pedido gera contas a receber automaticamente — revise antes
- ❌ **Condição de pagamento errada**: selecione "A Prazo" para vendas parceladas; "A Vista" para pagamento único
