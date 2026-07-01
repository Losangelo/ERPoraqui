import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { BookOpen, ChevronRight, Search, Copy, Check, Lock, ShieldAlert } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SecaoTecnica {
  id: string;
  titulo: string;
  categoria: string;
  conteudo: string;
  exemplos?: { titulo: string; codigo: string }[];
}

const itensTecnicos: SecaoTecnica[] = [
  {
    id: 'visao-geral',
    titulo: 'Visao Geral da Arquitetura',
    categoria: 'Arquitetura',
    conteudo: `## ERPoraqui - Manual Tecnico do Desenvolvedor

Bem-vindo ao manual tecnico do ERPoraqui. Este documento descreve a arquitetura, padroes e fluxos de desenvolvimento.

---

## Diagrama de Arquitetura

\`\`\`
Cliente (React + Vite) --> API (Express + Prisma) --> PostgreSQL
                    `,
    exemplos: [
      {
        titulo: 'Fluxo de Requisicao',
        codigo: `Browser -> React -> Axios -> Express -> Prisma -> PostgreSQL
                              |
                             Redis (cache)
                              |
                         RabbitMQ (jobs)`,
      },
    ],
  },
  {
    id: 'stack',
    titulo: 'Stack Tecnologica',
    categoria: 'Arquitetura',
    conteudo: `## Stack Completa

### Frontend (apps/web)
| Tecnologia | Versao | Uso |
|------------|--------|-----|
| React | 18+ | UI Library |
| TypeScript | 5+ | Tipagem |
| Vite | 5+ | Bundler / Dev Server |
| React Router | 6+ | Roteamento SPA |
| TanStack Query | 5+ | Server State / Cache |
| Zustand | 4+ | Auth State |
| Zod | 3+ | Validacao |
| Tailwind CSS | 3+ | Estilizacao utilitaria |
| shadcn/ui | latest | Componentes base |
| Lucide React | latest | Icones |
| React Markdown | latest | Renderizacao MD |
| react-hot-toast | latest | Notificacoes |
| SheetJS (xlsx) | latest | Exportacao XLSX |
| html2canvas | latest | Exportacao PDF |
| jsPDF | latest | Exportacao PDF |

### Backend (apps/api)
| Tecnologia | Versao | Uso |
|------------|--------|-----|
| Express.js | 4+ | HTTP Framework |
| TypeScript | 5+ | Tipagem |
| Prisma | 5+ | ORM / Migrations |
| PostgreSQL | 15+ | Banco de dados |
| Redis | 7+ | Cache / Sessoes |
| RabbitMQ | 3+ | Filas / Jobs |
| Zod | 3+ | Validacao DTO |
| Pino | 8+ | Logger estruturado |
| node-forge | latest | Criptografia / Certificados |
| xml-crypto | latest | Assinatura XML NF-e |
| json2csv | latest | Exportacao CSV |
| exceljs | latest | Exportacao XLSX no backend |

### Infraestrutura
| Componente | Detalhe |
|------------|---------|
| Container | Docker + Docker Compose |
| Servidor | ZimaLOS (CasaOS) - 192.168.15.222 |
| Rede | erg_network (bridge) |
| Proxy | Nginx (container web :3003) |
| Portas API | :3002 (interno), :3003 (nginx) |
| Banco | Postgres :5432 |
| Cache | Redis :6379 |
| Jobs | RabbitMQ :5672 / :15672 (mgmt) |`,
  },
  {
    id: 'estrutura-projeto',
    titulo: 'Estrutura do Projeto',
    categoria: 'Arquitetura',
    conteudo: `## Estrutura de Pastas

\`\`\`
ERPoraqui/
├── apps/
│   ├── api/                          # Backend Express
│   │   ├── prisma/
│   │   │   └── schema.prisma         # Modelo de dados completo
│   │   ├── src/
│   │   │   ├── modules/              # Modulos de negocio
│   │   │   │   ├── auth/             # Autenticacao
│   │   │   │   ├── clientes/         # Clientes CRUD
│   │   │   │   ├── produtos/         # Produtos CRUD
│   │   │   │   ├── vendas/           # Pedidos de venda
│   │   │   │   ├── pdv/              # Ponto de venda
│   │   │   │   ├── notas-fiscais/    # NF-e
│   │   │   │   ├── nfce/             # NFC-e
│   │   │   │   ├── nfse/             # NFSe
│   │   │   │   ├── estoque/          # Estoque / movimentacoes
│   │   │   │   ├── financeiro/       # Contas a pagar/receber
│   │   │   │   ├── fluxo-caixa/      # Fluxo de caixa
│   │   │   │   ├── plano-contas/     # Plano de contas
│   │   │   │   ├── dre/              # DRE
│   │   │   │   ├── boletos/          # Boletos CNAB
│   │   │   │   ├── cheques/          # Cheques
│   │   │   │   ├── centros-custo/    # Centros de custo
│   │   │   │   ├── crm/              # CRM
│   │   │   │   ├── automacao/        # Automacao de regras
│   │   │   │   ├── multi-empresa/    # Multi-empresa
│   │   │   │   ├── licencas/         # Sistema de licenciamento
│   │   │   │   └── ...               # Demais modulos
│   │   │   ├── shared/
│   │   │   │   ├── tributos/         # Calculos fiscais (CBS/IBS/ICMS/IPI/PIS/COFINS)
│   │   │   │   ├── nfe-utils/        # Utilitarios NF-e (chave 44d, XML, assinatura)
│   │   │   │   ├── sefaz-client/     # Comunicacao SOAP SEFAZ
│   │   │   │   ├── cnab/             # CNAB 400/240 (remessa/retorno)
│   │   │   │   ├── pdf/             # Geracao de PDFs
│   │   │   │   └── logger/          # Logger centralizado (Pino)
│   │   │   ├── routes/              # Agregacao de rotas
│   │   │   ├── middleware/          # Middlewares (auth, validator, log)
│   │   │   └── server.ts            # Entry point
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                          # Frontend React
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/              # shadcn/ui components
│       │   │   ├── layout/          # Sidebar, Header, Layout
│       │   │   └── export/          # ExportButton reutilizavel
│       │   ├── pages/               # Paginas da aplicacao
│       │   │   ├── customers/
│       │   │   ├── products/
│       │   │   ├── orders/
│       │   │   ├── ...
│       │   │   └── PdvPage.tsx
│       │   ├── services/            # Chamadas API (Axios)
│       │   ├── stores/              # Zustand stores
│       │   ├── utils/               # Utilitarios (export.ts)
│       │   ├── App.tsx              # Router principal
│       │   ├── main.tsx             # Entry point
│       │   └── index.css            # Tailwind + globals
│       ├── Dockerfile
│       ├── package.json
│       └── vite.config.ts
│
├── docs/
│   ├── specs/                       # Especificacoes tecnicas
│   │   ├── NFE.md
│   │   ├── ESTOQUE_AVANCADO.md
│   │   ├── BOLETOS_CNAB.md
│   │   ├── CHEQUES.md
│   │   ├── CENTRO_CUSTO.md
│   │   └── EXPORTACAO.md
│   ├── TODO.md                      # Lista de tarefas
│   ├── stepByStep.md                # Progresso cronologico
│   └── kanban/
│       └── FEATURES.md              # Inventario de funcionalidades
│
├── docker-compose.yml               # Orquestracao completa
├── AGENTS.md                        # Instrucoes para agentes IA
├── package.json                     # Root (workspaces)
└── README.md
\`\`\`

---

## Convencao de Nomes

| Contexto | Convencao | Exemplo |
|----------|-----------|---------|
| Arquivos | PascalCase para componentes, camelCase para utilitarios | PdvPage.tsx, export.ts |
| Pastas | kebab-case | fluxo-caixa/ |
| Rotas API | kebab-case | /plano-contas/arvore |
| Rotas Frontend | kebab-case | /contas-receber |
| Variaveis | camelCase | totalCarrinho |
| Interfaces | PascalCase prefixado | VendaPDV, Cliente |
| Tipos | PascalCase | ProdutoPDV |
| Enums (evitar) | usar union types | 'ABERTA' \\| 'FINALIZADA'`,
  },
  {
    id: 'api-patterns',
    titulo: 'Padroes da API',
    categoria: 'Backend',
    conteudo: `## Padroes de Desenvolvimento da API

### Estrutura de um Modulo

Cada modulo segue o mesmo padrao:

\`\`\`
modulo/
├── modulo.routes.ts       # Definicao de rotas Express
├── modulo.controller.ts   # Handlers HTTP
├── modulo.service.ts      # Logica de negocio
├── modulo.dto.ts          # Validacao Zod
├── modulo.types.ts        # Interfaces/Types
└── modulo.test.ts         # Testes (opcional)
\`\`\`

---

### Controller Pattern

\`\`\`typescript
import { Request, Response } from 'express';
import { moduloService } from './modulo.service';

export const moduloController = {
  async listar(req: Request, res: Response) {
    try {
      const dados = await moduloService.listar(req.query);
      res.json({ success: true, data: dados });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },
};
\`\`\`

---

### Service Pattern (RO-RO)

\`\`\`typescript
export const moduloService = {
  async listar(filtros: ListarFiltros): Promise<Item[]> {
    return prisma.item.findMany({ where: filtros });
  },
};
\`\`\`

### DTO Validation (Zod)

\`\`\`typescript
import { z } from 'zod';

export const criarItemSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatorio'),
  valor: z.coerce.number().positive(),
  ativo: z.coerce.boolean().optional(),
});
\`\`\`

### Response Padrao

\`\`\`typescript
// Sucesso:
{ success: true, data: { ... } }

// Lista com paginacao:
{ success: true, data: [...], meta: { pagina, limite, total } }

// Erro:
{ success: false, error: "Mensagem de erro" }
\`\`\``,
  },
  {
    id: 'frontend-patterns',
    titulo: 'Padroes do Frontend',
    categoria: 'Frontend',
    conteudo: `## Padroes de Desenvolvimento Frontend

### Estrutura de Pagina CRUD

\`\`\`tsx
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"

export function PageName() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadData() }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Titulo</h1>
          <p className="text-muted-foreground">Descricao</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>Novo</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coluna</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
\`\`\`

### Import Paths

- Components: \`@/components/ui/button\`
- Services: \`@/services/clientes\`
- Stores: \`@/stores/AuthContext\`
- Utils: \`@/utils/export\`

### Service Pattern

\`\`\`typescript
import { api } from './api';

export const clientesService = {
  listar: async (filtros: Filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.nome) params.append('nome', filtros.nome);
    const response = await api.get(\`/clientes?\${params}\`);
    return response.data?.data || response.data?.dados || [];
  },
};
\`\`\`

### Regras de Ouro

1. **Todo Input precisa de placeholder descritivo**
2. **Nao use enums** - Use union types
3. **Nao use any** - Tipagem rigorosa
4. **Componentes shadcn/ui** para toda UI
5. **Lucide React** para icones
6. **React Hook Form + Zod** para formularios complexos`,
  },
  {
    id: 'database',
    titulo: 'Banco de Dados (Prisma)',
    categoria: 'Backend',
    conteudo: `## Modelo de Dados - Prisma ORM

### Conceitos Principais

- **ORM**: Prisma 5+ com PostgreSQL
- **Migrations**: \`prisma db push\` (dev), \`prisma migrate deploy\` (prod)
- **Seed**: \`prisma/seed.ts\` - cria admin, empresa padrao, licencas

### Principais Modelos

\`\`\`prisma
model Empresa {
  id          String   @id @default(cuid())
  razaoSocial String
  nomeFantasia String
  cnpj        String   @unique
  filiais     Filial[]
  usuarios    EmpresaUsuario[]
  produtos    Produto[]
  clientes    Cliente[]
}

model Filial {
  id          String   @id @default(cuid())
  empresaId   String
  nomeFantasia String
  empresa     Empresa  @relation(fields: [empresaId], references: [id])
  vendas      Venda[]
}

model Produto {
  id            String   @id @default(cuid())
  empresaId     String
  nome          String
  codigoBarras  String?
  precoVenda    Decimal  @default(0)
  quantidadeEstoque Int  @default(0)
  NCM           String?
  variacoes     ProdutoVariacao[]
  lotes         ProdutoLote[]
}

model Venda {
  id            String   @id @default(cuid())
  numeroCupom   String
  filialId      String
  valorTotal    Decimal
  formaPagamento String
  situacao      VendaSituacao @default(ABERTA)
  itens         VendaItem[]
}

model VendaItem {
  id         String  @id @default(cuid())
  vendaId    String
  produtoId  String
  quantidade Int
  valorUnitario Decimal
  venda      Venda  @relation(fields: [vendaId], references: [id])
}
\`\`\`

### Enums vs Union Types

No banco usamos enum do Prisma. No TypeScript usamos union types:

\`\`\`prisma
enum VendaSituacao {
  ABERTA
  FINALIZADA
  CANCELADA
}
\`\`\`

\`\`\`typescript
type VendaSituacao = 'ABERTA' | 'FINALIZADA' | 'CANCELADA';
\`\`\`

### Migrations

\`\`\`bash
# Dev - sincroniza schema sem migration file
npx prisma db push

# Prod - aplica migrations existentes
npx prisma migrate deploy

# Criar nova migration
npx prisma migrate dev --name descricao
\`\`\``,
  },
  {
    id: 'shared-modules',
    titulo: 'Modulos Compartilhados',
    categoria: 'Backend',
    conteudo: `## Modulos Compartilhados (apps/api/src/shared)

### tributos/
Calculo de impostos para NF-e/NFC-e:

\`\`\`typescript
import { calcularImpostos } from '@/shared/tributos';

const resultado = calcularImpostos({
  valorProdutos: 1000,
  NCM: '2203.00.00',
  CST: '00',
  aliquotaICMS: 18,
  regimeTributario: 'SIMPLES_NACIONAL',
  valorFrete: 50,
});
\`\`\`

Impostos calculados: ICMS, IPI, PIS, COFINS, CBS, IBS, IS.

### nfe-utils/
Utilitarios para geracao de NF-e:

\`\`\`typescript
import { gerarChaveAcesso, montarXMLNFe, assinarXML } from '@/shared/nfe-utils';

const chave = gerarChaveAcesso(uf, ano, mes, cnpj, modelo, serie, numNF, tpEmis, cNF);
const xml = montarXMLNFe(dadosNota);
const xmlAssinado = assinarXML(xml, certificado);
\`\`\`

### sefaz-client/
Comunicacao SOAP com a SEFAZ:

\`\`\`typescript
import { sefazClient } from '@/shared/sefaz-client';

const resultado = await sefazClient.autorizar(xmlAssinado, ambiente);
const status = await sefazClient.consultar(chave, ambiente);
const cancelamento = await sefazClient.cancelar(chave, justificativa, ambiente);
\`\`\`

### cnab/
Geracao e leitura de arquivos CNAB:

\`\`\`typescript
import { gerarRemessa400, parseRetorno400 } from '@/shared/cnab';
import { gerarRemessa240, parseRetorno240 } from '@/shared/cnab';

const remessa = gerarRemessa400(boletos, cedente);
const retorno = parseRetorno240(arquivoRetorno);
\`\`\`

### pdf/
Utilitarios para geracao de PDF (boletos, relatorios).

### logger/
Logger centralizado usando Pino:

\`\`\`typescript
import appLogger, { LogCategory } from '@/shared/logger/logger';

appLogger.info('Mensagem', { category: LogCategory.BUSINESS, action: 'criar_venda' });
appLogger.error('Erro', error, { category: LogCategory.API, action: 'listar_produtos' });
appLogger.auth('login', true, { userId: '123' });
appLogger.business('venda_finalizada', { vendaId: '456', valor: 1500 });
\`\`\`

### Categorias de Log
| Categoria | Uso |
|-----------|-----|
| AUTH | Login/logout |
| API | Requisicoes HTTP |
| DATABASE | Operacoes banco |
| BUSINESS | Regras de negocio |
| VALIDATION | Validacoes |
| SECURITY | Eventos seguranca |
| SYSTEM | Eventos gerais |`,
  },
  {
    id: 'deploy',
    titulo: 'Deploy e Infraestrutura',
    categoria: 'DevOps',
    conteudo: `## Deploy no ZimaLOS

### Servidor
| Parametro | Valor |
|-----------|-------|
| Host | 192.168.15.222 |
| Usuario | losangelo |
| Path | /DATA/shopping/erporaqui/ |
| Docker | DOCKER_CONFIG=/tmp/docker-config |

### Comandos de Deploy

\`\`\`bash
# 1. Sincronizar arquivos
rsync -avz --delete --exclude='node_modules' --exclude='.git' \
  --exclude='dist' --exclude='.env' --exclude='*.log' \
  --exclude='apps/web/node_modules' --exclude='apps/api/node_modules' \
  --exclude='apps/api/prisma/migrations' --exclude='apps/web/dist' \
  -e "ssh -o StrictHostKeyChecking=no" \
  /caminho/local/ERPoraqui/ losangelo@192.168.15.222:/DATA/shopping/erporaqui/

# 2. Rebuild containers
ssh -o StrictHostKeyChecking=no losangelo@192.168.15.222 "
  cd /DATA/shopping/erporaqui
  DOCKER_CONFIG=/tmp/docker-config docker compose build api web
  DOCKER_CONFIG=/tmp/docker-config docker compose up -d api web
"
\`\`\`

### docker-compose.yml

\`\`\`yaml
services:
  api:
    build: ./apps/api
    ports: ["3002:3002"]
    environment:
      - DATABASE_URL=postgresql://...
      - REDIS_URL=redis://redis:6379
    depends_on: [postgres, redis]

  web:
    build: ./apps/web
    ports: ["3003:80"]   # Nginx servindo build

  postgres:
    image: postgres:15
    volumes: [pgdata:/var/lib/postgresql/data]

  redis:
    image: redis:7

  rabbitmq:
    image: rabbitmq:3-management
\`\`\`

### Containers
| Nome | Porta |
|------|-------|
| erg_filho_do_guerreiro_api | 3002 |
| erg_filho_do_guerreiro_web | 3003 |
| postgres | 5432 |
| redis | 6379 |
| rabbitmq | 5672/15672 |

### Acesso
- Frontend: http://192.168.15.222:3003
- Login: admin@erporaqui.com.br / admin123`,
  },
  {
    id: 'licencas',
    titulo: 'Sistema de Licenciamento',
    categoria: 'Backend',
    conteudo: `## Sistema de Licenciamento

### Como Funciona

Cada empresa precisa de uma licenca para usar o sistema.
As licencas sao verificadas em middleware nas rotas protegidas.

### Estrutura

\`\`\`prisma
model Licenca {
  id             String   @id @default(cuid())
  empresaId      String
  plano          PlanoTipo @default(BASIC)
  status         LicencaStatus @default(ATIVA)
  dataInicio     DateTime @default(now())
  dataFim        DateTime?
  modulos        Json?    @default("{}")
}

enum PlanoTipo {
  BASIC
  PROFESSIONAL
  ENTERPRISE
}
\`\`\`

### Planos

| Plano | Modulos | Preco |
|-------|---------|-------|
| BASIC | Vendas, Estoque, Financeiro, CRM | Gratuito |
| PROFESSIONAL | + NF-e, NFC-e, Boletos | Pago |
| ENTERPRISE | + Multi-empresa, Automacao, CNAB | Pago |

### Seed Automatica

\`\`\`typescript
// Toda empresa nova recebe licenca BASIC automaticamente
async seedLicencasParaEmpresas() {
  const empresas = await prisma.empresa.findMany();
  for (const empresa of empresas) {
    await prisma.licenca.upsert({
      where: { empresaId: empresa.id },
      create: {
        empresaId: empresa.id,
        plano: 'BASIC',
        status: 'ATIVA',
        modulos: { moduloCrm: true },
      },
      update: {},
    });
  }
}
\`\`\``,
  },
  {
    id: 'nf-e-tecnico',
    titulo: 'NF-e - Detalhes Tecnicos',
    categoria: 'Backend',
    conteudo: `## Emissao de NF-e - Fluxo Tecnico

### Etapas

1. **Montagem do XML** - nfe-utils/montarXMLNFe()
2. **Calculo dos Impostos** - tributos/calcularImpostos()
3. **Geracao da Chave de Acesso** - 44 digitos
4. **Assinatura Digital** - node-forge + xml-crypto
5. **Envio SEFAZ** - SOAP via sefaz-client
6. **Tratamento do Retorno** - sucesso ou rejeicao
7. **Impressao do DANFE** - PDF

### Chave de Acesso (44 digitos)

\`\`\`
cUF AAMM CNPJ                      mod serie nNF                    tpEmis cNF
 26  2406 00529856000173            55   1    1234                    1      8F4E3C12
\`\`\`

### QR Code NFC-e

Para NFC-e, a chave e convertida em QR Code que o consumidor le com o celular.

### Schemas XSD

Os arquivos XSD oficiais da SEFAZ estao em apps/api/src/shared/nfe-utils/schemas/.
A validacao do XML e feita contra estes schemas antes do envio.

### Certificado Digital

- Formato: .pfx (PKCS#12)
- Carregado via lerCertificadoPFX()
- Usado para assinar XML e autenticar na SEFAZ`,
  },
  {
    id: 'sped-engine',
    titulo: 'SPED Engine + BlockRegistry',
    categoria: 'Backend',
    conteudo: `## SPED Fiscal Engine

O SPED Fiscal foi reescrito usando uma arquitetura **config-driven** com **SpedEngine** e **BlockRegistry**, permitindo adicionar novos blocos sem modificar o nucleo do gerador.

---

### Arquitetura

\`\`\`
src/
  shared/
    sped/
      SpedEngine.ts        # Motor principal (gera o arquivo .txt)
      BlockRegistry.ts      # Registro central de blocos
      blocks/
        Bloco0.ts           # Bloco 0 - Abertura
        BlocoC.ts           # Bloco C - Documentos Fiscais
        BlocoD.ts           # Bloco D - NFSe
        BlocoE.ts           # Bloco E - Apuracao ICMS
        BlocoG.ts           # Bloco G - CIAP
        BlocoH.ts           # Bloco H - Inventario
\`\`\`

---

### Block Interface

Cada bloco implementa esta interface:

\`\`\`typescript
interface SpedBlock {
  id: string
  nome: string
  descricao: string
  obrigatorio: boolean

  gerar(config: SpedConfig): Promise<string>
}
\`\`\`

- \`id\`: Identificador unico do bloco (ex: "0", "C", "D")
- \`gerar(config)\`: Recebe a configuracao e retorna o conteudo do bloco como string
- \`obrigatorio\`: Se \`true\`, o bloco e incluido sempre (ex: Bloco 0)

---

### Como adicionar um novo bloco

1. Crie um arquivo \`BlocoX.ts\` em \`apps/api/src/shared/sped/blocks/\`
2. Implemente a interface \`SpedBlock\`
3. Registre no \`BlockRegistry\`:

\`\`\`typescript
// BlockRegistry.ts
import { BlocoX } from './blocks/BlocoX'

export function createBlockRegistry(): Map<string, SpedBlock> {
  const registry = new Map<string, SpedBlock>()
  // ... blocos existentes ...
  registry.set('X', new BlocoX())
  return registry
}
\`\`\`

4. Pronto. O \`SpedEngine\` automaticamente inclui o bloco no arquivo final.

---

### Blocos Disponiveis e Status

| Bloco | Status | Descricao |
|-------|--------|-----------|
| Bloco 0 | ✅ OK | Abertura, identificacao, contador, produtos, parceiros, unidades |
| Bloco C | ✅ OK | NF-e (C100, C170, C190) |
| Bloco D | ✅ OK | NFSe |
| Bloco E | ✅ OK | Apuracao ICMS |
| Bloco G | ✅ OK | CIAP |
| Bloco H | ✅ OK | Inventario |

---

### Express Controller Pattern

O controller do SPED Fiscal foi reescrito seguindo o padrao **Express com arrow functions** e **try/catch centralizado**:

\`\`\`typescript
export const gerarSped = async (req: Request, res: Response) => {
  try {
    const { empresaId, periodo, blocosSelecionados } = req.body
    const config = await buscarConfig(empresaId, periodo)
    const engine = new SpedEngine(createBlockRegistry())
    const arquivo = await engine.gerar(config, blocosSelecionados)
    res.json({ success: true, data: { arquivo } })
  } catch (error) {
    appLogger.error('Erro ao gerar SPED', error, {
      category: LogCategory.BUSINESS,
      action: 'gerar_sped'
    })
    res.status(400).json({ success: false, error: (error as Error).message })
  }
}
\`\`\`

#### Por que reescrevemos?

A implementacao anterior era um **unico arquivo monolítico** com ~2000 linhas, onde toda a logica de cada bloco estava misturada. Isso tornava impossivel:
- Adicionar novos registros sem quebrar os existentes
- Testar blocos individualmente
- Reaproveitar registros comuns (ex: registro 0150 de parceiros)

A nova arquitetura resolve tudo com **separacao por bloco** + **registro centralizado** + **inversao de dependencia** (o engine recebe o registry via construtor).`,
  },
  {
    id: 'ambiente-dev',
    titulo: 'Setup do Ambiente de Desenvolvimento',
    categoria: 'DevOps',
    conteudo: `## Configuracao Local

### Pre-requisitos

- Node.js 18+
- Yarn 1.22+
- PostgreSQL 15+
- Docker (opcional)

### Passos

\`\`\`bash
# 1. Clonar
git clone <repo>
cd ERPoraqui

# 2. Instalar dependencias
yarn install

# 3. Configurar .env
cp apps/api/.env.example apps/api/.env
# Editar DATABASE_URL, REDIS_URL, etc.

# 4. Sincronizar banco
cd apps/api
npx prisma db push
npx prisma db seed

# 5. Iniciar dev
yarn dev
\`\`\`

### Variaveis de Ambiente (apps/api/.env)

\`\`\`env
DATABASE_URL="postgresql://user:pass@localhost:5432/erporaqui"
REDIS_URL="redis://localhost:6379"
RABBITMQ_URL="amqp://localhost:5672"
JWT_SECRET="sua-chave-secreta"
VITE_API_URL="http://localhost:3002/api/v1"
\`\`\`

### Comandos Uteis

| Comando | Descricao |
|---------|-----------|
| \`yarn dev\` | Inicia api + web em dev |
| \`yarn lint\` | ESLint em ambos projetos |
| \`yarn test\` | Testes |
| \`cd apps/web && npx tsc --noEmit\` | Type Check |
| \`cd apps/api && npx prisma studio\` | Interface visual do banco |
| \`cd apps/api && npx prisma db push\` | Sincroniza schema |`,
  },
  {
    id: 'correcoes-comuns',
    titulo: 'Problemas e Correcoes Comuns',
    categoria: 'DevOps',
    conteudo: `## Problemas e Correcoes Frequentes

### 502 Bad Gateway / Crash

**Causa:** Erro nao tratado em controller (Zod .parse() fora de try/catch).

**Correcao:** Manter validates dentro do bloco try.

\`\`\`typescript
// ERRADO
const dados = schema.parse(req.body);
try {
  await service.criar(dados);
} catch (e) { ... }

// CERTO
try {
  const dados = schema.parse(req.body);
  await service.criar(dados);
} catch (e) { ... }
\`\`\`

### 404 em Rotas com Parametro

**Causa:** Rota generica \`/:id\` antes de rotas especificas.

**Correcao:** Rotas especificas ANTES de \`/:id\`.

### 403 Forbidden

**Causa:** Empresa sem licenca.

**Correcao:** Rodar seedLicencasParaEmpresas() ou registrar nova empresa com licenca BASICA.

### 400 Bad Request (query params string)

**Causa:** Query params chegam como string, Zod espera number.

**Correcao:** Usar \`z.coerce.number()\` no schema de validacao.

### response.data?.dados vs response.data?.data

**Causa:** API retorna as vezes \`{ data: [...] }\` e as vezes \`{ dados: [...] }\`.

**Correcao:** Usar \`response.data?.data || response.data?.dados || []\` no frontend.`,
  },
  {
    id: 'git-workflow',
    titulo: 'Fluxo de Trabalho Git',
    categoria: 'DevOps',
    conteudo: `## Git Workflow

### Branch Strategy

\`\`\`
main (producao)
  └── develop (integracao)
        ├── feature/nova-funcionalidade
        ├── fix/correcao-bug
        └── refactor/melhorias
\`\`\`

### Commits

\`\`\`
tipo(escopo): descricao curta

Exemplos:
feat(pdv): implementar busca por codigo de barras
fix(estoque): corrigir 404 na rota /arvore
refactor(api): padronizar response.data
docs(readme): adicionar instrucoes de setup
\`\`\`

### Antes de Commitar

\`\`\`bash
git status          # verificar arquivos alterados
git diff            # revisar mudancas
git log --oneline -5  # ver ultimos commits
\`\`\`

### Nao Fazer

- Nao commitar .env ou secrets
- Nao commitar node_modules
- Nao commitar dist/ ou build/
- Nao forcar push (\`--force\`)
- Nao fazer commit sem autorizacao do usuario`,
  },
];

const categorias = [...new Set(itensTecnicos.map((item) => item.categoria))];

function ManualTecnicoPage() {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState('');
  const [erroSenha, setErroSenha] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<SecaoTecnica | null>(null);
  const [busca, setBusca] = useState('');
  const [copiado, setCopiado] = useState<string | null>(null);

  const itensFiltrados = itensTecnicos.filter(
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

  function handleEntrar() {
    if (senha === '2145') {
      setAutenticado(true);
      setErroSenha(false);
      setItemSelecionado(itensTecnicos[0]);
    } else {
      setErroSenha(true);
    }
  }

  if (!autenticado) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-amber-100 p-4 rounded-full">
                <Lock className="w-10 h-10 text-amber-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Manual Tecnico</CardTitle>
            <CardDescription>
              Acesso restrito a equipe de desenvolvimento.
              Digite a senha para continuar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => { e.preventDefault(); handleEntrar(); }}
              className="space-y-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="senha">Senha de Acesso</Label>
                <Input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => { setSenha(e.target.value); setErroSenha(false); }}
                  placeholder="Digite a senha de acesso"
                  className={erroSenha ? 'border-red-500' : ''}
                  autoFocus
                />
                {erroSenha && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    Senha incorreta. Tente novamente.
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-600" />
              Manual Tecnico
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAutenticado(false)}
              className="text-xs text-gray-400 hover:text-gray-600"
              title="Bloquear acesso"
            >
              <Lock className="w-3 h-3" />
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Equipe de desenvolvimento
          </p>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar no manual tecnico..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10"
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
                        ? 'bg-amber-50 border-r-2 border-amber-600'
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
                <span className="inline-block px-3 py-1 text-xs font-medium text-amber-700 bg-amber-50 rounded-full">
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
                  [&>blockquote]:border-l-4 [&>blockquote]:border-amber-600 [&>blockquote]:bg-amber-50 [&>blockquote]:p-4 [&>blockquote]:rounded-r-lg [&>blockquote]:my-6
                  [&>strong]:font-semibold [&>strong]:text-slate-900
                  [&>pre]:bg-slate-900 [&>pre]:text-slate-100 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:my-4 [&>pre]:overflow-x-auto [&>pre]:text-sm
                  [&>code]:text-sm [&>code]:font-mono [&>code]:bg-slate-100 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded
                  [&>pre>code]:bg-transparent [&>pre>code]:p-0
                  [&>table]:w-full [&>table]:border-collapse [&>table]:my-4
                  [&>table>thead>tr>th]:bg-slate-800 [&>table>thead>tr>th]:text-white [&>table>thead>tr>th]:p-3 [&>table>thead>tr>th]:text-left [&>table>thead>tr>th]:font-semibold
                  [&>table>tbody>tr>td]:p-3 [&>table>tbody>tr>td]:border-b [&>table>tbody>tr>td]:border-slate-300
                  [&>table>tbody>tr:nth-child(even)>td]:bg-slate-50
                ">
                  <ReactMarkdown>{itemSelecionado.conteudo}</ReactMarkdown>
                </div>

                {itemSelecionado.exemplos && itemSelecionado.exemplos.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Exemplos
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
                            title="Copiar codigo"
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
                  const idx = itensTecnicos.findIndex((i) => i.id === itemSelecionado.id);
                  if (idx > 0) setItemSelecionado(itensTecnicos[idx - 1]);
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                ← Anterior
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const idx = itensTecnicos.findIndex((i) => i.id === itemSelecionado.id);
                  if (idx < itensTecnicos.length - 1) setItemSelecionado(itensTecnicos[idx + 1]);
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Proximo →
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Selecione um item para ver o conteudo</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManualTecnicoPage;
