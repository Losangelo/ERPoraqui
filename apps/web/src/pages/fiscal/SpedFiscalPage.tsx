import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { api } from '@/services/api';
import { 
  FileText, Download, CheckCircle, Clock, Settings, Loader2, AlertCircle,
  Database, BarChart3, Package, ClipboardList, Receipt, TrendingUp
} from 'lucide-react';

interface SpedBlock {
  id: string;
  nome: string;
  descricao: string;
  status: 'pronto' | 'parcial' | 'pendente';
  registros: number;
}

interface SpedRecord {
  id: string;
  periodoIni: string;
  periodoFin: string;
  situacao: string;
  totalRegistros: number;
  dataGeracao: string;
}

const blockIcons: Record<string, any> = {
  '0': Database,
  'C': FileText,
  'D': Receipt,
  'E': TrendingUp,
  'G': BarChart3,
  'H': Package,
};

const blockColors: Record<string, string> = {
  pronto: 'text-green-600 bg-green-50 border-green-200',
  parcial: 'text-amber-600 bg-amber-50 border-amber-200',
  pendente: 'text-gray-400 bg-gray-50 border-gray-200',
};

export function SpedFiscalPage() {
  const [ano, setAno] = useState(new Date().getFullYear().toString());
  const [mes, setMes] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [gerando, setGerando] = useState(false);
  const [blocos, setBlocos] = useState<SpedBlock[]>([]);
  const [history, setHistory] = useState<SpedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [blocosSelecionados, setBlocosSelecionados] = useState<string[]>([]);

  const carregarDados = useCallback(async () => {
    try {
      const [blocosRes, histRes] = await Promise.all([
        api.get('/sped-fiscal/blocos'),
        api.get('/sped-fiscal', { params: { pagina: 1, limite: 10 } }),
      ]);
      const blocosData = blocosRes.data?.data || [];
      setBlocos(blocosData);
      setBlocosSelecionados(blocosData.filter((b: SpedBlock) => b.status === 'pronto' || b.status === 'parcial').map((b: SpedBlock) => b.id));
      setHistory(histRes.data?.data || []);
    } catch {
      // API pode não estar disponível
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregarDados(); }, [carregarDados]);

  const gerarSped = async () => {
    setGerando(true);
    try {
      const dataIni = new Date(Number(ano), Number(mes) - 1, 1);
      const dataFim = new Date(Number(ano), Number(mes), 0);
      const response = await api.post('/sped-fiscal/gerar', {
        periodoIni: dataIni.toISOString(),
        periodoFin: dataFim.toISOString(),
        blocos: blocosSelecionados,
      }, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SPED_FISCAL_${ano}${mes}.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      carregarDados();
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Erro ao gerar SPED');
    } finally {
      setGerando(false);
    }
  };

  const toggleBloco = (id: string) => {
    setBlocosSelecionados(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            SPED Fiscal
          </h1>
          <p className="text-muted-foreground">
            Sistema Público de Escrituração Digital — Geração de arquivos fiscais
          </p>
        </div>
      </div>

      {/* Block Status Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {blocos.map((bloco) => {
          const Icon = blockIcons[bloco.id] || Database;
          return (
            <Card
              key={bloco.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                blocosSelecionados.includes(bloco.id) ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => toggleBloco(bloco.id)}
              title={bloco.descricao}
            >
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${blockColors[bloco.status] || blockColors.pendente}`}>
                    {bloco.status}
                  </span>
                </div>
                <CardTitle className="text-lg mt-2">{bloco.nome}</CardTitle>
                <CardDescription className="text-xs">
                  {bloco.registros} registros
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
        {loading && (
          <div className="col-span-full flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Generate Card */}
        <Card>
          <CardHeader>
            <CardTitle>Gerar SPED Fiscal</CardTitle>
            <CardDescription>
              Selecione o período e os blocos desejados para gerar o arquivo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="ano">Ano</Label>
                  <Select value={ano} onValueChange={setAno}>
                    <SelectTrigger id="ano">
                      <SelectValue placeholder="Selecione o ano" />
                    </SelectTrigger>
                    <SelectContent>
                      {[2024, 2025, 2026].map((a) => (
                        <SelectItem key={a} value={a.toString()}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mes">Mês</Label>
                  <Select value={mes} onValueChange={setMes}>
                    <SelectTrigger id="mes">
                      <SelectValue placeholder="Selecione o mês" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <SelectItem key={m} value={m.toString().padStart(2, '0')}>
                          {m.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Blocos selecionados ({blocosSelecionados.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {blocos.filter(b => blocosSelecionados.includes(b.id)).map(b => (
                    <span key={b.id} className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      {b.nome}
                    </span>
                  ))}
                </div>
              </div>

              <Button onClick={gerarSped} disabled={gerando || blocosSelecionados.length === 0} className="w-full">
                {gerando ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Gerar SPED
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
            <CardDescription>Saiba mais sobre o SPED Fiscal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <div className="font-medium text-sm">O que é?</div>
                <div className="text-sm text-muted-foreground">
                  Arquivo digital com informações fiscais (ICMS, IPI) enviado ao Fisco estadual
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <div className="font-medium text-sm">Obrigatoriedade</div>
                <div className="text-sm text-muted-foreground">
                  Lucro Presumido, Lucro Real e Simples Nacional acima do sublimite
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <div className="font-medium text-sm">Prazo</div>
                <div className="text-sm text-muted-foreground">
                  Até dia 25 do mês subsequente. Clique nos blocos acima para ativar/desativar
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
          <CardDescription>Últimos SPEDs gerados</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum SPED gerado ainda
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Período</TableHead>
                  <TableHead>Registros</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead>Data Geração</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {new Date(item.periodoIni).toLocaleDateString()} - {new Date(item.periodoFin).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{item.totalRegistros}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        item.situacao === 'GERADO' ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50'
                      }`}>
                        {item.situacao}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(item.dataGeracao).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          try {
                            const res = await api.get(`/sped-fiscal/${item.id}/download`, { responseType: 'blob' });
                            const url = window.URL.createObjectURL(new Blob([res.data]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `SPED_${item.id}.txt`;
                            link.click();
                            link.remove();
                          } catch {}
                        }}
                        title="Baixar arquivo SPED gerado"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
