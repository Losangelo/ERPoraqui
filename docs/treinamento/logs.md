# Logs do Sistema — Guia de Uso

## O que é?

O módulo de Logs registra **todas as ações importantes** realizadas no sistema: quem fez, o que fez, quando fez e se deu certo ou errou. Essencial para auditoria, segurança e solução de problemas.

---

## Tipos de Log

| Categoria | O que registra |
|-----------|----------------|
| **AUTH** | Login, logout, tentativas de acesso |
| **API** | Requisições HTTP (rotas acessadas) |
| **DATABASE** | Operações de banco de dados |
| **BUSINESS** | Regras de negócio (venda criada, NF emitida) |
| **VALIDATION** | Erros de validação de formulários |
| **SECURITY** | Eventos de segurança (tentativas de invasão) |
| **SYSTEM** | Eventos gerais do sistema |

---

## Passo a Passo

### 1. Acessar Logs

1. Vá em **Gestão > Logs do Sistema**
2. A tela mostra a lista de logs com:
   - **Data/Hora**: quando ocorreu
   - **Usuário**: quem fez
   - **Ação**: o que foi feito
   - **Categoria**: tipo do log
   - **Status**: ✅ Sucesso ou ❌ Erro
   - **Detalhes**: informação adicional

### 2. Filtrar Logs

Use os filtros disponíveis:
- **Período**: data inicial e final
- **Usuário**: logs de um usuário específico
- **Categoria**: apenas AUTH, API, BUSINESS, etc.
- **Status**: apenas erros ou apenas sucessos
- **Palavra-chave**: busca textual nos detalhes

### 3. Exportar Logs

1. Após aplicar os filtros, clique em **Exportar**
2. Escolha **CSV** ou **XLSX**
3. O arquivo é baixado com os logs filtrados

---

## Quando Consultar Logs

- **Investigar erro**: descubra o que aconteceu antes do problema
- **Auditar alterações**: quem alterou um cadastro importante?
- **Monitorar acessos**: usuários acessando fora do horário?
- **Depurar integrações**: erros em APIs ou webhooks

---

## Dicas e Boas Práticas

- **Logs não podem ser apagados ou alterados** — garantia de auditoria
- **Use os filtros** para encontrar rapidamente o que precisa
- **Logs de erro** são prioridade — investigue imediatamente
- **Exporte logs críticos** para arquivo externo mensalmente

---

## Problemas Comuns

| Problema | Solução |
|----------|---------|
| Log não aparece | Verifique o período selecionado |
| Muitos logs para analisar | Use filtros de categoria e data |
| Log de erro sem detalhes | Pode ser erro interno — verifique o console do servidor |
