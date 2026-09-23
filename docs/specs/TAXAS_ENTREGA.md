# Taxas de Entrega — Especificação Técnica

## 1. Visão Geral

Módulo de configuração e cálculo de taxas de entrega. Suporta múltiplos tipos de taxa: fixa, por km, por faixa de CEP e por valor do pedido. O cálculo automático seleciona a taxa mais adequada com base no CEP e valor do pedido.

**Objetivos:**
- Configurar taxas de entrega com diferentes critérios
- Calcular automaticamente o frete com base no CEP de destino
- Validar valor mínimo do pedido para frete grátis ou taxa reduzida
- Suportar múltiplas regras simultâneas

---

## 2. Modelo de Dados

### 2.1 TaxaEntrega

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| empresaId | String | FK → Empresa |
| descricao | String | Nome/descrição da taxa |
| tipo | TipoTaxaEntrega | FIXA, POR_KM, POR_CEP, POR_VALOR |
| valor | Float | Valor da taxa em R$ |
| raioKm | Float? | Raio em km (para tipo POR_KM) |
| cepInicio | String? | Início da faixa de CEP (para tipo POR_CEP) |
| cepFim | String? | Fim da faixa de CEP (para tipo POR_CEP) |
| valorMinimoPedido | Float? | Valor mínimo do pedido para aplicar esta taxa |
| ativo | Boolean | Default true |
| dataCriacao | DateTime | |
| dataAtualizacao | DateTime | |

**Enums:**
```prisma
enum TipoTaxaEntrega {
  FIXA
  POR_KM
  POR_CEP
  POR_VALOR
}
```

---

## 3. Endpoints da API

Base: `/api/v1/taxas-entrega` — autenticado via JWT.

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | / | Criar taxa |
| GET | / | Listar taxas (filtros: descricao, tipo, ativo, pagina, limite) |
| GET | /:id | Buscar por ID |
| PUT | /:id | Atualizar dados |
| PATCH | /:id/inativar | Inativar taxa |
| PATCH | /:id/ativar | Reativar taxa |
| POST | /calcular | Calcular frete para CEP + valor |

### Schema de Criação (Zod)

```ts
criarTaxaEntregaSchema = z.object({
  descricao: z.string().min(1),
  tipo: z.enum(['FIXA','POR_KM','POR_CEP','POR_VALOR']).default('FIXA'),
  valor: z.number().min(0),
  raioKm: z.number().positive().optional(),
  cepInicio: z.string().optional(),
  cepFim: z.string().optional(),
  valorMinimoPedido: z.number().positive().optional(),
})
```

### Schema de Cálculo

```ts
calcularTaxaSchema = z.object({
  cep: z.string().optional(),
  valorPedido: z.number().min(0),
})
```

### Algoritmo de Cálculo

1. Carrega todas as taxas ativas da empresa, ordenadas por valor (crescente)
2. Se CEP informado, busca taxa do tipo POR_CEP que cubra a faixa:
   - Converte CEPs para numérico (remove não-dígitos)
   - Verifica se `cepInicioNum <= cepNum <= cepFimNum`
3. Se encontrou taxa por CEP, usa esta; senão usa taxa FIXA como fallback
4. Verifica `valorMinimoPedido` — se valor do pedido for menor, retorna erro
5. Retorna `{ taxaId, valor, descricao }`

---

## 4. Frontend

**Localização:** `apps/web/src/pages/entregas/TaxasEntregaPage.tsx`

- Tabela com descrição, tipo, valor, faixa (se aplicável), valor mínimo, situação
- Dialog de criação/edição com:
  - Select para tipo de taxa (FIXA, POR_KM, POR_CEP, POR_VALOR)
  - Campos condicionais: raioKm (POR_KM), cepInicio/cepFim (POR_CEP)
  - Input para valor mínimo do pedido
- Botões de inativar/reativar
- Indicador visual de taxa ativa/inativa

---

## 5. Regras de Negócio

- Taxa inativada não entra no cálculo de frete
- Apenas uma taxa é aplicada por entrega (prioridade: POR_CEP > FIXA)
- Se houver múltiplas taxas POR_CEP que cobrem o mesmo CEP, a de menor valor é usada
- Valor mínimo do pedido é opcional — se não informado, não há restrição
- A exclusão não é física — utiliza inativação lógica
