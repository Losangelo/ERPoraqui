# Módulo Orçamentos — Especificação Técnica

## Visão Geral

Gerencia orçamentos de venda (propostas comerciais) com ciclo de vida completo: criação, aprovação/reprovação, expiração automática e conversão em pedido de venda.

## Fluxo Principal

```
Criar Orçamento → Aberto → Aprovar/Reprovar → Aprovado/Reprovado
                        ↘ Expirado (automático via dataValidade)
                        ↘ Converter → Pedido de Venda (status CONVERTIDO)
```

## Modelo de Dados

```prisma
enum SituacaoOrcamento { ABERTO APROVADO REPROVADO EXPIRADO CONVERTIDO CANCELADO }

model Orcamento {
  id                    String            @id @default(cuid())
  empresaId             String
  filialId              String
  clienteId             String
  numeroOrcamento       String
  serie                 String            @default("1")
  dataValidade          DateTime
  dataEmissao           DateTime?
  valorTotal            Float
  valorDesconto         Float             @default(0)
  valorFrete            Float             @default(0)
  valorOutrosAcrescimos Float             @default(0)
  observacoes           String?
  observacoesInternas   String?
  situacao              SituacaoOrcamento @default(ABERTO)
  pedidoVendaId         String?           @unique
  dataCriacao           DateTime          @default(now())
  dataAtualizacao       DateTime          @updatedAt

  empresa     Empresa         @relation
  filial      Filial          @relation
  cliente     Cliente         @relation
  pedidoVenda PedidoVenda?    @relation
  itens       ItemOrcamento[]

  @@unique([empresaId, numeroOrcamento, serie])
}

model ItemOrcamento {
  id            String   @id @default(cuid())
  orcamentoId   String
  produtoId     String
  numeroItem    Int
  quantidade    Float
  unidadeMedida String
  valorUnitario Float
  valorTotal    Float
  valorDesconto Float    @default(0)
  dataCriacao   DateTime @default(now())

  orcamento Orcamento @relation
  produto   Produto   @relation
}
```

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/v1/orcamentos | Criar orçamento (obrigatório: clienteId) |
| GET | /api/v1/orcamentos | Listar orçamentos (filtros: clienteId, filialId, situacao, dataInicial, dataFinal, pagina, limite) |
| GET | /api/v1/orcamentos/:id | Buscar orçamento por ID (inclui itens, cliente, filial, pedidoVenda) |
| PUT | /api/v1/orcamentos/:id | Atualizar orçamento (bloqueado se CONVERTIDO ou CANCELADO) |
| DELETE | /api/v1/orcamentos/:id | Excluir orçamento (apenas se não CONVERTIDO; deleta itens em cascata) |
| POST | /api/v1/orcamentos/:id/aprovar | Aprovar orçamento (situacao → APROVADO; apenas se ABERTO) |
| POST | /api/v1/orcamentos/:id/reprovar | Reprovar orçamento (situacao → REPROVADO; apenas se ABERTO) |
| POST | /api/v1/orcamentos/:id/converter | Converter orçamento em pedido de venda (cria PedidoVenda, situacao → CONVERTIDO) |
| POST | /api/v1/orcamentos/expirar | Expirar lote de orçamentos vencidos (dataValidade < now) |

## Frontend (OrcamentosPage.tsx + orcamentos.ts Service)

### Página: /orcamentos
- **Filtros**: busca textual + select de status (Aberto, Aprovado, Reprovado, Expirado, Convertido)
- **Tabela**: Nº Orçamento, Cliente, Filial, Valor (R$), Data, Validade, Status (badge colorido), Ações
- **Ações**: Aprovar (se ABERTO), Reprovar (se ABERTO), Converter em Pedido (se ABERTO ou APROVADO)

### Dialog Novo Orçamento
- LookupField para cliente (busca por nome, CPF/CNPJ)
- Input observacoes

## Regras de Negócio

1. **Numeração automática**: formato `ORC{SEQ}` com padding 6 dígitos (ex: ORC000001)
2. **Validade padrão**: 30 dias a partir da data de emissão
3. **Filial**: se não informada, usa a primeira filial encontrada da empresa
4. **Bloqueio de atualização**: orçamentos CONVERTIDOS ou CANCELADOS não podem ser alterados
5. **Bloqueio de exclusão**: orçamentos CONVERTIDOS não podem ser excluídos; delete remove itens primeiro
6. **Conversão em pedido**: copia dados do orçamento (cliente, filial, itens, valores) para um novo PedidoVenda com situação EM_ABERTO; marca orçamento como CONVERTIDO com referência ao pedido criado
7. **Expiração automática**: endpoint dispara atualização em lote de orçamentos ABERTOS com dataValidade vencida

## Validações (Zod)

- `criarOrcamentoSchema`: filialId opcional; clienteId obrigatório; itens opcional (default [])
- `atualizarOrcamentoSchema`: campos opcionais; situacao limitada a SituacaoOrcamento
- `orcamentoFiltroSchema`: filtros opcionais com paginação default (1, 20)

## Integrações

- **Pedidos de Venda**: conversão cria PedidoVenda com vinculo `pedidoVendaId` no Orcamento
- **Logging (Pino)**: todos os eventos de negócio registrados via `appLogger.business()`
- **LookupField**: formulário de criação usa o componente LookupField com source "clientes"
