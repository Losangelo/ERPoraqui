# Módulo PDV — Especificação Técnica

## Visão Geral

Ponto de Venda (PDV) para vendas rápidas no balcão/loja física. Suporta abertura/fechamento de caixa, venda com múltiplos itens, formas de pagamento e cálculo de troco.

## Fluxo Principal

```
Abrir Caixa → Iniciar Venda → Adicionar Itens(barcode/busca) → Selecionar Cliente(opcional) → Finalizar → Pagamento → Venda Finalizada
```

## Modelo de Dados

```prisma
model Caixa {
  id            String   @id @default(cuid())
  empresaId     String
  filialId      String
  operadorId    String
  saldoInicial  Decimal  @default(0)
  saldoFinal    Decimal?
  situacao      CaixaSituacao @default(ABERTO)
}

model VendaPDV {
  id             String     @id @default(cuid())
  empresaId      String
  filialId       String
  numeroCupom    String
  subtotal       Decimal    @default(0)
  valorDesconto  Decimal    @default(0)
  valorTotal     Decimal    @default(0)
  formaPagamento String
  valorPago      Decimal    @default(0)
  valorTroco     Decimal    @default(0)
  situacao       VendaSituacao @default(ABERTA)
  itens          VendaItemPDV[]
}
```

## Endpoints

### Caixa
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /pdv/caixa/abrir | Abre caixa (filialId, operadorId, saldoInicial) |
| GET | /pdv/caixa/aberto | Busca caixa aberto da filial |
| POST | /pdv/caixa/:id/fechar | Fecha caixa |

### Venda
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /pdv/venda/iniciar | Cria venda com status ABERTA |
| POST | /pdv/venda/:id/itens | Adiciona item à venda |
| DELETE | /pdv/venda/:id/itens/:produtoId | Remove item |
| PUT | /pdv/venda/:id/itens/:produtoId/quantidade | Altera quantidade |
| POST | /pdv/venda/:id/finalizar | Finaliza venda (pagamento) |
| POST | /pdv/venda/:id/cancelar | Cancela venda |
| GET | /pdv/vendas | Lista vendas (filtros) |
| GET | /pdv/vendas/:id | Busca venda por ID |

### Produtos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /pdv/produtos | Lista produtos (termo de busca) |
| GET | /pdv/produtos/barras/:codigo | Busca por código de barras |

## Frontend (PdvPage.tsx)

### Componentes
- Dashboard cards: status caixa, vendas hoje, acesso rápido
- Dialog Abrir Caixa: seleção filial, operador, saldo inicial
- Dialog Nova Venda (max-w-4xl):
  - Campo código de barras com auto-focus
  - Campo busca nome com grid resultados
  - Tabela carrinho (qty +/- , remover, unitário, total)
  - Seleção cliente com busca
  - Total do carrinho
- Dialog Confirmar Pagamento: forma pagamento, valor recebido, troco
- Dialog Venda Finalizada: resumo

### Fluxo Frontend
1. Itens adicionados localmente (sem API até finalizar)
2. Ao confirmar pagamento: envia itens via API → finaliza venda
3. Exibe resumo final → opção "Nova Venda"

## Comportamentos Especiais

- `buscarCaixaAberto` retorna `{ data: null }` em vez de 404 quando não há caixa
- `saldoInicial.toFixed(2)` usa `?? 0` para evitar erro com null
- Barcode input foca automaticamente ao abrir e ao adicionar item
- Foco volta ao campo de barcode após cada ação

## Dependências

- `apps/api/src/modules/pdv/` — rotas, service, controller, DTO
- `apps/web/src/pages/PdvPage.tsx`
- `apps/web/src/services/pdv.ts`
- Filial obrigatória via select (carregada de empresasService)
