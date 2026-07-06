# Licitações — Especificação Técnica

## 1. Visão Geral

Módulo de gestão de processos licitatórios. Suporta os tipos: **Pregão**, **Concorrência**, **Convite** e **Tomada de Preços**. Controle de itens por licitação com produto, quantidade, valor unitário e marca. Ciclo de vida: Em Andamento → Ganha/Perdida/Cancelada.

## 2. Modelo de Dados (Prisma)

### Licitacao
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| empresaId | String | FK → Empresa |
| numero | String | Número único da licitação |
| orgao | String | Órgão público realizador |
| descricao | String | Descrição do objeto |
| tipo | String | PREGAO \| CONCORRENCIA \| CONVITE \| TOMADA_PRECOS |
| dataAbertura | DateTime | Data de abertura |
| dataEncerramento | DateTime? | Data de encerramento |
| valorEstimado | Float | Valor estimado |
| situacao | String | EM_ANDAMENTO \| GANHA \| PERDIDA \| CANCELADA (default: EM_ANDAMENTO) |
| observacoes | String? | |
| dataCriacao | DateTime | |
| dataAtualizacao | DateTime | |
| @@unique | | [empresaId, numero] |

### LicitacaoItem
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| licitacaoId | String | FK → Licitacao (cascade) |
| produtoId | String | FK → Produto |
| quantidade | Float | |
| valorUnitario | Float | |
| marca | String? | Marca do produto (opcional) |

## 3. API Endpoints

Base: `/api/v1/licitacoes` (autenticação JWT obrigatória)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/` | Cria licitação (com itens opcionais) |
| GET | `/` | Lista licitações (filtros: pagina, limite, situacao, tipo, search) |
| GET | `/:id` | Busca licitação por ID (com itens + produto) |
| PUT | `/:id` | Atualiza licitação (bloqueado se CANCELADA) |
| DELETE | `/:id` | Exclui licitação + itens (cascade) |
| POST | `/:id/itens` | Adiciona item à licitação |
| DELETE | `/:id/itens/:itemId` | Remove item da licitação |

### DTOs (Zod)

**criarLicitacaoSchema:**
```typescript
{
  numero: string
  orgao: string
  descricao: string
  tipo: 'PREGAO' | 'CONCORRENCIA' | 'CONVITE' | 'TOMADA_PRECOS'
  dataAbertura: z.coerce.date()
  dataEncerramento?: z.coerce.date()
  valorEstimado: number (positive)
  observacoes?: string
  itens?: { produtoId: string; quantidade: number; valorUnitario: number; marca?: string }[]
}
```

## 4. Frontend

**Página:** `LicitacoesPage.tsx` — rota `/licitacoes`

### Componentes
- **Campo busca:** Input com ícone Search, busca por número, órgão ou descrição
- **Tabela licitações:** Número, Órgão, Tipo (label traduzido), Data Abertura, Valor Estimado, Situação (badge colorido), Ações
- **Botões ação:** Itens (Package), Editar (Pencil), Excluir (Trash2)
- **Dialog formulário:** Número, Tipo (Select), Órgão, Descrição, Data Abertura/Encerramento, Valor Estimado, Observações
- **Seção Itens** (exibida abaixo da tabela quando "Itens" é clicado):
  - LookupField Produto + Quantidade + Valor Unitário + botão Adicionar
  - Tabela de itens com Produto, Qtd, Valor Unit., Total, Marca, botão Remover

### Service (`licitacoes.ts`)
```typescript
licitacoesService.listar(params?)                       // GET /licitacoes?search=...
licitacoesService.buscarPorId(id)                       // GET /licitacoes/:id
licitacoesService.criar(data)                           // POST /licitacoes
licitacoesService.atualizar(id, data)                   // PUT /licitacoes/:id
licitacoesService.excluir(id)                           // DELETE /licitacoes/:id
licitacoesService.adicionarItem(licitacaoId, data)      // POST /licitacoes/:id/itens
licitacoesService.removerItem(licitacaoId, itemId)      // DELETE /licitacoes/:id/itens/:itemId
```

## 5. Regras de Negócio

1. **Número único:** Valida unique composto `[empresaId, numero]` na criação
2. **Verificação de proprietário:** Todas as operações verificam `empresaId`
3. **Atualização bloqueada:** Se situacao = CANCELADA, não permite alteração
4. **Exclusão:** Remove itens primeiro (deleteMany) depois a licitação
5. **Itens:** Adicionados individualmente via endpoint específico; removidos individualmente
6. **Include produto:** Listagem e busca incluem itens com dados do produto (nome, codigoInterno)

## 6. Validações

- `empresaId` obrigatório (extraído do token)
- Retorno 401 se empresaId ausente
- Valida unique numero por empresa (erro: "Já existe uma licitação com este número")
- Zod schemas validam tipos, valores positivos, datas via coerce
- Tratamento de erro padrão com try/catch + mensagem
