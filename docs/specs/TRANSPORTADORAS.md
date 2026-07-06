# Especificação Técnica — Módulo Transportadoras

## 1. Visão Geral

Módulo responsável pelo cadastro de transportadoras/empresas de transporte. Gerencia informações cadastrais, endereço (JSON embedado) e controle de ativação. Utilizado em notas fiscais (NF-e, NFC-e), CT-e e MDF-e. Multi-empresa por design.

## 2. Data Model (Prisma Schema)

**Modelo:** `Transportadora` — tabela `transportadoras`

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| id | String | PK, @default(cuid), @map("_id") | Identificador único |
| empresaId | String | FK → Empresa | Vínculo multi-empresa |
| nome | String | NOT NULL | Nome ou Razão Social |
| tipoPessoa | TipoPessoa | FISICA ou JURIDICA | Tipo de pessoa |
| documento | String | NOT NULL | CPF ou CNPJ |
| inscricaoEstadual | String? | | Inscrição estadual |
| inscricaoMunicipal | String? | | Inscrição municipal |
| telefone | String? | | Telefone |
| telefoneCelular | String? | | Celular |
| email | String? | | E-mail |
| endereco | Json? | | Objeto {logradouro, numero, complemento, bairro, cidade, uf, cep} |
| ativo | Boolean | @default(true) | Status |
| dataCriacao | DateTime | @default(now()) | Auditoria |
| dataAtualizacao | DateTime | @updatedAt | Auditoria |

**Relacionamentos:**
- `empresa → Empresa`

## 3. API Endpoints

**Base:** `/api/v1/transportadoras`
**Autenticação:** `authMiddleware` (JWT)

| Método | Rota | Descrição | Controller |
|---|---|---|---|
| POST | `/` | Criar transportadora | `criar` |
| GET | `/` | Listar transportadoras | `listar` |
| GET | `/:id` | Buscar por ID | `buscarPorId` |
| PUT | `/:id` | Atualizar transportadora | `atualizar` |
| PATCH | `/:id/inativar` | Inativar | `inativar` |
| PATCH | `/:id/ativar` | Reativar | `ativar` |

### Query Params (GET /)
- `nome`, `documento`, `tipoPessoa`, `ativo`
- `pagina` (default 1), `limite` (default 20)

### Padrão de Resposta

```json
{
  "dados": [ { ...transportadora } ],
  "meta": { "pagina": 1, "limite": 20, "total": 3, "totalPaginas": 1 }
}
```

## 4. DTOs (Zod Schemas)

**`criarTransportadoraSchema`:**
- `nome`: z.string().min(1) — obrigatório
- `tipoPessoa`: z.enum(['FISICA','JURIDICA'])
- `documento`: z.string().min(1) — obrigatório
- `inscricaoEstadual`, `inscricaoMunicipal`: opcionais
- `telefone`, `telefoneCelular`: opcionais
- `email`: z.string().email().optional()
- `logradouro`, `numero`, `complemento`, `bairro`, `cidade`, `uf` (length 2), `cep`: opcionais

> Nota: Diferente de clientes/fornecedores, transportadora **não** possui campo `ativo` no DTO de criação (o Prisma usa default `true`).

**`atualizarTransportadoraSchema`:** `criarTransportadoraSchema.partial()`

**`transportadoraFiltroSchema`:**
- `nome`, `documento`, `tipoPessoa`, `ativo`: opcionais
- `pagina`: z.number().default(1)
- `limite`: z.number().default(20)

## 5. Frontend — TransportadorasPage

**Arquivo:** `apps/web/src/pages/transportadoras/TransportadorasPage.tsx`
**Serviço:** `apps/web/src/services/transportadoras.ts`

### Componentes
- **Tabela:** Nome (com avatar Truck), CNPJ, Telefone, Email, Status (badge), Ações (Editar, Excluir)
- **Dialog formulário:** Nome, CNPJ, Telefone, Email, checkbox Ativo
- **Loading:** Spinner customizado

### Service (`transportadorasService`)

| Método | Rota |
|---|---|
| `listar(params?)` | GET /transportadoras |
| `criar(data)` | POST /transportadoras |
| `buscar(id)` | GET /transportadoras/:id |
| `atualizar(id, data)` | PUT /transportadoras/:id |
| `excluir(id)` | DELETE /transportadoras/:id |

> Nota: O frontend espera resposta no formato `{ success: true, data: [...] }` ao listar.

## 6. Regras de Negócio

1. **Endereço como JSON embedado** — mesmo padrão de Fornecedores (campos planos viram objeto `endereco`)
2. Documento não possui validação de unicidade
3. Soft delete via `ativo = false`
4. Exclusão física via DELETE disponível (sem verificação de vínculo)
5. Frontend usa `res.data.data` para acesso à lista
6. Não há controle de licença (`verificarLimiteRecurso`) no POST

## 7. Validações

- Nome obrigatório
- Documento obrigatório
- Email validado com formato
- UF deve ter 2 caracteres
- Paginação com valores default

## 8. Integrações

| Módulo | Tipo | Descrição |
|---|---|---|
| NF-e / NFC-e | Referência | Transportadora no frete da nota fiscal |
| CT-e | FK | Transportadora como prestador do serviço |
| MDF-e | Referência | Transportadora no manifesto |
| LookupField | UI | Fonte para lookup de transportadoras |
| Relatórios | Data Source | Fonte para relatórios fiscais |
