# Especificação Técnica — Módulo Unidades de Medida

## 1. Visão Geral

Módulo responsável pelo cadastro de unidades de medida utilizadas no sistema (ex: UN, KG, LT, M, CX). Possui flag `fracionada` para indicar se aceita valores decimais. Utilizado por produtos e documentos fiscais. Multi-empresa por design.

## 2. Data Model (Prisma Schema)

**Modelo:** `UnidadeMedida` — tabela `unidades_medida`

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| id | String | PK, @default(cuid), @map("_id") | Identificador único |
| empresaId | String | FK → Empresa | Vínculo multi-empresa |
| simbolo | String | NOT NULL, unique(empresaId, simbolo) | Símbolo (ex: KG, UN) |
| descricao | String | NOT NULL | Descrição (ex: Quilograma) |
| fracionada | Boolean | @default(false) | Aceita valores fracionados |
| ativo | Boolean | @default(true) | Status |
| dataCriacao | DateTime | @default(now()) | Auditoria |
| dataAtualizacao | DateTime | @updatedAt | Auditoria |

**Unique:** `@@unique([empresaId, simbolo])`

**Relacionamentos:**
- `empresa → Empresa`
- `produtos → Produto[]`

## 3. API Endpoints

**Base:** `/api/v1/unidades-medida`
**Autenticação:** `authMiddleware` (JWT)

| Método | Rota | Descrição | Controller | Query Params |
|---|---|---|---|---|
| POST | `/` | Criar unidade | `criar` | — |
| GET | `/` | Listar unidades | `listar` | simbolo, descricao, ativo, pagina, limite |
| GET | `/ativas` | Listar apenas ativas | `listarAtivas` | — |
| GET | `/:id` | Buscar por ID | `buscarPorId` | — |
| PUT | `/:id` | Atualizar unidade | `atualizar` | — |
| DELETE | `/:id` | Excluir unidade | `excluir` | — |

### Padrão de Resposta

```json
{
  "success": true,
  "data": { ...unidade },
  "meta": { "pagina": 1, "limite": 20, "total": 5, "totalPaginas": 1 }
}
```

### Endpoint `/ativas`

Retorna array simples de unidades com `ativo = true`, usado para popular comboboxes em formulários de produto.

## 4. DTOs (Zod Schemas)

**`UnidadeMedidaSchema` (criação):**
- `simbolo`: z.string().min(1) — obrigatório
- `descricao`: z.string().min(1) — obrigatório
- `fracionada`: boolean opcional
- `ativo`: boolean opcional

**`UnidadeMedidaUpdateSchema`:**
- `simbolo`: string opcional (min 1)
- `descricao`: string opcional (min 1)
- `fracionada`: boolean opcional
- `ativo`: boolean opcional

**`UnidadeMedidaFiltroSchema`:**
- `simbolo`, `descricao`, `ativo`: opcionais
- `pagina`: z.number().int().positive().default(1)
- `limite`: z.number().int().positive().max(100).default(20)

## 5. Frontend — UnidadesMedidaPage

**Arquivo:** `apps/web/src/pages/estoque/UnidadesMedidaPage.tsx`
**Serviço:** `apps/web/src/services/estoque.ts` (export `unidadesService`)

### Componentes
- **Dashboard cards:** Total, Ativas, Fracionáveis
- **Tabela:** Símbolo, Descrição, Fracionável (badge Sim/Não), Status (badge), Ações (Editar, Excluir)
- **Dialog formulário:** Símbolo (uppercase automático, max 3 chars), Descrição, checkbox Fracionada
- **Data fetching:** TanStack Query (`useQuery`, `useMutation`)

### Service (`unidadesService`)

| Método | Rota |
|---|---|
| `listar()` | GET /unidades-medida?pagina=1&limite=100 |
| `buscarPorId(id)` | GET /unidades-medida/:id |
| `criar(data)` | POST /unidades-medida |
| `atualizar(id, data)` | PUT /unidades-medida/:id |
| `excluir(id)` | DELETE /unidades-medida/:id |

## 6. Regras de Negócio

1. **Símbolo único por empresa:** `@@unique([empresaId, simbolo])`
2. Símbolo é armazenado **sempre em maiúsculo** (convertido no service)
3. **Exclusão bloqueada** se existirem produtos vinculados à unidade
4. Ao atualizar símbolo, verifica duplicidade com o novo valor
5. `GET /ativas` é o endpoint específico para lookup fields e comboboxes
6. Listagem com `_count` de produtos (via Prisma include)

## 7. Validações

- Símbolo e descrição obrigatórios
- Símbolo convertido para uppercase automaticamente
- Símbolo deve ser único por empresa
- Paginação: página ≥ 1, limite ≤ 100
- `success: true/false` wrapper pattern

## 8. Integrações

| Módulo | Tipo | Descrição |
|---|---|---|
| Produtos | FK | Unidade de medida do produto |
| PedidosVenda | Referência | Unidade nos itens de pedido |
| PedidosCompra | Referência | Unidade nos itens de compra |
| NF-e | Referência | Unidade comercial nos itens de nota |
| Kardex | Referência | Unidade nas movimentações |
| SPED Fiscal | Exportação | Bloco 0 (unidades) |
