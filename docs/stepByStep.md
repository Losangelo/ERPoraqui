# Step-by-Step — ERPoraqui

## 30/06/2026 (madrugada) — Correção 403/400/404, Exportação, Input Hints

- **Fix 403:** Seed automático `seedLicencasParaEmpresas` cria licenças para empresas sem licença; `moduloCrm: true` adicionado ao plano BASIC
- **Fix 400:** `z.coerce.number()` adicionado em 4 DTOs para evitar NaN
- **Fix response.data:** 10 serviços corrigidos — `.dados` → `.data`
- **Fix DialogContent:** `aria-describedby` adicionado em 39 instâncias (34 arquivos)
- **Fix PDV 404:** `buscarCaixaAberto` retorna `null` em vez de `throw NotFound`
- **Fix PlanoContas 404:** Rota `/arvore` movida antes de `/:id` para evitar conflito
- **Exportação:** `utils/export.ts` (CSV/JSON/XLSX/PDF) + componente `ExportButton` + integrado em DRE, FluxoCaixa, ContasReceber, ContasPagar, RelatoriosFiscais
- **Input Hints:** Regra de ouro #5 adicionada ao `AGENTS.md` + `placeholder` descritivo aplicado em ChequesPage, CentrosCustoPage, ProdutosVariacoesPage, ProdutosLotesPage, TabelasPrecoPage
- **Spec:** `docs/specs/EXPORTACAO.md` criada

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

## 01/07/2026 — PDV Completo + Manuais + Filial CRUD

### PDV Interface Completa
- **PdvPage.tsx** reescrita com carrinho funcional (busca por código de barras, busca por nome, grid de resultados)
- Controles de quantidade (+/-), remover item, seleção de cliente com busca
- Dialog de pagamento com 5 formas de pagamento (Dinheiro, PIX, Crédito, Débito, Crédito Parcelado)
- Cálculo automático de troco
- Dialog de venda finalizada com resumo (valor, forma, cupom, troco)
- Fluxo: iniciar venda → adicionar itens localmente → enviar via API ao finalizar
- **pdv.ts** service: +buscarPorCodigoBarras, +removerItem, +atualizarQuantidade, +buscarVenda

### Manuais
- **Manual do Usuário** (ManualPage.tsx): +13 seções novas (Multi-empresa, CRM, Automação, Tabelas Preço, Variações/Lotes, Cheques, Centros Custo, DRE, NFC-e, NFSe, ECF, Relatórios Fiscais, Logs, Exportação)
- **Manual Técnico** (ManualTecnicoPage.tsx): 11 seções técnicas (Arquitetura, Stack, Estrutura, Padrões API, Frontend, Banco, Shared Modules, Deploy, Licenças, NF-e, Setup Dev, Problemas Comuns, Git Workflow) — acesso protegido por senha 2145

### Filial CRUD Completo
- **Backend**: DTO Zod (criarFilialSchema, atualizarFilialSchema), service (criarFilial, buscarFilialPorId, atualizarFilial, removerFilial com validação de vínculos), controller, routes (POST/PUT/DELETE)
- **Frontend**: FiliaisPage.tsx com CRUD completo (tabela, busca, seletor de empresa, diálogo criação/edição com endereço, selects)
- **FilialSelect.tsx**: Componente reutilizável que carrega empresas + filiais dinamicamente
- **Integração**: NFCePage, NFSePage, NotasFiscaisPage — todas agora com seletor de filial via FilialSelect
- **Sidebar**: Item "Filiais" em Cadastros

---

## 01/07/2026 (tarde) — Specs SPED + MDFE + SPED Fiscal Engine Completo

### Specs Criadas
- **docs/specs/SPED.md** (360 linhas): Arquitetura config-driven, registro de blocos, BlockRegistry/SpedEngine, blocos 0/C/D/E/G/H/K/1, validação PVA, versões de layout
- **docs/specs/MDFE.md** (240 linhas): Modelo 58, documento composto, ciclo emissão→autorização→encerramento, módulo transporte, DAMDFE PDF
- **docs/plano_acao_futuro.md**: Plano de 8 etapas para implementação dos módulos pendentes

### SPED Fiscal — Motor Completo
- **Prisma**: Adicionados modelos SpedConfig (config por empresa) e SpedApuracao (apuração ICMS/IPI)
- **Controller reescrito**: Padrão Express com arrow functions e try/catch (consistente com Cheques)
- **Service reescrito**: SpedEngine com BlockRegistry (0, C, D, E, G, H)
  - Bloco 0: abertura, parceiros (clientes/fornecedores), unidades, produtos, contador
  - Bloco C: documentos fiscais NF-e (C100, C170, C190)
  - Bloco D: notas de serviço NFSe (D100)
  - Bloco E: apuração ICMS (E100, E110)
  - Bloco G: controle crédito (G110)
  - Bloco H: inventário (H010)
- **Config**: GET/PUT /sped-fiscal/config, GET /sped-fiscal/blocos (status por bloco)
- **Rotas registradas**: /api/v1/sped-fiscal adicionado em main.ts

### SPED Fiscal — Frontend
- SpedFiscalPage reescrita: cards com blocos (clique ativa/desativa), período selector, histórico com download
- Sidebar: item "SPED Fiscal" adicionado ao menu Fiscal

---

## 01/07/2026 (noite) — MDF-e Completo (Backend + Frontend + Rotas)

### Prisma Models
- **Veiculo**: placa, renavam, rntrc, tipoPropriedade (1/2/3), tara, capacidade, carroceria, ativo
- **Condutor**: cpf, nome, rntrc, cnh, cnhCategoria, cnhVencimento, telefone, email, ativo
- **Mdfe**: chaveAcesso 44d (modelo 58), ufCarregamento/Descarregamento, veiculo/condutor, documentos, eventos, situacao (EM_DIGITACAO/AUTORIZADO/CANCELADO/ENCERRADO)
- **MdfeDocumento**: tipo (NFE/CTE/MDFE), chaveAcesso, valor, peso
- **MdfeEvento**: tipo (CANCELAMENTO/ENCERRAMENTO), descricao, protocolo
- Reverse relations adicionadas em Empresa + Filial

### API MDF-e (`/api/v1/mdfe`)
- **Veículos CRUD**: GET/POST/PUT/DELETE /veiculos (validação placa única por empresa)
- **Condutores CRUD**: GET/POST/PUT/DELETE /condutores (validação CPF único por empresa)
- **MDF-e CRUD**: GET/POST/PUT/DELETE / (chave 44d auto-gerada, numeração auto-increment)
- **Eventos**: POST /:id/incluir-documento, DELETE /:id/documentos/:docId, POST /:id/cancelar, POST /:id/encerrar
- Zod schemas para validação de entrada

### Frontend MDF-e
- **VeiculosPage.tsx**: CRUD completo com dialog formulário (placa, renavam, marca, modelo, ano, cor, carroceria, capacidade/tara, RNTRC, propriedade — select)
- **CondutoresPage.tsx**: CRUD completo com dialog formulário (nome, CPF, CNH, categoria, vencimento, RNTRC, telefone, email)
- **MdfePage.tsx**: Listagem com filtro por situação, criação de novo MDF-e (select veículo/condutor da base), dialog de detalhes completo (chave, veículo, condutor, docs vinculados, eventos, ações cancelar/encerrar)

### Rotas
- Backend: /api/v1/mdfe registrado em main.ts
- Frontend: /mdfe, /veiculos, /condutores registrados em App.tsx
- Sidebar: MDF-e, Veículos, Condutores no menu Fiscal

### db push executado com sucesso
- Nenhum erro de tipo no backend
- Apenas erros TS6133 pré-existentes no frontend (não relacionados)

---

## 01/07/2026 (noite 2) — Motor de Relatórios Genérico

### Prisma
- **ReportTemplate**: modelo salvar templates por empresa (nome, fonte, colunas, filtros, formato)

### Backend (`/api/v1/relatorios`)
- **ReportRegistry**: 8 data sources pré-definidas (clientes, produtos, pedidos-venda, pedidos-compra, contas-receber, contas-pagar, notas-fiscais, notas-servico)
- Cada fonte define colunas (key, label, type) e função de query contra o PostgreSQL
- **GET /data-sources** — lista fontes disponíveis com metadados
- **GET /data-sources/:id** — detalhes de uma fonte
- **POST /executar** — executa relatório (fonte + colunas + filtros) → JSON
- **CRUD /templates** — salvar, carregar, atualizar, excluir templates

### Frontend (RelatoriosPage)
- Painel esquerdo: seletor de fonte, checkboxes de colunas, filtros dinâmicos, formato (tabela/CSV/XLSX)
- Painel direito: preview em tabela com formatação automática (datas, números, booleanos)
- Download CSV/XLSX usando utils/export.ts existente
- Templates: listar, carregar, salvar, excluir
- Substitui a antiga RelatoriosFiscaisPage na rota /relatorios

### Rotas
- Backend: /api/v1/relatorios registrado em main.ts
- Frontend: /relatorios em App.tsx (aponta para RelatoriosPage)

## 02/07/2026 — Lookup Field System (Busca Genérica)

### Problema
- Formulários usavam inputs de ID cegos (ex: "Cliente ID")
- Usuário precisava decorar códigos numéricos
- Cada página precisava reinventar busca de cliente/produto

### Solução
- **lookup-sources.ts** — Config centralizada de fontes de dados (clientes, produtos, fornecedores, vendedores, transportadoras)
  - Cada fonte define endpoint, colunas, formatação de label
  - Funções utilitárias: `cpfCnpj()`, `telefone()` para formatação BR
- **LookupDialog.tsx** — Modal reutilizável com:
  - Input de busca com debounce 300ms
  - Tabela ordenável por coluna (toggle asc/desc)
  - Navegação por teclado (↑↓ → Enter)
  - Loading/empty states
  - Footer com contagem + atalhos
- **LookupField.tsx** — Campo de formulário que:
  - Exibe input read-only com label formatado
  - Botão de busca ao lado
  - Botão de limpar (onClear)
  - Atalhos: Enter, F2, Ctrl+L
  - Gerencia o dialog internamente

### OrcamentosPage atualizada
- Formulário "Novo Orçamento" agora usa `<LookupField source="clientes">`
- State inclui `clienteNome` para exibição amigável
- Placeholder descritivo: "Buscar cliente por nome, CPF ou CNPJ..."

### Spec
- `docs/specs/LOOKUP.md` — Especificação do Lookup Field System

### Build
- `tsc --noEmit` — zero erros

---

- Realizado diagnóstico completo comparando fontes xHarbour originais (`fontesPRG/`, 496 arquivos) vs implementação TypeScript moderna (`apps/api/`, `apps/web/`)
- Identificada cobertura real de ~38% (FEATURES.md e TODO.md estavam superestimados)
- Criado `docs/plano_acao_completo.md` com 8 fases, ~413h de trabalho estimado
- Top 5 gaps críticos:
   1. NF-e sem transmissão SEFAZ real (apenas modelo/estrutura)
   2. MDF-e — 0% implementado
   3. SPED Fiscal — apenas registros básicos (25%)
   4. Produtos sem grades, lotes, tabelas de preço (45%)
   5. Boletos sem CNAB bancário (60%)
## 02/07/2026 (tarde) — Renegociação de Contas

- **Prisma:** Modelos Renegociacao, RenegociacaoConta, RenegociacaoParcela adicionados + valor `RENEGOCIADO` no enum SituacaoConta + relação `renegociacoes` em Empresa.
- **API:** Módulo `renegociacao` com 5 endpoints:
  - `GET /` — Listar renegociações com filtros (tipo, situação, data)
  - `GET /disponiveis` — Listar contas disponíveis para renegociação (ABERTA/VENCIDO)
  - `POST /` — Criar renegociação (seleciona contas, aplica descontos/juros/multa, gera parcelas preview)
  - `POST /:id/confirmar` — Confirmar: marca originais como RENEGOCIADO, cria novas ContaReceber/ContaPagar
  - `POST /:id/cancelar` — Cancelar: reverte originais para ABERTA
- **Frontend:** RenegociacaoPage com dashboard cards (valores), tabela de renegociações, dialog criação (tipo, lookup cliente/fornecedor, checkboxes contas, descontos, parcelamento, preview parcelas), dialog detalhes (parcelas, confirmar/cancelar).
- **Sidebar + Rotas:** "/renegociacao" adicionado ao menu Financeiro + rota App.tsx + endpoint /api/v1/renegociacao em main.ts.
- **Ajuda:** Seção Renegociação adicionada ao AjudaPage.
- **Features:** Kanban FEATURES.md atualizado.

- Prioridade definida: NF-e > SPED > MDF-e > Produtos > Financeiro > Relatórios

## 06/07/2026 — Geração de 38 Specs + Documentação Completa + Correção Orçamentos

### Specs Geradas (38 arquivos)
- **Core Cadastros:** CLIENTES, FORNECEDORES, PRODUTOS, CATEGORIAS, UNIDADES_MEDIDA, VENDEDORES, TRANSPORTADORAS
- **Sistema:** AUTH, USUARIOS, PARAMETROS, LICENCAS, LOGS, DASHBOARD, API_PUBLICA
- **Vendas+Compras:** PEDIDOS_VENDA, ORCAMENTOS, PEDIDOS_COMPRA, COTACOES_COMPRA, ENTRADAS_MERCADORIA
- **Financeiro:** FINANCEIRO, FLUXO_CAIXA, PLANO_CONTAS, DRE, CONCILIACAO, RENEGOCIACAO, ADIANTAMENTOS, QUITACOES
- **Estoque:** ESTOQUE, MOVIMENTACOES_INTERNAS, INVENTARIO, KARDEX
- **Fiscal+Blitz2:** ECF, RELATORIOS_FISCAIS, PROMOCOES, CONVENIOS, LICITACOES, CTE, RELATORIOS
- **Total:** 56 specs — cobertura de 100% dos módulos

### Correções
- Controller orçamentos: catch agora retorna 404 (não encontrado), 409 (status inválido), 401 (não autorizado), 500 (outros)
- Frontend orçamentos: toast.error() substitui console.error() em aprovar/reprovar/converter

### Documentação
- FEATURES.md: +38 entries de specs + histórico
- TODO.md: secao specs completas + correcoes
- stepByStep.md: registro desta etapa
- AGENTS.md: status de specs atualizado

### Cobertura
- 56 specs técnicas (100% dos módulos documentados)
- 55 rotas API
- 64 páginas frontend
- 40 serviços frontend

## 06/07/2026 (noite) — OrdersPage Reescrita (LookupField + Multi-itens + Grid Produtos)

### Melhorias na Tela Novo Pedido
- **Cliente**: Input de ID substituído por LookupField com busca por nome/CPF/CNPJ
- **Vendedor + Transportadora**: Novos campos com LookupField
- **Data de Entrega**: Input type="date"
- **Multi-itens**: Sistema de array dinâmico — cada linha com LookupField produto + qtd + unitário + desconto + total
- **Grid de Produtos**: Sheet lateral com cards (nome, preço, estoque, código barras, NCM) — mesmo estilo do PDV
- **Parcelamento**: Select condicaoPagamento + campos condicionais (quantidadeParcelas, intervalo, primeiraParcelaDias)
- **Valores**: Subtotal, frete, desconto, acréscimos com cálculo automático ao vivo
- **Observações**: Input → textarea com placeholder descritivo
- **Observações Internas**: Novo campo textarea
- **Hints**: placeholder + title descritivos em todos os inputs
- **Validação**: Toast para filial, cliente, itens, e dados de item incompletos
- **Build**: tsc --noEmit zero erros, deploy realizado

## 06/07/2026 (fim do dia) — Módulo Entregas + Documentação + Testes

### Spec
- **docs/specs/ENTREGAS.md** — Especificação completa (models, status flow, API endpoints, endpoints públicos, notificações email, business rules, frontend pages, todo)

### Treinamento (docs/treinamento/entregas.md)
- Guia prático em português: configuração, criação, fluxo completo, tentativas falhas, rastreio público, avaliação, dicas e armadilhas
- SUMMARY.md atualizado com entrada para Entregas

### Testes
- **API (vitest + supertest):** `apps/api/src/__tests__/entregas.test.ts` — 18 testes
  - CRUD (listar, criar, buscar por ID, 401 sem token, 404 inexistente)
  - Status transitions (agendar, saiuParaEntrega, entregue, tentativaFalhou, cancelar)
  - Validação (missing fields, agendar sem motorista, cancelar ENTREGUE)
  - Token rastreio (geração automática UUID)
  - Público rastreio (dados sanitizados, 404 token inválido)
  - Público avaliar (criar, rejeitar não ENTREGUE, rejeitar sem nota)
- **Frontend (vitest):** `apps/web/src/__tests__/entregas.test.tsx` — 15 testes
  - listar, criar, agendar, saiuParaEntrega, entregue, tentativaFalhou, cancelar
  - Motoristas (listar, criar), Veículos (listar, criar), Taxas (listar, calcular)

### Manuais
- **ManualPage.tsx:** Nova seção "Entregas e Rastreamento" em Vendas (após CRM)
- **AjudaPage.tsx:** Nova seção "Entregas" em Vendas (após PDV)
- **ManualTecnicoPage.tsx:** Spec count 56→57, ENTREGAS.md na árvore + tabela, entregas/ no tree modules

### Docs Controle
- **FEATURES.md:** +9 entries (Spec ENTREGAS, Entregas API/Frontend, Motoristas, Veículos, Taxas, Rastreio público, Avaliação) + histórico
- **TODO.md:** Seção concluídos novos + spec count 56→57
- **stepByStep.md:** Este registro
- **AGENTS.md:** Novidades adicionadas

### Cobertura
- 57 specs técnicas (100% dos módulos documentados)
- 18 testes API + 15 testes Frontend
