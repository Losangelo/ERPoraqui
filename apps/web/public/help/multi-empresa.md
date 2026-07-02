# Multi-empresa (Grupo Econômico) — Guia de Uso

## O que é?

O módulo Multi-empresa permite que **várias empresas (CNPJs) do mesmo grupo** sejam gerenciadas em um único sistema. Cada empresa mantém seus dados separados (clientes, notas, financeiro), mas o administrador do grupo pode visualizar tudo consolidado.

---

## Conceitos Essenciais

| Termo | Significado |
|-------|-------------|
| **Grupo Econômico** | Conjunto de empresas ligadas (mesmo dono, holding, etc.) |
| **Empresa Principal** | A empresa contratante do sistema (geralmente a matriz) |
| **Empresa Vinculada** | Outra empresa do mesmo grupo adicionada ao sistema |
| **Isolamento de Dados** | Cada empresa vê apenas seus próprios dados |
| **Visão Consolidada** | Admin pode ver relatórios de todas as empresas juntas |

---

## Como Funciona

### Perfis de Acesso

| Perfil | O que vê |
|--------|----------|
| **Usuário comum** | Apenas dados da sua empresa |
| **Admin do grupo** | Pode alternar entre empresas, ver dados consolidados |
| **Master** | Configura e gerencia as empresas do grupo |

### Alternância
- O usuário admin pode **alternar entre empresas** no topo da tela (seletor)
- Ao trocar, todo o sistema passa a mostrar dados da empresa selecionada
- Relatórios e dashboards refletem a empresa ativa

---

## Dicas e Truques

### Quando Criar Empresas Vinculadas
- **Matriz e filial com CNPJ próprio** — cada uma precisa de CNPJ diferente
- **Grupo com empresas de ramos diferentes** — ex: uma de comércio, outra de serviços
- **Holding com controladas** — gestão centralizada

### Quando NÃO Criar
- Filiais **sem CNPJ próprio** (mesmo CNPJ da matriz) → use o módulo **Filial**
- Departamentos internos → use **Centro de Custo**

### Limites por Plano
- **BASIC**: 1 empresa
- **PROFISSIONAL**: até 3 empresas
- **PREMIUM**: até 10 empresas
- Consulte a página de Planos para ver o limite atual da sua licença

---

## Boas Práticas

- **Mantenha os cadastros separados** — cada empresa tem seus próprios clientes, produtos e fornecedores
- **Não duplique cadastros** — se o cliente é o mesmo para várias empresas, cadastre em cada uma
- **Consolidado**: o admin pode gerar relatórios consolidados para visão do grupo
- **Licença**: verifique se seu plano comporta todas as empresas que precisa gerenciar
