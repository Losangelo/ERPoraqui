# Especificação Técnica - Módulo de Centro de Custo

## Visão Geral

Estrutura hierárquica de centros de custo para alocação de despesas e receitas por departamento, projeto ou unidade de negócio.

---

## Modelo de Dados

### CentroCusto

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| empresaId | String | FK Empresa |
| codigo | String | Código único por empresa |
| nome | String | Nome do centro |
| descricao | String? | Descrição |
| centroPaiId | String? | FK CentroCusto (auto-relacionamento) |
| ativo | Boolean | Ativar/desativar |

### Relacionamentos

```
CentroCusto.centroPai -> CentroCusto (hierarquia)
ContaPagar.centroCustoId -> CentroCusto
ContaReceber.centroCustoId -> CentroCusto
FluxoCaixa.centroCustoId -> CentroCusto
```

### Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/v1/centros-custo | Criar |
| GET | /api/v1/centros-custo | Listar |
| GET | /api/v1/centros-custo/:id | Buscar com subcentros |
| PUT | /api/v1/centros-custo/:id | Atualizar |
| DELETE | /api/v1/centros-custo/:id | Excluir (soft delete) |
| GET | /api/v1/centros-custo/arvore | Árvore hierárquica completa |

### Frontend

- Página: `/centros-custo`
- Visualização em árvore com indentação
- Formulário com seletor de centro pai
- Toggle ativo/inativo

### Regras de Negócio

1. Código único por empresa
2. Estrutura hierárquica ilimitada (auto-relacionamento)
3. Ao excluir, apenas marca como inativo (soft delete)
4. Centros de custo vinculados a contas não podem ser excluídos fisicamente
5. Herança de centro pai para relatórios consolidados
