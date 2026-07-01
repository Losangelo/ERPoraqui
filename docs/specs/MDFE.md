# Módulo MDF-e — Especificação Técnica

## Visão Geral

Manifesto Eletrônico de Documentos Fiscais (MDF-e), modelo 58.
Documento fiscal digital que agrupa NF-e e CT-e em uma operação de transporte,
substituindo o antigo manifesto em papel.

## Ciclo de Vida

```
EM_DIGITACAO → ASSINADO → AUTORIZADO → ENCERRADO
                    ↓                          ↓
               CANCELADO (24h)          CANCELADO (após encerramento não pode)
```

## Arquitetura

```
Frontend (MdfePage)
    ↓
API (MdfeController → MdfeService)
    ↓
MdfeEngine
  ├── MdfeXML (montagem XML)
  ├── MdfeValidator (validação XSD)
  └── SefazClient (transmissão SEFAZ)
    ↓
SEFAZ (autorização, consulta, cancelamento, encerramento)
```

## Modelo de Dados (Prisma)

```prisma
model Mdfe {
  id                String   @id @default(cuid())
  empresaId         String
  filialId          String
  serie             Int      @default(1)
  numero            Int
  chaveAcesso       String   @unique
  modelo            String   @default("58")
  ufCarregamento    String
  ufDescarregamento String?
  modal             String   @default("1")    // 1=Rodoviário
  rntrc             String?                   // RNTRC do transportador
  placaVeiculo      String?
  veiculoId         String?
  condutorId        String?
  valorTotalCarga   Decimal  @default(0)
  qtdTotalDocumentos Int     @default(0)
  dataEmissao       DateTime @default(now())
  dataAutorizacao   DateTime?
  dataEncerramento  DateTime?
  situacao          MdfeSituacao @default(EM_DIGITACAO)
  protocolo         String?
  xmlAutorizado     String?
  documentos        MdfeDocumento[]
  eventos           MdfeEvento[]
  empresa           Empresa  @relation(fields: [empresaId], references: [id])
  filial            Filial   @relation(fields: [filialId], references: [id])
}

model MdfeDocumento {
  id            String  @id @default(cuid())
  mdfeId        String
  tipo          String  // "NFE" | "CTE" | "MDFE"
  chaveAcesso   String
  valorDocumento Decimal @default(0)
  pesoTotal     Decimal @default(0)
  mdfe          Mdfe    @relation(fields: [mdfeId], references: [id])
}

model MdfeEvento {
  id          String   @id @default(cuid())
  mdfeId      String
  tipo        String   // CANCELAMENTO, ENCERRAMENTO, INCLUSAO_DOC, TROCA_VEICULO
  descricao   String
  dataEvento  DateTime @default(now())
  protocolo   String?
  xmlRetorno  String?
  mdfe        Mdfe     @relation(fields: [mdfeId], references: [id])
}

model Veiculo {
  id          String  @id @default(cuid())
  empresaId   String
  placa       String
  renavam     String?
  rntrc       String?
  tipoPropriedade String  // "1"=Proprio, "2"=Terceiro
  tara        Decimal @default(0)
  capacidade  Decimal @default(0)
  tipoCarroceria String?
  ativo       Boolean @default(true)
}

model Condutor {
  id          String  @id @default(cuid())
  empresaId   String
  cpf         String
  nome        String
  rntrc       String?
  telefone    String?
  ativo       Boolean @default(true)
}
```

## Enums

```typescript
type MdfeSituacao = 'EM_DIGITACAO' | 'ASSINADO' | 'AUTORIZADO' | 'CANCELADO' | 'ENCERRADO';
type ModalTransporte = 'RODOVIARIO' | 'AEREO' | 'AQUAVIARIO' | 'FERROVIARIO';
type TipoPropriedade = 'PROPRIO' | 'TERCEIRO';
```

## API Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /mdfe | Lista MDF-es (filtros: período, filial, situação) |
| POST | /mdfe | Cria MDF-e (EM_DIGITACAO) |
| GET | /mdfe/:id | Busca MDF-e por ID |
| PUT | /mdfe/:id | Atualiza MDF-e |
| POST | /mdfe/:id/transmitir | Assina + transmite para SEFAZ |
| POST | /mdfe/:id/cancelar | Cancela MDF-e (24h após autorização) |
| POST | /mdfe/:id/encerrar | Encerra MDF-e (fim da viagem) |
| POST | /mdfe/:id/documentos | Adiciona NF-e/CT-e ao manifesto |
| DELETE | /mdfe/:id/documentos/:docId | Remove documento do manifesto |
| POST | /mdfe/:id/trocar-veiculo | Troca veículo/condutor durante viagem |
| GET | /mdfe/:id/pdf | Gera DAMDFE (Documento Auxiliar) |
| GET | /mdfe/:id/xml | Download XML autorizado |
| GET | /veiculos | Lista veículos cadastrados |
| POST | /veiculos | Cadastra veículo |
| GET | /condutores | Lista condutores |
| POST | /condutores | Cadastra condutor |

## Estrutura XML

### Chave de Acesso (44 dígitos)

```
cUF AAMM CNPJ                      mod serie nNF                    tpEmis cNF
 26  2406 00529856000173            58   1    1234                    1      8F4E3C12
```

### Documento MDF-e (resumo)

```xml
<MDFe xmlns="http://www.portalfiscal.inf.br/mdfe">
  <infMDFe Id="MDFe352406005298560001735800100000123418F4E3C12" versao="3.00">
    <ide>
      <cUF>35</cUF>
      <cCT>12345678901</cCT>
      <mod>58</mod>
      <serie>1</serie>
      <nMDF>1234</nMDF>
      <dhEmi>2026-06-01T10:00:00-03:00</dhEmi>
      <tpEmis>1</tpEmis>
      <modal>1</modal>
    </ide>
    <emit>
      <CNPJ>00529856000173</CNPJ>
      <xNome>ERPoraqui Ltda</xNome>
      <IE>123456789</IE>
      <enderEmit>...</enderEmit>
    </emit>
    <infDoc>
      <docNF>
        <cMunCarrega>3550308</cMunCarrega>
        <xMunCarrega>SÃO PAULO</xMunCarrega>
        <NF>
          <serie>1</serie>
          <nNF>12345</nNF>
        </NF>
      </docNF>
    </infDoc>
    <tot>
      <qCTe>0</qCTe>
      <qNF>1</qNF>
      <vCarga>15000.00</vCarga>
    </tot>
    <infAdic>
      <infCont>...</infCont>
    </infAdic>
  </infMDFe>
</MDFe>
```

## DAMDFE (Documento Auxiliar)

PDF impresso que acompanha o transporte:
- Dados do emitente
- Dados do veículo/condutor
- Relação de NF-e/CT-e vinculados
- Carga: peso, valor, volumes
- QRCode para consulta
- RNTRC do transportador

## Regras de Negócio

1. **Cancelamento**: permitido apenas até 24h após autorização, ou antes do encerramento
2. **Encerramento**: após entrega da carga, encerra o manifesto
3. **Inclusão de documentos**: permitida antes do encerramento, gera evento
4. **Troca de veículo**: durante a viagem, gera evento com novo veículo/condutor
5. **Validação NF-e**: apenas NF-e autorizadas podem ser vinculadas
6. **Peso compatível**: soma dos pesos dos documentos não pode exceder capacidade do veículo

## Frontend (MdfePage)

### Estrutura
- Menu: Fiscal > MDF-e
- Dashboard cards: pendentes, autorizados, encerrados hoje, total
- Tabela: Nº MDF-e, Chave, Transporte, Placa, Situação, Data
- Ações: Transmitir, Cancelar, Encerrar, Download XML, DAMDFE

### Wizard Criação (Step-by-step)
1. **Dados Gerais**: filial, série, UF origem/destino, modal
2. **Veículo/Condutor**: placa, RNTRC, condutor
3. **Documentos**: busca e vincula NF-e autorizadas (por chave/período)
4. **Revisão**: resumo dos dados
5. **Transmitir**: assina e envia para SEFAZ

## Dependências

- `apps/api/src/modules/mdfe/` — rotas, controller, service
- `apps/api/src/shared/nfe-utils/` — geração chave 44 dígitos
- `apps/api/src/shared/sefaz-client/` — comunicação SEFAZ
- `apps/api/src/shared/utils/` — gerarXML, assinarXML
- `apps/web/src/pages/mdfe/MdfePage.tsx` — frontend

## Enquadramento nos Planos

| Funcionalidade | BASIC | PROFISSIONAL | PREMIUM |
|----------------|-------|-------------|---------|
| Cadastro veículos | ✅ | ✅ | ✅ |
| Cadastro condutores | ✅ | ✅ | ✅ |
| Emissão MDF-e | ❌ | ✅ | ✅ |
| Transmissão SEFAZ | ❌ | ✅ | ✅ |
| Encerramento | ❌ | ✅ | ✅ |
| Cancelamento | ❌ | ✅ | ✅ |
| DAMDFE PDF | ❌ | ❌ | ✅ |
| Troca veículo/condutor | ❌ | ❌ | ✅ |

## Ordem de Implementação

1. Schemas Prisma (Mdfe, MdfeDocumento, MdfeEvento, Veiculo, Condutor)
2. CRUD Veículos + Condutores (backend + frontend)
3. CRUD MDF-e sem transmissão
4. Montagem XML + assinatura
5. Transmissão SEFAZ (autorização)
6. Cancelamento + encerramento
7. Geração DAMDFE (PDF)
8. Eventos: inclusão documento, troca veículo
9. Frontend completo + menu
