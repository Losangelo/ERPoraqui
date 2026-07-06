# Especificação Técnica — Módulo Fornecedores

## 1. Visão Geral

Módulo responsável pelo cadastro de fornecedores. Gerencia informações cadastrais, endereço completo e controle de ativação/inativação. Endereço é tratado como objeto JSON embedado. Multi-empresa por design.

## 2. Data Model (Prisma Schema)

**Modelo:** `Fornecedor` — tabela `fornecedores`

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
| endereco | Json? | | Objeto {logradouro, numero, complemento, bairro, cidade, uf, cep} |
| ativo | Boolean | @default(true) | Status |
| dataCriacao | DateTime | @default(now()) | Auditoria |
| dataAtualizacao | DateTime | @updatedAt | Auditoria |

**Relacionamentos:**
- `empresa → Empresa`
- `pedidosCompra → PedidoCompra[]`
- `respostasCotacao → RespostaCotacao[]`
- `contasPagar → ContaPagar[]`
- `notasFiscais → NotaFiscal[]` (entrada)
- `cheques → Cheque[]`
- `renegociacoes → Renegociacao[]`
- `adiantamentos → Adiantamento[]`
- `quitacoes → Quitacao[]`

## 3. API Endpoints

**Base:** `/api/v1/fornecedores`
**Autenticação:** `authMiddleware` (JWT)

| Método | Rota | Descrição | Controller |
|---|---|---|---|
| POST | `/` | Criar fornecedor | `criar` |
| GET | `/` | Listar fornecedores | `listar` |
| GET | `/:id` | Buscar por ID | `buscarPorId` |
| PUT | `/:id` | Atualizar fornecedor | `atualizar` |
| PATCH | `/:id/inativar` | Inativar | `inativar` |
| PATCH | `/:id/ativar` | Reativar | `ativar` |

### Query Params (GET /)
- `nome`, `documento`, `tipoPessoa`, `ativo`
- `pagina` (default 1), `limite` (default 20, max 500)

### Padrão de Resposta

```json
{
  "dados": [ { ...fornecedor } ],
  "meta": { "pagina": 1, "limite": 20, "total": 100, "totalPaginas": 5 }
}
```

## 4. DTOs (Zod Schemas)

**`criarFornecedorSchema`:**
- `nome`: z.string().min(1).max(255) — obrigatório
- `tipoPessoa`: z.enum(['FISICA','JURIDICA'])
- `documento`: z.string().min(1)
- `inscricaoEstadual`, `inscricaoMunicipal`: opcionais
- `telefone`, `telefoneCelular`: opcionais
- `email`: z.string().email().optional().or(z.literal(''))
- `logradouro`, `numero`, `complemento`, `bairro`, `cidade`, `uf` (length 2), `cep`: opcionais
- `ativo`: z.boolean().default(true)

**`atualizarFornecedorSchema`:** `criarFornecedorSchema.partial()`

**`fornecedorFiltroSchema`:** equivalente ao de clientes

## 5. Frontend — SuppliersPage

**Arquivo:** `apps/web/src/pages/suppliers/SuppliersPage.tsx`
**Serviço:** `apps/web/src/services/fornecedores.ts`

### Componentes
- **Tabela:** Nome, Tipo (badge), Documento, Email, Telefone, Cidade/UF, Status (Toggle), Ações (Editar)
- **Dialog formulário completo:** Nome/Razão, Tipo, CPF/CNPJ, IE, IM, Email, Telefone, Celular + bloco Endereço (Logradouro, Número, Complemento, Bairro, CEP, Cidade, UF)
- **Search:** Filtro por nome

### Service (`fornecedoresService`)

| Método | Rota |
|---|---|
| `listar(filtros)` | GET /fornecedores |
| `buscarPorId(id)` | GET /fornecedores/:id |
| `criar(dados)` | POST /fornecedores |
| `atualizar(id, dados)` | PUT /fornecedores/:id |
| `inativar(id)` | PATCH /fornecedores/:id/inativar |
| `ativar(id)` | PATCH /fornecedores/:id/ativar |

## 6. Regras de Negócio

1. **Endereço como JSON embedado** — campos `logradouro..cep` são salvos em um único campo `endereco` (Json) no banco, mas expostos como campos planos na API
2. Email aceita string vazia (`z.literal('')`) além de email válido
3. Permite documento duplicado entre fornecedores
4. Soft delete via `ativo = false`
5. Fornecedor pode ser referenciado por múltiplos módulos (compras, financeiro, fiscal)

## 7. Validações

- `empresaId` obrigatória (do token JWT)
- Nome obrigatório
- Documento obrigatório
- Email validado ou vazio
- UF deve ter 2 caracteres
- Paginação: página ≥ 1, limite 1..500

## 8. Integrações

| Módulo | Tipo | Descrição |
|---|---|---|
| PedidosCompra | FK | Fornecedor como vendedor |
| Cotações | FK | Respostas de cotação por fornecedor |
| ContasPagar | FK | Fornecedor como credor |
| NF-e (Entrada) | FK | Fornecedor como emitente |
| Cheques | FK | Fornecedor como beneficiário |
| Adiantamentos | FK | Fornecedor como favorecido |
| Renegociações | FK | Fornecedor vinculado |
| LookupField | UI | Fonte de dados para lookup |
