# Especificação Técnica - Boletos CNAB (Remessa + Retorno)

## Visão Geral

Módulo de geração e processamento de arquivos CNAB 240/400 para integração bancária. Permite gerar arquivos remessa (enviar boletos ao banco) e processar arquivos retorno (baixar boletos pagos).

---

## 1. CNAB Utils

### Funções Principais

| Função | Descrição |
|--------|-----------|
| `gerarCnab400Remessa()` | Gera arquivo CNAB 400 remessa |
| `gerarCnab240Remessa()` | Gera arquivo CNAB 240 remessa |
| `parseCnab400Retorno()` | Interpreta arquivo retorno CNAB 400 |
| `parseCnab240Retorno()` | Interpreta arquivo retorno CNAB 240 |

### Helpers

- `padRight(texto, tamanho, char)` - Alinhamento à esquerda
- `padLeft(texto, tamanho, char)` - Alinhamento à direita
- `formatCnabDate(data)` - Data no formato DDMMYY
- `formatCnabValue(valor)` - Valor com 2 decimais, sem separador
- `detectBankFromLine()` - Identifica banco pelo código

### CNAB 400 Remessa (Layout)

| Registro | Tipo | Conteúdo |
|----------|------|----------|
| Header | 0 | Empresa, banco, data |
| Detalhe | 1 | Boleto: vencimento, valor, linha digitável |
| Trailer | 9 | Totalização |

### CNAB 400 Retorno (Parser)

Campos extraídos: situação, data pagamento, valor pago, erros, nosso número.

---

## 2. RemessaBoleto (Modelo)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String | UUID |
| empresaId | String | FK Empresa |
| nomeArquivo | String | Nome do arquivo gerado |
| tipoArquivo | String | CNAB400 ou CNAB240 |
| totalBoletos | Int | Quantidade de boletos |
| valorTotal | Float | Valor total |
| conteudo | String | Conteúdo do arquivo |
| processado | Boolean | Se já foi processado |
| dataProcessamento | DateTime? | Quando processado |

### Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/v1/boletos/:id/remessa | Gerar remessa de 1 boleto |
| POST | /api/v1/boletos/remessa/lote | Gerar remessa em lote |
| POST | /api/v1/boletos/retorno/processar | Processar retorno (base64) |
| GET | /api/v1/boletos/remessa/:id/download | Baixar arquivo remessa |
| GET | /api/v1/boletos/remessa/historico | Listar histórico |

---

## 3. Fluxo de Operação

### Remessa
1. Selecionar boletos a enviar
2. Gerar arquivo CNAB (240 ou 400)
3. Salvar no sistema
4. Download para upload no internet banking

### Retorno
1. Fazer download do arquivo retorno no internet banking
2. Fazer upload no sistema (base64)
3. Sistema processa e atualiza status dos boletos
4. Contas a receber são baixadas automaticamente
