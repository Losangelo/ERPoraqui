# ERPoraqui

Sistema de Gestão Empresarial (ERP) completo, desenvolvido com TypeScript, Node.js, React e PostgreSQL.

## Stack

- **Backend:** Express.js + TypeScript + Prisma + PostgreSQL
- **Frontend:** React + TypeScript + Vite + shadcn/ui + Tailwind CSS
- **Infra:** Docker, Nginx, Redis, RabbitMQ

## Funcionalidades

- Cadastros: Clientes, Fornecedores, Produtos, Transportadoras, Vendedores
- Vendas: Pedidos, Orçamentos, PDV, CRM com Pipeline Kanban
- Compras: Pedidos, Cotações, Entradas de Mercadoria
- Estoque: Controle, Inventário, Variações (grades), Lotes, Tabelas de Preço
- Financeiro: Contas a Receber/Pagar, Fluxo de Caixa, Boletos, Cheques, Centros de Custo
- Fiscal: NF-e, NFC-e, NFSe, ECF, SPED Fiscal, DRE, Plano de Contas
- Automação: Triggers e Ações Automáticas
- Multi-empresa: Gestão de Grupo Econômico
- Licenciamento: Planos BASIC/PROFISSIONAL/PREMIUM

## Deploy

```bash
rsync -avz --delete --exclude='node_modules' --exclude='.git' \
  --exclude='dist' --exclude='.env' --exclude='*.log' \
  --exclude='apps/web/node_modules' --exclude='apps/api/node_modules' \
  --exclude='apps/api/prisma/migrations' --exclude='apps/web/dist' \
  -e "ssh -o StrictHostKeyChecking=no" \
  ./ losangelo@192.168.15.222:/DATA/shopping/erporaqui/

ssh -o StrictHostKeyChecking=no losangelo@192.168.15.222 "
  cd /DATA/shopping/erporaqui && \
  DOCKER_CONFIG=/tmp/docker-config docker compose build api web && \
  DOCKER_CONFIG=/tmp/docker-config docker compose up -d api web
"
```
