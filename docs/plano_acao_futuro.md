# Plano de Ação — ERPoraqui (01/07/2026)

## Contexto

Plano gerado após análise dos 496 arquivos .prg legados vs sistema moderno TypeScript.
Cobertura atual estimada: ~70%. Foco nos módulos faltantes e melhorias de usabilidade.

---

## Etapas

| # | Etapa | Módulo | Estimativa | Depende |
|---|-------|--------|------------|---------|
| 1 | 📄 Spec SPED.md + MDFE.md | Documentação | 4h | — |
| 2 | 🔧 SPED Fiscal Blocos restantes | SPED Fiscal | 40h | Spec |
| 3 | 🔧 MDF-e Completo | MDF-e | 34h | Spec |
| 4 | 🔧 Motor de Relatórios Genérico | Relatórios | 30h | — |
| 5 | 🔧 Contratos + Garantias + Devoluções | Verticais | 50h | — |
| 6 | 🎨 UX + Input Hints + Usabilidade (base toda) | Frontend | 20h | Paralelo |
| 7 | 📝 Atualizar Manuais, Docs, AGENTS.md | Documentação | 8h | Após cada etapa |
| 8 | 🚀 Deploy + Testes | Infra | 6h | Após cada etapa |

---

## Fase 1 — Specs Faltantes

### SPED.md
- Arquitetura config-driven (blocos 0, A, C, D, E, G, H, K)
- Modelo: SpedConfig + SpedApuracao
- Motor TXT: config → query → montagem → validação PVA
- Versões: layout 17 (2024), pós-reforma (2026)
- Referência: SAP TAXBRA, TOTVS

### MDFE.md
- Modelo 58, documento composto
- Ciclo: emissão → autorização → encerramento/cancelamento/troca
- Módulo transporte: veículos, condutores, RNTRC
- DAMDFE PDF
- Referência: Senior, TOTVS

---

## Fase 2 — SPED Fiscal Completo

### Bloco C — Documentos Fiscais
- C100: Nota Fiscal (entrada/saída)
- C170: Itens do documento
- C190: Resumo ICMS por CST/CFOP
- C191: ST por UF

### Bloco D — Documentos Fiscais (Serviço)
- D100: NFSe
- D500: Contas água/luz/telefone

### Bloco E — Apuração ICMS/IPI
- E100: Período apuração ICMS
- E200: ST
- E300: Apuração ICMS
- E500: Apuração IPI

### Bloco G — Controle Crédito ICMS
- G110: CIAP
- G140: Ativo imobilizado
- G990: Abertura/envcerramento

### Bloco H — Inventário
- H010: Itens inventário
- H020: Informação adicional
- H990: Abertura/envcerramento

---

## Fase 3 — MDF-e

### Schema
- Mdfe (modelo 58)
- MdfeDocumento (NF-e/CT-e vinculados)
- MdfeVeiculo, MdfeCondutor
- MdfeEvento (cancelamento, encerramento, inclusão)

### API
- POST /mdfe — criar
- POST /mdfe/:id/transmitir — SEFAZ
- POST /mdfe/:id/cancelar
- POST /mdfe/:id/encerrar
- POST /mdfe/:id/incluir-documento
- GET /mdfe — listar

### Frontend
- MdfePage (criação wizard: dados → veículo → NF-e vinculadas → transmitir)
- DAMDFE preview
- Dashboard: pendentes, autorizados, encerrados

---

## Fase 4 — Motor de Relatórios Genérico

### Arquitetura (2-tier)
1. **BI Layer** (dashboard embutido): queries agregadas + gráficos
2. **Pixel-perfect Layer**: PDFs fiscais/operacionais

### Componentes
- ReportEngineService: registra queries, parâmetros, formatos
- ReportRenderer: PDF (jsPDF/html2canvas), XLSX (SheetJS), CSV, HTML
- ReportScheduler: execução programada
- ReportRepository: templates salvos por empresa

### Frontend
- ReportDesigner: seleciona fonte de dados, colunas, filtros, formato
- ReportViewer: preview + download + agendar

---

## Fase 5 — Contratos + Garantias + Devoluções

### Contratos
- Schema: Contrato (cliente, plano, vigência, valor, status)
- Ciclo: rascunho → ativo → suspenso → encerrado
- Medição → geração automática de pedidos
- Renovação com reajuste por índice

### Garantias
- Schema: Garantia (produto, cliente, prazo, cobertura)
- Elegibilidade automática por regras
- Recuperação de fornecedor

### Devoluções (RMA)
- Schema: Devolucao (venda, produto, motivo, status)
- Fluxo: solicitação → inspeção → destinação (reparo/substituição/crédito)
- NF-e de devolução
- Rastreabilidade

---

## Fase 6 — UX + Usabilidade

### Command Palette (Ctrl+K)
- Busca fuzzy por páginas, clientes, produtos, pedidos
- Atalhos: Ctrl+K foco, Enter navega, setas

### Edição Inline
- Tabelas: clique na célula → input/edit → Enter salva
- Confirmação para campos críticos (preço, impostos)

### Smart Defaults
- CFOP por UF + tipo operação
- Prazo do cliente mestre
- Frete automático por transportadora padrão
- Forma pagamento do vendedor

### Tooltips + Hints
- Revisar todos os inputs da base: placeholder + title
- Adicionar help icons com tooltip explicativo

### Wizard Steps
- NF-e: 3 passos (dados → itens → impostos → revisão)
- MDF-e: veículo → documentos → revisão → transmitir

---

## Fase 7 — Documentação

### ManualPage.tsx
- + SPED Fiscal, MDF-e, Contratos, Garantias, Devoluções, Relatórios
- + Atalhos de teclado (Ctrl+K, atalhos gerais)

### ManualTecnicoPage.tsx
- + Motor de Relatórios (arquitetura 2-tier)
- + Worker NF-e (filas assíncronas)
- + Arquitetura MDF-e (documento composto)
- + Service Lifecycle (contratos/garantias/devoluções)

### Docs de Controle
- TODO.md: mover concluídos ✅, adicionar novos
- FEATURES.md: + linhas + histórico
- stepByStep.md: + steps
- AGENTS.md: + status

---

## Fase 8 — Deploy

- Rsync + docker compose build/up
- `prisma db push` para novos modelos
- Testes manuais nos novos módulos
- Verificar build frontend (tsc --noEmit, vite build)

---

## Referências

- Fontes legado: `/home/losangelo/Downloads/projetos.js/dev/src-thays/fontesPRG/` (496 .prg)
- Specs existentes: `docs/specs/`
- Kanban: `docs/kanban/FEATURES.md`
- Progresso: `docs/TODO.md`
- Step-by-step: `docs/stepByStep.md`
