# Automação — Guia de Uso

## O que é?

O módulo de Automação permite criar **regras automáticas** que executam ações quando determinados eventos acontecem no sistema. É como programar "se isso acontecer, faça aquilo" — sem precisar escrever código.

---

## Conceitos Essenciais

| Termo | Significado |
|-------|-------------|
| **Trigger (Gatilho)** | Evento que inicia a automação |
| **Ação** | O que acontece quando o gatilho é ativado |
| **Regra** | A combinação de gatilho + condições + ação |
| **Ativo/Inativo** | A regra pode ser ligada/desligada sem ser excluída |

---

## Gatilhos Disponíveis

| Gatilho | Disparado quando... | Exemplo de uso |
|---------|---------------------|----------------|
| **Cliente Criado** | Um novo cliente é cadastrado | Enviar email de boas-vindas |
| **Pedido Confirmado** | Pedido de venda é confirmado | Notificar estoque para separação |
| **Conta Vencendo** | Conta a receber está próxima do vencimento | Enviar lembrete ao cliente |
| **Conta Vencida** | Conta a receber venceu | Notificar financeiro para cobrança |
| **Estoque Baixo** | Produto atinge quantidade mínima | Disparar alerta de reposição |
| **NF-e Autorizada** | Nota fiscal é autorizada pela SEFAZ | Enviar XML e Danfe ao cliente |
| **Meta Atingida** | Vendedor atinge meta do mês | Notificar gerente |

## Ações Disponíveis

| Ação | O que faz | Exemplo |
|------|-----------|---------|
| **Notificar Usuário** | Envia notificação no sistema | "O cliente XYZ foi cadastrado" |
| **Enviar Email** | Dispara email automático | Boleto vence amanhã, segue link |
| **Criar Tarefa** | Cria tarefa para um usuário | "Separar pedido #1234" |
| **Atualizar Campo** | Altera um campo automaticamente | Marcar cliente como "ativo" |
| **Webhook** | Chama uma URL externa | Integrar com sistema de CRM externo |

---

## Exemplos Práticos

### 1. Boas-Vindas para Novo Cliente
```
Gatilho: Cliente Criado
Ação: Enviar Email
Modelo: "Olá {nome}, bem-vindo à {empresa}! Confira nossas promoções"
```

### 2. Alerta de Estoque Baixo
```
Gatilho: Estoque Baixo (qtd < 5)
Ação: Notificar Usuário (compras)
Mensagem: "Produto {produto} com estoque crítico: {estoque} unidades"
```

### 3. Lembrete de Cobrança
```
Gatilho: Conta Vencida (3 dias)
Ação: Criar Tarefa para Financeiro
Título: "Cobrar cliente {cliente} — valor R$ {valor}"
```

### 4. NF-e Autorizada → Enviar ao Cliente
```
Gatilho: NF-e Autorizada
Ação: Enviar Email
Anexo: XML e Danfe
```

---

## Dicas e Truques

### Comece Simples
- Crie **poucas regras** no início, depois vá aumentando
- Regras demais podem gerar notificações em excesso

### Teste Antes
- Deixe a regra como **Inativa** nos primeiros dias
- Ative apenas quando tiver certeza que está configurada corretamente

### Evite Loops
- Cuidado: regras que disparam outras regras podem criar loop infinito
- Ex: "Cliente atualizado → dispara email → email dispara atualização"

### Webhooks
- Use para integrar com **sistemas externos** (WhatsApp, Telegram, CRM)
- O webhook chama uma URL com dados do evento em JSON

---

## Boas Práticas

- **Nomeie as regras** de forma clara: "Email boas-vindas cliente" em vez de "Regra 1"
- **Revise mensalmente**: regras que não são mais necessárias? Desative
- **Não exagere nas notificações**: notificação demais = ninguém lê
- **Combine com CRM**: crie automações que integram vendas com CRM
- **Use para rotinas chatas**: tudo que é repetitivo pode ser automatizado

---

## Armadilhas Comuns

- ❌ **Regra mal configurada**: ação errada, gatilho errado — teste antes
- ❌ **Notificação em excesso**: equipe ignora alertas
- ❌ **Loop infinito**: duas regras que se retroalimentam
- ❌ **Regra inativa esquecida**: achava que estava funcionando mas não estava
- ✅ **Menos é mais**: comece com 2-3 regras bem feitas
