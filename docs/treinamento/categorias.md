# Categorias de Produtos — Guia de Uso

## O que é?

Categorias organizam os **produtos em grupos** para facilitar a busca, relatórios e gestão de estoque. Cada produto pertence a uma categoria, e as categorias podem ter hierarquia (pai e filho).

---

## Estrutura

```
Categorias
├── Bebidas
│   ├── Refrigerantes (filho de Bebidas)
│   ├── Sucos (filho de Bebidas)
│   └── Águas (filho de Bebidas)
├── Alimentícios
│   ├── Enlatados
│   ├── Grãos
│   └── Congelados
├── Limpeza
│   ├── Produtos de Limpeza
│   └── Descartáveis
└── Papelaria
```

---

## Passo a Passo

### 1. Criar Categoria

1. Acesse **Estoque > Categorias**
2. Clique em **+ Nova Categoria**
3. Preencha:
   - **Nome**: nome da categoria (ex: "Bebidas")
   - **Categoria Pai**: para hierarquia (opcional)
   - **Descrição**: informações adicionais (opcional)
   - **Ativo**: se a categoria está disponível
4. Salve

### 2. Vincular Produto à Categoria

Ao cadastrar ou editar um produto:
1. No campo **Categoria**, selecione a categoria desejada
2. Salve o produto
3. O produto aparece nos relatórios da categoria

### 3. Gerenciar Categorias

- **Editar**: altere nome, pai ou descrição
- **Excluir**: apenas categorias sem produtos vinculados
- **Ativar/Desativar**: categorias desativadas não aparecem nos cadastros

---

## Dicas e Boas Práticas

- **Crie categorias amplas** no início, depois subdivida conforme necessário
- **Evite categorias muito específicas** (ex: "Refrigerante de Cola Lata 350ml")
- **Use hierarquia** com no máximo 3 níveis (Categoria > Subcategoria > Tipo)
- **Categorias ajudam nos relatórios** de vendas por grupo de produto

---

## Problemas Comuns

| Problema | Solução |
|----------|---------|
| Categoria não aparece no produto | Verifique se está ativa |
| Não consigo excluir categoria | Pode ter produtos vinculados — remova-os primeiro |
| Categoria errada no relatório | Edite os produtos e corrija a categoria |
