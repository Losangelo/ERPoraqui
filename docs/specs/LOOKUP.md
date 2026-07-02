# Spec: Sistema de Busca Lookup (Lookup Field)

## 1. Objetivo

Componente genérico e reutilizável de busca/seleção de registros via modal (Lookup Dialog) que pode ser acoplado a qualquer campo de formulário. Substitui inputs de ID cegos por uma experiência de busca com tabela ordenável, navegação por teclado e exibição do label amigável.

## 2. Arquitetura

```
components/lookup/
├── lookup-sources.ts    — Config centralizada de fontes de dados
├── LookupDialog.tsx     — Modal de busca/seleção
└── LookupField.tsx      — Campo trigger que abre o dialog
```

### Fluxo
1. `LookupField` exibe um input read-only com o label do registro selecionado
2. Ao clicar, abre `LookupDialog`
3. `LookupDialog` faz GET no endpoint configurado com `?nome=&limite=50`
4. Usuário digita para filtrar (debounce 300ms), navega com ↑↓, seleciona com Enter/clique
5. Ao selecionar, `onSelect(item)` é chamado e o dialog fecha
6. `LookupField` exibe o label formatado

## 3. Config (lookup-sources.ts)

### Interface `LookupSourceConfig`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `endpoint` | `string` | Rota da API (ex: `/clientes`) |
| `searchParam` | `string` | Query param de busca (ex: `nome`) |
| `valueField` | `string` | Campo usado como valor (ex: `id`) |
| `labelField` | `string` | Campo exibido como label |
| `columns` | `LookupColumn[]` | Colunas da tabela |
| `displayLabel` | `(item) => string` | Formata o label p/ exibição |
| `filterParams?` | `Record<string, string>` | Parâmetros fixos adicionais |

### Fontes cadastradas

| Fonte | Endpoint | Colunas |
|-------|----------|---------|
| `clientes` | `/clientes` | Nome, CPF/CNPJ, Telefone, Cidade/UF |
| `produtos` | `/produtos` | Código, Produto, NCM, Preço |
| `fornecedores` | `/fornecedores` | Nome, CNPJ/CPF, Telefone |
| `vendedores` | `/vendedores` | Nome, Comissão |
| `transportadoras` | `/transportadoras` | Nome, CNPJ/CPF |

## 4. Componentes

### LookupDialog

- **Props:** `open`, `source`, `onSelect(item)`, `onClose`
- **Funcionalidades:**
  - Input de busca com debounce 300ms
  - Tabela com ordenação por coluna (toggle asc/desc)
  - Navegação por teclado: ↑↓ (linha), Enter (selecionar), ESC (fechar)
  - Scroll infinito via `limite=50`
  - Estado de loading, vazio, erro
  - Footer com contagem de registros + atalhos

### LookupField

- **Props:** `source`, `value?`, `selectedLabel?`, `onChange(item)`, `onClear?`, `placeholder?`, `disabled?`, `className?`
- **Funcionalidades:**
  - Input read-only com o label do item selecionado
  - Botão de busca ao lado
  - Botão de limpar (X) quando `onClear` é fornecido
  - Atalho de teclado: `Enter`, `F2`, `Ctrl+L` para abrir
  - Gerencia a abertura/fechamento do LookupDialog

## 5. Teclas de Atalho

| Tecla | Ação |
|-------|------|
| `↑` / `↓` | Navegar entre linhas |
| `Enter` | Selecionar linha ativa |
| `ESC` | Fechar dialog |
| `F2` / `Ctrl+L` | Abrir lookup (no LookupField) |

## 6. Dependências

- Nenhuma nova dependência — usa `@/components/ui/dialog`, `@/components/ui/input`, `@/components/ui/table`, `@/components/ui/button`, `lucide-react`, `@/services/api`

## 7. Uso

```tsx
import { LookupField } from '@/components/lookup/LookupField';

<LookupField
  source="clientes"
  value={formData.clienteId}
  selectedLabel={formData.clienteNome}
  onChange={(item) => setFormData({ clienteId: item.id, clienteNome: item.nome })}
  onClear={() => setFormData({ clienteId: '', clienteNome: '' })}
  placeholder="Buscar cliente por nome, CPF ou CNPJ..."
/>
```
