-- CreateEnum
CREATE TYPE "PerfilUsuario" AS ENUM ('ADMINISTRADOR', 'GERENTE', 'USUARIO', 'VISUALIZADOR');

-- CreateEnum
CREATE TYPE "RegimeTributario" AS ENUM ('SIMPLES_NACIONAL', 'LUCRO_PRESUMIDO', 'LUCRO_REAL', 'ISENTO');

-- CreateEnum
CREATE TYPE "TipoPessoa" AS ENUM ('FISICA', 'JURIDICA');

-- CreateEnum
CREATE TYPE "OrigemMercadoria" AS ENUM ('NACIONAL', 'ESTRANGEIRA_IMPORTACAO_DIRETA', 'ESTRANGEIRA_NACIONALIZADA');

-- CreateEnum
CREATE TYPE "TipoOperacao" AS ENUM ('VENDA', 'DEVOLUCAO', 'CONSIGNACAO', 'REMESSA');

-- CreateEnum
CREATE TYPE "SituacaoPedido" AS ENUM ('EM_ABERTO', 'CONFIRMADO', 'EM_PRODUCAO', 'ENVIADO', 'ENTREGUE', 'CANCELADO');

-- CreateEnum
CREATE TYPE "SituacaoOrcamento" AS ENUM ('ABERTO', 'APROVADO', 'REPROVADO', 'EXPIRADO', 'CONVERTIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "SituacaoCotacao" AS ENUM ('ABERTA', 'ENVIADA', 'RESPONDIDA', 'APROVADA', 'REPROVADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "SituacaoEntrada" AS ENUM ('PENDENTE', 'EM_RECEBIMENTO', 'RECEBIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoParametro" AS ENUM ('TEXTO', 'NUMERO', 'BOOLEANO', 'DATA', 'JSON');

-- CreateEnum
CREATE TYPE "ModuloSistema" AS ENUM ('GERAL', 'CADASTROS', 'VENDAS', 'COMPRAS', 'ESTOQUE', 'FINANCEIRO', 'FISCAL', 'NF_E', 'RELATORIOS');

-- CreateEnum
CREATE TYPE "TipoMovimentacao" AS ENUM ('ENTRADA', 'SAIDA', 'TRANSFERENCIA', 'AJUSTE', 'DEVOLUCAO');

-- CreateEnum
CREATE TYPE "SituacaoBoleto" AS ENUM ('EMITIDO', 'ENVIADO', 'BAIXADO', 'BAIXADO_MANUALMENTE', 'CANCELADO', 'VENCIDO', 'PROTESTADO', 'CARTA_CORRECAO');

-- CreateEnum
CREATE TYPE "SituacaoVendaPDV" AS ENUM ('ABERTA', 'FINALIZADA', 'CANCELADA', 'ESTORNADA');

-- CreateEnum
CREATE TYPE "FormaPagamentoPDV" AS ENUM ('DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_CREDITO_PARCELADO', 'CARTAO_DEBITO', 'BOLETO', 'CHEQUE', 'CREDITO_LOJA');

-- CreateEnum
CREATE TYPE "SituacaoCaixa" AS ENUM ('ABERTO', 'FECHADO', 'FECHADO_CONFERIDO');

-- CreateEnum
CREATE TYPE "SituacaoConta" AS ENUM ('ABERTA', 'PAGO', 'VENCIDO', 'CANCELADO', 'BAIXADO', 'RENEGOCIADO');

-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'BOLETO', 'TRANSFERENCIA', 'CHEQUE');

-- CreateEnum
CREATE TYPE "TipoContaBancaria" AS ENUM ('CORRENTE', 'POUPANCA', 'INVESTIMENTO');

-- CreateEnum
CREATE TYPE "TipoMovimentoBancario" AS ENUM ('CREDITO', 'DEBITO');

-- CreateEnum
CREATE TYPE "TipoCheque" AS ENUM ('RECEBIDO', 'EMITIDO');

-- CreateEnum
CREATE TYPE "SituacaoCheque" AS ENUM ('EM_CARTEIRA', 'DEPOSITADO', 'COMPENSADO', 'DEVOLVIDO', 'REPASSADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoFluxoCaixa" AS ENUM ('ENTRADA', 'SAIDA');

-- CreateEnum
CREATE TYPE "TipoDocumentoNF" AS ENUM ('ENTRADA', 'SAIDA');

-- CreateEnum
CREATE TYPE "ModeloNF" AS ENUM ('NFE', 'NFCE', 'NFS_E');

-- CreateEnum
CREATE TYPE "TipoOperacaoNF" AS ENUM ('OPERACAO_INTERNA', 'OPERACAO_INTERESTADUAL', 'OPERACAO_EXTERIOR');

-- CreateEnum
CREATE TYPE "FinalidadeNF" AS ENUM ('NORMAL', 'COMPLEMENTAR', 'AJUSTE', 'DEVOLUCAO');

-- CreateEnum
CREATE TYPE "SituacaoNF" AS ENUM ('EM_DIGITACAO', 'EM_PROCESSAMENTO', 'ASSINADA', 'ENVIADA', 'AUTORIZADA', 'DENEGADA', 'CANCELADA', 'INUTILIZADA', 'CONTINGENCIA');

-- CreateEnum
CREATE TYPE "TipoEventoNF" AS ENUM ('CANCELAMENTO', 'CARTA_CORRECAO', 'CONFIRMACAO_OPERACAO', 'CONFIRMACAO_OPERACAO_EPEC', 'EPEC', 'MANIFESTACAO_CONFIRMACAO', 'MANIFESTACAO_DESCONHECIDO', 'MANIFESTACAO_NEGADO', 'PEDIDO_PRERROGATIVA_EMBRULHO', 'REGISTRO_SAIDA', 'REGISTRO_ENTRADA');

-- CreateEnum
CREATE TYPE "AmbienteNF" AS ENUM ('PRODUCAO', 'HOMOLOGACAO');

-- CreateEnum
CREATE TYPE "PadraoNF" AS ENUM ('NFE_V4', 'NFCE_V4');

-- CreateEnum
CREATE TYPE "SituacaoSped" AS ENUM ('PENDENTE', 'EM_GERACAO', 'GERADO', 'ENVIADO', 'RECUSADO', 'ACEITO');

-- CreateEnum
CREATE TYPE "TipoInventario" AS ENUM ('ANUAL', 'MENSAL', 'ROTATIVO', 'EXTRAORDINARIO');

-- CreateEnum
CREATE TYPE "SituacaoInventario" AS ENUM ('ABERTO', 'EM_CONFERENCIA', 'CONCLUIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "SituacaoItemInventario" AS ENUM ('PENDENTE', 'CONTADO', 'CONCILIADO', 'AJUSTADO');

-- CreateEnum
CREATE TYPE "TipoConta" AS ENUM ('SINTETICA', 'ANALITICA');

-- CreateEnum
CREATE TYPE "NaturezaConta" AS ENUM ('CREDORA', 'DEVEDORA');

-- CreateEnum
CREATE TYPE "NaturezaCredito" AS ENUM ('CREDORA', 'DEVEDORA');

-- CreateEnum
CREATE TYPE "TipoLancamento" AS ENUM ('DEBITO', 'CREDITO');

-- CreateEnum
CREATE TYPE "SituacaoReducaoZ" AS ENUM ('ABERTA', 'FECHADA', 'ENVIADA');

-- CreateEnum
CREATE TYPE "SituacaoCupom" AS ENUM ('ABERTO', 'FINALIZADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "FormaPagamentoECF" AS ENUM ('DINHEIRO', 'CHEQUE', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'VALE', 'OUTROS');

-- CreateEnum
CREATE TYPE "TipoSuprimento" AS ENUM ('SUPRIMENTO', 'REFORCO');

-- CreateEnum
CREATE TYPE "SituacaoNFSe" AS ENUM ('EM_DIGITACAO', 'ASSINADA', 'ENVIADA', 'AUTORIZADA', 'CANCELADA', 'DENEGADA', 'PROCESSANDO');

-- CreateEnum
CREATE TYPE "TipoRps" AS ENUM ('RPS', 'RPS_CONJUGADO', 'CUPOM');

-- CreateEnum
CREATE TYPE "SituacaoContrato" AS ENUM ('RASCUNHO', 'ATIVO', 'SUSPENSO', 'ENCERRADO');

-- CreateEnum
CREATE TYPE "TipoReajuste" AS ENUM ('IGPM', 'IPCA', 'INCC', 'NF', 'NENHUM');

-- CreateEnum
CREATE TYPE "DevolucaoStatus" AS ENUM ('SOLICITACAO', 'INSPECAO', 'APROVADO', 'REJEITADO', 'DESTINADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "DestinoDevolucao" AS ENUM ('REPARO', 'SUBSTITUICAO', 'CREDITO', 'DESCARTE');

-- CreateEnum
CREATE TYPE "TipoCobranca" AS ENUM ('MENSAL', 'ANUAL', 'DEFINITIVO');

-- CreateEnum
CREATE TYPE "StatusLicenca" AS ENUM ('ATIVA', 'EXPIRADA', 'CANCELADA', 'SUSPENSA');

-- CreateEnum
CREATE TYPE "CRMOportunidadeStatus" AS ENUM ('ABERTA', 'GANHA', 'PERDIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "CRMTarefaTipo" AS ENUM ('REUNIAO', 'LIGACAO', 'EMAIL', 'VISITA', 'DEMONSTRACAO', 'PROPOSTA', 'OUTRO');

-- CreateEnum
CREATE TYPE "CRMTarefaPrioridade" AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE');

-- CreateEnum
CREATE TYPE "CRMInteracaoTipo" AS ENUM ('LIGACAO', 'EMAIL', 'REUNIAO', 'WHATSAPP', 'VISITA', 'DEMONSTRACAO', 'OUTRO');

-- CreateEnum
CREATE TYPE "CRMCampanhaStatus" AS ENUM ('RASCUNHO', 'AGENDADA', 'ATIVA', 'PAUSADA', 'FINALIZADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "AutomacaoTipo" AS ENUM ('TAREFAS', 'MARKETING', 'FINANCEIRO', 'ESTOQUE', 'NOTIFICACOES');

-- CreateEnum
CREATE TYPE "AutomacaoStatus" AS ENUM ('ATIVA', 'PAUSADA', 'INATIVA');

-- CreateEnum
CREATE TYPE "NotificacaoTipo" AS ENUM ('SISTEMA', 'EMAIL', 'WHATSAPP', 'PUSH');

-- CreateEnum
CREATE TYPE "SituacaoEntrega" AS ENUM ('PENDENTE', 'AGENDADO', 'SAIU_PARA_ENTREGA', 'ENTREGUE', 'TENTATIVA_FALHOU', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoVeiculo" AS ENUM ('CARRO', 'MOTO', 'VAN', 'CAMINHAO', 'BICICLETA', 'OUTRO');

-- CreateEnum
CREATE TYPE "TipoTaxaEntrega" AS ENUM ('FIXA', 'POR_KM', 'POR_CEP', 'POR_VALOR');

-- CreateEnum
CREATE TYPE "TipoMotorista" AS ENUM ('PROPRIO', 'PJ');

-- CreateTable
CREATE TABLE "usuarios" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "perfil" "PerfilUsuario" NOT NULL DEFAULT 'USUARIO',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ultimoAcesso" TIMESTAMP(3),
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "empresas" (
    "_id" TEXT NOT NULL,
    "razaoSocial" TEXT NOT NULL,
    "nomeFantasia" TEXT,
    "cnpj" TEXT NOT NULL,
    "inscricaoEstadual" TEXT,
    "inscricaoMunicipal" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "site" TEXT,
    "logo" TEXT,
    "endereco" JSONB,
    "regimeTributario" "RegimeTributario" NOT NULL DEFAULT 'SIMPLES_NACIONAL',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,
    "matrizId" TEXT,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "filiais" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "razaoSocial" TEXT NOT NULL,
    "nomeFantasia" TEXT,
    "cnpj" TEXT NOT NULL,
    "inscricaoEstadual" TEXT,
    "inscricaoMunicipal" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "endereco" JSONB,
    "filialMatriz" BOOLEAN NOT NULL DEFAULT false,
    "numeroNF" INTEGER NOT NULL DEFAULT 1,
    "serieNF" TEXT NOT NULL DEFAULT '1',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "filiais_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipoPessoa" "TipoPessoa" NOT NULL,
    "documento" TEXT NOT NULL,
    "inscricaoEstadual" TEXT,
    "inscricaoMunicipal" TEXT,
    "telefone" TEXT,
    "telefoneCelular" TEXT,
    "email" TEXT,
    "endereco" JSONB,
    "dataNascimento" TIMESTAMP(3),
    "limiteCredito" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "fornecedores" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipoPessoa" "TipoPessoa" NOT NULL,
    "documento" TEXT NOT NULL,
    "inscricaoEstadual" TEXT,
    "inscricaoMunicipal" TEXT,
    "telefone" TEXT,
    "telefoneCelular" TEXT,
    "email" TEXT,
    "endereco" JSONB,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fornecedores_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "transportadoras" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipoPessoa" "TipoPessoa" NOT NULL,
    "documento" TEXT NOT NULL,
    "inscricaoEstadual" TEXT,
    "inscricaoMunicipal" TEXT,
    "telefone" TEXT,
    "telefoneCelular" TEXT,
    "email" TEXT,
    "endereco" JSONB,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transportadoras_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "vendedores" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipoPessoa" "TipoPessoa" NOT NULL,
    "documento" TEXT NOT NULL,
    "inscricaoEstadual" TEXT,
    "telefone" TEXT,
    "telefoneCelular" TEXT,
    "email" TEXT,
    "comissao" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendedores_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "codigoInterno" TEXT NOT NULL,
    "codigoBarras" TEXT,
    "gtin" TEXT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "descricaoDetalhada" TEXT,
    "categoriaId" TEXT,
    "unidadeMedidaId" TEXT,
    "precoVenda" DOUBLE PRECISION NOT NULL,
    "precoCusto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "precoMinimo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quantidadeEstoque" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estoqueMinimo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estoqueMaximo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pesoBruto" DOUBLE PRECISION,
    "pesoLiquido" DOUBLE PRECISION,
    "volume" DOUBLE PRECISION,
    "ncm" TEXT,
    "cest" TEXT,
    "origenMercadoria" "OrigemMercadoria" NOT NULL DEFAULT 'NACIONAL',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "produto_variacoes" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "precoAdicional" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estoque" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "codigoBarras" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produto_variacoes_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "produto_lotes" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "codigoLote" TEXT NOT NULL,
    "dataFabricacao" TIMESTAMP(3),
    "dataValidade" TIMESTAMP(3),
    "quantidade" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quantidadeOriginal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "custoUnitario" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produto_lotes_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "tabelas_preco" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'VISTA',
    "markupBase" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tabelas_preco_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "tabelas_preco_itens" (
    "_id" TEXT NOT NULL,
    "tabelaPrecoId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "precoVenda" DOUBLE PRECISION NOT NULL,
    "precoMinimo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "descontoMaximo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tabelas_preco_itens_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "promocoes" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "tipoDesconto" TEXT NOT NULL DEFAULT 'PERCENTUAL',
    "valorDesconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "qtdMinima" INTEGER,
    "qtdCobrar" INTEGER,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "aplicaProdutos" TEXT NOT NULL DEFAULT 'TODOS',
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promocoes_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "promocoes_itens" (
    "_id" TEXT NOT NULL,
    "promocaoId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "precoPromocional" DOUBLE PRECISION,

    CONSTRAINT "promocoes_itens_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "categoriaPaiId" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "unidades_medida" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "simbolo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "fracionada" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unidades_medida_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "pedidos_venda" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "filialId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "numeroPedido" TEXT NOT NULL,
    "serie" TEXT NOT NULL DEFAULT '1',
    "tipoOperacao" "TipoOperacao" NOT NULL DEFAULT 'VENDA',
    "situacao" "SituacaoPedido" NOT NULL DEFAULT 'EM_ABERTO',
    "dataEmissao" TIMESTAMP(3),
    "dataEntrega" TIMESTAMP(3),
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "valorDesconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorFrete" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorOutrosAcrescimos" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "observacoes" TEXT,
    "observacoesInternas" TEXT,
    "condicaoPagamento" TEXT,
    "quantidadeParcelas" INTEGER DEFAULT 1,
    "intervaloParcelas" INTEGER DEFAULT 30,
    "primeiraParcelaDias" INTEGER DEFAULT 0,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_venda_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "itens_pedido_venda" (
    "_id" TEXT NOT NULL,
    "pedidoVendaId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "numeroItem" INTEGER NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "unidadeMedida" TEXT NOT NULL,
    "valorUnitario" DOUBLE PRECISION NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "valorDesconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "itens_pedido_venda_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "orcamentos" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "filialId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "numeroOrcamento" TEXT NOT NULL,
    "serie" TEXT NOT NULL DEFAULT '1',
    "dataValidade" TIMESTAMP(3) NOT NULL,
    "dataEmissao" TIMESTAMP(3),
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "valorDesconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorFrete" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorOutrosAcrescimos" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "observacoes" TEXT,
    "observacoesInternas" TEXT,
    "situacao" "SituacaoOrcamento" NOT NULL DEFAULT 'ABERTO',
    "pedidoVendaId" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orcamentos_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "itens_orcamento" (
    "_id" TEXT NOT NULL,
    "orcamentoId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "numeroItem" INTEGER NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "unidadeMedida" TEXT NOT NULL,
    "valorUnitario" DOUBLE PRECISION NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "valorDesconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "itens_orcamento_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "pedidos_compra" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "fornecedorId" TEXT NOT NULL,
    "numeroPedido" TEXT NOT NULL,
    "serie" TEXT NOT NULL DEFAULT '1',
    "tipoOperacao" "TipoOperacao" NOT NULL DEFAULT 'VENDA',
    "situacao" "SituacaoPedido" NOT NULL DEFAULT 'EM_ABERTO',
    "dataEmissao" TIMESTAMP(3),
    "dataEntrega" TIMESTAMP(3),
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "valorDesconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorFrete" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "observacoes" TEXT,
    "condicaoPagamento" TEXT,
    "quantidadeParcelas" INTEGER DEFAULT 1,
    "intervaloParcelas" INTEGER DEFAULT 30,
    "primeiraParcelaDias" INTEGER DEFAULT 0,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_compra_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "itens_pedido_compra" (
    "_id" TEXT NOT NULL,
    "pedidoCompraId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "numeroItem" INTEGER NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "quantidadeRecebida" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unidadeMedida" TEXT NOT NULL,
    "valorUnitario" DOUBLE PRECISION NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "valorDesconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "itens_pedido_compra_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "cotacoes_compra" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "numeroCotacao" TEXT NOT NULL,
    "serie" TEXT NOT NULL DEFAULT '1',
    "situacao" "SituacaoCotacao" NOT NULL DEFAULT 'ABERTA',
    "dataAbertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataValidade" TIMESTAMP(3),
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cotacoes_compra_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "itens_cotacao_compra" (
    "_id" TEXT NOT NULL,
    "cotacaoCompraId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "unidadeMedida" TEXT NOT NULL,
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "itens_cotacao_compra_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "respostas_cotacao" (
    "_id" TEXT NOT NULL,
    "cotacaoCompraId" TEXT NOT NULL,
    "fornecedorId" TEXT NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "valorFrete" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorDesconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "prazoEntrega" TEXT,
    "situacao" "SituacaoCotacao" NOT NULL DEFAULT 'ENVIADA',
    "dataResposta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "respostas_cotacao_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "entradas_mercadoria" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "pedidoCompraId" TEXT NOT NULL,
    "numeroNota" TEXT NOT NULL,
    "serieNota" TEXT NOT NULL DEFAULT '1',
    "dataEmissao" TIMESTAMP(3),
    "dataEntrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "valorFrete" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorDesconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "observacoes" TEXT,
    "situacao" "SituacaoEntrada" NOT NULL DEFAULT 'PENDENTE',
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entradas_mercadoria_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "itens_entrada" (
    "_id" TEXT NOT NULL,
    "entradaMercadoriaId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "quantidadeRecebida" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unidadeMedida" TEXT NOT NULL,
    "valorUnitario" DOUBLE PRECISION NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "valorDesconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "itens_entrada_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "parametros_sistema" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" "TipoParametro" NOT NULL DEFAULT 'TEXTO',
    "modulo" "ModuloSistema" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parametros_sistema_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "movimentacoes_estoque" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "tipoMovimentacao" "TipoMovimentacao" NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "quantidadeAnterior" DOUBLE PRECISION NOT NULL,
    "quantidadeNova" DOUBLE PRECISION NOT NULL,
    "motivo" TEXT,
    "dataMovimentacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimentacoes_estoque_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "contas_receber" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "pedidoVendaId" TEXT,
    "numeroDocumento" TEXT NOT NULL,
    "numeroParcela" INTEGER NOT NULL DEFAULT 1,
    "totalParcelas" INTEGER NOT NULL DEFAULT 1,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataEmissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valorOriginal" DOUBLE PRECISION NOT NULL,
    "valorRecebido" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorDesconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorJuros" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorMulta" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "situacao" "SituacaoConta" NOT NULL DEFAULT 'ABERTA',
    "formaPagamento" "FormaPagamento",
    "dataRecebimento" TIMESTAMP(3),
    "centroCustoId" TEXT,
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contas_receber_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "boletos" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "contaReceberId" TEXT NOT NULL,
    "bancoId" TEXT,
    "numeroBoleto" TEXT NOT NULL,
    "numeroDocumento" TEXT NOT NULL,
    "dataEmissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "valorOriginal" DOUBLE PRECISION NOT NULL,
    "valorJuros" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorMulta" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorDesconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorPago" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "situacao" "SituacaoBoleto" NOT NULL DEFAULT 'EMITIDO',
    "instrucoes" TEXT,
    "mensagem" TEXT,
    "codigoBarras" TEXT,
    "linhaDigitavel" TEXT,
    "pdfPath" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boletos_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "remessas_boleto" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "tipoArquivo" TEXT NOT NULL DEFAULT 'CNAB400',
    "totalBoletos" INTEGER NOT NULL DEFAULT 0,
    "valorTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "conteudo" TEXT NOT NULL,
    "dataGeracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processado" BOOLEAN NOT NULL DEFAULT false,
    "dataProcessamento" TIMESTAMP(3),
    "observacoes" TEXT,

    CONSTRAINT "remessas_boleto_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "bancos" (
    "_id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "nomeReduzido" TEXT NOT NULL,
    "cnpj" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bancos_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "vendas_pdv" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "filialId" TEXT NOT NULL,
    "operadorId" TEXT,
    "clienteId" TEXT,
    "numeroCupom" TEXT NOT NULL,
    "dataVenda" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "valorDesconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorAcrescimo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "formaPagamento" "FormaPagamentoPDV" NOT NULL,
    "valorPago" DOUBLE PRECISION NOT NULL,
    "valorTroco" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "situacao" "SituacaoVendaPDV" NOT NULL DEFAULT 'ABERTA',
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendas_pdv_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "itens_venda_pdv" (
    "_id" TEXT NOT NULL,
    "vendaPDVId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "codigoBarras" TEXT,
    "descricao" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "unidadeMedida" TEXT NOT NULL,
    "valorUnitario" DOUBLE PRECISION NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "valorDesconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "itens_venda_pdv_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "operadores_pdv" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "pin" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operadores_pdv_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "caixas" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "filialId" TEXT NOT NULL,
    "operadorId" TEXT NOT NULL,
    "dataAbertura" TIMESTAMP(3) NOT NULL,
    "dataFechamento" TIMESTAMP(3),
    "saldoInicial" DOUBLE PRECISION NOT NULL,
    "saldoFinal" DOUBLE PRECISION,
    "totalEntradas" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalSaidas" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "situacao" "SituacaoCaixa" NOT NULL DEFAULT 'ABERTO',
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "caixas_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "contas_pagar" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "fornecedorId" TEXT NOT NULL,
    "pedidoCompraId" TEXT,
    "numeroDocumento" TEXT NOT NULL,
    "numeroParcela" INTEGER NOT NULL DEFAULT 1,
    "totalParcelas" INTEGER NOT NULL DEFAULT 1,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataEmissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valorOriginal" DOUBLE PRECISION NOT NULL,
    "valorPago" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorDesconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorJuros" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorMulta" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "situacao" "SituacaoConta" NOT NULL DEFAULT 'ABERTA',
    "formaPagamento" "FormaPagamento",
    "dataPagamento" TIMESTAMP(3),
    "centroCustoId" TEXT,
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contas_pagar_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "contas_bancarias" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "banco" TEXT NOT NULL,
    "agencia" TEXT NOT NULL,
    "conta" TEXT NOT NULL,
    "tipo" "TipoContaBancaria" NOT NULL DEFAULT 'CORRENTE',
    "saldoInicial" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "saldoAtual" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contas_bancarias_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "movimentacoes_bancarias" (
    "_id" TEXT NOT NULL,
    "contaBancariaId" TEXT NOT NULL,
    "dataMovimentacao" TIMESTAMP(3) NOT NULL,
    "dataCompetencia" TIMESTAMP(3),
    "tipo" "TipoMovimentoBancario" NOT NULL,
    "descricao" TEXT NOT NULL,
    "documento" TEXT,
    "valor" DOUBLE PRECISION NOT NULL,
    "conciliado" BOOLEAN NOT NULL DEFAULT false,
    "conciliacaoId" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimentacoes_bancarias_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "conciliacoes" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "contaBancariaId" TEXT NOT NULL,
    "periodoIni" TIMESTAMP(3) NOT NULL,
    "periodoFin" TIMESTAMP(3) NOT NULL,
    "dataConciliacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalCreditos" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalDebitos" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalConciliado" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalNaoConciliado" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "observacoes" TEXT,

    CONSTRAINT "conciliacoes_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "cheques" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "contaBancariaId" TEXT,
    "clienteId" TEXT,
    "fornecedorId" TEXT,
    "numero" TEXT NOT NULL,
    "banco" TEXT NOT NULL,
    "agencia" TEXT NOT NULL,
    "conta" TEXT NOT NULL,
    "emitente" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "dataEmissao" TIMESTAMP(3) NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataCompensacao" TIMESTAMP(3),
    "tipo" "TipoCheque" NOT NULL DEFAULT 'RECEBIDO',
    "situacao" "SituacaoCheque" NOT NULL DEFAULT 'EM_CARTEIRA',
    "motivoDevolucao" TEXT,
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cheques_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "centros_custo" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "centroPaiId" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "centros_custo_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "fluxo_caixa" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "tipo" "TipoFluxoCaixa" NOT NULL,
    "categoria" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "formaPagamento" "FormaPagamento" NOT NULL,
    "dataMovimentacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referenciaId" TEXT,
    "referenciaTipo" TEXT,
    "centroCustoId" TEXT,

    CONSTRAINT "fluxo_caixa_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "logs_sistema" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT,
    "usuarioId" TEXT,
    "categoria" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "nivel" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "detalhes" JSONB,
    "ip" TEXT,
    "userAgent" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_sistema_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "notas_fiscais" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "filialId" TEXT NOT NULL,
    "clienteId" TEXT,
    "fornecedorId" TEXT,
    "pedidoVendaId" TEXT,
    "tipoDocumento" "TipoDocumentoNF" NOT NULL,
    "modelo" "ModeloNF" NOT NULL DEFAULT 'NFE',
    "serie" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "chaveAcesso" TEXT NOT NULL,
    "dataEmissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataSaida" TIMESTAMP(3),
    "tipoOperacao" "TipoOperacaoNF" NOT NULL,
    "finalidadeEmissao" "FinalidadeNF" NOT NULL DEFAULT 'NORMAL',
    "naturezaOperacao" TEXT NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "valorDesconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorFrete" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorSeguro" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorOutros" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorBaseICMS" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorICMS" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorBaseICMSST" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorICMSST" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorPIS" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorCOFINS" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorIPI" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorTotalTributos" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorBaseCBS" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorCBS" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "aliquotaCBS" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorBaseIBS" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorIBS" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "aliquotaIBS" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorIS" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "aliquotaIS" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorTotalReformaTributaria" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "situacao" "SituacaoNF" NOT NULL DEFAULT 'EM_DIGITACAO',
    "statusSefaz" TEXT,
    "motivo" TEXT,
    "xmlEnvio" TEXT,
    "xmlRetorno" TEXT,
    "protocolo" TEXT,
    "dataProtocolo" TIMESTAMP(3),
    "dataAutorizacao" TIMESTAMP(3),
    "numeroRecibo" TEXT,
    "pdfPath" TEXT,
    "observacoes" TEXT,
    "informacoesComplementares" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notas_fiscais_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "itens_nota_fiscal" (
    "_id" TEXT NOT NULL,
    "notaFiscalId" TEXT NOT NULL,
    "produtoId" TEXT,
    "numeroItem" INTEGER NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "ncm" TEXT,
    "cfop" TEXT NOT NULL,
    "unidadeComercial" TEXT NOT NULL,
    "quantidadeComercial" DOUBLE PRECISION NOT NULL,
    "valorUnitarioComercial" DOUBLE PRECISION NOT NULL,
    "valorTotalBruto" DOUBLE PRECISION NOT NULL,
    "valorDesconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorTotalLiquido" DOUBLE PRECISION NOT NULL,
    "codigoEAN" TEXT,
    "codigoTributario" TEXT,
    "origemMercadoria" INTEGER NOT NULL DEFAULT 0,
    "icmsBaseCalculo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "icmsAliquota" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "icmsValor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "icmsSTBaseCalculo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "icmsSTAliquota" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "icmsSTValor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pisAliquota" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pisValor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cofinsAliquota" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cofinsValor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ipiAliquota" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ipiValor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cbsCst" TEXT,
    "cbsBaseCalculo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cbsAliquota" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cbsValor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ibsCst" TEXT,
    "ibsBaseCalculo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ibsAliquota" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ibsValor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isAliquota" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isValor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "itens_nota_fiscal_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "eventos_nf" (
    "_id" TEXT NOT NULL,
    "notaFiscalId" TEXT NOT NULL,
    "tipoEvento" "TipoEventoNF" NOT NULL,
    "sequenciaEvento" INTEGER NOT NULL,
    "dataEvento" TIMESTAMP(3) NOT NULL,
    "descricao" TEXT NOT NULL,
    "protocolo" TEXT,
    "dataProtocolo" TIMESTAMP(3),
    "xmlEnvio" TEXT,
    "xmlRetorno" TEXT,
    "justificativa" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eventos_nf_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "configuracoes_nf" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "certificadoDigital" TEXT NOT NULL,
    "senhaCertificado" TEXT NOT NULL,
    "csc" TEXT,
    "cscId" TEXT,
    "ambiente" "AmbienteNF" NOT NULL DEFAULT 'HOMOLOGACAO',
    "serieNFe" TEXT NOT NULL DEFAULT '001',
    "serieNFCe" TEXT NOT NULL DEFAULT '001',
    "proximoNFe" INTEGER NOT NULL DEFAULT 1,
    "proximoNFCe" INTEGER NOT NULL DEFAULT 1,
    "uf" TEXT NOT NULL DEFAULT '35',
    "municipio" TEXT,
    "razaoSocial" TEXT,
    "nomeFantasia" TEXT,
    "cnpj" TEXT,
    "inscricaoEstadual" TEXT,
    "inscricaoMunicipal" TEXT,
    "logradouro" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cep" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "logoPath" TEXT,
    "padrao" "PadraoNF" NOT NULL DEFAULT 'NFE_V4',
    "versao" TEXT NOT NULL DEFAULT '4.00',
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracoes_nf_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "sped_config" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "filialId" TEXT,
    "versao" TEXT NOT NULL DEFAULT '017',
    "perfil" TEXT NOT NULL DEFAULT 'A',
    "finalidade" TEXT NOT NULL DEFAULT '1',
    "blocosAtivos" JSONB NOT NULL DEFAULT '["0","C","D","E","G","H"]',
    "tipoEscrituracao" TEXT NOT NULL DEFAULT '0',
    "cnpjContador" TEXT,
    "contatoContador" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sped_config_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "sped_apuracao" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "periodo" TIMESTAMP(3) NOT NULL,
    "tipo" TEXT NOT NULL,
    "debitos" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "creditos" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "saldoAnterior" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "saldoFinal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "blocos" JSONB,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sped_apuracao_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "sped_fiscal" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "periodoIni" TIMESTAMP(3) NOT NULL,
    "periodoFin" TIMESTAMP(3) NOT NULL,
    "dataGeracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "arquivo" TEXT,
    "totalRegistros" INTEGER NOT NULL DEFAULT 0,
    "situacao" "SituacaoSped" NOT NULL DEFAULT 'PENDENTE',
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sped_fiscal_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "sped_contribuicoes" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "periodoIni" TIMESTAMP(3) NOT NULL,
    "periodoFin" TIMESTAMP(3) NOT NULL,
    "dataGeracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "arquivo" TEXT,
    "totalRegistros" INTEGER NOT NULL DEFAULT 0,
    "situacao" "SituacaoSped" NOT NULL DEFAULT 'PENDENTE',
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sped_contribuicoes_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "inventarios" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "filialId" TEXT NOT NULL,
    "dataInventario" TIMESTAMP(3) NOT NULL,
    "dataFechamento" TIMESTAMP(3),
    "tipo" "TipoInventario" NOT NULL,
    "situacao" "SituacaoInventario" NOT NULL DEFAULT 'ABERTO',
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventarios_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "itens_inventario" (
    "_id" TEXT NOT NULL,
    "inventarioId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "quantidadeSistema" DOUBLE PRECISION NOT NULL,
    "quantidadeContada" DOUBLE PRECISION,
    "diferenca" DOUBLE PRECISION,
    "custoUnitario" DOUBLE PRECISION NOT NULL,
    "valorDiferenca" DOUBLE PRECISION,
    "situacao" "SituacaoItemInventario" NOT NULL DEFAULT 'PENDENTE',
    "observacoes" TEXT,
    "dataContagem" TIMESTAMP(3),
    "dataConciliacao" TIMESTAMP(3),
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "itens_inventario_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "plano_contas" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoConta" NOT NULL,
    "nivel" INTEGER NOT NULL DEFAULT 1,
    "contaPaiId" TEXT,
    "natureza" "NaturezaConta" NOT NULL,
    "aceite" BOOLEAN NOT NULL DEFAULT true,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plano_contas_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "lancamentos_contabeis" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "dataCompetencia" TIMESTAMP(3),
    "tipo" "TipoLancamento" NOT NULL,
    "historia" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "planoContaId" TEXT NOT NULL,
    "documento" TEXT,
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lancamentos_contabeis_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "ecf" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "identificacao" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "numeroSerie" TEXT NOT NULL,
    "numeroFabricacao" TEXT NOT NULL,
    "versaoSB" TEXT NOT NULL,
    "dataInstalacao" TIMESTAMP(3) NOT NULL,
    "lojaId" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ecf_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "reducoes_z" (
    "_id" TEXT NOT NULL,
    "ecfId" TEXT NOT NULL,
    "dataMovimento" TIMESTAMP(3) NOT NULL,
    "numeroReducao" INTEGER NOT NULL,
    "cro" INTEGER NOT NULL,
    "crz" INTEGER NOT NULL,
    "cooInicial" INTEGER NOT NULL,
    "cooFinal" INTEGER NOT NULL,
    "gtInicial" DOUBLE PRECISION NOT NULL,
    "gtFinal" DOUBLE PRECISION NOT NULL,
    "valorVendaBruta" DOUBLE PRECISION NOT NULL,
    "valorTotalSuprimento" DOUBLE PRECISION NOT NULL,
    "valorTotalSangria" DOUBLE PRECISION NOT NULL,
    "valorBaseICMS" DOUBLE PRECISION NOT NULL,
    "valorICMS" DOUBLE PRECISION NOT NULL,
    "valorISS" DOUBLE PRECISION NOT NULL,
    "valorPIS" DOUBLE PRECISION NOT NULL,
    "valorCOFINS" DOUBLE PRECISION NOT NULL,
    "situacao" "SituacaoReducaoZ" NOT NULL DEFAULT 'ABERTA',
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reducoes_z_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "cupons" (
    "_id" TEXT NOT NULL,
    "ecfId" TEXT NOT NULL,
    "reducaoZId" TEXT,
    "numeroCupom" INTEGER NOT NULL,
    "coo" INTEGER NOT NULL,
    "ccf" INTEGER NOT NULL,
    "dataEmissao" TIMESTAMP(3) NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "valorDesconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorAcrescimo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "formaPagamento" "FormaPagamentoECF" NOT NULL,
    "valorPagamento" DOUBLE PRECISION NOT NULL,
    "valorTroco" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "situacao" "SituacaoCupom" NOT NULL DEFAULT 'ABERTO',
    "hashCupom" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cupons_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "itens_cupom" (
    "_id" TEXT NOT NULL,
    "cupomId" TEXT NOT NULL,
    "produtoId" TEXT,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "unidadeMedida" TEXT NOT NULL,
    "valorUnitario" DOUBLE PRECISION NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "valorDesconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorAcrescimo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "aliquotaICMS" TEXT,
    "csosn" TEXT,
    "cbsCst" TEXT,
    "cbsBaseCalculo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cbsAliquota" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cbsValor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ibsCst" TEXT,
    "ibsBaseCalculo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ibsAliquota" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ibsValor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "itens_cupom_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "suprimentos" (
    "_id" TEXT NOT NULL,
    "ecfId" TEXT NOT NULL,
    "reducaoZId" TEXT,
    "dataMovimento" TIMESTAMP(3) NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "tipo" "TipoSuprimento" NOT NULL,
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suprimentos_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "sangrias" (
    "_id" TEXT NOT NULL,
    "ecfId" TEXT NOT NULL,
    "reducaoZId" TEXT,
    "dataMovimento" TIMESTAMP(3) NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "motivo" TEXT NOT NULL,
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sangrias_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "notas_servico" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "filialId" TEXT NOT NULL,
    "clienteId" TEXT,
    "rpsId" TEXT,
    "numero" INTEGER NOT NULL,
    "serie" TEXT NOT NULL DEFAULT 'NFSe',
    "codigoVerificacao" TEXT,
    "dataEmissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataPrestacao" TIMESTAMP(3),
    "competencia" TEXT,
    "tipoRps" "TipoRps" NOT NULL DEFAULT 'RPS',
    "naturezaOperacao" TEXT NOT NULL DEFAULT '1',
    "regimeTributario" "RegimeTributario" NOT NULL DEFAULT 'SIMPLES_NACIONAL',
    "optanteSimplesNacional" BOOLEAN NOT NULL DEFAULT false,
    "incentivoFiscal" BOOLEAN NOT NULL DEFAULT false,
    "valorServicos" DOUBLE PRECISION NOT NULL,
    "valorDeducoes" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorPis" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorCofins" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorInss" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorIr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorCsll" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorIss" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorIssRetido" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "baseCalculo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "aliquotaIss" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "valorLiquido" DOUBLE PRECISION NOT NULL,
    "valorCBS" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "aliquotaCBS" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorIBS" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "aliquotaIBS" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tomadorNome" TEXT,
    "tomadorCnpjCpf" TEXT,
    "tomadorInscricaoMunicipal" TEXT,
    "tomadorEndereco" TEXT,
    "tomadorNumero" TEXT,
    "tomadorComplemento" TEXT,
    "tomadorBairro" TEXT,
    "tomadorCidade" TEXT,
    "tomadorUf" TEXT,
    "tomadorCep" TEXT,
    "tomadorTelefone" TEXT,
    "tomadorEmail" TEXT,
    "servicoproduto" TEXT,
    "codigoMunicipio" TEXT,
    "codigoServico" TEXT,
    "discriminacao" TEXT,
    "situacao" "SituacaoNFSe" NOT NULL DEFAULT 'EM_DIGITACAO',
    "statusSefaz" TEXT,
    "mensagemSefaz" TEXT,
    "numeroNfse" TEXT,
    "codigoMunicipioEnvio" TEXT,
    "dataAutorizacao" TIMESTAMP(3),
    "protocolo" TEXT,
    "xmlEnvio" TEXT,
    "xmlRetorno" TEXT,
    "pdfPath" TEXT,
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notas_servico_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "itens_servico" (
    "_id" TEXT NOT NULL,
    "notaServicoId" TEXT NOT NULL,
    "numeroItem" INTEGER NOT NULL,
    "codigo" TEXT NOT NULL,
    "discriminacao" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "valorUnitario" DOUBLE PRECISION NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "tributavel" BOOLEAN NOT NULL DEFAULT true,
    "issAliquota" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "issValor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cbsAliquota" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cbsValor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ibsAliquota" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ibsValor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "itens_servico_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "veiculos" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "renavam" TEXT,
    "rntrc" TEXT,
    "tipoPropriedade" TEXT NOT NULL DEFAULT '1',
    "tara" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "capacidade" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "tipoCarroceria" TEXT,
    "marca" TEXT,
    "modelo" TEXT,
    "anoFabricacao" INTEGER,
    "cor" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "veiculos_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "condutores" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "rntrc" TEXT,
    "cnh" TEXT,
    "cnhCategoria" TEXT,
    "cnhVencimento" TIMESTAMP(3),
    "telefone" TEXT,
    "email" TEXT,
    "endereco" JSONB,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "condutores_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "mdfe" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "filialId" TEXT NOT NULL,
    "serie" INTEGER NOT NULL DEFAULT 1,
    "numero" INTEGER NOT NULL,
    "chaveAcesso" TEXT NOT NULL,
    "modelo" TEXT NOT NULL DEFAULT '58',
    "ufCarregamento" TEXT NOT NULL,
    "ufDescarregamento" TEXT,
    "modal" TEXT NOT NULL DEFAULT '1',
    "rntrc" TEXT,
    "veiculoId" TEXT,
    "condutorId" TEXT,
    "valorTotalCarga" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "qtdTotalDocumentos" INTEGER NOT NULL DEFAULT 0,
    "dataEmissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAutorizacao" TIMESTAMP(3),
    "dataEncerramento" TIMESTAMP(3),
    "situacao" TEXT NOT NULL DEFAULT 'EM_DIGITACAO',
    "protocolo" TEXT,
    "xmlAutorizado" TEXT,
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mdfe_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "mdfe_documentos" (
    "_id" TEXT NOT NULL,
    "mdfeId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "chaveAcesso" TEXT NOT NULL,
    "valorDocumento" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "pesoTotal" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mdfe_documentos_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "mdfe_eventos" (
    "_id" TEXT NOT NULL,
    "mdfeId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dataEvento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "protocolo" TEXT,
    "xmlRetorno" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mdfe_eventos_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "ctes" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "filialId" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "serie" TEXT NOT NULL DEFAULT '1',
    "chaveAcesso" TEXT NOT NULL,
    "modelo" TEXT NOT NULL DEFAULT '57',
    "tomadorId" TEXT NOT NULL,
    "tomadorTipo" TEXT NOT NULL,
    "remetenteId" TEXT,
    "destinatarioId" TEXT,
    "tipoServico" TEXT NOT NULL,
    "valorFrete" DOUBLE PRECISION NOT NULL,
    "valorCarga" DOUBLE PRECISION NOT NULL,
    "naturezaCarga" TEXT,
    "especieCarga" TEXT,
    "peso" DOUBLE PRECISION,
    "volumes" INTEGER,
    "situacao" TEXT NOT NULL DEFAULT 'EM_DIGITACAO',
    "dataEmissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ctes_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "report_templates" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "dataSource" TEXT NOT NULL,
    "colunas" JSONB NOT NULL,
    "filtros" JSONB,
    "formato" TEXT NOT NULL DEFAULT 'table',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_templates_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "contratos" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "descricao" TEXT,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3),
    "valor" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tipoReajuste" "TipoReajuste" NOT NULL DEFAULT 'NENHUM',
    "periodicidade" TEXT NOT NULL DEFAULT 'MENSAL',
    "status" "SituacaoContrato" NOT NULL DEFAULT 'RASCUNHO',
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contratos_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "contrato_medicoes" (
    "_id" TEXT NOT NULL,
    "contratoId" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "valor" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "pedidoGerado" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contrato_medicoes_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "garantias" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "vendaId" TEXT,
    "numero" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'FABRICA',
    "prazoDias" INTEGER NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3),
    "cobertura" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ATIVA',
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "garantias_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "garantia_regras" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "produtoId" TEXT,
    "categoriaId" TEXT,
    "prazoDias" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'FABRICA',
    "cobertura" TEXT,
    "termos" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "garantia_regras_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "devolucoes" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "pedidoVendaId" TEXT,
    "numero" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "status" "DevolucaoStatus" NOT NULL DEFAULT 'SOLICITACAO',
    "destino" "DestinoDevolucao",
    "observacoes" TEXT,
    "laudoTecnico" TEXT,
    "nfDevolucao" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devolucoes_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "devolucao_itens" (
    "_id" TEXT NOT NULL,
    "devolucaoId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "quantidade" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "valor" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "condicao" TEXT NOT NULL DEFAULT 'NOVO',
    "numeroSerie" TEXT,

    CONSTRAINT "devolucao_itens_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "convenios" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3),
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "situacao" TEXT NOT NULL DEFAULT 'ATIVO',
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "convenios_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "licitacoes" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "orgao" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "dataAbertura" TIMESTAMP(3) NOT NULL,
    "dataEncerramento" TIMESTAMP(3),
    "valorEstimado" DOUBLE PRECISION NOT NULL,
    "situacao" TEXT NOT NULL DEFAULT 'EM_ANDAMENTO',
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "licitacoes_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "licitacoes_itens" (
    "_id" TEXT NOT NULL,
    "licitacaoId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "valorUnitario" DOUBLE PRECISION NOT NULL,
    "marca" TEXT,

    CONSTRAINT "licitacoes_itens_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "adiantamentos" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "clienteId" TEXT,
    "fornecedorId" TEXT,
    "funcionarioId" TEXT,
    "tipo" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "dataAdiantamento" TIMESTAMP(3) NOT NULL,
    "dataPrevisao" TIMESTAMP(3),
    "situacao" TEXT NOT NULL DEFAULT 'ABERTO',
    "formaPagamento" TEXT,
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "adiantamentos_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "quitacoes" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "clienteId" TEXT,
    "fornecedorId" TEXT,
    "tipo" TEXT NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "dataQuitacao" TIMESTAMP(3) NOT NULL,
    "formaPagamento" TEXT,
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quitacoes_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "quitacoes_contas" (
    "_id" TEXT NOT NULL,
    "quitacaoId" TEXT NOT NULL,
    "contaId" TEXT NOT NULL,
    "tipoConta" TEXT NOT NULL,
    "valorPago" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "quitacoes_contas_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "planos" (
    "_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "tipoCobranca" "TipoCobranca" NOT NULL,
    "precoMensal" DECIMAL(10,2),
    "precoAnual" DECIMAL(10,2),
    "precoDefinitivo" DECIMAL(10,2),
    "limiteUsuarios" INTEGER NOT NULL DEFAULT 5,
    "limiteClientes" INTEGER NOT NULL DEFAULT 1000,
    "limiteProdutos" INTEGER NOT NULL DEFAULT 5000,
    "limiteNotasFiscais" INTEGER NOT NULL DEFAULT 1000,
    "limiteEmpresas" INTEGER NOT NULL DEFAULT 1,
    "moduloCrm" BOOLEAN NOT NULL DEFAULT false,
    "moduloAutomacao" BOOLEAN NOT NULL DEFAULT false,
    "moduloMultiEmpresa" BOOLEAN NOT NULL DEFAULT false,
    "moduloApi" BOOLEAN NOT NULL DEFAULT false,
    "moduloBoletos" BOOLEAN NOT NULL DEFAULT true,
    "moduloNfse" BOOLEAN NOT NULL DEFAULT true,
    "moduloEcf" BOOLEAN NOT NULL DEFAULT true,
    "moduloDre" BOOLEAN NOT NULL DEFAULT true,
    "moduloPlanoContas" BOOLEAN NOT NULL DEFAULT true,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planos_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "licencas" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "planoId" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "tipoCobranca" "TipoCobranca" NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataExpiracao" TIMESTAMP(3),
    "status" "StatusLicenca" NOT NULL DEFAULT 'ATIVA',
    "valorPago" DECIMAL(10,2),
    "dataPagamento" TIMESTAMP(3),
    "codigoTransacao" TEXT,
    "limiteUsuarios" INTEGER,
    "limiteClientes" INTEGER,
    "limiteProdutos" INTEGER,
    "limiteNotasFiscais" INTEGER,
    "limiteEmpresas" INTEGER,
    "usuariosAtivos" INTEGER NOT NULL DEFAULT 0,
    "clientesAtivos" INTEGER NOT NULL DEFAULT 0,
    "produtosAtivos" INTEGER NOT NULL DEFAULT 0,
    "notasEsteMes" INTEGER NOT NULL DEFAULT 0,
    "moduloCrm" BOOLEAN NOT NULL DEFAULT false,
    "moduloAutomacao" BOOLEAN NOT NULL DEFAULT false,
    "moduloMultiEmpresa" BOOLEAN NOT NULL DEFAULT false,
    "moduloApi" BOOLEAN NOT NULL DEFAULT false,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "licencas_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "licencas_log" (
    "_id" TEXT NOT NULL,
    "licencaId" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "descricao" TEXT,
    "planoAnteriorId" TEXT,
    "planoNovoId" TEXT,
    "valor" DECIMAL(10,2),
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "licencas_log_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "crm_pipelines" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "cor" TEXT DEFAULT '#3b82f6',
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "crm_pipelines_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "crm_oportunidades" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "pipelineId" TEXT NOT NULL,
    "clienteId" TEXT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "valor" DECIMAL(15,2) NOT NULL,
    "probabilidade" INTEGER NOT NULL DEFAULT 50,
    "estagio" TEXT NOT NULL,
    "pedidoId" TEXT,
    "notaFiscalId" TEXT,
    "dataFechamentoEsperado" TIMESTAMP(3),
    "dataFechamentoReal" TIMESTAMP(3),
    "diasNoEstagio" INTEGER NOT NULL DEFAULT 0,
    "status" "CRMOportunidadeStatus" NOT NULL DEFAULT 'ABERTA',
    "origem" TEXT DEFAULT 'manual',
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,
    "criadoPor" TEXT,

    CONSTRAINT "crm_oportunidades_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "crm_oportunidade_itens" (
    "_id" TEXT NOT NULL,
    "oportunidadeId" TEXT NOT NULL,
    "produtoId" TEXT,
    "produtoNome" TEXT NOT NULL,
    "quantidade" DECIMAL(15,3) NOT NULL,
    "precoUnitario" DECIMAL(15,2) NOT NULL,
    "desconto" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "crm_oportunidade_itens_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "crm_oportunidade_historico" (
    "_id" TEXT NOT NULL,
    "oportunidadeId" TEXT NOT NULL,
    "estagioAnterior" TEXT,
    "estagioNovo" TEXT,
    "acao" TEXT NOT NULL,
    "descricao" TEXT,
    "usuarioId" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crm_oportunidade_historico_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "crm_tarefas" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "oportunidadeId" TEXT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" "CRMTarefaTipo" NOT NULL DEFAULT 'OUTRO',
    "prioridade" "CRMTarefaPrioridade" NOT NULL DEFAULT 'MEDIA',
    "responsavelId" TEXT,
    "dataVencimento" TIMESTAMP(3),
    "dataConclusao" TIMESTAMP(3),
    "concluida" BOOLEAN NOT NULL DEFAULT false,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_tarefas_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "crm_interacoes" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "oportunidadeId" TEXT,
    "clienteId" TEXT,
    "tipo" "CRMInteracaoTipo" NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "duracaoMinutos" INTEGER,
    "arquivoUrl" TEXT,
    "usuarioId" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crm_interacoes_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "crm_campanhas" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "tipoSegmento" TEXT DEFAULT 'todos',
    "produtoId" TEXT,
    "diasInatividade" INTEGER,
    "valorMinimo" DECIMAL(15,2),
    "status" "CRMCampanhaStatus" NOT NULL DEFAULT 'RASCUNHO',
    "dataInicio" TIMESTAMP(3),
    "dataFim" TIMESTAMP(3),
    "clientesTarget" INTEGER NOT NULL DEFAULT 0,
    "enviosRealizados" INTEGER NOT NULL DEFAULT 0,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_campanhas_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "automacoes" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" "AutomacaoTipo" NOT NULL,
    "status" "AutomacaoStatus" NOT NULL DEFAULT 'ATIVA',
    "trigger" JSONB NOT NULL,
    "acoes" JSONB NOT NULL,
    "executadaCount" INTEGER NOT NULL DEFAULT 0,
    "ultimaExecucao" TIMESTAMP(3),
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "automacoes_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "automacao_logs" (
    "_id" TEXT NOT NULL,
    "automacaoId" TEXT NOT NULL,
    "executada" BOOLEAN NOT NULL,
    "detalhes" JSONB,
    "erro" TEXT,
    "dataExecucao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automacao_logs_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "notificacoes" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "tipo" "NotificacaoTipo" NOT NULL DEFAULT 'SISTEMA',
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "destinatario" TEXT,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataLeitura" TIMESTAMP(3),

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "renegociacoes" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "clienteId" TEXT,
    "fornecedorId" TEXT,
    "tipo" TEXT NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "valorDesconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorJuros" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorMulta" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorFinal" DOUBLE PRECISION NOT NULL,
    "numeroParcelas" INTEGER NOT NULL DEFAULT 1,
    "primeiraVencimento" TIMESTAMP(3) NOT NULL,
    "situacao" TEXT NOT NULL DEFAULT 'PENDENTE',
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "renegociacoes_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "renegociacoes_contas" (
    "_id" TEXT NOT NULL,
    "renegociacaoId" TEXT NOT NULL,
    "contaId" TEXT NOT NULL,
    "tipoConta" TEXT NOT NULL,

    CONSTRAINT "renegociacoes_contas_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "renegociacoes_parcelas" (
    "_id" TEXT NOT NULL,
    "renegociacaoId" TEXT NOT NULL,
    "numeroParcela" INTEGER NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "situacao" TEXT NOT NULL DEFAULT 'ABERTA',

    CONSTRAINT "renegociacoes_parcelas_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "motoristas" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "tipo" "TipoMotorista" NOT NULL DEFAULT 'PROPRIO',
    "cnh" TEXT,
    "cnhCategoria" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "motoristas_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "veiculos_entrega" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "marca" TEXT,
    "modelo" TEXT,
    "ano" INTEGER,
    "cor" TEXT,
    "capacidadeKg" DOUBLE PRECISION,
    "tipo" "TipoVeiculo" NOT NULL DEFAULT 'CARRO',
    "proprietarioId" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "veiculos_entrega_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "taxas_entrega" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" "TipoTaxaEntrega" NOT NULL DEFAULT 'FIXA',
    "valor" DOUBLE PRECISION NOT NULL,
    "raioKm" DOUBLE PRECISION,
    "cepInicio" TEXT,
    "cepFim" TEXT,
    "valorMinimoPedido" DOUBLE PRECISION,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "taxas_entrega_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "entregas" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "filialId" TEXT NOT NULL,
    "pedidoVendaId" TEXT,
    "clienteId" TEXT,
    "motoristaId" TEXT,
    "veiculoId" TEXT,
    "transportadoraId" TEXT,
    "tokenRastreio" TEXT NOT NULL,
    "situacao" "SituacaoEntrega" NOT NULL DEFAULT 'PENDENTE',
    "enderecoEntrega" JSONB,
    "dataAgendamento" TIMESTAMP(3),
    "dataSaida" TIMESTAMP(3),
    "dataEntrega" TIMESTAMP(3),
    "dataPrevisao" TIMESTAMP(3),
    "valorFrete" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxaEntregaId" TEXT,
    "observacoes" TEXT,
    "comprovanteUrl" TEXT,
    "assinaturaDigital" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entregas_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "entregas_tentativas" (
    "_id" TEXT NOT NULL,
    "entregaId" TEXT NOT NULL,
    "dataTentativa" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivoFalha" TEXT,
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "entregas_tentativas_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "avaliacoes" (
    "_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "entregaId" TEXT NOT NULL,
    "tokenAvaliacao" TEXT NOT NULL,
    "ratingLoja" INTEGER,
    "ratingPedido" INTEGER,
    "ratingEntrega" INTEGER,
    "comentario" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cnpj_key" ON "empresas"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "filiais_cnpj_key" ON "filiais"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "produtos_empresaId_codigoInterno_key" ON "produtos"("empresaId", "codigoInterno");

-- CreateIndex
CREATE UNIQUE INDEX "produto_variacoes_empresaId_produtoId_sku_key" ON "produto_variacoes"("empresaId", "produtoId", "sku");

-- CreateIndex
CREATE UNIQUE INDEX "produto_lotes_empresaId_produtoId_codigoLote_key" ON "produto_lotes"("empresaId", "produtoId", "codigoLote");

-- CreateIndex
CREATE UNIQUE INDEX "tabelas_preco_empresaId_nome_key" ON "tabelas_preco"("empresaId", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "tabelas_preco_itens_tabelaPrecoId_produtoId_key" ON "tabelas_preco_itens"("tabelaPrecoId", "produtoId");

-- CreateIndex
CREATE UNIQUE INDEX "promocoes_itens_promocaoId_produtoId_key" ON "promocoes_itens"("promocaoId", "produtoId");

-- CreateIndex
CREATE UNIQUE INDEX "unidades_medida_empresaId_simbolo_key" ON "unidades_medida"("empresaId", "simbolo");

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_venda_empresaId_numeroPedido_serie_key" ON "pedidos_venda"("empresaId", "numeroPedido", "serie");

-- CreateIndex
CREATE UNIQUE INDEX "orcamentos_pedidoVendaId_key" ON "orcamentos"("pedidoVendaId");

-- CreateIndex
CREATE UNIQUE INDEX "orcamentos_empresaId_numeroOrcamento_serie_key" ON "orcamentos"("empresaId", "numeroOrcamento", "serie");

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_compra_empresaId_numeroPedido_serie_key" ON "pedidos_compra"("empresaId", "numeroPedido", "serie");

-- CreateIndex
CREATE UNIQUE INDEX "cotacoes_compra_empresaId_numeroCotacao_serie_key" ON "cotacoes_compra"("empresaId", "numeroCotacao", "serie");

-- CreateIndex
CREATE UNIQUE INDEX "entradas_mercadoria_empresaId_numeroNota_serieNota_key" ON "entradas_mercadoria"("empresaId", "numeroNota", "serieNota");

-- CreateIndex
CREATE UNIQUE INDEX "parametros_sistema_empresaId_chave_key" ON "parametros_sistema"("empresaId", "chave");

-- CreateIndex
CREATE UNIQUE INDEX "contas_receber_empresaId_numeroDocumento_numeroParcela_key" ON "contas_receber"("empresaId", "numeroDocumento", "numeroParcela");

-- CreateIndex
CREATE UNIQUE INDEX "boletos_empresaId_numeroBoleto_key" ON "boletos"("empresaId", "numeroBoleto");

-- CreateIndex
CREATE UNIQUE INDEX "bancos_codigo_key" ON "bancos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "vendas_pdv_empresaId_numeroCupom_key" ON "vendas_pdv"("empresaId", "numeroCupom");

-- CreateIndex
CREATE UNIQUE INDEX "operadores_pdv_empresaId_nome_key" ON "operadores_pdv"("empresaId", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "contas_pagar_empresaId_numeroDocumento_numeroParcela_key" ON "contas_pagar"("empresaId", "numeroDocumento", "numeroParcela");

-- CreateIndex
CREATE UNIQUE INDEX "contas_bancarias_empresaId_banco_agencia_conta_key" ON "contas_bancarias"("empresaId", "banco", "agencia", "conta");

-- CreateIndex
CREATE INDEX "cheques_empresaId_idx" ON "cheques"("empresaId");

-- CreateIndex
CREATE INDEX "cheques_situacao_idx" ON "cheques"("situacao");

-- CreateIndex
CREATE INDEX "cheques_dataVencimento_idx" ON "cheques"("dataVencimento");

-- CreateIndex
CREATE UNIQUE INDEX "centros_custo_empresaId_codigo_key" ON "centros_custo"("empresaId", "codigo");

-- CreateIndex
CREATE INDEX "logs_sistema_empresaId_idx" ON "logs_sistema"("empresaId");

-- CreateIndex
CREATE INDEX "logs_sistema_usuarioId_idx" ON "logs_sistema"("usuarioId");

-- CreateIndex
CREATE INDEX "logs_sistema_categoria_idx" ON "logs_sistema"("categoria");

-- CreateIndex
CREATE INDEX "logs_sistema_nivel_idx" ON "logs_sistema"("nivel");

-- CreateIndex
CREATE INDEX "logs_sistema_dataCriacao_idx" ON "logs_sistema"("dataCriacao");

-- CreateIndex
CREATE UNIQUE INDEX "notas_fiscais_pedidoVendaId_key" ON "notas_fiscais"("pedidoVendaId");

-- CreateIndex
CREATE UNIQUE INDEX "notas_fiscais_chaveAcesso_key" ON "notas_fiscais"("chaveAcesso");

-- CreateIndex
CREATE UNIQUE INDEX "notas_fiscais_empresaId_modelo_serie_numero_key" ON "notas_fiscais"("empresaId", "modelo", "serie", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "eventos_nf_notaFiscalId_tipoEvento_sequenciaEvento_key" ON "eventos_nf"("notaFiscalId", "tipoEvento", "sequenciaEvento");

-- CreateIndex
CREATE UNIQUE INDEX "configuracoes_nf_empresaId_key" ON "configuracoes_nf"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "sped_config_empresaId_key" ON "sped_config"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "sped_apuracao_empresaId_periodo_tipo_key" ON "sped_apuracao"("empresaId", "periodo", "tipo");

-- CreateIndex
CREATE UNIQUE INDEX "sped_fiscal_empresaId_periodoIni_periodoFin_key" ON "sped_fiscal"("empresaId", "periodoIni", "periodoFin");

-- CreateIndex
CREATE UNIQUE INDEX "sped_contribuicoes_empresaId_periodoIni_periodoFin_key" ON "sped_contribuicoes"("empresaId", "periodoIni", "periodoFin");

-- CreateIndex
CREATE UNIQUE INDEX "itens_inventario_inventarioId_produtoId_key" ON "itens_inventario"("inventarioId", "produtoId");

-- CreateIndex
CREATE UNIQUE INDEX "plano_contas_empresaId_codigo_key" ON "plano_contas"("empresaId", "codigo");

-- CreateIndex
CREATE INDEX "lancamentos_contabeis_empresaId_idx" ON "lancamentos_contabeis"("empresaId");

-- CreateIndex
CREATE INDEX "lancamentos_contabeis_data_idx" ON "lancamentos_contabeis"("data");

-- CreateIndex
CREATE UNIQUE INDEX "ecf_numeroSerie_key" ON "ecf"("numeroSerie");

-- CreateIndex
CREATE UNIQUE INDEX "reducoes_z_ecfId_numeroReducao_key" ON "reducoes_z"("ecfId", "numeroReducao");

-- CreateIndex
CREATE UNIQUE INDEX "cupons_ecfId_numeroCupom_key" ON "cupons"("ecfId", "numeroCupom");

-- CreateIndex
CREATE UNIQUE INDEX "notas_servico_empresaId_serie_numero_key" ON "notas_servico"("empresaId", "serie", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "veiculos_empresaId_placa_key" ON "veiculos"("empresaId", "placa");

-- CreateIndex
CREATE UNIQUE INDEX "condutores_empresaId_cpf_key" ON "condutores"("empresaId", "cpf");

-- CreateIndex
CREATE UNIQUE INDEX "mdfe_chaveAcesso_key" ON "mdfe"("chaveAcesso");

-- CreateIndex
CREATE UNIQUE INDEX "mdfe_empresaId_serie_numero_key" ON "mdfe"("empresaId", "serie", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "ctes_chaveAcesso_key" ON "ctes"("chaveAcesso");

-- CreateIndex
CREATE UNIQUE INDEX "ctes_empresaId_numero_key" ON "ctes"("empresaId", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "contratos_empresaId_numero_key" ON "contratos"("empresaId", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "garantias_empresaId_numero_key" ON "garantias"("empresaId", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "devolucoes_empresaId_numero_key" ON "devolucoes"("empresaId", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "convenios_empresaId_numero_key" ON "convenios"("empresaId", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "licitacoes_empresaId_numero_key" ON "licitacoes"("empresaId", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "quitacoes_contas_quitacaoId_contaId_tipoConta_key" ON "quitacoes_contas"("quitacaoId", "contaId", "tipoConta");

-- CreateIndex
CREATE UNIQUE INDEX "licencas_chave_key" ON "licencas"("chave");

-- CreateIndex
CREATE UNIQUE INDEX "renegociacoes_contas_renegociacaoId_contaId_tipoConta_key" ON "renegociacoes_contas"("renegociacaoId", "contaId", "tipoConta");

-- CreateIndex
CREATE UNIQUE INDEX "veiculos_entrega_empresaId_placa_key" ON "veiculos_entrega"("empresaId", "placa");

-- CreateIndex
CREATE UNIQUE INDEX "entregas_tokenRastreio_key" ON "entregas"("tokenRastreio");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacoes_entregaId_key" ON "avaliacoes"("entregaId");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacoes_tokenAvaliacao_key" ON "avaliacoes"("tokenAvaliacao");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_matrizId_fkey" FOREIGN KEY ("matrizId") REFERENCES "empresas"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filiais" ADD CONSTRAINT "filiais_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fornecedores" ADD CONSTRAINT "fornecedores_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transportadoras" ADD CONSTRAINT "transportadoras_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendedores" ADD CONSTRAINT "vendedores_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_unidadeMedidaId_fkey" FOREIGN KEY ("unidadeMedidaId") REFERENCES "unidades_medida"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto_variacoes" ADD CONSTRAINT "produto_variacoes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto_variacoes" ADD CONSTRAINT "produto_variacoes_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto_lotes" ADD CONSTRAINT "produto_lotes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto_lotes" ADD CONSTRAINT "produto_lotes_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tabelas_preco" ADD CONSTRAINT "tabelas_preco_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tabelas_preco_itens" ADD CONSTRAINT "tabelas_preco_itens_tabelaPrecoId_fkey" FOREIGN KEY ("tabelaPrecoId") REFERENCES "tabelas_preco"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tabelas_preco_itens" ADD CONSTRAINT "tabelas_preco_itens_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promocoes" ADD CONSTRAINT "promocoes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promocoes_itens" ADD CONSTRAINT "promocoes_itens_promocaoId_fkey" FOREIGN KEY ("promocaoId") REFERENCES "promocoes"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promocoes_itens" ADD CONSTRAINT "promocoes_itens_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_categoriaPaiId_fkey" FOREIGN KEY ("categoriaPaiId") REFERENCES "categorias"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unidades_medida" ADD CONSTRAINT "unidades_medida_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos_venda" ADD CONSTRAINT "pedidos_venda_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos_venda" ADD CONSTRAINT "pedidos_venda_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "filiais"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos_venda" ADD CONSTRAINT "pedidos_venda_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_pedido_venda" ADD CONSTRAINT "itens_pedido_venda_pedidoVendaId_fkey" FOREIGN KEY ("pedidoVendaId") REFERENCES "pedidos_venda"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "itens_pedido_venda" ADD CONSTRAINT "itens_pedido_venda_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orcamentos" ADD CONSTRAINT "orcamentos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orcamentos" ADD CONSTRAINT "orcamentos_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "filiais"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orcamentos" ADD CONSTRAINT "orcamentos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orcamentos" ADD CONSTRAINT "orcamentos_pedidoVendaId_fkey" FOREIGN KEY ("pedidoVendaId") REFERENCES "pedidos_venda"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_orcamento" ADD CONSTRAINT "itens_orcamento_orcamentoId_fkey" FOREIGN KEY ("orcamentoId") REFERENCES "orcamentos"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "itens_orcamento" ADD CONSTRAINT "itens_orcamento_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedidos_compra" ADD CONSTRAINT "pedidos_compra_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos_compra" ADD CONSTRAINT "pedidos_compra_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "fornecedores"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_pedido_compra" ADD CONSTRAINT "itens_pedido_compra_pedidoCompraId_fkey" FOREIGN KEY ("pedidoCompraId") REFERENCES "pedidos_compra"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "itens_pedido_compra" ADD CONSTRAINT "itens_pedido_compra_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cotacoes_compra" ADD CONSTRAINT "cotacoes_compra_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_cotacao_compra" ADD CONSTRAINT "itens_cotacao_compra_cotacaoCompraId_fkey" FOREIGN KEY ("cotacaoCompraId") REFERENCES "cotacoes_compra"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "itens_cotacao_compra" ADD CONSTRAINT "itens_cotacao_compra_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "respostas_cotacao" ADD CONSTRAINT "respostas_cotacao_cotacaoCompraId_fkey" FOREIGN KEY ("cotacaoCompraId") REFERENCES "cotacoes_compra"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "respostas_cotacao" ADD CONSTRAINT "respostas_cotacao_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "fornecedores"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entradas_mercadoria" ADD CONSTRAINT "entradas_mercadoria_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entradas_mercadoria" ADD CONSTRAINT "entradas_mercadoria_pedidoCompraId_fkey" FOREIGN KEY ("pedidoCompraId") REFERENCES "pedidos_compra"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_entrada" ADD CONSTRAINT "itens_entrada_entradaMercadoriaId_fkey" FOREIGN KEY ("entradaMercadoriaId") REFERENCES "entradas_mercadoria"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "itens_entrada" ADD CONSTRAINT "itens_entrada_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "parametros_sistema" ADD CONSTRAINT "parametros_sistema_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes_estoque" ADD CONSTRAINT "movimentacoes_estoque_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes_estoque" ADD CONSTRAINT "movimentacoes_estoque_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_receber" ADD CONSTRAINT "contas_receber_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_receber" ADD CONSTRAINT "contas_receber_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_receber" ADD CONSTRAINT "contas_receber_pedidoVendaId_fkey" FOREIGN KEY ("pedidoVendaId") REFERENCES "pedidos_venda"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_receber" ADD CONSTRAINT "contas_receber_centroCustoId_fkey" FOREIGN KEY ("centroCustoId") REFERENCES "centros_custo"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_contaReceberId_fkey" FOREIGN KEY ("contaReceberId") REFERENCES "contas_receber"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remessas_boleto" ADD CONSTRAINT "remessas_boleto_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendas_pdv" ADD CONSTRAINT "vendas_pdv_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendas_pdv" ADD CONSTRAINT "vendas_pdv_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "filiais"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendas_pdv" ADD CONSTRAINT "vendas_pdv_operadorId_fkey" FOREIGN KEY ("operadorId") REFERENCES "operadores_pdv"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendas_pdv" ADD CONSTRAINT "vendas_pdv_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_venda_pdv" ADD CONSTRAINT "itens_venda_pdv_vendaPDVId_fkey" FOREIGN KEY ("vendaPDVId") REFERENCES "vendas_pdv"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_venda_pdv" ADD CONSTRAINT "itens_venda_pdv_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operadores_pdv" ADD CONSTRAINT "operadores_pdv_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caixas" ADD CONSTRAINT "caixas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caixas" ADD CONSTRAINT "caixas_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "filiais"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caixas" ADD CONSTRAINT "caixas_operadorId_fkey" FOREIGN KEY ("operadorId") REFERENCES "operadores_pdv"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_pagar" ADD CONSTRAINT "contas_pagar_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_pagar" ADD CONSTRAINT "contas_pagar_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "fornecedores"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_pagar" ADD CONSTRAINT "contas_pagar_pedidoCompraId_fkey" FOREIGN KEY ("pedidoCompraId") REFERENCES "pedidos_compra"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_pagar" ADD CONSTRAINT "contas_pagar_centroCustoId_fkey" FOREIGN KEY ("centroCustoId") REFERENCES "centros_custo"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_bancarias" ADD CONSTRAINT "contas_bancarias_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes_bancarias" ADD CONSTRAINT "movimentacoes_bancarias_contaBancariaId_fkey" FOREIGN KEY ("contaBancariaId") REFERENCES "contas_bancarias"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes_bancarias" ADD CONSTRAINT "movimentacoes_bancarias_conciliacaoId_fkey" FOREIGN KEY ("conciliacaoId") REFERENCES "conciliacoes"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conciliacoes" ADD CONSTRAINT "conciliacoes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conciliacoes" ADD CONSTRAINT "conciliacoes_contaBancariaId_fkey" FOREIGN KEY ("contaBancariaId") REFERENCES "contas_bancarias"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cheques" ADD CONSTRAINT "cheques_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cheques" ADD CONSTRAINT "cheques_contaBancariaId_fkey" FOREIGN KEY ("contaBancariaId") REFERENCES "contas_bancarias"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cheques" ADD CONSTRAINT "cheques_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cheques" ADD CONSTRAINT "cheques_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "fornecedores"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "centros_custo" ADD CONSTRAINT "centros_custo_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "centros_custo" ADD CONSTRAINT "centros_custo_centroPaiId_fkey" FOREIGN KEY ("centroPaiId") REFERENCES "centros_custo"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fluxo_caixa" ADD CONSTRAINT "fluxo_caixa_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fluxo_caixa" ADD CONSTRAINT "fluxo_caixa_centroCustoId_fkey" FOREIGN KEY ("centroCustoId") REFERENCES "centros_custo"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas_fiscais" ADD CONSTRAINT "notas_fiscais_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas_fiscais" ADD CONSTRAINT "notas_fiscais_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "filiais"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas_fiscais" ADD CONSTRAINT "notas_fiscais_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas_fiscais" ADD CONSTRAINT "notas_fiscais_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "fornecedores"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas_fiscais" ADD CONSTRAINT "notas_fiscais_pedidoVendaId_fkey" FOREIGN KEY ("pedidoVendaId") REFERENCES "pedidos_venda"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_nota_fiscal" ADD CONSTRAINT "itens_nota_fiscal_notaFiscalId_fkey" FOREIGN KEY ("notaFiscalId") REFERENCES "notas_fiscais"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_nota_fiscal" ADD CONSTRAINT "itens_nota_fiscal_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_nf" ADD CONSTRAINT "eventos_nf_notaFiscalId_fkey" FOREIGN KEY ("notaFiscalId") REFERENCES "notas_fiscais"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuracoes_nf" ADD CONSTRAINT "configuracoes_nf_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sped_config" ADD CONSTRAINT "sped_config_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sped_apuracao" ADD CONSTRAINT "sped_apuracao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sped_fiscal" ADD CONSTRAINT "sped_fiscal_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sped_contribuicoes" ADD CONSTRAINT "sped_contribuicoes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventarios" ADD CONSTRAINT "inventarios_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventarios" ADD CONSTRAINT "inventarios_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "filiais"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_inventario" ADD CONSTRAINT "itens_inventario_inventarioId_fkey" FOREIGN KEY ("inventarioId") REFERENCES "inventarios"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_inventario" ADD CONSTRAINT "itens_inventario_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plano_contas" ADD CONSTRAINT "plano_contas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plano_contas" ADD CONSTRAINT "plano_contas_contaPaiId_fkey" FOREIGN KEY ("contaPaiId") REFERENCES "plano_contas"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lancamentos_contabeis" ADD CONSTRAINT "lancamentos_contabeis_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentos_contabeis" ADD CONSTRAINT "lancamentos_contabeis_planoContaId_fkey" FOREIGN KEY ("planoContaId") REFERENCES "plano_contas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_cupom" ADD CONSTRAINT "itens_cupom_cupomId_fkey" FOREIGN KEY ("cupomId") REFERENCES "cupons"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas_servico" ADD CONSTRAINT "notas_servico_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas_servico" ADD CONSTRAINT "notas_servico_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "filiais"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas_servico" ADD CONSTRAINT "notas_servico_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_servico" ADD CONSTRAINT "itens_servico_notaServicoId_fkey" FOREIGN KEY ("notaServicoId") REFERENCES "notas_servico"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veiculos" ADD CONSTRAINT "veiculos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condutores" ADD CONSTRAINT "condutores_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mdfe" ADD CONSTRAINT "mdfe_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mdfe" ADD CONSTRAINT "mdfe_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "filiais"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mdfe" ADD CONSTRAINT "mdfe_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "veiculos"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mdfe" ADD CONSTRAINT "mdfe_condutorId_fkey" FOREIGN KEY ("condutorId") REFERENCES "condutores"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mdfe_documentos" ADD CONSTRAINT "mdfe_documentos_mdfeId_fkey" FOREIGN KEY ("mdfeId") REFERENCES "mdfe"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mdfe_eventos" ADD CONSTRAINT "mdfe_eventos_mdfeId_fkey" FOREIGN KEY ("mdfeId") REFERENCES "mdfe"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctes" ADD CONSTRAINT "ctes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctes" ADD CONSTRAINT "ctes_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "filiais"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctes" ADD CONSTRAINT "ctes_tomadorId_fkey" FOREIGN KEY ("tomadorId") REFERENCES "clientes"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctes" ADD CONSTRAINT "ctes_remetenteId_fkey" FOREIGN KEY ("remetenteId") REFERENCES "clientes"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctes" ADD CONSTRAINT "ctes_destinatarioId_fkey" FOREIGN KEY ("destinatarioId") REFERENCES "clientes"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_templates" ADD CONSTRAINT "report_templates_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contrato_medicoes" ADD CONSTRAINT "contrato_medicoes_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "garantias" ADD CONSTRAINT "garantias_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "garantias" ADD CONSTRAINT "garantias_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "garantias" ADD CONSTRAINT "garantias_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "garantia_regras" ADD CONSTRAINT "garantia_regras_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devolucoes" ADD CONSTRAINT "devolucoes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devolucoes" ADD CONSTRAINT "devolucoes_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devolucoes" ADD CONSTRAINT "devolucoes_pedidoVendaId_fkey" FOREIGN KEY ("pedidoVendaId") REFERENCES "pedidos_venda"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devolucao_itens" ADD CONSTRAINT "devolucao_itens_devolucaoId_fkey" FOREIGN KEY ("devolucaoId") REFERENCES "devolucoes"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devolucao_itens" ADD CONSTRAINT "devolucao_itens_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "convenios" ADD CONSTRAINT "convenios_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "convenios" ADD CONSTRAINT "convenios_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licitacoes" ADD CONSTRAINT "licitacoes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licitacoes_itens" ADD CONSTRAINT "licitacoes_itens_licitacaoId_fkey" FOREIGN KEY ("licitacaoId") REFERENCES "licitacoes"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licitacoes_itens" ADD CONSTRAINT "licitacoes_itens_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adiantamentos" ADD CONSTRAINT "adiantamentos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adiantamentos" ADD CONSTRAINT "adiantamentos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adiantamentos" ADD CONSTRAINT "adiantamentos_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "fornecedores"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quitacoes" ADD CONSTRAINT "quitacoes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quitacoes" ADD CONSTRAINT "quitacoes_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quitacoes" ADD CONSTRAINT "quitacoes_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "fornecedores"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quitacoes_contas" ADD CONSTRAINT "quitacoes_contas_quitacaoId_fkey" FOREIGN KEY ("quitacaoId") REFERENCES "quitacoes"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licencas" ADD CONSTRAINT "licencas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licencas" ADD CONSTRAINT "licencas_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "planos"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licencas_log" ADD CONSTRAINT "licencas_log_licencaId_fkey" FOREIGN KEY ("licencaId") REFERENCES "licencas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_oportunidades" ADD CONSTRAINT "crm_oportunidades_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "crm_pipelines"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_oportunidade_itens" ADD CONSTRAINT "crm_oportunidade_itens_oportunidadeId_fkey" FOREIGN KEY ("oportunidadeId") REFERENCES "crm_oportunidades"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_oportunidade_historico" ADD CONSTRAINT "crm_oportunidade_historico_oportunidadeId_fkey" FOREIGN KEY ("oportunidadeId") REFERENCES "crm_oportunidades"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_tarefas" ADD CONSTRAINT "crm_tarefas_oportunidadeId_fkey" FOREIGN KEY ("oportunidadeId") REFERENCES "crm_oportunidades"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_interacoes" ADD CONSTRAINT "crm_interacoes_oportunidadeId_fkey" FOREIGN KEY ("oportunidadeId") REFERENCES "crm_oportunidades"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automacao_logs" ADD CONSTRAINT "automacao_logs_automacaoId_fkey" FOREIGN KEY ("automacaoId") REFERENCES "automacoes"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "renegociacoes" ADD CONSTRAINT "renegociacoes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "renegociacoes" ADD CONSTRAINT "renegociacoes_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "renegociacoes" ADD CONSTRAINT "renegociacoes_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "fornecedores"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "renegociacoes_contas" ADD CONSTRAINT "renegociacoes_contas_renegociacaoId_fkey" FOREIGN KEY ("renegociacaoId") REFERENCES "renegociacoes"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "renegociacoes_parcelas" ADD CONSTRAINT "renegociacoes_parcelas_renegociacaoId_fkey" FOREIGN KEY ("renegociacaoId") REFERENCES "renegociacoes"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "motoristas" ADD CONSTRAINT "motoristas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veiculos_entrega" ADD CONSTRAINT "veiculos_entrega_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxas_entrega" ADD CONSTRAINT "taxas_entrega_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas" ADD CONSTRAINT "entregas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas" ADD CONSTRAINT "entregas_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "filiais"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas" ADD CONSTRAINT "entregas_pedidoVendaId_fkey" FOREIGN KEY ("pedidoVendaId") REFERENCES "pedidos_venda"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas" ADD CONSTRAINT "entregas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas" ADD CONSTRAINT "entregas_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "motoristas"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas" ADD CONSTRAINT "entregas_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "veiculos_entrega"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas" ADD CONSTRAINT "entregas_transportadoraId_fkey" FOREIGN KEY ("transportadoraId") REFERENCES "transportadoras"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas" ADD CONSTRAINT "entregas_taxaEntregaId_fkey" FOREIGN KEY ("taxaEntregaId") REFERENCES "taxas_entrega"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas_tentativas" ADD CONSTRAINT "entregas_tentativas_entregaId_fkey" FOREIGN KEY ("entregaId") REFERENCES "entregas"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_entregaId_fkey" FOREIGN KEY ("entregaId") REFERENCES "entregas"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

