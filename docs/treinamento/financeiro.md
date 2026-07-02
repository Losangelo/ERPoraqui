# Financeiro — Guia de Uso

## O que é?

O módulo Financeiro gerencia todo o fluxo de **contas a receber, contas a pagar e fluxo de caixa** da empresa. Ele é o coração financeiro do sistema — todas as vendas, compras e movimentações geram lançamentos aqui.

---

## Estrutura

```
Financeiro
├── Contas a Receber (dinheiro que entra)
│   ├── Vendas (via pedido de venda)
│   ├── Serviços (via NFSe)
│   └── Recebimentos diversos
├── Contas a Pagar (dinheiro que sai)
│   ├── Compras (via pedido de compra)
│   ├── Despesas fixas (aluguel, salários)
│   └── Pagamentos diversos
└── Fluxo de Caixa (visão consolidada)
    ├── Saldo atual
    ├── Previsão de entradas
    └── Previsão de saídas
```

---

## 1. Contas a Receber

### O que é?
Registra **todo dinheiro que sua empresa tem para receber**: vendas, serviços, boletos.

### Como as Contas são Criadas
- **Automaticamente**: ao confirmar um pedido de venda, o sistema gera as contas automaticamente
- **Manual**: lançamento avulso (ex: aluguel de imóvel próprio)
- **Via boleto**: contas com boleto têm baixa automática quando o retorno é processado

### Estados

| Estado | Significado |
|--------|-------------|
| **EM_ABERTO** | Aguardando pagamento |
| **PAGO** | Recebido com sucesso |
| **ATRASADO** | Venceu e não foi pago |
| **CANCELADO** | Cancelado (venda desfeita) |
| **PARCIAL** | Recebido parcialmente |

### Dicas
- **Acompanhe diariamente** as contas a vencer e vencidas
- **Use o relatório "Contas a Vencer"** para planejar o fluxo de caixa
- **Boletos**: gere a remessa e envie ao cliente com antecedência
- **Parcelamento**: vendas parceladas geram múltiplas contas (uma por parcela)
- **Centro de custo**: aloque cada conta a um centro de custo para análise gerencial

---

## 2. Contas a Pagar

### O que é?
Registra **todo dinheiro que sua empresa precisa pagar**: compras, fornecedores, despesas.

### Como as Contas são Criadas
- **Automaticamente**: ao confirmar um pedido de compra
- **Manual**: despesas fixas (aluguel, energia, salários)

### Dicas
- **Não atrase pagamentos**: multas e juros podem ser evitados com organização
- **Agrupe por fornecedor**: veja quanto deve para cada um
- **Condição de pagamento**: use à vista, à prazo ou parcelado conforme negociado
- **Centro de custo**: aloque para saber quanto cada departamento está gastando

---

## 3. Fluxo de Caixa

### O que é?
A visão **consolidada** de todo o dinheiro: o que tem hoje + o que vai entrar + o que vai sair.

```
Saldo Atual (R$ 50.000)
├── Entradas Previstas (R$ 30.000)
│   ├── Esta semana: R$ 10.000
│   └── Próximos 30 dias: R$ 20.000
├── Saídas Previstas (R$ 25.000)
│   ├── Esta semana: R$ 8.000
│   └── Próximos 30 dias: R$ 17.000
└── Saldo Projetado: R$ 55.000
```

### Dicas de Análise
- **Saldo projetado negativo** → precisa receber antes ou renegociar pagamentos
- **Saldo muito positivo** → pode investir ou quitar dívidas antecipadamente
- **Acompanhe semanalmente** — não deixe para o fim do mês
- **Exporte para CSV** e monte gráficos no Excel

---

## 4. DRE (Demonstração de Resultados)

A DRE mostra o **resultado financeiro do período**:

```
Receita Bruta: R$ 100.000
(–) Deduções/Impostos: R$ 15.000
= Receita Líquida: R$ 85.000
(–) Custos: R$ 40.000
= Lucro Bruto: R$ 45.000
(–) Despesas: R$ 25.000
= Lucro Líquido: R$ 20.000
```

Use a DRE mensalmente para saber se sua empresa está **lucrando ou perdendo dinheiro**.

---

## Dicas e Truques Gerais

### Geração Automática de Contas
- Ao **confirmar um pedido de venda**, o sistema gera automaticamente:
  - Contas a Receber com as parcelas/configurações
  - Vencimento conforme condição de pagamento
- Ao **confirmar um pedido de compra**, idem para Contas a Pagar

### Condições de Pagamento
| Condição | Como funciona |
|----------|---------------|
| **À vista** | Gera 1 conta com vencimento imediato |
| **À prazo** | Gera 1 conta com vencimento em X dias |
| **Parcelado** | Gera N contas (ex: 3x de R\$ 100) |

### Conciliação Bancária
- Compare o **extrato do banco** com as contas do sistema
- Contas Pagas no sistema mas não no extrato → investigue
- Extrato com valor a mais → pode ser taxa ou crédito não lançado

### Centro de Custo
- Vincule **cada conta** a um centro de custo
- Depois analise: "Quanto o departamento de Vendas gastou esse mês?"
- Essencial para gestão departamental

---

## Boas Práticas

- **Feche o financeiro todo mês**: confira se todas as contas estão conciliadas
- **Acompanhe o fluxo de caixa semanalmente**: antecipe problemas
- **Cobre contas vencidas**: clientes podem esquecer — um lembrete resolve
- **Evite parcelamento longo**: parcelas futuras comprometem o fluxo
- **Use o DRE para decisões estratégicas**: investir ou cortar custos?

---

## Armadilhas Comuns

- ❌ **Não gerar contas automaticamente**: pedido confirmado mas sem conta no financeiro
- ❌ **Ignorar contas vencidas**: juros e multas acumulam
- ❌ **Misturar contas pessoais com da empresa**: mantenha separado
- ❌ **Não conciliar com o banco**: sistema mostra pago mas banco não recebeu
- ❌ **Não usar centro de custo**: não sabe onde está gastando
- ✅ **Receita - Despesas = Lucro (ou prejuízo)** — acompanhe todo mês
