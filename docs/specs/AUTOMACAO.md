# Especificação Técnica - Módulo de Automação

## Visão Geral

O módulo de Automação do ERPoraqui permite criar fluxos de trabalho automatizados para otimizar processos repetitivos e aumentar a produtividade da empresa.

## Tipos de Automações

### 1. Automação de Tarefas (Triggers e Ações)

**Triggers (Gatilhos):**
- Novo cliente cadastrado
- Pedido confirmado
- Nota fiscal autorizada
- Conta vence amanhã
- Estoque baixo
- Birthday do cliente

**Ações:**
- Enviar e-mail
- Criar tarefa
- Atualizar status
- Notificar usuário
- Gerar documento

### 2. Automação de Marketing

- Campanhas automáticas baseadas em comportamento
- Sequência de e-mails
- Segmentação dinâmica

### 3. Automação Financeira

- Envio de lembrete de pagamento
- Atualização automática de status de contas
- Geração de relatórios agendados

## Modelos de Dados

### Automacao (Automação)
```prisma
model Automacao {
  id              String   @id @default(cuid())
  empresaId       String
  nome            String
  descricao       String?
  
  // Tipo de automação
  tipo            AutomacaoTipo
  
  // Status
  status          AutomacaoStatus @default(ATIVA)
  
  // Configuração (JSON)
  trigger         Json
  acoes           Json[]
  
  // Controle
  executadaCount  Int      @default(0)
  ultimaExecucao  DateTime?
  
  dataCriacao     DateTime @default(now())
  dataAtualizacao DateTime @updatedAt
  
  logs            AutomacaoLog[]
  
  @@map("automacoes")
}

enum AutomacaoTipo {
  TAREFAS
  MARKETING
  FINANCEIRO
  ESTOQUE
  NOTIFICACOES
}

enum AutomacaoStatus {
  ATIVA
  PAUSADA
  INATIVA
}

model AutomacaoLog {
  id              String   @id @default(cuid())
  automacaoId     String
  executada       Boolean
  detalhes       Json?
  erro            String?
  dataExecucao    DateTime @default(now())
  
  automacao       Automacao @relation(fields: [automacaoId], references: [id], onDelete: Cascade)
  
  @@map("automacao_logs")
}
```

## Funcionalidades por Plano

| Funcionalidade | BASIC | PROFISSIONAL | PREMIUM |
|---------------|-------|--------------|---------|
| Automações Manuais | ❌ | ❌ | ✅ |
| Triggers Automáticos | ❌ | ❌ | ✅ |
| E-mails Automáticos | ❌ | ❌ | ✅ |
| Relatórios Agendados | ❌ | ❌ | ✅ |

## API Endpoints

- `GET /api/v1/automacoes` - Listar automações
- `POST /api/v1/automacoes` - Criar automação
- `PUT /api/v1/automacoes/:id` - Atualizar
- `DELETE /api/v1/automacoes/:id` - Excluir
- `POST /api/v1/automacoes/:id/executar` - Executar manualmente
- `POST /api/v1/automacoes/:id/ativar` - Ativar
- `POST /api/v1/automacoes/:id/pausar` - Pausar

## Exemplos de Automações

### 1. Estoque Baixo
```json
{
  "trigger": {
    "tipo": "ESTOQUE_BAIXO",
    "produtoId": null,
    "threshold": 10
  },
  "acoes": [
    {
      "tipo": "CRIAR_TAREFA",
      "destinatarioId": "usuario-compras",
      "titulo": "Repor estoque: {produto.nome}",
      "prioridade": "ALTA"
    },
    {
      "tipo": "ENVIAR_EMAIL",
      "destinatarios": ["compras@empresa.com"],
      "assunto": "Alerta de estoque baixo",
      "corpo": "O produto {produto.nome} está com apenas {produto.estoque} unidades."
    }
  ]
}
```

### 2. Novo Cliente
```json
{
  "trigger": {
    "tipo": "CLIENTE_CADASTRADO"
  },
  "acoes": [
    {
      "tipo": "CRIAR_TAREFA",
      "destinatarioId": "vendedor",
      "titulo": "Follow-up: {cliente.nome}",
      "prazoDias": 3
    },
    {
      "tipo": "ENVIAR_EMAIL",
      "destinatarios": ["{cliente.email}"],
      "assunto": "Bem-vindo!",
      "corpo": "Olá {cliente.nome}, obrigado por se cadastrar!"
    }
  ]
}
```

### 3. Conta Vencendo
```json
{
  "trigger": {
    "tipo": "CONTA_VENCENDO",
    "diasAntecedencia": 3
  },
  "acoes": [
    {
      "tipo": "ENVIAR_EMAIL",
      "destinatarios": ["{cliente.email}"],
      "assunto": "Sua conta vence em 3 dias",
      "corpo": "Prezado(a) {cliente.nome}, sua conta de R$ {conta.valor} vence em 3 dias."
    }
  ]
}
```

---

**Versão:** 1.0  
**Data:** 04/03/2026
