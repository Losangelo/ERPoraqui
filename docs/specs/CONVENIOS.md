# Convênios — Especificação Técnica

## 1. Visão Geral

Módulo de gestão de convênios e parcerias com clientes (planos de saúde, odontológicos, seguros, etc.). Controle de ciclo de vida do convênio: Ativo → Suspenso → Encerrado, com filtros, busca e vinculação a cliente via LookupField.

## 2. Modelo de Dados (Prisma)

### Convenio
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| empresaId | String | FK → Empresa |
| clienteId | String | FK → Cliente |
| numero | String | Número único do convênio |
| descricao | String | Descrição/objeto do convênio |
| dataInicio | DateTime | Data de início |
| dataFim | DateTime? | Data de fim (opcional) |
| valorTotal | Float | Valor total do convênio |
| situacao | String | ATIVO \| SUSPENSO \| ENCERRADO (default: ATIVO) |
| observacoes | String? | Observações internas |
| dataCriacao | DateTime | |
| dataAtualizacao | DateTime | |
| @@unique | | [empresaId, numero] |

## 3. API Endpoints

Base: `/api/v1/convenios` (autenticação JWT obrigatória)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/` | Cria convênio (valida unique numero) |
| GET | `/` | Lista convênios (filtros: pagina, limite, situacao, clienteId, search) |
| GET | `/:id` | Busca convênio por ID |
| PUT | `/:id` | Atualiza convênio (bloqueado se ENCERRADO) |
| DELETE | `/:id` | Exclui convênio |
| POST | `/:id/ativar` | Reativa convênio suspenso |
| POST | `/:id/suspender` | Suspende convênio ativo |
| POST | `/:id/encerrar` | Encerra convênio |

### DTOs (Zod)

**criarConvenioSchema:**
```typescript
{
  clienteId: string
  numero: string
  descricao: string
  dataInicio: z.coerce.date()
  dataFim?: z.coerce.date()
  valorTotal: number (positive)
  observacoes?: string
}
```

**atualizarConvenioSchema:**
```typescript
{
  descricao?: string
  dataFim?: z.coerce.date()
  valorTotal?: number (positive)
  situacao?: 'ATIVO' | 'SUSPENSO' | 'ENCERRADO'
  observacoes?: string
}
```

## 4. Frontend

**Página:** `ConveniosPage.tsx` — rota `/convenios`

### Componentes
- **Campo busca:** Input com ícone Search, busca por número, descrição ou cliente
- **Tabela convênios:** Número, Cliente, Descrição, Data Início, Data Fim, Valor Total, Situação (badge colorido)
- **Botões ação:** Reativar (Play), Suspender (Pause), Encerrar (XCircle), Editar (Pencil), Excluir (Trash2)
- **Dialog formulário:** LookupField Cliente, Número, Valor Total, Descrição, Data Início/Fim, Observações

### Service (`convenios.ts`)
```typescript
conveniosService.listar(params?)              // GET /convenios?search=...
conveniosService.buscarPorId(id)              // GET /convenios/:id
conveniosService.criar(data)                  // POST /convenios
conveniosService.atualizar(id, data)          // PUT /convenios/:id
conveniosService.ativar(id)                   // POST /convenios/:id/ativar
conveniosService.suspender(id)                // POST /convenios/:id/suspender
conveniosService.encerrar(id)                 // POST /convenios/:id/encerrar
conveniosService.excluir(id)                  // DELETE /convenios/:id
```

## 5. Regras de Negócio

1. **Número único:** Valida unique composto `[empresaId, numero]` na criação
2. **Ciclo de vida:**
   - ATIVO → pode ser suspenso (suspender) ou encerrado (encerrar)
   - SUSPENSO → pode ser reativado (ativar) ou encerrado (encerrar)
   - ENCERRADO → não permite alteração (PUT bloqueado)
3. **Verificação de proprietário:** Todas as operações verificam `empresaId`
4. **Include cliente:** Listagem e busca incluem dados do cliente (nome, documento)

## 6. Validações

- `empresaId` extraído do token JWT (obrigatório)
- Retorno 401 se empresaId ausente
- Número duplicado → erro "Já existe um convênio com este número"
- Ativar apenas se situacao = SUSPENSO
- Suspender apenas se situacao = ATIVO
- Encerrar apenas se situacao ≠ ENCERRADO
- Zod schemas com `z.coerce.date()` para conversão automática de datas
