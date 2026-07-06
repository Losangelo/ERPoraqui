# Usuários — Guia de Uso

## O que é?

O módulo de Usuários gerencia quem pode acessar o sistema e **quais permissões** cada um tem. Apenas administradores podem criar, editar ou excluir usuários.

---

## Passo a Passo

### 1. Criar um Novo Usuário

1. Acesse **Gestão > Usuários**
2. Clique em **+ Novo Usuário**
3. Preencha:
   - **Nome**: nome completo (ex: "João Silva")
   - **E-mail**: usado como login (ex: "joao.silva@empresa.com")
   - **Senha**: defina uma senha inicial
   - **Perfil de Acesso**: Administrador, Gerente, Operador, Visualizador
4. Clique em **Salvar**
5. O usuário recebe um e-mail de boas-vindas (opcional)

### 2. Editar Usuário

1. Na lista, clique no ícone de editar
2. Altere os campos necessários
3. Para redefinir senha, clique em **Redefinir Senha**
4. Salve

### 3. Desativar/Ativar Usuário

- **Desativar**: o usuário não consegue mais acessar
- **Ativar**: restaura o acesso
- Use para afastamentos temporários

### 4. Excluir Usuário

- Apenas usuários sem movimentações podem ser excluídos
- Usuários com histórico são **desativados** automaticamente

---

## Permissões por Perfil

| Funcionalidade | Admin | Gerente | Operador | Visualizador |
|----------------|-------|---------|----------|--------------|
| Cadastros | ✅ | ✅ | ✅ | ❌ |
| Vendas / PDV | ✅ | ✅ | ✅ | ❌ |
| Financeiro | ✅ | ✅ | ❌ | ✅ |
| Estoque | ✅ | ✅ | ✅ | ✅ |
| Relatórios | ✅ | ✅ | ❌ | ✅ |
| Fiscal | ✅ | ✅ | ❌ | ❌ |
| Usuários | ✅ | ❌ | ❌ | ❌ |
| Parâmetros | ✅ | ❌ | ❌ | ❌ |

---

## Dicas e Boas Práticas

- **Crie usuários individuais** — nunca compartilhe login
- **Use perfis restritivos** para evitar alterações indesejadas
- **Desative ex-funcionários** imediatamente
- **Revise os usuários ativos** periodicamente
- **Senha forte** é responsabilidade de cada usuário

---

## Problemas Comuns

| Problema | Solução |
|----------|---------|
| Não consigo criar usuário | Apenas Administradores podem criar |
| Usuário não aparece na lista | Use os filtros de busca |
| Erro "e-mail já cadastrado" | Outro usuário já usa este e-mail |
