# Adiantamentos — Guia de Uso

## O que é?

O módulo de Adiantamentos permite registrar adiantamentos financeiros concedidos a **fornecedores** (pré-pagamento de compras) ou recebidos de **clientes** (sinal de pedido). O adiantamento é um valor entregue antes da conclusão da operação e deve ser baixado posteriormente.

---

## Pré-requisitos

- Cliente ou fornecedor cadastrado no sistema
- Conta financeira configurada (caixa, banco)

---

## Tipos de Adiantamento

| Tipo | Descrição |
|------|-----------|
| **Cliente** | Cliente pagou um sinal ou entrada antes do pedido |
| **Fornecedor** | Sua empresa pagou adiantamento a um fornecedor |

---

## Passo a Passo

### 1. Registrar um Adiantamento

1. Acesse **Financeiro > Adiantamentos**
2. Clique em **+ Novo Adiantamento**
3. Selecione o **tipo** (Cliente ou Fornecedor)
4. Busque e selecione o cliente/fornecedor (campo lookup)
5. Informe:
   - **Valor**: valor do adiantamento
   - **Data**: data do adiantamento
   - **Descrição**: motivo (ex: "Sinal do pedido #123")
   - **Forma de Pagamento**: dinheiro, cartão, PIX, etc.
6. Salve

### 2. Baixar (Compensar) o Adiantamento

Quando a operação for concluída (pedido faturado, NF emitida):

1. Na lista de adiantamentos, localize o registro
2. Clique em **Baixar**
3. Selecione a conta a receber/pagar vinculada
4. Confirme — o valor é baixado automaticamente

### 3. Estornar Adiantamento

Se o negócio não for concluído:

1. Localize o adiantamento
2. Clique em **Estornar**
3. Informe o motivo
4. Confirme — o valor retorna ao status original

---

## Dicas e Boas Práticas

- **Registre todo adiantamento** — manter o controle evita esquecimentos
- **Vincule ao pedido** sempre que possível para rastreabilidade
- **Use o campo de observações** para registrar detalhes da negociação
- **Feche os adiantamentos mensalmente** para conciliação

---

## Problemas Comuns

| Problema | Solução |
|----------|---------|
| Adiantamento em aberto há meses | Contate o cliente/fornecedor e regularize |
| Valor não confere com o pedido | Verifique descontos ou acréscimos não registrados |
| Cliente não localizado no lookup | Cadastre o cliente primeiro em Cadastros > Clientes |
