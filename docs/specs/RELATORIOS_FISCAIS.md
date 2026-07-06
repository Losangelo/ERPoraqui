# Relatórios Fiscais — Especificação Técnica

## 1. Visão Geral

Módulo de geração de relatórios contábeis e fiscais: resumo de notas fiscais, resumo de impostos (entradas/vendas/compras), SPED Fiscal (layout arquitetura registro 0000 + C100) e SPED Contribuições (apuração PIS/COFINS). Relatórios filtrados por período (data inicial/final).

## 2. Modelo de Dados (Prisma)

O módulo **não possui modelos próprios**. Utiliza dados dos modelos existentes:

| Modelo | Uso |
|--------|-----|
| EntradaMercadoria | Resumo de notas e SPED Fiscal (bloco C100) |
| PedidoVenda | Resumo de impostos (vendas) e SPED Contribuições |
| PedidoCompra | Resumo de impostos (compras) e SPED Contribuições |
| Empresa | Dados do emitente (CNPJ, razão social) |

### RelatorioFiscalFiltro (Zod DTO)
```typescript
{
  tipo?: 'SPED_FISCAL' | 'SPED_CONTRIBUICOES' | 'RESUMO_NOTAS' | 'RESUMO_IMPOSTOS'
  dataInicial?: string
  dataFinal?: string
  pagina: number  (default: 1)
  limite: number  (default: 20, max: 100)
}
```

## 3. API Endpoints

Base: `/api/v1/relatorios-fiscais` (autenticação JWT obrigatória)

| Método | Rota | Query Params | Descrição |
|--------|------|-------------|-----------|
| GET | `/resumo-notas` | dataInicial, dataFinal | Total de notas fiscais no período + lista |
| GET | `/resumo-impostos` | dataInicial, dataFinal | Totais de entradas, vendas e compras |
| GET | `/sped-fiscal` | dataInicial, dataFinal | Registros SPED Fiscal (0000 + C100) |
| GET | `/sped-contribuicoes` | dataInicial, dataFinal | Apuração PIS (0,65%) e COFINS (3%) |

### Respostas Padrão

**Sucesso:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Erro:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED" | "VALIDATION_ERROR" | "ERROR",
    "message": "..."
  }
}
```

### Estrutura de Retorno

**resumoNotas:**
```json
{
  "periodo": { "dataInicial": "2026-01-01", "dataFinal": "2026-01-31" },
  "totalNotas": 42,
  "valorTotal": 150000.00,
  "notas": [
    { "id": "...", "numero": "123", "serie": "1", "dataEmissao": "...", "valorTotal": 5000.00 }
  ]
}
```

**resumoImpostos:**
```json
{
  "periodo": { ... },
  "entradas": { "quantidade": 30, "valorTotal": 100000.00 },
  "vendas": { "quantidade": 50, "valorTotal": 200000.00 },
  "compras": { "quantidade": 20, "valorTotal": 80000.00 }
}
```

**spedFiscal:**
```json
{
  "cnpj": "11222333000181",
  "nome": "Empresa Ltda",
  "periodo": { ... },
  "registros": ["0000|0|11222333000181|...|", "C100|0|0|1|123|...|"]
}
```

**spedContribuicoes:**
```json
{
  "cnpj": "...",
  "nome": "...",
  "periodo": { ... },
  "totalVendas": 200000.00,
  "totalCompras": 80000.00,
  "basePis": 200000.00,
  "baseCofins": 200000.00,
  "pis": 1300.00,
  "cofins": 6000.00
}
```

## 4. Frontend

**Página:** `RelatoriosFiscaisPage.tsx` — rota `/relatorios-fiscais`

### Componentes
- **Select tipo relatório:** Resumo de Notas, Resumo de Impostos, SPED Fiscal, SPED Contribuições
- **Inputs data:** Data inicial e final (type="date")
- **Botão Gerar:** Executa relatório com loading spinner
- **Botão Exportar:** `ExportButton` reutilizável para CSV/XLSX/PDF
- **Cards resultado:** Renderização condicional por tipo de relatório:
  - Resumo Notas: cards totalNotas + valorTotal + tabela detalhada
  - Resumo Impostos: 3 cards (Entradas/Vendas/Compras) com valor e quantidade
  - SPED Fiscal: dados empresa + pre container com registros
  - SPED Contribuições: dados empresa + cards Vendas/Compras + cards PIS/COFINS

### Service (`financeiro.ts` → `relatoriosService`)
```typescript
relatoriosService.resumoNotas(dataInicial, dataFinal)           // GET /relatorios-fiscais/resumo-notas
relatoriosService.resumoImpostos(dataInicial, dataFinal)         // GET /relatorios-fiscais/resumo-impostos
relatoriosService.spedFiscal(dataInicial, dataFinal)             // GET /relatorios-fiscais/sped-fiscal
relatoriosService.spedContribuicoes(dataInicial, dataFinal)      // GET /relatorios-fiscais/sped-contribuicoes
```

## 5. Regras de Negócio

1. **Autenticação obrigatória:** Todos os endpoints exigem `empresaId` do token JWT
2. **Período obrigatório:** dataInicial e dataFinal são obrigatórios em todos os relatórios
3. **Alíquotas fixas SPED Contribuições:** PIS = 0,65%, COFINS = 3% (regime cumulativo)
4. **SPED Fiscal registros:** Gera registro 0000 (abertura) + C100 (notas fiscais de entrada) formato pipe
5. **Data final ajustada:** Fim do dia (23:59:59.999) para inclusão correta

## 6. Validações

- EmpresaId extraída do token JWT (req.usuario.empresaId)
- Retorno 401 se empresaId não identificado
- Retorno 400 se dataInicial ou dataFinal ausentes
- Tratamento de erros com try/catch + mensagem amigável
