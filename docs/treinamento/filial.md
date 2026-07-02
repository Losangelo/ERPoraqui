# Filial — Guia de Uso

## O que é?

O módulo de Filial gerencia **unidades da mesma empresa** (filiais, lojas, depósitos) que **compartilham o mesmo CNPJ**. Diferente do Multi-empresa (CNPJs diferentes), aqui todas as filiais pertencem à mesma pessoa jurídica.

---

## Conceitos Essenciais

| Termo | Significado |
|-------|-------------|
| **Empresa (Matriz)** | O CNPJ principal |
| **Filial** | Unidade da mesma empresa (mesmo CNPJ, IE diferente) |
| **Seletor de Filial** | Componente que aparece nas telas para escolher qual filial está atuando |
| **Inscrição Estadual** | Cada filial pode ter IE diferente |

---

## Como Usar

### Cadastro
1. Acesse **Cadastros > Filiais**
2. Selecione a empresa (matriz)
3. Cadastre a filial com: nome, endereço, IE, telefone
4. A filial aparece automaticamente no **seletor de filial** em todo o sistema

### Onde o Seletor Aparece
- **NF-e**: escolha qual filial está emitindo a nota
- **NFC-e**: escolha qual filial (loja) está vendendo
- **NFSe**: escolha qual filial prestou o serviço
- **PDV**: escolha qual filial está com o caixa aberto
- **Pedidos**: escolha qual filial está vendendo

---

## Dicas e Truques

### Filial vs. Multi-empresa

| Situação | Use |
|----------|-----|
| **Mesmo CNPJ, lojas diferentes** | Filial |
| **CNPJs diferentes do mesmo grupo** | Multi-empresa |
| **Mesmo CNPJ, IE diferentes** | Filial |
| **Empresas independentes sob holding** | Multi-empresa |

### Exemplos de Filiais
- Loja Centro, Loja Shopping (mesmo CNPJ)
- Depósito 1, Depósito 2 (mesmo CNPJ)
- Matriz SP, Filial RJ (mesmo CNPJ, IE RJ)

### Vantagens
- **Estoque separado** por filial: cada uma controla seu próprio saldo
- **Notas fiscais**: cada filial emite com sua própria IE
- **Relatórios**: filtre por filial para ver desempenho individual
- **Financeiro**: contas podem ser alocadas por filial

---

## Boas Práticas

- **Cadastre todas as filiais** mesmo que tenham o mesmo endereço da matriz
- **Configure a IE** correta de cada filial — usada nas notas fiscais
- **Selecione a filial correta** antes de emitir nota ou fechar venda
- **Estoque**: cada filial gerencia seu próprio estoque — acerte as transferências entre filiais
- **Relatórios**: compare o desempenho de cada filial mensalmente
