import { useEffect, useState } from 'react';
import { TrendingUp, Users, Package, DollarSign, AlertTriangle } from 'lucide-react';
import { dashboardService } from '@/services/dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface DashboardData {
  cadastros: {
    clientes: number;
    fornecedores: number;
    produtos: number;
    vendedores: number;
  };
  vendas: {
    mes: { quantidade: number; valor: number };
  };
  compras: {
    mes: { quantidade: number; valor: number };
  };
  financeiro: {
    receber: { quantidade: number; valor: number };
    pagar: { quantidade: number; valor: number };
    saldoProjecao: number;
  };
  estoque: { valorTotal: number };
}

interface VendaData {
  data: string;
  valor: number;
}

interface CategoriaData {
  categoria: string;
  quantidade: number;
}

interface StatusData {
  status: string;
  quantidade: number;
}

export function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [vendasData, setVendasData] = useState<VendaData[]>([]);
  const [estoqueData, setEstoqueData] = useState<CategoriaData[]>([]);
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [dashRes, vendasRes, estoqueRes, statusRes] = await Promise.all([
        dashboardService.getDashboard(),
        dashboardService.getGraficoVendas('30dias'),
        dashboardService.getGraficoEstoqueCategoria(),
        dashboardService.getGraficoStatusPedidos(),
      ]);

      if (dashRes.data.success) setDashboard(dashRes.data.data);
      if (vendasRes.data.success) setVendasData(vendasRes.data.data);
      if (estoqueRes.data.success) setEstoqueData(estoqueRes.data.data);
      if (statusRes.data.success) setStatusData(statusRes.data.data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-600">
        <p>{error}</p>
        <Button onClick={loadDashboard} className="mt-2 text-sm underline" variant="link">
          Tentar novamente
        </Button>
      </div>
    );
  }

  const stats = [
    {
      title: 'Vendas do Mês',
      value: formatCurrency(dashboard?.vendas.mes.valor || 0),
      subtitle: `${formatNumber(dashboard?.vendas.mes.quantidade || 0)} pedidos`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Clientes',
      value: formatNumber(dashboard?.cadastros.clientes || 0),
      subtitle: 'cadastrados',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Produtos',
      value: formatNumber(dashboard?.cadastros.produtos || 0),
      subtitle: 'em estoque',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Receber',
      value: formatCurrency(dashboard?.financeiro.receber.valor || 0),
      subtitle: `${dashboard?.financeiro.receber.quantidade || 0} faturas`,
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const maxEstoque = Math.max(...estoqueData.map((d) => d.quantidade), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Visão geral do seu negócio</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.subtitle}</p>
                  </div>
                  <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vendas dos últimos 30 dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {vendasData.length > 0 ? (
                <div className="flex h-full items-end justify-between gap-1">
                  {vendasData.slice(-15).map((item, index) => (
                    <div key={index} className="flex flex-1 flex-col items-center">
                      <div
                        className="w-full rounded-t bg-blue-500 hover:bg-blue-600"
                        style={{ height: `${(item.valor / Math.max(...vendasData.map((d) => d.valor), 1)) * 100}%` }}
                        title={formatCurrency(item.valor)}
                      ></div>
                      <span className="mt-1 text-[8px] text-gray-500">
                        {new Date(item.data).getDate()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  Nenhum dado disponível
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estoque por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {estoqueData.length > 0 ? (
                estoqueData.slice(0, 6).map((item) => (
                  <div key={item.categoria}>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.categoria}</span>
                      <span className="font-medium">{formatNumber(item.quantidade)}</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-purple-500"
                        style={{ width: `${(item.quantidade / maxEstoque) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-32 items-center justify-center text-gray-400">
                  Nenhum dado disponível
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Status dos Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statusData.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-3 w-3 rounded-full ${
                        item.status === 'APROVADO'
                          ? 'bg-green-500'
                          : item.status === 'PENDENTE'
                          ? 'bg-yellow-500'
                          : item.status === 'CANCELADO'
                          ? 'bg-red-500'
                          : 'bg-gray-500'
                      }`}
                    ></span>
                    <span className="text-sm text-gray-700">{item.status}</span>
                  </div>
                  <span className="font-semibold">{item.quantidade}</span>
                </div>
              ))}
              {statusData.length === 0 && (
                <p className="text-gray-400">Nenhum pedido encontrado</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Contas a Receber</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(dashboard?.financeiro.receber.valor || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Contas a Pagar</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(dashboard?.financeiro.pagar.valor || 0)}
                </span>
              </div>
              <hr className="my-2" />
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Saldo Projetado</span>
                <span
                  className={`font-bold ${
                    (dashboard?.financeiro.saldoProjecao || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatCurrency(dashboard?.financeiro.saldoProjecao || 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg bg-yellow-50 p-3">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Estoque Baixo</p>
                  <p className="text-xs text-yellow-600">Verifique produtos com estoque mínimo</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-red-50 p-3">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">Contas Vencidas</p>
                  <p className="text-xs text-red-600">{dashboard?.financeiro.receber.quantidade || 0} faturas pendentes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
