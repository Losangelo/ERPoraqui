# Módulo de API Pública (API Publica)

## Visão Geral

API REST pública para integração externa com o ERPoraqui. Permite que sistemas terceiros consultem dados de clientes e produtos usando chave de API. Requer licença com módulo `api` habilitado.

## Stack
- Backend: Express.js + TypeScript + Prisma + JWT + Zod
- Autenticação: API Key (Bearer token via chave de licença)

---

## Endpoints da API

Base: `/api/v1/public`

### `GET /api/v1/public/endpoints`

Catálogo de endpoints públicos disponíveis (sem autenticação).

**Response (200):**
```json
{
  "message": "API Pública do ERPoraqui",
  "version": "1.0.0",
  "endpoints": [
    { "path": "/api/v1/public/clientes", "metodo": "GET", "descricao": "Listar clientes", "autenticacao": "Bearer Token (chave de API)" },
    { "path": "/api/v1/public/clientes/:id", "metodo": "GET", "descricao": "Buscar cliente por ID", "autenticacao": "Bearer Token (chave de API)" },
    { "path": "/api/v1/public/produtos", "metodo": "GET", "descricao": "Listar produtos", "autenticacao": "Bearer Token (chave de API)" },
    { "path": "/api/v1/public/produtos/:id", "metodo": "GET", "descricao": "Buscar produto por ID", "autenticacao": "Bearer Token (chave de API)" },
    { "path": "/api/v1/public/pedidos", "metodo": "GET", "descricao": "Listar pedidos", "autenticacao": "Bearer Token (chave de API)" },
    { "path": "/api/v1/public/pedidos", "metodo": "POST", "descricao": "Criar pedido", "autenticacao": "Bearer Token (chave de API)" }
  ]
}
```

> **Nota:** Os endpoints de pedidos estão documentados no catálogo mas **não implementados** nas rotas.

### `GET /api/v1/public/gerar-chave`

Gera/regenera chave de API para a empresa autenticada via JWT.

**Autenticação:** JWT (token de usuário)

**Response (200):** `{ "chave": "API-ABCDEFGHIJ1234567890" }`

**Regras:**
- Requer licença ativa com módulo `api` habilitado
- Substitui a chave atual da licença
- Formato: `API-` + 20 caracteres alfanuméricos

### `GET /api/v1/public/clientes`

Lista clientes ativos da empresa (máx 100 registros).

**Autenticação:** Bearer Token (chave de API da licença)

**Response (200):** `[{ id, nome, tipoPessoa, documento, email, telefone, ... }]`

### `GET /api/v1/public/clientes/:id`

Busca cliente por ID.

### `GET /api/v1/public/produtos`

Lista produtos ativos da empresa (máx 100 registros).

**Response (200):** `[{ id, codigoInterno, nome, precoVenda, ... }]`

### `GET /api/v1/public/produtos/:id`

Busca produto por ID.

---

## Autenticação

### Fluxo de Autenticação

1. Usuário logado (JWT) chama `GET /api/v1/public/gerar-chave`
2. Sistema retorna chave no formato `API-XXXXXXXXXXXXXXXXXXXX`
3. Sistema externo usa a chave como Bearer token em todas as requisições
4. Backend valida a chave consultando a licença ativa

### Validação (`APIPublicaService.verificarAcessoAPI`)

```typescript
async verificarAcessoAPI(chaveAPI: string): Promise<{ valido: boolean; empresa?: any }>
```

1. Busca licença com a chave fornecida
2. Verifica se licença está ATIVA e não expirada
3. Verifica se o plano tem `moduloApi = true`
4. Retorna dados da empresa associada

---

## Middleware de Licença

### `licencaGuard('api')` (`apps/api/src/shared/middleware/licenca.middleware.ts`)

Todas as rotas públicas (exceto `/endpoints` e `/gerar-chave`) são protegidas pelo guard de licença que verifica se o módulo `api` está habilitado no plano.

---

## Service (`apps/api/src/modules/api-publica/api-publica.service.ts`)

### `APIPublicaService`

```typescript
class APIPublicaService {
  constructor(private prisma: PrismaService, private licencasService: LicencasService) {}

  async verificarAcessoAPI(chaveAPI: string): Promise<{ valido: boolean; empresa?: any }>
  async gerarChaveAPI(empresaId: string): Promise<string>
  async listarEndpointsPublicos(): Promise<Endpoint[]>
}
```

---

## Regras de Negócio

1. **Chave de API**: Vinculada à licença da empresa, não ao usuário
2. **Regeneração**: Chamar `gerar-chave` substitui a chave anterior (invalida a antiga)
3. **Módulo API**: Controlado por plano (BASIC=desabilitado, PROFISSIONAL=desabilitado, PREMIUM=habilitado)
4. **Rate limiting**: Não implementado
5. **Limite de registros**: 100 registros por chamada (sem paginação)
6. **Somente leitura**: Endpoints implementados são apenas GET (POST pedidos documentado mas não implementado)
7. **Isolamento**: Cada chave acessa apenas dados da sua empresa
8. **Validação dupla**: `licencaGuard('api')` + `verificarAcessoAPI()` — redundância proposital para segurança
