# Veículos (Entrega) — Especificação Técnica

## 1. Visão Geral

Módulo de cadastro de veículos para operações de entrega. Cada veículo possui placa, características (marca, modelo, ano, cor, capacidade) e tipo, podendo ser vinculado a um motorista proprietário.

**Objetivos:**
- Cadastrar veículos com dados completos (placa, marca, modelo, ano, capacidade)
- Suportar tipos: carro, moto, van, caminhão, bicicleta, outro
- Vincular veículo a motorista (para motoristas PJ que usam veículo próprio)
- Consultar por placa, tipo e situação

---

## 2. Modelo de Dados

### 2.1 VeiculoEntrega

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| empresaId | String | FK → Empresa |
| placa | String | Placa (unique por empresa) |
| marca | String? | Marca (ex: Fiat, Toyota) |
| modelo | String? | Modelo (ex: Fiorino, Hilux) |
| ano | Int? | Ano de fabricação |
| cor | String? | Cor predominante |
| capacidadeKg | Float? | Capacidade de carga em kg |
| tipo | TipoVeiculo | CARRO, MOTO, VAN, CAMINHAO, BICICLETA, OUTRO |
| proprietarioId | String? | FK → Motorista (para veículo próprio do motorista PJ) |
| ativo | Boolean | Default true |
| observacoes | String? | Observações |
| dataCriacao | DateTime | |
| dataAtualizacao | DateTime | |

**Enums:**
```prisma
enum TipoVeiculo {
  CARRO
  MOTO
  VAN
  CAMINHAO
  BICICLETA
  OUTRO
}
```

**Unique:** `[empresaId, placa]`

---

## 3. Endpoints da API

Base: `/api/v1/veiculos-entregas` — autenticado via JWT.

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | / | Criar veículo |
| GET | / | Listar veículos (filtros: placa, tipo, ativo, pagina, limite) |
| GET | /:id | Buscar por ID |
| PUT | /:id | Atualizar dados |
| PATCH | /:id/inativar | Inativar veículo |
| PATCH | /:id/ativar | Reativar veículo |

### Schema de Criação (Zod)

```ts
criarVeiculoEntregaSchema = z.object({
  placa: z.string().min(1),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  ano: z.number().int().min(1900).max(2100).optional(),
  cor: z.string().optional(),
  capacidadeKg: z.number().positive().optional(),
  tipo: z.enum(['CARRO','MOTO','VAN','CAMINHAO','BICICLETA','OUTRO']).default('CARRO'),
  proprietarioId: z.string().optional(),
  observacoes: z.string().optional(),
})
```

---

## 4. Frontend

**Localização:** `apps/web/src/pages/entregas/VeiculosEntregaPage.tsx`

- Tabela com placa, marca/modelo, ano, cor, capacidade, tipo, motorista proprietário, situação
- Dialog de criação/edição com campos conforme schema
- Select para tipo de veículo
- Select para motorista proprietário (opcional)
- Botões de inativar/reativar

---

## 5. Regras de Negócio

- Placa é obrigatória e única por empresa (sem mascara — armazenar formato ABC1234)
- Veículo inativado não pode ser associado a novas entregas
- Capacidade em kg deve ser positiva se informada
- A exclusão não é física — utiliza inativação lógica
