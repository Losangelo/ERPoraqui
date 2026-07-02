import { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { EstoqueService, MovimentacaoEstoque } from '@/services/estoque';
import { LookupField } from '@/components/lookup/LookupField';
import {
  ArrowRightLeft,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCw,
  Settings,
  Download,
  Search,
} from 'lucide-react';

const TIPOS = [
  { value: 'ENTRADA', label: 'Entrada', cor: 'bg-green-100 text-green-800 hover:bg-green-200' },
  { value: 'SAIDA', label: 'Saída', cor: 'bg-red-100 text-red-800 hover:bg-red-200' },
  { value: 'TRANSFERENCIA', label: 'Transferência', cor: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
  { value: 'AJUSTE', label: 'Ajuste', cor: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
  { value: 'DEVOLUCAO', label: 'Devolução', cor: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
];

function getTipoBadge(tipo: string) {
  const t = TIPOS.find((x) => x.value === tipo);
  return <Badge className={t?.cor || ''}>{t?.label || tipo}</Badge>;
}

interface ProdutoSelecionado {
  id: string;
  nome: string;
  codigoInterno?: string;
}

export function KardexPage() {
  const [produto, setProduto] = useState<ProdutoSelecionado | null>(null);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [pagina, setPagina] = useState(1);

  const { data: historico, isLoading } = useQuery({
    queryKey: ['kardex', produto?.id, dataInicio, dataFim, pagina],
    queryFn: () =>
      EstoqueService.historicoProduto(produto!.id, {
        dataInicio: dataInicio || undefined,
        dataFim: dataFim || undefined,
        pagina,
        limite: 100,
      }),
    enabled: !!produto?.id,
  });

  const movimentacoes = historico?.dados || [];
  const meta = historico?.meta;

  const { saldoInicial, totalEntradas, totalSaidas, saldoFinal } = useMemo(() => {
    if (movimentacoes.length === 0) {
      return { saldoInicial: 0, totalEntradas: 0, totalSaidas: 0, saldoFinal: 0 };
    }

    const first = movimentacoes[0];
    const last = movimentacoes[movimentacoes.length - 1];
    const saldoInicial = first.saldoAcumulado! - (first.tipoMovimentacao === 'ENTRADA' || first.tipoMovimentacao === 'DEVOLUCAO' ? first.quantidade : -first.quantidade);
    const saldoFinal = last.saldoAcumulado!;
    const totalEntradas = movimentacoes
      .filter((m) => m.tipoMovimentacao === 'ENTRADA' || m.tipoMovimentacao === 'DEVOLUCAO')
      .reduce((acc, m) => acc + m.quantidade, 0);
    const totalSaidas = movimentacoes
      .filter((m) => m.tipoMovimentacao === 'SAIDA' || m.tipoMovimentacao === 'TRANSFERENCIA' || m.tipoMovimentacao === 'AJUSTE')
      .reduce((acc, m) => acc + m.quantidade, 0);

    return { saldoInicial, totalEntradas, totalSaidas, saldoFinal };
  }, [movimentacoes]);

  const exportCSV = useCallback(() => {
    if (movimentacoes.length === 0) return;

    const headers = ['Data/Hora', 'Tipo', 'Quantidade', 'Saldo Acumulado', 'Motivo'];
    const rows = movimentacoes.map((m) => {
      const signal = m.tipoMovimentacao === 'ENTRADA' || m.tipoMovimentacao === 'DEVOLUCAO' ? '+' : '-';
      return [
        new Date(m.dataMovimentacao).toLocaleString('pt-BR'),
        m.tipoMovimentacao,
        `${signal}${m.quantidade}`,
        String(m.saldoAcumulado),
        m.motivo || '',
      ];
    });

    const csv = [headers, ...rows].map((row) => row.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kardex_${produto?.nome || 'produto'}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [movimentacoes, produto]);

  const handleSelectProduto = useCallback((item: ProdutoSelecionado) => {
    setProduto(item);
    setPagina(1);
  }, []);

  const handleClearProduto = useCallback(() => {
    setProduto(null);
    setPagina(1);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Search className="h-6 w-6" />
            Kardex - Histórico de Produto
          </h1>
          <p className="text-muted-foreground">
            Saldo acumulado por movimentação de um produto específico
          </p>
        </div>
        {produto && (
          <Button variant="outline" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="grid gap-2">
              <Label>Produto</Label>
              <LookupField
                source="produtos"
                value={produto?.id}
                selectedLabel={produto ? `${produto.nome}${produto.codigoInterno ? ` (#${produto.codigoInterno})` : ''}` : undefined}
                onChange={handleSelectProduto}
                onClear={handleClearProduto}
                placeholder="Selecione um produto para consultar o kardex..."
              />
            </div>
            <div className="grid gap-2">
              <Label>Data Início</Label>
              <Input
                type="date"
                value={dataInicio}
                onChange={(e) => { setDataInicio(e.target.value); setPagina(1); }}
                placeholder="Data inicial do período"
              />
            </div>
            <div className="grid gap-2">
              <Label>Data Fim</Label>
              <Input
                type="date"
                value={dataFim}
                onChange={(e) => { setDataFim(e.target.value); setPagina(1); }}
                placeholder="Data final do período"
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={() => { setDataInicio(''); setDataFim(''); setPagina(1); }}
                disabled={!dataInicio && !dataFim}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {produto && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo Inicial</CardTitle>
                <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{saldoInicial}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Entradas</CardTitle>
                <ArrowDownCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+{totalEntradas}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Saídas</CardTitle>
                <ArrowUpCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">-{totalSaidas}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo Final</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{saldoFinal}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Movimentações</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="text-center py-8">Carregando...</div>
              ) : movimentacoes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma movimentação encontrada para este produto no período selecionado.
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Quantidade</TableHead>
                        <TableHead className="text-right">Saldo Acumulado</TableHead>
                        <TableHead>Motivo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {movimentacoes.map((m: MovimentacaoEstoque) => {
                        const isEntrada = m.tipoMovimentacao === 'ENTRADA' || m.tipoMovimentacao === 'DEVOLUCAO';
                        return (
                          <TableRow key={m.id}>
                            <TableCell className="whitespace-nowrap">
                              {new Date(m.dataMovimentacao).toLocaleString('pt-BR')}
                            </TableCell>
                            <TableCell>{getTipoBadge(m.tipoMovimentacao)}</TableCell>
                            <TableCell className={`text-right font-medium ${isEntrada ? 'text-green-600' : 'text-red-600'}`}>
                              {isEntrada ? '+' : '-'}{m.quantidade}
                            </TableCell>
                            <TableCell className="text-right font-bold">{m.saldoAcumulado}</TableCell>
                            <TableCell className="text-muted-foreground">{m.motivo || '-'}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  {meta && meta.totalPaginas > 1 && (
                    <div className="flex items-center justify-between px-4 py-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Mostrando página {meta.pagina} de {meta.totalPaginas} ({meta.total} registros)
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={pagina <= 1}
                          onClick={() => setPagina((p) => Math.max(1, p - 1))}
                        >
                          Anterior
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={pagina >= (meta?.totalPaginas || 1)}
                          onClick={() => setPagina((p) => p + 1)}
                        >
                          Próxima
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {!produto && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">Selecione um produto</p>
              <p className="text-sm">Escolha um produto acima para visualizar o histórico completo de movimentações com saldo acumulado.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
