# Módulo de Logs do Sistema

## Visão Geral

Sistema centralizado de logging que combina Pino (console) com persistência em banco de dados PostgreSQL. Registra eventos de autenticação, API, regras de negócio, validações, segurança e erros.

## Stack
- Backend: Express.js + Pino (pino, pino-pretty) + Prisma
- Frontend: React + shadcn/ui + fetch API

---

## Sistema de Logger (`apps/api/src/shared/logger/logger.ts`)

### Arquitetura

O logger é dual:
1. **Console** (Pino): Logs formatados com `pino-pretty` em desenvolvimento
2. **Banco** (Prisma): Persistência assíncrona em `LogSistema`

### Categorias (enum LogCategory)

| Categoria   | Descrição                          |
|-------------|------------------------------------|
| `auth`      | Login, logout, autenticação        |
| `api`       | Requisições HTTP                   |
| `database`  | Operações de banco de dados        |
| `business`  | Regras de negócio                  |
| `validation`| Validações                         |
| `security`  | Eventos de segurança               |
| `system`    | Eventos gerais do sistema          |

### Níveis (enum LogLevel)

| Nível   | Uso                                |
|---------|------------------------------------|
| `info`  | Informação geral                   |
| `warn`  | Aviso / alerta                     |
| `error` | Erro                               |
| `debug` | Depuração (não persiste em banco)  |

### Métodos do Logger

```typescript
appLogger.info(message, metadata?)         // Log info + persist
appLogger.warn(message, metadata?)         // Log warn + persist
appLogger.error(message, error?, metadata?) // Log error + persist (inclui stack trace)
appLogger.debug(message, metadata?)        // Log debug (não persiste)

appLogger.http(req, statusCode, responseTime)  // Log automático de requisições HTTP
appLogger.auth(action, success, metadata?)     // Eventos de autenticação
appLogger.database(action, duration, metadata?)// Operações de banco
appLogger.business(action, metadata?)          // Regras de negócio
appLogger.validation(action, errors[], metadata?) // Erros de validação
appLogger.security(action, metadata?)          // Eventos de segurança

// Consulta
appLogger.getLogs(filters)   // Busca logs com paginação e filtros
appLogger.getStats(empresaId?) // Estatísticas agregadas
```

### Interface LogMetadata

```typescript
interface LogMetadata {
  category: LogCategory;
  action: string;
  userId?: string;
  empresaId?: string;
  requestId?: string;
  [key: string]: unknown;
}
```

---

## Modelo de Dados (Prisma)

### LogSistema

```prisma
model LogSistema {
  id          String   @id @default(cuid())
  empresaId   String?
  usuarioId   String?
  categoria   String
  acao        String
  nivel       String
  mensagem    String
  detalhes    Json?    // Metadados extras
  ip          String?
  userAgent   String?
  dataCriacao DateTime @default(now())

  @@index([empresaId])
  @@index([usuarioId])
  @@index([categoria])
  @@index([nivel])
  @@index([dataCriacao])
}
```

---

## Endpoints da API

Base: `/api/v1/logs`

### `GET /api/v1/logs`

Lista logs com paginação e filtros.

**Query Params:**
| Parâmetro   | Tipo     | Descrição                    |
|-------------|----------|------------------------------|
| categoria   | string   | auth, api, business, etc     |
| nivel       | string   | info, warn, error, debug     |
| busca       | string   | Busca em mensagem e ação     |
| dataInicio  | date     | Data inicial (ISO)           |
| dataFim     | date     | Data final (ISO)             |
| pagina      | number   | Padrão: 1                    |
| limite      | number   | Padrão: 50                   |

**Response:**
```json
{
  "dados": [{
    "id": "...",
    "categoria": "auth",
    "acao": "login",
    "nivel": "info",
    "mensagem": "Auth: login - SUCCESS",
    "detalhes": { "success": true, "userId": "..." },
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/...",
    "dataCriacao": "2026-07-06T10:00:00.000Z"
  }],
  "meta": { "pagina": 1, "limite": 50, "total": 100, "totalPaginas": 2 }
}
```

### `GET /api/v1/logs/estatisticas`

Retorna estatísticas agregadas dos logs.

**Response:**
```json
{
  "porCategoria": [{ "categoria": "auth", "quantidade": 50 }],
  "porNivel": [{ "nivel": "info", "quantidade": 200 }],
  "totalHoje": 15,
  "ultimosErros": [{ ... }]
}
```

---

## Frontend

### LogsPage (`apps/web/src/pages/logs/LogsPage.tsx`)

**Funcionalidades:**
- 4 cards de estatísticas: Total Hoje, INFO, WARN, ERROR (com ícones por nível)
- Filtros: busca textual, categoria (select), nível (select)
- Tabela com: Data, Nível (ícone colorido), Categoria, Ação, Mensagem, IP
- Botão "Atualizar" para refresh manual
- Spinner de loading

**Ícones por nível:**
- `info` → Info (azul)
- `warn` → AlertTriangle (amarelo)
- `error` → AlertCircle (vermelho)
- `debug` → Bug (cinza)

---

## Regras de Negócio

1. **Persistência assíncrona**: Falhas ao salvar no banco não afetam a aplicação (try/catch)
2. **Nível DEBUG**: Não persiste no banco (apenas console)
3. **Rotação**: Não há política de rotação/expurgo implementada
4. **HTTP logging**: Captura método, URL, status code, response time, IP, User-Agent
5. **Separação de concerns**: Logger é um módulo shared, usado por todos os módulos
6. **Pino em produção**: Sem `pino-pretty`, logs em JSON puro (mais eficiente)
