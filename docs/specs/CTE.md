# CT-e — Conhecimento de Transporte Eletrônico — Especificação Técnica

## 1. Visão Geral

Módulo de emissão de CT-e (Conhecimento de Transporte Eletrônico) modelo 57. Gerencia o ciclo de vida do documento: Em Digitação → Autorizado → Cancelado/Encerrado. Gera chave de acesso de 44 dígitos com cálculo de dígito verificador (módulo 11). Utiliza LookupField para seleção de tomador, remetente e destinatário.

## 2. Modelo de Dados (Prisma)

### Cte
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| empresaId | String | FK → Empresa |
| filialId | String | FK → Filial |
| numero | Int | Número sequencial por filial |
| serie | String | Série (default: "1") |
| chaveAcesso | String | Chave de 44 dígitos (unique) |
| modelo | String | "57" |
| tomadorId | String | FK → Cliente (tomador) |
| tomadorTipo | String | REMETENTE \| DESTINATARIO \| OUTROS |
| remetenteId | String? | FK → Cliente (remetente, opcional) |
| destinatarioId | String? | FK → Cliente (destinatário, opcional) |
| tipoServico | String | NORMAL \| SUBCONTRATACAO \| REDESPACHO \| MISTO |
| valorFrete | Float | |
| valorCarga | Float | |
| naturezaCarga | String? | Ex: granel, frigorífica, perigosa |
| especieCarga | String? | Ex: caixas, paletes, tambores |
| peso | Float? | Peso total em kg |
| volumes | Int? | Quantidade de volumes |
| situacao | String | EM_DIGITACAO \| AUTORIZADO \| CANCELADO \| ENCERRADO (default: EM_DIGITACAO) |
| dataEmissao | DateTime | |
| dataCriacao | DateTime | |
| dataAtualizacao | DateTime | |
| @@unique | | [empresaId, numero] |

### Relacionamentos
- `tomador` → Cliente (CteTomador)
- `remetente` → Cliente? (CteRemetente)
- `destinatario` → Cliente? (CteDestinatario)

## 3. API Endpoints

Base: `/api/v1/cte` (autenticação JWT obrigatória)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Lista CT-es (filtros: pagina, limite, situacao, periodoIni, periodoFin) |
| GET | `/:id` | Busca CT-e por ID |
| POST | `/` | Cria CT-e (gera número sequencial + chave 44 dígitos) |
| PUT | `/:id` | Atualiza CT-e |
| DELETE | `/:id` | Exclui CT-e (só EM_DIGITACAO) |
| POST | `/:id/cancelar` | Cancela CT-e (se EM_DIGITACAO ou AUTORIZADO) |

### DTOs (Zod)

**criarCteSchema:**
```typescript
{
  filialId: string
  tomadorId: string
  tomadorTipo: 'REMETENTE' | 'DESTINATARIO' | 'OUTROS'
  remetenteId?: string
  destinatarioId?: string
  tipoServico: 'NORMAL' | 'SUBCONTRATACAO' | 'REDESPACHO' | 'MISTO'
  valorFrete: number (coerce)
  valorCarga: number (coerce)
  naturezaCarga?: string
  especieCarga?: string
  peso?: number (coerce)
  volumes?: number (coerce, int)
}
```

## 4. Frontend

**Página:** `CtePage.tsx` — rota `/cte`

### Componentes
- **Select filtro situação:** Todas, Em Digitação, Autorizado, Cancelado, Encerrado
- **Tabela CT-es:** Nº, Chave Acesso (truncada), Tomador, Tipo Serviço, Valor Frete, Situação (colorida), Data, Ações
- **Botões ação:** Detalhes (Eye), Excluir (Trash2 — só EM_DIGITACAO)
- **Dialog Novo CT-e:** Select Filial, Select Tipo Tomador, Select Tipo Serviço, LookupField Tomador/Remetente/Destinatário, Valor Frete/Carga, Natureza/Espécie Carga, Peso/Volumes
- **Dialog Detalhes:** Chave completa, Série, Modelo, Tipo Serviço, Tomador, Remetente, Destinatário, Valores, Natureza, Espécie, Peso, Volumes, Data Emissão + botão Cancelar

### Service (`cte.ts`)
```typescript
listarCtes(params?)           // GET /cte
buscarCte(id)                 // GET /cte/:id
criarCte(dados)               // POST /cte
atualizarCte(id, dados)       // PUT /cte/:id
excluirCte(id)                // DELETE /cte/:id
cancelarCte(id)               // POST /cte/:id/cancelar
```

## 5. Regras de Negócio

1. **Geração de chave de acesso (44 dígitos):**
   - Formato: `UF + AAMM + CNPJ + modelo(57) + serie(001) + numero(9 dígitos) + tpEmis(1) + codigo(8 zeros) + DV`
   - DV calculado via módulo 11 (peso 2-9, cíclico)
2. **Numeração sequencial:** Número incrementa automaticamente por filial
3. **Exclusão:** Só permitida se situacao = EM_DIGITACAO
4. **Cancelamento:** Permitido se EM_DIGITACAO ou AUTORIZADO
5. **Include obrigatório:** Tomador, remetente e destinatário sempre incluídos nas queries

## 6. Validações

- `empresaId` obrigatório (token JWT)
- Retorno 401 se empresaId ausente
- Exclusão bloqueada se não estiver em digitação
- Cancelamento bloqueado se situação incompatível
- Zod schemas com `z.coerce.number()` para conversão de tipos
- Tratamento de erro com tipagem `error instanceof Error`
