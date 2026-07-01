# Kanban de Funcionalidades - ERPoraqui

## Legenda
- ✅ Pronto
- 🔴 Em Desenvolvimento
- 🟠 Backlog Alta Prioridade
- 🟡 Backlog Média Prioridade
- 🟢 Backlog Baixa Prioridade

---

## Tabela de Funcionalidades

| Nome | Caminho | Resumo | Status |
|------|---------|--------|--------|
| Auth JWT | apps/api/src/modules/auth | Login, registro, middleware auth | ✅ |
| Empresas CRUD | apps/api/src/modules/empresas | Cadastro empresas/filiais | ✅ |
| Clientes CRUD | apps/api/src/modules/clientes | Cadastro clientes PF/PJ | ✅ |
| Fornecedores CRUD | apps/api/src/modules/fornecedores | Cadastro fornecedores | ✅ |
| Produtos CRUD | apps/api/src/modules/produtos | Cadastro produtos c/ NCM | ✅ |
| Vendedores CRUD | apps/api/src/modules/vendedores | Cadastro vendedores | ✅ |
| Transportadoras CRUD | apps/api/src/modules/transportadoras | Cadastro transportadoras | ✅ |
| Pedidos Venda | apps/api/src/modules/pedidos-venda | CRUD pedidos venda | ✅ |
| Pedidos Compra | apps/api/src/modules/pedidos-compra | CRUD pedidos compra | ✅ |
| Cotações Compra | apps/api/src/modules/cotacoes-compra | Cotação fornecedores | ✅ |
| Entradas Mercadoria | apps/api/src/modules/entradas-mercadoria | Entrada NF compra | ✅ |
| Estoque | apps/api/src/modules/estoque | Controle estoque | ✅ |
| Movimentações Internas | apps/api/src/modules/movimentacoes-internas | Transferência/Ajuste | ✅ |
| Fluxo Caixa | apps/api/src/modules/fluxo-caixa | Controle fluxo | ✅ |
| Financeiro | apps/api/src/modules/financeiro | Contas R/P | ✅ |
| NF-e | apps/api/src/modules/notas-fiscais | Emissão NF-e | ✅ |
| SPED Fiscal | apps/api/src/modules/relatorios-fiscais | Geração SPED | ✅ |
| Dashboard | apps/api/src/modules/dashboard-gerencial | Indicadores | ✅ |
| Usuários | apps/api/src/modules/usuarios | CRUD usuários | ✅ |
| Categorias | apps/api/src/modules/categorias | Categorias produtos | ✅ |
| Unidades Medida | apps/api/src/modules/unidades-medida | UN, KG, LT | ✅ |
| Parâmetros | apps/api/src/modules/parametros | Config sistema | ✅ |
| Orçamentos | apps/api/src/modules/orcamentos | CRUD orçamentos | ✅ |
| Boletos | apps/api/src/modules/boletos | Geração boletos | ✅ |
| PDV | apps/api/src/modules/pdv | Ponto de venda | ✅ |
| Inventário | apps/api/src/modules/inventario | Controle inventário | ✅ |
| Notas Fiscais | apps/web/src/pages/notas-fiscais | Emissão NF-e frontend | ✅ |
| Pedidos | apps/web/src/pages/orders | CRUD pedidos | ✅ |
| NF-e Completa | apps/api/src/modules/notas-fiscais | Emissão, envio, cancelamento | ✅ |
| NFC-e | apps/api/src/modules/nfce | Nota consumidor eletrônica | ✅ |
| ECF | apps/api/src/modules/ecf | Emissor cupom fiscal | ✅ |
| Plano Contas | apps/api/src/modules/plano-contas | Contabilidade | ✅ |
| DRE | apps/api/src/modules/dre | Demonstração resultado | ✅ |
| DRE Frontend | apps/web/src/pages/dre | Página DRE | ✅ |
| Plano Contas Frontend | apps/web/src/pages/plano-contas | Página Plano Contas | ✅ |
| NFC-e Frontend | apps/web/src/pages/nfce | Página NFC-e com inclusão de itens | ✅ |
| ECF Frontend | apps/web/src/pages/ecf | Página ECF | ✅ |
| Contas a Receber | apps/web/src/pages/contas-receber | Página contas a receber | ✅ |
| Contas a Pagar | apps/web/src/pages/contas-pagar | Página contas a pagar | ✅ |
| Geração Automática Vendas | apps/api/src/modules/pedidos-venda | Gera contas ao confirmar venda | ✅ |
| Geração Automática Compras | apps/api/src/modules/pedidos-compra | Gera contas ao confirmar compra | ✅ |
| NFSe | apps/api/src/modules/nfse | Nota Fiscal de Serviços Eletrônica API | ✅ |
| NFSe Frontend | apps/web/src/pages/nfse | Página NFSe com inclusão de serviços | ✅ |
| Manual Usuário | apps/web/src/pages/ManualPage.tsx | Guia passo a passo didático para usuários | ✅ |
| Reforma Tributária 2026 | apps/api/prisma/schema | CBS/IBS/IS em notas fiscais | ✅ |
| Sistema de Licenciamento | apps/api/src/modules/licencas | Planos, licenças e controle de acesso | ✅ |
| License Guard API | apps/api/src/shared/middleware/licenca.middleware | Middleware de proteção de módulos por licença | ✅ |
| Planos Frontend | apps/web/src/pages/planos | Página de planos e licença | ✅ |
| Multi-empresa API | apps/api/src/modules/multi-empresa | Gestão de grupo econômico | ✅ |
| Multi-empresa Frontend | apps/web/src/pages/multi-empresa | Página de gestão de empresas | ✅ |
| CRM API | apps/api/src/modules/crm | Pipeline, oportunidades, tarefas, interações | ✅ |
| CRM Frontend | apps/web/src/pages/crm | Pipeline Kanban, gestão de vendas | ✅ |
| CRM Visão 360º | apps/api/src/modules/crm | Integração CRM + ERP | ✅ |
| CRM Quote-to-Cash | apps/api/src/modules/crm | Automação conversão em pedido | ✅ |
| License Guard Limites | apps/api/src/shared/middleware/licenca.middleware | Verificação automática de limites | ✅ |
| API Pública | apps/api/src/modules/api-publica | Endpoints públicos com chave API | ✅ |
| CRM Campanhas | apps/api/src/modules/crm | Campanhas de marketing | ✅ |
| Automação API | apps/api/src/modules/automacao | Triggers e ações automáticas | ✅ |
| Automação Frontend | apps/web/src/pages/AutomacaoPage | Página de gestão de automações | ✅ |
| Spec NF-e | docs/specs/NFE.md | Especificação técnica NF-e/NFC-e | ✅ |
| shared/tributos | apps/api/src/shared/tributos | Cálculo ICMS, IPI, PIS, COFINS, CBS, IBS, IS | ✅ |
| shared/nfe-utils | apps/api/src/shared/nfe-utils | Chave 44 dígitos, XML assembly, QRCode NFC-e | ✅ |
| shared/sefaz-client | apps/api/src/shared/sefaz-client | Cliente SOAP SEFAZ (autorização, consulta, cancelamento) | ✅ |
| shared/nfe-utils assinatura | apps/api/src/shared/nfe-utils | assinarXML() com node-forge + xml-crypto | ✅ |
| Produtos Variações API | apps/api/src/modules/produtos-variacoes | CRUD variações + inativar/ativar | ✅ |
| Produtos Lotes API | apps/api/src/modules/produtos-lotes | CRUD lotes + ajustar estoque | ✅ |
| Tabelas Preço API | apps/api/src/modules/tabelas-preco | CRUD tabelas + itens + calcular markup | ✅ |
| Cheques API | apps/api/src/modules/cheques | CRUD cheques + depositar/compensar/devolver | ✅ |
| Centros Custo API | apps/api/src/modules/centros-custo | CRUD centros custo + árvore hierárquica | ✅ |
| CNAB 240/400 | apps/api/src/modules/boletos | Remessa + retorno utilities + endpoints | ✅ |
| Produtos Variações Frontend | apps/web/src/pages/produtos-variacoes | Página CRUD variações | ✅ |
| Produtos Lotes Frontend | apps/web/src/pages/produtos-lotes | Página CRUD lotes | ✅ |
| Tabelas Preço Frontend | apps/web/src/pages/tabelas-preco | Página CRUD tabelas + itens | ✅ |
| Cheques Frontend | apps/web/src/pages/cheques | Página CRUD cheques + dashboard | ✅ |
| Centros Custo Frontend | apps/web/src/pages/centros-custo | Página CRUD árvore hierárquica | ✅ |
| Spec Estoque Avançado | docs/specs/ESTOQUE_AVANCADO.md | Especificação grades/lotes/preços | ✅ |
| Spec CNAB | docs/specs/BOLETOS_CNAB.md | Especificação CNAB 240/400 | ✅ |
| Spec Cheques | docs/specs/CHEQUES.md | Especificação cheques | ✅ |
| Spec Centro Custo | docs/specs/CENTRO_CUSTO.md | Especificação centro de custo | ✅ |
| Exportação | apps/web/src/components/export/ExportButton.tsx | Componente reutilizável de exportação (CSV/JSON/XLSX/PDF) | ✅ |
| Exportação util | apps/web/src/utils/export.ts | Funções utilitárias para exportar dados | ✅ |
| Spec Exportação | docs/specs/EXPORTACAO.md | Especificação módulo exportação | ✅ |
| Manual Técnico | apps/web/src/pages/ManualTecnicoPage.tsx | Documentação técnica p/ devs c/ senha 2145 | ✅ |
| Manual Usuário atualizado | apps/web/src/pages/ManualPage.tsx | +13 seções (Multi-empresa, CRM, Automação, etc.) | ✅ |
| PDV Interface Completa | apps/web/src/pages/PdvPage.tsx | Carrinho, barcode, pagamento, troco | ✅ |
| PDV Service | apps/web/src/services/pdv.ts | buscarPorCodigoBarras, removerItem, atualizarQuantidade | ✅ |
| Filial CRUD Backend | apps/api/src/modules/empresas | POST/PUT/DELETE /empresas/:id/filiais | ✅ |
| Filial DTO | apps/api/src/modules/empresas/dto/filial.dto.ts | Zod schemas para filial | ✅ |
| Filiais Frontend | apps/web/src/pages/FiliaisPage.tsx | Página CRUD filiais | ✅ |
| FilialSelect Component | apps/web/src/components/FilialSelect.tsx | Seletor reutilizável empresas+filiais | ✅ |
| FilialSelect NFCe | apps/web/src/pages/nfce/NFCePage.tsx | Seletor filial integrado | ✅ |
| FilialSelect NFSe | apps/web/src/pages/nfse/NFSePage.tsx | Seletor filial integrado (substitui text input) | ✅ |
| FilialSelect NF-e | apps/web/src/pages/notas-fiscais/NotasFiscaisPage.tsx | Seletor filial integrado | ✅ |
| Spec SPED | docs/specs/SPED.md | Especificação técnica SPED Fiscal config-driven | ✅ |
| Spec MDF-e | docs/specs/MDFE.md | Especificação técnica MDF-e modelo 58 | ✅ |
| Plano Ação Futuro | docs/plano_acao_futuro.md | Plano 8 etapas módulos pendentes | ✅ |
| SPED Fiscal API | apps/api/src/modules/sped-fiscal/ | SpedEngine + blocos 0/C/D/E/G/H | ✅ |
| SPED Config | apps/api/prisma/schema.prisma | Modelo SpedConfig + SpedApuracao | ✅ |
| SPED Frontend | apps/web/src/pages/fiscal/SpedFiscalPage.tsx | Cards blocos, seleção, histórico, download | ✅ |
| SPED Sidebar | apps/web/src/components/layout/Sidebar.tsx | Item SPED Fiscal no menu Fiscal | ✅ |
| MDF-e Prisma | apps/api/prisma/schema.prisma | Modelos Veiculo, Condutor, Mdfe, MdfeDocumento, MdfeEvento | ✅ |
| MDF-e API Veículos | apps/api/src/modules/mdfe | CRUD veículos (GET/POST/PUT/DELETE /mdfe/veiculos) | ✅ |
| MDF-e API Condutores | apps/api/src/modules/mdfe | CRUD condutores (GET/POST/PUT/DELETE /mdfe/condutores) | ✅ |
| MDF-e API Principal | apps/api/src/modules/mdfe | CRUD MDF-e + documentos + eventos (cancelar, encerrar) | ✅ |
| MDF-e Frontend Veículos | apps/web/src/pages/fiscal/VeiculosPage.tsx | CRUD veículos com dialog formulário | ✅ |
| MDF-e Frontend Condutores | apps/web/src/pages/fiscal/CondutoresPage.tsx | CRUD condutores com dialog formulário | ✅ |
| MDF-e Frontend Página | apps/web/src/pages/fiscal/MdfePage.tsx | Listagem, filtro, criação, detalhes, ações | ✅ |
| MDF-e Sidebar | apps/web/src/components/layout/Sidebar.tsx | Itens MDF-e, Veículos, Condutores no menu Fiscal | ✅ |
| Spec Report Engine | docs/specs/REPORT_ENGINE.md | Especificação motor de relatórios genérico | ✅ |
| ReportTemplate Prisma | apps/api/prisma/schema.prisma | Modelo ReportTemplate (fonte, colunas, filtros, formato) | ✅ |
| Report Engine API | apps/api/src/modules/relatorios | 8 data sources, executar, CRUD templates | ✅ |
| Report Engine Frontend | apps/web/src/pages/relatorios/RelatoriosPage.tsx | Seletor fonte, colunas, filtros, preview, download, templates | ✅ |

---

## Próximos Passos (Backlog Geral)

### NF-e (adiado para sistema mais evoluído)
- 🟡 Step 5 — Chamadas SOAP reais (autorização + consulta recibo)
- 🟡 Step 6 — Cancelamento e CC-e via SEFAZ
- 🟡 Step 7 — Inutilizar via SEFAZ
- 🟡 Step 8 — NFC-e QRCode + contingência
- 🟡 Step 9 — NFSe comunicação prefeituras
- 🟡 Step 10 — Contingência SVC/EPEC/DPEC

### Specs Faltantes
- 🟡 Spec SPED Fiscal (`docs/specs/SPED.md`)
- 🟡 Spec MDF-e (`docs/specs/MDFE.md`)

### Melhorias Pendentes
- 🟢 Módulos verticais — Contratos, garantias, devoluções
- 🟢 UX + Input Hints completo (base toda)

---

## Histórico de Atualizações

- **01/07/2026**: PDV completo (carrinho, barcode, pagamento, troco) + Manual Técnico c/ senha 2145 + Manual Usuário atualizado (+13 seções) + Filial CRUD completo (backend rotas + frontend CRUD + componente FilialSelect + integração NFCe/NFSe/NF-e) + Deploy ZimaLOS.
- **01/07/2026 (noite)**: MDF-e completo — Prisma models (Veiculo, Condutor, Mdfe, MdfeDocumento, MdfeEvento), API CRUD Veículos/Condutores/MDF-e com eventos (cancelar, encerrar, incluir/remover doc), Frontend VeiculosPage/CondutoresPage/MdfePage (listagem, filtro, criação, detalhes), Sidebar + Rotas.
- **01/07/2026 (noite 2)**: Motor de Relatórios Genérico — Spec REPORT_ENGINE.md, ReportTemplate Prisma, 8 data sources (clientes, produtos, pedidos, contas, NF-e, NFSe), API executar + CRUD templates, Frontend RelatoriosPage (seletor fonte, colunas, filtros, preview, download CSV/XLSX, templates).
- **30/06/2026 (madrugada)**: Correção 403/400/PDV404/PlanoContas404 + Exportação (CSV, JSON, XLSX, PDF em 5 relatórios) + Input Hints em 5 páginas + Spec EXPORTACAO.md.
- **30/06/2026 (tarde)**: Correção 12 bugs + Testes 62 testes (36 API + 26 WEB) + Temas premium.
- **30/06/2026 (noite)**: Estoque Avançado (grades, lotes, tabelas preço), CNAB 240/400, Cheques, Centro de Custo — API + Frontend + 4 specs + Correção 30+ erros TS. Pronto para deploy.
- **04/03/2026**: Implementado License Guard com verificação automática de limites (clientes, produtos, usuários, notas). Adicionada API Pública com proteção por licença (PREMIUM).
- **04/03/2026**: Implementado módulo CRM Avançado com Pipeline Kanban, oportunidades, tarefas, interações e visão 360º do cliente integrada com ERP. Automação Quote-to-Cash para converter oportunidades em pedidos automaticamente. Parametrizado por licença (PROFISSIONAL/PREMIUM).
- **04/03/2026**: Implementado módulo Multi-empresa com gestão de grupo econômico via licença. Adicionado proteção de módulos via license guard. Limites de empresas por plano (BASIC: 1, PROFISSIONAL: 3, PREMIUM: 10).
- **03/03/2026**: Implementado Sistema de Licenciamento com planos BASIC, PROFISSIONAL e PREMIUM. Criado middleware de proteção de módulos (license guard) para NFSe, ECF, DRE, Plano de Contas e Boletos. Adicionada página frontend de Planos e Licença.
- **03/03/2026**: Implementado Manual do Usuário com guia passo a passo didático. Adicionado item de menu "Manual do Usuário" abaixo de Ajuda.
- **02/03/2026**: Implementado páginas de Contas a Receber e Contas a Pagar no frontend com menu. Implementada geração automática de contas ao confirmar pedido venda/compra com condições de pagamento a prazo/parcelado.
- **02/03/2026**: Implementado inclusão de itens na NFC-e com seleção de produtos, clientes, natureza da operação e gerenciamento de itens.
- **02/03/2026**: Implementado ECF (Emissor Cupom Fiscal) API + Frontend.
- **02/03/2026**: Implementado NFC-e (Nota Consumidor Eletrônica) API + Frontend.
- **02/03/2026**: Implementadas páginas frontend DRE e Plano de Contas. Rotas adicionadas ao menu.
- **02/03/2026**: Implementado DRE API (Demonstração Resultado). Criado Plano de Contas API. Habilitadas rotas NF-e. Seed com dados de exemplo.
- **02/03/2026**: Implementada página de Notas Fiscais (NF-e) no frontend. Menu categorizado. Corrigidos bugs sistemáticos em todos os controllers (req.query). Movido Clientes para Cadastros.
- **02/03/2026**: Finalizado PDV com abrir/fechar caixa. Completado Inventário com CRUD. Adicionada página de Parâmetros. Corrigidos bugs: authMiddleware em todas rotas, req.query, typo convertar, arquivosService. Atualizado branding ERPoraqui.
- **01/03/2026**: Início do projeto de modernização
