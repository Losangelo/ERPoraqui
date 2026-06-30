"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting seed...');
    let empresa = await prisma.empresa.findUnique({
        where: { cnpj: '12.345.678/0001-90' }
    });
    if (!empresa) {
        empresa = await prisma.empresa.create({
            data: {
                razaoSocial: 'ERPoraqui Comércio Ltda',
                nomeFantasia: 'ERPoraqui',
                cnpj: '12.345.678/0001-90',
                inscricaoEstadual: '123.456.789.001',
                inscricaoMunicipal: '567890',
                telefone: '(11) 3456-7890',
                email: 'contato@erporaqui.com.br',
                site: 'https://erporaqui.com.br',
                regimeTributario: client_1.RegimeTributario.LUCRO_PRESUMIDO,
                ativo: true,
                endereco: {
                    logradouro: 'Av. Paulista',
                    numero: '1000',
                    complemento: 'Andar 10',
                    bairro: 'Bela Vista',
                    cidade: 'São Paulo',
                    uf: 'SP',
                    cep: '01310-100'
                }
            }
        });
        console.log('✅ Empresa created:', empresa.nomeFantasia);
    }
    else {
        console.log('✅ Empresa already exists:', empresa.nomeFantasia);
    }
    let filial = await prisma.filial.findFirst({
        where: { empresaId: empresa.id }
    });
    if (!filial) {
        filial = await prisma.filial.create({
            data: {
                empresaId: empresa.id,
                razaoSocial: 'ERPoraqui Comércio Ltda - Filial SP',
                nomeFantasia: 'Filial São Paulo',
                cnpj: '12.345.678/0002-80',
                inscricaoEstadual: '123.456.789.002',
                inscricaoMunicipal: '567891',
                telefone: '(11) 3456-7891',
                email: 'filial.sp@erporaqui.com.br',
                filialMatriz: true,
                numeroNF: 100,
                serieNF: '1',
                ativo: true,
                endereco: {
                    logradouro: 'Av. Paulista',
                    numero: '1000',
                    complemento: 'Andar 10',
                    bairro: 'Bela Vista',
                    cidade: 'São Paulo',
                    uf: 'SP',
                    cep: '01310-100'
                }
            }
        });
        console.log('✅ Filial created:', filial.nomeFantasia);
    }
    else {
        console.log('✅ Filial already exists:', filial.nomeFantasia);
    }
    const hashedPassword = await bcryptjs_1.default.hash('admin123', 10);
    let usuario = await prisma.usuario.findUnique({
        where: { email: 'admin@erporaqui.com.br' }
    });
    if (!usuario) {
        usuario = await prisma.usuario.create({
            data: {
                empresaId: empresa.id,
                email: 'admin@erporaqui.com.br',
                nome: 'Administrador',
                senha: hashedPassword,
                perfil: client_1.PerfilUsuario.ADMINISTRADOR,
                ativo: true
            }
        });
        console.log('✅ Usuario created:', usuario.email);
    }
    else {
        console.log('✅ Usuario already exists:', usuario.email);
    }
    const existingUnidades = await prisma.unidadeMedida.findMany({
        where: { empresaId: empresa.id }
    });
    if (existingUnidades.length === 0) {
        await Promise.all([
            prisma.unidadeMedida.create({ data: { empresaId: empresa.id, simbolo: 'UN', descricao: 'Unidade', fracionada: false, ativo: true } }),
            prisma.unidadeMedida.create({ data: { empresaId: empresa.id, simbolo: 'KG', descricao: 'Quilograma', fracionada: true, ativo: true } }),
            prisma.unidadeMedida.create({ data: { empresaId: empresa.id, simbolo: 'LT', descricao: 'Litro', fracionada: true, ativo: true } }),
            prisma.unidadeMedida.create({ data: { empresaId: empresa.id, simbolo: 'CX', descricao: 'Caixa', fracionada: false, ativo: true } }),
            prisma.unidadeMedida.create({ data: { empresaId: empresa.id, simbolo: 'PC', descricao: 'Peça', fracionada: false, ativo: true } }),
        ]);
        console.log('✅ Unidades de Medida created');
    }
    else {
        console.log('✅ Unidades de Medida already exist');
    }
    const unidades = await prisma.unidadeMedida.findMany({ where: { empresaId: empresa.id } });
    const un = unidades.find(u => u.simbolo === 'UN') || unidades[0];
    const existingCategorias = await prisma.categoria.findMany({
        where: { empresaId: empresa.id }
    });
    if (existingCategorias.length === 0) {
        await Promise.all([
            prisma.categoria.create({ data: { empresaId: empresa.id, nome: 'Eletrônicos', descricao: 'Produtos eletrônicos', ativo: true } }),
            prisma.categoria.create({ data: { empresaId: empresa.id, nome: 'Informática', descricao: 'Produtos de informática', ativo: true } }),
            prisma.categoria.create({ data: { empresaId: empresa.id, nome: 'Acessórios', descricao: 'Acessórios diversos', ativo: true } }),
            prisma.categoria.create({ data: { empresaId: empresa.id, nome: 'Móveis', descricao: 'Móveis e decoração', ativo: true } }),
            prisma.categoria.create({ data: { empresaId: empresa.id, nome: 'Alimentos', descricao: 'Alimentos e bebidas', ativo: true } }),
        ]);
        console.log('✅ Categorias created');
    }
    else {
        console.log('✅ Categorias already exist');
    }
    const categorias = await prisma.categoria.findMany({ where: { empresaId: empresa.id } });
    const catInformatica = categorias.find(c => c.nome === 'Informática') || categorias[0];
    const catAcessorios = categorias.find(c => c.nome === 'Acessórios') || categorias[1];
    const catMoveis = categorias.find(c => c.nome === 'Móveis') || categorias[2];
    const catAlimentos = categorias.find(c => c.nome === 'Alimentos') || categorias[3];
    const existingClientes = await prisma.cliente.count({ where: { empresaId: empresa.id } });
    if (existingClientes === 0) {
        await Promise.all([
            prisma.cliente.create({
                data: {
                    empresaId: empresa.id, nome: 'João Silva Santos', tipoPessoa: client_1.TipoPessoa.FISICA, documento: '123.456.789-00',
                    telefone: '(11) 99999-1111', telefoneCelular: '(11) 99999-1111', email: 'joao.silva@email.com',
                    limiteCredito: 10000, ativo: true,
                    endereco: { logradouro: 'Rua das Flores', numero: '100', bairro: 'Jardim Primavera', cidade: 'São Paulo', uf: 'SP', cep: '01234-567' }
                }
            }),
            prisma.cliente.create({
                data: {
                    empresaId: empresa.id, nome: 'Maria Oliveira Souza', tipoPessoa: client_1.TipoPessoa.FISICA, documento: '987.654.321-00',
                    telefone: '(11) 99999-2222', telefoneCelular: '(11) 99999-2222', email: 'maria.oliveira@email.com',
                    limiteCredito: 5000, ativo: true,
                    endereco: { logradouro: 'Av. Brasil', numero: '500', bairro: 'Centro', cidade: 'São Paulo', uf: 'SP', cep: '01000-000' }
                }
            }),
            prisma.cliente.create({
                data: {
                    empresaId: empresa.id, nome: 'Empresa ABC Ltda', tipoPessoa: client_1.TipoPessoa.JURIDICA, documento: '12.345.678/0001-00',
                    inscricaoEstadual: '123.456.789', telefone: '(11) 3333-4444', telefoneCelular: '(11) 99999-3333', email: 'contato@empresaabc.com.br',
                    limiteCredito: 50000, ativo: true,
                    endereco: { logradouro: 'Av. Paulista', numero: '2000', bairro: 'Bela Vista', cidade: 'São Paulo', uf: 'SP', cep: '01310-200' }
                }
            }),
        ]);
        console.log('✅ Clientes created');
    }
    else {
        console.log('✅ Clientes already exist:', existingClientes);
    }
    const clientes = await prisma.cliente.findMany({ where: { empresaId: empresa.id }, take: 3 });
    const existingFornecedores = await prisma.fornecedor.count({ where: { empresaId: empresa.id } });
    if (existingFornecedores === 0) {
        await Promise.all([
            prisma.fornecedor.create({
                data: {
                    empresaId: empresa.id, nome: 'Fornecedor Tech Ltda', tipoPessoa: client_1.TipoPessoa.JURIDICA, documento: '11.111.111/0001-11',
                    inscricaoEstadual: '111.111.111', telefone: '(11) 1111-2222', telefoneCelular: '(11) 91111-1111', email: 'vendas@forntech.com.br',
                    ativo: true, endereco: { logradouro: 'Av. Marginal', numero: '500', bairro: 'Ponte Grande', cidade: 'São Paulo', uf: 'SP', cep: '02000-000' }
                }
            }),
            prisma.fornecedor.create({
                data: {
                    empresaId: empresa.id, nome: 'Distribuidora Nacional SA', tipoPessoa: client_1.TipoPessoa.JURIDICA, documento: '22.222.222/0001-22',
                    inscricaoEstadual: '222.222.222', telefone: '(11) 2222-3333', telefoneCelular: '(11) 92222-2222', email: 'comercial@distnacional.com.br',
                    ativo: true, endereco: { logradouro: 'Rod. Anhanguera', numero: '1000', bairro: 'Distrito Industrial', cidade: 'São Paulo', uf: 'SP', cep: '03000-000' }
                }
            }),
        ]);
        console.log('✅ Fornecedores created');
    }
    else {
        console.log('✅ Fornecedores already exist:', existingFornecedores);
    }
    const fornecedores = await prisma.fornecedor.findMany({ where: { empresaId: empresa.id }, take: 2 });
    const fornTech = fornecedores[0];
    const fornDist = fornecedores[1];
    const existingVendedores = await prisma.vendedor.count({ where: { empresaId: empresa.id } });
    if (existingVendedores === 0) {
        await Promise.all([
            prisma.vendedor.create({ data: { empresaId: empresa.id, nome: 'Carlos Alberto Souza', tipoPessoa: client_1.TipoPessoa.FISICA, documento: '111.222.333-44', telefone: '(11) 97777-1111', telefoneCelular: '(11) 97777-1111', email: 'carlos.alberto@erporaqui.com.br', comissao: 5.0, ativo: true } }),
            prisma.vendedor.create({ data: { empresaId: empresa.id, nome: 'Ana Paula Rodrigues', tipoPessoa: client_1.TipoPessoa.FISICA, documento: '222.333.444-55', telefone: '(11) 97777-2222', telefoneCelular: '(11) 97777-2222', email: 'ana.paula@erporaqui.com.br', comissao: 4.5, ativo: true } }),
        ]);
        console.log('✅ Vendedores created');
    }
    else {
        console.log('✅ Vendedores already exist:', existingVendedores);
    }
    const existingProdutos = await prisma.produto.count({ where: { empresaId: empresa.id } });
    if (existingProdutos === 0) {
        await Promise.all([
            prisma.produto.create({ data: { empresaId: empresa.id, codigoInterno: 'ELE-001', codigoBarras: '7891234560012', gtin: '7891234560012', nome: 'Notebook Dell Inspiron 15', descricao: 'Notebook Dell Inspiron 15 3000', descricaoDetalhada: 'Intel Core i5, 8GB RAM, 256GB SSD, Tela 15.6"', categoriaId: catInformatica.id, unidadeMedidaId: un.id, precoVenda: 3500.00, precoCusto: 2800.00, precoMinimo: 3200.00, quantidadeEstoque: 15, estoqueMinimo: 5, estoqueMaximo: 50, ncm: '8471.30.90', cest: '01.069.00', origenMercadoria: client_1.OrigemMercadoria.NACIONAL, ativo: true } }),
            prisma.produto.create({ data: { empresaId: empresa.id, codigoInterno: 'ELE-002', codigoBarras: '7891234560029', gtin: '7891234560029', nome: 'Mouse Wireless Microsoft', descricao: 'Mouse sem fio Microsoft Sculpt', categoriaId: catInformatica.id, unidadeMedidaId: un.id, precoVenda: 150.00, precoCusto: 80.00, precoMinimo: 120.00, quantidadeEstoque: 50, estoqueMinimo: 10, estoqueMaximo: 100, ncm: '8471.60.70', cest: '01.069.00', origenMercadoria: client_1.OrigemMercadoria.NACIONAL, ativo: true } }),
            prisma.produto.create({ data: { empresaId: empresa.id, codigoInterno: 'ELE-003', codigoBarras: '7891234560036', gtin: '7891234560036', nome: 'Teclado Mecânico RGB', descricao: 'Teclado mecânico com iluminação RGB', categoriaId: catInformatica.id, unidadeMedidaId: un.id, precoVenda: 450.00, precoCusto: 280.00, precoMinimo: 380.00, quantidadeEstoque: 25, estoqueMinimo: 5, estoqueMaximo: 50, ncm: '8471.60.60', cest: '01.069.00', origenMercadoria: client_1.OrigemMercadoria.ESTRANGEIRA_IMPORTACAO_DIRETA, ativo: true } }),
            prisma.produto.create({ data: { empresaId: empresa.id, codigoInterno: 'ACC-001', codigoBarras: '7891234560043', gtin: '7891234560043', nome: 'Fone de Ouvido Bluetooth', descricao: 'Fone de ouvido sem fio Bluetooth 5.0', categoriaId: catAcessorios.id, unidadeMedidaId: un.id, precoVenda: 250.00, precoCusto: 120.00, precoMinimo: 200.00, quantidadeEstoque: 40, estoqueMinimo: 10, estoqueMaximo: 80, ncm: '8518.30.00', cest: '01.058.00', origenMercadoria: client_1.OrigemMercadoria.NACIONAL, ativo: true } }),
            prisma.produto.create({ data: { empresaId: empresa.id, codigoInterno: 'ACC-002', codigoBarras: '7891234560050', gtin: '7891234560050', nome: 'Carregador Universal', descricao: 'Carregador universal 65W USB-C', categoriaId: catAcessorios.id, unidadeMedidaId: un.id, precoVenda: 180.00, precoCusto: 90.00, precoMinimo: 140.00, quantidadeEstoque: 60, estoqueMinimo: 15, estoqueMaximo: 100, ncm: '8504.40.10', cest: '01.075.00', origenMercadoria: client_1.OrigemMercadoria.ESTRANGEIRA_NACIONALIZADA, ativo: true } }),
            prisma.produto.create({ data: { empresaId: empresa.id, codigoInterno: 'MOV-001', codigoBarras: '7891234560074', gtin: '7891234560074', nome: 'Cadeira Gamer Pro', descricao: 'Cadeira gamer reclinável com apoio lumbar', categoriaId: catMoveis.id, unidadeMedidaId: un.id, precoVenda: 1200.00, precoCusto: 750.00, precoMinimo: 1000.00, quantidadeEstoque: 10, estoqueMinimo: 3, estoqueMaximo: 20, ncm: '9401.61.00', cest: '01.004.00', origenMercadoria: client_1.OrigemMercadoria.NACIONAL, ativo: true } }),
            prisma.produto.create({ data: { empresaId: empresa.id, codigoInterno: 'MOV-002', codigoBarras: '7891234560081', gtin: '7891234560081', nome: 'Mesa Escritório 120cm', descricao: 'Mesa de escritório com gavetas', categoriaId: catMoveis.id, unidadeMedidaId: un.id, precoVenda: 650.00, precoCusto: 400.00, precoMinimo: 550.00, quantidadeEstoque: 8, estoqueMinimo: 2, estoqueMaximo: 15, ncm: '9403.30.00', cest: '01.004.00', origenMercadoria: client_1.OrigemMercadoria.NACIONAL, ativo: true } }),
            prisma.produto.create({ data: { empresaId: empresa.id, codigoInterno: 'ALI-001', codigoBarras: '7891234560098', gtin: '7891234560098', nome: 'Café Torrado 1kg', descricao: 'Café torrado e moído pacote 1kg', categoriaId: catAlimentos.id, unidadeMedidaId: un.id, precoVenda: 45.00, precoCusto: 25.00, precoMinimo: 38.00, quantidadeEstoque: 100, estoqueMinimo: 30, estoqueMaximo: 200, ncm: '0901.21.00', cest: '01.001.02', origenMercadoria: client_1.OrigemMercadoria.NACIONAL, ativo: true } }),
        ]);
        console.log('✅ Produtos created');
    }
    else {
        console.log('✅ Produtos already exist:', existingProdutos);
    }
    const produtos = await prisma.produto.findMany({ where: { empresaId: empresa.id }, take: 5 });
    const prod1 = produtos[0];
    const prod2 = produtos[1];
    const prod3 = produtos[2];
    const prod4 = produtos[3];
    const existingPedidos = await prisma.pedidoVenda.count({ where: { empresaId: empresa.id } });
    if (existingPedidos === 0 && produtos.length >= 2) {
        await prisma.pedidoVenda.create({
            data: {
                empresaId: empresa.id, filialId: filial.id, clienteId: clientes[0].id,
                numeroPedido: 'PV-2026-0001', serie: '1', tipoOperacao: 'VENDA', situacao: client_1.SituacaoPedido.CONFIRMADO,
                dataEmissao: new Date(), dataEntrega: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                valorTotal: 3650.00, valorDesconto: 150.00, valorFrete: 50.00, observacoes: 'Entregar no período da manhã',
                itens: {
                    create: [
                        { produtoId: prod1.id, numeroItem: 1, quantidade: 1, unidadeMedida: 'UN', valorUnitario: 3500.00, valorTotal: 3500.00, valorDesconto: 150.00 },
                        { produtoId: prod2.id, numeroItem: 2, quantidade: 1, unidadeMedida: 'UN', valorUnitario: 150.00, valorTotal: 150.00 },
                    ]
                }
            }
        });
        console.log('✅ Pedidos de Venda created');
    }
    else {
        console.log('✅ Pedidos de Venda already exist:', existingPedidos);
    }
    const existingFluxo = await prisma.fluxoCaixa.count({ where: { empresaId: empresa.id } });
    if (existingFluxo === 0) {
        await Promise.all([
            prisma.fluxoCaixa.create({ data: { empresaId: empresa.id, tipo: client_1.TipoFluxoCaixa.ENTRADA, categoria: 'Vendas', descricao: 'Venda Notebook Dell', valor: 3500.00, formaPagamento: client_1.FormaPagamento.DINHEIRO, dataMovimentacao: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) } }),
            prisma.fluxoCaixa.create({ data: { empresaId: empresa.id, tipo: client_1.TipoFluxoCaixa.ENTRADA, categoria: 'Vendas', descricao: 'Venda Fones Bluetooth', valor: 500.00, formaPagamento: client_1.FormaPagamento.PIX, dataMovimentacao: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) } }),
            prisma.fluxoCaixa.create({ data: { empresaId: empresa.id, tipo: client_1.TipoFluxoCaixa.SAIDA, categoria: 'Fornecedores', descricao: 'Pagamento Fornecedor Tech', valor: 2800.00, formaPagamento: client_1.FormaPagamento.TRANSFERENCIA, dataMovimentacao: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) } }),
            prisma.fluxoCaixa.create({ data: { empresaId: empresa.id, tipo: client_1.TipoFluxoCaixa.SAIDA, categoria: 'Aluguel', descricao: 'Aluguel Escritório Março', valor: 5500.00, formaPagamento: client_1.FormaPagamento.TRANSFERENCIA, dataMovimentacao: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) } }),
        ]);
        console.log('✅ Fluxo de Caixa created');
    }
    else {
        console.log('✅ Fluxo de Caixa already exist:', existingFluxo);
    }
    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📋 Credenciais de acesso:');
    console.log('   Email: admin@erporaqui.com.br');
    console.log('   Senha: admin123');
}
main()
    .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map