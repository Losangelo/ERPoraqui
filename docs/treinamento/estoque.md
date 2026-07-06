# Estoque — Guia de Uso

## O que é?

O módulo de Estoque gerencia todos os **produtos** da empresa: cadastro, quantidades, movimentações e controle de saldo. Todo produto vendido, comprado ou transferido tem seu estoque atualizado automaticamente.

---

## Conceitos

| Termo | Significado |
|-------|-------------|
| **Saldo** | Quantidade atual disponível |
| **Estoque Mínimo** | Quantidade mínima antes do alerta |
| **Estoque Máximo** | Quantidade máxima desejada |
| **CMV** | Custo da Mercadoria Vendida |
| **Custo Médio** | Método de cálculo do custo (padrão) |

---

## Passo a Passo

### 1. Consultar Estoque

1. Acesse **Estoque > Estoque**
2. A lista mostra todos os produtos com:
   - Código e descrição
   - Quantidade atual
   - Valor total em estoque
   - Status (normal, baixo, crítico)

### 2. Usar Filtros

- **Categoria**: filtra por grupo de produtos
- **Status**: Normal, Estoque Baixo, Estoque Crítico
- **Busca**: por nome, código ou código de barras

### 3. Produtos sem Estoque

Produtos com quantidade negativa aparecem em **vermelho**:
- Indica erro de movimentação
- Faça inventário para corrigir
- Verifique vendas canceladas e compras não registradas

---

## Dicas

- **Configure estoque mínimo** para receber alertas automáticos
- **Estoque negativo** precisa ser corrigido via inventário
- **Produtos inativos** não aparecem na consulta de vendas
- **Exporte a lista** para Excel para análise externa

---

## Integrações

| Módulo | Como afeta o Estoque |
|--------|---------------------|
| **PDV** | Reduz estoque ao finalizar venda |
| **Pedido de Venda** | Reduz estoque ao confirmar |
| **Compra** | Aumenta estoque ao entrar mercadoria |
| **Devolução** | Aumenta ou reduz conforme o tipo |
| **Inventário** | Ajusta saldo conforme contagem física |

---

## Problemas Comuns

| Problema | Solução |
|----------|---------|
| Estoque aparece negativo | Faça um inventário e ajuste |
| Produto não encontrado na busca | Verifique se está ativo e cadastrado |
| Quantidade errada | Verifique movimentações recentes no Kardex |
