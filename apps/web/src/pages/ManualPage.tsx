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

const itensManual: AjudaItem[] = [
  {
    id: 'primeiros-passos',
    titulo: 'Primeiros Passos',
    categoria: 'Inicio',
    conteudo: `Bem-vindo ao ERPoraqui! Este manual vai ensinar voce a usar o sistema de forma simples e pratica.

---

## O que e o ERPoraqui?

O ERPoraqui e um sistema de gestao empresarial que ajuda voce a controlar:
- Vendas e pedidos
- Estoque de produtos
- Financeiro (contas a receber e a pagar)
- Notas fiscais
- E muito mais!

---

## Como Acessar o Sistema

1. Abra o navegador (Chrome, Firefox, Edge)
2. Digite o endereco do sistema (fornecido pela sua empresa)
3. Na tela de login, informe seu usuario e senha
4. Clique em "Entrar"

---

## Tela Inicial (Dashboard)

Apos fazer o login, voce vera a tela inicial com:
- Graficos de vendas do dia
- Indicadores importantes
- Atalhos para principais funcoes

---

## Dica Importante

Sempre clique em "Sair" quando terminar de usar o sistema para proteger seus dados.`,
  },
  {
    id: 'cadastrar-cliente',
    titulo: 'Como Cadastrar um Cliente',
    categoria: 'Cadastros',
    conteudo: `Aprenda a cadastrar novos clientes no sistema.

---

## Passo a Passo

1. No menu lateral, clique em **Cadastros** > **Clientes**
2. Voce vera uma lista de clientes ja cadastrados
3. Clique no botao **+ Novo** (ou "Novo Cliente") no canto superior direito
4. Preencha os campos:
   - **Nome**: Nome completo ou razao social
   - **Tipo**: Pessoa Fisica ou Juridica
   - **CPF/CNPJ**: Numero do documento
   - **Telefone**: Para contato
   - **E-mail**: Para enviar notas fiscais
   - **Endereco**: Complete com rua, numero, bairro, cidade e UF
5. Clique em **Salvar**

---

## Campos Obrigatorios

- Nome (obrigatorio)
- CPF ou CNPJ (obrigatorio para emitir notas fiscais)

---

## Dicas

- Cadastre o CPF/CNPJ correto para evitar problemas na emissao de notas fiscais
- Se o cliente for pessoa juridica, informe a Inscricao Estadual
- O e-mail e importante para enviar notas fiscais automaticamente`,
  },
  {
    id: 'cadastrar-produto',
    titulo: 'Como Cadastrar um Produto',
    categoria: 'Cadastros',
    conteudo: `Aprenda a cadastrar produtos no sistema.

---

## Passo a Passo

1. No menu lateral, clique em **Estoque** > **Produtos**
2. Clique em **+ Novo** (ou "Novo Produto")
3. Preencha os dados do produto:

### Dados Basicos
- **Codigo**: Codigo interno do produto
- **Descricao**: Nome do produto (sera shown na nota fiscal)
- **Codigo de Barras**: Para leitura no PDV
- **Categoria**: Grupo do produto (ex: Bebidas, Alimenticios)
- **Unidade**: KG, UN, L, etc.

### Precos
- **Preco de Custo**: Quanto voce pagou pelo produto
- **Preco de Venda**: Preco que sera vendido ao cliente
- **Estoque Minimo**: Quantidade minima para alerta
- **Estoque Maximo**: Quantidade maxima permitida

### Dados Fiscais
- **NCM**: Codigo fiscal do produto (obrigatorio para notas)
- **CST/CSOSN**: Codigo de situacao tributaria
- **Aliquota**: Percentual de imposto

4. Clique em **Salvar**

---

## O que e NCM?

NCM (Nomenclatura Comum do Mercosul) e um codigo de 8 digitos que identifica o tipo de produto. E obrigatorio para emitir notas fiscais.

Exemplos:
- 2203.00.00 = Cervejas
- 1901.90.20 = Achocolatados
- 8544.42.00 = Cabos eletricos

---

## Dica Importante

Sempre preencha o NCM corretamente. Se souber, consulte seu contador ou utilize o site da Receita Federal.`,
  },
  {
    id: 'fazer-venda',
    titulo: 'Como Registrar uma Venda',
    categoria: 'Vendas',
    conteudo: `Aprenda a registrar vendas no sistema.

---

## Metodo 1: Pelo Modulo de Pedidos

1. Clique em **Vendas** > **Pedidos**
2. Clique em **+ Novo Pedido**
3. Selecione o **cliente** (comece a digitar o nome e selecione)
4. Adicione os produtos:
   - Clique em "Adicionar Item"
   - Busque o produto pelo nome ou codigo
   - Informe a quantidade
   - O sistema calcula o total automaticamente
5. Aplique desconto se necessario
6. Escolha a **condicao de pagamento**:
   - A Vista (pagamento unico)
   - A Prazo (parcelado)
   - Parcelado (define numero de parcelas)
7. Clique em **Salvar**

---

## Metodo 2: Pelo PDV (Frente de Loja)

1. Clique em **Vendas** > **PDV**
2. Na tela do caixa:
   - Busque o produto pelo codigo de barras ou nome
   - Adicione ao carrinho
   - Repita para outros produtos
3. Escolha a forma de pagamento:
   - Dinheiro
   - Cartao de Debito
   - Cartao de Credito
   - Pix
4. Clique em **Finalizar**
5. O cupom sera impresso automaticamente

---

## O que acontece apos salvar?

- O estoque e reduzido automaticamente
- Se for a prazo, as contas a receber sao criadas
- Voce pode emitir a nota fiscal (NF-e ou NFC-e)`,
  },
  {
    id: 'emitir-nota-fiscal',
    titulo: 'Como Emitir Nota Fiscal',
    categoria: 'Fiscal',
    conteudo: `Aprenda a emitir notas fiscais eletronicas.

---

## Tipos de Nota Fiscal

- **NF-e**: Nota Fiscal Eletronica (para vendas entre empresas)
- **NFC-e**: Nota Fiscal do Consumidor Eletronica (para vendas ao consumidor final)
- **NFSe**: Nota Fiscal de Servicos Eletronica (para servicos)

---

## Emitindo NF-e ou NFC-e

1. Va em **Fiscal** > **NF-e** (ou NFC-e)
2. Clique em **+ Nova** ou selecione um pedido ja cadastrado
3. Verifique os dados:
   - Dados do emitente (sua empresa)
   - Dados do destinatario (cliente)
   - Produtos vendidos
   - Valores e impostos
4. Clique em **Emitir** ou **Autorizar**
5. O sistema envia para a SEFAZ (Receita Federal)
6. Aguarde a autorizacao (alguns segundos)
7. Apos autorizada, voce pode:
   - Imprimir o DANFE (documento da nota)
   - Enviar por e-mail ao cliente

---

## Campos Obrigatorios na Nota

- CPF/CNPJ do cliente
- Endereco completo
- NCM de cada produto
- CFOP (codigo de operacao)

---

## Status da Nota

- **Em Digitacao**: Nota sendo preenchida
- **Assinada**: Pronta para envio
- **Enviada**: Aguardando autorizacao
- **Autorizada**: Nota valida (pode usar)
- **Cancelada**: Nota cancelada
- **Denegada**: Nota rejeitada pela SEFAZ

---

## Problema na Emissao?

Se a nota for rejeitada, verifique:
1. CPF/CNPJ do cliente esta correto?
2. NCM dos produtos esta preenchido?
3. Certificado digital esta valido?
4. Internet esta funcionando?

O sistema mostra o erro retornado pela SEFAZ. Em caso de duvidas, consulte seu contador.`,
  },
  {
    id: 'controle-estoque',
    titulo: 'Como Controlar o Estoque',
    categoria: 'Estoque',
    conteudo: `Aprenda a gerenciar o estoque do seu negocio.

---

## Visualizando o Estoque

1. Clique em **Estoque** > **Estoque**
2. Voce vera uma lista com:
   - Todos os produtos
   - Quantidade atual
   - Valor total em estoque
3. Use filtros para buscar produtos especificos

---

## Tipos de Movimentacao

### Entrada de Mercadoria
- Compras de fornecedores
- Devolucoes de clientes
- Ajuste de inventario (aumento)

### Saida de Mercadoria
- Vendas de produtos
- Devolucoes para fornecedores
- Ajuste de inventario (reducao)

### Transferencia
- Movimento entre filiais

---

## Como fazer uma entrada (compra)

1. Va em **Estoque** > **Movimentacoes** (ou Compras)
2. Clique em **Nova Entrada**
3. Selecione o fornecedor
4. Adicione os produtos comprados
5. Informe quantidade e preco de custo
6. Salve

O estoque sera aumentado automaticamente.

---

## Inventario

O inventario serve para corrigir o estoque fisico com o sistema.

1. Clique em **Estoque** > **Inventario**
2. Crie um novo inventario
3. O sistema lista todos os produtos
4. Conte os produtos fisicamente
5. Informe a quantidade contada
6. O sistema mostra as diferencas
7. Clique em "Conciliar" para ajustar

---

## Alerta de Estoque Baixo

O sistema alerta quando o estoque esta abaixo do minimo:
- Configure o "Estoque Minimo" no cadastro do produto
- Na tela de estoque, produtos abaixo do minimo sao highlighted
- Faca pedidos de reposicao aos fornecedores`,
  },
  {
    id: 'contas-receber',
    titulo: 'Como Gerenciar Contas a Receber',
    categoria: 'Financeiro',
    conteudo: `Aprenda a controlar as vendas a prazo.

---

## O que sao Contas a Receber?

Sao valores que seus clientes devem pagar por compras feitas a prazo.

---

## Como funciona?

1. Ao fazer uma venda a prazo, o sistema cria automaticamente as parcelas
2. Cada parcela vira uma "conta a receber"
3. Voce acompanha quais estao abertas, pagas ou vencidas

---

## Visualizando as Contas

1. Clique em **Financeiro** > **Contas a Receber**
2. Voce vera uma lista com:
   - Cliente
   - Valor da parcela
   - Data de vencimento
   - Status (Aberta, Paga, Vencida)

---

## Como receber uma conta?

1. Na lista de contas, localize a parcela
2. Clique no icone de **check** ou "Receber"
3. Escolha a forma de pagamento
4. Confirme

A conta sera marcada como "Paga" e movimentara o fluxo de caixa.

---

## Filtros uteis

- **Todas**: Todas as contas
- **Abertas**: Pendentes de recebimento
- **Pagas**: Ja recebidas
- **Vencidas**: Atrasadas (em vermelho)

---

## Dica

Configure alertas de cobranca para clientes inadimplentes.
Verifique diariamente as contas vencidas e entre em contato com o cliente.`,
  },
  {
    id: 'contas-pagar',
    titulo: 'Como Gerenciar Contas a Pagar',
    categoria: 'Financeiro',
    conteudo: `Aprenda a controlar as despesas e compras a prazo.

---

## O que sao Contas a Pagar?

Sao valores que voce precisa pagar aos fornecedores ou despesas do negocio.

---

## Como criar uma conta a pagar?

1. Clique em **Financeiro** > **Contas a Pagar**
2. Clique em **+ Nova**
3. Preencha:
   - **Fornecedor**: Selecione ou cadastre
   - **Valor**: Quanto vai pagar
   - **Data de Vencimento**: Quando deve pagar
   - **Descricao**: O que e a despesa
4. Salve

---

## Como pagar uma conta?

1. Na lista, localize a conta
2. Clique em **Pagar** ou icone de check
3. Escolha a forma de pagamento
4. Confirme

A conta sera marcada como "Paga".

---

## Parcelas de Compra

Quando voce compra a prazo de um fornecedor:
1. Registre a compra (Entrada de Mercadoria)
2. Selecione "A Prazo" ou "Parcelado"
3. O sistema cria automaticamente as parcelas

Voce pode acompanhar em **Contas a Pagar**.

---

## Dica

Anote sempre a data de vencimento para evitar juros e multas.
Revise as contas a pagar semanalmente.`,
  },
  {
    id: 'fluxo-caixa',
    titulo: 'Como Controlar o Fluxo de Caixa',
    categoria: 'Financeiro',
    conteudo: `Aprenda a acompanhar o dinheiro do seu negocio.

---

## O que e Fluxo de Caixa?

E o controle de todas as entradas e saidas de dinheiro:
- **Entradas**: Vendas a vista, recebimento de parcelas
- **Saidas**: Compras, despesas, pagamentos

---

## Acessando o Fluxo de Caixa

1. Clique em **Financeiro** > **Fluxo de Caixa**
2. Voce vera um grafico ou tabela com:
   - Saldo do dia
   - Entradas do periodo
   - Saidas do periodo
   - Saldo acumulado

---

## Como fazer uma entrada manual?

1. No fluxo de caixa, clique em **+ Nova Entrada**
2. Selecione o tipo:
   - Recebimento de cliente
   - Venda a vista
   - Outro
3. Informe o valor e data
4. Salve

---

## Como fazer uma saida manual?

1. Clique em **+ Nova Saida**
2. Selecione o tipo:
   - Pagamento a fornecedor
   - Despesa operacional
   - Outro
3. Informe o valor e data
4. Salve

---

## Dica Importante

Mantenha o fluxo de caixa sempre atualizado!
Isso ajuda voce a:
- Saber se tem dinheiro para pagar fornecedores
- Planejar compras e investimentos
- Evitar surpresas no final do mes

Revise diariamente o fluxo de caixa.`,
  },
  {
    id: 'boletos',
    titulo: 'Como Gerar Boletos',
    categoria: 'Financeiro',
    conteudo: `Aprenda a emitir boletos bancarios para receber de clientes.

---

## Quando usar Boletos?

- Vendas a prazo para clientes
- Cobranca de mensalidades
- Qualquer recebimeno que precise de documento

---

## Como gerar um boleto?

1. Acesse **Financeiro** > **Boletos**
2. Clique em **+ Novo Boleto**
3. Selecione a **Conta a Receber** (ou crie uma)
4. Escolha o **banco**
5. Informe:
   - Numero do boleto
   - Data de vencimento
   - Valor
   - Instrucoes (juros, multa, etc)
6. Clique em **Gerar**

---

## Imprimindo o Boleto

1. Na lista de boletos, clique em **Imprimir**
2. Abre-se o boleto em PDF
3. Imprima ou envie por e-mail ao cliente

---

## Baixando um Boleto (Recebimento)

1. Quando o cliente pagar
2. Marque o bolo como "Pago"
3. O sistema registra no fluxo de caixa
4. Atualiza o status da conta a receber

---

## Configuracao de Bancos

Antes de gerar boletos, cadastre os bancos em **Configuracoes** > **Bancos**:
- Nome do banco
- Codigo do banco
- Carteira
- Convênio

---

## Dica

Mantenha os dados bancarios atualizados.
Em caso de duvidas sobre configuracao, consulte seu banco.`,
  },
  {
    id: 'orcamentos',
    titulo: 'Como Fazer Orcamentos',
    categoria: 'Vendas',
    conteudo: `Aprenda a criar propostas comerciais para seus clientes.

---

## O que e um Orcamento?

E uma proposta de venda enviada ao cliente antes da confirmacao do pedido.
O cliente pode aceitar, negociar ou recusar.

---

## Criando um Orcamento

1. Clique em **Vendas** > **Orcamentos**
2. Clique em **+ Novo Orcamento**
3. Preencha:
   - **Cliente**: Selecione o cliente
   - **Validade**: Data limite para aceitar
   - **Vendedor**: Quem esta atendendo
4. Adicione os produtos:
   - Produto
   - Quantidade
   - Preco
   - Desconto (se houver)
5. Salve

---

## Enviando ao Cliente

1. Apos salvar, clique em **Imprimir** ou **Enviar por E-mail**
2. O cliente recebe o orcamento

---

## Status do Orcamento

- **Aberto**: Aguardando resposta
- **Aprovado**: Cliente aceitou
- **Reprovado**: Cliente recusou
- **Expirado**: Passou da validade
- **Convertido**: Virou pedido de venda

---

## Convertendo em Pedido

Se o cliente aprovar:
1. Abra o orcamento
2. Clique em **Converter em Pedido**
3. O sistema cria um pedido de venda automaticamente
4. Continue com o fluxo normal de venda

---

## Dica

Defina uma validade curta (7 a 15 dias) para criar senso de urgencia.
Acompanhe os orcamentos pendentes semanalmente.`,
  },
  {
    id: 'pdv',
    titulo: 'Como Usar o PDV (Frente de Loja)',
    categoria: 'Vendas',
    conteudo: `Aprenda a usar o ponto de venda para vender no balcao.

---

## O que e PDV?

PDV (Ponto de Venda) e a tela de vendas rapida, usada em lojas fisicas.

---

## Abrindo o Caixa

1. Clique em **Vendas** > **PDV**
2. Se for a primeira venda do dia, abra o caixa:
   - Informe o operador
   - Informe o saldo inicial (dinheiro no caixa)
   - Clique em "Abrir Caixa"

---

## Fazendo uma Venda

1. Na tela do PDV:
   - Digite o codigo de barras do produto OU
   - Busque pelo nome no campo de busca
2. O produto aparece na lista
3. Para alterar quantidade, use +/-
4. Repita para outros produtos

---

## Finalizando a Venda

1. Clique em **Finalizar**
2. Escolha a forma de pagamento:
   - **Dinheiro**: Informe valor pago e troco e calculado
   - **Debito**: Maquina do banco
   - **Credito**: Maquina do banco
   - **Pix**: QR Code ou chave
3. Clique em **Confirmar**
4. O cupom fiscal e impresso automaticamente

---

## Cancelando uma Venda

Se precisar cancelar (mesmo dia):
1. Na lista de vendas, localize
2. Clique em **Cancelar**
3. Confirme o motivo
4. O estoque e ajustado automaticamente

---

## Fechando o Caixa

No final do dia:
1. Clique em **Fechar Caixa**
2. O sistema mostra o total de vendas
3. Informe o valor em dinheiro no caixa
4. Imprima o relatorio
5. Faca a sangria (retirada de dinheiro) se necessario

---

## Dica

Mantenha o leitor de codigo de barras conectado para agilidade.
Deixe produtos mais vendidos em destaque na tela inicial.`,
  },
  {
    id: 'inventario',
    titulo: 'Como Fazer Inventario',
    categoria: 'Estoque',
    conteudo: `Aprenda a fazer contagem fisica do estoque.

---

## O que e Inventario?

Inventario e a contagem fisica dos produtos para verificar se o estoque esta correto.

---

## Quando fazer?

- Uma vez por mes
- Ao perceber diferencas
- No final do ano (obrigatorio para algumas empresas)

---

## Criando um Inventario

1. Clique em **Estoque** > **Inventario**
2. Clique em **+ Novo Inventario**
3. Selecione:
   - **Tipo**: Geral (todos produtos) ou Parcial (alguns)
   - **Data**: Data da contagem
   - **Filial**: Estoque a contatar
4. Salve

O sistema carrega todos os produtos com a quantidade atual.

---

## Realizando a Contagem

1. Na lista de produtos:
   - Conte fisicamente cada item
   - Digite a quantidade contada no campo
2. Marque como "Contado"
3. Repita para todos os produtos

---

## Verificando Diferencas

Apos contar:
1. Clique em "Verificar Diferencas"
2. O sistema mostra:
   - Produtos com diferenca (sobrou/faltou)
   - Quantidade no sistema vs. contada

---

## Conciliando (Ajustando)

Se quiser corrigir o estoque:
1. Selecione os produtos com diferenca
2. Clique em **Conciliar**
3. Escolha "Ajustar Estoque"
4. O sistema atualiza as quantidades

---

## Dica

Faca a contagem com calma, preferencialmente em dupla.
Anote as diferencas antes de conciliar para investigar causas.`,
  },
  {
    id: 'usuarios',
    titulo: 'Como Gerenciar Usuarios',
    categoria: 'Sistema',
    conteudo: `Aprenda a criar e gerenciar usuarios do sistema.

---

## Tipos de Usuario

- **Administrador**: Acesso total ao sistema
- **Operador**: Acesso limitado as funcoes do dia a dia
- **Visualizador**: Apenas consulta (sem alteracoes)

---

## Criando um Novo Usuario

1. Clique em **Gestao** > **Usuarios**
2. Clique em **+ Novo Usuario**
3. Preencha:
   - **Nome**: Nome completo
   - **Login**: Nome para acessar (ex: joao.silva)
   - **Senha**: Senha de acesso
   - **Perfil**: Tipo de acesso
4. Salve

---

## Alterando Senha

1. O proprio usuario pode alterar:
   - Clique no seu nome no canto superior direito
   - Selecione "Alterar Senha"
   - Digite a senha atual e a nova
2. O administrador tambem pode redefinir senhas

---

## Permissoes de Acesso

Cada perfil tem permissoes diferentes:
- **Administrador**: Tudo
- **Gerente**: Vendas, estoque, financeiro
- **Operador**: Apenas vendas e PDV
- **Contador**: Apenas relatorios

---

## Dica de Seguranca

- Use senhas fortes (minimo 8 caracteres com letras e numeros)
- Nao compartilhe sua senha
- Altere a senha periodicamente
- Cada usuario deve ter seu proprio login`,
  },
  {
    id: 'parametros',
    titulo: 'Configuracoes do Sistema',
    categoria: 'Sistema',
    conteudo: `Aprenda a configurar o sistema.

---

## Acessando Parametros

1. Clique em **Gestao** > **Parametros**
2. Voce vera categorias de configuracoes

---

## Parametros Importantes

### Gerais
- **Nome da Empresa**: Aparece nos documentos
- **CNPJ**: Para notas fiscais
- **Inscricao Estadual**: Para notas fiscais

### Vendas
- **Permitir Desconto**: Se vendedores podem dar desconto
- **Bloqueio sem Estoque**: Impedir venda se nao tiver produto

### Fiscal
- **Ambiente NF-e**: 1-Producao ou 2-Homologacao
- **Serie**: Numero de serie das notas

### Financeiro
- **Dias para Vencer**: Padrao de vencimento
- **Juros Mora**: Percentual de juros por atraso
- **Multa**: Percentual de multa

---

## Alterando Parametros

1. Localize o parametro
2. Clique para editar
3. Altere o valor
4. Salve

---

## Cuidado!

Algumas alteracoes podem afetar o funcionamento:
- Altere apenas o que entender
- Em duvida, consulte o administrador ou fornecedor

---

## Dica

Mantenha os dados fiscais sempre atualizados.
Revise os parametros mensalmente.`,
  },
  {
    id: 'reforma-tributaria',
    titulo: 'Reforma Tributaria 2026 - O que Mudou',
    categoria: 'Fiscal',
    conteudo: `Entenda as mudancas fiscais de 2026.

---

## O que mudou?

Em 2026, o Brasil adotou um novo sistema de impostos:
- CBS (Contribuicao sobre Bens e Servicos) - Federal
- IBS (Imposto sobre Bens e Servicos) - Estadual/Municipal

---

## O que o ERPoraqui faz?

O sistema ja esta preparado para calcular automaticamente:
- CBS: 0,9%
- IBS: 0,1%
- Total: 1,0%

Estes valores aparecem automaticamente nas notas fiscais.

---

## O que voce precisa fazer?

1. **Verificar notas fiscais**: Ao emitir, conferir os valores de CBS e IBS
2. **Produtos sujeitos ao Imposto Seletivo**: Se vender cigarros, bebidas alcoholicas, etc, informe a aliquota IS no produto

---

## Perguntas Frequentes

**Preciso fazer algo diferente?**

Nao! O sistema faz tudo automaticamente. Apenas verifique os valores ao Emitir notas.

**Houve aumento de impostos?**

Nao em 2026. O valor de 1% e compensado com os impostos atuais.

**E em 2027?**

A CBS tera aliquota maior. O sistema sera atualizado automaticamente.

---

## Mais Informacoes

Consulte o help do sistema em **Ajuda** > **Reforma Tributaria 2026** para detalhes tecnicos.`,
  },
  {
    id: 'problemas-comuns',
    titulo: 'Problemas e Solucoes',
    categoria: 'Ajuda',
    conteudo: `Solucoes para problemas mais comuns do dia a dia.

---

## Login e Acesso

### Nao consigo fazer login
- Verifique se o Caps Lock esta ligado
- Confirme usuario e senha
- Entre em contato com o administrador

### Esqueci a senha
- Clique em "Esqueci minha senha"
- Ou pea ao administrador para redefinir

---

## Vendas e PDV

### Produto nao aparece na busca
- Verifique se o produto esta cadastrado
- Ou cadastre o produto primeiro

### Leitor de codigo de barras nao funciona
- Verifique se esta conectado ao computador
- Clique no campo de codigo de barras
- Teste digitando o codigo manualmente

### PDV nao abre
- Verifique a conexao com a impressora
- Ou use modo nao-fiscal temporariamente

---

## Notas Fiscais

### Nota fiscal rejeitada
- Verifique CPF/CNPJ do cliente
- Confirme NCM dos produtos
- Veja a mensagem de erro e corrija
- Em caso de duvida, consulte contador

### Certificado digital expirado
- Renove o certificado com a autoridade certificadora
- Atualize no sistema em Configuracoes

---

## Estoque

### Estoque negativo (numero negativo)
- Faca um inventario para corrigir
- Verifique vendas canceladas
- Revise entradas e saidas

### Produto sem quantidade
- Faca uma entrada de mercadoria
- Cadastre o produto com quantidade inicial

---

## Financeiro

### Conta nao aparece como paga
- Marque a baixa manualmente
- Ou verifique se o recebimento foi registrado

### Fluxo de caixa errado
- Verifique se todas as operacoes foram registradas
- Make sure entradas e saidas manuais foram feitas

---

## Dica Geral

Em erros persistentes:
1. Anote o que fez antes do problema
2. Tire um print da tela de erro
3. Entre em contato com o suporte tecnico`,
  },
  {
    id: 'atalhos',
    titulo: 'Atalhos e Dicas',
    categoria: 'Dicas',
    conteudo: `Dicas para usar o sistema mais rapido.

---

## Atalhos do Teclado

- **Ctrl + F**: Buscar em qualquer lista
- **Enter**: Confirmar formularios
- **Tab**: Ir para o proximo campo
- **Esc**: Cancelar / Fechar janelas

---

## Dicas de Produtividade

### Cadastros
- Use o codigo de barras para produtos
- Cadastre clientes com CPF/CNPJ correto

### Vendas
- Produtos mais vendidos aparecem primeiro
- Use o PDV para vendas rapidas

### Notas Fiscais
- Emita notas imediatamente apos a venda
- Envie por e-mail automaticamente

### Financeiro
- Registre recebimentos no mesmo dia
- Revise o fluxo de caixa diariamente

---

## Boas Praticas

1. **Diariamente**:
   - Verificar contas a receber vencidas
   - Atualizar fluxo de caixa
   - Confeer ventas do dia

2. **Semanalmente**:
   - Acompanhar orcamentos pendentes
   - Verificar estoque baixo
   - Revisar notas fiscais

3. **Mensalmente**:
   - Fazer inventario
   - Fechar caixa
   - Gerar relatorios

---

## Mantenha seus Dados Atualizados

- Cadastre novos produtos rapidamente
- Atualize precos de custo
- Mantenha dados de clientes atualizados

---

## Sugestoes?

O sistema esta em constante melhoria.
Envie sugestoes para o departamento de TI ou suporte.`,
  },
];

const categorias = [...new Set(itensManual.map((item) => item.categoria))];

function ManualPage() {
  const [itemSelecionado, setItemSelecionado] = useState<AjudaItem | null>(itensManual[0]);
  const [busca, setBusca] = useState('');
  const [copiado, setCopiado] = useState<string | null>(null);

  const itensFiltrados = itensManual.filter(
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
            Manual do Usuario
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Guia passo a passo
          </p>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar no manual..."
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
                      Exemplos Praticos
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
                  const idx = itensManual.findIndex((i) => i.id === itemSelecionado.id);
                  if (idx > 0) setItemSelecionado(itensManual[idx - 1]);
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                ← Anterior
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const idx = itensManual.findIndex((i) => i.id === itemSelecionado.id);
                  if (idx < itensManual.length - 1) setItemSelecionado(itensManual[idx + 1]);
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

export default ManualPage;
