# Parâmetros do Sistema — Guia de Uso

## O que é?

O módulo de Parâmetros permite **configurar o comportamento do sistema** — desde regras de negócio até dados fiscais. Cada parâmetro controla uma funcionalidade específica.

---

## Acessando Parâmetros

1. Acesse **Gestão > Parâmetros**
2. Os parâmetros são organizados por categoria

---

## Categorias de Parâmetros

### Gerais

| Parâmetro | Descrição | Valores |
|-----------|-----------|---------|
| `NOME_EMPRESA` | Nome da empresa | Texto |
| `CNPJ` | CNPJ da empresa | 14 dígitos |
| `IE` | Inscrição Estadual | Texto |
| `REGIME_TRIBUTARIO` | Regime fiscal | SIMPLES_NACIONAL, LUCRO_PRESUMIDO, LUCRO_REAL |

### Vendas

| Parâmetro | Descrição | Valores |
|-----------|-----------|---------|
| `VENDAS_PERMITIR_DESCONTO` | Vendedor pode dar desconto? | Sim/Não |
| `VENDAS_DESCONTO_MAXIMO` | Desconto máximo (%) | 0-100 |
| `ESTOQUE_BLOQUEAR_SEM_ESTOQUE` | Bloquear venda sem estoque? | Sim/Não |

### Fiscal

| Parâmetro | Descrição | Valores |
|-----------|-----------|---------|
| `NF_E_AMBIENTE` | Ambiente NF-e | 1=Produção, 2=Homologação |
| `NF_E_SERIE` | Série das notas | Número |
| `CERTIFICADO_DIGITAL` | Caminho do certificado PFX | Texto |
| `CSC_NFCE` | Código de Segurança NFC-e | Texto |

### Financeiro

| Parâmetro | Descrição | Valores |
|-----------|-----------|---------|
| `DIAS_VENCIMENTO_PADRAO` | Dias para vencimento | Número |
| `JUROS_MORA` | Juros por atraso (%) | Decimal |
| `MULTA_ATRASO` | Multa por atraso (%) | Decimal |

### Estoque

| Parâmetro | Descrição | Valores |
|-----------|-----------|---------|
| `ESTOQUE_ALERTA_MINIMO` | Alertar estoque baixo? | Sim/Não |
| `CUSTO_MEDIO` | Método de custo | MEDIA_PONDERADA, FIFO |

---

## Como Alterar

1. Localize o parâmetro pela busca ou navegue pela categoria
2. Clique no parâmetro
3. Altere o valor
4. Clique em **Salvar**
5. O sistema aplica imediatamente (sem precisar reiniciar)

---

## Dicas e Boas Práticas

- **Altere com cuidado** — parâmetros errados podem quebrar funcionalidades
- **Ambiente de homologação**: teste alterações em homologação antes de produção
- **Documente alterações**: anote o que mudou e por quê
- **Consulte o administrador** em caso de dúvida

---

## Problemas Comuns

| Problema | Solução |
|----------|---------|
| Parâmetro não aparece | Apenas Administradores veem todos os parâmetros |
| Alteração não faz efeito | Verifique se salvou corretamente |
| Valor inválido | Consulte a descrição do parâmetro para valores aceitos |
