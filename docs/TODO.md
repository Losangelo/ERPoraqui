# ERPoraqui - Tarefas e Progresso

## Progresso Atual

### ✅ Concluídos

**Backend API:**
- [x] Auth JWT com middleware
- [x] Empresas CRUD
- [x] Clientes CRUD
- [x] Fornecedores CRUD
- [x] Produtos CRUD
- [x] Vendedores CRUD
- [x] Transportadoras CRUD
- [x] Pedidos Venda CRUD
- [x] Pedidos Compra CRUD
- [x] Cotações Compra
- [x] Entradas Mercadoria
- [x] Estoque
- [x] Movimentações Internas
- [x] Fluxo Caixa
- [x] Financeiro
- [x] Notas Fiscais (NF-e)
- [x] SPED Fiscal
- [x] Dashboard Gerencial
- [x] Usuários CRUD
- [x] Categorias
- [x] Unidades Medida
- [x] Parâmetros
- [x] Orçamentos
- [x] Boletos
- [x] PDV
- [x] Inventário
- [x] Sistema de Licenciamento (Planos, Licenças, Guardas)

**Frontend:**
- [x] Login com persistência localStorage
- [x] Dashboard
- [x] Clientes
- [x] Produtos
- [x] Fornecedores
- [x] Pedidos
- [x] Fluxo Caixa
- [x] Usuários
- [x] Transportadoras
- [x] Vendedores
- [x] Relatórios Fiscais
- [x] Logs
- [x] Orçamentos
- [x] Boletos
- [x] PDV
- [x] Inventário
- [x] Estoque
- [x] Parâmetros (NOVA PÁGINA)
- [x] Notas Fiscais (NOVA PÁGINA)
- [x] DRE (NOVA PÁGINA)
- [x] Plano de Contas (NOVA PÁGINA)
- [x] NFC-e (NOVA PÁGINA)
- [x] ECF (NOVA PÁGINA)
- [x] Contas a Receber (NOVA PÁGINA)
- [x] Contas a Pagar (NOVA PÁGINA)
- [x] Planos e Licença (NOVA PÁGINA)
- [x] Multi-empresa (NOVA PÁGINA)
- [x] CRM - Pipeline Kanban (NOVA PÁGINA)

**Correções:**
- [x] Auth middleware em todas as rotas
- [x] Bug sintaxe req.query.x em todos os controllers
- [x] Typo convertar → converter
- [x] Branding ERPoraqui (removido FilhoDoGuerreiro)
- [x] Bug BoletosPage - arquivosService → boletosService
- [x] EstoquePage - usa produtosService
- [x] InventarioPage - usa inventarioService
- [x] PdvPage - usa pdvService
- [x] Menu categorizado (Início, Vendas, Estoque, Cadastros, Financeiro, Fiscal, Gestão, Sistema)
- [x] Clientes movido para Cadastros
- [x] Seed com dados de exemplo
- [x] NF-e API - rotas habilitadas e corrigidas
- [x] DRE - Demonstração Resultado Exercício (API)
- [x] Plano de Contas - Módulo contábil (API + Schema)
- [x] NFC-e - Nota Consumidor Eletrônica (API + Frontend)
- [x] ECF - Emissor Cupom Fiscal (API + Frontend)
- [x] NFC-e Frontend - Inclusão de itens com seleção de produtos/clientes
- [x] Contas a Receber - Página frontend com CRUD
- [x] Contas a Pagar - Página frontend com CRUD
- [x] Geração automática de contas ao confirmar pedido de venda
- [x] Geração automática de contas ao confirmar pedido de compra
- [x] Condições de pagamento em pedidos (A_VISTA, A_PRAZO, PARCELADO)
- [x] NFSe - Nota Fiscal de Servicos Eletronica (API + Frontend)
- [x] Reforma Tributaria 2026 - CBS/IBS/IS em notas fiscais
- [x] Manual do Usuario - Guia passo a passo didatico
- [x] Sistema de Licenciamento - Planos (BASIC, PROFISSIONAL, PREMIUM)
- [x] Sistema de Licenciamento - Licenças com controle de acesso
- [x] Sistema de Licenciamento - Middleware de proteção de módulos
- [x] Módulo Multi-empresa - API de gestão de grupo econômico
- [x] Módulo Multi-empresa - Frontend página de gestão
- [x] Módulo Multi-empresa - Vinculação de empresas via licença
- [x] Módulo CRM - Schema Prisma (pipelines, oportunidades, tarefas, interações)
- [x] Módulo CRM - API completa com Quote-to-Cash
- [x] Módulo CRM - Frontend com Pipeline Kanban
- [x] Módulo CRM - Visão 360º do Cliente
- [x] Módulo CRM - Parametrizado por licença (PROFISSIONAL/PREMIUM)
- [x] License Guard - Verificação automática de limites
- [x] API Pública - Integrações externas
- [x] CRM Premium - Campanhas de Marketing
- [x] Módulo Automação - Triggers e Ações
- [x] Módulo Automação - Frontend página de gestão
- [x] Spec NF-e (`docs/specs/NFE.md`)
- [x] shared/tributos - cálculo ICMS/IPI/PIS/COFINS/CBS/IBS/IS
- [x] shared/nfe-utils - chave 44 dígitos, XML assembly
- [x] shared/sefaz-client - integração SEFAZ (estrutura)
- [x] Refatoração notas-fiscais.service para usar shared modules
- [x] Fix ERR_CONNECTION_REFUSED (VITE_API_URL=/api/v1)
- [x] Fix crash 502 - parse() fora de try/catch em 7 controllers + process.on(unhandledRejection)
- [x] Assinatura digital XML NF-e (node-forge + xml-crypto) em shared/nfe-utils
- [x] Bug HTTP method: pedidos cancelar POST→PATCH
- [x] Bug HTTP method: compras confirmar/cancelar POST→PATCH
- [x] Bug response format: financeiro .dados→.data
- [x] Bug response format: boletos .dados→.data
- [x] Bug response format: inventario .dados→.data
- [x] Bug response format: parametros .dados→.data
- [x] Bug response format: pdv .dados→.data
- [x] Rotas PATCH /pedidos-venda/:id/aprovar e /enviar adicionadas
- [x] Rota GET /empresas/:id/filiais adicionada
- [x] numeroPedido auto-gerado (PV{data}{seq}) em pedido-venda.dto
- [x] Typo aprobat→aprovar em OrdersPage e OrcamentosPage
- [x] Sistema de temas premium (Zustand light/dark/system, sidebar retrátil, dropdown header)
- [x] Bug PDV abrirCaixa: seletor filial + operador auth + validação toast
- [x] Bug OrdersPage criarPedido: filialId, condicaoPagamento mapeado, status filter
- [x] Bug CRM 403: tratamento de erro amigável sem alert()
- [x] **Testes API (vitest + supertest):** 5 arquivos, 36 testes — auth, clientes, empresas, pedidos-venda, pdv
- [x] **Testes WEB (vitest + jsdom):** 6 arquivos, 26 testes — pedidos, compras, financeiro, estoque, pdv, clientes
- [x] **Produtos — Grades/Lotes/Tabelas Preço API:** Schema + CRUD completo 5 módulos API
- [x] **Produtos — Frontend:** Páginas Variações, Lotes, Tabelas Preço + Sidebar + Rotas
- [x] **Boletos CNAB 240/400:** Utils remessa/retorno + endpoints + modelo RemessaBoleto
- [x] **Financeiro — Cheques:** Schema + API CRUD + ações (depositar/compensar/devolver/cancelar) + Frontend
- [x] **Financeiro — Centro Custo:** Schema + API CRUD + árvore hierárquica + Frontend
- [x] **Specs criadas:** ESTOQUE_AVANCADO.md, BOLETOS_CNAB.md, CHEQUES.md, CENTRO_CUSTO.md
- [x] **Correções TypeScript:** 30+ erros pré-existentes corrigidos no frontend, build limpo
- [x] **PDV buscarCaixaAberto:** 404 eliminado — service retorna null em vez de throw
- [x] **403 licença:** Seed automático de licenças para empresas sem licença + moduloCrm=true no BASIC
- [x] **400 validação:** z.coerce.number() em 4 DTOs + ativo boolean conversion + inventario args fix
- [x] **response.data.dados → data:** 10 ocorrências em 6 services corrigidas
- [x] **aria-describedby:** 39 DialogContent em 34 arquivos corrigidos
- [x] **Input Hints:** Placeholder descritivo em ChequesPage, CentrosCustoPage, ProdutosVariacoesPage, ProdutosLotesPage, TabelasPrecoPage
- [x] **Regra Input Hints:** Adicionada ao AGENTS.md (regra de ouro #5)
- [x] **Exportação:** Componente ExportButton + util export.ts (CSV, JSON, XLSX, PDF) + integrado em DRE, FluxoCaixa, ContasReceber, ContasPagar, RelatoriosFiscais
- [x] **Spec EXPORTACAO.md:** Especificação técnica do módulo de exportação
- [x] **PlanoContas route fix:** /arvore movido antes de /:id para evitar conflito
- [x] **Manual Técnico:** docs/ManualTecnicoPage.tsx — 11 seções técnicas para equipe de devs, acesso protegido por senha 2145
- [x] **Manual do Usuário atualizado:** +13 seções (Multi-empresa, CRM, Automação, Tabelas Preço, Variações/Lotes, Cheques, Centros Custo, DRE, NFC-e, NFSe, ECF, Relatórios Fiscais, Logs, Exportação)
- [x] **PDV Interface completa:** Carrinho, busca por código de barras/nome, +/-, remover, cliente, pagamento com troco
- [x] **Filial CRUD Backend:** POST/PUT/DELETE /empresas/:id/filiais + DTO Zod
- [x] **Filial CRUD Frontend:** FiliaisPage com tabela, busca, diálogo criação/edição
- [x] **FilialSelect Component:** Componente reutilizável com loading de empresas+filiais
- [x] **Filial Selector NFCe/NFSe/NF-e:** FilialSelect integrado nas 3 páginas que estavam sem

---

### ✅ Concluídos (Novos)

- [x] **Spec SPED.md:** docs/specs/SPED.md — Especificação técnica completa do SPED Fiscal (config-driven, blocos 0/C/D/E/G/H, motor TXT)
- [x] **Spec MDFE.md:** docs/specs/MDFE.md — Especificação técnica do MDF-e (modelo 58, documento composto, ciclo SEFAZ)
- [x] **Plano de Ação Futuro:** docs/plano_acao_futuro.md — Plano de 8 etapas para módulos pendentes
- [x] **SPED Fiscal — Backend reescrito:** Controller Express pattern, service com BlockRegistry/SpedEngine, blocos 0/C/D/E/G/H implementados
- [x] **SPED Config:** Modelo SpedConfig + SpedApuracao no Prisma, endpoints GET/PUT /sped-fiscal/config
- [x] **SPED Blocos:** Endpoint /sped-fiscal/blocos com status de cada bloco (pronto/parcial/pendente)
- [x] **SPED Frontend atualizado:** SpedFiscalPage com cards de blocos, seleção ativa/desativa, histórico, download
- [x] **SPED Sidebar:** Item "SPED Fiscal" adicionado ao menu Fiscal
- [x] **SPED Rotas registradas:** /api/v1/sped-fiscal registrado em main.ts
- [x] **MDF-e — Prisma Models:** Veiculo, Condutor, Mdfe, MdfeDocumento, MdfeEvento + reverse relations
- [x] **MDF-e — API CRUD Veículos:** GET/POST/PUT/DELETE /api/v1/mdfe/veiculos
- [x] **MDF-e — API CRUD Condutores:** GET/POST/PUT/DELETE /api/v1/mdfe/condutores
- [x] **MDF-e — API CRUD MDF-e:** GET/POST/PUT/DELETE + eventos (incluir/remover doc, cancelar, encerrar)
- [x] **MDF-e — Frontend VeiculosPage:** CRUD completo com dialog formulário
- [x] **MDF-e — Frontend CondutoresPage:** CRUD completo com dialog formulário
- [x] **MDF-e — Frontend MdfePage:** Listagem, filtro por situação, criação, detalhes com documentos/eventos, ações
- [x] **MDF-e — Sidebar:** Itens MDF-e, Veículos, Condutores no menu Fiscal
- [x] **MDF-e — Rotas:** Registradas em App.tsx (frontend) + main.ts (backend)
- [x] **Spec REPORT_ENGINE.md:** docs/specs/REPORT_ENGINE.md — Motor de Relatórios Genérico (8 data sources, formatos)
- [x] **ReportTemplate Prisma:** Modelo no schema (nome, dataSource, colunas, filtros, formato)
- [x] **Report Engine API:** /api/v1/relatorios — 8 data sources, POST /executar, CRUD /templates
- [x] **Report Engine Frontend:** RelatoriosPage com seletor fonte, colunas, filtros, preview, download CSV/XLSX, templates

---

### 🔴 Em Andamento

1. Contratos + Garantias + Devoluções

---

### 🟠 Pendentes (Backlog NF-e — adiado p/ sistema mais evoluído)

1. NF-e Step 5 — Substituir mocks SefazClient por chamadas SOAP reais (autorização + consulta recibo)
2. NF-e Step 6 — Cancelamento e CC-e via SEFAZ real
3. NF-e Step 7 — Inutilizar numeração via SEFAZ real
4. NF-e Step 8 — NFC-e modelo 65 + QRCode + contingência
5. NF-e Step 9 — NFSe (comunicação socket prefeituras)
6. NF-e Step 10 — Contingência SVC/EPEC/DPEC

---

### 🟡 Pendentes (Demais Módulos)

1. Relatórios — Motor genérico de relatórios
2. Módulos verticais — Contratos, garantias, devoluções, licitações

---

## Legenda

- ✅ Concluído
- 🔴 Em Andamento
- 🟠 Pendente Alta Prioridade
- 🟡 Pendente Média Prioridade
- 🟢 Pendente Baixa Prioridade
