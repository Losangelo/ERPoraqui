# Especificação Técnica — Módulo Categorias

## 1. Visão Geral

Módulo responsável pelas categorias de produtos. Suporta hierarquia (categoria pai → subcategorias) com até 3 níveis de profundidade. Utilizado como lookup para classificação de produtos e relatórios fiscais (SPED). Multi-empresa por design.

## 2. Data Model (Prisma Schema)

**Modelo:** `Categoria` — tabela `categorias`

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| id | String | PK, @default(cuid), @map("_id") | Identificador único |
| empresaId | String | FK → Empresa | Vínculo multi-empresa |
| nome | String | NOT NULL | Nome da categoria |
| descricao | String? | | Descrição |
| categoriaPaiId | String? | FK → Categoria (auto-relacionamento) | Categoria pai (hierarquia) |
| ativo | Boolean | @default(true) | Status |
| dataCriacao | DateTime | @default(now()) | Auditoria |
| dataAtualizacao | DateTime | @updatedAt | Auditoria |

**Relacionamentos:**
- `empresa → Empresa`
- `categoriaPai → Categoria?` (auto-relacionamento "CategoriaSubcategorias")
- `subcategorias → Categoria[]` (auto-relacionamento)
- `produtos → Produto[]`

## 3. API Endpoints

**Base:** `/api/v1/categorias`
**Autenticação:** `authMiddleware` (JWT)

| Método | Rota | Descrição | Controller | Query Params |
|---|---|---|---|---|
| POST | `/` | Criar categoria | `criar` | — |
| GET | `/` | Listar categorias | `listar` | nome, ativo, pagina, limite |
| GET | `/arvore` | Listar árvore hierárquica | `listarArvore` | — |
| GET | `/:id` | Buscar por ID | `buscarPorId` | — |
| PUT | `/:id` | Atualizar categoria | `atualizar` | — |
| DELETE | `/:id` | Excluir categoria | `excluir` | — |

### Padrão de Resposta

```json
{
  "success": true,
  "data": { ...categoria },
  "meta": { "pagina": 1, "limite": 20, "total": 10, "totalPaginas": 1 }
}
```

### Endpoint `/arvore`

Retorna categorias ativas em estrutura hierárquica aninhada (até 3 níveis):
```json
{
  "success": true,
  "data": [
    {
      "id": "...", "nome": "Eletrônicos",
      "subcategorias": [
        {
          "id": "...", "nome": "Celulares",
          "subcategorias": [ { "id": "...", "nome": "Acessórios" } ]
        }
      ]
    }
  ]
}
```

## 4. DTOs (Zod Schemas)

**`CategoriaSchema` (criação):**
- `nome`: z.string().min(1) — obrigatório
- `descricao`: string opcional
- `categoriaPaiId`: string opcional
- `ativo`: boolean opcional

**`CategoriaUpdateSchema`:**
- `nome`: string opcional (min 1)
- `descricao`: string opcional
- `categoriaPaiId`: string ou null (permite remover o pai)
- `ativo`: boolean opcional

**`CategoriaFiltroSchema`:**
- `nome`, `ativo`: opcionais
- `pagina`: z.number().int().positive().default(1)
- `limite`: z.number().int().positive().max(100).default(20)

## 5. Frontend — CategoriasPage

**Arquivo:** `apps/web/src/pages/estoque/CategoriasPage.tsx`
**Serviço:** `apps/web/src/services/estoque.ts` (export `categoriasService`)

### Componentes
- **Dashboard cards:** Total, Ativas, Inativas
- **Lista em grid:** Cards com nome, descrição, badge status, ações (Editar, Excluir com confirm)
- **Dialog formulário:** Nome, Descrição (textarea)
- **Data fetching:** TanStack Query (`useQuery`, `useMutation`)

### Service (`categoriasService`)

| Método | Rota |
|---|---|
| `listar()` | GET /categorias?pagina=1&limite=100 |
| `buscarPorId(id)` | GET /categorias/:id |
| `criar(data)` | POST /categorias |
| `atualizar(id, data)` | PUT /categorias/:id |
| `excluir(id)` | DELETE /categorias/:id |

## 6. Regras de Negócio

1. **Hierarquia:** Categoria pode ter uma `categoriaPaiId` (auto-relacionamento)
2. **Proteção contra ciclo:** Não permite que uma categoria seja filha de si mesma
3. **Exclusão bloqueada** se:
   - Possuir subcategorias vinculadas
   - Possuir produtos associados à categoria
4. Listagem `GET /` retorna `_count` de produtos e subcategorias (via Prisma include)
5. `GET /arvore` retorna apenas ativos, 3 níveis aninhados
6. Atualização do `categoriaPaiId` para `null` é permitida (remove o pai)

## 7. Validações

- Nome obrigatório (mínimo 1 caractere)
- Categoria pai deve existir e pertencer à mesma empresa
- Categoria pai não pode ser a própria categoria
- Paginação: página ≥ 1, limite ≤ 100
- `success: true/false` wrapper pattern (diferente do padrão dos outros módulos)

## 8. Integrações

| Módulo | Tipo | Descrição |
|---|---|---|
| Produtos | FK | Categoria usada na classificação de produtos |
| SPED Fiscal | Relatório | Categorias exportadas no Bloco 0 (parceiros) |
| Relatórios | Data Source | Fonte de dados para agrupamento |
