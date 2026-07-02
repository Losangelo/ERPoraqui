# MDF-e (Manifesto Eletrônico de Documentos Fiscais) — Guia de Uso

## O que é?

O MDF-e é o documento fiscal digital que **acompanha o transporte de mercadorias**. Ele reúne em um único manifesto todas as notas fiscais (NF-e/CT-e) que estão sendo transportadas em um veículo.

**Obrigatório para:** transporte interestadual ou intermunicipal de cargas, tanto por transportadoras quanto por empresas que fazem frete próprio.

---

## Conceitos Essenciais

| Termo | Significado |
|-------|-------------|
| **Chave de Acesso** | 44 dígitos do MDF-e (modelo 58) |
| **Veículo** | Caminhão, carreta, reboque — identificado pela placa |
| **Condutor** | Motorista responsável pelo veículo |
| **Documento Vinculado** | NF-e ou CT-e que está sendo transportado |
| **RNTRC** | Registro Nacional de Transportadores Rodoviários de Carga |
| **Ciência da Operação** | Registro de que o transportador tem ciência do MDF-e |
| **Encerramento** | Finalização do manifesto após a entrega |

---

## Ciclo de Vida

```
Cadastrar Veículo + Condutor → Criar MDF-e → Incluir Documentos → Autorizar SEFAZ → Iniciar Viagem → Encerrar
```

### 1. Pré-requisitos
Antes do primeiro MDF-e, cadastre:
- **Veículos**: placa, RNTRC, capacidade, tipo de carroceria
- **Condutores**: CPF, CNH, RNTRC (quando obrigatório)

### 2. Criar o Manifesto
- Selecione o **veículo** e **condutor** principal
- Defina **UF de carregamento e descarregamento**
- Informe o **município de descarregamento**

### 3. Incluir Documentos
- Adicione as **NF-e/CT-e** que estão sendo transportadas
- Informe o **valor** e **peso** de cada documento
- O sistema calcula automaticamente o total da carga

### 4. Autorização
- O MDF-e é transmitido para a **SEFAZ de origem** (UF do carregamento)
- Após autorizado, o manifesto está válido para circular
- O **DAMDFE** (documento auxiliar) deve ser impresso e levado no veículo

### 5. Encerramento
- Após a entrega de todas as mercadorias, **encerre** o manifesto
- Informe a data/hora do encerramento
- O manifesto fica com status **ENCERRADO**

---

## Estados do MDF-e

```
EM_DIGITACAO → AUTORIZADO → ENCERRADO
     ↓             ↓
  CANCELADO    CANCELADO
```

- **EM_DIGITAÇÃO**: sendo montado, ainda não transmitido
- **AUTORIZADO**: válido para circular, aprovado pela SEFAZ
- **CANCELADO**: cancelado (prazo: até encerramento)
- **ENCERRADO**: todas as entregas concluídas

---

## Dicas e Truques

### Veículo e Condutor
- Cadastre todos os veículos da frota **antes** de emitir o primeiro MDF-e
- O mesmo condutor pode aparecer em vários MDF-es (diferentes viagens)
- Mantenha o **RNTRC** atualizado — sem ele, o MDF-e pode ser rejeitado

### Documentos no Manifesto
- **Não misture** NF-e de vendas diferentes no mesmo manifesto se forem para clientes diferentes
- Cada NF-e deve ter seu **peso** aproximado informado
- O valor total dos documentos deve ser informado corretamente

### Cancelamento
- Só é possível cancelar MDF-e **antes do encerramento**
- Se precisar alterar documentos, cancele e crie um novo
- O cancelamento precisa de justificativa

### Encerramento
- Faça o encerramento **logo após a última entrega**
- MDF-e em aberto por muito tempo pode gerar notificação da SEFAZ
- O encerramento é obrigatório para finalizar o manifesto

### Obrigatoriedade
- É obrigatório a partir de **determinado valor** ou **distância** (consulte legislação do seu estado)
- Geralmente obrigatório para transporte interestadual
- Empresas que fazem **frete próprio** também precisam emitir

---

## Exemplo Prático

**Cenário:** Transportar 50 cadeiras (NF-e 1234) e 30 mesas (NF-e 1235) de São Paulo para o Rio de Janeiro.

1. Cadastrar veículo **ABC-1234** (caminhão baú, capacidade 5.000 kg)
2. Cadastrar condutor **João Silva** (CPF, CNH, RNTRC)
3. Criar MDF-e: veículo ABC-1234, condutor João, UF carregamento SP → descarregamento RJ
4. Incluir NF-e 1234 (valor R\$ 15.000, peso 300 kg)
5. Incluir NF-e 1235 (valor R\$ 9.000, peso 200 kg)
6. Transmitir → SEFAZ autoriza → DAMDFE impresso
7. Viagem realizada → encerrar manifesto com data/hora
8. Status **ENCERRADO** — manifesto concluído

---

## Boas Práticas

- **Planeje os manifestos** por rota — um manifesto por viagem
- **Cadastre toda a frota** no sistema antes de começar a emitir
- **Confira o RNTRC** do veículo e condutor — evita rejeição
- **Mantenha DAMDFE impresso** dentro do veículo durante o transporte
- **Encerre o manifesto** assim que finalizar as entregas
- **Histórico**: todos os MDF-es ficam registrados para consulta futura

---

## Documentos que Podem ser Vinculados

| Tipo | Modelo | Exemplo |
|------|--------|---------|
| **NF-e** | 55 | Nota Fiscal de venda de mercadoria |
| **CT-e** | 57 | Conhecimento de Transporte Eletrônico |
| **MDF-e** | 58 | Manifesto (subcontratação) |

---

## Armadilhas Comuns

- ❌ **Emitir sem cadastrar veículo**: sempre cadastre antes
- ❌ **Condutor sem CNH válida**: o sistema valida — mantenha atualizada
- ❌ **NF-e de outro estado**: o manifesto é por UF de origem — organize por rota
- ❌ **Esquecer de encerrar**: manifesto fica em aberto — pode gerar multa
- ❌ **Peso incorreto**: o peso informado deve ser aproximado ao real
- ✅ **Sempre encerre o manifesto** após concluir a entrega
