# Motoristas — Especificação Técnica

## 1. Visão Geral

Módulo de cadastro de motoristas para operações de entrega. Suporta motoristas próprios (CLT) e PJ (autônomos/motoboys), com controle de CNH, categorias e situação ativo/inativo.

**Objetivos:**
- Cadastrar motorista com dados pessoais e documentação
- Diferenciar motorista próprio de PJ
- Consultar motoristas por nome, tipo e situação

---

## 2. Modelo de Dados

### 2.1 Motorista

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| empresaId | String | FK → Empresa |
| nome | String | Nome completo |
| cpf | String? | CPF |
| tipo | TipoMotorista | PROPRIO (CLT) ou PJ |
| cnh | String? | Número da CNH |
| cnhCategoria | String? | Categoria (A, B, C, D, E) |
| telefone | String? | Telefone de contato |
| email | String? | E-mail |
| ativo | Boolean | Default true |
| observacoes | String? | Observações |
| dataCriacao | DateTime | |
| dataAtualizacao | DateTime | |

**Enums:**
```prisma
enum TipoMotorista {
  PROPRIO
  PJ
}
```

---

## 3. Endpoints da API

Base: `/api/v1/motoristas` — autenticado via JWT (Bearer token).

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | / | Criar motorista |
| GET | / | Listar motoristas (filtros: nome, tipo, ativo, pagina, limite) |
| GET | /:id | Buscar por ID |
| PUT | /:id | Atualizar dados |
| PATCH | /:id/inativar | Inativar motorista |
| PATCH | /:id/ativar | Reativar motorista |

### Schema de Criação (Zod)

```ts
criarMotoristaSchema = z.object({
  nome: z.string().min(1),
  cpf: z.string().optional(),
  tipo: z.enum(['PROPRIO', 'PJ']).default('PROPRIO'),
  cnh: z.string().optional(),
  cnhCategoria: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email().optional(),
  observacoes: z.string().optional(),
})
```

---

## 4. Frontend

**Localização:** `apps/web/src/pages/entregas/MotoristasPage.tsx`

- Tabela com nome, CPF, tipo, CNH, telefone, situação (ativo/inativo)
- Dialog de criação/edição com campos conforme schema
- Botões de inativar/reativar
- Indicador visual de ativo/inativo (badge)

---

## 5. Regras de Negócio

- Motorista inativado não pode ser associado a novas entregas
- CPF não deve conter máscara no banco (armazenar apenas dígitos)
- A exclusão não é física — utiliza inativação lógica
