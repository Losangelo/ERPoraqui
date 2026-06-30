import { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, Info, Bug, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

interface Log {
  id: string;
  categoria: string;
  acao: string;
  nivel: string;
  mensagem: string;
  detalhes: Record<string, unknown>;
  ip: string | null;
  userAgent: string | null;
  dataCriacao: string;
}

interface LogFilters {
  categoria?: string;
  nivel?: string;
  busca?: string;
}

const nivelConfig: Record<string, { color: string; icon: typeof Info }> = {
  info: { color: 'text-blue-600', icon: Info },
  warn: { color: 'text-yellow-600', icon: AlertTriangle },
  error: { color: 'text-red-600', icon: AlertCircle },
  debug: { color: 'text-gray-600', icon: Bug },
};

export function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LogFilters>({});
  const [stats, setStats] = useState<{ porCategoria: { categoria: string; quantidade: number }[]; porNivel: { nivel: string; quantidade: number }[]; totalHoje: number } | null>(null);

  useEffect(() => {
    loadLogs();
    loadStats();
  }, [filters]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.categoria) params.append('categoria', filters.categoria);
      if (filters.nivel) params.append('nivel', filters.nivel);
      if (filters.busca) params.append('busca', filters.busca);
      params.append('pagina', '1');
      params.append('limite', '50');

      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api/v1'}/logs?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setLogs(data.dados || []);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api/v1'}/logs/estatisticas`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleFilterChange = (key: keyof LogFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Logs do Sistema</h1>
          <p className="text-muted-foreground">Visualize os logs e diagnósticos do sistema</p>
        </div>
        <Button variant="outline" onClick={() => { loadLogs(); loadStats(); }}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalHoje || 0}</div>
          </CardContent>
        </Card>
        {stats?.porNivel.map((item) => {
          const config = nivelConfig[item.nivel];
          const Icon = config?.icon || Info;
          return (
            <Card key={item.nivel}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${config?.color || ''}`} />
                  {item.nivel.toUpperCase()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.quantidade}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="busca">Buscar</Label>
              <Input
                id="busca"
                placeholder="Buscar na mensagem..."
                value={filters.busca || ''}
                onChange={(e) => handleFilterChange('busca', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <select
                id="categoria"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.categoria || ''}
                onChange={(e) => handleFilterChange('categoria', e.target.value)}
              >
                <option value="">Todas</option>
                <option value="auth">Auth</option>
                <option value="api">API</option>
                <option value="database">Database</option>
                <option value="business">Business</option>
                <option value="validation">Validation</option>
                <option value="security">Security</option>
                <option value="system">System</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nivel">Nível</Label>
              <select
                id="nivel"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.nivel || ''}
                onChange={(e) => handleFilterChange('nivel', e.target.value)}
              >
                <option value="">Todos</option>
                <option value="info">Info</option>
                <option value="warn">Warn</option>
                <option value="error">Error</option>
                <option value="debug">Debug</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center p-12">
              <Info className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Nenhum log encontrado</h3>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Mensagem</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => {
                  const config = nivelConfig[log.nivel];
                  const Icon = config?.icon || Info;
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">{formatDate(log.dataCriacao)}</TableCell>
                      <TableCell>
                        <span className={`flex items-center gap-1 ${config?.color || ''}`}>
                          <Icon className="h-4 w-4" />
                          {log.nivel.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell className="capitalize">{log.categoria}</TableCell>
                      <TableCell className="max-w-xs truncate">{log.acao}</TableCell>
                      <TableCell className="max-w-md truncate">{log.mensagem}</TableCell>
                      <TableCell className="text-muted-foreground">{log.ip || '-'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
