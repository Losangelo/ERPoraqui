# ECF (Escrituração Contábil Fiscal) — Guia de Uso

## O que é?

A **ECF** (Escrituração Contábil Fiscal) é a obrigação acessória digital que substituiu a antiga DIPJ. Deve ser entregue anualmente à Receita Federal por todas as empresas do Lucro Real, Lucro Presumido ou Simples Nacional.

---

## Quem Deve Entregar?

| Regime | Obrigatório? |
|--------|-------------|
| Lucro Real | Sim |
| Lucro Presumido | Sim |
| Simples Nacional | Sim (apenas escrituração contábil) |
| MEI | Não |

---

## O que o Sistema Gera

O ERPoraqui gera os **dados necessários** para compor a ECF:

| Dado | Origem |
|------|--------|
| Lançamentos contábeis | Plano de Contas |
| Saldos de contas | Período selecionado |
| DRE | Demonstrativo de Resultados |
| Balanço Patrimonial | Plano de Contas |
| Livro Diário | Lançamentos do período |

---

## Passo a Passo

### 1. Acessar o Módulo

1. Vá em **Fiscal > ECF**
2. Selecione o **ano-calendário** desejado

### 2. Gerar Dados

1. Clique em **Gerar Dados**
2. O sistema compila as informações contábeis do período
3. Valida consistência dos dados (saldo devedor = saldo credor)

### 3. Exportar

1. Clique em **Exportar**
2. Escolha o formato:
   - **TXT** — para validação no programa da Receita
   - **PDF** — para arquivo
3. O arquivo é baixado

### 4. Entregar ao Contador

O arquivo gerado deve ser enviado ao seu contador, que fará:
- Validação das informações
- Assinatura digital (certificado do contador)
- Transmissão à Receita Federal

---

## Dicas e Boas Práticas

- **Mantenha o Plano de Contas atualizado** — a ECF usa a estrutura de contas
- **Feche o DRE mensalmente** — facilita a geração anual
- **A ECF deve ser assinada por contador** com CRC ativo
- **Prazo**: até 31 de julho do ano seguinte ao ano-calendário

---

## Problemas Comuns

| Problema | Solução |
|----------|---------|
| Saldo contábil não fecha | Verifique lançamentos no plano de contas |
| Conta sem movimento no período | Configure contas que devem aparecer mesmo sem saldo |
| Erro de validação | Consulte seu contador ou o manual da Receita |
