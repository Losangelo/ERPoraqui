# Módulo Pedidos de Compra — Especificação Técnica

## Visão Geral

Gerencia pedidos de compra para fornecedores, com controle de itens, condições de pagamento, geração automática de contas a pagar e integração com entrada de mercadorias.

## Fluxo Principal

```
Criar Pedido → EM_ABERTO → (aprovação externa) → CONFIRMADO → Recebimento via Entrada Mercadoria → RECEBIDO
                  ↘ Cancelar → CANCELADO
```

## Modelo de Dados

```prisma
model PedidoCompra {
  id                    String         @id @default(cuid())
  empresaId             String
  fornecedorId          String
  numeroPedido          String
  serie                 String         @default("1")
  tipoOperacao          TipoOperacao   @default(VENDA)
  situacao              SituacaoPedido @default(EM_ABERTO)
  dataEmissao           DateTime?
  dataEntrega           DateTime?
  valorTotal            Float
  valorDesconto         Float          @default(0)
  valorFrete            Float          @default(0)
  observacoes           String?
  condicaoPagamento     String?        // A_VISTA, A_PRAZO, PARCELADO
  quantidadeParcelas    Int?           @default(1)
  intervaloParcelas     Int?           @default(30)
  primeiraParcelaDias   Int?           @default(0)
  dataCriacao           DateTime       @default(now())
  dataAtualizacao       DateTime       @updatedAt

  empresa     Empresa             @relation
  fornecedor  Fornecedor          @relation
  itens       ItemPedidoCompra[]
  entradas    EntradaMercadoria[]
  contasPagar ContaPagar[]

  @@unique([empresaId, numeroPedido, serie])
}

model ItemPedidoCompra {
  id                 String   @id @default(cuid())
  pedidoCompraId     String
  produtoId          String
  numeroItem         Int
  quantidade         Float
  quantidadeRecebida Float    @default(0)
  unidadeMedida      String
  valorUnitario      Float
  valorTotal         Float
  valorDesconto      Float    @default(0)
  dataCriacao        DateTime @default(now())

  pedidoCompra PedidoCompra @relation
  produto      Produto      @relation
}
```

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/v1/pedidos-compra | Criar pedido de compra (obrigatório: fornecedorId, itens) |
| GET | /api/v1/pedidos-compra | Listar pedidos (filtros: fornecedorId, situacao, dataInicial, dataFinal, pagina, limite) |
| GET | /api/v1/pedidos-compra/:id | Buscar pedido por ID (inclui itens com produto, fornecedor) |
| PUT | /api/v1/pedidos-compra/:id | Atualizar pedido (se situacao → CONFIRMADO, gera contas a pagar) |
| PATCH | /api/v1/pedidos-compra/:id/cancelar | Cancelar pedido (situacao → CANCELADO) |

## Frontend (PedidosCompraPage.tsx + compras.ts Service)

### Página: /compras/pedidos
- **Dashboard cards**: Total, Em Aberto, Recebidos
- **Tabela**: Nº Pedido, Fornecedor, Data, Valor (R$), Situação (badge), Ações
- **Ações**: Cancelar (se EM_ABERTO)

### Dialog Novo Pedido de Compra
- Select fornecedor (carregado de fornecedoresService.listar)
- Input data entrega (date picker)
- Select condição pagamento (À Vista, A Prazo, Parcelado)
- Linhas de itens com:
  - Select produto (carregado de produtosService.listar)
  - Input quantidade
  - Input valor unitário (preenchido automaticamente com precoVenda do produto)
  - Total calculado (qtd × valorUnitario)
  - Botão remover item
- Botão "Adicionar Item"
- Input observacoes

## Regras de Negócio

1. **Cálculo de valores**: `valorItem = qtd × valorUnitario`; desconto percentual por item; `valorTotal = somaItens + frete - desconto`
2. **Numeração automática**: formato `PC{YYYYMMDD}{SEQ}` (4 dígitos aleatórios)
3. **Geração automática de contas a pagar**: ao atualizar situacao para CONFIRMADO com condição diferente de A_VISTA, cria N parcelas em ContaPagar
4. **Bloco de segurança**: todas as queries filtram por empresaId do token
5. **quantidadeRecebida**: campo no ItemPedidoCompra para rastrear quanto já foi recebido via EntradaMercadoria

## Validações (Zod)

- `criarPedidoCompraSchema`: fornecedorId obrigatório; itens array com min 1; cada item exige produtoId, quantidade > 0, unidadeMedida, valorUnitario ≥ 0
- `atualizarPedidoCompraSchema`: campos opcionais; situacao conforme SituacaoPedido
- `pedidoCompraFiltroSchema`: filtros opcionais com paginação default (1, 20)

## Integrações

- **Contas a Pagar**: criação automática ao confirmar pedido a prazo via `contaPagar.createMany`
- **Entradas de Mercadoria**: relação `entradas[]` no modelo; usada como referência para o registro de recebimento
- **Fornecedores**: lookup via `fornecedoresService` no frontend
- **Produtos**: lookup via `produtosService` no frontend; preço sugerido do produto
