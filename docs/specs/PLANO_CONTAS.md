# Especificação Técnica - Módulo Plano de Contas

## Visão Geral

Plano de contas contábil hierárquico (níveis: 1.x, 1.1.x, 1.1.1.x), com contas sintéticas (agrupadoras) e analíticas (lançáveis), controlado por licença.

---

## Modelo de Dados

### PlanoConta

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| empresaId | String | FK Empresa |
| codigo | String | Código hierárquico (ex: 1.1.1) |
| nome | String | Nome da conta |
| tipo | TipoConta | SINTETICA (grupo) ou ANALITICA (lançável) |
| nivel | Int | Nível hierárquico (1, 2, 3...) |
| contaPaiId | String? | FK conta pai (auto-relacionamento) |
| natureza | NaturezaConta | CREDORA ou DEVEDORA |
| aceite | Boolean | Aceita lançamentos (apenas analítica) |
| ativo | Boolean | Ativo |

### LancamentoContabil

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| empresaId | String | FK Empresa |
| data | DateTime | Data do lançamento |
| dataCompetencia | DateTime? | Data competência |
| tipo | TipoLancamento | DEBITO, CREDITO |
| historia | String | Histórico |
| valor | Float | Valor |
| planoContaId | String | FK Plano de contas |
| documento | String? | Nº documento |
| observacoes | String? | Observações |

### Enums

```
TipoConta: SINTETICA | ANALITICA
NaturezaConta: CREDORA | DEVEDORA
TipoLancamento: DEBITO | CREDITO
```

### Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/v1/plano-contas | Listar contas |
| GET | /api/v1/plano-contas/arvore | Listar em árvore hierárquica |
| GET | /api/v1/plano-contas/:id | Buscar conta |
| POST | /api/v1/plano-contas | Criar conta |
| PUT | /api/v1/plano-contas/:id | Atualizar conta |
| DELETE | /api/v1/plano-contas/:id | Excluir conta |

### Frontend

- Página: `/plano-contas`
- Visualização em árvore hierárquica expansível
- Diferenciação visual: contas sintéticas (negrito) vs analíticas (normal)
- CRUD completo com dialog formulário
- Licença guard: módulo habilitado via `licencaGuard('planocontas')`
- Campo código com validação de unicidade por empresa

### Regras de Negócio

1. Conta sintética não aceita lançamentos diretos (aceite = false)
2. Conta analítica aceita lançamentos (aceite = true)
3. Código hierárquico único por empresa (ex: 1, 1.1, 1.1.1)
4. Exclusão bloqueada se houver subcontas ou lançamentos vinculados
5. Unique(empresaId, codigo) para evitar duplicidade
6. Nível é calculado automaticamente baseado no código (split por ".")
