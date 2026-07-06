# Módulo Dashboard Gerencial

## Visão Geral

Dashboard executivo com indicadores-chave (KPIs), gráficos de vendas, receitas/despesas, status de pedidos, distribuição de estoque por categoria e produtos mais vendidos. Consulta dados em tempo real do banco PostgreSQL via Prisma.

## Stack
- Backend: Express.js + TypeScript + Prisma
- Frontend: React + shadcn/ui + Lucide icons + CSS puro (barras, gráficos)

---

## Endpoints da API

Base: `/api/v1/dashboard` — todos protegidos por `authMiddleware`.

### `GET /api/v1/dashboard`

Dashboard completo com todas as métricas.

**Response:**
```json
{
  "success": true,
  "data": {
    "cadastros": {
      "clientes": 150,
      "fornecedores": 30,
      "produtos": 1200,
      "vendedores": 8
    },
    "vendas": {
      "mes": { "quantidade": 45, "valor": 85000.00 }
    },
    "compras": {
      "mes": { "quantidade": 12, "valor": 32000.00 }
    },
    "financeiro": {
      "receber": { "quantidade": 60, "valor": 95000.00 },
      "pagar": { "quantidade": 25, "valor": 41000.00 },
      "saldoProjecao": 54000.00
    },
    "estoque": {
      "valorTotal": 125000.00
    }
  }
}
```

**Métricas calculadas:**
- `cadastros.*`: Contagem direta no banco (where ativo = true)
- `vendas.mes`: PedidosVenda do mês corrente (soma valorTotal)
- `compras.mes`: PedidosCompra do mês corrente (soma valorTotal)
- `financeiro.receber`: ContasReceber abertas/vencidas (soma valorOriginal)
- `financeiro.pagar`: ContasPagar abertas/vencidas (soma valorOriginal)
- `saldoProjecao`: totalReceber - totalPagar
- `estoque.valorTotal`: Soma de quantidadeEstoque de todos os produtos ativos

### `GET /api/v1/dashboard/indicadores`

Indicadores rápidos do dia atual.

**Response:**
```json
{
  "success": true,
  "data": {
    "vendasDia": { "quantidade": 5, "valor": 12000.00 },
    "pedidosDia": 5,
    "estoque": { "abaixoMinimo": 15, "estoqueZero": 3 }
  }
}
```

### `GET /api/v1/dashboard/grafico/vendas?periodo=30dias`

Vendas agrupadas por dia.

**Periodicidade:** `7dias`, `30dias`, `90dias`, `ano`

**Response:**
```json
{
  "success": true,
  "data": [
    { "data": "2026-07-01", "valor": 2500.00 },
    { "data": "2026-07-02", "valor": 3800.00 }
  ]
}
```

### `GET /api/v1/dashboard/grafico/vendas-dia-semana`

Vendas por dia da semana (últimos 30 dias).

**Response:**
```json
{
  "success": true,
  "data": [
    { "dia": "Segunda", "valor": 15000.00 },
    { "dia": "Terça", "valor": 12000.00 }
  ]
}
```

### `GET /api/v1/dashboard/grafico/receitas-despesas?periodo=30dias`

Receitas (contas a receber) vs Despesas (contas a pagar) por data de vencimento.

### `GET /api/v1/dashboard/grafico/status-pedidos`

Distribuição dos pedidos por situação.

**Response:**
```json
{
  "success": true,
  "data": [
    { "status": "EM_ABERTO", "quantidade": 20 },
    { "status": "CONFIRMADO", "quantidade": 15 }
  ]
}
```

### `GET /api/v1/dashboard/grafico/estoque-categoria`

Quantidade em estoque agrupada por categoria (top 10).

### `GET /api/v1/dashboard/grafico/mais-vendidos?limite=10`

Produtos mais vendidos por valor total nos últimos 30 dias.

**Response:**
```json
{
  "success": true,
  "data": [
    { "nome": "Produto A", "codigo": "P001", "quantidade": 50, "valor": 25000.00 }
  ]
}
```

---

## Frontend

### DashboardPage (`apps/web/src/pages/DashboardPage.tsx`)

**Funcionalidades:**
- 4 cards de KPI: Vendas do Mês, Clientes, Produtos, Receber (com ícones e cores)
- Gráfico de barras: Vendas dos últimos 30 dias (15 dias visíveis, barras proporcionais)
- Gráfico de barras horizontais: Estoque por Categoria (top 6, com percentual)
- Card de Status dos Pedidos (bolinhas coloridas: verde=APROVADO, amarelo=PENDENTE, vermelho=CANCELADO)
- Card Financeiro: Contas a Receber (verde), Contas a Pagar (vermelho), Saldo Projetado
- Card Alertas: Estoque Baixo, Contas Vencidas

### Service (`apps/web/src/services/dashboard.ts`)

```typescript
export const dashboardService = {
  getDashboard: () => api.get('/dashboard'),
  getIndicadores: () => api.get('/dashboard/indicadores'),
  getGraficoVendas: (periodo = '30dias') => api.get(`/dashboard/grafico/vendas?periodo=${periodo}`),
  getGraficoVendasDiaSemana: () => api.get('/dashboard/grafico/vendas-dia-semana'),
  getGraficoReceitasDespesas: (periodo = '30dias') => api.get(`/dashboard/grafico/receitas-despesas?periodo=${periodo}`),
  getGraficoStatusPedidos: () => api.get('/dashboard/grafico/status-pedidos'),
  getGraficoEstoqueCategoria: () => api.get('/dashboard/grafico/estoque-categoria'),
  getGraficoMaisVendidos: (limite = 10) => api.get(`/dashboard/grafico/mais-vendidos?limite=${limite}`),
};
```

---

## Regras de Negócio

1. **Período do mês**: Dashboard completo sempre calcula vendas/compras do mês corrente (início mês até agora)
2. **Indicadores do dia**: Usa `setHours(0,0,0,0)` para filtrar o dia atual
3. **Agrupamento**: Vendas agrupadas por dia usando `dataCriacao.toISOString().split('T')[0]`
4. **Financeiro**: Contas a receber/pagar consideram apenas situações ABERTA e VENCIDO
5. **Estoque por categoria**: Produtos sem categoria agrupados como "Sem Categoria"
6. **Mais vendidos**: Calculado com base nos itens dos pedidos de venda dos últimos 30 dias
7. **Multi-tenancy**: Todos os dados filtrados por empresaId
8. **Gráficos**: Renderizados sem biblioteca externa (CSS puro para barras proporcionais)
