# Especificação Técnica - Módulo NFSe (Nota Fiscal de Serviços Eletrônica)

## Visão Geral

Módulo de emissão de NFSe (Nota Fiscal de Serviços Eletrônica) para prestação de serviços, com comunicação via webservice SOAP com as prefeituras municipais. Implementado com suporte a múltiplos padrões (ABRASF, GINFES, etc).

## Arquitetura

```
┌────────────────────────────────────────────────────────────┐
│                    FRONTEND (NFSePage)                      │
│  (serviços, emissão, cancelamento, consulta)               │
└────────────────────────┬───────────────────────────────────┘
                         │
┌────────────────────────▼───────────────────────────────────┐
│                  API REST (nfse module)                     │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  │
│  │ NFSeController│  │ NFSeService   │  │ DTO/Zod       │  │
│  └───────┬───────┘  └───────┬───────┘  └───────────────┘  │
└──────────┼──────────────────┼──────────────────────────────┘
           │                  │
┌──────────▼──────────────────▼──────────────────────────────┐
│                    SHARED                                   │
│  shared/tributos  shared/nfe-utils  shared/sefaz-client   │
└────────────────────────────────────────────────────────────┘
```

## Dados Específicos

### Serviço
- Código de serviço (LC 116/2003)
- Alíquota ISS (2% a 5%)
- Valor do serviço
- Deduções (materiais, subtotal)
- Base de cálculo
- ISS retido na fonte

### Prestador
- Inscrição municipal (obrigatória)
- Incentivo fiscal (Simples Nacional)

### Tomador
- CPF/CNPJ
- Inscrição municipal (opcional)
- Endereço completo

## Padrões Suportados

| Padrão | Cidades | Status |
|--------|---------|--------|
| ABRASF 2.01 | São Paulo, Campinas | Pendente |
| ABRASF 2.02 | Diversas | Pendente |
| ABRASF 2.03 | Diversas | Pendente |
| GINFES | Belo Horizonte, Curitiba | Pendente |
| BHISS | Betim, Contagem | Pendente |
| SimplISS | Diversas | Pendente |

## Enquadramento nos Planos

| Funcionalidade | BASIC | PROFISSIONAL | PREMIUM |
|---|---|---|---|
| NFSe emissão manual | ❌ | ❌ | ✅ |
| Cancelamento NFSe | ❌ | ❌ | ✅ |
| Comunicação prefeitura | ❌ | ❌ | ✅ |
| Múltiplos padrões | ❌ | ❌ | ✅ |

---
**Versão:** 1.0
**Data:** 30/06/2026
**Autor:** SWE-Agent ERPoraqui
