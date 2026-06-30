# Plano de Ação — ERPoraqui

> **Gerado em**: 03/06/2026
> **Cobertura atual**: ~38%
> **Estimativa total**: ~413h

---

## Fase 0 — Saneamento de Dívida Técnica (29h)

| # | Tarefa | Referência | Esforço | Status |
|---|--------|------------|---------|--------|
| 0.1 | Corrigir dual auth store (`AuthContext.tsx` vs `authStore.ts`) — eleger Zustand | `apps/web/src/stores/` | 2h | ⏳ |
| 0.2 | Criar `docs/specs/` (NF-e, SPED, MDF-e, Boletos/CNAB, Grades/Lotes) | — | 4h | ⏳ |
| 0.3 | Mover fontes xHarbour para `/obsoletos/fontesPRG/` (Single Source of Truth) | `fontesPRG/` | 1h | ⏳ |
| 0.4 | Abstrair `shared/tributos` (ICMS/IPI/PIS/COFINS/CBS/IBS/IS) | `p_tbtrib.prg` | 8h | ⏳ |
| 0.5 | Abstrair `shared/sefaz-client` (SOAP, certificado, envelope XML) | `p_acbr.prg` | 8h | ⏳ |
| 0.6 | Abstrair `shared/nfe-utils` (chave 44 dígitos, XML assembly, schemas XSD) | `p_nfeger.prg` | 6h | ⏳ |

---

## Fase 1 — NF-e Completa (74h)

| # | Tarefa | Referência xHarbour | Esforço | Status |
|---|--------|---------------------|---------|--------|
| 1.1 | Spec: docs/specs/nfe.md | — | 2h | ⏳ |
| 1.2 | Geração XML NF-e modelo 55 + assinatura digital | `p_nfeger.prg` (1660 linhas) | 16h | ⏳ |
| 1.3 | Cálculo de tributos por item (ICMS, IPI, PIS, COFINS, partilha) | `p_nfeger.prg`, `p_tbtrib.prg` | 12h | ⏳ |
| 1.4 | Comunicação SOAP SEFAZ (autorização, inutilização, cancelamento, CC-e) | `p_nfecon.prg`, `p_acbr.prg` | 16h | ⏳ |
| 1.5 | NFC-e modelo 65 | base NF-e | 8h | ⏳ |
| 1.6 | NFSe (comunicação socket prefeituras) | `p_nfse00-04.prg` | 12h | ⏳ |
| 1.7 | Contingência (SVC, EPEC, DPEC) | `p_supernfe.prg` | 8h | ⏳ |

---

## Fase 2 — SPED Fiscal Completo (52h)

| # | Tarefa | Referência xHarbour | Esforço | Status |
|---|--------|---------------------|---------|--------|
| 2.1 | Spec: docs/specs/sped-fiscal.md | — | 2h | ⏳ |
| 2.2 | Bloco C (C100, C170, C190, C300, C350, C400) | `p_sped.prg`, `p_spedrg.prg` | 16h | ⏳ |
| 2.3 | Bloco D (D100, D190, D300) | `p_sped.prg` | 8h | ⏳ |
| 2.4 | Bloco E (E100, E200, E250, E300) | `p_sped.prg` | 8h | ⏳ |
| 2.5 | Bloco G (G100, G125, G126, G130) | `p_sped.prg` | 6h | ⏳ |
| 2.6 | Bloco H (H005, H010, H020) — inventário | `p_sped.prg` | 6h | ⏳ |
| 2.7 | SPED Contribuições (M100, M200, M210, M225, M800) | `p_spedcl.prg`, `p_spedfc.prg` | 8h | ⏳ |
| 2.8 | Validação totais, assinatura, geração arquivo texto | `p_sped.prg` | 4h | ⏳ |

---

## Fase 3 — MDF-e (34h)

| # | Tarefa | Referência xHarbour | Esforço | Status |
|---|--------|---------------------|---------|--------|
| 3.1 | Spec: docs/specs/mdfe.md | — | 2h | ⏳ |
| 3.2 | Schema Prisma (Veiculo, Motorista, MDFe, MDFeNota, MDFeReboque, MDFeCondutor) | `p_mdfe.prg`, `p_veiculo.prg`, `p_motori.prg` | 4h | ⏳ |
| 3.3 | API CRUD MDF-e + vinculação NF-es | `p_mdfe.prg` | 8h | ⏳ |
| 3.4 | Geração XML MDF-e + transmissão SEFAZ | `p_mdfe.prg` | 12h | ⏳ |
| 3.5 | Frontend MDF-e (menu Fiscal) | — | 8h | ⏳ |

---

## Fase 4 — Produtos/Estoque Avançado (36h)

| # | Tarefa | Referência xHarbour | Esforço | Status |
|---|--------|---------------------|---------|--------|
| 4.1 | Schema: Grade, GradeProduto, Lote, MovimentoLote, TabelaPreco, Promocao, HistoricoPreco | `p_grades.prg`, `p_lotpro.prg`, `p_precos.prg`, `p_promoc.prg` | 6h | ⏳ |
| 4.2 | API grades (estoque por variação) | `p_grades.prg` | 8h | ⏳ |
| 4.3 | API lotes (validade, rastreabilidade) | `p_lotpro.prg`, `p_loclot.prg` | 6h | ⏳ |
| 4.4 | API tabelas de preço múltiplas | `p_precos.prg`, `p_tabprc.prg` | 6h | ⏳ |
| 4.5 | API promoções por período | `p_promoc.prg` | 4h | ⏳ |
| 4.6 | Kardex completo (histórico por produto) | `p_kardex.prg` | 6h | ⏳ |

---

## Fase 5 — Financeiro Completo (46h)

| # | Tarefa | Referência xHarbour | Esforço | Status |
|---|--------|---------------------|---------|--------|
| 5.1 | Schema: Cheque, Portador, Renegociacao, CentroCusto | `p_cheque.prg`, `p_portad.prg`, `p_renego.prg` | 4h | ⏳ |
| 5.2 | API cheques (pré-datados, terceiros) | `p_cheque*.prg` (5 arquivos) | 8h | ⏳ |
| 5.3 | API renegociação de contas | `p_renego.prg`, `p_reneg2.prg` | 4h | ⏳ |
| 5.4 | CNAB 240/400 — geração remessa | `p_boleto.prg` (4391 linhas) | 16h | ⏳ |
| 5.5 | CNAB 240/400 — processamento retorno | `p_retban.prg` | 8h | ⏳ |
| 5.6 | API centro de custo/lucro | `p_ctbanc.prg`, `p_ctclie.prg`, `p_ctgfim.prg` | 6h | ⏳ |
| 5.7 | Frontend conciliação bancária | — | 8h | ⏳ |

---

## Fase 6 — Relatórios (40h)

| # | Tarefa | Referência xHarbour | Esforço | Status |
|---|--------|---------------------|---------|--------|
| 6.1 | Motor de relatórios genérico (biblioteca reutilizável) | `p_rel*.prg` (150+ arquivos) | 12h | ⏳ |
| 6.2 | Relatórios fiscais (SPED complementar, livros fiscais) | `p_lfisc1-5.prg`, `p_rfisc1-9.prg` | 12h | ⏳ |
| 6.3 | Relatórios financeiros (balancete, DRE, fluxo) | `p_relc01-19.prg`, `p_balanc.prg` | 8h | ⏳ |
| 6.4 | Relatórios gerenciais (vendas, compras, estoque) | `p_rel001-120.prg` | 8h | ⏳ |

---

## Fase 7 — Módulos Verticais Legados (80h)

| # | Tarefa | Prioridade | Referência | Esforço | Status |
|---|--------|------------|------------|---------|--------|
| 7.1 | Contratos | 🟡 Média | `p_contr1.prg`, `p_contctr.prg` | 12h | ⏳ |
| 7.2 | Garantias | 🟢 Baixa | `p_garant.prg` | 6h | ⏳ |
| 7.3 | Devoluções/Trocas | 🟡 Média | `p_devolu.prg`, `p_trocas.prg` | 10h | ⏳ |
| 7.4 | Convênios | 🟢 Baixa | `p_conven.prg` | 8h | ⏳ |
| 7.5 | Licitações | 🟢 Baixa | `p_licita.prg` | 8h | ⏳ |
| 7.6 | Módulo Ótica (lentes, médicos, pacientes) | 🟢 Baixa | `p_oculos.prg`, `p_lentes.prg`, `p_medico.prg`, `p_pacien.prg` | 20h | ⏳ |
| 7.7 | Módulo Industrial/Produção | 🟢 Baixa | `p_produc.prg`, `p_indust.prg` | 16h | ⏳ |

---

## Fase 8 — Qualidade e Testes (22h)

| # | Tarefa | Esforço | Status |
|---|--------|---------|--------|
| 8.1 | Configurar Vitest para testes unitários | 2h | ⏳ |
| 8.2 | Testes shared/tributos (cálculos fiscais) | 6h | ⏳ |
| 8.3 | Testes shared/sefaz-client (mock SEFAZ) | 4h | ⏳ |
| 8.4 | Testes de integração para módulos core | 8h | ⏳ |
| 8.5 | Pipeline CI (lint + type-check + test) | 2h | ⏳ |

---

## Resumo por Fase

| Fase | Horas | Dependências |
|------|-------|-------------|
| Fase 0 — Saneamento | 29h | — |
| Fase 1 — NF-e | 74h | Fase 0 (tributos, sefaz-client) |
| Fase 2 — SPED | 52h | Fase 1 (tributos, notas) |
| Fase 3 — MDF-e | 34h | Fase 1 (sefaz-client) |
| Fase 4 — Produtos | 36h | Fase 0 |
| Fase 5 — Financeiro | 46h | Fase 0 |
| Fase 6 — Relatórios | 40h | Fases 1-5 |
| Fase 7 — Verticais | 80h | Fase 0 |
| Fase 8 — Testes | 22h | Paralelo |
| **Total Geral** | **413h** | |

---

## Estrutura de Diretórios Planejada

```
apps/api/src/
├── shared/
│   ├── tributos/           # Cálculos ICMS/IPI/PIS/COFINS/CBS/IBS/IS
│   │   ├── tributos.service.ts
│   │   ├── tributos.utils.ts
│   │   └── tributos.types.ts
│   ├── sefaz-client/       # Comunicação SOAP com SEFAZ
│   │   ├── sefaz-client.service.ts
│   │   ├── sefaz-client.certificate.ts
│   │   ├── sefaz-client.xml.ts
│   │   └── sefaz-client.errors.ts
│   ├── nfe-utils/          # Utilitários NF-e
│   │   ├── nfe-utils.chave.ts
│   │   ├── nfe-utils.xml.ts
│   │   └── nfe-utils.schema.ts
│   └── relatorios/         # Motor de relatórios
│       ├── relatorios.service.ts
│       └── relatorios.template.ts
└── modules/
    ├── notas-fiscais/      # Expandido com transmissão real
    ├── sped-fiscal/        # Expandido com blocos completos
    ├── mdfe/               # Novo módulo
    ├── cheques/            # Novo módulo
    ├── grades/             # Novo módulo
    ├── lotes/              # Novo módulo
    └── precos/             # Novo módulo
```

---

## Legenda

| Símbolo | Significado |
|---------|-------------|
| ⏳ | Pendente |
| 🔄 | Em andamento |
| ✅ | Concluído |
| 🟢 | Pode iniciar |
| 🟡 | Aguarda dependência |
| 🔴 | Bloqueado |
