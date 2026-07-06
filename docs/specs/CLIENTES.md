# Especificação Técnica — Módulo Clientes

## 1. Visão Geral

Módulo responsável pelo cadastro de clientes (pessoa física e jurídica). Gerencia informações cadastrais, endereço, contato, limite de crédito e controle de ativação/inativação. Multi-empresa por design — todos os registros são vinculados a uma `empresaId`.

## 2. Data Model (Prisma Schema)

**Modelo:** `Cliente` — tabela `clientes`

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| id | String | PK, @default(cuid), @map("_id") | Identificador único |
| empresaId | String | FK → Empresa | Vínculo multi-empresa |
| nome | String | NOT NULL | Nome/Razão social |
| tipoPessoa | TipoPessoa | FISICA ou JURIDICA | Tipo de pessoa |
| documento | String | NOT NULL | CPF ou CNPJ |
| inscricaoEstadual | String? | | Inscrição estadual |
| inscricaoMunicipal | String? | | Inscrição municipal |
| telefone | String? | | Telefone fixo |
| telefoneCelular | String? | | Telefone celular |
| email | String? | | E-mail |
| endereco | Json? | | Objeto endereço {logradouro, numero, complemento, bairro, cidade, uf, cep} |
| dataNascimento | DateTime? | | Data de nascimento / fundação |
| limiteCredito | Float | @default(0) | Limite de crédito |
| ativo | Boolean | @default(true) | Status |
| dataCriacao | DateTime | @default(now()) | Auditoria |
| dataAtualizacao | DateTime | @updatedAt | Auditoria |

**Relacionamentos:**
- `empresa → Empresa` (obrigatório)
- `pedidosVenda → PedidoVenda[]`
- `orcamentos → Orcamento[]`
- `contasReceber → ContaReceber[]`
- `vendasPDV → VendaPDV[]`
- `notasFiscais → NotaFiscal[]`
- `notasServico → NotaServico[]`
- `cheques → Cheque[]`
- `contratos → Contrato[]`
- `garantias → Garantia[]`
- `devolucoes → Devolucao[]`
- `renegociacoes → Renegociacao[]`
- `ctesTomador/Remetente/Destinatario → Cte[]`
- `convenios → Convenio[]`
- `adiantamentos → Adiantamento[]`
- `quitacoes → Quitacao[]`

## 3. API Endpoints

**Base:** `/api/v1/clientes`
**Autenticação:** `authMiddleware` (JWT)
**Controle de licença:** `verificarLimiteRecurso('clientes')` no POST

| Método | Rota | Descrição | Controller | Query Params |
|---|---|---|---|---|
| POST | `/` | Criar cliente | `criar` | — |
| GET | `/` | Listar clientes | `listar` | nome, documento, tipoPessoa, ativo, pagina, limite |
| GET | `/:id` | Buscar por ID | `buscarPorId` | — |
| PUT | `/:id` | Atualizar cliente | `atualizar` | — |
| PATCH | `/:id/inativar` | Inativar cliente | `inativar` | — |
| PATCH | `/:id/ativar` | Reativar cliente | `ativar` | — |

### Padrão de Resposta (Listagem)

```json
{
  "dados": [ { ...cliente } ],
  "meta": { "pagina": 1, "limite": 20, "total": 100, "totalPaginas": 5 }
}
```

## 4. DTOs (Zod Schemas)

**`criarClienteSchema`:**
- `nome`: z.string().min(1).max(255) — obrigatório
- `tipoPessoa`: z.enum(['FISICA','JURIDICA'])
- `documento`: z.string().min(11).max(18)
- `inscricaoEstadual`: string opcional
- `inscricaoMunicipal`: string opcional
- `telefone`: string opcional
- `telefoneCelular`: string opcional
- `email`: z.string().email().optional()
- `logradouro`, `numero`, `complemento`, `bairro`, `cidade`, `uf` (length 2), `cep`: opcionais
- `dataNascimento`: string opcional
- `limiteCredito`: z.number().min(0).default(0)
- `ativo`: z.boolean().default(true)

**`atualizarClienteSchema`:** `criarClienteSchema.partial()`

**`clienteFiltroSchema`:**
- `nome`, `documento`, `tipoPessoa`, `ativo`: opcionais
- `pagina`: z.coerce.number().min(1).default(1)
- `limite`: z.coerce.number().min(1).max(500).default(20)

## 5. Frontend — CustomersPage

**Arquivo:** `apps/web/src/pages/customers/CustomersPage.tsx`
**Serviço:** `apps/web/src/services/clientes.ts`

### Componentes
- **Tabela:** Nome, Tipo (badge FISICA/JURIDICA), Documento, Email, Telefone, Status (Toggle), Ações (Editar)
- **Dialog de formulário:** Nome, Tipo (select), CPF/CNPJ, Email, Telefone, Celular, Limite de Crédito
- **Search:** Filtro por nome com debounce

### Service (`clientesService`)

| Método | Rota | Descrição |
|---|---|---|
| `listar(filtros)` | GET /clientes | Lista com filtros e paginação |
| `buscarPorId(id)` | GET /clientes/:id | Busca individual |
| `criar(dados)` | POST /clientes | Criação |
| `atualizar(id, dados)` | PUT /clientes/:id | Atualização |
| `inativar(id)` | PATCH /clientes/:id/inativar | Inativação |
| `ativar(id)` | PATCH /clientes/:id/ativar | Reativação |

### Interfaces TypeScript

`Cliente`, `CriarClienteDto`, `ClientesFiltros`, `ClientesResponse`

## 6. Regras de Negócio

1. Todo cliente pertence a **uma única empresa** (multi-tenant)
2. Cliente pode ser **Pessoa Física** (CPF) ou **Pessoa Jurídica** (CNPJ)
3. Limite de crédito **default 0** (sem limite)
4. Ao criar, não há verificação de duplicidade de documento (permite cadastros repetidos)
5. Inativação é **soft delete** — apenas marca `ativo = false`
6. Reativação só é possível se o registro existir e pertencer à empresa

## 7. Validações

- `empresaId` obrigatória em todas as operações (extraída do token JWT)
- Nome é obrigatório (mínimo 1 caractere)
- Documento mínimo 11 caracteres
- Email validado com formato `z.string().email()`
- UF deve ter exatamente 2 caracteres
- Limite de crédito não pode ser negativo
- Paginação: página mínima 1, limite máximo 500

## 8. Integrações

| Módulo | Tipo | Descrição |
|---|---|---|
| PedidosVenda | FK | Cliente como destinatário do pedido |
| Orçamentos | FK | Cliente como destinatário do orçamento |
| ContasReceber | FK | Cliente como devedor |
| PDV | FK | Cliente na venda PDV |
| NF-e / NFC-e / NFSe | FK | Cliente como tomador/destinatário |
| Cheques | FK | Cliente como emitente de cheque recebido |
| Contratos | FK | Cliente como contratante |
| Garantias | FK | Cliente como beneficiário |
| Devoluções | FK | Cliente como solicitante |
| Convênios | FK | Cliente vinculado |
| Adiantamentos | FK | Cliente como tomador |
| CT-e | FK | Cliente como tomador/remetente/destinatário |
| LookupField | UI | Fonte de dados para lookup de clientes |
