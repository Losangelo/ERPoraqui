# CT-e (Conhecimento de Transporte Eletrônico) — Guia de Uso

## O que é?

O CT-e (modelo 57) é o documento fiscal digital obrigatório para **contratação de serviço de transporte de cargas**. Ele substitui o antigo CTRC em papel e deve ser emitido sempre que uma empresa contrata um transportador para levar mercadorias.

---

## Quando Emitir CT-e

- Transporte de carga entre filiais
- Venda com frete contratado (transportadora terceira)
- Remessa para industrialização
- Devolução de mercadoria com transporte contratado
- Transporte interestadual e intermunicipal

---

## Estrutura do Documento

O CT-e é um **documento composto** — ele referencia as notas fiscais (NF-e) que estão sendo transportadas:

```
CT-e (modelo 57)
├── Dados do Emitente (contratante)
├── Dados do Tomador (quem paga)
├── Dados do Destinatário (quem recebe)
├── Documentos Vinculados
│   ├── NF-e 1 (chave de acesso)
│   ├── NF-e 2 (chave de acesso)
│   └── ...
├── Dados do Veículo (placa, RNTRC)
└── Dados do Condutor
```

---

## Passo a Passo

### 1. Pré-requisitos

- Empresa cadastrada com certificado digital
- Transportadora cadastrada no sistema
- Veículo e condutor cadastrados

### 2. Criar um CT-e

1. Acesse **Fiscal > CT-e**
2. Clique em **+ Novo CT-e**
3. Selecione o **tomador** do serviço (quem contrata o frete)
4. Informe os dados do **destinatário**
5. Vincule as **NF-e** que serão transportadas
6. Selecione o **veículo** e **condutor**
7. Informe os **valores**: frete, pedágio, taxas
8. Clique em **Salvar**

### 3. Transmitir para SEFAZ

1. Na listagem, localize o CT-e
2. Clique em **Transmitir**
3. O sistema envia para SEFAZ
4. Se autorizado, o CT-e recebe o protocolo

### 4. Encerrar o CT-e

Ao finalizar o transporte:

1. Clique em **Encerrar**
2. Informe data/hora de encerramento
3. O documento é finalizado

---

## Dicas e Boas Práticas

- **Sempre vincule as NF-e corretas** — CT-e com NF-e errada gera multa
- **O peso e valor** devem ser consistentes entre CT-e e NF-e vinculadas
- **RNTRC** do veículo deve estar ativo na ANTT
- **Cancelamento**: prazo de até 24 horas após autorização

---

## Diferenças: CT-e vs MDF-e

| CT-e (modelo 57) | MDF-e (modelo 58) |
|------------------|-------------------|
| Documento por frete/contrato | Documento agregador de viagem |
| Obrigatório para cada serviço | Obrigatório para viagem interestadual |
| Vincula NF-e individualmente | Vincula CT-es de uma viagem |
