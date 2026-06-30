# Especificação Técnica - Módulo NF-e (Nota Fiscal Eletrônica)

## Visão Geral

Módulo de emissão de NF-e (modelo 55) e NFC-e (modelo 65) com transmissão real via SEFAZ. Substitui a implementação atual (modelo/estrutura apenas) por integração completa: geração XML com assinatura digital, comunicação SOAP, cálculo tributário, contingência (SVC/EPEC/DPEC). Baseado nos fontes xHarbour `p_nfeger.prg`, `p_nfecon.prg`, `p_acbr.prg`, `p_tbtrib.prg` e `p_cltrib.prg`.

## Arquitetura de Integração

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React)                               │
│  ┌───────────────────┐  ┌───────────────────┐  ┌────────────────────┐  │
│  │ NotasFiscaisPage  │  │ NFCePage          │  │ Config Certificado │  │
│  └────────┬──────────┘  └────────┬──────────┘  └─────────┬──────────┘  │
└───────────┼──────────────────────┼───────────────────────┼─────────────┘
            │                      │                       │
            ▼                      ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         API REST (Express)                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────────┐  │
│  │ notas-fiscais│  │ nfce         │  │ shared/nfe-utils             │  │
│  │ Controller   │  │ Controller   │  │ (chave 44d, XML assembly,    │  │
│  └──────┬───────┘  └──────┬───────┘  │  schemas XSD, validação)    │  │
│         │                 │          └──────────────┬───────────────┘  │
│         │                 │                         │                   │
│  ┌──────┴───────┐  ┌──────┴───────┐  ┌──────────────┴───────────────┐  │
│  │ shared/      │  │ shared/      │  │ shared/sefaz-client          │  │
│  │ tributos     │  │ auditoria    │  │ (SOAP, certificado,          │  │
│  │ (ICMS/IPI/   │  │ fiscal       │  │  envelope XML, schema XSD)   │  │
│  │  PIS/COFINS/ │  │              │  │                              │  │
│  │  CBS/IBS/IS) │  │              │  │                              │  │
│  └──────────────┘  └──────────────┘  └──────────────┬───────────────┘  │
└────────────────────────────────────────────────────┼──────────────────┘
                                                     │
                                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        SERVIÇOS EXTERNOS                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ SEFAZ - NF-e     │  │ SEFAZ - NFC-e    │  │ SEFAZ - NFSe        │  │
│  │ (webservices     │  │ (webservices     │  │ (webservices        │  │
│  │  autorização,    │  │  autorização,    │  │  municipais)        │  │
│  │  inutilização,   │  │  contingência)   │  │                     │  │
│  │  cancelamento)   │  │                  │  │                     │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

## Fluxo de Emissão NF-e

```
                       ┌──────────────┐
                       │ EM_DIGITAÇÃO │
                       └──────┬───────┘
                              │ assinar()
                              ▼
                       ┌──────────────┐
                       │  ASSINADA    │
                       └──────┬───────┘
                              │ enviar()
                              ▼
                 ┌───────────────────────┐
                 │   ENVIADA (lote)      │
                 │   (código de recibo)  │
                 └───────────┬───────────┘
                             │ consulta()
                             ▼
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
       ┌──────────────┐            ┌──────────────┐
       │ AUTORIZADA   │            │  DENEGADA    │
       └──────┬───────┘            └──────────────┘
              │ cancelar()
              ▼
       ┌──────────────┐
       │ CANCELADA    │
       └──────────────┘
```

## Modelos de Dados (Prisma)

### 1. NotaFiscal (já existe — `notas_fiscais`)
```prisma
model NotaFiscal {
  id              String   @id @default(cuid())
  empresaId       String
  filialId        String
  clienteId       String?
  fornecedorId    String?
  pedidoVendaId   String?  @unique

  tipoDocumento   TipoDocumentoNF  @default(SAIDA)
  modelo          ModeloNF         @default(NFE)
  serie           String           @default("001")
  numero          Int
  chaveAcesso     String           @unique

  dataEmissao     DateTime         @default(now())
  dataSaida       DateTime?

  tipoOperacao    TipoOperacaoNF   @default(OPERACAO_INTERNA)
  finalidadeEmissao FinalidadeNF   @default(NORMAL)
  naturezaOperacao String

  // Totais
  valorTotal           Decimal  @default(0)
  valorDesconto        Decimal  @default(0)
  valorFrete           Decimal  @default(0)
  valorSeguro          Decimal  @default(0)
  valorOutros          Decimal  @default(0)
  valorBaseICMS        Decimal  @default(0)
  valorICMS            Decimal  @default(0)
  valorBaseICMSST      Decimal  @default(0)
  valorICMSST          Decimal  @default(0)
  valorPIS             Decimal  @default(0)
  valorCOFINS          Decimal  @default(0)
  valorIPI             Decimal  @default(0)
  valorTotalTributos   Decimal  @default(0)

  // Reforma 2026
  valorBaseCBS         Decimal  @default(0)
  valorCBS             Decimal  @default(0)
  aliquotaCBS          Decimal  @default(0)
  valorBaseIBS         Decimal  @default(0)
  valorIBS             Decimal  @default(0)
  aliquotaIBS          Decimal  @default(0)
  valorIS              Decimal  @default(0)
  aliquotaIS           Decimal  @default(0)
  valorTotalReformaTributaria Decimal @default(0)

  situacao    SituacaoNF  @default(EM_DIGITACAO)
  statusSefaz String?     // código retorno SEFAZ
  motivo      String?     // motivo retorno SEFAZ

  // XML
  xmlEnvio    String?     // XML assinado enviado
  xmlRetorno  String?     // XML retorno SEFAZ
  protocolo   String?     // protocolo autorização
  dataProtocolo DateTime?
  dataAutorizacao  DateTime?
  numeroRecibo String?
  pdfPath      String?

  observacoes               String?
  informacoesComplementares String?

  // Relações
  empresa     Empresa           @relation(fields: [empresaId], references: [id])
  filial      Filial            @relation(fields: [filialId], references: [id])
  cliente     Cliente?          @relation(fields: [clienteId], references: [id])
  fornecedor  Fornecedor?       @relation(fields: [fornecedorId], references: [id])
  pedidoVenda PedidoVenda?      @relation(fields: [pedidoVendaId], references: [id])
  itens       ItemNotaFiscal[]
  eventos     EventoNF[]

  @@unique([empresaId, modelo, serie, numero])
  @@map("notas_fiscais")
}
```

### 2. ItemNotaFiscal (já existe — `itens_nota_fiscal`)
```prisma
model ItemNotaFiscal {
  id          String   @id @default(cuid())
  notaFiscalId String
  produtoId   String?

  numeroItem         Int
  codigo             String
  descricao          String
  ncm                String?
  cfop               String
  unidadeComercial   String
  quantidadeComercial Decimal
  valorUnitarioComercial Decimal
  valorTotalBruto    Decimal
  valorDesconto      Decimal  @default(0)
  valorTotalLiquido  Decimal
  codigoEAN          String?
  codigoTributario   String?
  origemMercadoria   String   @default("0")

  // Tributação ICMS
  icmsCst            String?
  icmsAliquota       Decimal  @default(0)
  icmsBaseCalculo    Decimal  @default(0)
  icmsValor          Decimal  @default(0)
  icmsModalidade     String?  // 0=Margem, 1=Valor
  icmsSTBaseCalculo  Decimal  @default(0)
  icmsSTAliquota     Decimal  @default(0)
  icmsSTValor        Decimal  @default(0)
  icmsReducaoBase    Decimal  @default(0)

  // Tributação PIS/COFINS
  pisCst             String?
  pisAliquota        Decimal  @default(0)
  pisValor           Decimal  @default(0)
  pisBaseCalculo     Decimal  @default(0)
  cofinsCst          String?
  cofinsAliquota     Decimal  @default(0)
  cofinsValor        Decimal  @default(0)
  cofinsBaseCalculo  Decimal  @default(0)

  // Tributação IPI
  ipiCst             String?
  ipiAliquota        Decimal  @default(0)
  ipiValor           Decimal  @default(0)
  ipiBaseCalculo     Decimal  @default(0)
  ipiTributado       Boolean? // true=por alíquota, false=por valor

  // Reforma 2026
  cbsCst             String?
  cbsBaseCalculo     Decimal  @default(0)
  cbsAliquota        Decimal  @default(0)
  cbsValor           Decimal  @default(0)
  ibsCst             String?
  ibsBaseCalculo     Decimal  @default(0)
  ibsAliquota        Decimal  @default(0)
  ibsValor           Decimal  @default(0)
  isAliquota         Decimal  @default(0)
  isValor            Decimal  @default(0)

  notaFiscal NotaFiscal @relation(fields: [notaFiscalId], references: [id])
  produto    Produto?   @relation(fields: [produtoId], references: [id])

  @@map("itens_nota_fiscal")
}
```

### 3. EventoNF (já existe — `eventos_nf`)
```prisma
model EventoNF {
  id             String   @id @default(cuid())
  notaFiscalId   String
  tipoEvento     TipoEventoNF
  sequenciaEvento Int
  dataEvento     DateTime @default(now())
  descricao      String?
  protocolo      String?
  dataProtocolo  DateTime?
  xmlEnvio       String?
  xmlRetorno     String?
  justificativa  String?

  notaFiscal NotaFiscal @relation(fields: [notaFiscalId], references: [id])

  @@unique([notaFiscalId, tipoEvento, sequenciaEvento])
  @@map("eventos_nf")
}
```

### 4. ConfiguracaoNF (já existe — `configuracoes_nf`)
```prisma
model ConfiguracaoNF {
  id        String @id @default(cuid())
  empresaId String @unique

  certificadoDigital String
  senhaCertificado   String
  csc                String?   // Código Segurança Contribuinte (NFC-e)
  cscId              String?

  ambiente    AmbienteNF @default(HOMOLOGACAO)
  serieNFe    String     @default("001")
  serieNFCe   String     @default("001")
  proximoNFe  Int        @default(1)
  proximoNFCe Int        @default(1)

  uf         String  @default("35")  // SP
  municipio  String?

  // Dados emitente (override, se vazio usa dados da empresa)
  razaoSocial        String?
  nomeFantasia       String?
  cnpj               String?
  inscricaoEstadual  String?
  inscricaoMunicipal String?
  logradouro         String?
  numero             String?
  complemento        String?
  bairro             String?
  cep                String?
  telefone           String?
  email              String?
  logoPath           String?

  padrao  PadraoNF @default(NFE_V4)
  versao  String   @default("4.00")

  empresa Empresa @relation(fields: [empresaId], references: [id])
  @@map("configuracoes_nf")
}
```

## Shared Modules a Implementar

### 5. shared/tributos — Cálculo de Tributos

```typescript
// apps/api/src/shared/tributos/index.ts
export interface TributosItem {
  // ICMS
  icmsCst: string;
  icmsAliquota: number;
  icmsReducaoBase: number;
  icmsModalidade: 'MARGEM_VALOR_AGREGADO' | 'VALOR_PAUTA' | 'PRECO_TABELADO' | 'VALOR_OPERACAO';
  icmsSTMargem: number;
  icmsSTReducao: number;

  // IPI
  ipiCst: string;
  ipiAliquota: number;
  ipiTributado: boolean; // true=alíquota, false=valor fixo por unidade

  // PIS/COFINS
  pisCst: string;
  pisAliquota: number;
  cofinsCst: string;
  cofinsAliquota: number;

  // Reforma 2026
  cbsAliquota: number;
  ibsAliquota: number;
  isAliquota: number;

  // Parâmetros do item
  valorUnitario: number;
  quantidade: number;
  valorFrete: number;
  valorSeguro: number;
  valorDespesas: number;
  valorDesconto: number;
}

export interface TributosResult {
  icmsBaseCalculo: number;
  icmsValor: number;
  icmsSTBaseCalculo: number;
  icmsSTValor: number;
  icmsReducaoBase: number;
  ipiValor: number;
  pisValor: number;
  cofinsValor: number;
  cbsValor: number;
  ibsValor: number;
  isValor: number;
  valorTotalTributos: number;
}

export function calcularTributosItem(params: TributosItem): TributosResult

// Partilha ICMS (FC-e)
export function calcularPartilhaICMS(
  valorICMS: number,
  ufOrigem: string,
  ufDestino: string,
  valorTotal: number
): { icmsInterestadual: number; icmsUFOrigem: number; icmsUFDestino: number }

// ICMS-ST (Substituição Tributária)
export function calcularICMSST(params: {
  valorProduto: number;
  valorFrete: number;
  valorSeguro: number;
  valorDespesas: number;
  valorDesconto: number;
  margemST: number;
  aliquotaST: number;
  aliquotaInterna: number;
  reducaoST: number;
}): { baseCalculoST: number; valorST: number; valorICMS: number }
```

### 6. shared/sefaz-client — Comunicação SEFAZ

```typescript
// apps/api/src/shared/sefaz-client/index.ts
export type SefazAmbiente = 'homologacao' | 'producao';
export type SefazModelo = 'nfe' | 'nfce';

export interface SefazConfig {
  uf: string;
  ambiente: SefazAmbiente;
  modelo: SefazModelo;
  certificado: string;  // base64 PFX
  senhaCertificado: string;
}

export interface SefazResult {
  sucesso: boolean;
  protocolo?: string;
  motivo?: string;
  xmlRetorno?: string;
  codigo?: string;
  erros?: Array<{ codigo: string; mensagem: string }>;
}

export class SefazClient {
  constructor(config: SefazConfig)
  async autorizar(xmlAssinado: string): Promise<{ codigoRecibo: string }>
  async consultarRecibo(codigoRecibo: string): Promise<SefazResult>
  async consultarStatus(): Promise<{ status: string; tempoMedio: number; dataHora: string }>
  async inutilizar(
    cnpj: string, uf: string, ambiente: string,
    serie: number, numInicial: number, numFinal: number,
    justificativa: string
  ): Promise<SefazResult>
  async cancelar(
    xmlAssinado: string, protocolo: string, justificativa: string
  ): Promise<SefazResult>
  async cartaCorrecao(
    chaveAcesso: string, sequencia: number, correcao: string
  ): Promise<SefazResult>
  async consultarCadastro(uf: string, documento: string): Promise<any>
  async downloadXML(chaveAcesso: string): Promise<string>
  async downloadPDF(chaveAcesso: string): Promise<Buffer>
}

// Módulo de contingência
export class ContingenciaManager {
  async ativarContingencia(empresaId: string, tipo: 'SVC' | 'EPEC' | 'DPEC')
  async desativarContingencia(empresaId: string)
  async enviarContingencia(notaFiscal: NotaFiscal, tipo: 'SVC' | 'EPEC' | 'DPEC')
}

// Utilitário de certificado
export async function lerCertificado(base64: string, senha: string): Promise<{
  valido: boolean;
  validoAte: Date;
  emissor: string;
  titular: string;
  cnpj: string;
  diasParaExpirar: number;
}>
```

### 7. shared/nfe-utils — Utilitários NF-e

```typescript
// apps/api/src/shared/nfe-utils/index.ts
export function gerarChaveAcesso(params: {
  uf: string;           // código IBGE (35=SP)
  dataEmissao: Date;
  cnpj: string;
  modelo: string;       // 55=NF-e, 65=NFC-e
  serie: string;
  numero: number;
  tipoEmissao: string;  // 1=Normal, 2=Contingência SVC
  codigoNumerico: number;
}): string  // 44 dígitos DV check

export function validarChaveAcesso(chave: string): boolean

export function formatarChaveAcesso(chave: string): string
// Retorna: NFe 352006... formato visual

export function gerarCodigoNumerico(): number
// 8 dígitos aleatórios

export function gerarDigitoVerificador(chaveSemDV: string): string

// XML Assembly
export function montarXMLNFe(dados: DadosNFe): string
export function montarXMLCancelamento(chave: string, protocolo: string, justificativa: string, data: Date): string
export function montarXMLCartaCorrecao(chave: string, sequencia: number, correcao: string, dataEvento: Date): string
export function montarXMLInutilizacao(dados: DadosInutilizacao): string

// Assinatura Digital
export async function assinarXML(xml: string, certificadoBase64: string, senha: string): Promise<string>
export async function validarAssinatura(xmlAssinado: string): Promise<boolean>

// Schemas XSD
export function obterSchema(tipo: 'nfe' | 'nfce' | 'cancelamento' | 'ccorrecao' | 'inutilizacao'): string
export async function validarXMLPorSchema(xml: string, tipo: string): Promise<{ valido: boolean; erros: string[] }>

// DANFE
export async function gerarDANFE(xml: string): Promise<Buffer>

// QRCode NFC-e
export function gerarQRCodeNFCe(params: {
  chaveAcesso: string;
  versao: string;
  ambiente: string;
  csc: string;
  cscId: string;
}): string
```

## API Endpoints

### NF-e (modelo 55) — `notas-fiscais` module
```
POST   /api/v1/notas-fiscais                          criar
GET    /api/v1/notas-fiscais                           listar
GET    /api/v1/notas-fiscais/:id                       buscarPorId
PUT    /api/v1/notas-fiscais/:id                       atualizar
POST   /api/v1/notas-fiscais/:id/assinar               assinar (gera XML + assina digitalmente)
POST   /api/v1/notas-fiscais/:id/enviar                enviar para SEFAZ
POST   /api/v1/notas-fiscais/:id/cancelar              cancelar
POST   /api/v1/notas-fiscais/:id/carta-correcao        carta de correção
GET    /api/v1/notas-fiscais/por-status/:situacao       listar por status
POST   /api/v1/notas-fiscais/inutilizar                inutilizar numeração
GET    /api/v1/notas-fiscais/sefaz/status              status SEFAZ
```

### NFC-e (modelo 65) — `nfce` module
```
POST   /api/v1/nfce                                    criar
GET    /api/v1/nfce                                    listar
GET    /api/v1/nfce/:id                                buscarPorId
PUT    /api/v1/nfce/:id                                atualizar
POST   /api/v1/nfce/:id/assinar                        assinar
POST   /api/v1/nfce/:id/enviar                         enviar
POST   /api/v1/nfce/:id/cancelar                       cancelar
POST   /api/v1/nfce/contingencia/ativar                ativar contingência
POST   /api/v1/nfce/contingencia/desativar             desativar contingência
```

### Configuração
```
POST   /api/v1/notas-fiscais/configurar                configurar certificado
GET    /api/v1/notas-fiscais/configuracao               buscar configuração
```

## Funcionalidades por Plano

| Funcionalidade | BASIC | PROFISSIONAL | PREMIUM |
|---|---|---|---|
| NF-e modelo 55 (emissão manual) | ✅ | ✅ | ✅ |
| NFC-e modelo 65 | ❌ | ✅ | ✅ |
| Transmissão SEFAZ real | ❌ | ✅ | ✅ |
| Cancelamento/CC-e | ❌ | ✅ | ✅ |
| DANFE (PDF) | ❌ | ✅ | ✅ |
| Contingência (SVC/EPEC/DPEC) | ❌ | ❌ | ✅ |
| NFSe (serviços) | ❌ | ❌ | ✅ |
| Limite notas/mês | 100 | 1000 | Ilimitado |

## Dependências Externas

1. **node-forge** — manipulação de certificados digitais A1 (PFX)
2. **xml-crypto** — assinatura digital XML (padrão XMLDSig)
3. **xml2js** / **fast-xml-parser** — parsing/construção XML
4. **axios** — requisições SOAP (já instalado no web, adicionar no api)
5. **xmldom** / **@xmldom/xmldom** — DOM XML para assinatura
6. **pdfkit** ou **jsPDF** — geração DANFE (futuro)

## Ordem de Implementação

| # | Tarefa | Depende de | Esforço |
|---|--------|-----------|---------|
| 1 | shared/tributos (cálculo ICMS/IPI/PIS/COFINS/CBS/IBS/IS) | — | 8h |
| 2 | shared/nfe-utils (chave 44d, XML assembly, schemas) | — | 6h |
| 3 | shared/sefaz-client (SOAP, certificado, endpoints SEFAZ) | — | 8h |
| 4 | assinar: integração shared/nfe-utils + certificado | 1,2,3 | 8h |
| 5 | enviar: integração shared/sefaz-client (autorização + consulta) | 1,2,3,4 | 8h |
| 6 | cancelar + CC-e via SEFAZ | 1,2,3,4 | 4h |
| 7 | inutilizar numeração via SEFAZ | 1,2,3,4 | 4h |
| 8 | NFC-e modelo 65 + QRCode + contingência | 1,2,3,4 | 8h |
| 9 | NFSe (comunicação socket prefeituras) | 1,2,3 | 12h |
| 10 | Contingência SVC/EPEC/DPEC | 1,2,3,4 | 8h |

---
**Versão:** 1.0
**Data:** 30/06/2026
**Autor:** SWE-Agent ERPoraqui
