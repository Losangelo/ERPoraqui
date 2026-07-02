# NFSe (Nota Fiscal de Serviços Eletrônica) — Guia de Uso

## O que é?

A NFSe é o documento fiscal digital para **prestação de serviços**. Diferente da NF-e (mercadorias), a NFSe é regulada pelos municípios — cada cidade tem suas próprias regras, alíquotas e sistema de autorização.

**Exemplos de serviços que usam NFSe:** consultoria, desenvolvimento de software, advocacia, contabilidade, limpeza, manutenção, eventos, educação.

---

## Conceitos Essenciais

| Termo | Significado |
|-------|-------------|
| **ISS** | Imposto Sobre Serviços — tributo municipal, alíquota varia de 2% a 5% |
| **RPS** | Recibo Provisório de Serviços — documento temporário até a nota ser autorizada |
| **Tomador** | Quem está contratando/consumindo o serviço (cliente) |
| **Prestador** | Quem está prestando o serviço (sua empresa) |
| **Código de Serviço** | Código da lista LC 116/2003 que identifica o tipo de serviço |
| **Regime Especial** | Empresas do Simples Nacional podem ter alíquota diferenciada de ISS |

---

## Fluxo de Emissão

```
Criar Nota → Selecionar Serviço → Calcular ISS → Transmitir → Autorização → PDF
```

### 1. Dados da Nota
- **Tomador**: cliente (obrigatório, CPF ou CNPJ)
- **Serviço**: selecione o código de serviço da lista municipal
- **Valor**: valor do serviço prestado
- **Deduções**: materiais, subempreitadas (quando a lei municipal permite)
- **ISS**: alíquota configurada para sua empresa no município

### 2. Transmissão
- A NFSe é enviada para o sistema da **prefeitura** (não SEFAZ)
- Cada município tem seu próprio webservice
- O sistema gerencia a comunicação com cada prefeitura

### 3. Resultado
- **Autorizada**: nota válida, pode emitir o PDF
- **Rejeitada**: veja o motivo (geralmente cadastro incorreto do tomador)
- **RPS pendente**: se a prefeitura estiver fora do ar, o RPS fica pendente para envio posterior

---

## Dicas e Truques

### Alíquota de ISS
- Verifique a **alíquota do município do prestador** (não do tomador)
- A alíquota mínima é 2% (LC 116/2003)
- Empresas do **Simples Nacional** têm ISS incluso na guia DAS — mas ainda precisam emitir NFSe

### Código de Serviço
- Use a lista da **LC 116/2003** — padronizada nacionalmente
- Exemplos comuns:
  - **1.05**: Desenvolvimento de software
  - **1.07**: Suporte técnico de informática
  - **1.08**: Consultoria em informática
  - **17.01**: Assessoria/consultoria contábil
  - **18.01**: Serviços de cobrança

### Retenção de Impostos
- **IRRF**: 1,5% sobre o valor do serviço (tomador pessoa jurídica)
- **CSLL**: 1%
- **COFINS**: 3%
- **PIS**: 0,65%
- **INSS**: 11% (serviços com cessão de mão de obra)
- Configure no sistema quais impostos devem ser retidos

### Tomador Pessoa Física
- Basta CPF e nome — sem exigência de Inscrição Municipal
- A nota é mais simples que NF-e (não precisa de CFOP, CST, etc.)

### Cancelamento
- **Prazo**: até 24 horas da emissão (depende do município)
- Solicite o cancelamento → prefeitura valida e autoriza
- Notas canceladas continuam no histórico com status "Cancelado"

---

## Exemplo Prático

**Cenário:** Sua empresa prestou serviço de consultoria em TI para "Empresa XYZ" no valor de R\$ 5.000,00.

1. Criar NFSe → selecionar tomador
2. Código de serviço: **1.08** (Consultoria em informática)
3. Valor: R\$ 5.000,00
4. ISS: 2% (alíquota do seu município) = R\$ 100,00
5. Sem retenções (tomador optante pelo Simples)
6. Transmitir → prefeitura autoriza → nota emitida com sucesso
7. Enviar PDF e XML para o cliente por email

---

## Boas Práticas

- **Cadastre os serviços** mais usados como favoritos para emissão rápida
- **Confira o CNPJ/CPF do tomador** antes de emitir — erros geram retrabalho
- **Retenção na fonte**: se o tomador for empresa de grande porte, ele pode reter impostos — confira antes
- **Guarde os XMLs** de todas as notas autorizadas — a fiscalização pode solicitar
- **Mantenha a alíquota de ISS atualizada** conforme legislação municipal

---

## Armadilhas Comuns

- ❌ **Emitir NFSe para mercadoria**: serviço tem NFSe, mercadoria tem NF-e — não confunda
- ❌ **Alíquota de ISS errada**: cada município tem sua alíquota — verifique antes
- ❌ **Tomador sem Inscrição Municipal**: para serviços contínuos, alguns municípios exigem — confira
- ❌ **RPS sem envio**: se a nota ficou como RPS, lembre de transmitir depois
- ❌ **Código de serviço genérico**: evite código 99.00 (outros serviços) — use o específico
- ✅ **Sempre emita com o código de serviço correto** — evita problemas fiscais
