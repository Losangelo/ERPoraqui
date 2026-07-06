# Módulo Pedidos de Venda — Especificação Técnica

## Visão Geral

Gerencia pedidos de venda com fluxo de aprovação (pendente → aprovado → enviado → entregue), controle de itens, cálculo automático de contas a receber e integração com fluxo de caixa e NF-e.

## Fluxo Principal

```
Criar Pedido (itens + condição pgto) → Pendente → Aprovar → Confirmado → Enviar → Enviado → Entregue
```

## Modelo de Dados

```prisma
enum TipoOperacao { VENDA DEVOLUCAO CONSIGNACAO REMESSA }
enum SituacaoPedido { EM_ABERTO CONFIRMADO EM_PRODUCAO ENVIADO ENTREGUE CANCELADO }

model PedidoVenda {
  id                    String         @id @default(cuid())
  empresaId             String
  filialId              String
  clienteId             String
  numeroPedido          String
  serie                 String         @default("1")
  tipoOperacao          TipoOperacao   @default(VENDA)
  situacao              SituacaoPedido @default(EM_ABERTO)
  dataEmissao           DateTime?
  dataEntrega           DateTime?
  valorTotal            Float
  valorDesconto         Float          @default(0)
  valorFrete            Float          @default(0)
  valorOutrosAcrescimos Float          @default(0)
  observacoes           String?
  observacoesInternas   String?
  condicaoPagamento     String?        // A_VISTA, A_PRAZO, PARCELADO
  quantidadeParcelas    Int?           @default(1)
  intervaloParcelas     Int?           @default(30)
  primeiraParcelaDias   Int?           @default(0)
  dataCriacao           DateTime       @default(now())
  dataAtualizacao       DateTime       @updatedAt

  empresa       Empresa           @relation
  filial        Filial            @relation
  cliente       Cliente           @relation
  itens         ItemPedidoVenda[]
  contasReceber ContaReceber[]
  orcamento     Orcamento?
  notaFiscal    NotaFiscal?
  devolucoes    Devolucao[]

  @@unique([empresaId, numeroPedido, serie])
}

model ItemPedidoVenda {
  id            String   @id @default(cuid())
  pedidoVendaId String
  produtoId     String
  numeroItem    Int
  quantidade    Float
  unidadeMedida String
  valorUnitario Float
  valorTotal    Float
  valorDesconto Float    @default(0)
  dataCriacao   DateTime @default(now())

  pedidoVenda PedidoVenda @relation
  produto     Produto     @relation
}
```

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/v1/pedidos-venda | Criar pedido (obrigatório: filialId, clienteId, itens) |
| GET | /api/v1/pedidos-venda | Listar pedidos (filtros: clienteId, filialId, situacao, dataInicial, dataFinal, pagina, limite) |
| GET | /api/v1/pedidos-venda/:id | Buscar pedido por ID (inclui itens, cliente, filial, contasReceber) |
| PUT | /api/v1/pedidos-venda/:id | Atualizar dados do pedido |
| PATCH | /api/v1/pedidos-venda/:id/cancelar | Cancelar pedido (situacao → CANCELADO) |
| PATCH | /api/v1/pedidos-venda/:id/aprovar | Aprovar pedido (situacao → CONFIRMADO, gera contas a receber ou fluxo de caixa) |
| PATCH | /api/v1/pedidos-venda/:id/enviar | Marcar como enviado (situacao → ENVIADO) |

## Frontend (OrdersPage.tsx + pedidos.ts Service)

### Página: /pedidos-venda
- **Dashboard cards**: Pendentes, Aprovados, Entregues, Total (filtrados da listagem)
- **Filtros**: busca textual + select de status (Pendente, Aprovado, Em Processamento, Enviado, Entregue, Cancelado)
- **Tabela**: Nº Pedido, Cliente, Data, Valor (R$), Status (badge colorido), Ações
- **Ações**: Visualizar (dialog detalhes), Aprovar (se pendente), Cancelar (se pendente), Enviar (se aprovado)
- **Mapeamento frontend→backend**: PENDENTE→EM_ABERTO, APROVADO→CONFIRMADO, EM_PROCESSAMENTO→EM_PRODUCAO

### Dialog Novo Pedido
- Select filial (carregado de empresasService.listar)
- Input clienteId (texto livre)
- Input produtoId + quantidade + valorUnitario
- Select condição pagamento (À Vista, A Prazo, Parcelado)
- Input observacoes

### Dialog Detalhes
- Dados do cliente, filial, data, condição pagamento
- Tabela de itens (produto, qtd, valor unitário, desconto, total)
- Totais (subtotal, desconto, frete, total geral)
- Tabela de parcelas/contas a receber (se existirem)

## Regras de Negócio

1. **Cálculo de valores**: `valorItem = qtd × valorUnitario`; desconto percentual por item; `valorTotal = somaItens + frete + acrescimos - desconto`
2. **Numeração automática**: formato `PV{YYYYMMDD}{SEQ}` (4 dígitos aleatórios)
3. **Geração automática de contas a receber** ao aprovar: se condição `A_PRAZO` ou `PARCELADO`, cria N parcelas em ContaReceber com vencimento calculado; se `A_VISTA`, cria registro em FluxoCaixa (entrada)
4. **Transições de status**: apenas pedidos EM_ABERTO podem ser aprovados; apenas CONFIRMADOS podem ser enviados
5. **Segurança multi-empresa**: todas as queries filtram por `empresaId` extraído do token JWT

## Validações (Zod)

- `criarPedidoVendaSchema`: filialId e clienteId obrigatórios; itens array com min 1; cada item exige produtoId, quantidade > 0, unidadeMedida, valorUnitario ≥ 0
- `atualizarPedidoVendaSchema`: campos opcionais; situacao limitada ao enum SituacaoPedido
- `pedidoVendaFiltroSchema`: filtros opcionais com paginação default (1, 20)

## Integrações

- **Contas a Receber**: criação automática via `contaReceber.createMany` ao aprovar pedido a prazo
- **Fluxo de Caixa**: entrada automática via `fluxoCaixa.create` ao aprovar pedido à vista
- **NF-e**: relacionamento `notaFiscal` no modelo; preparado para integração futura com módulo de notas fiscais
- **Orçamentos**: um pedido pode ser originado da conversão de um orçamento (relação `orcamento`)
- **Devoluções**: relação com `Devolucao[]` para pedidos parcial ou totalmente devolvidos
