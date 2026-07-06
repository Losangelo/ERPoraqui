# Módulo de Autenticação (Auth)

## Visão Geral

Módulo responsável por registro, login, gerenciamento de sessão JWT e controle de acesso. Opera com tokens JWT de curta duração (24h) + refresh token (7d).

## Stack
- Backend: Express.js + TypeScript + JWT (jsonwebtoken) + bcryptjs
- Frontend: React + AuthContext (Context API) + localStorage

---

## Modelo de Dados (Prisma)

### Usuario

```prisma
model Usuario {
  id              String        @id @default(cuid())
  empresaId       String
  email           String        @unique
  nome            String
  senha           String        // bcrypt hash
  perfil          PerfilUsuario @default(USUARIO)
  ativo           Boolean       @default(true)
  ultimoAcesso    DateTime?
  dataCriacao     DateTime      @default(now())
  dataAtualizacao DateTime      @updatedAt

  empresa Empresa @relation(fields: [empresaId], references: [id])
}
```

### Enum PerfilUsuario

| Valor          | Descrição                     |
|----------------|-------------------------------|
| ADMINISTRADOR  | Acesso total ao sistema       |
| GERENTE        | Acesso gerencial              |
| USUARIO        | Acesso operacional padrão     |
| VISUALIZADOR   | Acesso somente leitura        |

---

## Endpoints da API

### `POST /api/v1/auth/register`

Registra nova empresa + usuário administrador.

**Request Body:**
```json
{
  "email": "admin@empresa.com",
  "senha": "123456",
  "nome": "Admin",
  "empresa": {
    "razaoSocial": "Empresa Ltda",
    "cnpj": "00.000.000/0001-00"
  }
}
```

**Response (201):**
```json
{
  "usuario": { "id": "...", "email": "...", "nome": "...", "perfil": "ADMINISTRADOR" },
  "empresa": { "id": "...", "razaoSocial": "..." },
  "token": "eyJ..."
}
```

**Regras:**
- Se empresa com CNPJ já existir, reutiliza (não recria)
- Se não existir, cria nova empresa
- Usuário criado sempre como ADMINISTRADOR
- Senha com hash bcrypt (salt 10)
- Verifica e-mail duplicado
- Cria licença BASICA automática para a empresa se plano BASIC existir
- Retorna JWT token (24h)

### `POST /api/v1/auth/login`

**Request Body:**
```json
{
  "email": "admin@empresa.com",
  "senha": "123456"
}
```

**Response (200):**
```json
{
  "usuario": { "id": "...", "email": "...", "nome": "...", "perfil": "ADMINISTRADOR" },
  "empresa": { "id": "...", "razaoSocial": "...", "nomeFantasia": null },
  "token": "eyJ...",
  "refreshToken": "eyJ..."
}
```

**Regras:**
- Valida credenciais com bcrypt.compare
- Verifica se usuário está ativo
- Gera JWT (24h) com payload `{ usuarioId, empresaId }`
- Gera refresh token (7d) com payload `{ usuarioId }`
- Retorna 401 para credenciais inválidas ou usuário inativo

### Validação (Zod)

```typescript
const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});
```

---

## Frontend

### LoginPage (`apps/web/src/pages/LoginPage.tsx`)

- Formulário com campos: e-mail, senha
- Valida campos obrigatórios e senha >= 6 caracteres
- Chama `POST /auth/login` via fetch
- Salva token em `localStorage`
- Chama `login()` do AuthContext que persiste usuário e token
- Redireciona para `/` em caso de sucesso

### AuthContext (`apps/web/src/stores/AuthContext.tsx`)

- Provider React que gerencia estado global de autenticação
- Armazena `user` e `token` no state + localStorage
- Expõe `login()`, `logout()`, `isAuthenticated`
- Recupera estado ao iniciar via `localStorage`

### Interceptor Axios (`apps/web/src/services/api.ts`)

- Adiciona `Authorization: Bearer {token}` em toda requisição
- Redireciona para `/login` em caso de 401

---

## Middleware de Autenticação

### `authMiddleware` (`apps/api/src/shared/middleware/auth.middleware.ts`)

```typescript
interface AuthRequest extends Request {
  usuario?: { usuarioId: string; empresaId: string };
}
```

- Extrai token do header `Authorization: Bearer <token>`
- Verifica token com `jwt.verify` usando `JWT_SECRET`
- Decodifica payload como `{ usuarioId, empresaId }`
- Injeta `req.usuario` para uso nos controllers
- Retorna 401 se token ausente ou inválido

---

## Regras de Negócio

1. **Registro**: Cria empresa + usuário admin + licença BASIC automática
2. **Login**: Gera token JWT 24h + refresh 7d
3. **Refresh**: Refresh token existe no backend mas não há rota específica para renovação
4. **Hash**: Senhas armazenadas com bcrypt (salt rounds = 10)
5. **Multi-tenancy**: Todo token carrega `empresaId` para isolamento entre empresas
6. **JWT Secret**: Fallback para 'default-secret' se `JWT_SECRET` não definido (produção deve configurar)

---

## Considerações de Segurança

- Senhas mínimas de 6 caracteres (Zod validation)
- Token expira em 24h (configurável via JWT_SECRET)
- Refresh token expira em 7d
- Proteção CSRF via Bearer token
- Interceptor frontend redireciona ao 401
- Logout apenas no frontend (remove localStorage)
- **Não implementado**: rota de logout no backend, blacklist de tokens, rate limiting
