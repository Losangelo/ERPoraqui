# Especificação Técnica - Módulo de Adiantamentos

## Visão Geral

Gestão de adiantamentos financeiros para clientes, fornecedores e funcionários. Controle de valores adiantados, datas, situação (aberto, quitado, cancelado).

---

## Modelo de Dados

### Adiantamento

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| empresaId | String | FK Empresa |
| clienteId | String? | FK Cliente |
| fornecedorId | String? | FK Fornecedor |
| funcionarioId | String? | ID do funcionário |
| tipo | String | CLIENTE, FORNECEDOR, FUNCIONARIO |
| valor | Float | Valor do adiantamento |
| dataAdiantamento | DateTime | Data do adiantamento |
| dataPrevisao | DateTime? | Data prevista para quitação |
| situacao | String | ABERTO, QUITADO, CANCELADO |
| formaPagamento | String? | DINHEIRO, PIX, CARTAO_CREDITO, CARTAO_DEBITO, BOLETO, TRANSFERENCIA, CHEQUE |
| observacoes | String? | Observações |

### Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/v1/adiantamentos | Listar (filtros: tipo, situação, período) |
| GET | /api/v1/adiantamentos/:id | Buscar |
| POST | /api/v1/adiantamentos | Criar |
| PUT | /api/v1/adiantamentos/:id | Atualizar |
| POST | /api/v1/adiantamentos/:id/quitar | Quitar |
| POST | /api/v1/adiantamentos/:id/cancelar | Cancelar |
| DELETE | /api/v1/adiantamentos/:id | Excluir (apenas se aberto) |

### Frontend

- Página: `/financeiro/adiantamentos`
- LookupField para cliente/fornecedor conforme tipo selecionado
- Seletor tipo: CLIENTE | FORNECEDOR | FUNCIONARIO
- Form: valor, data adiantamento, data previsão, forma pagamento, observações
- Tabela com filtros por tipo e situação
- Ações na linha: Editar, Quitar, Cancelar, Excluir
- Badges: Aberto (warning), Quitado (success), Cancelado (secondary)

### Regras de Negócio

1. Adiantamento aberto pode ser quitado (marca situação = QUITADO)
2. Adiantamento aberto pode ser cancelado (marca situação = CANCELADO)
3. Exclusão permitida apenas se ABERTO
4. Ao quitar, gera lançamento no fluxo de caixa (saída se for adiantamento concedido)
5. Tipo define qual entidade vinculada: CLIENTE → clienteId, FORNECEDOR → fornecedorId
6. Unique por registro sem chave composta específica
