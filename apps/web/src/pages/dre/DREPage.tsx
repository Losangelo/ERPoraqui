import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dreService, DREData, DREMensal } from '@/services/dre';
import { TrendingUp, DollarSign, Percent } from 'lucide-react';

export default function DREPage() {
  const [data, setData] = useState<DREData | null>(null);
  const [mensal, setMensal] = useState<DREMensal | null>(null);
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [ano, setAno] = useState(new Date().getFullYear());
  const [tab, setTab] = useState('geral');

  useEffect(() => {
    carregarDRE();
  }, []);

  const carregarDRE = async () => {
    try {
      const dre = await dreService.gerarDRE(dataInicial || undefined, dataFinal || undefined);
      setData(dre);
    } catch (error) {
      console.error('Erro ao carregar DRE:', error);
    }
  };

  const carregarMensal = async () => {
    try {
      const dre = await dreService.gerarDREMensal(ano);
      setMensal(dre);
    } catch (error) {
      console.error('Erro ao carregar DRE mensal:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 2 }).format(value / 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Demonstração do Resultado do Exercício</h1>
          <p className="text-muted-foreground">DRE - Análise financeira</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="mensal">Mensal</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Período</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4 items-end">
              <div className="grid gap-2">
                <Label>Data Inicial</Label>
                <Input type="date" value={dataInicial} onChange={(e) => setDataInicial(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Data Final</Label>
                <Input type="date" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} />
              </div>
              <Button onClick={carregarDRE}>Gerar DRE</Button>
            </CardContent>
          </Card>

          {data && (
            <>
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receita Bruta</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(data.receitaBruta)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Lucro Bruto</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(data.lucroBruto)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(data.lucroLiquido)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Margem de Lucro</CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatPercent(data.margemLucro)}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>DRE Detalhado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span>Receita Bruta de Vendas</span>
                      <span className="font-medium">{formatCurrency(data.receitaBruta)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b text-red-500">
                      <span>(-) Devoluções e Abatimentos</span>
                      <span>{formatCurrency(data.devolucoesAbatimentos)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b font-medium">
                      <span>= Receita Líquida</span>
                      <span>{formatCurrency(data.receitaLiquida)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b text-red-500">
                      <span>(-) Custo das Mercadorias Vendidas</span>
                      <span>{formatCurrency(data.custoMercadoriasVendidas)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b font-bold text-green-600">
                      <span>= Lucro Bruto</span>
                      <span>{formatCurrency(data.lucroBruto)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b text-red-500">
                      <span>(-) Despesas Operacionais</span>
                      <span>{formatCurrency(data.despesasOperacionais.total)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b text-green-500">
                      <span>(+) Resultado Financeiro</span>
                      <span>{formatCurrency(data.resultadoFinanceiro)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b font-medium">
                      <span>= Lucro Operacional</span>
                      <span>{formatCurrency(data.lucroOperacional)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b text-red-500">
                      <span>(-) Impostos</span>
                      <span>{formatCurrency(data.impostos)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b font-bold text-lg text-green-600">
                      <span>= Lucro Líquido do Período</span>
                      <span>{formatCurrency(data.lucroLiquido)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="mensal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DRE Mensal</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4 items-end">
              <div className="grid gap-2">
                <Label>Ano</Label>
                <Input type="number" value={ano} onChange={(e) => setAno(parseInt(e.target.value))} />
              </div>
              <Button onClick={carregarMensal}>Gerar</Button>
            </CardContent>
          </Card>

          {mensal && (
            <Card>
              <CardHeader>
                <CardTitle>Resultado Mensal - {mensal.ano}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Mês</th>
                        <th className="text-right p-2">Receita</th>
                        <th className="text-right p-2">Despesas</th>
                        <th className="text-right p-2">Resultado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mensal.meses.map((m) => (
                        <tr key={m.mes} className="border-b">
                          <td className="p-2">{m.nome}</td>
                          <td className="text-right p-2">{formatCurrency(m.receitaBruta)}</td>
                          <td className="text-right p-2 text-red-500">{formatCurrency(m.despesasTotais)}</td>
                          <td className={`text-right p-2 font-medium ${m.resultado >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {formatCurrency(m.resultado)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-bold">
                        <td className="p-2">Total</td>
                        <td className="text-right p-2">{formatCurrency(mensal.totalReceita)}</td>
                        <td className="text-right p-2 text-red-500">{formatCurrency(mensal.totalDespesas)}</td>
                        <td className={`text-right p-2 ${mensal.resultadoAnual >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {formatCurrency(mensal.resultadoAnual)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
