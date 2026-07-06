# Unidades de Medida — Guia de Uso

## O que é?

Unidades de Medida definem **como os produtos são medidos e vendidos**. Cada produto tem uma unidade (ex: UN = unidade, KG = quilo, L = litro) que aparece em notas fiscais, pedidos e relatórios.

---

## Unidades Comuns

| Sigla | Descrição | Uso |
|-------|-----------|-----|
| **UN** | Unidade | Produtos vendidos por peça |
| **KG** | Quilograma | Produtos vendidos por peso |
| **G** | Grama | Produtos de pequeno peso |
| **L** | Litro | Líquidos |
| **ML** | Mililitro | Pequenos volumes |
| **M** | Metro | Tecidos, cabos, fitas |
| **M2** | Metro Quadrado | Pisos, tecidos |
| **M3** | Metro Cúbico | Volumes |
| **CX** | Caixa | Produtos embalados em caixa |
| **PC** | Peça | Peças |
| **PCT** | Pacote | Produtos vendidos em pacote |
| **TON** | Tonelada | Grandes pesos |
| **LT** | Lata | Enlatados |
| **FD** | Fardo | Produtos agrupados |

---

## Passo a Passo

### 1. Cadastrar Unidade

1. Acesse **Estoque > Unidades de Medida**
2. Clique em **+ Nova Unidade**
3. Preencha:
   - **Sigla**: abreviação (ex: "UN", "KG")
   - **Nome**: descrição (ex: "Unidade", "Quilograma")
   - **Ativo**: disponível para uso
4. Salve

### 2. Vincular ao Produto

No cadastro do produto, selecione a unidade no campo **Unidade de Medida**.

### 3. Unidades nas Notas Fiscais

A unidade do produto é impressa na NF-e/NFC-e:
- O campo **Unidade Comercial** usa a unidade do produto
- O campo **Unidade Tributável** pode ser diferente (ex: vende em UN, tributa em KG)

---

## Dicas e Boas Práticas

- **Use unidades padronizadas** (Tabela 5.1 do SFAC/SEFAZ)
- **Evite criar unidades duplicadas** (ex: "Kg" e "KG")
- **Unidades customizadas** (ex: "SERVICO") podem ser criadas conforme necessidade
- **A unidade deve ser consistente** com o tipo de produto

---

## Problemas Comuns

| Problema | Solução |
|----------|---------|
| Unidade não aparece no cadastro | Verifique se está ativa |
| NF-e rejeitada por unidade inválida | Use unidades da Tabela 5.1 da SEFAZ |
| Unidade aparece errada na nota | Edite o produto e corrija a unidade |
