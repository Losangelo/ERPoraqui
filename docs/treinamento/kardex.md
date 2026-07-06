# Kardex (Ficha de Estoque) — Guia de Uso

## O que é?

O **Kardex** é a ficha de controle de estoque que registra **todas as movimentações de cada produto**, mostrando o saldo atual, entradas, saídas e saldo acumulado. Essencial para auditoria, contabilidade e gestão de estoque.

---

## Estrutura do Kardex

Para cada produto, o Kardex mostra:

```
Produto: Cadeira Escritório
Código: PROD-001
Período: Junho/2026

Data       | Tipo     | Documento      | Entrada | Saída | Saldo
01/06/2026 | Saldo Inicial | -          | 0       | 0     | 50
05/06/2026 | Compra   | NF-e 1234    | 20      | 0     | 70
10/06/2026 | Venda    | PV-5678      | 0       | 5     | 65
15/06/2026 | Devolução| D-901        | 2       | 0     | 67
20/06/2026 | Ajuste   | INV-001      | -3      | 0     | 64
```

---

## Passo a Passo

### 1. Acessar o Kardex

1. Vá em **Estoque > Kardex**
2. Selecione o **produto** (campo lookup)
3. Defina o **período** (mês/ano)
4. O sistema carrega todas as movimentações do período

### 2. Filtrar Movimentações

Use os filtros para localizar movimentações específicas:
- **Tipo de Movimentação**: Compra, Venda, Devolução, Ajuste, Transferência
- **Período**: data inicial e final
- **Documento**: número da NF-e, pedido, etc.

### 3. Exportar Kardex

1. Após carregar os dados, clique em **Exportar**
2. Escolha o formato:
   - **CSV** — para análise em Excel
   - **PDF** — para arquivo/auditoria
3. O arquivo é baixado automaticamente

---

## Tipos de Movimentação no Kardex

| Tipo | Origem | Impacto |
|------|--------|---------|
| Saldo Inicial | Abertura do período | Define saldo inicial |
| Compra | Entrada de mercadoria | Aumenta saldo |
| Venda | Pedido de venda/PDV | Reduz saldo |
| Devolução | Devolução de cliente | Aumenta saldo |
| Ajuste | Inventário/Manual | Corrige saldo |
| Transferência | Movimento entre filiais | Reduz na origem, aumenta no destino |

---

## Dicas e Boas Práticas

- **Consulte o Kardex sempre que desconfiar de divergência no estoque**
- **Exporte mensalmente** para arquivo de auditoria
- **O Kardex não pode ser alterado manualmente** — apenas via movimentações oficiais
- **Use para calcular o CMV** (Custo da Mercadoria Vendida) contábil
- **Produtos com variações/lotes**: cada variação tem seu próprio Kardex

---

## Problemas Comuns

| Problema | Solução |
|----------|---------|
| Saldo do Kardex diferente do estoque físico | Faça inventário e ajuste |
| Movimentação não aparece | Verifique o período selecionado |
| Saída sem entrada correspondente | Pode ser estoque inicial não registrado |
