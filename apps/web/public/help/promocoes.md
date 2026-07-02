# Promoções

Sistema de campanhas promocionais com regras flexíveis de desconto.

## Conceitos

| Conceito | Descrição |
|----------|-----------|
| Promoção | Campanha com período definido (início/fim) |
| Regra | Percentual, valor fixo ou leve-pague |
| Itens | Produtos participantes da promoção |

## Regras de Desconto

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| PERCENTUAL | Desconto % sobre o preço | 10% off |
| VALOR_FIXO | Desconto em R$ | R$ 5,00 off |
| LEVE_PAGUE | Leve X pague Y | Leve 3 pague 2 |

## Como Criar

1. Acesse **Estoque > Promoções** ou busque "Promoções" no Ctrl+K
2. Clique em **Nova Promoção**
3. Preencha:
   - **Descrição**: nome interno da campanha
   - **Data Início / Fim**: período de validade
   - **Tipo de Desconto**: Percentual, Valor Fixo ou Leve-Pague
   - **Valor**: percentual ou valor do desconto
   - **Itens**: busque produtos com o LookupField e adicione
   - Para Leve-Pague: configure quantidade "Levar" e "Pagar"
4. Salve — a promoção fica ativa automaticamente
5. Use o toggle **Ativar/Inativar** para controlar a campanha

## Boas Práticas

- Planeje promoções com antecedência (datas início/fim)
- Teste a regra em um item antes de ativar
- Use o tipo Percentual para descontos gerais
- Use Valor Fixo para itens de ticket baixo
- Use Leve-Pague para estoque em excesso

## Armadilhas Comuns

- **Data retroativa**: promoções com data passada não afetam pedidos já emitidos
- **Acumulação**: promoções não se acumulam no mesmo item
- **Reativação**: ao reativar, verifique se as datas ainda são válidas
