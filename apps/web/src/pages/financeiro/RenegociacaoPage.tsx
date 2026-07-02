import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LookupField } from '@/components/lookup/LookupField';
import { renegociacaoService, Renegociacao, RenegociacaoParcela } from '@/services/renegociacao';
import { Plus, Search, CheckCircle, XCircle, Eye, FileText } from 'lucide-react';

interface ContaDisponivel {
  id: string;
  numeroDocumento: string;
  numeroParcela: number;
  totalParcelas: number;
  dataVencimento: string;
  valorOriginal: number;
  situacao: string;
  cliente?: { id: string; nome: string };
  fornecedor?: { id: string; nome: string };
}

const situacoes: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline' }> = {
  PENDENTE: { label: 'Pendente', variant: 'warning' },
  CONFIRMADA: { label: 'Confirmada', variant: 'success' },
  CANCELADA: { label: 'Cancelada', variant: 'secondary' },
};

export default function RenegociacaoPage() {
  const [items, setItems] = useState<Renegociacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroSituacao, setFiltroSituacao] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Renegociacao | null>(null);

  const [tipo, setTipo] = useState('RECEBER');
  const [clienteId, setClienteId] = useState('');
  const [clienteLabel, setClienteLabel] = useState('');
  const [fornecedorId, setFornecedorId] = useState('');
  const [fornecedorLabel, setFornecedorLabel] = useState('');
  const [contasDisponiveis, setContasDisponiveis] = useState<ContaDisponivel[]>([]);
  const [selectedContas, setSelectedContas] = useState<Set<string>>(new Set());
  const [valorDesconto, setValorDesconto] = useState(0);
  const [valorJuros, setValorJuros] = useState(0);
  const [valorMulta, setValorMulta] = useState(0);
  const [numeroParcelas, setNumeroParcelas] = useState(1);
  const [primeiraVencimento, setPrimeiraVencimento] = useState('');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    loadItems();
  }, [filtroTipo, filtroSituacao]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filtroTipo) params.tipo = filtroTipo;
      if (filtroSituacao) params.situacao = filtroSituacao;
      const response = await renegociacaoService.listar(params);
      setItems(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Erro ao carregar renegociações:', error);
      setItems([]);
    }
    setLoading(false);
  };

  const loadContasDisponiveis = async () => {
    try {
      const response = await renegociacaoService.listarContasDisponiveis(tipo);
      setContasDisponiveis(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
      setContasDisponiveis([]);
    }
  };

  useEffect(() => {
    if (dialogOpen) {
      loadContasDisponiveis();
    }
  }, [dialogOpen, tipo]);

  const handleOpenDetail = (item: Renegociacao) => {
    setSelectedItem(item);
    setDetailDialogOpen(true);
  };

  const handleConfirm = async (id: string) => {
    try {
      await renegociacaoService.confirmar(id);
      loadItems();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta renegociação?')) return;
    try {
      await renegociacaoService.cancelar(id);
      loadItems();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const toggleConta = (id: string) => {
    setSelectedContas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCriar = async () => {
    if (!clienteId && !fornecedorId) {
      alert('Selecione um cliente ou fornecedor');
      return;
    }
    if (selectedContas.size === 0) {
      alert('Selecione pelo menos uma conta');
      return;
    }
    if (!primeiraVencimento) {
      alert('Informe a data do primeiro vencimento');
      return;
    }
    try {
      const data: Record<string, unknown> = {
        tipo,
        contasIds: Array.from(selectedContas),
        valorDesconto,
        valorJuros,
        valorMulta,
        numeroParcelas,
        primeiraVencimento: new Date(primeiraVencimento).toISOString(),
      };
      if (tipo === 'RECEBER') data.clienteId = clienteId;
      else data.fornecedorId = fornecedorId;
      if (observacoes) data.observacoes = observacoes;

      await renegociacaoService.criar(data as any);
      setDialogOpen(false);
      resetForm();
      loadItems();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const resetForm = () => {
    setTipo('RECEBER');
    setClienteId('');
    setClienteLabel('');
    setFornecedorId('');
    setFornecedorLabel('');
    setSelectedContas(new Set());
    setValorDesconto(0);
    setValorJuros(0);
    setValorMulta(0);
    setNumeroParcelas(1);
    setPrimeiraVencimento('');
    setObservacoes('');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getSituacaoBadge = (situacao: string) => {
    const config = situacoes[situacao] || { label: situacao, variant: 'default' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredItems = items.filter((item) =>
    (item.cliente?.nome?.toLowerCase().includes(busca.toLowerCase()) ||
     item.fornecedor?.nome?.toLowerCase().includes(busca.toLowerCase())) ?? true
  );

  const totalPendente = items.filter((i) => i.situacao === 'PENDENTE').reduce((s, i) => s + i.valorFinal, 0);
  const totalConfirmada = items.filter((i) => i.situacao === 'CONFIRMADA').reduce((s, i) => s + i.valorFinal, 0);

  const totalOriginal = Array.from(selectedContas).reduce((sum, id) => {
    const conta = contasDisponiveis.find((c) => c.id === id);
    return sum + (conta?.valorOriginal || 0);
  }, 0);

  const valorFinalCalc = totalOriginal - valorDesconto + valorJuros + valorMulta;
  const valorParcela = numeroParcelas > 0 ? valorFinalCalc / numeroParcelas : 0;

  const parcelasPreview: { num: number; data: string; valor: number }[] = [];
  if (primeiraVencimento && numeroParcelas > 0) {
    const base = new Date(primeiraVencimento);
    for (let i = 0; i < numeroParcelas; i++) {
      const d = new Date(base);
      d.setMonth(d.getMonth() + i);
      parcelasPreview.push({
        num: i + 1,
        data: d.toLocaleDateString('pt-BR'),
        valor: i === numeroParcelas - 1
          ? parseFloat((valorFinalCalc - valorParcela * (numeroParcelas - 1)).toFixed(2))
          : parseFloat(valorParcela.toFixed(2)),
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Renegociação</h1>
          <p className="text-muted-foreground">Renegociação de contas a receber e a pagar</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Renegociação
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Original Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(items.reduce((s, i) => s + i.valorTotal, 0))}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Final Total</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(items.reduce((s, i) => s + i.valorFinal, 0))}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <XCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPendente)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalConfirmada)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por cliente ou fornecedor..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filtroTipo || 'all'} onValueChange={(v) => setFiltroTipo(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="RECEBER">Receber</SelectItem>
            <SelectItem value="PAGAR">Pagar</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroSituacao || 'all'} onValueChange={(v) => setFiltroSituacao(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Situação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="PENDENTE">Pendente</SelectItem>
            <SelectItem value="CONFIRMADA">Confirmada</SelectItem>
            <SelectItem value="CANCELADA">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº</TableHead>
                <TableHead>Cliente/Fornecedor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor Original</TableHead>
                <TableHead className="text-right">Desconto</TableHead>
                <TableHead className="text-right">Valor Final</TableHead>
                <TableHead className="text-center">Parcelas</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">Carregando...</TableCell>
                </TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Nenhuma renegociação encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">{item.id.slice(0, 8)}</TableCell>
                    <TableCell>{item.cliente?.nome || item.fornecedor?.nome || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={item.tipo === 'RECEBER' ? 'default' : 'secondary'}>
                        {item.tipo === 'RECEBER' ? 'Receber' : 'Pagar'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(item.valorTotal)}</TableCell>
                    <TableCell className="text-right text-green-600">{formatCurrency(item.valorDesconto)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(item.valorFinal)}</TableCell>
                    <TableCell className="text-center">{item.numeroParcelas}x</TableCell>
                    <TableCell>{getSituacaoBadge(item.situacao)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-1 justify-center">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDetail(item)} title="Ver detalhes">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {item.situacao === 'PENDENTE' && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleConfirm(item.id)} title="Confirmar">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleCancel(item.id)} title="Cancelar">
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nova Renegociação</DialogTitle>
            <DialogDescription>Selecione as contas e defina as condições da renegociação</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Tipo</Label>
                <Select value={tipo} onValueChange={(v) => { setTipo(v); setSelectedContas(new Set()); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RECEBER">Contas a Receber</SelectItem>
                    <SelectItem value="PAGAR">Contas a Pagar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>{tipo === 'RECEBER' ? 'Cliente' : 'Fornecedor'}</Label>
                {tipo === 'RECEBER' ? (
                  <LookupField
                    source="clientes"
                    value={clienteId}
                    selectedLabel={clienteLabel}
                    onChange={(item: any) => { setClienteId(item.id); setClienteLabel(item.nome); }}
                    onClear={() => { setClienteId(''); setClienteLabel(''); }}
                    placeholder="Selecionar cliente..."
                  />
                ) : (
                  <LookupField
                    source="fornecedores"
                    value={fornecedorId}
                    selectedLabel={fornecedorLabel}
                    onChange={(item: any) => { setFornecedorId(item.id); setFornecedorLabel(item.nome); }}
                    onClear={() => { setFornecedorId(''); setFornecedorLabel(''); }}
                    placeholder="Selecionar fornecedor..."
                  />
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Contas Disponíveis</Label>
              <div className="border rounded-md max-h-48 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Documento</TableHead>
                      <TableHead>Parcela</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contasDisponiveis.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          Nenhuma conta disponível
                        </TableCell>
                      </TableRow>
                    ) : (
                      contasDisponiveis.map((conta) => (
                        <TableRow key={conta.id} className={selectedContas.has(conta.id) ? 'bg-muted/50' : ''}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedContas.has(conta.id)}
                              onChange={() => toggleConta(conta.id)}
                              className="h-4 w-4"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{conta.numeroDocumento}</TableCell>
                          <TableCell>{conta.numeroParcela}/{conta.totalParcelas}</TableCell>
                          <TableCell>{formatDate(conta.dataVencimento)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(conta.valorOriginal)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Desconto</Label>
                <Input
                  type="number"
                  placeholder="Valor do desconto"
                  title="Valor em reais a ser descontado do total"
                  value={valorDesconto}
                  onChange={(e) => setValorDesconto(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Juros</Label>
                <Input
                  type="number"
                  placeholder="Valor dos juros"
                  title="Valor em reais de juros a serem aplicados"
                  value={valorJuros}
                  onChange={(e) => setValorJuros(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Multa</Label>
                <Input
                  type="number"
                  placeholder="Valor da multa"
                  title="Valor em reais de multa a ser aplicada"
                  value={valorMulta}
                  onChange={(e) => setValorMulta(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Número de Parcelas</Label>
                <Input
                  type="number"
                  placeholder="Quantidade de parcelas"
                  title="Quantidade de parcelas para o novo parcelamento"
                  min={1}
                  value={numeroParcelas}
                  onChange={(e) => setNumeroParcelas(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Primeiro Vencimento</Label>
                <Input
                  type="date"
                  placeholder="Data do primeiro vencimento"
                  title="Selecione a data do primeiro vencimento das novas parcelas"
                  value={primeiraVencimento}
                  onChange={(e) => setPrimeiraVencimento(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Observações</Label>
              <textarea
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Observações adicionais sobre a renegociação..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>

            {primeiraVencimento && numeroParcelas > 0 && (
              <div className="grid gap-2">
                <Label>Preview das Parcelas</Label>
                <div className="text-sm text-muted-foreground mb-1">
                  Total original: {formatCurrency(totalOriginal)} | 
                  Valor final: {formatCurrency(valorFinalCalc)}
                </div>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parcela</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parcelasPreview.map((p) => (
                        <TableRow key={p.num}>
                          <TableCell>{p.num}/{numeroParcelas}</TableCell>
                          <TableCell>{p.data}</TableCell>
                          <TableCell className="text-right">{formatCurrency(p.valor)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancelar</Button>
            <Button onClick={handleCriar}>Criar Renegociação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Renegociação</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Tipo</span>
                  <p className="font-medium">{selectedItem.tipo === 'RECEBER' ? 'Contas a Receber' : 'Contas a Pagar'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Cliente/Fornecedor</span>
                  <p className="font-medium">{selectedItem.cliente?.nome || selectedItem.fornecedor?.nome || '-'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Situação</span>
                  <p>{getSituacaoBadge(selectedItem.situacao)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Data de Criação</span>
                  <p className="font-medium">{formatDate(selectedItem.dataCriacao)}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 p-3 bg-muted rounded-md">
                <div>
                  <span className="text-xs text-muted-foreground">Valor Original</span>
                  <p className="font-semibold">{formatCurrency(selectedItem.valorTotal)}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Desconto</span>
                  <p className="font-semibold text-green-600">{formatCurrency(selectedItem.valorDesconto)}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Juros/Multa</span>
                  <p className="font-semibold text-red-600">{formatCurrency(selectedItem.valorJuros + selectedItem.valorMulta)}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Valor Final</span>
                  <p className="font-semibold">{formatCurrency(selectedItem.valorFinal)}</p>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Observações</span>
                <p className="text-sm">{selectedItem.observacoes || '-'}</p>
              </div>

              <div>
                <Label>Parcelas</Label>
                <div className="border rounded-md mt-1">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parcela</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead>Situação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedItem.parcelas.map((p: RenegociacaoParcela) => (
                        <TableRow key={p.id}>
                          <TableCell>{p.numeroParcela}/{selectedItem.numeroParcelas}</TableCell>
                          <TableCell>{formatDate(p.dataVencimento)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(p.valor)}</TableCell>
                          <TableCell>{getSituacaoBadge(p.situacao === 'PAGA' ? 'CONFIRMADA' : p.situacao === 'VENCIDA' ? 'PENDENTE' : p.situacao)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {selectedItem.situacao === 'PENDENTE' && (
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => handleCancel(selectedItem.id)}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button onClick={() => { handleConfirm(selectedItem.id); setDetailDialogOpen(false); }}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar
                  </Button>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
