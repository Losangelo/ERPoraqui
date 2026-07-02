# CT-e (Conhecimento de Transporte Eletrônico)

Documento fiscal modelo 57 que acoberta o transporte de cargas.

## Conceitos

| Conceito | Descrição |
|----------|-----------|
| CT-e | Conhecimento de Transporte Eletrônico (modelo 57) |
| Tomador | Quem contrata o serviço de transporte |
| Remetente | Quem envia a mercadoria |
| Destinatário | Quem recebe a mercadoria |
| Chave de Acesso | 44 dígitos, gerada automaticamente |

## Situações

| Situação | Descrição |
|----------|-----------|
| EM_DIGITACAO | Rascunho, pode ser editado |
| AUTORIZADO | CT-e emitido e válido |
| CANCELADO | CT-e cancelado |
| ENCERRADO | Transporte concluído |

## Como Emitir

1. Acesse **Fiscal > CT-e** ou busque "CT-e" no Ctrl+K
2. Clique em **Novo CT-e**
3. Preencha:
   - **Filial**: unidade emitente
   - **Tomador**: cliente que contrata (LookupField)
   - **Remetente / Destinatário**: quando aplicável
   - **Tipo Serviço**: Normal, Subcontratação, Redespacho, Mistro
   - **Valor do Frete**: combinado
   - **Valor da Carga**: declarado
   - **Natureza / Espécie**: descrição da carga
   - **Peso e Volumes**: quando aplicável
4. Salve — a chave de acesso é gerada automaticamente

## Ações

- **Visualizar**: detalhes do CT-e
- **Cancelar**: altera situação para CANCELADO

## Armadilhas Comuns

- **Tomador obrigatório**: sempre deve ser informado
- **Chave duplicada**: a chave de acesso é única por CT-e
- **Cancelamento**: após autorizado, o cancelamento é definitivo
