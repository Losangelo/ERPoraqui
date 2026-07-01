# Módulo Multi-empresa — Especificação Técnica

## Visão Geral

Gerencia grupos econômicos onde múltiplas empresas (CNPJs distintos) operam sob同一 licença. Cada empresa do grupo mantém dados independentes (clientes, produtos, vendas), mas compartilham acesso via login único.

## Conceitos

| Termo | Descrição |
|-------|-----------|
| **Matriz** | Empresa principal do grupo, gerencia as demais |
| **Filial (grupo)** | Empresa vinculada a uma matriz no grupo econômico |
| **Grupo Econômico** | Conjunto de empresas vinculadas via matrizId |

## Modelo de Dados (Prisma)

```prisma
model Empresa {
  id                String   @id @default(cuid())
  matrizId          String?
  matriz            Empresa? @relation("EmpresasGrupo", fields: [matrizId], references: [id])
  empresasVinculadas Empresa[] @relation("EmpresasGrupo")
}
```

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /multi-empresa/grupo | Lista empresas do grupo do usuário |
| POST | /multi-empresa/vincular | Vincula empresa ao grupo (licencaGuard multiempresa) |
| POST | /multi-empresa/desvincular/:filialId | Desvincula empresa do grupo |
| GET | /multi-empresa/disponiveis | Empresas disponíveis para vincular |
| GET | /multi-empresa/:id | Busca empresa por ID |

## Proteção

- Rota `vincular` protegida por `licencaGuard('multiempresa')`
- Limites por plano: BASIC=1, PROFISSIONAL=3, PREMIUM=10 empresas
- Usuários da matriz acessam dados das filiais automaticamente
- Usuários de filiais acessam apenas seus próprios dados

## Frontend

- Rota `/multi-empresa`
- Sidebar: Sistema > Multi-empresa
- Exibe cards: tipo (Matriz/Filial), empresas vinculadas
- Tabela com ações de desvincular
- Dialog para vincular nova empresa

## Dependências

- `apps/api/src/modules/multi-empresa/` — rotas, service, controller
- `apps/web/src/pages/multi-empresa/MultiEmpresaPage.tsx`
- `apps/web/src/services/multi-empresa.ts`
- `apps/api/src/shared/middleware/licenca.middleware.ts`
