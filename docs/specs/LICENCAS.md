# Módulo de Licenças (Licencas / Planos)

## Visão Geral

Sistema de licenciamento e planos do ERPoraqui. Controla acesso a módulos, limites de uso (usuários, clientes, produtos, notas fiscais) e ciclo de vida de licenças (ativação, renovação, expiração).

## Stack
- Backend: Express.js + TypeScript + Prisma + Zod
- Frontend: React + shadcn/ui + Tabs + Badge
- Middleware: `licencaGuard` + `verificarLimiteRecurso`

---

## Modelo de Dados (Prisma)

### Plano

```prisma
model Plano {
  id              String   @id @default(cuid())
  nome            String   // BASIC, PROFISSIONAL, PREMIUM
  descricao       String?
  tipoCobranca    TipoCobranca
  precoMensal     Decimal?
  precoAnual      Decimal?
  precoDefinitivo Decimal?

  // Limites
  limiteUsuarios     Int @default(5)
  limiteClientes     Int @default(1000)
  limiteProdutos     Int @default(5000)
  limiteNotasFiscais Int @default(1000)
  limiteEmpresas     Int @default(1)

  // Módulos habilitados
  moduloCrm          Boolean @default(false)
  moduloAutomacao    Boolean @default(false)
  moduloMultiEmpresa Boolean @default(false)
  moduloApi          Boolean @default(false)
  moduloBoletos      Boolean @default(true)
  moduloNfse         Boolean @default(true)
  moduloEcf          Boolean @default(true)
  moduloDre          Boolean @default(true)
  moduloPlanoContas  Boolean @default(true)

  ativo  Boolean @default(true)
  ordem  Int     @default(0)

  licencas Licenca[]
}
```

### Licenca

```prisma
model Licenca {
  id        String @id @default(cuid())
  empresaId String
  planoId   String

  chave         String        @unique
  tipoCobranca  TipoCobranca
  dataInicio    DateTime
  dataExpiracao DateTime?
  status        StatusLicenca @default(ATIVA)

  valorPago       Decimal?
  dataPagamento   DateTime?
  codigoTransacao String?

  // Limites (cópia do plano no momento da ativação)
  limiteUsuarios     Int?
  limiteClientes     Int?
  limiteProdutos     Int?
  limiteNotasFiscais Int?
  limiteEmpresas     Int?

  // Contadores atuais
  usuariosAtivos Int @default(0)
  clientesAtivos Int @default(0)
  produtosAtivos Int @default(0)
  notasEsteMes   Int @default(0)

  // Módulos (cópia do plano)
  moduloCrm          Boolean @default(false)
  moduloAutomacao    Boolean @default(false)
  moduloMultiEmpresa Boolean @default(false)
  moduloApi          Boolean @default(false)

  empresa Empresa
  plano   Plano
  logs    LicencaLog[]
}
```

### LicencaLog

```prisma
model LicencaLog {
  id              String   @id @default(cuid())
  licencaId       String
  acao            String   // ATIVACAO, RENOVACAO, UPGRADE, DOWNGRADE, CANCELAMENTO
  descricao       String?
  planoAnteriorId String?
  planoNovoId     String?
  valor           Decimal?
  dataCriacao     DateTime @default(now())
}
```

### Enums

```typescript
enum TipoCobranca { MENSAL, ANUAL, DEFINITIVO }
enum StatusLicenca { ATIVA, EXPIRADA, CANCELADA, SUSPENSA }
```

---

## Planos Padrão (Seed)

### BASIC (R$ 97/mês)
| Recurso            | Limite  |
|--------------------|---------|
| Usuários           | 3       |
| Clientes           | 500     |
| Produtos           | 1.000   |
| Notas fiscais/mês  | 500     |
| Empresas           | 1       |
| Módulos: CRM, Boletos, NFSe, ECF, DRE, Plano Contas | Sim |
| Módulos: Automação, Multi-empresa, API | Não |

### PROFISSIONAL (R$ 197/mês)
| Recurso            | Limite  |
|--------------------|---------|
| Usuários           | 10      |
| Clientes           | 3.000   |
| Produtos           | 5.000   |
| Notas fiscais/mês  | 2.000   |
| Empresas           | 3       |
| Módulos: +Multi-empresa | Sim |
| Módulos: Automação, API | Não |

### PREMIUM (R$ 397/mês)
| Recurso            | Limite   |
|--------------------|----------|
| Usuários           | 50       |
| Clientes           | 10.000   |
| Produtos           | 20.000   |
| Notas fiscais/mês  | 10.000   |
| Empresas           | 10       |
| Todos os módulos   | Sim      |

---

## Endpoints da API

Base: `/api/v1/licencas`

### Planos

| Método | Rota               | Descrição                 |
|--------|---------------------|---------------------------|
| GET    | `/planos`           | Lista planos ativos       |
| GET    | `/planos/:id`       | Busca plano por ID        |
| POST   | `/planos`           | Cria novo plano           |
| PUT    | `/planos/:id`       | Atualiza plano            |
| DELETE | `/planos/:id`       | Desativa plano (soft)     |

### Licenças

| Método | Rota                    | Descrição                          |
|--------|-------------------------|------------------------------------|
| GET    | `/licencas`             | Lista licenças (opcional empresaId)|
| GET    | `/licencas/minha`       | Licença da empresa logada          |
| GET    | `/licencas/:id`         | Busca licença por ID               |
| POST   | `/licencas/ativar`      | Ativa nova licença                 |
| POST   | `/licencas/renovar`     | Renova licença existente           |
| GET    | `/licencas/verificar/:modulo` | Verifica acesso a módulo     |
| GET    | `/licencas/limite/:tipo`| Verifica limite (usuarios, clientes, produtos, notas) |
| POST   | `/licencas/seed-planos` | Seed dos planos padrão             |
| GET    | `/licencas/publica/validar/:chave` | Valida chave de licença (público) |

---

## Middleware de Licença

### `licencaGuard(modulo)` (`apps/api/src/shared/middleware/licenca.middleware.ts`)

Middleware que protege rotas verificando se o plano da empresa tem acesso ao módulo.

**Módulos controlados:** `crm`, `automacao`, `multiempresa`, `api`, `boletos`, `nfse`, `ecf`, `dre`, `planocontas`

**Módulos básicos (sempre disponíveis):** `cadastros`, `vendas`, `estoque`, `financeiro`, `nfe`, `nfce`

**Response (403):**
```json
{
  "error": "Módulo 'api' não disponível no seu plano",
  "codigo": "MODULO_NAO_AUTORIZADO",
  "modulo": "api",
  "upgradeNecessario": true,
  "message": "Faça upgrade do seu plano para acessar este módulo"
}
```

### `verificarLimiteRecurso(tipo)`

Verifica limites de usuários, clientes, produtos ou notas.

**Response (403):**
```json
{
  "error": "Limite de usuarios atingido",
  "codigo": "LIMITE_ATINGIDO",
  "tipo": "usuarios",
  "atual": 5,
  "limite": 3,
  "upgradeNecessario": true
}
```

---

## Frontend

### PlanosPage (`apps/web/src/pages/planos/PlanosPage.tsx`)

**Funcionalidades:**
- Card de status da licença atual (nome, chave, status, dias restantes)
- 4 cards de limites: Usuários, Clientes, Produtos, Notas Fiscais (atual/limite)
- Tabs de tipo de cobrança: Mensal / Anual / Definitivo
- Grid de planos com cards coloridos (BASIC=verde, PROFISSIONAL=azul, PREMIUM=âmbar)
- Cada card mostra: nome, descrição, preço, limites, módulos (check/x)
- Plano atual destacado com ring e badge "ATUAL"
- Alertas de limite atingido

### Service (`apps/web/src/services/licencas.ts`)

```typescript
export const licencasService = {
  listarPlanos, buscarPlano, criarPlano, atualizarPlano, deletarPlano,
  listarLicencas, minhaLicenca, verificarAcesso, verificarLimite,
  ativarLicenca, renewLicenca, validarChave, seedPlanos,
};
```

---

## Regras de Negócio

1. **Ativação**: Copia limites e módulos do plano para a licença (snapshot)
2. **Chave**: Gerada no formato `XXXX-XXXX-XXXX-XXXX` (16 chars alfanuméricos)
3. **Expiração**: Cobrança DEFINITIVO não expira; MENSAL expira em 1 mês; ANUAL em 12 meses
4. **Renovação**: Estende data de expiração conforme tipo de cobrança
5. **Verificação de acesso**: Admin sempre passa (se perfil ADMINISTRADOR)
6. **Limites**: Compara contadores atuais (via Prisma count) com limites da licença
7. **Seed automático**: Ao registrar nova empresa, busca plano BASIC e cria licença automática
8. **Logs**: Toda ativação/renovação cria registro em LicencaLog
