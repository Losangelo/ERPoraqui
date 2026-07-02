# Contratos + Garantias + Devoluções — Especificação Técnica

## 1. Contratos

### Modelo
- **Contrato**: cliente, plano/serviço, vigência (início/fim), valor, tipoReajuste (IGPM/IPCA/NF), status, observações
- **ContratoMedicao**: contratoId, período, valor, dataVencimento, status (PENDENTE/FATURADO/CANCELADO)

### Ciclo de Vida
rascunho → ativo → suspenso → encerrado

### Regras de Negócio
- Geração automática de medições mensais para contratos ativos
- Reajuste automático com base no índice na data de aniversário
- Geração de pedido de venda a partir da medição faturada

## 2. Garantias

### Modelo
- **Garantia**: produto, cliente, venda, prazo (dias), tipo (FABRICA/ESTENDIDA/LEGAL), cobertura, status
- **GarantiaRegra**: produto (ou categoria), prazo padrão, cobertura, texto termos

### Regras de Negócio
- Elegibilidade: verifica se produto está dentro do prazo da garantia
- Cobertura: define o que cobre (defeito fabricação, assistência, peças)
- Recuperação: acionamento do fornecedor quando garantia de fábrica

## 3. Devoluções/RMA

### Modelo
- **Devolucao**: venda/pedido, cliente, motivo (DEFEITO/TROCA/ARREPENDIMENTO/AVARIA), data, status, destino, observações
- **DevolucaoItem**: devolucaoId, produto, quantidade, valor, condicao (NOVO/DEFEITO/AVARIADO)

### Fluxo
solicitação → inspeção → destinação (reparo/substituição/crédito)

### Regras de Negócio
- Geração de NF-e de devolução quando destinação for substituição
- Crédito automático em conta a receber quando destinação for crédito
- Rastreabilidade por OS/série do produto

## 4. API Endpoints

### Contratos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /contratos | Listar contratos |
| GET | /contratos/:id | Buscar contrato |
| POST | /contratos | Criar contrato |
| PUT | /contratos/:id | Atualizar contrato |
| DELETE | /contratos/:id | Excluir (só rascunho) |
| POST | /contratos/:id/ativar | Ativar contrato |
| POST | /contratos/:id/suspender | Suspender |
| POST | /contratos/:id/encerrar | Encerrar |
| GET | /contratos/:id/mensoes | Listar medições |
| POST | /contratos/:id/mensoes | Criar medição manual |
| POST | /contratos/:id/mensoes/:mid/faturar | Faturar medição |

### Garantias
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /garantias | Listar garantias |
| GET | /garantias/:id | Buscar garantia |
| POST | /garantias | Criar garantia |
| PUT | /garantias/:id | Atualizar |
| DELETE | /garantias/:id | Excluir |
| GET | /garantias/regras | Listar regras |
| POST | /garantias/regras | Criar regra |
| PUT | /garantias/regras/:id | Atualizar regra |
| DELETE | /garantias/regras/:id | Excluir regra |
| GET | /garantias/verificar/:produtoId/:clienteId | Verificar elegibilidade |

### Devoluções
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /devolucoes | Listar devoluções |
| GET | /devolucoes/:id | Buscar devolução |
| POST | /devolucoes | Criar solicitação |
| PUT | /devolucoes/:id | Atualizar |
| POST | /devolucoes/:id/aprovar | Aprovar inspeção |
| POST | /devolucoes/:id/rejeitar | Rejeitar |
| POST | /devolucoes/:id/destinar | Definir destinação |
| DELETE | /devolucoes/:id | Excluir (só solicitação) |
