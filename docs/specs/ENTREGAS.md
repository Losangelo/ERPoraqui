# Módulo Entregas — Especificação Técnica

## 1. Visão Geral

Sistema de entregas com rastreamento, notificações automáticas e avaliação pós-entrega.
Integra-se ao módulo de Pedidos de Venda para criar entregas a partir de pedidos confirmados.

**Objetivos:**
- Rastrear entregas em tempo real
- Gerenciar motoristas e veículos
- Notificar clientes automaticamente
- Coletar avaliações pós-entrega
- Calcular taxas de entrega dinamicamente

---

## 2. Modelos de Dados

### 2.1 Entrega

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| empresaId | String | FK → Empresa |
| filialId | String? | FK → Filial |
| pedidoVendaId | String? | FK → PedidoVenda |
| clienteId | String | FK → Cliente |
| motoristaId | String? | FK → Motorista |
| veiculoId | String? | FK → Veiculo |
| numero | Int | Auto-incremento por empresa |
| status | EntregaStatus | Enum do fluxo |
| tokenRastreio | String | UUID único para link público |
| enderecoEntrega | Json | { logradouro, numero, bairro, cidade, uf, cep, complemento, latitude?, longitude? } |
| dataPedido | DateTime | Data do pedido |
| dataAgendamento | DateTime? | Data agendada para entrega |
| dataInicio | DateTime? | Início da rota |
| dataConclusao | DateTime? | Entrega concluída |
| observacoes | String? | |
| contatoNome | String? | Nome do contato |
| contatoTelefone | String? | Telefone do contato |
| createdAt | DateTime | |
| updatedAt | DateTime | |

### 2.2 EntregaTentativa

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| entregaId | String | FK → Entrega |
| tentativa | Int | Número sequencial (1, 2, 3) |
| dataTentativa | DateTime | Data/hora da tentativa |
| sucesso | Boolean | Se foi bem-sucedida |
| motivoFalha | String? | Motivo da falha (cliente ausente, endereço errado, recusou, etc.) |
| observacoes | String? | |
| createdAt | DateTime | |

### 2.3 Motorista

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| empresaId | String | FK → Empresa |
| nome | String | Nome completo |
| cpf | String | CPF (único por empresa) |
| cnh | String | Número da CNH |
| cnhCategoria | String | A, B, C, D, E |
| cnhVencimento | DateTime? | |
| telefone | String | |
| email | String? | |
| ativo | Boolean | Default true |
| createdAt | DateTime | |
| updatedAt | DateTime | |

### 2.4 Veiculo

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| empresaId | String | FK → Empresa |
| placa | String | Placa (único por empresa) |
| renavam | String? | |
| marca | String? | |
| modelo | String? | |
| ano | Int? | |
| cor | String? | |
| capacidadeKg | Decimal? | |
| tipoCarroceria | String? | |
| ativo | Boolean | Default true |
| createdAt | DateTime | |
| updatedAt | DateTime | |

### 2.5 TaxaEntrega

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| empresaId | String | FK → Empresa |
| nome | String | Ex: "Taxa Fixa", "Por KM" |
| tipo | TaxaTipo | FIXA, POR_KM, POR_PESO, FAIXA_CEP |
| valor | Decimal | Valor fixo ou valor por unidade |
| valorMinimo | Decimal? | Valor mínimo da taxa |
| raioKm | Int? | Raio de abrangência (km) |
| faixaCepInicio | String? | Início da faixa de CEP |
| faixaCepFim | String? | Fim da faixa de CEP |
| ativo | Boolean | Default true |
| createdAt | DateTime | |
| updatedAt | DateTime | |

### 2.6 Avaliacao

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| entregaId | String | FK → Entrega (único) |
| clienteId | String | FK → Cliente |
| nota | Int | 1 a 5 |
| comentario | String? | Comentário opcional |
| createdAt | DateTime | |

### 2.7 Enums

```typescript
type EntregaStatus = 'PENDENTE' | 'AGENDADO' | 'SAIU_PARA_ENTREGA' | 'ENTREGUE' | 'TENTATIVA_FALHOU' | 'CANCELADO';

type TaxaTipo = 'FIXA' | 'POR_KM' | 'POR_PESO' | 'FAIXA_CEP';
```

---

## 3. Fluxo de Status

```
PENDENTE ──→ AGENDADO ──→ SAIU_PARA_ENTREGA ──→ ENTREGUE
    │                                                │
    │                                                │
    ├──→ CANCELADO  (qualquer status exceto ENTREGUE)│
    │                                                │
    └─────────────────────→ TENTATIVA_FALHOU ←───────┘
                                    │
                                    ↓
                              SAIU_PARA_ENTREGA (nova tentativa)
```

**Regras:**
- PENDENTE: aguardando agendamento
- AGENDADO: data/hora definida
- SAIU_PARA_ENTREGA: motorista saiu para entrega
- ENTREGUE: concluída com sucesso
- TENTATIVA_FALHOU: tentativa sem sucesso (pode voltar para SAIU_PARA_ENTREGA)
- CANCELADO: pode ser cancelado de qualquer status exceto ENTREGUE

---

## 4. API Endpoints

### 4.1 Entregas (`/api/v1/entregas`)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | / | Listar entregas (filtros: status, dataInicio, dataFim, clienteId, motoristaId) |
| GET | /:id | Detalhes da entrega |
| POST | / | Criar entrega |
| PUT | /:id | Atualizar entrega |
| DELETE | /:id | Excluir entrega (só PENDENTE) |
| PATCH | /:id/agendar | Agendar entrega (PENDENTE → AGENDADO) |
| PATCH | /:id/saiu-para-entrega | Sair para entrega (AGENDADO → SAIU_PARA_ENTREGA) |
| PATCH | /:id/entregue | Confirmar entrega (SAIU_PARA_ENTREGA → ENTREGUE) |
| PATCH | /:id/tentativa-falhou | Registrar tentativa falha |
| PATCH | /:id/cancelar | Cancelar |

### 4.2 Motoristas (`/api/v1/entregas/motoristas`)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | / | Listar motoristas |
| GET | /:id | Detalhes |
| POST | / | Criar motorista |
| PUT | /:id | Atualizar |
| DELETE | /:id | Excluir |

### 4.3 Veículos (`/api/v1/entregas/veiculos`)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | / | Listar veículos |
| GET | /:id | Detalhes |
| POST | / | Criar veículo |
| PUT | /:id | Atualizar |
| DELETE | /:id | Excluir |

### 4.4 Taxas de Entrega (`/api/v1/entregas/taxas`)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | / | Listar taxas |
| GET | /:id | Detalhes |
| POST | / | Criar taxa |
| PUT | /:id | Atualizar |
| DELETE | /:id | Excluir |
| POST | /calcular | Calcular taxa para entrega (CEP + peso + km) |

### 4.5 Avaliações (`/api/v1/public/avaliar`)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | / | Criar avaliação (público, só token + nota + comentário) |
| GET | /:token | Obter avaliação por token de rastreio |

---

## 5. Endpoints Públicos

### 5.1 Rastreio (sem autenticação)

`GET /api/v1/public/rastreio/:token`

**Retorno (sanitizado):**
```json
{
  "numero": 42,
  "status": "SAIU_PARA_ENTREGA",
  "enderecoEntrega": { "logradouro": "...", "bairro": "...", "cidade": "...", "uf": "SP" },
  "dataPedido": "2026-07-01T10:00:00Z",
  "dataAgendamento": "2026-07-02T14:00:00Z",
  "tentativas": [
    { "dataTentativa": "2026-07-02T14:30:00Z", "sucesso": false, "motivoFalha": "Cliente ausente" }
  ],
  "motorista": { "nome": "João" },
  "avaliacao": null
}
```

### 5.2 Avaliar (sem autenticação)

`POST /api/v1/public/avaliar`

```json
{
  "token": "uuid-da-entrega",
  "nota": 5,
  "comentario": "Excelente atendimento!"
}
```

**Regras:**
- Só permite avaliar entregas com status ENTREGUE
- Uma avaliação por entrega (unique)
- Nota obrigatória (1-5), comentário opcional

---

## 6. Notificações (Email Automático)

| Evento | Trigger | Para | Conteúdo |
|--------|---------|------|----------|
| Entrega agendada | PENDENTE → AGENDADO | Cliente | "Sua entrega foi agendada para [data]. Acompanhe: [link]" |
| Saiu para entrega | AGENDADO → SAIU_PARA_ENTREGA | Cliente | "Seu pedido saiu para entrega! Rastreie aqui: [link]" |
| Entrega realizada | SAIU_PARA_ENTREGA → ENTREGUE | Cliente | "Entrega concluída! Avalie: [link]" |
| Tentativa falhou | SAIU_PARA_ENTREGA → TENTATIVA_FALHOU | Cliente | "Não foi possível entregar. Motivo: [motivo]. Nova tentativa em breve." |

---

## 7. Regras de Negócio

### 7.1 Cálculo de Taxa

- **FIXA**: valor único independente da distância
- **POR_KM**: valor × distância (calculada por geolocalização ou CEP)
- **POR_PESO**: valor × peso total dos itens
- **FAIXA_CEP**: verifica se CEP está dentro da faixa configurada

### 7.2 Permissões

- **Admin / Gerente**: CRUD completo + ações de status
- **Operador**: Visualizar, criar entregas, registrar tentativas
- **Motorista**: Visualizar entregas atribuídas, alterar status (SAIU_PARA_ENTREGA → ENTREGUE/TENTATIVA_FALHOU)

### 7.3 Validações

- Token de rastreio é UUID v4 gerado automaticamente na criação
- Não permitir agendar entrega sem motorista e veículo
- Não permitir entregar sem motorista atribuído
- Uma entrega só pode ser cancelada se não estiver ENTREGUE
- Ao cancelar, estornar financeiro se houver taxa de entrega

---

## 8. Frontend Pages

| Página | Rota | Descrição |
|--------|------|-----------|
| Lista Entregas | /entregas | Tabela com filtros, dashboard cards |
| Detalhes Entrega | /entregas/:id | Timeline, tentativas, avaliação |
| Motoristas | /entregas/motoristas | CRUD motoristas |
| Veículos | /entregas/veiculos | CRUD veículos |
| Taxas Entrega | /entregas/taxas | CRUD taxas |

---

## 9. Todo / Next Steps

- [ ] Prisma schema: models Entrega, EntregaTentativa, Motorista, Veiculo, TaxaEntrega, Avaliacao
- [ ] API CRUD Entregas
- [ ] API status transitions (agendar, saiuParaEntrega, entregue, tentativaFalhou, cancelar)
- [ ] API CRUD Motoristas
- [ ] API CRUD Veículos
- [ ] API CRUD Taxas + cálculo
- [ ] API pública rastreio + avaliar
- [ ] Frontend EntregasPage (lista + dashboard + timeline)
- [ ] Frontend MotoristasPage (CRUD)
- [ ] Frontend VeiculosPage (CRUD)
- [ ] Frontend TaxasEntregaPage (CRUD)
- [ ] Página pública de rastreio
- [ ] Sistema de notificações email
- [ ] Testes API (vitest + supertest)
- [ ] Testes Frontend (vitest)
- [ ] Atualizar FEATURES.md, TODO.md, stepByStep.md, AGENTS.md
- [ ] Atualizar manuais (ManualPage, AjudaPage, ManualTecnicoPage)
