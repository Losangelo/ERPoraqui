# Módulo Cotações de Compra — Especificação Técnica

## Visão Geral

Gerencia cotações de compra (RFQ - Request for Quote) para solicitar preços de fornecedores. Permite criar itens a cotar, enviar para fornecedores, registrar respostas e aprovar a melhor proposta.

## Fluxo Principal

```
Criar Cotação (itens) → ABERTA → Enviar → ENVIADA → Fornecedor Responde → RESPONDIDA → Aprovar Resposta → APROVADA
                  ↘ Cancelar → CANCELADA
```

## Modelo de Dados

```prisma
enum SituacaoCotacao { ABERTA ENVIADA RESPONDIDA APROVADA REPROVADA CANCELADA }

model CotacaoCompra {
  id              String          @id @default(cuid())
  empresaId       String
  numeroCotacao   String
  serie           String          @default("1")
  situacao        SituacaoCotacao @default(ABERTA)
  dataAbertura    DateTime        @default(now())
  dataValidade    DateTime?
  observacoes     String?
  dataCriacao     DateTime        @default(now())
  dataAtualizacao DateTime        @updatedAt

  empresa   Empresa             @relation
  itens     ItemCotacaoCompra[]
  respostas RespostaCotacao[]

  @@unique([empresaId, numeroCotacao, serie])
}

model ItemCotacaoCompra {
  id              String   @id @default(cuid())
  cotacaoCompraId String
  produtoId       String
  quantidade      Float
  unidadeMedida   String
  observacoes     String?
  dataCriacao     DateTime @default(now())

  cotacaoCompra CotacaoCompra @relation
  produto       Produto       @relation
}

model RespostaCotacao {
  id              String          @id @default(cuid())
  cotacaoCompraId String
  fornecedorId    String
  valorTotal      Float
  valorFrete      Float           @default(0)
  valorDesconto   Float           @default(0)
  prazoEntrega    String?
  situacao        SituacaoCotacao @default(ENVIADA)
  dataResposta    DateTime        @default(now())
  dataCriacao     DateTime        @default(now())
  dataAtualizacao DateTime        @updatedAt

  cotacaoCompra CotacaoCompra @relation
  fornecedor    Fornecedor    @relation
}
```

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/v1/cotacoes-compra | Criar cotação (obrigatório: numeroCotacao, itens) |
| GET | /api/v1/cotacoes-compra | Listar cotações (filtros: situacao, dataInicial, dataFinal, pagina, limite) |
| GET | /api/v1/cotacoes-compra/:id | Buscar cotação por ID (inclui itens com produto, respostas com fornecedor) |
| PATCH | /api/v1/cotacoes-compra/:id/enviar | Marcar cotação como ENVIADA |
| POST | /api/v1/cotacoes-compra/:id/responder | Registrar resposta de fornecedor (body: fornecedorId, valorTotal, valorFrete, valorDesconto, prazoEntrega) |
| PATCH | /api/v1/cotacoes-compra/:id/respostas/:respostaId/aprovar | Aprovar resposta de fornecedor (em transação: atualiza resposta + cotação para APROVADA) |
| PATCH | /api/v1/cotacoes-compra/:id/cancelar | Cancelar cotação (situacao → CANCELADA) |

## Frontend (CotacoesPage.tsx + compras.ts Service)

### Página: /compras/cotacoes
- **Dashboard cards**: Total, Abertas, Fechadas
- **Tabela**: Nº Cotação, Data Abertura, Validade, Itens (qtd), Situação (badge), Ações
- **Ações**: Enviar (se ABERTA, ícone send), Excluir (confirmação)

### Dialog Nova Cotação
- Input data validade (date picker)
- Linhas de itens com:
  - Select produto (carregado de produtosService.listar)
  - Input quantidade
  - Input unidade medida (livre: KG, UN, LT, etc.)
  - Botão remover item
- Botão "Adicionar Item"
- Input observações

## Regras de Negócio

1. **Numeração**: fornecida pelo usuário no momento da criação (campo obrigatório `numeroCotacao`)
2. **Respostas**: cada fornecedor registra uma resposta com valorTotal, frete, desconto e prazo de entrega
3. **Aprovação**: ao aprovar uma resposta, a situação da resposta e da cotação são atualizadas atomicamente via `$transaction`
4. **Segurança multi-empresa**: todas as queries filtram por empresaId

## Validações (Zod)

- `criarCotacaoSchema`: numeroCotacao obrigatório; itens array com min 1
- `responderCotacaoSchema`: valorFrete, valorDesconto default 0; prazoEntrega opcional
- `cotacaoFiltroSchema`: situacao conforme SituacaoCotacao; paginação default (1, 20)

## Integrações

- **Fornecedores**: registrados como resposta (fornecedorId) sem lookup direto no frontend atual
- **Produtos**: lookup via `produtosService` no frontend para seleção de itens
- **Pedidos de Compra**: a aprovação de uma cotação pode futuramente disparar a criação de um PedidoCompra (não implementado atualmente)
