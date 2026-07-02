# Boletos / CNAB — Guia de Uso

## O que é?

O módulo de Boletos gerencia a **emissão e cobrança de boletos bancários**, com suporte aos formatos **CNAB 240 e CNAB 400** para comunicação direta com os bancos.

---

## Conceitos Essenciais

| Termo | Significado |
|-------|-------------|
| **Boleto Bancário** | Título de cobrança emitido por banco para recebimento |
| **CNAB** | Centro Nacional de Automação Bancária — padrão de arquivo para comunicação banco-empresa |
| **CNAB 400** | Layout mais antigo, 400 caracteres por linha (Banco do Brasil, Itaú, etc.) |
| **CNAB 240** | Layout mais moderno, 240 caracteres por linha (padrão Febraban) |
| **Remessa** | Arquivo enviado ao banco com boletos para registrar |
| **Retorno** | Arquivo recebido do banco com status dos boletos (pagos, vencidos, etc.) |
| **Nosso Número** | Identificação do boleto dentro do banco |
| **Linha Digitável** | Os números que o cliente digita no internet banking para pagar |

---

## Fluxo Completo

```
Gerar Boleto → Remessa (enviar ao banco) → Cliente Paga → Retorno (receber do banco) → Baixa Automática
```

### 1. Emitir Boleto
- Pode ser gerado a partir de uma **Conta a Receber** ou manualmente
- Informe: cliente, valor, data de vencimento, banco
- O sistema calcula automaticamente: juros, multa, descontos

### 2. Remessa (para o banco)
- Periodicamente, gere o **arquivo de remessa** com todos os boletos a registrar
- Envie via internet banking ou sistema do banco
- O banco processa e registra os boletos na central de cobrança

### 3. Pagamento
- O cliente recebe o boleto por email ou imprime
- Paga em qualquer banco, casa lotérica ou internet banking

### 4. Retorno (do banco)
- O banco gera o **arquivo de retorno** com os boletos pagos
- Importe no sistema → o processamento automático:
  - Marca boletos como **pagos**
  - Dá baixa na **Conta a Receber** correspondente
  - Atualiza o saldo do cliente

### 5. Conciliação
- Confira se os valores do retorno batem com o extrato bancário
- Boletos pagos parcialmente ou com diferença são sinalizados

---

## Dicas e Truques

### CNAB 240 vs. 400
- **CNAB 240**: mais moderno, suporta mais informações (multa, desconto, juros)
- **CNAB 400**: mais antigo, mas ainda usado por muitos bancos
- Consulte seu banco para saber qual formato usar

### Bancos Suportados
- O sistema suporta qualquer banco que utilize CNAB 240 ou 400
- Configure os parâmetros específicos de cada banco (carteira, convênio, agência, conta)

### Vencimento em Fim de Semana
- Configure se o boleto vence no próximo dia útil ou no próprio dia
- O sistema pode ajustar automaticamente

### Juros e Multa
- **Multa**: percentual fixo sobre o valor (máx. 2% ao mês, permitido por lei)
- **Juros**: percentual ao dia (máx. 1% ao mês)
- Configure as regras no sistema para aplicar automaticamente

### Desconto
- Ofereça desconto para pagamento antecipado
- Defina valor ou percentual com data limite

### Protesto
- Boletos não pagos podem ser enviados a protesto
- Configure o prazo (ex: 30 dias após vencimento)

---

## Boas Práticas

- **Gere remessa regularmente**: diariamente ou a cada 2 dias
- **Importe retorno todo dia**: assim que receber do banco
- **Confira a conciliação**: o retorno pode ter diferenças de tarifas
- **Email automático**: configure o envio automático do boleto por email ao cliente
- **Segunda via**: o cliente pode solicitar pelo sistema sem precisar falar com financeiro
- **Histórico**: mantenha todos os arquivos de remessa e retorno organizados por data
- **Acompanhe boletos vencidos**: use o relatório de contas a receber para cobrar

---

## Armadilhas Comuns

- ❌ **Remessa atrasada**: boleto não registrado, cliente não consegue pagar
- ❌ **Retorno não importado**: boleto pago não dá baixa automática — parece em aberto
- ❌ **Convenção incorreta**: carteira errada, nosso número duplicado
- ❌ **Vencimento em feriado**: cliente tenta pagar mas o sistema não reconhece
- ❌ **Esquecer multa/juros**: perde receita com atrasos
- ✅ **Gere remessa, importe retorno, confira a conciliação** — rotina semanal
