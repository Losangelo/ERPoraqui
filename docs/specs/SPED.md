# Módulo SPED Fiscal — Especificação Técnica

## Visão Geral

Geração do arquivo digital SPED Fiscal (Sistema Público de Escrituração Digital) conforme layout definido pelo Ato COTEPE.
O motor é **config-driven**: cada bloco pode ser ativado/desativado por parâmetros, e as regras de tributação
são determinadas por configuração (não código duro), permitindo adaptação a mudanças legislativas sem alterar código.

## Arquitetura

```
Frontend (SpedFiscalPage)
    ↓
API (SpedController → SpedService)
    ↓
SpedEngine (motor de geração TXT)
    ├── BlockRegistry (registro de blocos)
    ├── BlockRenderer (formatação linha a linha)
    ├── SpedConfig (parâmetros por empresa)
    └── SpedValidator (validação PVA)
    ↓
Arquivo TXT → Download
```

## Modelo de Dados (Prisma)

```prisma
model SpedConfig {
  id              String   @id @default(cuid())
  empresaId       String
  filialId        String
  versao          String   @default("017")       // Layout (017=2024)
  perfil          String   @default("A")          // A/B/C
  periodoInicio   DateTime
  periodoFim      DateTime
  blocosAtivos    Json     @default("[]")         // ["C", "D", "E", "G", "H"]
  finalidade      String   @default("1")          // 1=Original, 2=Substituta
  cnpjContador    String?
  contatoContador String?
  tipoEscrituracao String  @default("0")          // 0=Original, 1=Retificadora
}

model SpedApuracao {
  id           String   @id @default(cuid())
  empresaId    String
  periodo      DateTime
  tipo         String   // ICMS, IPI, PIS, COFINS
  debitos      Decimal  @default(0)
  creditos     Decimal  @default(0)
  saldoAnterior Decimal @default(0)
  saldoFinal   Decimal  @default(0)
  blocos       Json     @default("{}")
}
```

## Blocos SPED

### Bloco 0 — Abertura
| Registro | Descrição | Status |
|----------|-----------|--------|
| 0000 | Abertura do arquivo + identificação do contribuinte | ✅ Pronto |
| 0100 | Dados do contador | ✅ Pronto |
| 0150 | Tabela de parceiros (clientes/fornecedores) | ✅ Pronto |
| 0190 | Tabela de unidades | ✅ Pronto |
| 0200 | Tabela de produtos | ✅ Pronto |
| 0300 | Cadastro de bens | 🟡 Pendente |
| 0400 | Natureza da operação | ✅ Pronto |
| 0450 | Tabela de observações | 🟡 Pendente |
| 0500 | Plano de contas | ✅ Parcial |
| 0600 | Centro de custos | ✅ Parcial |
| 0990 | Encerramento bloco 0 | ✅ Pronto |

### Bloco C — Documentos Fiscais (ICMS/IPI)
| Registro | Descrição | Status |
|----------|-----------|--------|
| C001 | Abertura bloco C | ✅ Pronto |
| C100 | Nota Fiscal (entrada/saída) | 🟡 Pendente |
| C101 | Informações complementares NF | 🟡 Pendente |
| C110 | Informações complementares | 🟡 Pendente |
| C113 | Documento vinculado | 🟡 Pendente |
| C114 | Cupom fiscal vinculado | 🟡 Pendente |
| C120 | Operações de importação | 🟡 Pendente |
| C130 | ISSQN, IPI, PIS, COFINS | 🟡 Pendente |
| C140 | Fatura | 🟡 Pendente |
| C141 | Duplicatas | 🟡 Pendente |
| C160 | Volumes transportados | 🟡 Pendente |
| C165 | ICMS por operação | 🟡 Pendente |
| C170 | Itens do documento | 🟡 Pendente |
| C172 | ISSQN por item | 🟡 Pendente |
| C173 | IPI por item | 🟡 Pendente |
| C174 | Armas | 🟡 Pendente |
| C175 | Combustíveis | 🟡 Pendente |
| C176 | ICMS ST | 🟡 Pendente |
| C177 | ICMS ST por UF | 🟡 Pendente |
| C178 | CIAP | 🟡 Pendente |
| C179 | Isenção/redução ICMS | 🟡 Pendente |
| C180 | Carga de NF-e | 🟡 Pendente |
| C181 | ICMS por UF item | 🟡 Pendente |
| C185 | Detalhamento CST | 🟡 Pendente |
| C188 | IBS/CBS (pós-reforma 2026) | 🟡 Pendente |
| C190 | Resumo ICMS por CST/CFOP | 🟡 Pendente |
| C191 | ST por UF destino | 🟡 Pendente |
| C195 | Observações fiscais | 🟡 Pendente |
| C197 | Outras obrigações fiscais | 🟡 Pendente |
| C300 | Cupom fiscal (ECF) | 🟡 Pendente |
| C310 | Cancelamentos ECF | 🟡 Pendente |
| C320 | Resumo ECF | 🟡 Pendente |
| C321 | Itens ECF | 🟡 Pendente |
| C350 | NF varejo | 🟡 Pendente |
| C370 | Itens NF varejo | 🟡 Pendente |
| C390 | Resumo NF varejo | 🟡 Pendente |
| C400 | ECF (equipamento) | 🟡 Pendente |
| C405 | Redução Z | 🟡 Pendente |
| C410 | PIS/COFINS ECF | 🟡 Pendente |
| C420 | Total parcial ECF | 🟡 Pendente |
| C425 | Itens ECF | 🟡 Pendente |
| C460 | Cupom fiscal ECF | 🟡 Pendente |
| C465 | Itens complementar | 🟡 Pendente |
| C470 | Detalhamento PIS/COFINS ECF | 🟡 Pendente |
| C490 | Resumo ICMS ECF | 🟡 Pendente |
| C495 | Resumo PIS/COFINS ECF | 🟡 Pendente |
| C500 | Nota fiscal energia/água/telecom | 🟡 Pendente |
| C510 | Itens NF energia | 🟡 Pendente |
| C590 | Resumo NF energia | 🟡 Pendente |
| C600 | NF emissão terceiros | 🟡 Pendente |
| C601 | NF emissão terceiros itens | 🟡 Pendente |
| C610 | PIS/COFINS NF terceiros | 🟡 Pendente |
| C690 | Resumo ICMS NF terceiros | 🟡 Pendente |
| C700 | NF saída Combustível | 🟡 Pendente |
| C790 | Resumo ICMS Combustível | 🟡 Pendente |
| C791 | ST Combustível | 🟡 Pendente |
| C800 | NFC-e (consumidor) | 🟡 Pendente |
| C810 | Itens NFC-e | 🟡 Pendente |
| C850 | Resumo ICMS NFC-e | 🟡 Pendente |
| C860 | Cancelamentos NFC-e | 🟡 Pendente |
| C890 | Resumo NFC-e | 🟡 Pendente |
| C990 | Encerramento bloco C | ✅ Pronto |

### Bloco D — Documentos Fiscais (Serviço)
| Registro | Descrição | Status |
|----------|-----------|--------|
| D001 | Abertura bloco D | 🟡 Pendente |
| D100 | NFSe | 🟡 Pendente |
| D101 | Informações complementares NFSe | 🟡 Pendente |
| D110 | Itens NFSe | 🟡 Pendente |
| D120 | Prestador/tomador NFSe | 🟡 Pendente |
| D130 | ISSQN NFSe | 🟡 Pendente |
| D150 | Complementar | 🟡 Pendente |
| D190 | Resumo ISSQN | 🟡 Pendente |
| D195 | Observações | 🟡 Pendente |
| D197 | Outras obrigações | 🟡 Pendente |
| D300 | Contas água/luz/telefone | 🟡 Pendente |
| D301 | Complementar conta | 🟡 Pendente |
| D310 | Itens conta | 🟡 Pendente |
| D350 | Resumo conta | 🟡 Pendente |
| D390 | Resumo ICMS conta | 🟡 Pendente |
| D400 | NFSe equipamento | 🟡 Pendente |
| D410 | Itens NFSe equipamento | 🟡 Pendente |
| D411 | ISSQN NFSe equipamento | 🟡 Pendente |
| D420 | Complementar NFSe equipamento | 🟡 Pendente |
| D990 | Encerramento bloco D | 🟡 Pendente |

### Bloco E — Apuração ICMS/IPI
| Registro | Descrição | Status |
|----------|-----------|--------|
| E001 | Abertura bloco E | ✅ Pronto |
| E100 | Período apuração ICMS | 🟡 Pendente |
| E110 | Apuração ICMS | 🟡 Pendente |
| E111 | Ajustes ICMS | 🟡 Pendente |
| E112 | Informações ajuste | 🟡 Pendente |
| E113 | Detalhamento ajuste | 🟡 Pendente |
| E115 | Deduções ICMS | 🟡 Pendente |
| E116 | Obrigações ICMS | 🟡 Pendente |
| E200 | ST: apuração | 🟡 Pendente |
| E210 | ST: valores | 🟡 Pendente |
| E220 | ST: ajustes | 🟡 Pendente |
| E250 | ST: Obrigações | 🟡 Pendente |
| E300 | Apuração ICMS (período) | 🟡 Pendente |
| E310 | ICMS: valores | 🟡 Pendente |
| E311 | ICMS: ajustes | 🟡 Pendente |
| E312 | ICMS: deduções | 🟡 Pendente |
| E313 | ICMS: obrigações | 🟡 Pendente |
| E316 | ICMS: saldo credor | 🟡 Pendente |
| E500 | Apuração IPI | 🟡 Pendente |
| E510 | IPI: valores | 🟡 Pendente |
| E520 | IPI: ajustes | 🟡 Pendente |
| E530 | IPI: deduções | 🟡 Pendente |
| E990 | Encerramento bloco E | ✅ Pronto |

### Bloco G — Controle Crédito ICMS
| Registro | Descrição | Status |
|----------|-----------|--------|
| G001 | Abertura bloco G | 🟡 Pendente |
| G110 | CIAP (Ativo imobilizado) | 🟡 Pendente |
| G125 | Movimentação CIAP | 🟡 Pendente |
| G126 | Parcelas CIAP | 🟡 Pendente |
| G130 | Identificação imobilizado | 🟡 Pendente |
| G140 | Parcelas CIAP | 🟡 Pendente |
| G990 | Encerramento bloco G | 🟡 Pendente |

### Bloco H — Inventário
| Registro | Descrição | Status |
|----------|-----------|--------|
| H001 | Abertura bloco H | 🟡 Pendente |
| H005 | Totalização inventário | 🟡 Pendente |
| H010 | Itens inventário | 🟡 Pendente |
| H020 | Informação adicional | 🟡 Pendente |
| H990 | Encerramento bloco H | 🟡 Pendente |

### Bloco K — Produção
| Registro | Descrição | Status |
|----------|-----------|--------|
| K001 | Abertura bloco K | 🟢 Futuro |
| K010 | Produção | 🟢 Futuro |
| K100 | Ordem de produção | 🟢 Futuro |
| K200 | Consumo | 🟢 Futuro |
| K210 | Desmontagem | 🟢 Futuro |
| K220 | Saída produção | 🟢 Futuro |
| K230 | Baixa produção | 🟢 Futuro |
| K990 | Encerramento | 🟢 Futuro |

### Bloco 1 — Outras Informações
| Registro | Descrição | Status |
|----------|-----------|--------|
| 1001 | Abertura bloco 1 | 🟢 Futuro |
| 1010 | Regime tributário | 🟢 Futuro |
| 1100 | Exportação | 🟢 Futuro |
| 1105 | Drawback | 🟢 Futuro |
| 1200 | Crédito ICMS | 🟢 Futuro |
| 1300 | ISSQN | 🟢 Futuro |
| 1390 | ISSQN serviços | 🟢 Futuro |
| 1391 | ISSQN pagamento | 🟢 Futuro |
| 1400 | IBS/CBS (Reforma 2026) | 🟢 Futuro |
| 1500 | Outros créditos | 🟢 Futuro |
| 1510 | Outros débitos | 🟢 Futuro |
| 1600 | Total das operações | 🟢 Futuro |
| 1700 | Outros docs fiscais | 🟢 Futuro |
| 1800 | Informações complementares | 🟢 Futuro |
| 1900 | Consolidação | 🟢 Futuro |
| 1990 | Encerramento bloco 1 | 🟢 Futuro |

## Motor de Geração TXT

### Fluxo
1. Usuario seleciona período, blocos e parâmetros no frontend
2. API recebe requisição → `SpedEngine.generate(config)`
3. Para cada bloco ativo:
   - `BlockRegistry.get(bloco).query(datas, empresa)` → dados do banco
   - `BlockRegistry.get(bloco).render(dados)` → linhas TXT
4. Validação: `SpedValidator.validate(linhas)` contra PVA
5. Retorna TXT para download

### Block Interface

```typescript
interface SpedBlock {
  id: string;                    // "C100"
  descricao: string;             // "Nota Fiscal"
  query(params: SpedParams): Promise<any[]>;
  render(data: any[]): string[]; // Linhas do TXT
}
```

### SpedEngine

```typescript
class SpedEngine {
  private blocks: Map<string, SpedBlock> = new Map();

  register(block: SpedBlock): void;

  async generate(config: SpedConfig): Promise<{
    filename: string;
    content: string;
    valid: boolean;
    errors: ValidationError[];
  }>;
}
```

### Formato Linha TXT

```
|REG|CAMPO1|CAMPO2|...|CAMPO_N|
```

Exemplo:
```
|C100|0|NF|12345|01/01/2026|1500,00|...
|C170|1|PROD001|100,00|10|...
|C190|0|5101|1000,00|18|180,00|...
```

## Versões de Layout

| Versão | Vigência | Observação |
|--------|----------|------------|
| 016 | até 12/2024 | Layout anterior |
| 017 | 01/2025 - 06/2026 | Layout corrente |
| 018 | 07/2026+ | Pós Reforma Tributária (CBS/IBS/IS) |

## Configuração por Empresa

Os parâmetros devem ser armazenados em `SpedConfig`:

```typescript
interface SpedConfig {
  versao: string;
  perfil: 'A' | 'B' | 'C';
  finalidade: '1' | '2' | '3';  // Original/Substituta/Ressarcimento
  blocosAtivos: string[];         // ["0", "C", "D", "E", "G", "H"]
  tipoEscrituracao: '0' | '1';   // Original/Retificadora
  cnpjContador: string;
  indExceto: boolean;            // Indicador de exclusão
}
```

## API Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /sped/config | Retorna configuração SPED |
| PUT | /sped/config | Atualiza configuração |
| POST | /sped/gerar | Gera arquivo SPED (retorna TXT) |
| GET | /sped/historico | Histórico de gerações |
| GET | /sped/blocos | Lista blocos disponíveis |

## Frontend

### SpedFiscalPage (já existe, rota /sped-fiscal)
- **Filtros**: período, filial, versão layout, blocos
- **Configuração**: perfil, finalidade, contador
- **Geração**: botão "Gerar SPED" com progresso
- **Preview**: visualização do TXT gerado
- **Download**: download do arquivo
- **Histórico**: tabela de gerações anteriores

### Melhorias Propostas
- Adicionar ao menu: Fiscal > SPED Fiscal
- Card com status de cada bloco (pronto/pendente)
- Pré-validação PVA embutida

## Dependências

- `apps/api/src/modules/sped/` — rotas, controller, service
- `apps/api/src/modules/sped/sped-engine.ts` — motor de geração
- `apps/api/src/modules/sped/blocks/` — implementação dos blocos
- `apps/api/src/modules/sped/sped-validator.ts` — validação PVA
- `apps/web/src/pages/sped/SpedFiscalPage.tsx` — frontend

## Ordem de Implementação

1. Schema Prisma (SpedConfig, SpedApuracao)
2. SpedEngine + BlockRegistry (infraestrutura)
3. Bloco 0 + C (completo) — ~60% do SPED
4. Bloco D (serviço)
5. Bloco E (apuração)
6. Blocos G (CIAP) + H (inventário)
7. Pós-reforma: Bloco 1 (CBS/IBS/IS)
8. Frontend completo + menu
