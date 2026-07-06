# Especificação Técnica - Inventário Físico

## Visão Geral

Módulo de inventário físico para contagem e conciliação de estoque. Permite criar inventários por filial, registrar contagens manuais de produtos, conciliar divergências e ajustar o saldo automaticamente.

Fluxo: Abertura -> Contagem -> Conciliação -> Ajuste de Estoque -> Fechamento.

---

## Modelo de Dados

### Inventario

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| empresaId | String | FK Empresa |
| filialId | String | FK Filial |
| dataInventario | DateTime | Data do inventário |
| dataFechamento | DateTime? | Data de conclusão |
| tipo | TipoInventario | ANUAL, MENSAL, ROTATIVO, EXTRAORDINARIO |
| situacao | SituacaoInventario | ABERTO, EM_CONFERENCIA, CONCLUIDO, CANCELADO |
| observacoes | String? | Observações |

### ItemInventario

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| inventarioId | String | FK Inventario |
| produtoId | String | FK Produto |
| quantidadeSistema | Float | Saldo no sistema (momento da criação) |
| quantidadeContada | Float? | Quantidade contada fisicamente |
| diferenca | Float? | qtdContada - qtdSistema |
| custoUnitario | Float | Preço de custo |
| valorDiferenca | Float? | diferenca * custoUnitario |
| situacao | SituacaoItemInventario | PENDENTE, CONTADO, CONCILIADO, AJUSTADO |
| observacoes | String? | Observações da contagem |
| dataContagem | DateTime? | Data da contagem |
| dataConciliacao | DateTime? | Data da conciliação |

```prisma
enum TipoInventario { ANUAL, MENSAL, ROTATIVO, EXTRAORDINARIO }
enum SituacaoInventario { ABERTO, EM_CONFERENCIA, CONCLUIDO, CANCELADO }
enum SituacaoItemInventario { PENDENTE, CONTADO, CONCILIADO, AJUSTADO }
```

---

## Endpoints API

Base: `/api/v1/inventario` (autenticado)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/` | Criar inventário |
| GET | `/` | Listar inventários |
| GET | `/:id` | Buscar por ID (com itens) |
| POST | `/:id/contagem` | Registrar contagem de um produto |
| POST | `/:id/conciliar` | Conciliar itens selecionados |
| POST | `/:id/ajustar` | Ajustar diferença de um item |
| POST | `/:id/cancelar` | Cancelar inventário |
| GET | `/:id/divergencias` | Relatório de divergências |

### POST / (Criar)

**Body:**
```json
{
  "filialId": "string (obrigatório)",
  "dataInventario": "2026-07-06T...",
  "tipo": "ANUAL | MENSAL | ROTATIVO | EXTRAORDINARIO",
  "observacoes": "string (opcional)"
}
```

**Comportamento:**
1. Valida filial pertence à empresa
2. Verifica se já existe inventário ABERTO/EM_CONFERENCIA para a filial (bloqueia duplicidade)
3. Busca todos os produtos ativos da empresa
4. Cria inventário com itens (um por produto), cada item com `quantidadeSistema` e `situacao: PENDENTE`

### POST /:id/contagem

**Body:**
```json
{
  "produtoId": "string (obrigatório)",
  "quantidadeContada": 10,
  "observacoes": "string (opcional)"
}
```

**Regras:**
- Inventário não pode estar CONCLUIDO ou CANCELADO
- Produto deve existir no inventário
- Calcula `diferenca = qtdContada - qtdSistema`
- Calcula `valorDiferenca = diferenca * custoUnitario`
- Atualiza situação do inventário para EM_CONFERENCIA

### POST /:id/conciliar

**Body:**
```json
{
  "itemIds": ["id1", "id2"],
  "ajustarEstoque": true
}
```

**Regras:**
- Inventário deve estar EM_CONFERENCIA
- Se `ajustarEstoque=true`, atualiza `Produto.quantidadeEstoque`
- Se todos itens conciliados, inventário vai para CONCLUIDO

### POST /:id/ajustar

**Body:**
```json
{
  "produtoId": "string (obrigatório)",
  "novaQuantidade": 15,
  "justificativa": "string (mínimo 10 caracteres)"
}
```

Já ajusta o estoque do produto diretamente. Não altera situação do inventário.

### POST /:id/cancelar

Bloqueado se inventário já CONCLUIDO.

### GET /:id/divergencias

Retorna itens com `diferenca != 0`, separados em `itensAcima` (>0) e `itensAbaixo` (<0).

---

## Frontend

### Página: InventarioPage (`/inventario`)

**Componentes:**
- Cards de estatísticas: Abertos, Em Conferência, Concluídos, Total
- Busca textual + filtro por status (select)
- Tabela: Data, Tipo, Filial, Itens, Status, Ações (Concluir/Cancelar)
- Dialog "Novo Inventário":
  - Select Tipo (GERAL, PARCIAL, ROTATIVO -- **nota:** backend usa ANUAL, MENSAL, ROTATIVO, EXTRAORDINARIO; há discrepância entre frontend e backend)
  - Input Observações

**Service (`services/inventario.ts`):**
- `listar(filtros)` -> GET `/inventario`
- `buscarPorId(id)` -> GET `/inventario/:id`
- `criar(dados)` -> POST `/inventario`
- `registrarContagem(id, dados)` -> POST `/inventario/:id/contagem`
- `conciliar(id, dados)` -> POST `/inventario/:id/conciliar`
- `ajustar(id, dados)` -> POST `/inventario/:id/ajustar`
- `cancelar(id)` -> POST `/inventario/:id/cancelar`
- `divergencias(id)` -> GET `/inventario/:id/divergencias`

---

## Regras de Negócio

1. **Um inventário por filial:** Não permite criar inventário se já houver um ABERTO ou EM_CONFERENCIA para a mesma filial
2. **Criação em massa:** Ao criar, o sistema gera automaticamente um item para cada produto ativo da empresa
3. **Fluxo rígido:** ABERTO -> EM_CONFERENCIA -> CONCLUIDO (ou CANCELADO)
4. **Ajuste de estoque opcional na conciliação:** Pode-se conciliar itens sem ajustar o saldo
5. **Ajuste direto:** O endpoint `/ajustar` sempre altera o saldo (diferente da conciliação)
6. **Bloqueio de conclusão:** Inventário CONCLUIDO ou CANCELADO não aceita mais operações

---

## Validações (Zod)

- `criarInventarioSchema`: filialId (required), dataInventario (date), tipo (enum ANUAL|MENSAL|ROTATIVO|EXTRAORDINARIO), observacoes (optional)
- `iniciarContagemSchema`: produtoId (required), quantidadeContada (min 0), observacoes (optional)
- `conciliarItensSchema`: itemIds (string[], min 1), ajustarEstoque (boolean, default true)
- `ajustarDiferencaSchema`: produtoId (required), novaQuantidade (min 0), justificativa (min 10 chars)
- `inventarioFiltroSchema`: filialId, tipo, situacao, dataInicial, dataFinal (opcionais), pagina (default 1), limite (default 20)

---

## Discrepâncias Conhecidas

1. **Tipos de inventário:** Frontend usa `GERAL | PARCIAL | ROTATIVO` enquanto backend usa `ANUAL | MENSAL | ROTATIVO | EXTRAORDINARIO`. Necessário alinhamento.
2. **Filial no formulário:** Backend exige `filialId` obrigatório, mas frontend não possui campo de seleção de filial no dialog de criação.
