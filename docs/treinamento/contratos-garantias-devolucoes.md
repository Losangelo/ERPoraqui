# Contratos, Garantias e Devoluções — Guia de Uso

## O que é?

Este módulo reúne três processos interligados do ciclo pós-venda:

- **Contratos**: gestão de contratos de prestação de serviços ou fornecimento contínuo
- **Garantias**: controle de garantias de produtos (fábrica + estendida)
- **Devoluções**: fluxo completo de devolução de mercadorias (troca, defeito, arrependimento)

Juntos, eles formam o **ciclo de vida completo do relacionamento com o cliente** após a venda.

---

## 1. Contratos

### Ciclo de Vida

```
EM_DIGITACAO → ATIVO → SUSPENSO → ENCERRADO
                                    ↓
                               CANCELADO
```

| Estado | Significado |
|--------|-------------|
| **EM_DIGITAÇÃO** | Contrato sendo elaborado, ainda não vigente |
| **ATIVO** | Contrato em vigor, com medições sendo feitas |
| **SUSPENSO** | Pausado temporariamente (ex: cliente solicitou suspensão) |
| **ENCERRADO** | Concluído normalmente (prazo finalizado) |
| **CANCELADO** | Cancelado antes do término |

### Medições
- Contratos de serviço geralmente têm **medições mensais**
- Registre a medição com o valor do período
- A medição pode ser **faturada** — gera automaticamente uma conta a receber
- Acompanhe o total medido vs. valor do contrato

### Dicas
- **Renovação automática**: configure se o contrato renova automaticamente ao vencer
- **Faturamento recorrente**: use as medições para faturar todo mês sem criar manualmente
- **Anexos**: vincule documentos digitalizados ao contrato (pdf do contrato assinado)

---

## 2. Garantias

### Como Funciona
- Cada **produto** pode ter regras de garantia (prazo, condições)
- A **Garantia de Fábrica** é definida pelo fabricante
- A **Garantia Estendida** pode ser vendida ao cliente

### Verificação de Elegibilidade
- O sistema verifica se um produto + cliente tem garantia ativa
- Use na hora da solicitação de **devolução ou assistência**
- A garantia cobre: defeitos de fabricação (não cobre mau uso)

### Dicas
- **Configure regras por produto**: prazos diferentes para cada tipo de produto
- **Garantia estendida**: pode ser um serviço adicional vendido no pedido
- **Atendimento**: ao abrir uma devolução, o sistema informa se está dentro da garantia

---

## 3. Devoluções

### Fluxo Completo

```
Solicitação → Inspeção → Aprovação/Rejeição → Destinação
                                        ↓
                                    Troca / Crédito / Devolução Financeira
```

| Estado | Significado |
|--------|-------------|
| **SOLICITADA** | Cliente pediu devolução |
| **EM_INSPECAO** | Produto recebido, aguardando análise técnica |
| **APROVADA** | Devolução aprovada — definir destinação |
| **REJEITADA** | Devolução recusada (fora da garantia, mau uso, etc.) |
| **TROCA_REALIZADA** | Produto substituído |
| **CREDITO_GERADO** | Valor convertido em crédito na loja |
| **DEVOLVIDO** | Dinheiro devolvido ao cliente |
| **CANCELADA** | Devolução cancelada |

### Destinação
Após aprovar, decida o que fazer:
- **Troca**: enviar novo produto ao cliente
- **Crédito**: gerar crédito na loja para próxima compra
- **Devolução financeira**: estornar o valor (via boleto, PIX, cartão)
- **Descarte**: produto sem condições de uso (logística reversa)

### Dicas
- **Solicitação**: o cliente pode solicitar pelo sistema (autoatendimento futuro)
- **Inspeção**: registre fotos e laudo técnico na inspeção
- **Prazo**: o CDC determina 7 dias para arrependimento (vendas online) e 30 dias para defeito
- **NF-e de devolução**: ao aprovar, o sistema gera uma NF-e de devolução

---

## Exemplo Prático

**Cenário:** Cliente comprou uma máquina de café que apresentou defeito em 15 dias.

1. **Devolução solicitada** → status SOLICITADA
2. Produto chega → **inspeção** descobre peça com defeito de fábrica → EM_INSPECAO
3. **Aprova** → sistema verifica garantia (ativa) → APROVADA
4. **Destinação: Troca** → gera pedido de venda com novo produto
5. Status final: **TROCA_REALIZADA**
6. NF-e de devolução emitida automaticamente

---

## Boas Práticas

- **Contratos**: registre medições mensalmente — não acumule
- **Garantias**: configure as regras assim que cadastrar o produto
- **Devoluções**: agilize a inspeção — cliente aguarda resposta
- **Troca**: o sistema já cria o pedido de troca automaticamente
- **Histórico**: todas as garantias e devoluções ficam vinculadas ao cliente
- **Análise**: produtos com muitas devoluções podem ter defeito crônico — avise o comprador

---

## Armadilhas Comuns

- ❌ **Contrato ativo sem medição**: parece que não está sendo faturado
- ❌ **Garantia vencida**: verifique a data antes de aprovar devolução
- ❌ **Devolução sem inspeção**: pode aprovar produto em boas condições como "defeito"
- ❌ **Esquecer a destinação**: devolução aprovada sem definir o que fazer
- ❌ **Confundir troca com devolução financeira**: troca = novo produto; devolução = dinheiro de volta
- ✅ **Sempre inspecione antes de aprovar** uma devolução
