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

### Preenchendo os Dados do Pedido

3. **Cliente**: Comece a digitar nome, CPF ou CNPJ no campo de busca. Selecione o cliente na lista.
4. **Vendedor** (opcional): Busque pelo nome do vendedor responsavel.
5. **Transportadora** (opcional): Busque pelo nome ou CNPJ da transportadora.
6. **Data de Entrega** (opcional): Informe a data prevista para entrega.

### Adicionando Itens

7. Clique em **Adicionar Item** para incluir um produto:
   - Busque o produto pelo nome ou codigo de barras
   - O sistema exibe cards com nome, preco, estoque, codigo de barras e NCM
   - Informe a quantidade, valor unitario e desconto (se houver)
   - O total do item e calculado automaticamente
8. Repita para adicionar mais itens

### Condicao de Pagamento e Valores

9. Escolha a **condicao de pagamento**:
   - **A Vista**: pagamento unico
   - **A Prazo**: informa numero de parcelas, intervalo (dias) e primeira parcela em dias
   - **Parcelado**: define numero de parcelas, intervalo e primeira parcela
10. Ajuste os valores totais se necessario:
    - **Frete**: valor do frete (opcional)
    - **Desconto**: desconto sobre o total (opcional)
    - **Acrescimos**: taxas adicionais (opcional)
    - O sistema recalcula o total automaticamente

### Observacoes e Finalizacao

11. Preencha **observacoes** (visiveis ao cliente) e **observacoes internas** (uso da equipe)
12. Clique em **Salvar**

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
    id: 'multi-empresa',
    titulo: 'Multi-empresa - Gerenciar Multiplas Empresas',
    categoria: 'Sistema',
    conteudo: `Aprenda a gerenciar multiplas empresas no mesmo sistema.

---

## O que e Multi-empresa?

O ERPoraqui permite cadastrar mais de uma empresa (CNPJ) na mesma instalacao. Cada empresa e independente:
- **Dados separados**: Cada empresa tem seus proprios clientes, produtos, vendas
- **Login unico**: Voce acessa todas as empresas com o mesmo usuario
- **Troca rapida**: Altere entre empresas sem sair do sistema

---

## Alternando entre Empresas

1. Clique no nome da empresa no canto superior direito
2. Selecione "Trocar Empresa"
3. Escolha a empresa desejada
4. O sistema recarrega com os dados da nova empresa

---

## Cadastrando Nova Empresa

1. Va em **Sistema** > **Multi-empresa**
2. Clique em **+ Nova Empresa**
3. Preencha os dados:
   - **Razao Social**: Nome juridico completo
   - **Nome Fantasia**: Nome comercial
   - **CNPJ**: Cadastro Nacional da Pessoa Juridica
   - **Inscricao Estadual**: Para notas fiscais
   - **Regime Tributario**: Simples Nacional, Lucro Presumido, Lucro Real
4. Clique em **Salvar**

---

## Filiais

Cada empresa pode ter filiais:
1. Dentro da empresa, va em **Filiais**
2. Clique em **+ Nova Filial**
3. Informe os dados da filial
4. Defina se e matriz ou filial

---

## Licencas

Cada empresa precisa de uma licenca para funcionar:
- Licencas sao gerenciadas pelo administrador
- Contate o suporte para contratar novos modulos`,
  },
  {
    id: 'crm-uso',
    titulo: 'Como Usar o CRM',
    categoria: 'Vendas',
    conteudo: `Aprenda a usar o CRM para gerenciar relacionamento com clientes.

---

## O que e CRM?

CRM (Customer Relationship Management) e o modulo para acompanhar:
- **Leads**: Potenciais clientes em negociacao
- **Oportunidades**: Vendas em andamento
- **Campanhas**: Acoes de marketing
- **Historico**: Todo contato com o cliente

---

## Acessando o CRM

1. Clique em **Vendas** > **CRM**
2. Voce ve o funil de vendas:
   - **Lead**: Primeiro contato
   - **Qualificado**: Cliente com perfil adequado
   - **Proposta**: Orcamento enviado
   - **Fechado**: Venda concluida

---

## Criando um Lead

1. No CRM, clique em **+ Novo Lead**
2. Preencha:
   - **Nome**: Nome do contato
   - **Empresa**: Nome da empresa
   - **Telefone / E-mail**: Para contato
   - **Origem**: Como conheceu (site, indicacao, etc.)
3. Salve

---

## Avancando no Funil

Arraste o lead entre as etapas:
1. **Lead -> Qualificado**: Agendou reuniao
2. **Qualificado -> Proposta**: Enviou orcamento
3. **Proposta -> Fechado**: Cliente comprou

---

## Campanhas

1. Va em **CRM** > **Campanhas**
2. Clique em **+ Nova Campanha**
3. Defina:
   - **Nome**: Ex: "Promocao de Carnes"
   - **Publico**: Clientes ou leads especificos
   - **Data**: Periodo da campanha
4. Acompanhe os resultados

---

## Dica

Use o CRM diariamente para nao perder oportunidades.
Registre todo contato com o cliente no historico.`,
  },
  {
    id: 'automacao',
    titulo: 'Automacao - Regras Automaticas',
    categoria: 'Sistema',
    conteudo: `Aprenda a criar regras automaticas no sistema.

---

## O que e Automacao?

O modulo de automacao executa acoes automaticamente quando algo acontece.

---

## Exemplos de Automacao

| Disparo | Acao |
|---------|------|
| Novo cliente cadastrado | Enviar e-mail de boas-vindas |
| Venda finalizada | Enviar SMS de agradecimento |
| Conta vencendo | Disparar cobranca automatica |
| Estoque baixo | Notificar o comprador |

---

## Criando uma Regra

1. Va em **Sistema** > **Automacao**
2. Clique em **+ Nova Regra**
3. Configure:
   - **Nome**: Identificacao da regra
   - **Evento**: O que dispara (ex: "Pedido Criado")
   - **Condicao**: Filtro opcional (ex: "Valor > R$ 500")
   - **Acao**: O que fazer (ex: "Enviar E-mail")
4. Ative a regra
5. Pronto! O sistema executa automaticamente

---

## Cuidados

- Crie regras simples no inicio
- Teste cada regra antes de ativar
- Acompanhe o log de execucao
- Regras em excesso podem deixar o sistema lento`,
  },
  {
    id: 'tabelas-preco-uso',
    titulo: 'Tabelas de Preco',
    categoria: 'Vendas',
    conteudo: `Aprenda a criar tabelas de preco diferenciadas.

---

## O que sao Tabelas de Preco?

Permitem definir precos diferentes para grupos de clientes:
- **Cliente VIP**: Preco especial
- **Atacado**: Preco por quantidade
- **Promocao**: Preco temporario

---

## Criando uma Tabela

1. Va em **Estoque** > **Tabelas de Preco**
2. Clique em **+ Nova Tabela**
3. Informe:
   - **Nome**: Ex: "Tabela Atacado"
   - **Tipo**: Percentual ou Valor Fixo
   - **Base**: Preco de venda ou custo
4. Salve

---

## Adicionando Produtos

1. Na tabela criada, clique em **Adicionar Produtos**
2. Selecione os produtos
3. Defina o ajuste de preco:
   - Acrescimo ou desconto percentual
   - Ou valor fixo
4. Salve

---

## Usando nas Vendas

Ao fazer um orcamento ou pedido:
1. Selecione o cliente
2. Escolha a tabela de preco
3. Os precos sao calculados automaticamente`,
  },
  {
    id: 'variacoes-lotes',
    titulo: 'Variacoes e Lotes de Produtos',
    categoria: 'Estoque',
    conteudo: `Aprenda a usar variacoes e lotes para controle avancado.

---

## Variacoes de Produto

Usado quando um produto tem versoes diferentes:
- **Exemplo**: Camiseta nas cores P, M, G
- **Exemplo**: Calcados nos tamanhos 38, 39, 40

### Como criar variacoes?

1. Cadastre o **produto base** (ex: "Camiseta")
2. Va em **Estoque** > **Variacoes**
3. Selecione o produto
4. Adicione variacoes:
   - **Tamanho**: P, M, G
   - **Cor**: Vermelho, Azul
5. Cada variacao tem precos e estoque proprios

---

## Lotes de Produto

Usado para rastrear lotes por data de fabricacao:
- **Exemplo**: Medicamentos com data de validade
- **Exemplo**: Alimentos com lote do fabricante

### Como gerenciar lotes?

1. Va em **Estoque** > **Lotes**
2. Selecione o produto
3. Cadastre:
   - **Numero do Lote**: Fornecido pelo fabricante
   - **Data de Fabricacao**
   - **Data de Validade**
   - **Quantidade**
4. Na venda, o sistema pergunta qual lote usar

---

## Dicas

- Use variacoes para produtos com versoes
- Use lotes para controle de validade
- Ambos podem ser usados juntos
- O estoque e controlado automaticamente por variacao/lote`,
  },
  {
    id: 'cheques-uso',
    titulo: 'Gerenciamento de Cheques',
    categoria: 'Financeiro',
    conteudo: `Aprenda a controlar cheques recebidos e emitidos.

---

## Tipos de Cheques

- **Cheque Recebido**: De clientes como pagamento
- **Cheque Emitido**: Para pagar fornecedores

---

## Registrando um Cheque Recebido

1. Va em **Financeiro** > **Cheques**
2. Clique em **+ Novo Cheque**
3. Preencha:
   - **Cliente**: Quem emitiu o cheque
   - **Banco**: Numero do banco
   - **Agencia**: Agencia bancaria
   - **Conta**: Numero da conta
   - **Numero do Cheque**: Numeracao do cheque
   - **Valor**: Valor nominal
   - **Data de Emissao**
   - **Data de Vencimento**: Para deposito
4. Salve

---

## Acoes com Cheques

### Depositar
1. Selecione o cheque
2. Clique em **Depositar**
3. O valor entra no fluxo de caixa

### Compensar
1. Apos o banco confirmar
2. Clique em **Compensar**
3. Status muda para "Compensado"

### Devolver
1. Se o cheque voltar (sem fundos)
2. Clique em **Devolver**
3. Informe o motivo
4. A conta volta a ser devida

### Cancelar
Use para cheques extraviados ou cancelados antes do deposito`,
  },
  {
    id: 'centros-custo-uso',
    titulo: 'Centros de Custo',
    categoria: 'Financeiro',
    conteudo: `Aprenda a organizar as financas por departamento.

---

## O que sao Centros de Custo?

Centros de Custo sao categorias para agrupar receitas e despesas por departamento ou projeto:
- **Exemplos**: Administrativo, Vendas, Producao, Marketing, TI
- Ajudam a saber quanto cada area gasta e gera de receita

---

## Criando um Centro de Custo

1. Va em **Financeiro** > **Centros de Custo**
2. Clique em **+ Novo**
3. Informe:
   - **Nome**: Ex: "Departamento Comercial"
   - **Codigo**: Ex: "COM"
   - **Centro de Custo Pai**: Para hierarquia (opcional)
4. Salve

---

## Vinculando nas Operacoes

Ao criar:
- **Conta a Receber**: Selecione o centro de custo
- **Conta a Pagar**: Selecione o centro de custo
- **Lancamento no Fluxo de Caixa**: Selecione o centro

---

## Relatorios por Centro de Custo

1. Va em **Gestao** > **DRE**
2. Filtre por centro de custo
3. Veja o resultado por departamento

---

## Dica

Crie centros de custo alinhados com seu organograma.
Isso facilita a tomada de decisao e o planejamento financeiro.`,
  },
  {
    id: 'dre-uso',
    titulo: 'DRE - Demonstrativo de Resultados',
    categoria: 'Gestao',
    conteudo: `Aprenda a consultar o resultado financeiro da empresa.

---

## O que e DRE?

DRE (Demonstrativo do Resultado do Exercicio) mostra:
- **Receitas**: Total de vendas no periodo
- **Deducoes**: Impostos, devolucoes
- **Custos**: Custo das mercadorias vendidas
- **Despesas**: Gastos operacionais
- **Resultado**: Lucro ou Prejuizo

---

## Acessando o DRE

1. Va em **Gestao** > **DRE**
2. Selecione o **periodo** (mes/ano)
3. O sistema carrega automaticamente:
   - Receita Bruta
   - Dedusoes
   - Receita Liquida
   - Custos
   - Despesas
   - Resultado Liguido

---

## Exportando o DRE

1. No DRE, clique no botao **Exportar**
2. Escolha o formato:
   - **PDF**: Para apresentar
   - **Excel (XLSX)**: Para analisar
   - **CSV**: Para importar em outros sistemas
3. O arquivo e baixado automaticamente

---

## Dica

Consulte o DRE mensalmente para acompanhar a saude financeira.
Compare meses anteriores para ver a evolucao do negocio.`,
  },
  {
    id: 'nfce-uso',
    titulo: 'NFC-e - Nota Fiscal do Consumidor',
    categoria: 'Fiscal',
    conteudo: `Aprenda a emitir NFC-e para vendas ao consumidor final.

---

## O que e NFC-e?

NFC-e (Nota Fiscal do Consumidor Eletronica) substitui o cupom fiscal.
Usada em vendas para consumidor final (pessoa fisica).

---

## Diferenca entre NF-e e NFC-e

| Caracteristica | NF-e | NFC-e |
|----------------|------|-------|
| Destinatario | Pessoa Juridica | Consumidor Final |
| CPF/CNPJ | Obrigatorio | Opcional |
| DANFE | Papel A4 | Papel termico (cupom) |
| QR Code | Nao | Sim |

---

## Emitindo NFC-e

1. Va em **Fiscal** > **NFC-e**
2. Clique em **+ Nova NFC-e**
3. Selecione a **venda do PDV** ou crie manual
4. Confira os produtos
5. Clique em **Emitir**
6. A nota e enviada para a SEFAZ
7. Imprima o cupom na impressora termica

---

## QR Code

A NFC-e tem QR Code para o cliente consultar:
- O consumidor le o QR Code com o celular
- Ve a nota completa no site da SEFAZ
- Garante a autenticidade da nota`,
  },
  {
    id: 'nfse-uso',
    titulo: 'NFSe - Nota Fiscal de Servicos',
    categoria: 'Fiscal',
    conteudo: `Aprenda a emitir notas fiscais de servicos.

---

## O que e NFSe?

NFSe (Nota Fiscal de Servicos Eletronica) e usada para:
- Prestacao de servicos
- Profissionais liberais (medicos, advogados)
- Empresas de servicos (consultoria, manutencao)

---

## Emitindo NFSe

1. Va em **Fiscal** > **NFSe**
2. Clique em **+ Nova NFSe**
3. Preencha:
   - **Tomador**: Cliente do servico
   - **Descricao**: Tipo de servico
   - **Valor**: Valor do servico
   - **ISS**: Aliquota do imposto (varia por cidade)
4. Clique em **Emitir**
5. A nota e enviada para a prefeitura

---

## Diferenca para NF-e

| NF-e (Produtos) | NFSe (Servicos) |
|-----------------|-----------------|
| NCM do produto | Codigo de servico (LC 116) |
| ICMS estadual | ISS municipal |
| SEFAZ estadual | Prefeitura municipal |

---

## Dica

Verifique com seu contador a aliquota de ISS da sua cidade.
Cada municipio tem suas proprias regras.`,
  },
  {
    id: 'ecf-uso',
    titulo: 'ECF - Escrituracao Contabil Fiscal',
    categoria: 'Fiscal',
    conteudo: `Aprenda sobre a ECF e sua integracao com o sistema.

---

## O que e ECF?

ECF (Escrituracao Contabil Fiscal) e a obrigacao acessoria que substituiu a DIPJ.
Deve ser entregue anualmente a Receita Federal.

---

## O que o sistema oferece?

O ERPoraqui gera os dados necessarios para a ECF:
- **Lancamentos contabeis**: Do plano de contas
- **Saldos de contas**: Por periodo
- **Demonstrativos**: DRE e Balanco

---

## Como usar?

1. Va em **Fiscal** > **ECF**
2. Selecione o **ano-calendario**
3. Clique em **Gerar Dados**
4. O sistema compila as informacoes
5. Exporte para o formato exigido pela Receita

---

## Aviso Importante

A ECF deve ser assinada por um contador registrado no CRC.
O sistema gera os dados, mas a entrega e responsabilidade do contador.`,
  },
  {
    id: 'relatorios-fiscais-uso',
    titulo: 'Relatorios Fiscais',
    categoria: 'Fiscal',
    conteudo: `Aprenda a gerar relatorios fiscais para contabilidade.

---

## Relatorios Disponiveis

| Relatorio | Descricao |
|-----------|----------|
| SPED Fiscal | ICMS/IPI para o fisco estadual |
| SPED PIS/COFINS | Contribuicoes federais |
| Livro de Entradas | Notas de compra |
| Livro de Saidas | Notas de venda |
| Apuracao de ICMS | Calculo do imposto |

---

## Gerando um Relatorio

1. Va em **Fiscal** > **Relatorios**
2. Selecione o **tipo** de relatorio
3. Defina o **periodo** (mes/ano)
4. Escolha a **filial** (se houver)
5. Clique em **Gerar**
6. O sistema processa e exibe na tela

---

## Exportacao

Apos gerar, voce pode:
- **Visualizar** na tela
- **Exportar para PDF** para arquivar
- **Exportar para Excel** para analise
- **Exportar para CSV** para importar em outros sistemas

---

## Dica

Os relatorios fiscais sao importantes para:
- Contabilidade
- Fiscalizacao da Receita
- Tomada de decisoes
- Planejamento tributario

Consulte seu contador regularmente.`,
  },
  {
    id: 'sped-fiscal-uso',
    titulo: 'SPED Fiscal',
    categoria: 'Fiscal',
    conteudo: `## SPED Fiscal

O SPED Fiscal (Sistema Publico de Escrituracao Digital) e o arquivo digital que substitui a escrituracao fiscal em papel. Ele contem todos os registros de entrada, saida, apuracao de ICMS/IPI e inventario do periodo.

---

### Quem precisa gerar?

Todas as empresas do **regime normal (Lucro Real/Presumido)** obrigadas a escrituracao fiscal precisam entregar o SPED Fiscal mensalmente. Empresas do **Simples Nacional** podem estar dispensadas (verifique o Ato Declaratorio da SEFAZ do seu estado).

---

### Como gerar no sistema

1. **Periodo:** Va em **Fiscal > SPED Fiscal** e selecione o mes/ano desejado
2. **Blocos:** Escolha quais blocos incluir no arquivo (veja abaixo as opcoes)
3. **Ativar/Desativar:** Clique nos **cards coloridos** para ativar ou desativar cada bloco
4. **Gerar:** Apos definir os blocos, clique em **Gerar SPED**
5. **Download:** O sistema processa e disponibiliza o arquivo .txt para download

---

### Blocos Disponiveis

| Bloco | Descricao | Obrigatorio |
|-------|-----------|-------------|
| **Bloco 0** | Abertura, identificacao da empresa, contador, produtos, parceiros, unidades | Sim |
| **Bloco C** | Documentos fiscais (NF-e, NFC-e) - entradas e saidas | Sim |
| **Bloco D** | Documentos fiscais de servicos (NFSe) | Quando houver |
| **Bloco E** | Apuracao do ICMS (periodo mensal) | Sim |
| **Bloco G** | CIAP - Controle de Credito de ICMS do Ativo Permanente | Quando houver |
| **Bloco H** | Inventario fisico (estoque) | Anual |

---

### Prazo de Entrega

O SPED Fiscal deve ser entregue ate o **dia 15 do mes seguinte** ao periodo de apuracao. Se o dia 15 cair em fim de semana ou feriado, o prazo e prorrogado ao proximo dia util (conforme calendario SEFAZ).

---

### Dicas Importantes

- **Ative apenas os blocos necessarios** para gerar um arquivo mais rapido e leve
- **Clique nos cards** para ativar/desativar blocos — cards verdes estao ativos, cards cinza estao inativos
- O **Bloco 0** e sempre obrigatorio e nao pode ser desativado
- Antes de gerar, concilie o movimento do periodo no modulo **Fiscal > Movimentos**
- Em caso de erros, o sistema exibe quais registros precisam ser corrigidos`,
  },
  {
    id: 'logs-sistema',
    titulo: 'Logs do Sistema',
    categoria: 'Sistema',
    conteudo: `Aprenda a consultar os registros de atividades do sistema.

---

## O que sao Logs?

Logs registram todas as acoes importantes no sistema:
- Quem fez o que
- Quando fez
- Deu certo ou errou

---

## Acessando Logs

1. Va em **Gestao** > **Logs**
2. Voce ve uma lista com:
   - **Data/Hora**: Quando ocorreu
   - **Usuario**: Quem fez
   - **Acao**: O que foi feito
   - **Categoria**: Tipo de operacao
   - **Status**: Sucesso ou erro
   - **Detalhes**: Informacao adicional

---

## Filtrando Logs

Use os filtros para encontrar rapidamente:
- **Periodo**: Data inicial e final
- **Usuario**: Apenas de um usuario
- **Categoria**: Apenas um tipo (ex: vendas)
- **Status**: Apenas erros

---

## Por que consultar Logs?

- Descobrir quem alterou um cadastro
- Investigar erros em notas fiscais
- Auditar acoes de usuarios
- Resolver problemas tecnicos`,
  },
  {
    id: 'exportacao-relatorios',
    titulo: 'Exportacao de Relatorios',
    categoria: 'Dicas',
    conteudo: `Aprenda a exportar relatorios em varios formatos.

---

## Formatos Disponiveis

O sistema oferece 4 formatos de exportacao:

| Formato | Quando usar |
|---------|-------------|
| **CSV** | Importar em outros sistemas |
| **JSON** | Integracoes com desenvolvedores |
| **XLSX (Excel)** | Analisar dados, criar graficos |
| **PDF** | Apresentar, arquivar, imprimir |

---

## Como Exportar

1. Na pagina do relatorio (DRE, Fluxo de Caixa, Contas, etc.)
2. Clique no botao **Exportar**
3. Escolha o formato desejado
4. O arquivo e baixado automaticamente

---

## Paginas com Exportacao

- DRE (Demonstrativo de Resultados)
- Fluxo de Caixa
- Contas a Receber
- Contas a Pagar
- Relatorios Fiscais

---

## Dica

Use **PDF** para enviar relatorios formais.
Use **Excel (XLSX)** para analisar os dados com graficos e filtros.`,
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
  {
    id: 'dashboard',
    titulo: 'Dashboard - Tela Inicial',
    categoria: 'Inicio',
    conteudo: `Aprenda a usar o painel inicial do sistema.

---

## O que e o Dashboard?

O Dashboard e a primeira tela apos o login. Ele mostra indicadores importantes, graficos e atalhos.

---

## Indicadores (KPIs)

- **Vendas do Dia**: total vendido hoje
- **Contas a Receber**: em aberto
- **Contas Vencidas**: atrasadas
- **Estoque Baixo**: produtos abaixo do minimo
- **Saldo em Caixa**: dinheiro disponivel

---

## Graficos

- Vendas por periodo (7/30 dias)
- Contas a Receber vs Pagar
- Produtos mais vendidos

---

## Atalhos Rapidos

Links diretos para: Novo Pedido, Nova Conta, Novo Produto, PDV.

---

## Personalizacao

Clique em "Personalizar" para escolher quais indicadores aparecem.`,
  },
  {
    id: 'adiantamentos',
    titulo: 'Como Gerenciar Adiantamentos',
    categoria: 'Financeiro',
    conteudo: `Aprenda a controlar adiantamentos financeiros.

---

## O que sao Adiantamentos?

Valores pagos ou recebidos antes da conclusao da operacao:
- **Adiantamento a Fornecedor**: pre-pagamento de compras
- **Adiantamento de Cliente**: sinal recebido do cliente

---

## Registrando um Adiantamento

1. Va em **Financeiro** > **Adiantamentos**
2. Clique em **+ Novo Adiantamento**
3. Selecione o tipo (Cliente ou Fornecedor)
4. Escolha o cliente/fornecedor
5. Informe valor, data e descricao
6. Salve

---

## Baixando o Adiantamento

1. Na lista, clique em **Baixar**
2. Vincule a conta a receber/pagar
3. Confirme

---

## Dica

Registre todo adiantamento para controle financeiro preciso.`,
  },
  {
    id: 'quitacoes',
    titulo: 'Quitacoes em Lote',
    categoria: 'Financeiro',
    conteudo: `Aprenda a quitar multiplas contas de uma vez.

---

## O que e Quitacao em Lote?

Permite baixar varias contas a receber ou a pagar simultaneamente.

---

## Quando usar?

- Fechamento do caixa do PDV
- Pagamento de varias faturas do mesmo fornecedor
- Conciliacao bancaria

---

## Passo a Passo

1. Va em **Financeiro** > **Quitacoes**
2. Selecione a aba Contas a Receber ou Contas a Pagar
3. Filtre as contas desejadas
4. Marque as contas (checkbox)
5. Clique em **Quitar Selecionadas**
6. Escolha a forma de pagamento
7. Confirme

---

## Dica

Use filtros para nao quitar contas erradas. Quitacoes sao irreversiveis.`,
  },
  {
    id: 'conciliacao-bancaria',
    titulo: 'Conciliacao Bancaria',
    categoria: 'Financeiro',
    conteudo: `Aprenda a conciliar o extrato bancario com o sistema.

---

## O que e?

Compara os lancamentos do banco com as contas registradas no sistema para identificar divergencias.

---

## Passo a Passo

1. Va em **Financeiro** > **Conciliacao Bancaria**
2. Importe o extrato (OFX, CSV ou XLSX)
3. O sistema sugere correspondencias
4. Arraste lancamentos para conciliar manualmente
5. Finalize o periodo

---

## Divergencias Comuns

- **Tarifa bancaria**: crie uma conta a pagar avulsa
- **Lancamento sem correspondencia**: investigue
- **Valor diferente**: verifique juros/multas

---

## Dica

Concilie semanalmente para evitar acumulo de trabalho no fim do mes.`,
  },
  {
    id: 'renegociacao-manual',
    titulo: 'Renegociacao de Contas',
    categoria: 'Financeiro',
    conteudo: `Aprenda a renegociar contas a receber e a pagar.

---

## O que e?

Permite renegociar contas em aberto ou vencidas, aplicando descontos, juros e parcelamento.

---

## Passo a Passo

1. Va em **Financeiro** > **Renegociacao**
2. Clique em **+ Nova Renegociacao**
3. Selecione tipo (Receber ou Pagar) e cliente/fornecedor
4. Escolha as contas
5. Defina descontos, juros, multa e parcelas
6. Revise o preview
7. Crie e depois confirme

---

## Status

- **Pendente**: aguardando confirmacao
- **Confirmada**: novas contas geradas
- **Cancelada**: renegociacao desfeita

---

## Dica

Ofereca desconto para pagamento a vista em vez de parcelar.`,
  },
  {
    id: 'kardex',
    titulo: 'Kardex - Ficha de Estoque',
    categoria: 'Estoque',
    conteudo: `Aprenda a consultar o historico de movimentacoes dos produtos.

---

## O que e Kardex?

Registro detalhado de todas as movimentacoes de cada produto: entradas, saidas e saldo acumulado.

---

## Acessando o Kardex

1. Va em **Estoque** > **Kardex**
2. Selecione o produto
3. Defina o periodo
4. Visualize todas as movimentacoes

---

## Informacoes Exibidas

- Data da movimentacao
- Tipo (Compra, Venda, Devolucao, Ajuste)
- Documento vinculado
- Quantidade de entrada e saida
- Saldo atual

---

## Exportacao

Clique em **Exportar** para CSV ou PDF.

---

## Dica

Consulte o Kardex sempre que desconfiar de divergencia no estoque.`,
  },
  {
    id: 'cte-uso',
    titulo: 'CT-e - Conhecimento de Transporte',
    categoria: 'Fiscal',
    conteudo: `Aprenda a emitir Conhecimento de Transporte Eletronico.

---

## O que e CT-e?

Documento fiscal digital (modelo 57) obrigatorio para contratacao de servico de transporte de cargas.

---

## Quando emitir?

- Transporte de carga entre filiais
- Venda com frete contratado
- Devolucao com transporte
- Transporte interestadual

---

## Passo a Passo

1. Va em **Fiscal** > **CT-e**
2. Clique em **+ Novo CT-e**
3. Selecione tomador e destinatario
4. Vincule as NF-e transportadas
5. Informe veiculo e condutor
6. Informe valores (frete, pedagio)
7. Salve e transmita para SEFAZ

---

## Encerramento

Apos o transporte, encerre o CT-e.

---

## Dica

Sempre vincule as NF-e corretas — CT-e com documento errado gera multa.`,
  },
  {
    id: 'licitacoes-uso',
    titulo: 'Licitacoes',
    categoria: 'Vendas',
    conteudo: `Aprenda a gerenciar participacao em processos licitatorios.

---

## O que sao Licitacoes?

Processos pelos quais orgaos publicos compram produtos ou servicos. Sua empresa participa como fornecedora.

---

## Passo a Passo

1. Va em **Vendas** > **Licitacoes**
2. Clique em **+ Nova Licitacao**
3. Preencha: numero/ano, orgao, modalidade, objeto
4. Adicione os itens do edital
5. Acompanhe o status: Rascunho, Publicada, Em Andamento
6. Registre o resultado (Venceu/Perdeu)

---

## Modalidades

- Pregao, Concorrencia, Tomada de Precos, Convite, Concurso

---

## Dica

Documente tudo e anexe o edital em PDF para consulta futura.`,
  },
  {
    id: 'convenios-uso',
    titulo: 'Convenios',
    categoria: 'Vendas',
    conteudo: `Aprenda a gerenciar convenios e parcerias.

---

## O que sao Convenios?

Acordos com clientes, fornecedores ou instituicoes para descontos especiais ou condicoes diferenciadas.

---

## Tipos

- Comercial, Governamental, Institucional, Fornecedor

---

## Passo a Passo

1. Va em **Vendas** > **Convenios**
2. Clique em **+ Novo Convenio**
3. Selecione o parceiro (lookup)
4. Informe vigencia, tipo e descricao
5. Defina descontos e condicoes de pagamento
6. Salve

---

## Aplicacao nas Vendas

Ao criar pedido para cliente com convenio, o sistema aplica automaticamente os descontos configurados.

---

## Dica

Mantenha prazos de vigencia atualizados para nao aplicar beneficios vencidos.`,
  },
  {
    id: 'promocoes-uso',
    titulo: 'Promocoes',
    categoria: 'Vendas',
    conteudo: `Aprenda a criar ofertas temporarias com precos especiais.

---

## Tipos de Promocao

- **Percentual**: desconto % sobre o preco
- **Valor Fixo**: preco promocional definido
- **Leve X Pague Y**: compre quantidade, ganhe desconto

---

## Passo a Passo

1. Va em **Estoque** > **Promocoes**
2. Clique em **+ Nova Promocao**
3. Defina nome, tipo e periodo de vigencia
4. Selecione os produtos participantes
5. Configure valores
6. Ative a promocao

---

## Funcionamento

- So e aplicada dentro do periodo definido
- Fora do periodo, o preco normal e restaurado
- Em caso de conflito, maior desconto prevalece

---

## Dica

Planeje com antecedencia e teste antes de ativar para o publico.`,
  },
  {
    id: 'contratos-manual',
    titulo: 'Contratos',
    categoria: 'Vendas',
    conteudo: `Aprenda a gerenciar contratos de servicos e planos recorrentes.

---

## Ciclo de Vida

Rascunho → Ativo → Suspenso → Encerrado

---

## Passo a Passo

1. Va em **Vendas** > **Contratos**
2. Clique em **+ Novo Contrato**
3. Selecione cliente, vigencia e tipo de reajuste
4. Defina os servicos e valores
5. Ative o contrato

---

## Medicoes

Para contratos ativos, crie medicoes mensais:
1. No contrato, va em medicoes
2. Clique em **+ Nova Medicao**
3. Informe o periodo e valor medido
4. Fatore para gerar pedido

---

## Dica

Configure o tipo de reajuste (IGPM, IPCA) para correcao automatica.`,
  },
  {
    id: 'garantias-manual',
    titulo: 'Garantias',
    categoria: 'Vendas',
    conteudo: `Aprenda a controlar garantias de produtos vendidos.

---

## Tipos de Garantia

- **Fabrica**: garantia original do fabricante
- **Estendida**: garantia adicional contratada
- **Legal**: garantia obrigatoria por lei

---

## Passo a Passo

1. Va em **Vendas** > **Garantias**
2. Clique em **+ Nova Garantia**
3. Selecione o produto e cliente
4. Defina o prazo e tipo
5. Salve

---

## Regras de Elegibilidade

Configure regras por produto ou categoria:
- Prazo padrao
- Cobertura
- Termos e condicoes

---

## Status

Ativa, Expirada, Cancelada, Acionada

---

## Dica

Configure regras de elegibilidade para verificar automaticamente se o produto esta na garantia.`,
  },
  {
    id: 'devolucoes-manual',
    titulo: 'Devolucoes / RMA',
    categoria: 'Vendas',
    conteudo: `Aprenda a gerenciar devolucoes de produtos.

---

## Fluxo RMA

Solicitacao → Inspecao → Aprovacao/Rejeicao → Destinacao

---

## Motivos de Devolucao

- Defeito, Troca, Arrependimento, Avaria

---

## Passo a Passo

1. Va em **Vendas** > **Devolucoes**
2. Clique em **+ Nova Devolucao**
3. Selecione o cliente e produto
4. Informe motivo e quantidade
5. Registre a inspecao
6. Aprove ou rejeite
7. Defina a destinacao

---

## Destinos

- **Reparo**: produto vai para assistencia
- **Substituicao**: gera nova NF-e
- **Credito**: credito em conta
- **Descarte**: produto sem condicao de uso

---

## Dica

Sempre registre fotos na inspecao para documentacao.`,
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
