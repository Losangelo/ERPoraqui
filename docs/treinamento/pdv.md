# PDV (Ponto de Venda) — Guia de Uso

## O que é?

O PDV é o módulo de vendas rápidas no balcão — ideal para lojas físicas, varejo e atendimento presencial. Diferente do pedido de venda (que passa por separação/faturamento), o PDV finaliza a venda na hora.

---

## Fluxo Completo

```
Abrir Caixa → Buscar Produto → Adicionar ao Carrinho → Fechar Venda → Receber Pagamento
```

### 1. Abrir Caixa
- Antes de qualquer venda, o caixa precisa estar **aberto**
- Selecione a **filial** e o **operador** (você)
- O sistema registra a abertura com data/hora e valor inicial (se houver)

### 2. Buscar Produto
- **Código de barras**: leitor ou digitação — busca instantânea
- **Por nome**: digite parte do nome → grid de resultados aparece
- Clique no produto para adicionar ao carrinho

### 3. Carrinho
- Controles **+** e **-** para ajustar quantidade
- Botão **remover** para excluir item
- Valor total atualizado em tempo real
- Selecione o **cliente** (opcional, mas recomendado para NF-e)

### 4. Finalizar Venda
- Clique em **Finalizar Venda**
- Escolha a **forma de pagamento**:
  - **Dinheiro**: sistema calcula o troco automaticamente
  - **PIX**: gera QR Code ou chave
  - **Crédito**: à vista ou parcelado
  - **Débito**: débito direto
  - **Crédito Parcelado**: escolha número de parcelas
- Confirma → venda registrada → dialog de **venda finalizada** com resumo

---

## Dicas e Truques

### Produto sem código de barras?
- Busque pelo nome — funciona para qualquer produto cadastrado
- Configure códigos de barras personalizados para produtos sem código comercial

### Cliente não encontrado?
- Digite o nome parcial → sistema busca automaticamente
- Pode vender **sem cliente** (venda anônima) — mas prefira registrar para fidelidade

### Troco na hora
- O sistema já calcula: "Valor Recebido - Total = Troco"
- Mostra o valor do troco em destaque antes de finalizar

### Parcelamento
- Crédito parcelado: escolha 2x, 3x, 6x, 12x
- O sistema calcula automaticamente o valor de cada parcela

### Cancelamento de venda
- Vendas do PDV podem ser canceladas (devolução total)
- Acesse o histórico de vendas e use a opção de cancelamento

---

## Quando Usar vs. Não Usar

| Use PDV | Não use PDV |
|---------|-------------|
| Venda direta no balcão | Vendas com entrega agendada |
| Cliente comprando agora | Vendas com separação de estoque |
| Restaurante, loja física | Vendas B2B com contrato |
| Feiras e eventos | Pré-vendas ou orçamentos |

---

## Boas Práticas

- **Mantenha o caixa aberto** durante todo o expediente, feche apenas no fim do dia
- **Registre o cliente** sempre que possível — ajuda no CRM e relatórios
- **Confira o troco** na tela antes de receber o dinheiro
- **Use PIX** sempre que possível — reduz custos de maquineta e dinheiro em espécie
- **Treine a equipe** para usar busca por código de barras (mais rápido que digitar nome)
