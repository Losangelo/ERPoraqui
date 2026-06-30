# Especificação Técnica - Módulo de Cheques

## Visão Geral

Gerenciamento completo de cheques recebidos (de clientes) e emitidos (para fornecedores), com controle de situação: em carteira, depositado, compensado, devolvido.

---

## Modelo de Dados

### Cheque

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| empresaId | String | FK Empresa |
| contaBancariaId | String? | FK Conta bancária |
| clienteId | String? | FK Cliente (cheque recebido) |
| fornecedorId | String? | FK Fornecedor (cheque emitido) |
| numero | String | Número do cheque |
| banco | String | Código do banco |
| agencia | String | Agência |
| conta | String | Conta corrente |
| emitente | String | Nome do emitente |
| valor | Float | Valor |
| dataEmissao | DateTime | Data de emissão |
| dataVencimento | DateTime | Data de vencimento |
| dataCompensacao | DateTime? | Data de compensação |
| tipo | Enum(RECEBIDO, EMITIDO) | Tipo |
| situacao | Enum(EM_CARTEIRA, DEPOSITADO, COMPENSADO, DEVOLVIDO, REPASSADO, CANCELADO) | Status |
| motivoDevolucao | String? | Motivo se devolvido |

### Enums

```
TipoCheque: RECEBIDO | EMITIDO
SituacaoCheque: EM_CARTEIRA | DEPOSITADO | COMPENSADO | DEVOLVIDO | REPASSADO | CANCELADO
```

### Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/v1/cheques | Registrar cheque |
| GET | /api/v1/cheques | Listar (filtros: tipo, situacao, data) |
| GET | /api/v1/cheques/:id | Buscar |
| PUT | /api/v1/cheques/:id | Atualizar |
| POST | /api/v1/cheques/:id/depositar | Depositar |
| POST | /api/v1/cheques/:id/compensar | Compensar |
| POST | /api/v1/cheques/:id/devolver | Devolver (com motivo) |
| POST | /api/v1/cheques/:id/cancelar | Cancelar |
| GET | /api/v1/cheques/dashboard | Resumo por situação |

### Frontend

- Página: `/cheques`
- Dashboard cards: total carteira, depositado, devolvido
- Filtros: tipo, situação, período
- Ações contextuais conforme situação

### Regras de Negócio

1. Cheque só pode ser depositado se estiver EM_CARTEIRA
2. Cheque só pode ser compensado se estiver DEPOSITADO
3. Devolução requer motivo obrigatório
4. Cancelamento só permitido se não estiver COMPENSADO
5. Ao compensar, atualizar conta a receber vinculada
