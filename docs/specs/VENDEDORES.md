# Especificação Técnica — Módulo Vendedores

## 1. Visão Geral

Módulo responsável pelo cadastro de vendedores/representantes comerciais. Gerencia informações pessoais, documento (CPF/CNPJ), percentual de comissão e controle de ativação. Utilizado em pedidos de venda, orçamentos e PDV. Multi-empresa por design.

## 2. Data Model (Prisma Schema)

**Modelo:** `Vendedor` — tabela `vendedores`

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| id | String | PK, @default(cuid), @map("_id") | Identificador único |
| empresaId | String | FK → Empresa | Vínculo multi-empresa |
| nome | String | NOT NULL | Nome do vendedor |
| tipoPessoa | TipoPessoa | FISICA ou JURIDICA | Tipo de pessoa |
| documento | String | NOT NULL | CPF ou CNPJ |
| inscricaoEstadual | String? | | Inscrição estadual |
| telefone | String? | | Telefone |
| telefoneCelular | String? | | Celular |
| email | String? | | E-mail |
| comissao | Float | @default(0) | Percentual de comissão (%) |
| ativo | Boolean | @default(true) | Status |
| dataCriacao | DateTime | @default(now()) | Auditoria |
| dataAtualizacao | DateTime | @updatedAt | Auditoria |

**Relacionamentos:**
- `empresa → Empresa`

## 3. API Endpoints

**Base:** `/api/v1/vendedores`
**Autenticação:** `authMiddleware` (JWT)

| Método | Rota | Descrição | Controller |
|---|---|---|---|
| POST | `/` | Criar vendedor | `criar` |
| GET | `/` | Listar vendedores | `listar` |
| GET | `/:id` | Buscar por ID | `buscarPorId` |
| PUT | `/:id` | Atualizar vendedor | `atualizar` |
| PATCH | `/:id/inativar` | Inativar | `inativar` |
| PATCH | `/:id/ativar` | Reativar | `ativar` |

### Query Params (GET /)
- `nome`, `documento`, `tipoPessoa`, `ativo`
- `pagina` (default 1), `limite` (default 20)

### Padrão de Resposta

```json
{
  "dados": [ { ...vendedor } ],
  "meta": { "pagina": 1, "limite": 20, "total": 5, "totalPaginas": 1 }
}
```

## 4. DTOs (Zod Schemas)

**`criarVendedorSchema`:**
- `nome`: z.string().min(1) — obrigatório
- `tipoPessoa`: z.enum(['FISICA','JURIDICA'])
- `documento`: z.string().min(1) — obrigatório
- `inscricaoEstadual`: string opcional
- `telefone`, `telefoneCelular`: opcionais
- `email`: z.string().email().optional()
- `comissao`: z.number().min(0).max(100).default(0)

**`atualizarVendedorSchema`:** `criarVendedorSchema.partial()`

**`vendedorFiltroSchema`:**
- `nome`, `documento`, `tipoPessoa`, `ativo`: opcionais
- `pagina`: z.number().default(1)
- `limite`: z.number().default(20)

## 5. Frontend — VendedoresPage

**Arquivo:** `apps/web/src/pages/vendedores/VendedoresPage.tsx`
**Serviço:** `apps/web/src/services/vendedores.ts`

### Componentes
- **Tabela:** Nome (com avatar User), CPF, Telefone, Email, Comissão (%), Status (badge), Ações (Editar, Excluir)
- **Dialog formulário:** Nome, CPF, Telefone, Email, Comissão (%), checkbox Ativo
- **Loading:** Spinner customizado

### Service (`vendedoresService`)

| Método | Rota |
|---|---|
| `listar(params?)` | GET /vendedores |
| `criar(data)` | POST /vendedores |
| `buscar(id)` | GET /vendedores/:id |
| `atualizar(id, data)` | PUT /vendedores/:id |
| `excluir(id)` | DELETE /vendedores/:id |

> Nota: O frontend espera resposta no formato `{ success: true, data: [...] }` ao listar.

## 6. Regras de Negócio

1. Comissão é um **percentual** entre 0 e 100
2. Vendedor pode ser PF (CPF) ou PJ (CNPJ)
3. Documento não possui validação de unicidade (permite duplicatas)
4. Soft delete via `ativo = false`
5. Exclusão física via DELETE (não há bloqueio por vinculação)
6. Frontend usa `res.data.data` para acessar a lista (padrão `{ success, data }`)

## 7. Validações

- Nome obrigatório
- Documento obrigatório
- Email validado com formato
- Comissão entre 0 e 100
- Paginação com valores default

## 8. Integrações

| Módulo | Tipo | Descrição |
|---|---|---|
| PedidosVenda | Referência | Vendedor associado ao pedido |
| Orçamentos | Referência | Vendedor associado ao orçamento |
| PDV | Referência | Vendedor associado à venda |
| Relatórios | Data Source | Fonte para relatórios de comissão |
| LookupField | UI | Fonte para lookup de vendedores |
