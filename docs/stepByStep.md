# Step-by-Step — ERPoraqui

## 30/06/2026 — NF-e Phase 1: Shared Modules + Spec + Assinatura Digital

- Criado `docs/specs/NFE.md` com especificação técnica completa do módulo NF-e/NFC-e
- Implementado `shared/tributos`: cálculo de ICMS, IPI, PIS, COFINS, CBS, IBS, IS com Zod validation
- Implementado `shared/nfe-utils`: geração chave 44 dígitos com DV, montagem XML (inutilização, cancelamento, carta correção, consulta cadastro, QRCode NFC-e)
- Implementado `shared/sefaz-client`: classe SefazClient com estrutura para SOAP (autorização, consulta, cancelamento, inutilização)
- Refatorado `notas-fiscais.service.ts` para usar os 3 shared modules
- Adicionado status SEFAZ endpoint + inutilizar route
- Instaladas dependências: axios, fast-xml-parser, node-forge, xml-crypto + @types
- Fix: ERR_CONNECTION_REFUSED no login - alterado fallback de `http://localhost:3002/api/v1` para `/api/v1` (nginx proxy)
- Fix crash 502: 7 controllers com `zod.parse()` fora do try/catch movidos para dentro + `process.on('unhandledRejection')`
- Fix OrcamentosPage: `response.data?.data || response.data?.dados`
- Fix PDV: `buscarCaixaAberto` com filialId vazio
- **Implementado Step 4 (Assinatura Digital XML):** Nova função `assinarXML()` em `shared/nfe-utils` usando `node-forge` (extração PFX → privateKeyPEM + certPEM) + `xml-crypto` v6 (SignedXml com references, canonicalization, X509Data). Service `assinar()` agora busca certificado do DB, gera XML NFe e o assina digitalmente.
- Deploy realizado: rsync + docker compose build/up (api + web)

## 30/06/2026 (tarde) — Correção de 12 Bugs Runtime + Testes Automatizados

### Bugs Corrigidos
1. **HTTP methods:** `pedidos.ts` cancelar POST→PATCH, `compras.ts` confirmar/cancelar POST→PATCH
2. **Response format:** `financeiro.ts`, `boletos.ts`, `inventario.ts`, `parametros.ts`, `pdv.ts` — `.dados` → `.data`
3. **Rotas adicionadas:** `PATCH /pedidos-venda/:id/aprovar`, `PATCH /pedidos-venda/:id/enviar`, `GET /empresas/:id/filiais`
4. **numeroPedido auto-gerado:** `PV{data}{seq}` no DTO pedido-venda
5. **Typo** `aprobat` → `aprovar` em OrdersPage e OrcamentosPage
6. **PDV abrirCaixa:** página reescrita com seletor filial, operador auth, validação toast
7. **OrdersPage criarPedido:** filialId, condicaoPagamento (`A_VISTA`/`A_PRAZO`/`PARCELADO`), status filter mapeado
8. **CRM 403:** erro de licença tratado com feedback amigável
9. **Sistema de temas premium:** Zustand light/dark/system + sidebar retrátil + dropdown header

### Testes Automatizados
- **API (vitest + supertest + mocks Prisma):** 5 arquivos, 36 testes
  - `auth.test.ts` — login com credenciais válidas/inválidas
  - `clientes.test.ts` — CRUD + inativação
  - `empresas.test.ts` — CRUD + listagem filiais + filtro ativas
  - `pedidos-venda.test.ts` — CRUD + aprovação/envio/cancelamento com PATCH
  - `pdv.test.ts` — abertura/fechamento caixa + busca caixa aberto
- **WEB (vitest + jsdom + mocks axios):** 6 arquivos, 26 testes
  - `pedidos.test.ts` — HTTP methods e response parsing
  - `compras.test.ts` — listar/cancelar/criar pedidos
  - `financeiro.test.ts` — response.data.data extração
  - `estoque.test.ts` — response.data.data extração
  - `pdv.test.ts` — abrir/fechar/buscar caixa
  - `clientes.test.ts` — CRUD + inativação com PATCH
- **Total:** 62 testes, todos passando

## 30/06/2026 (noite) — Estoque Avançado, CNAB, Cheques, Centro de Custo + Frontend Completo

### Backend (API + Prisma Schema)
- Adicionados 7 novos modelos Prisma: `ProdutoVariacao`, `ProdutoLote`, `TabelaPreco`, `TabelaPrecoItem`, `Cheque`, `CentroCusto`, `RemessaBoleto`
- Adicionados enums: `TipoCheque`, `SituacaoCheque`
- Adicionado `centroCustoId` em ContaPagar, ContaReceber, FluxoCaixa
- Migration executada via `prisma db push` — banco sincronizado

### Módulos API Criados
1. **ProdutosVariações** — CRUD + inativar/ativar (7 endpoints)
2. **ProdutosLotes** — CRUD + ajustar estoque (6 endpoints)
3. **TabelasPreço** — CRUD + itens CRUD + calcular markup (9 endpoints)
4. **Cheques** — CRUD + depositar/compensar/devolver/cancelar + dashboard (9 endpoints)
5. **CentrosCusto** — CRUD + árvore hierárquica (6 endpoints)
6. **CNAB** — Utils CNAB 240/400 (geração remessa + parser retorno) + endpoints

### Frontend (Web)
- 6 novos serviços (`produtos-variacoes.ts`, `produtos-lotes.ts`, `cheques.ts`, `centros-custo.ts`, `tabelas-preco.ts`)
- 5 novas páginas CRUD completas (ProdutosVariacoesPage, ProdutosLotesPage, TabelasPrecoPage, ChequesPage, CentrosCustoPage)
- Rotas registradas no App.tsx + Sidebar atualizada
- **30+ erros TypeScript pré-existentes corrigidos** em todo o frontend
- `tsc --noEmit` e `vite build` passando com zero erros

### Specs Criadas
- `docs/specs/ESTOQUE_AVANCADO.md` — Grades, lotes, tabelas de preço
- `docs/specs/BOLETOS_CNAB.md` — CNAB 240/400
- `docs/specs/CHEQUES.md` — Cheques
- `docs/specs/CENTRO_CUSTO.md` — Centro de custo

## 03/06/2026 — Criação do Plano de Ação Completo

- Realizado diagnóstico completo comparando fontes xHarbour originais (`fontesPRG/`, 496 arquivos) vs implementação TypeScript moderna (`apps/api/`, `apps/web/`)
- Identificada cobertura real de ~38% (FEATURES.md e TODO.md estavam superestimados)
- Criado `docs/plano_acao_completo.md` com 8 fases, ~413h de trabalho estimado
- Top 5 gaps críticos:
  1. NF-e sem transmissão SEFAZ real (apenas modelo/estrutura)
  2. MDF-e — 0% implementado
  3. SPED Fiscal — apenas registros básicos (25%)
  4. Produtos sem grades, lotes, tabelas de preço (45%)
  5. Boletos sem CNAB bancário (60%)
- Prioridade definida: NF-e > SPED > MDF-e > Produtos > Financeiro > Relatórios
