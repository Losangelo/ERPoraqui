<div align="center">
  <img src="apps/web/public/favicon.svg" alt="ERPoraqui" width="80" height="80" />
  <h1 align="center">ERPoraqui</h1>
  <p align="center">
    <strong>Sistema de Gestão Empresarial Completo</strong>
    <br />
    TypeScript · Node.js · React · PostgreSQL
    <br />
    <br />
    <a href="#funcionalidades"><strong>Explore a documentação »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Losangelo/ERPoraqui/issues">Reportar Bug</a>
    ·
    <a href="https://github.com/Losangelo/ERPoraqui/issues">Solicitar Feature</a>
  </p>
</div>

---

## Sobre o Projeto

O **ERPoraqui** é um sistema de gestão empresarial completo, desenvolvido do zero com tecnologia moderna para atender empresas brasileiras. Abrange desde cadastros básicos até emissão fiscal, CRM, automação e gestão financeira.

### 🎯 Objetivo

Substituir sistemas legados (xHarbour/Clipper) por uma plataforma web moderna, escalável e de fácil manutenção.

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| **Runtime** | Node.js 20+ |
| **Linguagem** | TypeScript 5 |
| **Backend** | Express.js + Prisma ORM |
| **Frontend** | React 18 + Vite |
| **UI** | shadcn/ui + Tailwind CSS |
| **Banco** | PostgreSQL 16 |
| **Cache** | Redis 7 |
| **Mensageria** | RabbitMQ |
| **Infra** | Docker + Nginx |

### Dependências Principais

- **Zod** — Validação de schemas
- **TanStack Query** — Gerenciamento de estado server-side
- **Zustand** — Estado global reativo
- **Pino** — Logger estruturado
- **Lucide React** — Ícones
- **React Markdown** — Renderização MD

---

## Funcionalidades

### 📦 Cadastros
| Módulo | Descrição | Status |
|--------|-----------|--------|
| Empresas/Filiais | Cadastro de empresas com filiais (matriz e filiais) | ✅ |
| Clientes | PF/PJ com validação CPF/CNPJ, limite de crédito | ✅ |
| Fornecedores | Cadastro completo de fornecedores | ✅ |
| Produtos | NCM, CST/CSOSN, categorias, unidades de medida | ✅ |
| Variações (Grades) | SKU, preço adicional, estoque por variação | ✅ |
| Lotes | Controle por lote, fabricação, validade, FIFO | ✅ |
| Tabelas de Preço | Múltiplas tabelas, markup automático, preço mínimo | ✅ |
| Transportadoras | Cadastro de transportadoras | ✅ |
| Vendedores | Comissionamento, metas | ✅ |

### 💰 Vendas
| Módulo | Descrição | Status |
|--------|-----------|--------|
| Pedidos de Venda | Itens, condições de pagamento (à vista/a prazo/parcelado), aprovação | ✅ |
| Orçamentos | Propostas comerciais com validade e conversão em pedido | ✅ |
| PDV | Ponto de venda com caixa, operador, múltiplas formas de pagamento | ✅ |
| CRM | Pipeline Kanban, oportunidades, tarefas, interações, Visão 360° | ✅ |
| Campanhas | Marketing automatizado (plano PREMIUM) | ✅ |
| Automação | Triggers e ações para fluxos automáticos (plano PREMIUM) | ✅ |

### 📋 Compras
| Módulo | Descrição | Status |
|--------|-----------|--------|
| Pedidos de Compra | Itens, condições de pagamento, aprovação | ✅ |
| Cotações | Cotação com fornecedores, comparação de preços | ✅ |
| Entradas de Mercadoria | Conferência e entrada de NF de compra | ✅ |

### 📊 Estoque
| Módulo | Descrição | Status |
|--------|-----------|--------|
| Controle de Estoque | Saldo atual, movimentações, custo médio | ✅ |
| Inventário | Geral, parcial, rotativo — contagem e conciliação | ✅ |
| Movimentações Internas | Transferência entre filiais, ajustes | ✅ |

### 💳 Financeiro
| Módulo | Descrição | Status |
|--------|-----------|--------|
| Contas a Receber | Gestão de recebimentos, baixa automática | ✅ |
| Contas a Pagar | Gestão de pagamentos, baixa automática | ✅ |
| Fluxo de Caixa | Entradas e saídas, saldo diário | ✅ |
| Boletos | Geração de boletos com código de barras | ✅ |
| CNAB 240/400 | Remessa e retorno bancário | ✅ |
| Cheques | Controle de cheques recebidos/emitidos, depósito, compensação | ✅ |
| Centros de Custo | Estrutura hierárquica para alocação de despesas | ✅ |
| Conciliação Bancária | Conciliação de extratos | ✅ |

### 📄 Fiscal
| Módulo | Descrição | Status |
|--------|-----------|--------|
| NF-e (Modelo 55) | Emissão, assinatura digital, transmissão SEFAZ | ✅ |
| NFC-e (Modelo 65) | Nota ao consumidor com QR Code | ✅ |
| NFSe | Nota de serviços com RPS | ✅ |
| ECF | Emissor de Cupom Fiscal | ✅ |
| SPED Fiscal | Geração de arquivos SPED | ✅ |
| SPED Contribuições | Geração de arquivos | ✅ |
| DRE | Demonstração do Resultado do Exercício | ✅ |
| Plano de Contas | Estrutura contábil hierárquica | ✅ |
| Reforma Tributária 2026 | CBS/IBS/IS calculados automaticamente | ✅ |

### ⚙️ Gestão
| Módulo | Descrição | Status |
|--------|-----------|--------|
| Dashboard | Indicadores gerenciais em tempo real | ✅ |
| Multi-empresa | Grupo econômico com licença compartilhada | ✅ |
| Licenciamento | Planos BASIC / PROFISSIONAL / PREMIUM | ✅ |
| Logs do Sistema | Auditoria com Pino Logger | ✅ |
| API Pública | Endpoints REST com chave de API | ✅ |
| Parâmetros | Configurações modulares do sistema | ✅ |

---

## Começando

### Pré-requisitos

- Node.js 20+
- Yarn 1.22+
- Docker e Docker Compose
- PostgreSQL 16 (via Docker ou local)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Losangelo/ERPoraqui.git
cd ERPoraqui

# Instale as dependências
yarn install

# Configure as variáveis de ambiente
cp apps/api/.env.example apps/api/.env
# Edite o .env com suas configurações

# Inicie os serviços (PostgreSQL, Redis, RabbitMQ)
DOCKER_CONFIG=/tmp/docker-config docker compose up -d postgres redis rabbitmq

# Execute as migrações do banco
cd apps/api
npx prisma db push
npx prisma db seed

# Inicie o desenvolvimento
cd ../..
yarn dev
```

### Acesso

```
Frontend: http://localhost:3003
API:      http://localhost:3002/api/v1
Login:    admin@erporaqui.com.br / admin123
```

---

## Deploy

### Servidor de Produção (ZimaLOS)

```bash
# Sincronizar arquivos
rsync -avz --delete \
  --exclude='node_modules' --exclude='.git' \
  --exclude='dist' --exclude='.env' --exclude='*.log' \
  --exclude='apps/web/node_modules' --exclude='apps/api/node_modules' \
  --exclude='apps/api/prisma/migrations' --exclude='apps/web/dist' \
  -e "ssh -o StrictHostKeyChecking=no" \
  ./ losangelo@192.168.15.222:/DATA/shopping/erporaqui/

# Rebuild e restart
ssh -o StrictHostKeyChecking=no losangelo@192.168.15.222 "
  cd /DATA/shopping/erporaqui
  DOCKER_CONFIG=/tmp/docker-config docker compose build api web
  DOCKER_CONFIG=/tmp/docker-config docker compose up -d api web
"
```

### Containers

| Serviço | Porta |
|---------|-------|
| API | 3002 |
| Web (Nginx) | 3003 |
| PostgreSQL | 5432 |
| Redis | 6379 |
| RabbitMQ | 5672 / 15672 |

---

## Estrutura do Projeto

```
ERPoraqui/
├── apps/
│   ├── api/                      # Backend Express.js
│   │   ├── prisma/
│   │   │   ├── schema.prisma     # Modelo de dados
│   │   │   └── seed.ts           # Dados de exemplo
│   │   └── src/
│   │       ├── modules/          # Módulos funcionais
│   │       │   ├── auth/
│   │       │   ├── clientes/
│   │       │   ├── produtos/
│   │       │   ├── pedidos-venda/
│   │       │   ├── financeiro/
│   │       │   ├── boletos/
│   │       │   ├── cheques/
│   │       │   ├── centros-custo/
│   │       │   ├── notas-fiscais/
│   │       │   ├── crm/
│   │       │   ├── automacao/
│   │       │   └── ...           # +25 módulos
│   │       ├── shared/           # Código compartilhado
│   │       │   ├── middleware/   # Auth, licença
│   │       │   ├── tributos/     # ICMS/IPI/PIS/COFINS/CBS/IBS/IS
│   │       │   ├── nfe-utils/    # Chave 44d, XML, assinatura
│   │       │   └── sefaz-client/ # Comunicação SEFAZ
│   │       └── __tests__/        # Testes de integração
│   └── web/                      # Frontend React
│       └── src/
│           ├── components/       # shadcn/ui + layout
│           ├── pages/            # Páginas da aplicação
│           ├── services/         # Chamadas à API
│           ├── stores/           # Zustand stores
│           └── __tests__/        # Testes unitários
├── docs/
│   ├── specs/                    # Especificações técnicas
│   └── kanban/                   # Kanban de features
├── docker-compose.yml
└── package.json                  # Yarn Workspace root
```

---

## Arquitetura

### Módulos Compartilhados (NF-e)

O sistema possui módulos compartilhados para cálculo fiscal e comunicação SEFAZ:

```
shared/
├── tributos/          # ICMS, IPI, PIS, COFINS, CBS, IBS, IS
├── nfe-utils/         # Chave 44 dígitos, montagem XML, QRCode
│   ├── assinarXML()   # Assinatura digital (node-forge + xml-crypto)
│   ├── lerCertificadoPFX()
│   └── validarAssinatura()
└── sefaz-client/      # SOAP SEFAZ (autorização, consulta, cancelamento)
```

### Sistema de Licenciamento

Controle de acesso por plano com license guard middleware:

| Plano | Usuários | Clientes | Produtos | Empresas | CRM | Multi-empresa | Automação | API Pública |
|-------|----------|----------|----------|----------|-----|---------------|-----------|-------------|
| BASIC | 3 | 500 | 1.000 | 1 | ❌ | ❌ | ❌ | ❌ |
| PROFISSIONAL | 10 | 3.000 | 5.000 | 3 | ✅ | ✅ | ❌ | ❌ |
| PREMIUM | 50 | 10.000 | 20.000 | 10 | ✅ | ✅ | ✅ | ✅ |

---

## Testes

```bash
# API (vitest + supertest)
cd apps/api && yarn test

# WEB (vitest + jsdom)
cd apps/web && yarn test
```

- **API:** 5 suítes, 36 testes (auth, clientes, empresas, pedidos, pdv)
- **WEB:** 6 suítes, 26 testes (pedidos, compras, financeiro, estoque, pdv, clientes)
- **Total:** 62 testes automatizados

---

## Licenciamento

Este projeto é proprietário. O uso é permitido mediante contratação de plano de licenciamento.

---

## Contato

**Desenvolvido por:** LosAngelo Pacífico

---

<div align="center">
  <sub>Feito com ❤️ para o Brasil</sub>
</div>
