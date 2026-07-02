# SPED Fiscal — Guia de Uso

## O que é?

O SPED Fiscal (Sistema Público de Escrituração Digital) é a obrigação acessória que **substitui a escrituração fiscal em papel** por arquivos digitais. É o principal relatório fiscal que as empresas brasileiras entregam ao Fisco.

O arquivo gerado (TXT no layout do SPED) contém todos os documentos fiscais emitidos e recebidos, apuração de impostos, estoques e inventário.

---

## Conceitos Essenciais

| Termo | Significado |
|-------|-------------|
| **Blocos** | Cada parte do SPED é um bloco (ex: Bloco C = documentos fiscais) |
| **Registro** | Cada linha do arquivo SPED é um registro (ex: C100 = cabeçalho NF-e) |
| **PVA** | Programa Validador e Assinador — software da Receita que valida o arquivo |
| **Período de Apuração** | Mês/ano que o SPED cobre (geralmente mensal) |
| **Layout** | Versão do leiaute do SPED (ex: 1.10, 1.11, 2.00) |
| **ICMS** | Imposto estadual — principal imposto apurado no SPED |

---

## Blocos do SPED

| Bloco | Conteúdo | Obrigatório? |
|-------|----------|--------------|
| **Bloco 0** | Abertura, parceiros (clientes/fornecedores), produtos, unidades, contador | Sim |
| **Bloco C** | Documentos fiscais NF-e/NFC-e emitidos e recebidos (C100, C170, C190) | Sim |
| **Bloco D** | Notas fiscais de serviço NFSe (D100, D190) | Se houver |
| **Bloco E** | Apuração do ICMS (E100, E110) — entradas/saídas, saldo credor/devedor | Sim |
| **Bloco G** | CIAP — Controle de Crédito de ICMS do Ativo Permanente | Se houver |
| **Bloco H** | Inventário de mercadorias (H010) | Sim (anual) |
| **Bloco K** | Controle de produção e estoque (industrial) | Se industrial |
| **Bloco 1** | Outras informações (consolidação) | Sim |

---

## Fluxo de Geração

```
Selecionar Período → Escolher Blocos → Gerar Arquivo → Validar no PVA → Transmitir
```

### 1. Configuração Inicial
Antes de gerar o primeiro SPED, configure:
- **Contador**: dados do contador responsável (CRC, CPF, nome)
- **Perfil de apresentação**: A, B ou C (definido pelo Fisco)
- **Blocos ativos**: marque apenas os blocos que sua empresa precisa
- **Inventário**: data do último inventário físico

### 2. Gerar o Arquivo
- Selecione o **mês/ano** de apuração
- Escolha os **blocos** que deseja incluir
- Clique em **Gerar SPED**
- O sistema monta o arquivo TXT no layout oficial

### 3. Validar
- Baixe o arquivo gerado
- Abra no **PVA do SPED Fiscal** (software gratuito da Receita)
- O PVA valida a estrutura, registros obrigatórios e consistência dos dados

### 4. Corrigir e Regenerar
- Se o PVA apontar erros, corrija no sistema e gere novamente
- Repita até o PVA não acusar erros críticos

### 5. Transmitir
- Assine digitalmente no PVA (certificado digital)
- Transmita pela internet
- Guarde o recibo (protocolo de entrega)

---

## Dicas e Truques

### Erros comuns no PVA

| Erro | Causa | Solução |
|------|-------|---------|
| "Registro C100 sem C170" | NF-e sem itens no SPED | Verifique se os itens foram carregados |
| "Registro 0150 duplicado" | Cliente/fornecedor com dois cadastros no mesmo CNPJ | Unifique os cadastros no sistema |
| "Data fora do período" | NF-e de outro mês inclusa | Filtre corretamente o período |
| "C190 com CST diferente" | Itens da mesma NF-e com CSTs diferentes | O SPED espera CST único por NF-e |
| "Bloco H sem inventário" | Empresa não tem inventário registrado | Cadastre o inventário do período |

### Períodos
- O SPED é **mensal** — gere todo mês
- O prazo de entrega é até o **10º dia útil** do 2º mês subsequente
- Exemplo: SPED de maio → entrega até 10 de julho

### CIAP (Bloco G)
- Controle de crédito de ICMS de ativo permanente (máquinas, equipamentos)
- O crédito é apropriado em 48 parcelas mensais
- Configure os bens do ativo no sistema para gerar automaticamente

### Simplificado vs. Completo
- **Perfil A**: empresa com mais de 300 operações/mês — completo
- **Perfil B**: empresa com até 300 operações/mês — reduzido
- **Perfil C**: Microempreendedor Individual (MEI) — simplificado
- Configure o perfil correto da sua empresa

---

## Boas Práticas

- **Gere o SPED todo mês** — não deixe acumular
- **Valide no PVA antes de transmitir** — evita rejeição
- **Mantenha cadastros consistentes**: clientes, fornecedores e produtos sem duplicidade
- **Confira a apuração do ICMS** — o Bloco E deve bater com a contabilidade
- **Inventário anual**: registre o inventário físico no sistema para o Bloco H
- **Histórico**: mantenha todos os arquivos SPED gerados (TXTs e recibos) organizados por ano

---

## Quando Gerar Cada Bloco

| Bloco | Frequência | Quando |
|-------|------------|--------|
| **Bloco 0** | Mensal | Sempre |
| **Bloco C** | Mensal | Sempre (se emitiu/recebeu NF-e) |
| **Bloco D** | Mensal | Se emitiu NFSe |
| **Bloco E** | Mensal | Sempre |
| **Bloco G** | Mensal | Se tem CIAP |
| **Bloco H** | Anual | Ou no encerramento da empresa |
| **Bloco K** | Mensal | Se industrial |

---

## Armadilhas Comuns

- ❌ **Deixar para a última hora**: o SPED exige dados consistentes — comece com antecedência
- ❌ **Bloco E batendo com a contabilidade**: confira se a apuração de ICMS está correta
- ❌ **Inventário desatualizado**: o Bloco H precisa refletir o estoque real
- ❌ **Pular a validação no PVA**: sempre valide antes de transmitir
- ❌ **Não guardar recibos**: perdeu o recibo = não consegue comprovar entrega
- ✅ **Mantenha uma rotina mensal**: agende no calendário a geração do SPED
