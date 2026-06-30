# Especificação Técnica - Módulo CRM Avançado

## Visão Geral

O módulo CRM (Customer Relationship Management) do ERPoraqui é um sistema de gestão de relacionamento com clientes integrado ao ERP, permitindo visão 360°, automação de vendas e marketing baseado em dados reais.

## Arquitetura de Integração

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│   │ CRM Page    │  │ Dashboard   │  │ Visão 360º Cliente  │   │
│   └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘   │
└──────────┼─────────────────┼────────────────────┼──────────────┘
           │                 │                    │
           ▼                 ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API REST                                │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│   │ CRM Service │  │ Licença     │  │ Integração ERP      │   │
│   │             │  │ Guard       │  │ (Clientes, Vendas)  │   │
│   └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘   │
└──────────┼─────────────────┼────────────────────┼──────────────┘
           │                 │                    │
           ▼                 ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE (Prisma)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐   │
│  │CRM Models│  │ Licenças │  │ Clientes  │  │ Vendas/Estq │   │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Modelos de Dados

### 1. CRMPipeline (Pipeline de Vendas)
```prisma
model CRMPipeline {
  id              String   @id @default(cuid())
  empresaId       String
  nome            String   // ex: "Vendas", "Prospecção"
  descricao       String?
  cor             String?  // cor para UI
  ordem           Int      @default(0)
  ativo           Boolean  @default(true)
  
  oportunidades   CRMOportunidade[]
  
  @@map("crm_pipelines")
}
```

### 2. CRMOportunidade (Oportunidade de Venda)
```prisma
model CRMOportunidade {
  id              String   @id @default(cuid())
  empresaId       String
  pipelineId      String
  clienteId       String?  // link para Cliente ERP
  titulo          String
  descricao       String?
  valor           Decimal  @db.Decimal(15,2)
  probabilidade   Int      @default(50) // 0-100
  estagio         String   // nome do pipeline atual
  
  // Campos de automação Quote-to-Cash
  pedidoId        String?  // link para PedidoVenda quando convertido
  notaFiscalId    String?  // link para NotaFiscal quando emitid
  
  // Controle de tempo
  dataFechamentoEsperado DateTime?
  dataFechamentoReal   DateTime?
  diasNoEstagio        Int      @default(0)
  
  // Status
  status          CRMOportunidadeStatus @default(ABERTA)
  origem          String?  // "manual", "importacao", "campanha"
  
  // Metadados
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  createdBy       String?
  
  // Relations
  pipeline        CRMPipeline     @relation(fields: [pipelineId], references: [id])
  cliente         Cliente?        @relation(fields: [clienteId], references: [id])
  itens           CRMOportunidadeItem[]
  tarefas         CRMTarefa[]
  interacoes      CRMInteracao[]
  historico       CRMOportunidadeHistorico[]
  
  @@map("crm_oportunidades")
}

enum CRMOportunidadeStatus {
  ABERTA
  GANHA
  PERDIDA
  CANCELADA
}
```

### 3. CRMOportunidadeItem (Itens da Oportunidade)
```prisma
model CRMOportunidadeItem {
  id              String   @id @default(cuid())
  oportunidadeId  String
  produtoId       String?
  produtoNome     String   // denormalizado para histórico
  quantidade      Decimal  @db.Decimal(15,3)
  precoUnitario   Decimal  @db.Decimal(15,2)
  desconto        Decimal  @default(0) @db.Decimal(15,2)
  total           Decimal  @db.Decimal(15,2)
  
  oportunidade    CRMOportunidade @relation(fields: [oportunidadeId], references: [id])
  produto          Produto?       @relation(fields: [produtoId], references: [id])
  
  @@map("crm_oportunidade_itens")
}
```

### 4. CRMTarefa (Tarefas e Lembretes)
```prisma
model CRMTarefa {
  id              String   @id @default(cuid())
  empresaId       String
  oportunidadeId  String?
  titulo          String
  descricao       String?
  tipo            CRMTarefaTipo    // REUNIAO, LIGACAO, EMAIL, VISITA, OUTRO
  prioridade      CRMTarefaPrioridade // BAIXA, MEDIA, ALTA, URGENTE
  
  responsavelId   String?  // usuário responsável
  dataVencimento  DateTime?
  dataConclusao   DateTime?
  concluida        Boolean  @default(false)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  oportunidade    CRMOportunidade? @relation(fields: [oportunidadeId], references: [id])
  responsavel     Usuario?        @relation(fields: [responsavelId], references: [id])
  
  @@map("crm_tarefas")
}

enum CRMTarefaTipo {
  REUNIAO
  LIGACAO
  EMAIL
  VISITA
  DEMONSTRACAO
  PROPOSTA
  OUTRO
}

enum CRMTarefaPrioridade {
  BAIXA
  MEDIA
  ALTA
  URGENTE
}
```

### 5. CRMInteracao (Histórico de Interações)
```prisma
model CRMInteracao {
  id              String   @id @default(cuid())
  empresaId       String
  oportunidadeId  String?
  clienteId       String?  // interação direta com cliente (sem oportunidade)
  
  tipo            CRMInteracaoTipo  // LIGACAO, EMAIL, REUNIAO, WHATSAPP, OUTRO
  titulo          String
  descricao       String?
  
  // Dados da comunicação
  duracaoMinutos  Int?     // para ligações
  arquivoUrl      String?  // para anexos
  
  usuarioId       String
  data            DateTime @default(now())
  
  oportunidade    CRMOportunidade? @relation(fields: [oportunidadeId], references: [id])
  cliente         Cliente?        @relation(fields: [clienteId], references: [id])
  usuario         Usuario         @relation(fields: [usuarioId], references: [id])
  
  @@map("crm_interacoes")
}

enum CRMInteracaoTipo {
  LIGACAO
  EMAIL
  REUNIAO
  WHATSAPP
  VISITA
  DEMONSTRACAO
  OUTRO
}
```

### 6. CRMCampanha (Campanhas de Marketing)
```prisma
model CRMCampanha {
  id              String   @id @default(cuid())
  empresaId       String
  nome            String
  descricao       String?
  
  // Segmentação
  tipoSegmento    String?  // "todos", "inativos", "por_produto", "por_valor"
  produtoId       String?  // para segmentação por produto
  diasInatividade Int?     // para "clientes inativos há X dias"
  valorMinimo     Decimal? @db.Decimal(15,2) // para segmentação por valor
  
  // Controle
  status          CRMCampanhaStatus @default(RASCUNHO)
  dataInicio      DateTime?
  dataFim         DateTime?
  
  // Resultados
  clientesTarget  Int      @default(0)
  enviosRealizados Int     @default(0)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("crm_campanhas")
}

enum CRMCampanhaStatus {
  RASCUNHO
  AGENDADA
  ATIVA
  PAUSADA
  FINALIZADA
  CANCELADA
}
```

## Funcionalidades por Plano de Licença

| Funcionalidade | BASIC | PROFISSIONAL | PREMIUM |
|---------------|-------|--------------|---------|
| Cadastro de Contatos | ❌ | ✅ | ✅ |
| Pipeline de Vendas | ❌ | ✅ | ✅ |
| Tarefas e Lembretes | ❌ | ✅ | ✅ |
| Histórico de Interações | ❌ | ✅ | ✅ |
| Visão 360º Cliente | ❌ | ✅ | ✅ |
| Quote-to-Cash (auto) | ❌ | ❌ | ✅ |
| Campanhas Marketing | ❌ | ❌ | ✅ |
| Gestão Estoque Inteligente | ❌ | ❌ | ✅ |
| Relatórios CRM | ❌ | ✅ | ✅ |

## Integrações ERP

### 1. Visão 360º do Cliente
- **Entrada:** ID do cliente
- **Dados retornados:**
  - Dados do cliente (ERP)
  - Oportunidades abertas (CRM)
  - Histórico de interações (CRM)
  - Faturas pendentes (ERP/Financeiro)
  - Notas fiscais emitidas (ERP)
  - Histórico de compras (ERP)
  - Limite de crédito (ERP)

### 2. Quote-to-Cash (Automação)
- Quando oportunidade marcada como "GANHA":
  1. Criar Pedido de Venda automaticamente no ERP
  2. Incluir itens da oportunidade no pedido
  3. Aplicar condições de pagamento configuradas
  4. Gerar Conta a Receber
  5. Atualizar status da oportunidade

### 3. Gestão de Estoque Inteligente
- Monitorar oportunidades com alta probabilidade (>70%)
- Alertar quando soma de produtos > estoque atual
- Sugerir compras ao setor de compras

### 4. Marketing Baseado em Dados
- Segmentação por:
  - Clientes inativos (sem compra em X dias)
  - Por produto específico
  - Por faixa de valor
  - Por comportamento de pagamento

## API Endpoints

### Pipelines
- `GET /api/v1/crm/pipelines` - Listar pipelines
- `POST /api/v1/crm/pipelines` - Criar pipeline
- `PUT /api/v1/crm/pipelines/:id` - Atualizar
- `DELETE /api/v1/crm/pipelines/:id` - Excluir

### Oportunidades
- `GET /api/v1/crm/oportunidades` - Listar com filtros
- `POST /api/v1/crm/oportunidades` - Criar
- `PUT /api/v1/crm/oportunidades/:id` - Atualizar
- `POST /api/v1/crm/oportunidades/:id/ganhar` - Marcar como ganha (aciona Quote-to-Cash)
- `POST /api/v1/crm/oportunidades/:id/perder` - Marcar como perdida

### Tarefas
- `GET /api/v1/crm/tarefas` - Listar
- `POST /api/v1/crm/tarefas` - Criar
- `PUT /api/v1/crm/tarefas/:id/concluir` - Concluir tarefa

### Interações
- `GET /api/v1/crm/interacoes` - Listar
- `POST /api/v1/crm/interacoes` - Registrar interação

### Visão 360º
- `GET /api/v1/crm/cliente/:id/visao-360` - Dados completos do cliente

### Campanhas
- `GET /api/v1/crm/campanhas` - Listar
- `POST /api/v1/crm/campanhas` - Criar
- `POST /api/v1/crm/campanhas/:id/executar` - Executar

## Frontend Pages

### /crm
- Dashboard com KPIs
- Pipeline visual (Kanban)
- Lista de oportunidades

### /crm/oportunidades/:id
- Detalhes da oportunidade
- Itens, tarefas, interações
- Botão "Converter em Pedido"

### /crm/cliente/:id
- Visão 360º do cliente
- Abas: Dados, Vendas, Tarefas, Interações, Financeiro

### /crm/tarefas
- Lista de tarefas pendentes
- Calendário de atividades

---

**Versão:** 1.0  
**Data:** 04/03/2026  
**Autor:** Especificação baseada em requisitos de negócio
