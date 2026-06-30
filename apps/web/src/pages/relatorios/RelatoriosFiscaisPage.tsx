import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { relatoriosService } from '@/services/financeiro';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function RelatoriosFiscaisPage() {
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [tipoRelatorio, setTipoRelatorio] = useState('resumoNotas');

  const gerarRelatorio = async () => {
    if (!dataInicial || !dataFinal) {
      alert('Selecione as datas inicial e final');
      return;
    }

    try {
      setLoading(true);
      let res;
      switch (tipoRelatorio) {
        case 'resumoNotas':
          res = await relatoriosService.resumoNotas(dataInicial, dataFinal);
          break;
        case 'resumoImpostos':
          res = await relatoriosService.resumoImpostos(dataInicial, dataFinal);
          break;
        case 'spedFiscal':
          res = await relatoriosService.spedFiscal(dataInicial, dataFinal);
          break;
        case 'spedContribuicoes':
          res = await relatoriosService.spedContribuicoes(dataInicial, dataFinal);
          break;
      }
      if (res?.data.success) setResultado(res.data.data);
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const relatorios = [
    { id: 'resumoNotas', label: 'Resumo de Notas Fiscais' },
    { id: 'resumoImpostos', label: 'Resumo de Impostos' },
    { id: 'spedFiscal', label: 'SPED Fiscal' },
    { id: 'spedContribuicoes', label: 'SPED Contribuições' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Relatórios Fiscais</h1>
        <p className="text-gray-500">Geração de relatórios contábeis e fiscais</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Relatório</label>
              <select
                value={tipoRelatorio}
                onChange={(e) => { setTipoRelatorio(e.target.value); setResultado(null); }}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
              >
                {relatorios.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
              <input
                type="date"
                value={dataInicial}
                onChange={(e) => setDataInicial(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
              <input
                type="date"
                value={dataFinal}
                onChange={(e) => setDataFinal(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={gerarRelatorio}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <FileText className="h-5 w-5 mr-2" />
                    Gerar
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {resultado && (
        <Card>
          <CardHeader className="border-b border-gray-200 flex flex-row items-center justify-between py-4 px-6">
            <CardTitle>Resultado</CardTitle>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </CardHeader>
          
          <CardContent className="p-6">
            {tipoRelatorio === 'resumoNotas' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Total de Notas</p>
                    <p className="text-2xl font-bold text-gray-900">{resultado.totalNotas}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Valor Total</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(resultado.valorTotal)}</p>
                  </div>
                </div>
                {resultado.notas?.length > 0 && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Número</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Data</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Valor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {resultado.notas.map((nota: any, i: number) => (
                          <tr key={i}>
                            <td className="px-4 py-2 text-sm">{nota.numero}</td>
                            <td className="px-4 py-2 text-sm">{nota.dataEmissao ? new Date(nota.dataEmissao).toLocaleDateString('pt-BR') : '-'}</td>
                            <td className="px-4 py-2 text-sm text-right">{formatCurrency(nota.valorTotal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {tipoRelatorio === 'resumoImpostos' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Entradas</p>
                    <p className="text-xl font-bold text-blue-900">{formatCurrency(resultado.entradas?.valorTotal || 0)}</p>
                    <p className="text-xs text-blue-500">{resultado.entradas?.quantidade || 0} notas</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Vendas</p>
                    <p className="text-xl font-bold text-green-900">{formatCurrency(resultado.vendas?.valorTotal || 0)}</p>
                    <p className="text-xs text-green-500">{resultado.vendas?.quantidade || 0} pedidos</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-600">Compras</p>
                    <p className="text-xl font-bold text-orange-900">{formatCurrency(resultado.compras?.valorTotal || 0)}</p>
                    <p className="text-xs text-orange-500">{resultado.compras?.quantidade || 0} pedidos</p>
                  </div>
                </div>
              </div>
            )}

            {tipoRelatorio === 'spedFiscal' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">CNPJ</p>
                    <p className="font-medium">{resultado.cnpj}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nome</p>
                    <p className="font-medium">{resultado.nome}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Registros SPED ({resultado.registros?.length || 0})</p>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-64">
                    {resultado.registros?.join('\n')}
                  </pre>
                </div>
              </div>
            )}

            {tipoRelatorio === 'spedContribuicoes' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">CNPJ</p>
                    <p className="font-medium">{resultado.cnpj}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nome</p>
                    <p className="font-medium">{resultado.nome}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Total Vendas</p>
                    <p className="text-xl font-bold">{formatCurrency(resultado.totalVendas)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Total Compras</p>
                    <p className="text-xl font-bold">{formatCurrency(resultado.totalCompras)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-600">PIS</p>
                    <p className="text-xl font-bold">{formatCurrency(resultado.pis)}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">COFINS</p>
                    <p className="text-xl font-bold">{formatCurrency(resultado.cofins)}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
