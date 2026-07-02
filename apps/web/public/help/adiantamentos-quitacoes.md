# Adiantamentos e Quitações

## Adiantamentos

Valores pagos ou recebidos antecipadamente.

### Tipos

| Tipo | Pessoa Vinculada |
|------|------------------|
| CLIENTE | Cliente |
| FORNECEDOR | Fornecedor |
| FUNCIONARIO | Funcionário (apenas controle interno) |

### Situações

| Situação | Descrição |
|----------|-----------|
| ABERTO | Adiantamento pendente de compensação |
| QUITADO | Compensado/baixado |
| CANCELADO | Cancelado |

### Formas de Pagamento

Dinheiro, PIX, Cartão Crédito, Cartão Débito, Boleto, Transferência, Cheque

### Como Criar

1. Acesse **Financeiro > Adiantamentos** ou busque "Adiantamentos" no Ctrl+K
2. Clique em **Novo Adiantamento**
3. Selecione o **Tipo** (Cliente, Fornecedor ou Funcionário)
4. Busque a pessoa com **LookupField**
5. Informe **Valor**, **Data**, **Forma de Pagamento**
6. Salve

### Ações

- **Quitar**: marca como compensado
- **Cancelar**: desfaz o adiantamento

---

## Quitações

Baixa em lote de contas a receber ou a pagar.

### Como Quitar em Lote

1. Acesse **Financeiro > Quitações** ou busque "Quitações" no Ctrl+K
2. Clique em **Nova Quitação**
3. Selecione o **Tipo** (Receber ou Pagar)
4. Busque o cliente ou fornecedor
5. Selecione as **contas disponíveis** (status ABERTA ou VENCIDA) com checkboxes
6. Informe **Data da Quitação** e **Forma de Pagamento**
7. As contas selecionadas são baixadas automaticamente como PAGAS

### Armadilhas Comuns

- **Contas já pagas**: não aparecem na lista de disponíveis
- **Valor parcial**: a quitação é pelo valor total de cada conta selecionada
- **Estorno**: para desfazer, é necessário reabrir manualmente cada conta
