# Módulo de Parâmetros do Sistema (Parametros)

## Visão Geral

Sistema de configuração chave-valor por empresa. Permite armazenar parâmetros de configuração para diferentes módulos do ERP. Suporta tipos: TEXTO, NUMERO, BOOLEANO, DATA, JSON.

## Stack
- Backend: Express.js + TypeScript + Prisma + Zod + Pino Logger
- Frontend: React + shadcn/ui + Tailwind

---

## Modelo de Dados (Prisma)

### ParametroSistema

```prisma
model ParametroSistema {
  id              String        @id @default(cuid())
  empresaId       String
  chave           String
  valor           String
  descricao       String?
  tipo            TipoParametro @default(TEXTO)
  modulo          ModuloSistema
  ativo           Boolean       @default(true)
  dataCriacao     DateTime      @default(now())
  dataAtualizacao DateTime      @updatedAt

  empresa Empresa @relation(fields: [empresaId], references: [id])
  @@unique([empresaId, chave])
}
```

### Enum TipoParametro

| Valor    | Descrição              |
|----------|------------------------|
| TEXTO    | String livre           |
| NUMERO   | Valor numérico         |
| BOOLEANO | true / false           |
| DATA     | Data ISO               |
| JSON     | Objeto JSON            |

### Enum ModuloSistema

| Valor       | Descrição               |
|-------------|-------------------------|
| GERAL       | Configurações gerais    |
| CADASTROS   | Cadastros básicos       |
| VENDAS      | Módulo de vendas        |
| COMPRAS     | Módulo de compras       |
| ESTOQUE     | Módulo de estoque       |
| FINANCEIRO  | Módulo financeiro       |
| FISCAL      | Módulo fiscal           |
| NF_E        | Nota Fiscal Eletrônica  |
| RELATORIOS  | Relatórios              |

---

## Endpoints da API

Base: `/api/v1/parametros` — todos protegidos por `authMiddleware`.

### `GET /api/v1/parametros`

Lista parâmetros com filtros opcionais.

| Query    | Tipo    | Descrição                          |
|----------|---------|------------------------------------|
| modulo   | string  | Filtrar por módulo                 |
| ativo    | boolean | Filtrar por status                 |
| busca    | string  | Busca na chave e descrição (ILIKE) |

**Response:** `{ "success": true, "data": [{ id, empresaId, chave, valor, descricao, tipo, modulo, ativo, dataCriacao, dataAtualizacao }] }`

### `GET /api/v1/parametros/modulo/:modulo`

Retorna parâmetros ativos de um módulo como objeto chave-valor.

**Response:** `{ "success": true, "data": { "NF_E_AMBIENTE": "2", "NF_E_CERTIFICADO": "/caminho/..." } }`

### `GET /api/v1/parametros/:id`

Busca parâmetro por ID.

### `POST /api/v1/parametros`

Cria novo parâmetro. Chave deve ser única por empresa.

**Request Body:**
```json
{
  "chave": "EMPRESA_NOME",
  "valor": "ERPoraqui Ltda",
  "descricao": "Nome da empresa",
  "tipo": "TEXTO",
  "modulo": "GERAL",
  "ativo": true
}
```

### `PUT /api/v1/parametros/:id`

Atualiza parâmetro.

### `PATCH /api/v1/parametros/:id/inativar` / `ativar`

Ativa/desativa parâmetro.

---

## Frontend

### ParametrosPage (`apps/web/src/pages/ParametrosPage.tsx`)

**Funcionalidades:**
- Cards de resumo: Total, Ativos, Inativos
- Filtro por módulo (select) + busca textual
- Tabela: Módulo (badge), Chave (monospace), Valor, Descrição, Status (toggle), Ações (editar)
- Toggle ativar/inativar inline
- Dialog de criação/edição: Módulo, Chave, Valor, Descrição

### Service (`apps/web/src/services/parametros.ts`)

```typescript
export const parametrosService = {
  listar: (filtros) => api.get('/parametros', { params }),
  buscarPorId: (id) => api.get(`/parametros/${id}`),
  porModulo: (modulo) => api.get(`/parametros/modulo/${modulo}`),
  criar: (dados) => api.post('/parametros', dados),
  atualizar: (id, dados) => api.put(`/parametros/${id}`, dados),
  inativar: (id) => api.patch(`/parametros/${id}/inativar`),
  ativar: (id) => api.patch(`/parametros/${id}/ativar`),
};
```

---

## Parâmetros Padrão do Sistema

### Geral
| Chave                    | Tipo     | Default  | Descrição                        |
|--------------------------|----------|----------|----------------------------------|
| EMPRESA_PADRAO           | TEXTO    | —        | Empresa padrão do sistema        |
| MOEDA_PADRAO             | TEXTO    | BRL      | Moeda padrão                     |
| DECIMAIS_QUANTIDADE      | NUMERO   | 4        | Casas decimais para quantidade   |
| DECIMAIS_VALOR           | NUMERO   | 2        | Casas decimais para valores      |

### Vendas
| Chave                     | Tipo     | Default | Descrição                          |
|---------------------------|----------|---------|------------------------------------|
| VENDAS_PERMITIR_DESCONTO  | BOOLEANO | true    | Permitir desconto nas vendas       |
| VENDAS_DESCONTO_MAXIMO    | NUMERO   | 10      | Desconto máximo permitido (%)      |
| VENDAS_OBRIGAR_CLIENTE    | BOOLEANO | true    | Obrigar cliente na venda           |
| VENDAS_OBRIGAR_VENDEDOR   | BOOLEANO | false   | Obrigar vendedor na venda          |

### Estoque
| Chave                   | Tipo     | Default | Descrição                        |
|-------------------------|----------|---------|----------------------------------|
| ESTOQUE_CONTROLAR       | BOOLEANO | true    | Controlar estoque                |
| ESTOQUE_BLOQUEAR_SEM    | BOOLEANO | true    | Bloquear venda sem estoque       |
| ESTOQUE_ESTOQUE_NEGATIVO| BOOLEANO | false   | Permitir estoque negativo        |

### NF-e
| Chave                | Tipo   | Default | Descrição                                    |
|----------------------|--------|---------|----------------------------------------------|
| NF_E_AMBIENTE        | TEXTO  | 2       | Ambiente NF-e (1=Produção, 2=Homologação)    |
| NF_E_CERTIFICADO     | TEXTO  | —       | Caminho do certificado digital               |
| NF_E_SENHA_CERTIFICADO | TEXTO | —      | Senha do certificado digital                 |
| NF_E_IBPT_TOKEN      | TEXTO  | —       | Token IBPT para tributária                   |

---

## Regras de Negócio

1. **Chave única**: A combinação `empresaId + chave` é única
2. **Multi-tenancy**: Todos os parâmetros são isolados por empresa
3. **Tipos**: O tipo é apenas informativo — o valor é sempre string
4. **Logger**: Operações de criação, atualização, ativação e inativação são logadas via `appLogger.business()`
5. **Parâmetros padrão**: Definidos em `dto/parametro.dto.ts` como constantes, mas não são seed automáticos — cabe ao sistema ou admin criá-los
