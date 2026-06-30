# ERPoraqui - Wiki do Projeto

## Índice

1. [Visão Geral do Projeto](#visão-geral)
2. [Stack Tecnológica](#stack)
3. [Estrutura do Projeto](#estrutura)
4. [Módulos Implementados](#módulos)
5. [API Endpoints](#endpoints)
6. [Banco de Dados](#banco)
7. [Guias de Operação](#guias)
8. [Contribuição](#contribuição)

---

## 1. Visão Geral do Projeto {#visao-geral}

**ERPoraqui** é um sistema ERP (Enterprise Resource Planning) brasileiro, desenvolvido em TypeScript/Node.js com React. O sistema é uma modernização do sistema legado iCompany (originalmente escrito em xHarbour/Clipper).

### Objetivos
- Modernizar o sistema legado mantendo as funcionalidades existentes
- Melhorar a experiência do usuário com interface responsiva
- Garantir conformidade com a legislação brasileira (NF-e, SPED, etc)
- обеспечить escalabilidade e manutenibilidade

---

## 2. Stack Tecnológica {#stack}

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Linguagem**: TypeScript
- **ORM**: Prisma
- **Banco de Dados**: PostgreSQL
- **Validação**: Zod

### Frontend
- **Framework**: React
- **Build**: Vite
- **Gerenciamento de Estado**: Zustand
- **Requisições**: TanStack Query
- **Estilização**: Tailwind CSS + shadcn/ui

### Infraestrutura
- **Container**: Docker
- **Cache**: Redis (planejado)
- **Filas**: RabbitMQ (planejado)

---

## 3. Estrutura do Projeto {#estrutura}

```
ERPoraqui/
├── apps/
│   ├── api/              # Backend (Express.js)
│   │   ├── prisma/      # Schema do banco
│   │   └── src/
│   │       ├── modules/  # Módulos da aplicação
│   │       └── shared/   # Recursos compartilhados
│   └── web/             # Frontend (React)
├── docs/                 # Documentação
│   └── wiki/            # Wiki
└── packages/            # Pacotes compartilhados
```

---

## 4. Módulos Implementados {#modulos}

### Cadastros
| Módulo | Descrição | Status |
|--------|-----------|--------|
| Empresas | Cadastro de empresas e filiais | ✅ Completo |
| Clientes | Cadastro de clientes | ✅ Completo |
| Fornecedores | Cadastro de fornecedores | ✅ Completo |
| Produtos | Cadastro de produtos | ✅ Completo |
| Transportadoras | Cadastro de transportadoras | ✅ Completo |
| Vendedores | Cadastro de vendedores | ✅ Completo |
| Categorias | Categorias de produtos | ✅ Completo |
| Unidades de Medida | Unidades de medida | ✅ Completo |

### Operações
| Módulo | Descrição | Status |
|--------|-----------|--------|
| Orçamentos | Orçamentos de vendas | ✅ Completo |
| Pedidos de Venda | Pedidos de vendas | ✅ Completo |
| Pedidos de Compra | Pedidos de compras | ✅ Completo |
| Cotação de Compras | Cotações para fornecedores | ✅ Completo |
| Entrada de Mercadoria | Entradas de estoque | ✅ Completo |
| Movimentações Internas | Transferências | ✅ Completo |
| PDV | Ponto de venda | ✅ Completo |

### Estoque
| Módulo | Descrição | Status |
|--------|-----------|--------|
| Controle de Estoque | Consulta e ajustes | ✅ Completo |
| Inventário | Contagem de estoque | ✅ Completo |

### Financeiro
| Módulo | Descrição | Status |
|--------|-----------|--------|
| Contas a Receber | Recebimentos | ✅ Completo |
| Contas a Pagar | Pagamentos | ✅ Completo |
| Fluxo de Caixa | Controle de caixa | ✅ Completo |
| Boletos | Geração de boletos | ✅ Completo |
| Conciliação | Conciliação bancária | ✅ Completo |

### Fiscal
| Módulo | Descrição | Status |
|--------|-----------|--------|
| NF-e | Nota Fiscal Eletrônica | ✅ Completo |
| SPED Fiscal | Geração SPED | ✅ Completo |
| SPED Contribuições | Geração PIS/COFINS | ✅ Completo |

---

## 5. API Endpoints {#endpoints}

### Autenticação
```
POST   /api/v1/auth/login     - Login
POST   /api/v1/auth/register  - Cadastro
```

### Cadastros
```
Empresas:
GET    /api/v1/empresas
POST   /api/v1/empresas
GET    /api/v1/empresas/:id
PUT    /api/v1/empresas/:id
DELETE /api/v1/empresas/:id

Clientes:
GET    /api/v1/clientes
POST   /api/v1/clientes
GET    /api/v1/clientes/:id
PUT    /api/v1/clientes/:id
DELETE /api/v1/clientes/:id

Fornecedores:
GET    /api/v1/fornecedores
POST   /api/v1/fornecedores
GET    /api/v1/fornecedores/:id
PUT    /api/v1/fornecedores/:id
DELETE /api/v1/fornecedores/:id

Produtos:
GET    /api/v1/produtos
POST   /api/v1/produtos
GET    /api/v1/produtos/:id
PUT    /api/v1/produtos/:id
DELETE /api/v1/produtos/:id
```

### Vendas
```
Orçamentos:
GET    /api/v1/orcamentos
POST   /api/v1/orcamentos
GET    /api/v1/orcamentos/:id
PUT    /api/v1/orcamentos/:id
DELETE /api/v1/orcamentos/:id
POST   /api/v1/orcamentos/:id/aprovar
POST   /api/v1/orcamentos/:id/reprovar
POST   /api/v1/orcamentos/:id/convertar

Pedidos de Venda:
GET    /api/v1/pedidos-venda
POST   /api/v1/pedidos-venda
GET    /api/v1/pedidos-venda/:id
PUT    /api/v1/pedidos-venda/:id
DELETE /api/v1/pedidos-venda/:id
```

### PDV
```
POST   /api/v1/pdv/venda/iniciar
POST   /api/v1/pdv/venda/:id/itens
DELETE /api/v1/pdv/venda/:id/itens/:produtoId
POST   /api/v1/pdv/venda/:id/finalizar
POST   /api/v1/pdv/venda/:id/cancelar

GET    /api/v1/pdv/produtos
GET    /api/v1/pdv/produtos/barras/:codigo

POST   /api/v1/pdv/caixa/abrir
POST   /api/v1/pdv/caixa/:id/fechar
GET    /api/v1/pdv/caixa/aberto
```

### Financeiro
```
Contas a Receber:
GET    /api/v1/financeiro/contas-receber
POST   /api/v1/financeiro/contas-receber
POST   /api/v1/financeiro/contas-receber/:id/receber

Contas a Pagar:
GET    /api/v1/financeiro/contas-pagar
POST   /api/v1/financeiro/contas-pagar
POST   /api/v1/financeiro/contas-pagar/:id/pagar

Boletos:
GET    /api/v1/boletos
POST   /api/v1/boletos
POST   /api/v1/boletos/:id/baixar
POST   /api/v1/boletos/:id/cancelar
POST   /api/v1/boletos/:id/segunda-via
```

### Fiscal
```
NF-e:
GET    /api/v1/notas-fiscais
POST   /api/v1/notas-fiscais
POST   /api/v1/notas-fiscais/:id/assinar
POST   /api/v1/notas-fiscais/:id/enviar
POST   /api/v1/notas-fiscais/:id/cancelar
POST   /api/v1/notas-fiscais/:id/carta-correcao
GET    /api/v1/notas-fiscais/por-status/:situacao

SPED:
POST   /api/v1/sped-fiscal/gerar
GET    /api/v1/sped-fiscal
GET    /api/v1/sped-fiscal/:id/download
POST   /api/v1/sped-fiscal/contribuicoes/gerar
GET    /api/v1/sped-fiscal/contribuicoes
```

### Inventário
```
GET    /api/v1/inventario
POST   /api/v1/inventario
GET    /api/v1/inventario/:id
POST   /api/v1/inventario/:id/contagem
POST   /api/v1/inventario/:id/conciliar
POST   /api/v1/inventario/:id/ajustar
POST   /api/v1/inventario/:id/cancelar
GET    /api/v1/inventario/:id/divergencias
```

---

## 6. Banco de Dados {#banco}

### Modelos Principais

#### Empresas e Filiais
- `Empresa` - Cadastro de empresas (multi-tenant)
- `Filial` - Filiais da empresa

#### Cadastros
- `Cliente` - Clientes
- `Fornecedor` - Fornecedores
- `Produto` - Produtos
- `Transportadora` - Transportadoras
- `Vendedor` - Vendedores
- `Categoria` - Categorias de produtos
- `UnidadeMedida` - Unidades de medida
- `Usuario` - Usuários do sistema

#### Operações
- `Orcamento` / `ItemOrcamento` - Orçamentos
- `PedidoVenda` / `ItemPedidoVenda` - Pedidos de venda
- `PedidoCompra` / `ItemPedidoCompra` - Pedidos de compra
- `CotacaoCompra` / `ItemCotacaoCompra` - Cotações
- `EntradaMercadoria` / `ItemEntrada` - Entradas
- `VendaPDV` / `ItemVendaPDV` - Vendas PDV

#### Financeiro
- `ContaReceber` - Contas a receber
- `ContaPagar` - Contas a pagar
- `Boleto` - Boletos
- `FluxoCaixa` - Movimentações de caixa
- `ContaBancaria` - Contas bancárias
- `MovimentacaoBancaria` - Movimentações bancárias
- `Conciliacao` - Conciliações

#### Fiscal
- `NotaFiscal` / `ItemNotaFiscal` - Notas fiscais
- `EventoNF` - Eventos de NF
- `ConfiguracaoNF` - Configurações NF-e
- `SpedFiscal` - SPED Fiscal
- `SpedContribuicoes` - SPED Contribuições

#### Estoque
- `MovimentacaoEstoque` - Movimentações de estoque
- `Inventario` / `ItemInventario` - Inventário

#### Outros
- `LogSistema` - Logs do sistema
- `ParametroSistema` - Parâmetros
- `OperadorPDV` - Operadores PDV
- `Caixa` - Caixas

---

## 7. Guias de Operação {#guias}

### Como Emitir uma NF-e

1. **Configure o certificado digital:**
   ```
   POST /api/v1/notas-fiscais/configurar
   {
     "certificadoDigital": "base64...",
     "senhaCertificado": "senha",
     "csc": "codigo-csc",
     "cscId": "id-csc",
     "ambiente": "HOMOLOGACAO"
   }
   ```

2. **Crie uma nota fiscal:**
   ```
   POST /api/v1/notas-fiscais
   {
     "filialId": "id-filial",
     "clienteId": "id-cliente",
     "tipoDocumento": "SAIDA",
     "naturezaOperacao": "Venda de mercadoria",
     "itens": [...]
   }
   ```

3. **Assine o XML:**
   ```
   POST /api/v1/notas-fiscais/:id/assinar
   ```

4. **Envie para SEFAZ:**
   ```
   POST /api/v1/notas-fiscais/:id/enviar
   ```

### Como Realizar um Inventário

1. **Crie o inventário:**
   ```
   POST /api/v1/inventario
   {
     "filialId": "id-filial",
     "dataInventario": "2026-03-01",
     "tipo": "ROTATIVO"
   }
   ```

2. **Registre a contagem:**
   ```
   POST /api/v1/inventario/:id/contagem
   {
     "produtoId": "id-produto",
     "quantidadeContada": 100
   }
   ```

3. **Concilie os itens:**
   ```
   POST /api/v1/inventario/:id/conciliar
   {
     "itemIds": ["id1", "id2"],
     "ajustarEstoque": true
   }
   ```

### Como Usar o PDV

1. **Abra o caixa:**
   ```
   POST /api/v1/pdv/caixa/abrir
   {
     "filialId": "id",
     "operadorId": "id",
     "saldoInicial": 100
   }
   ```

2. **Inicie uma venda:**
   ```
   POST /api/v1/pdv/venda/iniciar
   { "filialId": "id" }
   ```

3. **Adicione itens:**
   ```
   POST /api/v1/pdv/venda/:id/itens
   {
     "produtoId": "id",
     "quantidade": 2
   }
   ```

4. **Finalize a venda:**
   ```
   POST /api/v1/pdv/venda/:id/finalizar
   {
     "formaPagamento": "DINHEIRO",
     "valorPago": 100
   }
   ```

---

## 8. Como Contribuir {#contribuição}

### Padrões de Código

1. **命名atura**: Variáveis em inglês, comentários em português
2. **Tipagem**: TypeScript rigoroso, sem `any`
3. **Validação**: Usar Zod para DTOs
4. **Serviços**: Usar PrismaService para banco
5. **Erros**: Lançar exceções customizadas

### Estrutura de Módulo

```
modulo/
├── dto/
│   └── modulo.dto.ts      # Schemas Zod
├── modulo.service.ts      # Lógica de negócio
├── modulo.controller.ts   # Controllers
├── modulo.routes.ts      # Rotas Express
└── index.ts             # Exports
```

### Commits

Siga o padrão Conventional Commits:
- `feat: nova funcionalidade`
- `fix: correção de bug`
- `docs: documentação`
- `refactor: refatoração`

---

## 📞 Suporte

Para dúvidas ou sugestões, abra uma issue no repositório.

---

*Última atualização: 02/03/2026*
