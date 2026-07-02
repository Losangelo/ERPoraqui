interface HelpMapEntry {
  file: string;
  title: string;
}

export const routeHelpMap: Record<string, HelpMapEntry> = {
  // Vendas
  '/':                                { file: 'summary', title: 'Manual de Treinamento' },
  '/pdv':                             { file: 'pdv', title: 'PDV (Ponto de Venda)' },
  '/orcamentos':                      { file: 'orcamentos-vendas', title: 'Orçamentos de Vendas' },
  '/orders':                          { file: 'orcamentos-vendas', title: 'Orçamentos de Vendas' },

  // CRM
  '/crm':                             { file: 'crm', title: 'CRM (Gestão de Relacionamento)' },
  '/crm/campanhas':                   { file: 'crm', title: 'CRM (Gestão de Relacionamento)' },
  '/customers':                       { file: 'crm', title: 'CRM (Gestão de Relacionamento)' },

  // Fiscal
  '/notas-fiscais':                   { file: 'nfe-nfce', title: 'NF-e / NFC-e' },
  '/nfce':                            { file: 'nfe-nfce', title: 'NF-e / NFC-e' },
  '/ecf':                             { file: 'nfe-nfce', title: 'NF-e / NFC-e' },
  '/nfse':                            { file: 'nfse', title: 'NFSe (Nota Fiscal de Serviços)' },
  '/sped-fiscal':                     { file: 'sped-fiscal', title: 'SPED Fiscal' },
  '/mdfe':                            { file: 'mdfe', title: 'MDF-e (Manifesto Eletrônico)' },
  '/veiculos':                        { file: 'mdfe', title: 'MDF-e (Manifesto Eletrônico)' },
  '/condutores':                      { file: 'mdfe', title: 'MDF-e (Manifesto Eletrônico)' },

  // Promoções
  '/promocoes':                       { file: 'promocoes', title: 'Promoções' },

  // CT-e
  '/cte':                             { file: 'cte', title: 'CT-e (Conhecimento de Transporte Eletrônico)' },

  // Contratos / Garantias / Devoluções
  '/contratos':                       { file: 'contratos-garantias-devolucoes', title: 'Contratos, Garantias e Devoluções' },
  '/garantias':                       { file: 'contratos-garantias-devolucoes', title: 'Contratos, Garantias e Devoluções' },
  '/devolucoes':                      { file: 'contratos-garantias-devolucoes', title: 'Contratos, Garantias e Devoluções' },

  // Financeiro
  '/contas-receber':                  { file: 'financeiro', title: 'Financeiro' },
  '/contas-pagar':                    { file: 'financeiro', title: 'Financeiro' },
  '/fluxo-caixa':                     { file: 'financeiro', title: 'Financeiro' },
  '/dre':                             { file: 'financeiro', title: 'Financeiro' },
  '/plano-contas':                    { file: 'financeiro', title: 'Financeiro' },
  '/boletos':                         { file: 'boletos-cnab', title: 'Boletos / CNAB' },
  '/cheques':                         { file: 'cheques', title: 'Cheques' },
  '/centros-custo':                   { file: 'centro-custo', title: 'Centro de Custo' },
  '/renegociacao':                    { file: 'financeiro', title: 'Financeiro (Renegociação)' },
  '/conciliacao':                     { file: 'financeiro', title: 'Financeiro (Conciliação Bancária)' },
  '/adiantamentos':                   { file: 'adiantamentos-quitacoes', title: 'Adiantamentos' },
  '/quitacoes':                       { file: 'adiantamentos-quitacoes', title: 'Quitações' },

  // Estoque e Produtos
  '/products':                        { file: 'estoque-avancado', title: 'Estoque Avançado' },
  '/produtos-variacoes':              { file: 'estoque-avancado', title: 'Estoque Avançado' },
  '/produtos-lotes':                  { file: 'estoque-avancado', title: 'Estoque Avançado' },
  '/tabelas-preco':                   { file: 'estoque-avancado', title: 'Estoque Avançado' },
  '/estoque':                         { file: 'estoque-avancado', title: 'Estoque Avançado' },
  '/estoque/movimentacoes':           { file: 'estoque-avancado', title: 'Estoque Avançado' },
  '/estoque/categorias':              { file: 'estoque-avancado', title: 'Estoque Avançado' },
  '/estoque/unidades':                { file: 'estoque-avancado', title: 'Estoque Avançado' },
  '/estoque/kardex':                  { file: 'estoque-avancado', title: 'Estoque Avançado (Kardex)' },
  '/inventario':                      { file: 'estoque-avancado', title: 'Estoque Avançado' },

  // Convênios / Licitações
  '/convenios':                       { file: 'convenios-licitacoes', title: 'Convênios' },
  '/licitacoes':                      { file: 'convenios-licitacoes', title: 'Licitações' },

  // Compras
  '/compras':                         { file: 'financeiro', title: 'Financeiro' },
  '/compras/cotacoes':                { file: 'financeiro', title: 'Financeiro' },
  '/compras/entradas':                { file: 'financeiro', title: 'Financeiro' },
  '/suppliers':                       { file: 'financeiro', title: 'Financeiro' },

  // Relatórios / Automação / Gestão
  '/relatorios':                      { file: 'relatorios', title: 'Relatórios (Report Engine)' },
  '/automacao':                       { file: 'automacao', title: 'Automação' },
  '/multi-empresa':                   { file: 'multi-empresa', title: 'Multi-empresa (Grupo Econômico)' },
  '/filiais':                         { file: 'filial', title: 'Filial' },

  // Cadastros
  '/vendedores':                      { file: 'crm', title: 'CRM (Gestão de Relacionamento)' },
  '/transportadoras':                 { file: 'mdfe', title: 'MDF-e (Manifesto Eletrônico)' },
  '/usuarios':                        { file: 'summary', title: 'Manual de Treinamento' },

  // Sistema
  '/logs':                            { file: 'summary', title: 'Manual de Treinamento' },
  '/parametros':                      { file: 'summary', title: 'Manual de Treinamento' },
  '/planos':                          { file: 'summary', title: 'Manual de Treinamento' },
  '/settings':                        { file: 'summary', title: 'Manual de Treinamento' },
  '/ajuda':                           { file: 'summary', title: 'Manual de Treinamento' },
  '/manual':                          { file: 'summary', title: 'Manual de Treinamento' },
  '/manual-tecnico':                  { file: 'summary', title: 'Manual de Treinamento' },
};
