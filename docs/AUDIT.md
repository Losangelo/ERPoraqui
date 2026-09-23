# Relatório de Auditoria — ERPoraqui (Filho do Guerreiro)

Data: 07/07/2026  
Escopo: apps/web, apps/api, apps/worker, docs, prisma schema, Docker/deploy

---

## 1. TypeScript Errors

| App | Erros | Status |
|-----|-------|--------|
| web | 0 | ✅ Clean |
| api | 0 | ✅ Clean (102 corrigidos em 07/07) |
| worker | 0 | ✅ Clean |

### Histórico das Correções (102 erros)

| Fase | Arquivo(s) | Erros | Correção |
|------|-----------|-------|----------|
| 1 | `sped-fiscal.service.ts` | 23 | NCM→ncm, cpfCnpj→documento, unidadeVenda→unidadeMedida.simbolo, cliente/fornecedor includo, campos ItemNotaFiscal corrigidos, valorISS→valorIss |
| 2 | `entregas.test.ts` | 23 | Mock `entrega`+`avaliacao` adicionados ao setup.ts |
| 3 | 12 services (clientes, empresas, fornecedores, mdfe, nfse, parametro, produtos, produtos-lotes, produtos-variacoes, tabelas-preco, transportadoras, vendedores) | 15 | `as Prisma.XUncheckedCreateInput` nos creates com empresaId |
| 4 | 4 services (cotacoes-compra, entradas-mercadoria, pedidos-compra, pedidos-venda) | 4 | `produto: { connect: { id } }` nos nested creates |
| 5 | `prisma.service.ts` + 5 services (api-publica, automacao, crm, licencas, multi-empresa) | 5 | `PrismaService` type alias exportado |
| 6 | `boletos.controller.ts`, `logs.routes.ts`, `parametro.controller.ts` | 4 | `'api'`→`LogCategory.API` |
| 7 | `relatorios.service.ts` | 12 | Field names corrigidos (numeroPedido, valorTotal, situacao, etc.) |
| 8 | `relatorios.controller.ts` | 1 | Default filtros no spread |
| 9 | `auth.controller.ts`, `boletos.service.ts`, `financeiro.controller.ts`, `licenca.guard.ts`, `licencas.controller.ts`, `licencas.service.ts`, `ecf.service.ts`, `pdv.service.ts`, `automacao.service.ts`, `crm.service.ts`, `multi-empresa.service.ts` | 15 | Diversos (as any, field names, schemas, args) |

---

## 2. Inconsistências de Rotas/Barrel

| # | Problema | Detalhe |
|---|----------|---------|
| 1 | Dual import pattern | 40 módulos via barrel `index.ts`, 20 via path direto no `main.ts` |
| 2 | Barrels silenciosamente quebrados | `auth/index.ts` e `licencas/index.ts` usam `export *` mas `.routes.ts` usa `export default` (não re-exportado) |
| 3 | Barrels sem rota | `cte/`, `mdfe/`, `sped-fiscal/`, `relatorios/` — `index.ts` não exporta as rotas |
| 4 | Naming inconsistente | `parametros/parametro.routes.ts` (vs `parametros.routes.ts`), `movimentacoes-internas/movimentacao-estoque.routes.ts` |
| 5 | Rota sem sidebar | `/crm/campanhas` existe no App.tsx mas não está no menu lateral |
| 6 | help-routes cobre 100% | ✅ Todas as 66 rotas protegidas têm entrada de ajuda |
| 7 | CommandPalette cobre 100% | ✅ Mesmos 65 itens do sidebar |

---

## 3. Schema Prisma

| Métrica | Valor |
|---------|-------|
| Modelos | 106 |
| Enums | 63 |
| `@map`/`@@map` | 212 (100% consistente) |

### Problemas

- **CRITICAL:** Campo `origenMercadoria` no modelo `Produto` — erro de grafia (espanhol vs português). O enum `OrigemMercadoria` está correto. O erro propaga para seeds.
- **MINOR:** Enum `NaturezaCredito` (linha 1844) — duplicata não utilizada de `NaturezaConta`.

---

## 4. Documentação vs Realidade

| Item | FEATURES.md | Código Real |
|------|------------|-------------|
| Conciliação Bancária API | `modules/conciliacao/` | ❌ Embarcado em `modules/financeiro/` |
| NF-e Steps 5–10 | 🟡 Backlog | 🟡 Pendente (SOAP real, contingência, NFC-e, NFSe socket) |
| Módulo Ótica | 🟢 Backlog | 🟢 Pendente |
| Módulo Industrial | 🟢 Backlog | 🟢 Pendente |

---

## 5. Docker/Deploy — Riscos

| # | Risco | Severidade |
|---|-------|------------|
| 1 | ~~`prisma db push --accept-data-loss` em produção~~ | ✅ CORRIGIDO (migrate deploy) |
| 2 | Senhas hardcoded no docker-compose.yml | 🔴 ALTA |
| 3 | Nginx sem HTTPS/TLS | 🟡 MÉDIA |
| 4 | TSX em produção (sem compilar p/ JS) | 🟡 MÉDIA |
| 5 | .env.example desatualizado (MongoDB vs PostgreSQL) | 🟡 MÉDIA |
| 6 | Sem .dockerignore | 🟢 BAIXA |
| 7 | Worker sem healthcheck nem rebuild no deploy | 🟢 BAIXA |

---

## 6. Pendências Conhecidas

- NF-e Steps 5–10 (backlog, adiado)
- Módulo Ótica (backlog, baixa prioridade)
- Módulo Industrial (backlog, baixa prioridade)

---

## 7. Recomendações (Ordem de Prioridade)

1. ✅ ~~Corrigir 102 TS errors no API~~ **CONCLUÍDO (07/07)**
2. ✅ ~~Migrar `prisma db push --accept-data-loss` para `prisma migrate deploy`~~ **CONCLUÍDO**
3. 🟡 Unificar import pattern no main.ts
4. 🟡 Corrigir barrels quebrados (auth, licencas, cte, mdfe, sped-fiscal, relatorios)
5. 🟡 Adicionar rota `/crm/campanhas` ao Sidebar + CommandPalette
6. ✅ ~~Corrigir `origenMercadoria` → `origemMercadoria` no schema + seeds~~ **CONCLUÍDO**
7. ✅ ~~Remover `NaturezaCredito` (duplicata não utilizada)~~ **CONCLUÍDO**
8. 🟡 Adicionar HTTPS no nginx + ~~.dockerignore + worker healthcheck~~ **PARCIAL** (dockerignore + healthcheck ok)
9. 🟢 Mover secrets do docker-compose para `.env`
10. 🟢 Atualizar `.env.example` para PostgreSQL
11. 🟢 Compilar TS → JS para produção
