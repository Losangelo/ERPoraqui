import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { BookOpen, ChevronRight, Search, Copy, Check } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface TabelaDados {
  titulo: string;
  colunas: string[];
  linhas: (string | number)[][];
}

interface AjudaItem {
  id: string;
  titulo: string;
  categoria: string;
  conteudo: string;
  exemplos?: { titulo: string; codigo: string }[];
  tabelas?: TabelaDados[];
}

const itensAjuda: AjudaItem[] = [
  {
    id: 'reforma-tributaria',
    titulo: 'Reforma Tributária 2026',
    categoria: 'Geral',
    conteudo: `A **Reforma Tributária** aprovada em 2024 (Emenda Constitucional 132/2023 e Lei Complementar 214/2025) começou a vigorar em **1º de janeiro de 2026**. 

Este período (2026) é conhecido como **"ano de teste"** - um momento para adaptação dos sistemas e empresas ao novo modelo tributário, sem aumento real de carga tributária.

---

## O Novo Sistema: IVA Dual

A reforma cria dois novos impostos que substituirão os atuais:

---

## Alíquotas Vigentes em 2026

Durante o ano de 2026, as alíquotas são de **teste** e o valor total de **1,0%** é compensado com os impostos atuais, ou seja, **não há aumento** de carga tributária.

- **CBS (Federal):** 0,9%
- **IBS (Estadual/Municipal):** 0,1%
- **Total Reforma:** 1,0%

---

## Obrigações nas Notas Fiscais

A partir de 2026, toda NF-e e NFC-e deve conter:

- Destaque do valor de CBS
- Destaque do valor de IBS
- Código CST para CBS e IBS
- Base de cálculo para cada imposto
- Valor do Imposto Seletivo (IS) - quando aplicável

---

## O que o ERPoraqui Já Faz

O sistema está preparado para calcular e registrar automaticamente:

- CBS 0,9% sobre o valor total das notas
- IBS 0,1% sobre o valor total das notas
- Total da Reforma Tributária (CBS + IBS)
- Campos por item: base de cálculo, alíquota e valor CBS/IBS
- Campo para Imposto Seletivo (IS) em produtos sujeitos

---

## Imposto Seletivo (IS)

Alguns produtos possuem **alíquota adicional** além da CBS/IBS:

- Cigarros e derivados do tabaco
- Bebidas alcoólicas
- Automóveis de luxo
- Outros produtos não essenciais

**Nota:** O sistema permite informar a alíquota IS por item na nota fiscal.

---

## Perguntas Frequentes

** Haverá aumento de carga tributária em 2026? **

Não. O valor de 1% é abatido do que a empresa já pagaria de PIS/Cofins. Não existe aumento real de impostos neste ano.

** Preciso fazer algo diferente na emissão de notas? **

Não. O sistema faz tudo automaticamente. Basta verificar os valores de CBS e IBS ao Emitir ou visualizar uma nota fiscal.

** E em 2027, o que muda? **

A CBS entrará com alíquota cheia (maior que os atuais 0,9%). O PIS e o COFINS serão extintos. O sistema ERPoraqui será atualizado automaticamente.

---

> **Atenção:** Mantenha seus dados fiscais sempre atualizados. Em caso de dúvidas, consulte seu contador.`,
    tabelas: [
      {
        titulo: 'Impostos Substituídos',
        colunas: ['Impostos Atuais', 'Novo Imposto', 'Responsável'],
        linhas: [
          ['PIS + COFINS + IPI', 'CBS - Contribuição sobre Bens e Serviços', 'União (Federal)'],
          ['ICMS + ISS', 'IBS - Imposto sobre Bens e Serviços', 'Estados e Municípios'],
        ],
      },
      {
        titulo: 'Cronograma de Transição',
        colunas: ['Ano', 'O que Muda'],
        linhas: [
          ['2026', 'Fase de teste: 1% (compensado com impostos atuais)'],
          ['2027', 'CBS com alíquota cheia, fim do PIS e Cofins'],
          ['2028', 'Ajustes no IBS'],
          ['2029 a 2032', 'ICMS e ISS caem 10% ao ano, IBS sobe progressivamente'],
          ['2033', 'Sistema antigo extinto, CBS + IBS operam 100%'],
        ],
      },
      {
        titulo: 'Quem Deve se Adaptar',
        colunas: ['Tipo de Empresa', 'Prazo'],
        linhas: [
          ['Lucro Real e Lucro Presumido', 'Obrigatório desde 2026'],
          ['Simples Nacional e MEI', 'A partir de 2027'],
        ],
      },
    ],
  },
  {
    id: 'sistema-licenciamento',
    titulo: 'Sistema de Licenciamento',
    categoria: 'Geral',
    conteudo: `# Sistema de Licenciamento

O ERPoraqui possui um sistema de licenciamento que controla o acesso aos módulos e funcionalidades baseado no plano contratado.

---

## Planos Disponíveis

| Plano | Limite Usuários | Limite Clientes | Limite Produtos | Limite Empresas |
|-------|-----------------|-----------------|----------------|-----------------|
| BASIC | 3 | 500 | 1.000 | 1 |
| PROFISSIONAL | 10 | 3.000 | 5.000 | 3 |
| PREMIUM | 50 | 10.000 | 20.000 | 10 |

---

## Módulos por Plano

| Módulo | BASIC | PROFISSIONAL | PREMIUM |
|--------|-------|--------------|---------|
| Cadastros Básicos | ✅ | ✅ | ✅ |
| Vendas e Pedidos | ✅ | ✅ | ✅ |
| Estoque | ✅ | ✅ | ✅ |
| Financeiro | ✅ | ✅ | ✅ |
| NF-e / NFC-e | ✅ | ✅ | ✅ |
| Boletos | ✅ | ✅ | ✅ |
| DRE | ✅ | ✅ | ✅ |
| Plano de Contas | ✅ | ✅ | ✅ |
| ECF | ✅ | ✅ | ✅ |
| NFSe | ✅ | ✅ | ✅ |
| **CRM** | ❌ | ✅ | ✅ |
| **CRM Campanhas** | ❌ | ❌ | ✅ |
| **Multi-empresa** | ❌ | ✅ | ✅ |
| **Automação** | ❌ | ❌ | ✅ |
| **API Pública** | ❌ | ❌ | ✅ |

---

## Como Ativar uma Licença

1. Acesse **Planos e Licença** no menu do sistema
2. Escolha o plano desejado (Mensal, Anual ou Definitivo)
3. Confirme a ativação

A licença será vinculada à sua empresa e permitirá acesso aos módulos contratados.

---

## Verificando Sua Licença

Na página **Planos e Licença**, você pode verificar:
- Plano atual
- Data de expiração
- Limites utilizados
- Módulos disponíveis
`,
  },
  {
    id: 'crm',
    titulo: 'CRM - Gestão de Vendas',
    categoria: 'Vendas',
    conteudo: `# CRM - Customer Relationship Management

O módulo de CRM do ERPoraqui permite gerenciar o relacionamento com clientes e automatizar o ciclo de vendas.

---

## Funcionalidades

### Pipeline de Vendas

Visualize todas as suas oportunidades de venda em um quadro Kanban:
- **Prospecção** - Novos contatos e leads
- **Qualificação** - Identificando necessidades
- **Proposta** - Enviando propostas
- **Negociação** - Em negociação
- **Fechamento** - Fechamento

### Oportunidades

Crie oportunidades de venda com:
- Título e descrição
- Valor estimado
- Probabilidade de fechamento
- Data esperada de fechamento
- Cliente vinculado
- Itens/produtos envolvidos

### Tarefas

Gerencie atividades relacionadas às oportunidades:
- Ligações
- E-mails
- Reuniões
- Visitas
- Demonstrações
- Propostas

### Visão 360º do Cliente

Acesse o histórico completo do cliente:
- Oportunidades abertas
- Interações recentes
- Tarefas pendentes
- Faturas pendentes
- Notas fiscais emitidas
- Total comprado

### Quote-to-Cash

Automatize a conversão de oportunidades em pedidos:
1. Marque a oportunidade como "GANHA"
2. O sistema cria automaticamente o pedido de venda
3. Os itens são transferidos para o pedido

---

## Acesso ao CRM

O módulo CRM está disponível nos planos **PROFISSIONAL** e **PREMIUM**.

Acesse pelo menu: **Vendas > CRM**
`,
  },
  {
    id: 'multi-empresa',
    titulo: 'Multi-empresa',
    categoria: 'Gestão',
    conteudo: `# Módulo Multi-empresa

Gerencie múltiplas empresas (grupo econômico) em uma única licença.

---

## O que é Grupo Econômico

O grupo econômico permite vincular empresas relacionadas (matriz e filiais) para:
- Compartilhar a mesma licença
- Gerenciar todas as empresas em um único sistema
- Consolidar dados quando necessário

---

## Limites por Plano

| Plano | Empresas no Grupo |
|-------|------------------|
| BASIC | 1 (somente a empresa) |
| PROFISSIONAL | 3 |
| PREMIUM | 10 |

---

## Como Vincular uma Empresa

1. Acesse **Multi-empresa** no menu do sistema
2. Clique em **Vincular Empresa**
3. Selecione a empresa desejada
4. Confirme a vinculação

A empresa vinculada terá acesso aos mesmos módulos da empresa matriz conforme o plano contratado.

---

## Permissões

- A **empresa matriz** pode gerenciar todas as empresas do grupo
- As **filiais** podem apenas visualizar as empresas vinculadas

---

## Acesso ao Módulo

O módulo Multi-empresa está disponível nos planos **PROFISSIONAL** e **PREMIUM**.

Acesse pelo menu: **Sistema > Multi-empresa**
`,
  },
  {
    id: 'api-publica',
    titulo: 'API Pública',
    categoria: 'Desenvolvedor',
    conteudo: `# API Pública

A API Pública permite integração do ERPoraqui com sistemas externos através de endpoints REST.

---

## Requisitos

Para usar a API Pública, você precisa de:
- Plano **PREMIUM** ativo
- Chave de API gerada no sistema

---

## Como Gerar uma Chave de API

1. Acesse **Planos e Licença** no menu do sistema
2. Verifique se seu plano inclui acesso à API
3. Use o endpoint para gerar uma chave de API

\`\`\`
POST /api/v1/public/gerar-chave
Authorization: Bearer <token_jwt>
\`\`\`

---

## Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/v1/public/clientes | Listar clientes |
| GET | /api/v1/public/clientes/:id | Buscar cliente por ID |
| GET | /api/v1/public/produtos | Listar produtos |
| GET | /api/v1/public/produtos/:id | Buscar produto por ID |

---

## Autenticação

Para usar a API, inclua a chave de API no cabeçalho:

\`\`\`
Authorization: Bearer <sua_chave_api>
\`\`\`

---

## Limites de Uso

- Plano PREMIUM: até 10.000 requisições/dia
- Taxa limite: 100 requisições/minuto

---

## Exemplo de Uso

\`\`\`javascript
const response = await fetch('https://api.erporaqui.com.br/api/v1/public/clientes', {
  headers: {
    'Authorization': 'Bearer SUA_CHAVE_API'
  }
});

const clientes = await response.json();
\`\`\`
`,
  },
  {
    id: 'automacao',
    titulo: 'Módulo Automação',
    categoria: 'Gestao',
    conteudo: `# Módulo Automação

O módulo de Automação permite criar fluxos de trabalho automatizados baseados em eventos do sistema.

---

## Requisitos

Para usar o Módulo de Automação, você precisa de:
- Plano **PREMIUM** ativo

---

## Tipos de Triggers

| Trigger | Descrição |
|---------|-----------|
| ESTOQUE_BAIXO | Ativado quando o estoque de um produto cai abaixo do limite |
| CONTA_VENCENDO | Ativado quando uma conta a receber está próxima do vencimento |
| CLIENTE_CADASTRADO | Ativado quando um novo cliente é cadastrado |

---

## Tipos de Ações

| Ação | Descrição |
|------|-----------|
| CRIAR_TAREFA | Cria uma tarefa no sistema |
| ENVIAR_EMAIL | Envia um e-mail de notificação |
| ATUALIZAR_STATUS | Atualiza o status de um registro |

---

## Como Criar uma Automação

1. Acesse **Gestão > CRM** (em breve página própria)
2. Clique em **Nova Automação**
3. Defina o **nome** e **descrição**
4. Selecione o **trigger** (evento que inicia a automação)
5. Configure as **ações** que serão executadas
6. Ative a automação

---

## Dashboard de Automação

O dashboard mostra:
- Total de automações cadastradas
- Quantas estão ativas
- Quantas estão pausadas
- Total de execuções realizadas
- Últimos logs de execução

---

## Monitoramento

Cada automação possui um log de execuções que registra:
- Data e hora da execução
- Se foi executada com sucesso
- Detalhes do que foi feito
- Erros occorridos (se houver)

---

## Dicas

- Comece com automações simples
- Monitore os logs regularmente
- Use filtros para segmentar as ações
- Pause automações durante manutenção
`,
  },
  {
    id: 'introducao',
    titulo: 'Introdução ao Sistema',
    categoria: 'Geral',
    conteudo: `O **ERPoraqui** é um sistema de gestão empresarial completo, desenvolvido para atender às necessidades de empresas brasileiras.

---

## Funcionalidades Principais

O sistema oferece as seguintes funcionalidades:

- Cadastros de clientes, fornecedores e produtos
- Controle de estoque e movimentações
- Gestão de pedidos de venda e compra
- Emissão de notas fiscais (NF-e, NFC-e, NFSe)
- Controle financeiro e fluxo de caixa
- Relatórios gerenciais e fiscais`,
  },
  {
    id: 'cadastro-empresa',
    titulo: 'Cadastro da Empresa',
    categoria: 'Primeiros Passos',
    conteudo: `O primeiro passo é cadastrar sua empresa. Isso é feito automaticamente no primeiro registro de usuário.

---

## Dados Necessários

Para realizar o cadastro, você precisa informar:

- Razão Social (nome oficial da empresa)
- CNPJ (Cadastro Nacional de Pessoa Jurídica)
- Inscrição Estadual
- Regime Tributário (Simples Nacional, Lucro Presumido, Lucro Real)
- Endereço completo

---

## Exemplo

CNPJ válido: **12.345.678/0001-90**`,
    exemplos: [
      {
        titulo: 'Exemplo de CNPJ válido',
        codigo: '12.345.678/0001-90',
      },
    ],
  },
  {
    id: 'cadastro-clientes',
    titulo: 'Cadastro de Clientes',
    categoria: 'Cadastros',
    conteudo: `Para cadastrar um novo cliente, você precisa informar os seguintes dados:

---

## Dados do Cliente

- Nome/Razão Social
- Tipo de Pessoa (Física ou Jurídica)
- CPF ou CNPJ
- Inscrição Estadual (se pessoa jurídica)
- Endereço completo
- Telefone e e-mail
- Limite de crédito

---

## Dica Importante

O CPF/CNPJ deve ser válido para evitar problemas na emissão de notas fiscais.`,
  },
  {
    id: 'cadastro-produtos',
    titulo: 'Cadastro de Produtos',
    categoria: 'Cadastros',
    conteudo: `Um produto no sistema pode ter diversos atributos:

---

## Dados do Produto

- Código interno e código de barras
- Descrição completa
- Categoria e unidade de medida
- Preço de custo e venda
- Estoque mínimo e máximo
- NCM (Nomenclatura Comum do Mercosul)
- CST/CSOSN para impostos

---

## Dica

Preencha o NCM corretamente para garantir o cálculo certo dos impostos na nota fiscal.`,
  },
  {
    id: 'pedidos-venda',
    titulo: 'Pedidos de Venda',
    categoria: 'Vendas',
    conteudo: `Gera pedidos de venda com fluxo de aprovação (EM_ABERTO → CONFIRMADO → EM_PRODUCAO → ENVIADO → ENTREGUE).

---

## Como Criar um Pedido

1. Acesse **Vendas** > **Pedidos** > **+ Novo Pedido**
2. **Cliente**: digite nome, CPF ou CNPJ e selecione (LookupField)
3. **Vendedor** (opcional): busque pelo nome
4. **Transportadora** (opcional): busque pelo nome ou CNPJ
5. **Itens**: clique "Adicionar Item", busque produto (cards com nome/preço/estoque/barras/NCM), informe qtd/valor/desconto
6. **Condicao Pagamento**: A Vista, A Prazo (parcelas + intervalo) ou Parcelado
7. **Valores**: frete, desconto, acrescimos — calculo automatico
8. **Observacoes**: texto visivel ao cliente + observacoes internas
9. **Salvar**

---

## O que o Sistema Faz Automaticamente

- Calcula totais e impostos
- Abate do estoque
- Gera financeiro (contas a receber) ao aprovar`,
    exemplos: [
      {
        titulo: 'Criando pedido via API',
        codigo: `POST /api/v1/pedidos-venda
{
  "clienteId": "id-do-cliente",
  "itens": [
    {
      "produtoId": "id-do-produto",
      "quantidade": 10,
      "precoUnitario": 25.00
    }
  ]
}`,
      },
    ],
  },
  {
    id: 'notas-fiscais',
    titulo: 'Emissão de Notas Fiscais (NF-e)',
    categoria: 'Fiscal',
    conteudo: `Para emitir uma nota fiscal, siga os passos abaixo:

---

## Passo a Passo

1. Configure os dados fiscais da empresa
2. Cadastre certificados digitais (quando aplicável)
3. Crie uma venda ou nota de entrada
4. Gere a NF-e
5. Assine digitalmente
6. Envie para SEFAZ
7. Imprima ou envie por e-mail

---

## Situações da Nota

- Em Digitação
- Assinada
- Enviada
- Cancelada
- Denegada

---

## Reforma Tributária 2026

A partir de janeiro de 2026, a NF-e deve incluir os novos campos obrigatórios:

- CBS (Contribuição sobre Bens e Serviços): 0,9%
- IBS (Imposto sobre Bens e Serviços): 0,1%
- Total Reforma Tributária: 1,0%

O ERPoraqui já calcula e inclui esses valores automaticamente em todas as notas fiscais. Verifique os campos "Valor CBS", "Valor IBS" e "Total Reforma Tributária" ao Emitir ou visualizar uma nota.

Para produtos sujeitos ao Imposto Seletivo (cigarros, bebidas alcoólicas, etc.), informe a aliquota IS (Imposto Seletivo) na tela de itens da nota.`,
  },
  {
    id: 'nfce',
    titulo: 'Nota Fiscal do Consumidor Eletrônica (NFC-e)',
    categoria: 'Fiscal',
    conteudo: `A NFC-e é a Nota Fiscal do Consumidor Eletrônica, obrigatória para vendas ao consumidor final.

---

## Diferenças da NF-e

- Modelo 65 (NFC-e) vs Modelo 55 (NF-e)
- Não requer certificado digital em alguns estados
- Usa QR Code para consulta
- Obrigatória para vendas presenciais

---

## Fluxo de Emissão

1. Configure a NFC-e nos parâmetros
2. Adicione produtos ao carrinho
3. Finalize a venda
4. Assine e envie
5. Exiba o QR Code ao cliente

---

## Reforma Tributária 2026

A NFC-e também deve conter os valores de CBS e IBS. O ERPoraqui calcula automaticamente:

- CBS: 0,9% sobre o valor total
- IBS: 0,1% sobre o valor total
- Esses valores são somados ao total da nota.`,
  },
  {
    id: 'nfse',
    titulo: 'Nota Fiscal de Serviços Eletrônica (NFSe)',
    categoria: 'Fiscal',
    conteudo: `A NFSe é a Nota Fiscal de Serviços Eletrônica, obrigatória para prestação de serviços.

---

## Características

- Modelo 99 (Nota Fiscal de Serviços)
- Integração com prefeituras municipais
- Código de verificação para autenticidade
- ISS calculado sobre o valor do serviço

---

## Fluxo de Emissão

1. Selecione a filial/empresa
2. Defina o tipo de RPS (RPS, RPS Conjugado ou Cupom)
3. Preencha os dados do tomador (cliente)
4. Adicione os serviços prestados
5. Configure alíquotas de ISS
6. Assine e envie para autorização
7. Gere o PDF ou envie por e-mail

---

## Regimes Tributários

- Simples Nacional
- Lucro Presumido
- Lucro Real
- Isento

---

## Tipos de RPS

- RPS - Recibo Provisório de Serviços
- RPS Conjugado - RPS com NF-e de mercadoria
- Cupom - Para estabelecimentos homologados

---

## Reforma Tributária 2026

A NFSe também está sujeita à reforma. O ISS será progressivamente substituído pelo IBS.

- IBS: 0,1% (em teste)
- CBS: 0,9% (para serviços)
- O sistema já inclui esses valores automaticamente.`,
  },
  {
    id: 'ecf',
    titulo: 'Emissor Cupom Fiscal (ECF)',
    categoria: 'Fiscal',
    conteudo: `O ECF é o Emissor Cupom Fiscal, equipamento utilizado para emitir cupons fiscais em operações presenciais.

---

## Funcionalidades

- Cadastro de equipamentos ECF
- Abertura de cupons
- Adição de itens
- Finalização com várias formas de pagamento
- Cancelamento de cupons
- Suprimento (adição de dinheiro)
- Sangria (retirada de dinheiro)
- Redução Z (fechamento diário)

---

## Fluxo de Uso

1. Cadastre o ECF no sistema
2. Selecione o equipamento
3. Abra cupom
4. Adicione produtos
5. Finalize com forma de pagamento
6. Ao final do dia, faça a Redução Z`,
  },
  {
    id: 'dre',
    titulo: 'Demonstração do Resultado do Exercício',
    categoria: 'Gestão',
    conteudo: `O DRE é um relatório contábil que apresenta a composição do resultado da empresa.

---

## Como Acessar

1. Vá ao menu Gestão > DRE
2. Selecione o período desejado
3. Analise os indicadores

---

## Indicadores Principais

- Receita Bruta: Total de vendas
- Receita Líquida: Vendas menos devoluções
- Lucro Bruto: Receita menos custo
- Lucro Operacional: Após despesas operacionais
- Lucro Líquido: Resultado final`,
  },
  {
    id: 'plano-contas',
    titulo: 'Plano de Contas',
    categoria: 'Gestão',
    conteudo: `O Plano de Contas é a estrutura de codificação de todas as contas contábeis da empresa.

---

## Funcionalidades

- Criar contas sintéticas (grupos)
- Criar contas analíticas (detalhes)
- Definir natureza credora ou devedora
- Estrutura hierárquica em árvore

---

## Como Usar

1. Menu Gestão > Plano de Contas
2. Clique em Nova Conta
3. Preencha código, nome, tipo e natureza
4. Estruture hierarquicamente`,
  },
  {
    id: 'estoque-avancado',
    titulo: 'Estoque Avançado - Variações e Lotes',
    categoria: 'Estoque',
    conteudo: `O módulo de Estoque Avançado permite gerenciar variações de produtos (grades) e controle de lotes.

---

## Variações de Produto (Grades)

Crie variações como cor, tamanho, sabor para um mesmo produto:

### Campos
- **SKU** - Código único por produto
- **Nome** - Ex: "Vermelho - GG", "Sabão Líquido 500ml"
- **Preço Adicional** - Acréscimo sobre o preço base
- **Estoque** - Quantidade específica da variação
- **Código de Barras** - Próprio para a variação

### Como Usar
1. Acesse **Estoque > Variações**
2. Selecione o produto e crie as variações
3. O estoque final do produto = estoque base + estoque das variações

---

## Lotes de Produto

Controle lotes com data de fabricação e validade:

### Campos
- **Código do Lote** - Identificação única
- **Fabricação / Validade** - Datas de controle
- **Quantidade** - Saldo atual do lote
- **Custo Unitário** - Custo de aquisição

### Como Usar
1. Acesse **Estoque > Lotes**
2. Cadastre lotes ao receber mercadorias
3. Ajuste estoque manualmente se necessário
4. Sistema utiliza FIFO (primeiro a vencer, primeiro a sair)`,
  },
  {
    id: 'tabelas-preco',
    titulo: 'Tabelas de Preço',
    categoria: 'Vendas',
    conteudo: `O módulo de Tabelas de Preço permite criar múltiplas tabelas com preços diferenciados.

---

## Tipos de Tabela

- **À Vista** - Preços para pagamento à vista
- **À Prazo** - Preços para pagamento parcelado
- **Promoção** - Preços promocionais
- **Especial** - Preços especiais para clientes selecionados

---

## Markup Automático

Configure um markup percentual sobre o preço de custo e o sistema calcula automaticamente os preços de venda para todos os itens da tabela.

---

## Itens da Tabela

Cada tabela pode conter itens com:
- Preço de venda
- Preço mínimo
- Desconto máximo permitido

---

## Como Usar
1. Acesse **Estoque > Tabelas de Preço**
2. Crie uma nova tabela com nome, tipo e markup
3. Adicione produtos com seus preços
4. Use "Calcular Preços" para aplicar markup automático`,
  },
  {
    id: 'cheques',
    titulo: 'Cheques',
    categoria: 'Financeiro',
    conteudo: `O módulo de Cheques gerencia cheques recebidos de clientes e emitidos para fornecedores.

---

## Tipos de Cheque

- **Recebido** - Cheque de cliente (entrada)
- **Emitido** - Cheque próprio (saída)

---

## Situações

- **Em Carteira** - Aguardando depósito
- **Depositado** - Enviado ao banco
- **Compensado** - Valor já disponível
- **Devolvido** - Devolvido pelo banco (com motivo)
- **Cancelado** - Cancelado manualmente

---

## Ações por Situação

| Situação | Ações Disponíveis |
|----------|-------------------|
| Em Carteira | Depositar, Cancelar |
| Depositado | Compensar, Devolver |
| Devolvido | Visualizar motivo |

---

## Dashboard

O topo da página mostra:
- Total em carteira
- Total depositado
- Total devolvido

---

## Como Usar
1. Acesse **Financeiro > Cheques**
2. Registre cheques recebidos ou emitidos
3. Acompanhe a situação e tome as ações necessárias`,
  },
  {
    id: 'centros-custo',
    titulo: 'Centros de Custo',
    categoria: 'Gestão',
    conteudo: `O módulo de Centros de Custo permite estruturar departamentos, projetos ou unidades de negócio para alocação de receitas e despesas.

---

## Hierarquia

Os centros de custo podem ser organizados em árvore:

Empresa
  Administrativo
    RH, Financeiro
  Comercial
    Vendas Internas, Vendas Externas
  Producao
    Fabrica 1, Fabrica 2

---

## Vinculação

Os centros de custo podem ser vinculados a:
- Contas a Pagar
- Contas a Receber
- Lançamentos de Fluxo de Caixa

---

## Como Usar
1. Acesse **Financeiro > Centros de Custo**
2. Crie centros com código e nome
3. Selecione um centro pai para criar sub-centros
4. Ao lançar contas, vincule ao centro de custo correspondente`,
  },
  {
    id: 'estoque',
    titulo: 'Controle de Estoque',
    categoria: 'Estoque',
    conteudo: `O sistema controla estoque em tempo real:

---

## Tipos de Movimentação

- Entrada: Compra de mercadorias
- Saída: Vendas e devoluções
- Transferência: Entre filiais
- Ajuste: Inventário

---

## Observação

Movimentações são registradas automaticamente em cada operação.

---

## Dica

Faça inventários periódicos para conciliar o estoque físico com o sistema.`,
  },
  {
    id: 'financeiro',
    titulo: 'Gestão Financeira',
    categoria: 'Financeiro',
    conteudo: `O módulo financeiro controla as finanças da empresa:

---

## O que Inclui

- Contas a Receber (vendas a prazo)
- Contas a Pagar (fornecedores, despesas)
- Fluxo de caixa (entradas e saídas)
- Boletos e recebimentos
- Conciliação bancária

---

## Dica

Mantenha o fluxo de caixa sempre atualizado para ter uma visão real da saúde financeira da empresa.`,
  },
  {
    id: 'contas-receber',
    titulo: 'Contas a Receber',
    categoria: 'Financeiro',
    conteudo: `O módulo de Contas a Receber controla as vendas realizadas a prazo.

---

## Funcionalidades

- Listagem de todas as contas com filtros por status
- Criação manual de contas a receber
- Baixa de contas (recebimento)
- Acompanhamento de valores a receber, recebidos e vencidos
- Geração automática: Ao confirmar um pedido de venda com condição de pagamento "A Prazo" ou "Parcelado", as contas são geradas automaticamente

---

## Como Usar

1. Acesse o menu Financeiro > Contas a Receber
2. Clique em "Nova Conta" para criar manualmente
3. Para dar baixa, clique no ícone de check ao lado da conta
4. Filtre por status para acompanhar: Abertas, Pagas, Vencidas`,
  },
  {
    id: 'contas-pagar',
    titulo: 'Contas a Pagar',
    categoria: 'Financeiro',
    conteudo: `O módulo de Contas a Pagar controla as compras e despesas a pagar.

---

## Funcionalidades

- Listagem de todas as contas com filtros por status
- Criação manual de contas a pagar
- Baixa de contas (pagamento)
- Acompanhamento de valores a pagar, pagos e vencidos
- Geração automática: Ao confirmar um pedido de compra com condição de pagamento "A Prazo" ou "Parcelado", as contas são geradas automaticamente

---

## Como Usar

1. Acesse o menu Financeiro > Contas a Pagar
2. Clique em "Nova Conta" para criar manualmente
3. Para dar baixa, clique no ícone de check ao lado da conta
4. Filtre por status para acompanhar: Abertas, Pagas, Vencidas`,
  },
  {
    id: 'renegociacao',
    titulo: 'Renegociação de Contas',
    categoria: 'Financeiro',
    conteudo: `O módulo de Renegociação permite renegociar contas a receber e a pagar que estão em aberto ou vencidas.

---

## Funcionalidades

- Renegociação de contas a receber (clientes) e a pagar (fornecedores)
- Aplicação de descontos, juros e multas nas renegociações
- Parcelamento do valor final em múltiplas parcelas
- Preview das parcelas antes de confirmar
- Acompanhamento do status: Pendente, Confirmada, Cancelada
- Ao confirmar, as contas originais são marcadas como Renegociadas e novas contas são geradas

---

## Como Usar

1. Acesse o menu Financeiro > Renegociação
2. Clique em "Nova Renegociação"
3. Selecione o tipo (Receber ou Pagar) e o cliente/fornecedor
4. Selecione as contas que deseja renegociar
5. Defina descontos, juros e multa
6. Informe o número de parcelas e o primeiro vencimento
7. Revise o preview das parcelas
8. Clique em "Criar Renegociação" para salvar como Pendente
9. Na listagem, confirme a renegociação para gerar as novas contas`,
  },
  {
    id: 'api-rest',
    titulo: 'Usando a API REST',
    categoria: 'Desenvolvedor',
    conteudo: `O sistema expõe uma API RESTful para integração:

Autenticação:
- Use o endpoint /auth/login para obter token
- Envie o token no header: Authorization: Bearer <token>

Endpoints principais:
- GET /api/v1/clientes - Listar clientes
- POST /api/v1/clientes - Criar cliente
- GET /api/v1/produtos - Listar produtos
- POST /api/v1/pedidos-venda - Criar pedido`,
    exemplos: [
      {
        titulo: 'Exemplo de requisição autenticada',
        codigo: `curl -X GET http://localhost:3000/api/v1/clientes \\
  -H "Authorization: Bearer SEU_TOKEN_AQUI"`,
      },
      {
        titulo: 'Criando cliente via API',
        codigo: `curl -X POST http://localhost:3000/api/v1/clientes \\
  -H "Authorization: Bearer TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "nome": "Empresa Teste",
    "tipoPessoa": "JURIDICA",
    "documento": "12.345.678/0001-90",
    "email": "teste@empresa.com"
  }'`,
      },
    ],
  },
  {
    id: 'tips',
    titulo: 'Dicas e Truques',
    categoria: 'Dicas',
    conteudo: `Atalhos úteis:
- Use Ctrl+F para buscar em listas
- Aperte Enter para confirmar cadastros
- Use Tab para navegar entre campos

Boas práticas:
- Faça backup regularmente
- Mantenha os dados fiscais atualizados
- Revise relatórios antes de transmiti-los
- Treine sua equipe no sistema

Suporte:
- Em caso de dúvidas, consulte esta documentação
- Verifique os logs em Ambiente > Logs do Sistema`,
  },
  {
    id: 'orcamentos',
    titulo: 'Orçamentos',
    categoria: 'Vendas',
    conteudo: `O módulo de Orçamentos permite criar propostas comerciais para seus clientes.

Funcionalidades:
- Criar orçamentos com produtos e serviços
- Definir validade do orçamento
- Aprovar ou reprovar orçamentos
- Converter orçamento em pedido de venda
- Controlar status (Aberto, Aprovado, Reprovado, Expirado, Convertido)

O sistema expira automaticamente orçamentos vencidos.`,
    exemplos: [
      {
        titulo: 'Criando orçamento via API',
        codigo: `POST /api/v1/orcamentos
{
  "filialId": "id-filial",
  "clienteId": "id-cliente",
  "dataValidade": "2026-03-31",
  "itens": [
    {
      "produtoId": "id-produto",
      "quantidade": 10,
      "valorUnitario": 25.00
    }
  ]
}`,
      },
    ],
  },
  {
    id: 'boletos',
    titulo: 'Boletos Bancários',
    categoria: 'Financeiro',
    conteudo: `O módulo de Boletos permite gerar e gerenciar cobrança bancária.

---

## Funcionalidades

- Gerar boletos a partir de contas a receber
- Código de barras e linha digitável
- Baixa de boletos (manual ou automática)
- Cancelamento de boletos
- Segunda via
- Cadastro de bancos

---

## Observação

O sistema calcula juros e multas automaticamente.`,
    exemplos: [
      {
        titulo: 'Gerando boleto via API',
        codigo: `POST /api/v1/boletos
{
  "contaReceberId": "id-conta",
  "bancoId": "id-banco",
  "numeroBoleto": "00001",
  "dataVencimento": "2026-03-31",
  "valorOriginal": 250.00,
  "valorJuros": 0,
  "valorMulta": 0,
  "valorDesconto": 0
}`,
      },
    ],
  },
  {
    id: 'entregas-ajuda',
    titulo: 'Entregas',
    categoria: 'Vendas',
    conteudo: `# Entregas

O módulo de Entregas gerencia o ciclo completo de entrega de pedidos.

---

## Funcionalidades

- **Rastreamento**: cada entrega possui token único para acompanhamento público
- **Motoristas e Veículos**: cadastro completo da frota
- **Taxas de Entrega**: cálculo automático (fixa, por KM, por peso ou faixa CEP)
- **Notificações**: e-mails automáticos ao cliente (agendamento, saiu p/ entrega, concluída, falha)
- **Avaliação**: coleta de nota e comentário pós-entrega

---

## Fluxo de Status

Pendente → Agendado → Saiu para Entrega → Entregue
                                           ↘ Tentativa Falhou → Saiu para Entrega (re-tentativa)

---

## Como Usar

Acesse **Vendas > Entregas** para gerenciar entregas, motoristas, veículos e taxas.`,
  },
  {
    id: 'pdv',
    titulo: 'PDV - Ponto de Venda',
    categoria: 'Vendas',
    conteudo: `O módulo PDV é usado para vendas no balcão (frente de loja).

---

## Fluxo de Operação

1. Abra o caixa com operador e saldo inicial
2. Inicie uma nova venda
3. Adicione produtos (por código de barras ou busca)
4. Finalize com forma de pagamento
5. Imprima cupom fiscal

---

## Funcionalidades

- Múltiplas formas de pagamento
- Controle de caixas
- Operadores com autenticação PIN
- Cancelamento de vendas
- Busca rápida de produtos`,
    exemplos: [
      {
        titulo: 'Fluxo PDV via API',
        codigo: `// 1. Abrir caixa
POST /api/v1/pdv/caixa/abrir
{ "filialId": "id", "operadorId": "id", "saldoInicial": 500 }

// 2. Iniciar venda
POST /api/v1/pdv/venda/iniciar
{ "filialId": "id" }

// 3. Adicionar item
POST /api/v1/pdv/venda/:id/itens
{ "produtoId": "id", "quantidade": 2 }

// 4. Finalizar venda
POST /api/v1/pdv/venda/:id/finalizar
{ "formaPagamento": "DINHEIRO", "valorPago": 100 }`,
      },
    ],
  },
  {
    id: 'inventario',
    titulo: 'Inventário de Estoque',
    categoria: 'Estoque',
    conteudo: `O módulo de Inventário permite contagem física e conciliação de estoque.

Tipos de Inventário:
- Geral - Todo o estoque da filial
- Parcial - Produtos selecionados
- Rotativo - Contagem contínua

Fluxo:
1. Crie o inventário (sistema carrega produtos)
2. Registre a contagem de cada produto
3. visualize divergências
4. Concilie e ajuste o estoque

O sistema mostra divergências entre estoque físico e sistema.`,
    exemplos: [
      {
        titulo: 'Criando inventário via API',
        codigo: `POST /api/v1/inventario
{
  "filialId": "id-filial",
  "dataInventario": "2026-03-02",
  "tipo": "GERAL",
  "observacoes": "Inventário mensal"
}

// Registrar contagem
POST /api/v1/inventario/:id/contagem
{
  "produtoId": "id-produto",
  "quantidadeContada": 100,
  "observacoes": "Contagem 1"
}

// Conciliar
POST /api/v1/inventario/:id/conciliar
{
  "itemIds": ["id1", "id2"],
  "ajustarEstoque": true
}`,
      },
    ],
  },
  {
    id: 'parametros',
    titulo: 'Parâmetros do Sistema',
    categoria: 'Configuração',
    conteudo: `O módulo de Parâmetros permite configurar o comportamento do sistema.

Categorias de Parâmetros:
- Geral - Configurações globais
- Vendas - Regras de venda
- Estoque - Controle de estoque
- Fiscal - Configurações NF-e
- Financeiro - Regras financeiras

Parâmetros importantes:
- VENDAS_PERMITIR_DESCONTO
- ESTOQUE_BLOQUEAR_SEM
- NF_E_AMBIENTE (1=Produção, 2=Homologação)
- DECIMAIS_VALOR`,
    exemplos: [
      {
        titulo: 'Listando parâmetros por módulo',
        codigo: `GET /api/v1/parametros/modulo/VENDAS`,
      },
    ],
  },
  {
    id: 'command-palette',
    titulo: 'Command Palette (Ctrl+K)',
    categoria: 'Geral',
    conteudo: `A Command Palette permite buscar rapidamente qualquer funcionalidade do sistema.

Atalho: Ctrl+K (ou Cmd+K no Mac)

Funcionalidades:
- Busca por páginas: digite o nome da página para navegar
- Busca por clientes: localiza clientes pelo nome
- Busca por produtos: localiza produtos pelo nome ou código
- Busca por pedidos: localiza pedidos pelo número
- Navegação por setas: use ↑↓ para selecionar
- Enter para abrir a página selecionada
- ESC para fechar`,
    exemplos: [],
  },
  {
    id: 'sped-fiscal',
    titulo: 'SPED Fiscal',
    categoria: 'Fiscal',
    conteudo: `O SPED Fiscal gera arquivos TXT para entrega ao Fisco.

Blocos disponíveis:
- Bloco 0: Abertura, parceiros, produtos, unidades, contador
- Bloco C: Documentos fiscais NF-e (C100, C170, C190)
- Bloco D: Documentos fiscais NFSe (D100)
- Bloco E: Apuração ICMS/IPI (E100, E200, E300, E500)
- Bloco G: CIAP - Controle de crédito ICMS (G110, G140)
- Bloco H: Inventário (H010, H020)

Como usar:
1. Acesse o módulo SPED Fiscal no menu Fiscal
2. Selecione os blocos desejados
3. Defina o período de apuração
4. Clique em "Gerar Arquivo"
5. Faça o download do .txt e importe no PVA`,
    exemplos: [],
  },
  {
    id: 'mdfe',
    titulo: 'Manifesto Eletrônico (MDF-e)',
    categoria: 'Fiscal',
    conteudo: `O MDF-e (Modelo 58) é o documento fiscal para transporte de cargas.

Fluxo:
1. Cadastre veículos (placa, RNTRC, tipo)
2. Cadastre condutores (CPF, CNH, antifurto)
3. Crie o MDF-e informando origem/destino
4. Vincule os documentos fiscais NF-e/CT-e
5. Transmita para SEFAZ
6. Encerre ao finalizar a viagem

Status:
- EM_DIGITACAO: rascunho
- AUTORIZADO: transmitido com sucesso
- ENCERRADO: viagem finalizada
- CANCELADO: manifesto cancelado`,
    exemplos: [],
  },
  {
    id: 'contratos',
    titulo: 'Contratos',
    categoria: 'Vendas',
    conteudo: `Gestão de contratos de serviços e planos recorrentes.

Ciclo de vida:
- Rascunho → Ativo → Suspenso → Encerrado

Funcionalidades:
- Criar contratos com vigência definida ou indeterminada
- Tipos de reajuste: IGPM, IPCA, NF ou nenhum
- Medições mensais: crie medições para contratos ativos
- Faturamento: ao faturar a medição, um pedido pode ser gerado
- Cadastro de garantias vinculadas a produtos

Ações:
- Ativar: apenas contratos em rascunho
- Suspender: apenas contratos ativos
- Encerrar: contratos ativos ou suspensos`,
    exemplos: [],
  },
  {
    id: 'garantias',
    titulo: 'Garantias',
    categoria: 'Vendas',
    conteudo: `Controle de garantias de produtos vendidos.

Tipos de garantia:
- Fábrica: garantia original do fabricante
- Estendida: garantia adicional contratada
- Legal: garantia obrigatória por lei

Regras de elegibilidade:
- Configure regras por produto ou categoria
- Defina prazo padrão, cobertura e termos
- A elegibilidade verifica se o produto está dentro do prazo

Status: Ativa, Expirada, Cancelada, Acionada`,
    exemplos: [],
  },
  {
    id: 'devolucoes',
    titulo: 'Devoluções / RMA',
    categoria: 'Vendas',
    conteudo: `Gestão de devoluções e assistência técnica.

Fluxo RMA:
1. Solicitação: cliente solicita devolução
2. Inspeção: análise do produto
3. Aprovação ou rejeição
4. Destinação: reparo, substituição, crédito ou descarte

Motivos:
- Defeito, Troca, Arrependimento, Avaria

Destinos:
- Reparo: produto retorna para assistência
- Substituição: gera NF-e de devolução e novo pedido
- Crédito: crédito automático em conta a receber
- Descarte: produto sem condição de uso`,
    exemplos: [],
  },
  {
    id: 'adiantamentos-ajuda',
    titulo: 'Adiantamentos Financeiros',
    categoria: 'Financeiro',
    conteudo: `# Adiantamentos Financeiros

O módulo de Adiantamentos permite registrar valores pagos ou recebidos antes da conclusão da operação.

---

## Tipos

- **Adiantamento a Fornecedor**: pré-pagamento de compras
- **Adiantamento de Cliente**: sinal ou entrada recebida

---

## Fluxo

1. Cadastre o adiantamento com cliente/fornecedor, valor e data
2. Quando a operação for concluída, baixe o adiantamento
3. O valor é automaticamente vinculado à conta a receber/pagar

---

## Como Usar

Acesse **Financeiro > Adiantamentos** e clique em **+ Novo Adiantamento**.`,
  },
  {
    id: 'quitacoes-ajuda',
    titulo: 'Quitações em Lote',
    categoria: 'Financeiro',
    conteudo: `# Quitações em Lote

Baixe múltiplas contas a receber ou a pagar de uma só vez.

---

## Quando Usar

- Fechamento do caixa do PDV (todas as vendas do dia)
- Pagamento de múltiplos boletos do mesmo fornecedor
- Conciliação bancária

---

## Como Usar

Acesse **Financeiro > Quitações**, filtre as contas, marque as desejadas e clique em **Quitar Selecionadas**.`,
  },
  {
    id: 'conciliacao-ajuda',
    titulo: 'Conciliação Bancária',
    categoria: 'Financeiro',
    conteudo: `# Conciliação Bancária

Compare o extrato bancário com as contas registradas no sistema.

---

## Funcionalidades

- Importação de extratos OFX, CSV e XLSX
- Correspondência automática por valor/data
- Conciliação manual (arrastar lançamentos)
- Identificação de divergências (tarifas, valores diferentes)
- Finalização do período com relatório

---

## Como Usar

Acesse **Financeiro > Conciliação Bancária**, importe o extrato e concilie os lançamentos.`,
  },
  {
    id: 'cte-ajuda',
    titulo: 'CT-e (Conhecimento de Transporte)',
    categoria: 'Fiscal',
    conteudo: `# CT-e (Modelo 57)

Documento fiscal digital obrigatório para contratação de serviço de transporte de cargas.

---

## Funcionalidades

- Cadastro de veículos e condutores
- Vinculação de NF-e ao CT-e
- Transmissão para SEFAZ
- Encerramento e cancelamento

---

## Como Usar

Acesse **Fiscal > CT-e** para criar e gerenciar conhecimentos de transporte.`,
  },
  {
    id: 'licitacoes-ajuda',
    titulo: 'Licitações',
    categoria: 'Vendas',
    conteudo: `# Licitações

Gerencie a participação da sua empresa em processos licitatórios públicos.

---

## Funcionalidades

- Cadastro de licitações com modalidade e objeto
- Itens do edital vinculados a produtos
- Acompanhamento de status (Rascunho a Homologada)
- Registro de resultado

---

## Como Usar

Acesse **Vendas > Licitações** e cadastre cada processo licitatório.`,
  },
  {
    id: 'convenios-ajuda',
    titulo: 'Convênios',
    categoria: 'Vendas',
    conteudo: `# Convênios

Gerencie parcerias e acordos comerciais com descontos especiais.

---

## Funcionalidades

- Cadastro de convênios com vigência
- Descontos percentuais ou valor fixo
- Aplicação automática nas vendas
- Controle de ativação/desativação

---

## Como Usar

Acesse **Vendas > Convênios** para criar e gerenciar parcerias.`,
  },
  {
    id: 'promocoes-ajuda',
    titulo: 'Promoções',
    categoria: 'Vendas',
    conteudo: `# Promoções

Crie ofertas temporárias com preços especiais para impulsionar vendas.

---

## Tipos de Promoção

- **Percentual**: desconto % sobre o preço
- **Valor Fixo**: preço promocional definido
- **Leve X Pague Y**: compre quantidade, ganhe desconto

---

## Como Usar

Acesse **Estoque > Promoções**, defina período, produtos e valores. A promoção é aplicada automaticamente no PDV e pedidos.`,
  },
  {
    id: 'kardex-ajuda',
    titulo: 'Kardex (Ficha de Estoque)',
    categoria: 'Estoque',
    conteudo: `# Kardex

Registro detalhado de todas as movimentações de cada produto: entradas, saídas e saldo acumulado.

---

## Funcionalidades

- Consulta por produto e período
- Tipos: Compra, Venda, Devolução, Ajuste, Transferência
- Saldo acumulado por movimentação
- Exportação para CSV e PDF

---

## Como Usar

Acesse **Estoque > Kardex**, selecione o produto e período para visualizar o histórico completo.`,
  },
  {
    id: 'dashboard-ajuda',
    titulo: 'Dashboard',
    categoria: 'Geral',
    conteudo: `# Dashboard

O painel inicial mostra indicadores, gráficos e atalhos para as principais funções.

---

## Indicadores

- Vendas do Dia
- Contas a Receber
- Contas Vencidas
- Estoque Baixo
- Saldo em Caixa

---

## Gráficos

- Vendas por período (7/30 dias)
- Contas a Receber vs Pagar
- Produtos mais vendidos

---

## Personalização

Clique em **Personalizar** para escolher quais indicadores aparecem no seu dashboard.`,
  },
  {
    id: 'movimentacoes-ajuda',
    titulo: 'Movimentações Internas',
    categoria: 'Estoque',
    conteudo: `# Movimentações Internas

Transferências de produtos entre filiais e ajustes manuais de estoque.

---

## Tipos

- **Transferência**: entre filiais
- **Ajuste de Entrada**: corrige para mais
- **Ajuste de Saída**: corrige para menos
- **Consumo Interno**: uso administrativo

---

## Como Usar

Acesse **Estoque > Movimentações** para transferir ou ajustar estoque manualmente.`,
  },
  {
    id: 'categorias-ajuda',
    titulo: 'Categorias de Produtos',
    categoria: 'Estoque',
    conteudo: `# Categorias

Organize produtos em grupos hierárquicos para facilitar buscas e relatórios.

---

## Funcionalidades

- Hierarquia (pai/filho)
- Ativação/desativação
- Vinculação automática aos produtos

---

## Como Usar

Acesse **Estoque > Categorias** para criar e gerenciar grupos de produtos.`,
  },
  {
    id: 'unidades-medida-ajuda',
    titulo: 'Unidades de Medida',
    categoria: 'Estoque',
    conteudo: `# Unidades de Medida

Defina como os produtos são medidos e vendidos (UN, KG, L, etc.).

---

## Unidades Padrão

UN (Unidade), KG (Quilograma), G (Grama), L (Litro), ML (Mililitro), M (Metro), M2 (Metro Quadrado), CX (Caixa), PC (Peça), PCT (Pacote), TON (Tonelada)

---

## Como Usar

Acesse **Estoque > Unidades de Medida** para cadastrar novas unidades ou gerenciar as existentes.`,
  },
  {
    id: 'logs-ajuda',
    titulo: 'Logs do Sistema',
    categoria: 'Sistema',
    conteudo: `# Logs do Sistema

Registros de todas as ações importantes realizadas no sistema.

---

## Categorias

- **AUTH**: Login, logout, tentativas
- **API**: Requisições HTTP
- **DATABASE**: Operações de banco
- **BUSINESS**: Regras de negócio
- **VALIDATION**: Erros de validação
- **SECURITY**: Eventos de segurança
- **SYSTEM**: Eventos gerais

---

## Como Usar

Acesse **Gestão > Logs do Sistema**. Use filtros por período, usuário, categoria e status para localizar rapidamente.`,
  },
  {
    id: 'usuarios-ajuda',
    titulo: 'Gerenciamento de Usuários',
    categoria: 'Sistema',
    conteudo: `# Gerenciamento de Usuários

Controle quem acessa o sistema e quais permissões cada um possui.

---

## Perfis de Acesso

- **Administrador**: acesso total
- **Gerente**: vendas, estoque, financeiro
- **Operador**: PDV e consultas
- **Visualizador**: apenas consulta

---

## Como Usar

Acesse **Gestão > Usuários** para criar, editar ou desativar usuários.`,
  },
  {
    id: 'parametros-ajuda',
    titulo: 'Parâmetros do Sistema',
    categoria: 'Sistema',
    conteudo: `# Parâmetros do Sistema

Configure o comportamento do sistema: regras de negócio, dados fiscais e preferências.

---

## Categorias

- **Gerais**: nome da empresa, CNPJ, regime tributário
- **Vendas**: desconto máximo, bloquear sem estoque
- **Fiscal**: ambiente NF-e, série, certificado
- **Financeiro**: dias vencimento, juros, multa
- **Estoque**: alerta mínimo, método de custo

---

## Como Usar

Acesse **Gestão > Parâmetros** para visualizar e alterar configurações.`,
  },
];

const categorias = [...new Set(itensAjuda.map((item) => item.categoria))];

function AjudaPage() {
  const [itemSelecionado, setItemSelecionado] = useState<AjudaItem | null>(itensAjuda[0]);
  const [busca, setBusca] = useState('');
  const [copiado, setCopiado] = useState<string | null>(null);

  const itensFiltrados = itensAjuda.filter(
    (item) =>
      item.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      item.conteudo.toLowerCase().includes(busca.toLowerCase()) ||
      item.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  const copiarCodigo = (codigo: string, id: string) => {
    navigator.clipboard.writeText(codigo);
    setCopiado(id);
    setTimeout(() => setCopiado(null), 2000);
  };

  return (
    <div className="flex h-full bg-gray-50">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary-600" />
            Ajuda & Documentação
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Guia completo do sistema
          </p>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar ajuda..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {categorias.map((categoria) => {
            const itensDaCategoria = itensFiltrados.filter(
              (item) => item.categoria === categoria
            );
            if (itensDaCategoria.length === 0) return null;

            return (
              <div key={categoria} className="mb-2">
                <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                  {categoria}
                </h3>
                {itensDaCategoria.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => setItemSelecionado(item)}
                    className={`w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-gray-50 transition-colors justify-start ${
                      itemSelecionado?.id === item.id
                        ? 'bg-primary-50 border-r-2 border-primary-600'
                        : ''
                    }`}
                  >
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{item.titulo}</span>
                  </Button>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {itemSelecionado ? (
          <div className="max-w-4xl mx-auto p-8">
            <Card>
              <CardHeader>
                <span className="inline-block px-3 py-1 text-xs font-medium text-primary-700 bg-primary-50 rounded-full">
                  {itemSelecionado.categoria}
                </span>
                <CardTitle className="text-2xl font-bold text-gray-900 mt-3">
                  {itemSelecionado.titulo}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="
                  text-base leading-7 text-slate-700
                  [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-slate-900 [&>h1]:mb-6 [&>h1]:mt-8 [&>h1]:first:mt-0
                  [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:text-slate-800 [&>h2]:mb-4 [&>h2]:mt-8 [&>h2]:pb-2 [&>h2]:border-b [&>h2]:border-slate-200
                  [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-slate-800 [&>h3]:mb-3 [&>h3]:mt-6
                  [&>p]:mb-4 [&>p]:leading-relaxed
                  [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-5 [&>ul]:space-y-2
                  [&>ul>li]:mb-1
                  [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-5 [&>ol]:space-y-2
                  [&>hr]:my-8 [&>hr]:border-slate-300
                  [&>blockquote]:border-l-4 [&>blockquote]:border-blue-600 [&>blockquote]:bg-blue-50 [&>blockquote]:p-4 [&>blockquote]:rounded-r-lg [&>blockquote]:my-6
                  [&>strong]:font-semibold [&>strong]:text-slate-900
                ">
                  <ReactMarkdown>{itemSelecionado.conteudo}</ReactMarkdown>
                </div>

                {itemSelecionado.tabelas && itemSelecionado.tabelas.length > 0 && (
                  <div className="mt-8 space-y-6">
                    {itemSelecionado.tabelas.map((tabela, index) => (
                      <div key={index}>
                        {tabela.titulo && (
                          <h3 className="text-lg font-semibold text-slate-800 mb-3 mt-6">
                            {tabela.titulo}
                          </h3>
                        )}
                        <div className="rounded-lg border-2 border-slate-800 overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-slate-800">
                                {tabela.colunas.map((coluna, colIndex) => (
                                  <th key={colIndex} className="p-3 text-left text-white font-semibold tracking-wide">
                                    {coluna}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {tabela.linhas.map((linha, linhaIndex) => (
                                <tr 
                                  key={linhaIndex} 
                                  className={`
                                    ${linhaIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                                    hover:bg-blue-50
                                  `}
                                >
                                  {linha.map((celula, celulaIndex) => (
                                    <td 
                                      key={celulaIndex} 
                                      className={`p-3 border-b border-slate-300 ${celulaIndex === 0 ? 'font-medium' : ''}`}
                                    >
                                      {celula}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {itemSelecionado.exemplos && itemSelecionado.exemplos.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Exemplos Práticos
                    </h3>
                    {itemSelecionado.exemplos.map((exemplo, index) => (
                      <div key={index} className="bg-gray-900 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                          <span className="text-sm font-medium text-gray-300">
                            {exemplo.titulo}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copiarCodigo(exemplo.codigo, `${itemSelecionado.id}-${index}`)}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                            title="Copiar código"
                          >
                            {copiado === `${itemSelecionado.id}-${index}` ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                        <pre className="p-4 text-sm text-gray-100 overflow-x-auto">
                          <code>{exemplo.codigo}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  const idx = itensAjuda.findIndex((i) => i.id === itemSelecionado.id);
                  if (idx > 0) setItemSelecionado(itensAjuda[idx - 1]);
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                ← Anterior
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const idx = itensAjuda.findIndex((i) => i.id === itemSelecionado.id);
                  if (idx < itensAjuda.length - 1) setItemSelecionado(itensAjuda[idx + 1]);
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Próximo →
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Selecione um item para ver a documentação</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AjudaPage;
