# Especificação Técnica - Módulo de Exportação

## Visão Geral

Sistema unificado de exportação de dados tabulares nos formatos CSV, JSON, XLSX e PDF. Implementado como um utilitário puro (`export.ts`) e um componente dropdown reutilizável (`ExportButton`), permitindo que qualquer página de listagem/relatório adicione exportação com mínimo de código.

---

## Arquitetura

```
apps/web/src/utils/export.ts          → Funções exportadoras puras (stateless)
apps/web/src/components/export/       → Componente React dropdown
  └── ExportButton.tsx
```

### Fluxo

```
Página → ExportButton (props: dados, colunas, nomeArquivo)
           ├── "Exportar" → dropdown
           │    ├── CSV    → exportarCSV(dados, colunas, nome)
           │    ├── JSON   → exportarJSON(dados, nome)
           │    ├── XLSX   → exportarXLSX(dados, colunas, nome)
           │    └── PDF    → exportarPDF(elementoId, nome, título)
           └── Blob/File → download automático
```

---

## Utilitário (`export.ts`)

### Interface Compartilhada

```ts
interface ColunaExportacao {
  label: string                        // Cabeçalho exibido
  accessor: string | ((row) => string | number)  // Chave do objeto ou função
}
```

### Funções

#### `exportarCSV(dados, colunas, nomeArquivo)`

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| dados | `Record<string, unknown>[]` | Array de objetos |
| colunas | `ColunaExportacao[]` | Definição das colunas |
| nomeArquivo | `string` | Nome base do arquivo (sem extensão) |

- Gera CSV com BOM (`\uFEFF`) para acentuação correta no Excel
- Valores com aspas duplas são escapados (`""`)
- Download via `Blob` + `URL.createObjectURL`

#### `exportarJSON(dados, nomeArquivo)`

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| dados | `Record<string, unknown>[]` | Array de objetos |
| nomeArquivo | `string` | Nome base do arquivo |

- Serializa com `JSON.stringify(dados, null, 2)` (pretty-print)
- `Content-Type: application/json`

#### `exportarXLSX(dados, colunas, nomeArquivo)`

- Converte dados para `aoa_to_sheet` (array of arrays)
- Cria workbook com `utils.book_new()` + `utils.book_append_sheet`
- Salva via `XLSX.writeFile` (dispara download nativo)
- Aba nomeada "Dados"

#### `exportarPDF(elementoId, nomeArquivo, titulo?)`

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| elementoId | `string` | ID do elemento DOM a capturar |
| nomeArquivo | `string` | Nome base do arquivo |
| titulo | `string?` | Título opcional no topo do PDF |

- Renderiza elemento via `html2canvas` (scale 2, useCORS)
- Gera PDF A4 retrato com `jsPDF`
- Suporte a múltiplas páginas se o conteúdo exceder uma folha
- Título opcional com `pdf.setFontSize(16)`

---

## Componente (`ExportButton.tsx`)

### Props (Interface)

```ts
interface ExportButtonProps {
  dados: Record<string, unknown>[]
  colunas: ColunaExportacao[]
  nomeArquivo: string
  tituloRelatorio?: string         // Usado no PDF
  elementoIdParaPDF?: string       // DOM ID para captura PDF
  formatos?: FormatoExportacao[]   // Padrão: ['csv','json','xlsx','pdf']
}
```

### Comportamento

- Botão "Exportar" com ícone `Download` + `ChevronDown`
- Dropdown posicionado à direita com `z-50`
- Estados: idle → seleção → "Exportando {FORMATO}..." (disabled)
- Fecha ao clicar fora (`mousedown` handler)
- Formato PDF é oculto se `elementoIdParaPDF` não for passado (controlado via prop `formatos`)

### Ícones por formato

| Formato | Ícone (lucide-react) |
|---------|----------------------|
| CSV | `FileText` |
| JSON | `FileJson` |
| XLSX | `FileSpreadsheet` |
| PDF | `File` |

---

## Guia de Integração

Para adicionar exportação em uma nova página:

1. Importar o componente:
```tsx
import { ExportButton } from '@/components/export/ExportButton'
```

2. Definir colunas (alinhadas com as colunas da tabela):
```tsx
const colunasExportacao: ColunaExportacao[] = [
  { label: 'Cliente', accessor: 'clienteNome' },
  { label: 'Valor', accessor: (row) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row.valor as number)
  },
]
```

3. Inserir no header da página:
```tsx
<ExportButton
  dados={dados}
  colunas={colunasExportacao}
  nomeArquivo="relatorio-clientes"
  tituloRelatorio="Relatório de Clientes"
  elementoIdParaPDF="tabela-relatorio"
  formatos={['csv', 'xlsx', 'pdf']}
/>
```

4. Para PDF, adicionar `id` no elemento a ser capturado:
```tsx
<div id="tabela-relatorio">
  <Table>...</Table>
</div>
```

---

## Páginas com Exportação

| Página | Caminho | Arquivo |
|--------|---------|---------|
| DRE | `/dre` | `pages/dre/DREPage.tsx` |
| Fluxo de Caixa | `/fluxo-caixa` | `pages/fluxo-caixa/FluxoCaixaPage.tsx` |
| Contas a Receber | `/contas-receber` | `pages/contas-receber/ContasReceberPage.tsx` |
| Contas a Pagar | `/contas-pagar` | `pages/contas-pagar/ContasPagarPage.tsx` |
| Relatórios Fiscais | `/relatorios-fiscais` | `pages/relatorios/RelatoriosFiscaisPage.tsx` |

---

## Dependências

| Pacote | Versão | Uso |
|--------|--------|-----|
| `xlsx` (SheetJS) | `^0.18.5` | Geração de arquivos XLSX |
| `jspdf` | `^4.2.1` | Geração de PDF |
| `html2canvas` | `^1.4.1` | Captura de DOM para renderização em PDF |

Todas declaradas em `apps/web/package.json`.
