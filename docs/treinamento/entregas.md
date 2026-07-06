# Módulo Entregas — Guia de Treinamento

## O que é o Módulo de Entregas?

O módulo de Entregas do ERPoraqui permite gerenciar todo o ciclo de entrega de pedidos aos clientes:

- **Rastreamento**: acompanhe onde está cada entrega em tempo real
- **Motoristas e Veículos**: cadastre sua frota e equipe
- **Taxas de Entrega**: configure regras de cálculo automático
- **Notificações**: o cliente recebe e-mails automáticos
- **Avaliação**: o cliente avalia a entrega após receber

---

## 1. Configuração Inicial

Antes de criar entregas, cadastre seus recursos:

### 1.1 Cadastrar Motoristas

**Acesse:** Vendas > Entregas > Motoristas > + Novo Motorista

Preencha:
- **Nome completo** (obrigatório)
- **CPF** (obrigatório, único)
- **CNH**: número da carteira de motorista
- **Categoria da CNH**: A, B, C, D ou E
- **Vencimento da CNH**: data de validade
- **Telefone** e **E-mail**

**Dica:** mantenha as CNHs sempre atualizadas para evitar multas.

### 1.2 Cadastrar Veículos

**Acesse:** Vendas > Entregas > Veículos > + Novo Veículo

Preencha:
- **Placa** (obrigatório, único)
- **Renavam**: documento do veículo
- **Marca, Modelo, Ano, Cor**
- **Capacidade (kg)**: peso máximo que suporta
- **Tipo de Carroceria**: baú, aberta, refrigerada, etc.

**Armadilha:** se o veículo for usado em MDF-e, a placa deve ser a mesma cadastrada no Detran.

### 1.3 Configurar Taxas de Entrega

**Acesse:** Vendas > Entregas > Taxas > + Nova Taxa

Tipos de taxa:

| Tipo | Como funciona | Exemplo |
|------|---------------|---------|
| **Fixa** | Valor único para qualquer entrega | R$ 15,00 |
| **Por KM** | Valor × distância | R$ 2,00/km × 10 km = R$ 20,00 |
| **Por Peso** | Valor × peso total | R$ 1,00/kg × 5 kg = R$ 5,00 |
| **Faixa CEP** | Taxa válida para faixa de CEP | CEP 01000-000 a 01999-999 |

**Dica:** crie taxas diferentes para bairros próximos (mais baratas) e distantes (mais caras).

---

## 2. Criar uma Entrega

### A partir de um Pedido de Venda

1. Acesse **Vendas > Pedidos**
2. Localize o pedido confirmado
3. Clique em **Criar Entrega** (ícone de caminhão)
4. O sistema carrega automaticamente:
   - Cliente e endereço
   - Itens do pedido
   - Contato
5. Selecione **motorista** e **veículo**
6. Escolha a **taxa de entrega** (o sistema calcula automaticamente)
7. Defina a **data de agendamento**
8. Clique em **Salvar**

### Manualmente

1. Acesse **Vendas > Entregas > + Nova Entrega**
2. Selecione o **cliente** (busca por nome, CPF ou CNPJ)
3. Informe o **endereço de entrega** (pode ser diferente do cadastro)
4. Defina contato e telefone
5. Adicione **motorista**, **veículo** e **taxa**
6. Salve como **Pendente**

### O que o sistema faz automaticamente?

- Gera um **token de rastreio** único (UUID)
- Calcula a taxa de entrega baseada nas regras
- Se vinculado a um pedido, associa os itens

---

## 3. Fluxo Completo de Status

### Passo 1: Agendar

Na lista de entregas, selecione uma entrega **Pendente** e clique em **Agendar**.

**O que acontece:**
- Status muda para **AGENDADO**
- O cliente recebe um e-mail: *"Sua entrega foi agendada para [data]"*
- O link de rastreio é enviado

### Passo 2: Sair para Entrega

Quando o motorista iniciar a rota:

1. Selecione a entrega **Agendada**
2. Clique em **Saiu para Entrega**

**O que acontece:**
- Status muda para **SAIU_PARA_ENTREGA**
- Cliente recebe notificação: *"Seu pedido saiu para entrega!"*
- Cliente pode rastrear em tempo real

### Passo 3: Entregar

Ao chegar no cliente:

1. Selecione a entrega **Saiu para Entrega**
2. Clique em **Entregue**

**O que será solicitado:**
- **Comprovante**: foto do comprovante (opcional)
- **Observações**: se houve algo relevante

**O que acontece:**
- Status muda para **ENTREGUE**
- Cliente recebe e-mail: *"Entrega concluída! Avalie:"*
- Link de avaliação é enviado

---

## 4. Lidar com Tentativas Falhas

Se o motorista não conseguir entregar:

1. Selecione a entrega com status **Saiu para Entrega**
2. Clique em **Tentativa Falhou**
3. Informe o **motivo** (campo obrigatório):
   - Cliente ausente
   - Endereço incorreto
   - Cliente recusou
   - Área de risco
   - Outro
4. O sistema registra a tentativa

**O que acontece:**
- Status muda para **TENTATIVA_FALHOU**
- Cliente recebe notificação
- Uma nova tentativa pode ser feita

### Nova Tentativa

1. Na entrega com **Tentativa Falhou**
2. Corrija o endereço se necessário
3. Reagende se preciso
4. Clique em **Sair para Entrega** novamente
5. O status volta para **SAIU_PARA_ENTREGA**

**Regra:** são permitidas até 3 tentativas. Após a 3ª, a entrega deve ser cancelada e um novo agendamento deve ser criado.

### Cancelar Entrega

Se a entrega não puder ser realizada:

1. Selecione a entrega
2. Clique em **Cancelar**
3. Informe o motivo

**Regra:** só pode cancelar se a entrega não estiver com status **ENTREGUE**.

---

## 5. Rastreio Público

### Como o cliente acompanha?

O cliente recebe um link exclusivo por e-mail:

```
https://app.erporaqui.com.br/rastreio/uuid-da-entrega
```

### O que o cliente vê?

- Número da entrega
- Status atual
- Endereço de entrega
- Data de agendamento
- Nome do motorista
- Tentativas realizadas
- **Não vê**: valores, itens do pedido, dados internos

### Funcionalidades da Página de Rastreio

- **Atualização automática**: a página atualiza a cada 30 segundos
- **Timeline visual**: mostra todo o histórico (agendado → saiu → tentativas → entregue)
- **Botão Avaliar**: aparece após a entrega ser concluída

---

## 6. Avaliação Pós-Entrega

### Como funciona?

Após a entrega ser concluída, o cliente recebe um e-mail com link para avaliar:

```
https://app.erporaqui.com.br/avaliar/uuid-da-entrega
```

### O que o cliente avalia?

- **Nota**: 1 a 5 estrelas (obrigatório)
- **Comentário**: texto opcional

### Onde ver as avaliações?

1. Acesse **Vendas > Entregas**
2. Abra os detalhes da entrega
3. Veja a avaliação na aba **Avaliação**

### Relatório de Avaliações

Na tela de Entregas, use o filtro para ver:
- Média de notas por motorista
- Média de notas por período
- Comentários recentes

**Dica:** use as avaliações para identificar motoristas que precisam de treinamento.

---

## 7. Dicas e Armadilhas Comuns

### Dicas

- **Agende com antecedência**: defina a data de agendamento logo após o pedido ser confirmado
- **Cadastre todos os motoristas**: cada motorista precisa de cadastro próprio para aparecer no seletor
- **Use taxas por KM**: é a mais justa para o cliente e para a empresa
- **Configure o raio máximo**: evite criar entregas fora da área de cobertura
- **Acompanhe tentativas falhas**: muitas tentativas no mesmo endereço indicam problema no cadastro
- **Verifique avaliações**: respostas negativas frequentes de um mesmo motorista merecem atenção
- **Integre com o pedido**: criar entrega a partir do pedido evita erros de digitação

### Armadilhas Comuns

| Problema | Causa | Solução |
|----------|-------|---------|
| Entrega não aparece na lista | Filtro ativo sem perceber | Limpe os filtros |
| Motorista não aparece no seletor | Motorista está inativo | Ative o cadastro do motorista |
| Veículo não aparece | CNH do motorista vencida | Renove o cadastro do motorista |
| Taxa calculada errada | Raio ou faixa CEP mal configurados | Revise a configuração da taxa |
| Cliente não recebeu e-mail | E-mail inválido no cadastro | Verifique o e-mail do cliente |
| Cliente não consegue avaliar | Token expirado (7 dias) | Reenvie o link manualmente |
| Entrega presa em "Saiu para Entrega" | Motorista esqueceu de finalizar | Um administrador pode finalizar manualmente |

### Atalhos

- **Ctrl + K**: abra a paleta de comandos e digite "Entregas"
- **Filtros rápidos**: use a barra de busca para filtrar por número da entrega
- **Exportar**: clique em Exportar para baixar a lista de entregas em CSV ou XLSX
