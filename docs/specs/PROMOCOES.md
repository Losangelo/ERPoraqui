# Promoções — Especificação Técnica

## 1. Visão Geral

Engine promocional para aplicação de descontos em produtos. Suporta três tipos de desconto: **Percentual** (%), **Valor Fixo** (R$) e **Leve X Pague Y** (quantidade mínima e quantidade a cobrar). Promoções podem ser aplicadas a todos os produtos ou a produtos selecionados, com controle por período de vigência.

## 2. Modelo de Dados (Prisma)

### Promocao
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| empresaId | String | FK → Empresa |
| nome | String | Nome da promoção |
| descricao | String? | Descrição detalhada |
| tipoDesconto | String | PERCENTUAL \| VALOR_FIXO \| LEVE_PAGUE |
| valorDesconto | Float | Valor do desconto (percentual ou fixo) |
| qtdMinima | Int? | Qtd mínima para LEVE_PAGUE |
| qtdCobrar | Int? | Qtd a cobrar para LEVE_PAGUE |
| dataInicio | DateTime | Início da vigência |
| dataFim | DateTime | Fim da vigência |
| ativo | Boolean | |
| aplicaProdutos | String | TODOS \| SELECIONADOS |
| dataCriacao | DateTime | |
| dataAtualizacao | DateTime | |

### PromocaoItem
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| promocaoId | String | FK → Promocao (cascade) |
| produtoId | String | FK → Produto |
| precoPromocional | Float? | Preço promocional específico (opcional) |
| @@unique | | [promocaoId, produtoId] |

## 3. API Endpoints

Base: `/api/v1/promocoes` (autenticação JWT obrigatória)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/` | Cria promoção (valida LEVE_PAGUE e datas) |
| GET | `/` | Lista promoções (filtros: nome, tipoDesconto, ativo, pagina, limite) |
| GET | `/:id` | Busca promoção por ID |
| PUT | `/:id` | Atualiza promoção (substitui itens se enviado) |
| DELETE | `/:id` | Exclui promoção |
| PATCH | `/:id/toggle-ativo` | Alterna ativo/inativo |
| GET | `/calcular-preco/:produtoId` | Calcula preço promocional para produto |

### DTOs (Zod)

**criarPromocaoSchema:**
```typescript
{
  nome?: string
  descricao?: string
  tipoDesconto: 'PERCENTUAL' | 'VALOR_FIXO' | 'LEVE_PAGUE'  (default: PERCENTUAL)
  valorDesconto: number (min: 0, default: 0)
  qtdMinima?: number (int, positive)
  qtdCobrar?: number (int, positive)
  dataInicio: string (datetime ISO ou formato livre)
  dataFim: string (datetime ISO ou formato livre)
  ativo: boolean (default: true)
  aplicaProdutos: 'TODOS' | 'SELECIONADOS' (default: TODOS)
  itens?: { produtoId: string, precoPromocional?: number }[]
}
```
**Refinements:**
- LEVE_PAGUE: qtdMinima e qtdCobrar obrigatórios, qtdCobrar <= qtdMinima
- dataFim deve ser > dataInicio

## 4. Frontend

**Página:** `PromocoesPage.tsx` — rota `/promocoes`

### Componentes
- **Campo busca:** Input com ícone Search + botão Buscar
- **Tabela promoções:** Nome, Tipo (badge), Valor, Período, Abrangência, Status (ativo/inativo), Ações
- **Botões ação:** Editar, Toggle ativo (PowerOff/Power), Excluir
- **Dialog formulário:** Nome, Descrição, Tipo Desconto (Select), Valor Desconto, Qtd Minima e Qtd Cobrar (condicional LEVE_PAGUE), Data Início/Fim (datetime-local), Abrangência (Select TODOS/SELECIONADOS), Status
- **LookupField** para selecionar produtos quando abrangência = SELECIONADOS
- **Tabela de produtos selecionados** com campo de preço promocional

### Service (`promocoes.ts`)
```typescript
promocoesService.listar(filtros?)            // GET /promocoes
promocoesService.buscarPorId(id)             // GET /promocoes/:id
promocoesService.criar(data)                 // POST /promocoes
promocoesService.atualizar(id, data)         // PUT /promocoes/:id
promocoesService.excluir(id)                 // DELETE /promocoes/:id
promocoesService.toggleAtivo(id)             // PATCH /promocoes/:id/toggle-ativo
promocoesService.calcularPrecoPromocional(produtoId) // GET /promocoes/calcular-preco/:produtoId
```

## 5. Regras de Negócio

1. **Verificação de proprietário:** Toda operação em promoção existente verifica `empresaId`
2. **LEVE_PAGUE:** Exige `qtdMinima` e `qtdCobrar` (qtdCobrar ≤ qtdMinima) validado via Zod refinement
3. **Período:** dataFim deve ser posterior a dataInicio
4. **Cálculo preço promocional:** Busca promoção ativa mais recente cujo período englobe a data atual:
   - Se item tem `precoPromocional` → retorna esse valor
   - Se PERCENTUAL → `precoVenda * (1 - valorDesconto / 100)`
   - Se VALOR_FIXO → `max(0, precoVenda - valorDesconto)`
5. **Atualização:** Remove e recria itens se array `itens` for enviado
6. **Paginação:** Retorna meta com total, pagina, limite, totalPaginas

## 6. Validações

- `empresaId` obrigatório em todas as operações
- Datas convertidas para Date no service
- Nome default: "Promoção {data}" se vazio
- Valor desconto valida min 0 via Zod
- Zod schema valida tipos e refinamentos antes do service
