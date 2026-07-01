# Módulo Filiais — Especificação Técnica

## Visão Geral

Gerencia filiais físicas/branches de uma empresa. Cada filial possui CNPJ próprio e dados independentes (endereço, contato, inscrições fiscais). Filiais são usadas por PDV, NF-e, NFC-e, NFSe, Pedidos, Orçamentos, Caixa e Inventário.

## Conceitos

| Termo | Descrição |
|-------|-----------|
| **Filial (física)** | Unidade/loja de uma empresa, com endereço e CNPJ próprios |
| **Matriz** | Filial marcada como matriz da empresa (filialMatriz=true) |
| **Grupo Filiais** | Todas as filiais de uma mesma empresa (empresaId) |

## Modelo de Dados

```prisma
model Filial {
  id                 String   @id @default(cuid())
  empresaId          String
  razaoSocial        String
  nomeFantasia       String?
  cnpj               String   @unique
  inscricaoEstadual  String?
  inscricaoMunicipal String?
  telefone           String?
  email              String?
  endereco           Json?
  filialMatriz       Boolean  @default(false)
  numeroNF           Int      @default(1)
  serieNF            String   @default("1")
  ativo              Boolean  @default(true)
}
```

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /empresas/:id/filiais | Lista filiais da empresa |
| POST | /empresas/:id/filiais | Cria nova filial |
| GET | /empresas/:id/filiais/:filialId | Busca filial por ID |
| PUT | /empresas/:id/filiais/:filialId | Atualiza filial |
| DELETE | /empresas/:id/filiais/:filialId | Remove filial (valida vínculos) |

## Regras de Negócio

- **Remoção**: Verifica se a filial possui registros vinculados (vendas, notas, pedidos, caixas) antes de permitir exclusão
- **CNPJ único**: Não permite duplicidade de CNPJ entre filiais
- **Filial Matriz**: Apenas uma filial pode ser matriz por empresa
- **Ativo/Inativo**: Filiais inativas não aparecem em selects (listar apenas ativas)

## Frontend

### FiliaisPage (CRUD)
- Rota: `/filiais`
- Sidebar: Cadastros > Filiais
- Seletor de empresa no topo (Select)
- Tabela: Razão Social, Nome Fantasia, CNPJ, Telefone, Cidade/UF, Matriz
- Ações: Editar (Pencil), Remover (Trash2)
- Dialog criação/edição: 2 colunas, endereço completo, campo "É Matriz?"

### FilialSelect (componente reutilizável)
- Localização: `apps/web/src/components/FilialSelect.tsx`
- Carrega empresas + filiais automaticamente
- Props: `value`, `onValueChange`, `placeholder`, `disabled`
- Usado em: OrdersPage, PdvPage, NFCePage, NFSePage, NotasFiscaisPage

## Integrações

| Módulo | Campo | Tipo |
|--------|-------|------|
| PedidoVenda | filialId | Obrigatório |
| VendaPDV | filialId | Obrigatório |
| Caixa | filialId | Obrigatório |
| NotaFiscal | filialId | Obrigatório |
| Inventario | filialId | Obrigatório |
| NotaServico | filialId | Obrigatório |
| Orcamento | filialId | Obrigatório |

## Dependências

- `apps/api/src/modules/empresas/` — rotas, controller, service (filial CRUD integrado ao módulo empresas)
- `apps/api/src/modules/empresas/dto/filial.dto.ts`
- `apps/web/src/pages/FiliaisPage.tsx`
- `apps/web/src/components/FilialSelect.tsx`
- `apps/web/src/services/estoque.ts` — métodos listarFiliais, criarFilial, atualizarFilial, removerFilial
