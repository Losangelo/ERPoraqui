# Especificação Técnica - Módulo NFC-e (Nota Fiscal Consumidor Eletrônica)

## Visão Geral

A NFC-e (modelo 65) é a versão simplificada da NF-e para venda ao consumidor final, com QRCode para consulta e DANFE simplificado. Este módulo complementa o módulo NF-e (`docs/specs/NFE.md`), compartilhando sua base de tributos, comunicação SEFAZ e utilidades.

## Arquitetura

```
┌────────────────────────────────────────────────────┐
│               FRONTEND (NFCePage)                   │
│  (seleção produtos, cálculo, envio, impressão)     │
└──────────────────────┬─────────────────────────────┘
                       │
┌──────────────────────▼─────────────────────────────┐
│              API REST (nfce module)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────┐  │
│  │ NFCeController│  │ NFCeService  │  │ DTO/Zod │  │
│  └──────┬───────┘  └──────┬───────┘  └─────────┘  │
└─────────┼─────────────────┼────────────────────────┘
          │                 │
┌─────────▼─────────────────▼────────────────────────┐
│              SHARED MODULES                         │
│  shared/tributos  shared/nfe-utils  shared/sefaz   │
└────────────────────────────────────────────────────┘
```

## Fluxo de Emissão NFC-e

```
EM_DIGITACAO → ASSINADA → ENVIADA → AUTORIZADA
                                    → DENEGADA (retorno SEFAZ)
AUTORIZADA → CANCELADA (até 30min)
```

## Dados Específicos NFC-e

### Diferenças para NF-e (modelo 55)

| Item | NF-e (55) | NFC-e (65) |
|------|-----------|------------|
| Destinatário | Obrigatório | Opcional (CPF/CNPJ pode ser omitido) |
| DANFE | DANFE tradicional | DANFE simplificado (impressão térmica) |
| QRCode | Não | Obrigatório no XML |
| CSC | Não | Obrigatório (Código Segurança Contribuinte) |
| Cancelamento | Até 24h | Até 30min |
| Série | Qualquer | Única (ex: 001) |
| Transporte | Campo opcional | Não se aplica |
| Fatura | Campo opcional | Não se aplica |

## QRCode NFC-e

O QRCode é gerado a partir dos parâmetros:
```
chaveAcesso|versao|tpAmb|cscId|hashCSC
```

Implementado em `shared/nfe-utils/index.ts:gerarQRCodeNFCe()`.

## Enquadramento nos Planos

| Funcionalidade | BASIC | PROFISSIONAL | PREMIUM |
|---|---|---|---|
| NFC-e modelo 65 | ❌ | ✅ | ✅ |
| QRCode | ❌ | ✅ | ✅ |
| Impressão DANFE simplificado | ❌ | ✅ | ✅ |
| Contingência NFC-e | ❌ | ❌ | ✅ |

## Dependências

Compartilha com NF-e: axios, fast-xml-parser, node-forge, xml-crypto.

---
**Versão:** 1.0
**Data:** 30/06/2026
**Autor:** SWE-Agent ERPoraqui
