# Análise de Funcionalidades - ERPoraqui vs Legacy (iCompany)

## Visão Geral

- **Sistema Legado**: iCompany (494 arquivos .prg)
- **Sistema Novo**: ERPoraqui (Express + React + PostgreSQL)
- **Data da Análise**: 01/03/2026

---

## Funcionalidades Implementadas no ERPoraqui

### Backend API (27 módulos)
| Módulo | Status |
|--------|--------|
| auth | ✅ Completo |
| empresas | ✅ Completo |
| clientes | ✅ Completo |
| fornecedores | ✅ Completo |
| produtos | ✅ Completo |
| vendedores | ✅ Completo |
| transportadoras | ✅ Completo |
| pedidos-venda | ✅ Completo |
| pedidos-compra | ✅ Completo |
| cotacoes-compra | ✅ Completo |
| entradas-mercadoria | ✅ Completo |
| estoque | ✅ Completo |
| movimentacoes-internas | ✅ Completo |
| fluxo-caixa | ✅ Completo |
| financeiro | ✅ Completo |
| notas-fiscais | ⚠️ Parcial |
| relatorios-fiscais | ⚠️ Parcial |
| dashboard-gerencial | ⚠️ Parcial |
| parametros | ⚠️ Parcial |
| usuarios | ✅ Completo |
| categorias | ✅ Completo |
| unidades-medida | ✅ Completo |

### Frontend Web (13 páginas)
- Dashboard
- Login
- Clientes (Customers)
- Produtos (Products)
- Fornecedores (Suppliers)
- Pedidos (Orders)
- Fluxo de Caixa
- Usuários
- Transportadoras
- Vendedores
- Relatórios Fiscais
- Ajuda
- Configurações

---

## Funcionalidades Faltantes

### 🔴 Críticas - NF-e/NFC-e

| Funcionalidade | Prioridade | Complexidade |
|----------------|------------|-------------|
| NF-e - Nota Fiscal Eletrônica | Alta | Alta |
| NFC-e - Nota Fiscal Consumidor | Alta | Alta |
| NFSe - Nota Fiscal Serviços | Alta | Alta |
| SPED Fiscal | Alta | Alta |
| SPED Contribuições | Alta | Alta |
| SPED ECF | Alta | Alta |
| Cálculos ICMS/IPI/PIS/COFINS | Alta | Alta |
| Integração Certificado Digital | Alta | Alta |

### 🟠 PDV/ECF

| Funcionalidade | Prioridade | Complexidade |
|----------------|------------|-------------|
| ECF - Emissor Cupom Fiscal | Média | Alta |
| PDV - Ponto de Venda | Média | Alta |
| Sincronização PDV | Média | Alta |
| Impressão Cupom | Média | Média |

### 🟡 Financeiro Avançado

| Funcionalidade | Prioridade | Complexidade |
|----------------|------------|-------------|
| Contas a Receber - Boletos | Média | Média |
| Contas a Pagar | Média | Média |
| Conciliação Bancária | Média | Alta |
| Fluxo de Caixa - Projeções | Média | Média |
| Gestão de Cheques | Média | Média |
| Gestão de Cartões | Média | Média |
| Duplicate/Geração | Média | Média |

### 🟢 Contabilidade

| Funcionalidade | Prioridade | Complexidade |
|----------------|------------|-------------|
| Plano de Contas | Baixa | Alta |
| Centro de Custos | Baixa | Alta |
| Lançamentos Contábeis | Baixa | Alta |
| Balancete | Baixa | Alta |
| Balanço Patrimonial | Baixa | Alta |
| DRE - Demonstração Resultado | Baixa | Alta |

### 🔵 Operacionais

| Funcionalidade | Prioridade | Complexidade |
|----------------|------------|-------------|
| Orçamentos Vendas | Média | Média |
| Orçamentos Compras | Média | Média |
| Pedidos Compra - Completo | Média | Média |
| Cotação de Preços | Média | Média |
| Entrada Mercadoria | Média | Média |
| Inventário | Média | Alta |
| Transferência Filiais | Média | Alta |
| Grades Produtos | Média | Média |
| Código Barras | Média | Baixa |

### 🟣 Relatórios (150+ no legado)

| Categoria | Quantidade |
|-----------|------------|
| Relatórios Vendas | ~30 |
| Relatórios Compras | ~20 |
| Relatórios Estoque | ~25 |
| Relatórios Financeiros | ~35 |
| Relatórios Fiscais | ~40 |

### 🟤 Integrações

| Funcionalidade | Prioridade | Complexidade |
|----------------|------------|-------------|
| API REST - Completar | Alta | Média |
| Importação XML | Média | Média |
| Exportação CSV/Excel | Média | Baixa |
| FTP - Envio Arquivos | Baixa | Média |

### ⚫ Utilitários

| Funcionalidade | Prioridade | Complexidade |
|----------------|------------|-------------|
| Backup/Restore | Alta | Alta |
| Configurações Gerais | Média | Baixa |
| Parâmetros Sistema | Média | Baixa |
| Log Operações | Média | Média |
| Auditoria | Média | Alta |

---

## Recomendação de Prioridades

### Fase 1 - NF-e/NFC-e (Mais Urgente)
1. NF-e completa
2. NFC-e
3. Cálculos tributários
4. SPED Fiscal

### Fase 2 - Financeiro
1. Contas a Receber
2. Boletos
3. Fluxo de Caixa avançado

### Fase 3 - Operacionais
1. Orçamentos
2. Pedidos Compra
3. Inventário

### Fase 4 - Contabilidade
1. Plano de Contas
2. Centro de Custos
3. Integração Contábil

---

## Conclusão

O ERPoraqui tem a base sólida (cadastros, estoque, vendas), mas faltam os módulos críticos para operação legal no Brasil (NF-e) e funcionalidades avançadas de financeiro e contabilidade.

**Progresso atual**: ~40% das funcionalidades críticas implementadas.
