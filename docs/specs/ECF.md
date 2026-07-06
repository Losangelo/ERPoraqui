# ECF — Escrituração Contábil Fiscal / Emissor Cupom Fiscal — Especificação Técnica

## 1. Visão Geral

Módulo de gestão de equipamentos ECF (Emissor Cupom Fiscal), controle de cupons fiscais emitidos, reduções Z, suprimentos e sangrias de caixa. Integra-se ao PDV para emissão de documentos fiscais modelo 2 (cupom fiscal).

## 2. Modelo de Dados (Prisma)

### ECF
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| empresaId | String | FK → Empresa |
| identificacao | String | Identificação do equipamento (ex: PDV-01) |
| marca | String | Marca (ex: Bematech) |
| modelo | String | Modelo (ex: MP4200TH) |
| numeroSerie | String | Número de série (unique) |
| numeroFabricacao | String | Número de fabricação |
| versaoSB | String | Versão do software básico |
| dataInstalacao | DateTime | Data de instalação |
| lojaId | String? | FK → Filial (opcional) |
| ativo | Boolean | Soft delete |
| dataCriacao | DateTime | |
| dataAtualizacao | DateTime | |

### ReducaoZ
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| ecfId | String | FK → ECF |
| dataMovimento | DateTime | Data do movimento |
| numeroReducao | Int | Número sequencial da redução |
| cro | Int | Contador de Reinício de Operação |
| crz | Int | Contador de Redução Z |
| cooInicial/cooFinal | Int | Contador de Ordem de Operação |
| gtInicial/gtFinal | Float | Grande Total inicial/final |
| valorVendaBruta | Float | |
| valorTotalSuprimento | Float | |
| valorTotalSangria | Float | |
| valorBaseICMS, valorICMS, valorISS, valorPIS, valorCOFINS | Float | Tributos |
| situacao | SituacaoReducaoZ | ABERTA \| FECHADA \| ENVIADA |

### Cupom
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| ecfId | String | FK → ECF |
| numeroCupom | Int | Número do cupom |
| coo | Int | Contador de Ordem de Operação |
| ccf | Int | Contador de Cupom Fiscal |
| dataEmissao | DateTime | |
| subtotal | Float | |
| valorDesconto | Float | |
| valorAcrescimo | Float | |
| valorTotal | Float | |
| formaPagamento | FormaPagamentoECF | DINHEIRO \| CHEQUE \| CARTAO_CREDITO \| CARTAO_DEBITO \| VALE \| OUTROS |
| valorPagamento | Float | |
| valorTroco | Float | |
| situacao | SituacaoCupom | ABERTO \| FINALIZADO \| CANCELADO |
| hashCupom | String? | Hash de integridade do cupom |

### ItemCupom
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| cupomId | String | FK → Cupom |
| produtoId | String? | FK → Produto |
| codigo | String | Código do produto |
| descricao | String | |
| quantidade | Float | |
| unidadeMedida | String | |
| valorUnitario | Float | |
| valorTotal | Float | |
| valorDesconto | Float | |
| aliquotaICMS | String? | |
| csosn | String? | |
| cbsCst, cbsBaseCalculo, cbsAliquota, cbsValor | Float/String? | Reforma Tributária 2026 |
| ibsCst, ibsBaseCalculo, ibsAliquota, ibsValor | Float/String? | Reforma Tributária 2026 |

### Suprimento / Sangria
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| ecfId | String | FK → ECF |
| dataMovimento | DateTime | |
| valor | Float | |
| tipo/motivo | String/TipoSuprimento | Suprimento: SUPRIMENTO \| REFORCO; Sangria: texto |
| observacoes | String? | |

## 3. API Endpoints

Base: `/api/v1/ecf` (autenticação JWT obrigatória)

### ECF
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Lista ECFs ativos da empresa |
| POST | `/` | Cadastra novo ECF |
| GET | `/:id` | Busca ECF por ID (inclui últimas 10 reduções Z) |
| PUT | `/:id` | Atualiza ECF |
| DELETE | `/:id` | Soft delete (ativo = false) |

### Reduções Z
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/:ecfId/reducoes-z` | Lista reduções Z do ECF |
| POST | `/:ecfId/reducao-z` | Cria redução Z (valida sequência) |
| GET | `/:ecfId/reducao-z/:id` | Busca redução Z por ID |

### Cupons
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/:ecfId/cupom` | Abre novo cupom (gera COO, CCF, número) |
| POST | `/:ecfId/cupom/:cupomId/item` | Adiciona item ao cupom |
| POST | `/:ecfId/cupom/:cupomId/finalizar` | Finaliza cupom (valida itens, gera hash) |
| POST | `/:ecfId/cupom/:cupomId/cancelar` | Cancela cupom (exige justificativa) |
| GET | `/:ecfId/cupons` | Lista cupons do ECF |

### Movimentações de Caixa
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/:ecfId/suprimento` | Registra suprimento |
| POST | `/:ecfId/sangria` | Registra sangria |

## 4. Frontend

**Página:** `ECFPage.tsx` — rota `/ecf`

### Componentes
- **Tabs:** Equipamentos (ECFs), Cupons, Operações
- **Cards dashboard:** 4 cards com info do ECF selecionado (identificação, série, cupons hoje, vendas hoje)
- **Tabela ECFs:** Identificação, Marca, Modelo, Série, Versão SB, botão Selecionar
- **Tabela Cupons:** Número, COO, Data, Valor, Forma Pagamento, Situação (badge)
- **Cards Operações:** Suprimento (prompt valor), Sangria (prompts valor+motivo), Redução Z (confirm)
- **Dialog Novo ECF:** Identificação, Marca, Modelo, Nº Série, Nº Fabricação, Versão SB

### Service (`ecf.ts`)
```typescript
ecfService.listar()                          // GET /ecf
ecfService.buscar(id)                        // GET /ecf/:id
ecfService.criar(data)                       // POST /ecf
ecfService.atualizar(id, data)               // PUT /ecf/:id
ecfService.excluir(id)                       // DELETE /ecf/:id
ecfService.listarCupons(ecfId)               // GET /ecf/:ecfId/cupons
ecfService.abrirCupom(ecfId)                 // POST /ecf/:ecfId/cupom
ecfService.adicionarItem(ecfId, cupomId, item) // POST /ecf/:ecfId/cupom/:cupomId/item
ecfService.finalizarCupom(ecfId, cupomId, data) // POST /ecf/:ecfId/cupom/:cupomId/finalizar
ecfService.cancelarCupom(ecfId, cupomId, justificativa) // POST /ecf/:ecfId/cupom/:cupomId/cancelar
ecfService.listarReducoesZ(ecfId)            // GET /ecf/:ecfId/reducoes-z
ecfService.criarReducaoZ(ecfId, data)        // POST /ecf/:ecfId/reducao-z
ecfService.criarSuprimento(ecfId, data)      // POST /ecf/:ecfId/suprimento
ecfService.criarSangria(ecfId, data)         // POST /ecf/:ecfId/sangria
```

## 5. Regras de Negócio

1. **Numeração sequencial de reduções Z:** O número da redução Z deve ser sequencial (último + 1)
2. **Cupom:** Só aceita itens se estiver na situação ABERTO
3. **Finalização de cupom:** Exige pelo menos 1 item; gera hash de integridade via base64
4. **Cancelamento de cupom:** Só permite cancelar cupom FINALIZADO; exige justificativa
5. **Soft delete de ECF:** Exclusão lógica (ativo=false), não remove do banco
6. **Licença:** Todas as rotas protegidas por `licencaGuard('ecf')`

## 6. Validações

- COO inicial deve ser menor ou igual a COO final na redução Z
- GT final deve ser >= GT inicial
- Valor de item = quantidade × valorUnitario − desconto
- Troco = valorPagamento − valorTotal (se positivo)
- Hash do cupom gerado a partir de: numeroCupom + coo + dataEmissão + valorTotal → base64 (32 chars)
