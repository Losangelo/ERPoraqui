# Orçamento de Vendas — Guia de Uso

## Por que Orçamento nas Vendas?

O orçamento serve como **pré-pedido** — uma etapa comercial antes do compromisso definitivo. O fluxo é:

```
Orçamento (negociação) → Aprovação → Conversão → Pedido de Venda → Faturamento
```

**Problema que resolve:** Sem orçamento, o vendedor cria um pedido direto, mas o cliente pode desistir, gerando um pedido cancelado e poluindo seu histórico. Com orçamento, você negocia primeiro e só vira pedido quando há certeza.

---

## Estados do Orçamento

```
                +---> APROVADO ---+
                |                  |
   (cria)       |                  v
[ ABERTO ] -----+             CONVERTIDO
   |    |       |                  ^
   |    |       +---> REPROVADO    |
   |    |                          |
   |    +---> (dataValidade vencida)
   |              |
   v              v
 CANCELADO     EXPIRADO
```

| Estado | Significado |
|--------|-------------|
| **ABERTO** | Acabou de ser criado, aguardando decisão |
| **APROVADO** | Cliente aprovou, pode virar pedido |
| **REPROVADO** | Cliente recusou, arquivado |
| **CONVERTIDO** | Virou Pedido de Venda (não pode mais ser alterado) |
| **EXPIRADO** | Prazo de validade venceu automaticamente |
| **CANCELADO** | Cancelado manualmente |

---

## Fluxo Ideal (Passo a Passo)

1. **Vendedor cria o orçamento** durante a negociação com o cliente
   - Define cliente, itens (produto/qtd/valor), prazo de validade
   - Pode incluir desconto, frete, observações

2. **Cliente analisa** e decide se aceita ou não

3. **Se aceitar** → Vendedor marca como **Aprovado** no sistema

4. **Clique em "Converter"** → o sistema automaticamente:
   - Cria um **Pedido de Venda** com todos os itens copiados
   - Marca o orçamento como **CONVERTIDO**
   - Vincula o pedido ao orçamento (rastreabilidade)

5. **Pedido de Venda** segue o fluxo normal (separação, faturamento, entrega)

6. **Se recusar** → Vendedor marca como **Reprovado** (pode registrar motivo)

---

## Dicas Práticas

### Controle de Validade
- Sempre defina uma `dataValidade` (ex: 7 ou 15 dias)
- Orçamentos **ABERTO** vencidos são movidos automaticamente para **EXPIRADO**
- Isso evita orçamentos antigos sendo usados fora do prazo

### Vendedor Errou?
- Orçamento errado? **Reprove** ou **Cancele** — sem impacto nos pedidos ou estoque
- Cliente mudou de ideia depois de aprovado? Apenas não converta
- Total flexibilidade sem afetar dados reais

### Diferenciais do Sistema
- **Numeração automática**: único por empresa + série, sem duplicidade
- **Conversão com 1 clique**: copia cliente, filial, itens, valores, descontos, frete
- **Bloqueio automático**: orçamento CONVERTIDO não pode ser alterado nem excluído
- **Rastreabilidade**: o pedido de venda gerado mantém referência ao orçamento original

### Quando NÃO Usar Orçamento
- **PDV (venda direta)**: use o PDV direto, sem passar por orçamento
- **Vendas recorrentes/contrato**: já tem contrato aprovado, vá direto ao pedido
- **Cliente comprando na hora**: vá direto ao pedido de venda

---

## Exemplo Prático

**Cenário:** Cliente "Empresa XYZ" pede um orçamento de 10 cadeiras e 5 mesas.

1. Criar orçamento: seleciona cliente, adiciona itens, prazo 15 dias → **ABERTO**
2. Cliente negocia: pede 5% de desconto → vendedor ajusta o valor
3. Cliente aprova → vendedor clica **Aprovar** → **APROVADO**
4. Vendedor clica **Converter** → sistema cria Pedido de Venda #PV-20260701-001
5. Orçamento agora aparece como **CONVERTIDO** no histórico
6. Pedido segue para separação, emissão de NF-e e entrega

---

## Boas Práticas para a Equipe

- **Orçamentos com valor alto**: sempre aguarde aprovação explícita do cliente antes de converter
- **Revise semanalmente**: use o filtro por status para encontrar orçamentos ABERTO antigos e decida o que fazer
- **Observações internas**: use o campo `observacoesInternas` para anotações da equipe (ex: "cliente pediu urgência", "negociar frete")
- **Histórico completo**: todos os orçamentos ficam registrados, mesmo os reprovados/expirados — útil para análise comercial
