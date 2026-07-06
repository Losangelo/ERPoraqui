# Módulo de Usuários (Usuarios)

## Visão Geral

CRUD completo de usuários do sistema com controle por perfil (role-based access). Integrado ao sistema de licenciamento para verificação de limite de usuários ativos.

## Stack
- Backend: Express.js + TypeScript + Prisma + Zod
- Frontend: React + shadcn/ui (Dialog + Table)

---

## Modelo de Dados (Prisma)

### Usuario

Ver modelo em `AUTH.md` — mesmo modelo `Usuario` é compartilhado.

### Enum PerfilUsuario

| Valor          | Descrição                     |
|----------------|-------------------------------|
| ADMINISTRADOR  | Acesso total ao sistema       |
| GERENTE        | Acesso gerencial              |
| USUARIO        | Acesso operacional padrão     |
| VISUALIZADOR   | Acesso somente leitura        |

---

## Endpoints da API

Base: `/api/v1/usuarios` — todos protegidos por `authMiddleware`.

### `GET /api/v1/usuarios`

Lista usuários da empresa com paginação e filtros.

**Query Params:**
| Parâmetro | Tipo     | Descrição                     |
|-----------|----------|-------------------------------|
| nome      | string   | Filtro por nome (contains)    |
| email     | string   | Filtro por email (contains)   |
| perfil    | enum     | ADMINISTRADOR, GERENTE, USUARIO, VISUALIZADOR |
| ativo     | boolean  | Filtro por status             |
| pagina    | number   | Padrão: 1                     |
| limite    | number   | Padrão: 20, Máx: 100          |

**Response:**
```json
{
  "success": true,
  "data": [{ "id": "...", "email": "...", "nome": "...", "perfil": "USUARIO", "ativo": true, "ultimoAcesso": null, "dataCriacao": "..." }],
  "meta": { "pagina": 1, "limite": 20, "total": 5, "totalPaginas": 1 }
}
```

### `GET /api/v1/usuarios/perfis`

Retorna lista de perfis disponíveis.

**Response:** `{ "success": true, "data": ["ADMINISTRADOR", "GERENTE", "USUARIO", "VISUALIZADOR"] }`

### `GET /api/v1/usuarios/:id`

Busca usuário por ID (restrito à mesma empresa).

### `POST /api/v1/usuarios`

Cria novo usuário. Middleware: `verificarLimiteRecurso('usuarios')`.

**Request Body:**
```json
{
  "email": "usuario@empresa.com",
  "nome": "João Silva",
  "senha": "123456",
  "perfil": "USUARIO",
  "ativo": true
}
```

### `PUT /api/v1/usuarios/:id`

Atualiza dados do usuário. Se senha for fornecida, faz hash. Se e-mail mudar, verifica duplicidade.

### `PATCH /api/v1/usuarios/:id/senha`

Altera senha (requer senha atual + nova senha).

**Request Body:**
```json
{ "senhaAtual": "123456", "novaSenha": "654321" }
```

### `DELETE /api/v1/usuarios/:id`

Exclui usuário permanentemente.

---

## Frontend

### UsuariosPage (`apps/web/src/pages/usuarios/UsuariosPage.tsx`)

**Funcionalidades:**
- Tabela com nome, email, perfil (badge), status (ativo/inativo), data de criação
- Botão "Novo Usuário" abre Dialog com formulário
- Botão editar abre Dialog preenchido
- Botão excluir com confirmação (`confirm()`)

**Formulário (Dialog):**
- Nome (text, obrigatório, placeholder "Nome completo do usuário")
- Email (email, obrigatório, placeholder "usuario@exemplo.com")
- Senha (password, 6+ chars, obrigatório na criação, opcional na edição)
- Perfil (select com opções do backend)
- Ativo (checkbox)

### Service (`apps/web/src/services/usuarios.ts`)

```typescript
export const usuariosService = {
  listar: (params?) => api.get('/usuarios', { params }),
  criar: (data) => api.post('/usuarios', data),
  buscar: (id) => api.get(`/usuarios/${id}`),
  atualizar: (id, data) => api.put(`/usuarios/${id}`, data),
  excluir: (id) => api.delete(`/usuarios/${id}`),
  perfis: () => api.get('/usuarios/perfis'),
};
```

---

## Regras de Negócio

1. **Multi-tenancy**: Toda operação filtra por `empresaId` do token JWT
2. **Email único**: Validado por empresa (não global)
3. **Hash de senha**: bcrypt com salt 10 na criação e atualização
4. **Limite de usuários**: Verificado via middleware `verificarLimiteRecurso('usuarios')` que consulta licença ativa
5. **Proteção**: Não é possível criar usuário ADMINISTRADOR sem permissão (campo perfil default USUARIO)
6. **Exclusão**: Física (`prisma.delete`) — sem soft delete
7. **Perfis**: Fixos (ADMINISTRADOR, GERENTE, USUARIO, VISUALIZADOR) — sem criação customizada

---

## Validações (Zod)

### UsuarioSchema (criação)
```typescript
z.object({
  email: z.string().email(),
  nome: z.string().min(1),
  senha: z.string().min(6),
  perfil: z.enum(['ADMINISTRADOR', 'GERENTE', 'USUARIO', 'VISUALIZADOR']).optional(),
  ativo: z.boolean().optional(),
})
```

### UsuarioUpdateSchema (atualização)
Todos os campos opcionais, mesmas validações.

### UsuarioFiltroSchema
```typescript
z.object({
  nome: z.string().optional(),
  email: z.string().optional(),
  perfil: z.enum([...]).optional(),
  ativo: z.boolean().optional(),
  pagina: z.number().int().positive().default(1),
  limite: z.number().int().positive().max(100).default(20),
})
```
