# Módulo Entradas de Mercadoria — Especificação Técnica

## Visão Geral

Registra a entrada física de mercadorias no estoque, vinculada a um pedido de compra. O fluxo inclui criação a partir de nota fiscal do fornecedor, confirmação com atualização automática do estoque e cancelamento.

## Fluxo Principal

```
Criar Entrada (NF + Pedido Compra) → PENDENTE → Confirmar Recebimento → RECEBIDO (estoque atualizado)
                                       ↘ Cancelar → CANCELADO
```

## Modelo de Dados

```prisma
enum SituacaoEntrada { PENDENTE EM_RECEBIMENTO RECEBIDO CANCELADO }

model EntradaMercadoria {
  id              String          @id @default(cuid())
  empresaId       String
  pedidoCompraId  String
  numeroNota      String
  serieNota       String          @default("1")
  dataEmissao     DateTime?
  dataEntrada     DateTime        @default(now())
  valorTotal      Float
  valorFrete      Float           @default(0)
  valorDesconto   Float           @default(0)
  observacoes     String?
  situacao        SituacaoEntrada @default(PENDENTE)
  dataCriacao     DateTime        @default(now())
  dataAtualizacao DateTime        @updatedAt

  empresa      Empresa       @relation
  pedidoCompra PedidoCompra  @relation
  itens        ItemEntrada[]

  @@unique([empresaId, numeroNota, serieNota])
}

model ItemEntrada {
  id                  String   @id @default(cuid())
  entradaMercadoriaId String
  produtoId           String
  quantidade          Float
  quantidadeRecebida  Float    @default(0)
  unidadeMedida       String
  valorUnitario       Float
  valorTotal          Float
  valorDesconto       Float    @default(0)
  dataCriacao         DateTime @default(now())

  entradaMercadoria EntradaMercadoria @relation
  produto           Produto           @relation
}
```

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/v1/entradas-mercadoria | Criar entrada (obrigatório: pedidoCompraId, numeroNota, itens) |
| GET | /api/v1/entradas-mercadoria | Listar entradas (filtros: pedidoCompraId, situacao, dataInicial, dataFinal, pagina, limite) |
| GET | /api/v1/entradas-mercadoria/:id | Buscar entrada por ID (inclui itens com produto, pedidoCompra) |
| PATCH | /api/v1/entradas-mercadoria/:id/confirmar | Confirmar recebimento (situacao → RECEBIDO; incrementa quantidadeEstoque do produto) |
| PATCH | /api/v1/entradas-mercadoria/:id/cancelar | Cancelar entrada (situacao → CANCELADO) |

## Frontend (EntradasPage.tsx + compras.ts Service)

### Página: /compras/entradas
- **Dashboard cards**: Total, Pendentes, Confirmadas
- **Tabela**: NF, Pedido, Data Entrada, Valor (R$), Situação (badge), Ações
- **Ações**: Confirmar (se PENDENTE, ícone check)

### Dialog Nova Entrada
- Select pedido de compra (filtrado por APROVADO ou EM_ABERTO; exibe "Nº Pedido - Fornecedor")
- Input número NF (obrigatório)
- Input data emissão (date picker)
- Input valor frete
- Input valor desconto

## Regras de Negócio

1. **Cálculo de valores**: `valorItem = qtd × valorUnitario`; desconto percentual por item; `valorTotal = somaItens + frete - desconto`
2. **quantidadeRecebida**: default igual à quantidade, mas pode ser diferente para recebimentos parciais
3. **Confirmação de recebimento**: ao confirmar, faz `update` em cada produto incrementando `quantidadeEstoque` com `quantidadeRecebida`; situação muda para RECEBIDO
4. **Integridade**: usa `verificarProprietario()` para garantir que a entrada pertence à empresa
5. **Unique**: composto por empresaId + numeroNota + serieNota

## Validações (Zod)

- `criarEntradaMercadoriaSchema`: pedidoCompraId e numeroNota obrigatórios; itens array com min 1; cada item exige produtoId, quantidade > 0, unidadeMedida, valorUnitario ≥ 0
- `entradaFiltroSchema`: situacao conforme SituacaoEntrada; paginação default (1, 20)

## Integrações

- **Pedidos de Compra**: vinculação obrigatória; o select no frontend filtra pedidos APROVADOS ou EM_ABERTO
- **Estoque (Produto)**: atualização direta de `quantidadeEstoque` no modelo Produto ao confirmar recebimento
- **Nota Fiscal**: número e série da NF do fornecedor são registrados para rastreabilidade
