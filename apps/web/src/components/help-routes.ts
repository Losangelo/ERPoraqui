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
  '/entregas':                        { file: 'estoque-avancado', title: 'Entregas' },
  '/motoristas':                      { file: 'summary', title: 'Motoristas' },
  '/veiculos-entrega':                { file: 'summary', title: 'Veículos de Entrega' },
  '/taxas-entrega':                   { file: 'summary', title: 'Taxas de Entrega' },

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
  '/cte':                             { file: 'cte', title: 'CT-e (Conhecimento de Transporte Eletrônico)' },

  // Promoções
  '/promocoes':                       { file: 'promocoes', title: 'Promoções' },

  // Contratos / Garantias / Devoluções / Convênios
  '/contratos':                       { file: 'contratos-garantias-devolucoes', title: 'Contratos, Garantias e Devoluções' },
  '/garantias':                       { file: 'contratos-garantias-devolucoes', title: 'Contratos, Garantias e Devoluções' },
  '/devolucoes':                      { file: 'contratos-garantias-devolucoes', title: 'Contratos, Garantias e Devoluções' },
  '/convenios':                       { file: 'convenios-licitacoes', title: 'Convênios' },

  // Licitações
  '/licitacoes':                      { file: 'convenios-licitacoes', title: 'Licitações' },

  // Financeiro
  '/contas-receber':                  { file: 'financeiro', title: 'Financeiro' },
  '/contas-pagar':                    { file: 'financeiro', title: 'Financeiro' },
  '/fluxo-caixa':                     { file: 'fluxo-caixa', title: 'Fluxo de Caixa' },
  '/dre':                             { file: 'dre', title: 'DRE' },
  '/plano-contas':                    { file: 'plano-contas', title: 'Plano de Contas' },
  '/boletos':                         { file: 'boletos-cnab', title: 'Boletos / CNAB' },
  '/cheques':                         { file: 'cheques', title: 'Cheques' },
  '/centros-custo':                   { file: 'centro-custo', title: 'Centro de Custo' },
  '/renegociacao':                    { file: 'renegociacao', title: 'Renegociação' },
  '/conciliacao':                     { file: 'conciliacao', title: 'Conciliação Bancária' },
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
  '/estoque/kardex':                  { file: 'kardex', title: 'Kardex' },
  '/inventario':                      { file: 'inventario', title: 'Inventário' },

  // Compras
  '/compras':                         { file: 'financeiro', title: 'Financeiro' },
  '/compras/cotacoes':                { file: 'financeiro', title: 'Financeiro' },
  '/compras/entradas':                { file: 'financeiro', title: 'Financeiro' },
  '/suppliers':                       { file: 'financeiro', title: 'Financeiro' },

  // Cadastros
  '/vendedores':                      { file: 'crm', title: 'CRM (Gestão de Relacionamento)' },
  '/transportadoras':                 { file: 'mdfe', title: 'MDF-e (Manifesto Eletrônico)' },
  '/filiais':                         { file: 'filial', title: 'Filial' },
  '/usuarios':                        { file: 'usuarios', title: 'Usuários' },

  // Relatórios / Automação / Gestão
  '/relatorios':                      { file: 'relatorios', title: 'Relatórios (Report Engine)' },
  '/automacao':                       { file: 'automacao', title: 'Automação' },
  '/multi-empresa':                   { file: 'multi-empresa', title: 'Multi-empresa (Grupo Econômico)' },

  // Sistema
  '/logs':                            { file: 'logs', title: 'Logs do Sistema' },
  '/parametros':                      { file: 'parametros', title: 'Parâmetros' },
  '/planos':                          { file: 'summary', title: 'Manual de Treinamento' },
  '/settings':                        { file: 'summary', title: 'Manual de Treinamento' },
  '/ajuda':                           { file: 'summary', title: 'Manual de Treinamento' },
  '/manual':                          { file: 'summary', title: 'Manual de Treinamento' },
  '/manual-tecnico':                  { file: 'summary', title: 'Manual Técnico' },
};
