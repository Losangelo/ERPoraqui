# NF-e / NFC-e — Guia de Uso

## O que é?

- **NF-e (Nota Fiscal Eletrônica)** — modelo 55, para vendas entre empresas (B2B), com circulação de mercadoria
- **NFC-e (Nota Fiscal de Consumidor Eletrônica)** — modelo 65, para vendas diretas ao consumidor final (B2C), como varejo

Ambas são documentos fiscais digitais que substituem as antigas notas fiscais em papel. A validade jurídica é garantida pela assinatura digital e autorização da SEFAZ.

---

## Conceitos Essenciais

| Termo | Significado |
|-------|-------------|
| **Chave de Acesso** | 44 dígitos que identificam a nota unicamente no Brasil |
| **Protocolo de Autorização** | Número da SEFAZ que comprova que a nota foi autorizada |
| **Danfe** | Documento Auxiliar (PDF para impressão) — não é a nota fiscal, apenas um resumo |
| **Série** | Sequência numérica da nota (cada série tem numeração própria) |
| **Natureza da Operação** | Descrição do tipo de venda (ex: "Venda de Mercadoria", "Remessa para Industrialização") |
| **CFOP** | Código Fiscal de Operações e Prestações (ex: 5.102 = Venda de Mercadoria) |
| **CSC** | Código de Segurança do Contribuinte — usado para gerar o QR Code da NFC-e |

---

## Fluxo de Emissão

```
Digitar Nota → Validar → Assinar Digitalmente → Transmitir SEFAZ → Receber Autorização → Emitir Danfe
```

### 1. Dados da Nota
- **Destinatário**: cliente (obrigatório para NF-e, opcional para NFC-e)
- **Produtos**: selecione os itens com quantidade, valor, CFOP e CST
- **Impostos**: ICMS, IPI, PIS, COFINS — calculados automaticamente com base no regime tributário
- **Transporte**: dados da transportadora (se houver frete)
- **Pagamento**: forma e condição de pagamento

### 2. Validação
- O sistema verifica se todos os campos obrigatórios estão preenchidos
- Valida CFOP, CST, NCM dos produtos
- Verifica se o cliente está regular (CPF/CNPJ válido)

### 3. Assinatura Digital
- O sistema usa o **certificado digital A1** (arquivo PFX) da empresa
- A assinatura garante a integridade e autenticidade do documento

### 4. Transmissão SEFAZ
- A nota é enviada para a SEFAZ do estado
- A SEFAZ valida e retorna o **protocolo de autorização**
- Nota autorizada = documento fiscal válido

### 5. Impressão
- **NF-e**: imprime o Danfe (PDF) para acompanhar a mercadoria
- **NFC-e**: imprime o cupom fiscal (pode ser em papel térmico)

---

## Dicas e Truques

### NF-e vs. NFC-e — qual usar?

| Situação | Qual usar |
|----------|-----------|
| Venda para outra empresa (CNPJ) | **NF-e** (modelo 55) |
| Venda para consumidor final com CPF | **NFC-e** (modelo 65) |
| Venda no varejo, loja física | **NFC-e** |
| Venda com entrega para outra cidade | **NF-e** |
| Venda no PDV (balcão) | **NFC-e** integrada ao PDV |

### Erro de autorização? O que fazer?
1. **Nota rejeitada**: veja o motivo no retorno da SEFAZ — geralmente é dado cadastral incorreto
2. **Nota denegada**: CPF/CNPJ do destinatário irregular — regularize junto à Receita
3. **Timeout de comunicação**: a nota fica em "Contingência" — tente novamente em alguns minutos

### Certificado Digital
- O certificado A1 (PFX) tem validade de 1 ano
- **Renove antes de vencer** — notas não podem ser emitidas com certificado vencido
- Mantenha o arquivo PFX e a senha em local seguro

### CST e CSOSN
- **Regime Normal (Lucro Real/Presumido)**: use CST (00, 10, 20, 30, 40, 41, 50, 51, 60, 70, 90)
- **Simples Nacional**: use CSOSN (101, 102, 103, 201, 202, 203, 300, 400, 500, 900)
- Configure o regime da empresa corretamente no cadastro

### Cancelamento
- **Prazo**: até 24 horas (antes de 01/07/2021 era 24h, hoje pode ser até 7 dias em alguns estados, verifique)
- A nota precisa estar **autorizada** (não pode cancelar nota rejeitada)
- Solicite o cancelamento pelo sistema → SEFAZ processa e retorna o protocolo

### Carta de Correção (CC-e)
- Use para corrigir dados **não tributários** (endereço, descrição do produto, etc.)
- **Não pode** corrigir: valor, CFOP, CST, destinatário
- Cada nota pode ter no máximo 20 cartas de correção

---

## Exemplo Prático

**Cenário:** Venda de 10 cadeiras por R\$ 300,00 cada para empresa "Comércio Ltda" (CNPJ).

1. Criar NF-e → selecionar filial e cliente
2. Adicionar produto "Cadeira Escritório" com qtd 10, valor R\$ 300,00
3. Sistema calcula ICMS 18%, PIS 1,65%, COFINS 7,6%
4. Conferir CFOP 5.102 (Venda de Mercadoria), CST 00 (Tributada Integralmente)
5. Assinar digitalmente → sistema usa o certificado da empresa
6. Transmitir → SEFAZ autoriza → protocolo recebido
7. Imprimir Danfe → anexar à mercadoria para transporte
8. Nota registrada no SPED automaticamente no próximo período

---

## Boas Práticas

- **Valide os dados do cliente** antes de emitir (CPF/CNPJ ativo na Receita)
- **Confira o CFOP** — cada operação tem um CFOP específico
- **NFC-e no PDV**: configure o CSC da empresa no sistema para gerar QR Code válido
- **Mantenha as notas autorizadas** organizadas por mês para o SPED
- **Nunca emita nota sem autorização** da SEFAZ (nota "em contingência" só em último caso)

---

## Armadilhas Comuns

- ❌ **CFOP errado**: usar CFOP de devolução para uma venda normal
- ❌ **CST incompatível**: usar CST de regime normal em empresa do Simples Nacional
- ❌ **Nota denegada**: cliente com CPF/CNPJ suspenso — verifique antes
- ❌ **Certificado vencido**: sistema não permite emitir — mantenha válido
- ❌ **Série duplicada**: cada série tem numeração própria — não confunda
- ✅ **Sempre confira** o resumo da nota antes de transmitir
