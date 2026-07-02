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
import { quitacaoService, Quitacao, ContaDisponivel } from '@/services/quitacoes';
import { Plus, Search, Eye } from 'lucide-react';

export default function QuitacoesPage() {
  const [items, setItems] = useState<Quitacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Quitacao | null>(null);

  const [tipo, setTipo] = useState('RECEBER');
  const [clienteId, setClienteId] = useState('');
  const [clienteLabel, setClienteLabel] = useState('');
  const [fornecedorId, setFornecedorId] = useState('');
  const [fornecedorLabel, setFornecedorLabel] = useState('');
  const [contasDisponiveis, setContasDisponiveis] = useState<ContaDisponivel[]>([]);
  const [selectedContas, setSelectedContas] = useState<Map<string, { contaId: string; tipoConta: string; valorPago: number }>>(new Map());
  const [dataQuitacao, setDataQuitacao] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    loadItems();
  }, [filtroTipo]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filtroTipo) params.tipo = filtroTipo;
      const response = await quitacaoService.listar(params);
      setItems(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Erro ao carregar quitações:', error);
      setItems([]);
    }
    setLoading(false);
  };

  const loadContasDisponiveis = async () => {
    try {
      const response = await quitacaoService.listarContasDisponiveis(tipo);
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

  const resetForm = () => {
    setTipo('RECEBER');
    setClienteId('');
    setClienteLabel('');
    setFornecedorId('');
    setFornecedorLabel('');
    setSelectedContas(new Map());
    setDataQuitacao('');
    setFormaPagamento('');
    setObservacoes('');
  };

  const handleOpenDetail = (item: Quitacao) => {
    setSelectedItem(item);
    setDetailDialogOpen(true);
  };

  const toggleConta = (conta: ContaDisponivel) => {
    setSelectedContas((prev) => {
      const next = new Map(prev);
      if (next.has(conta.id)) {
        next.delete(conta.id);
      } else {
        next.set(conta.id, {
          contaId: conta.id,
          tipoConta: tipo,
          valorPago: conta.valorOriginal,
        });
      }
      return next;
    });
  };

  const updateValorPago = (contaId: string, valor: number) => {
    setSelectedContas((prev) => {
      const next = new Map(prev);
      const existing = next.get(contaId);
      if (existing) {
        next.set(contaId, { ...existing, valorPago: valor });
      }
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
    if (!dataQuitacao) {
      alert('Informe a data de quitação');
      return;
    }

    try {
      const data: Record<string, unknown> = {
        tipo,
        contas: Array.from(selectedContas.values()),
        dataQuitacao: new Date(dataQuitacao).toISOString(),
      };
      if (tipo === 'RECEBER') data.clienteId = clienteId;
      else data.fornecedorId = fornecedorId;
      if (formaPagamento) data.formaPagamento = formaPagamento;
      if (observacoes) data.observacoes = observacoes;

      await quitacaoService.criar(data as any);
      setDialogOpen(false);
      resetForm();
      loadItems();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getPessoaNome = (item: Quitacao) => {
    if (item.cliente) return item.cliente.nome;
    if (item.fornecedor) return item.fornecedor.nome;
    return '-';
  };

  const filteredItems = items.filter((item) => {
    if (!busca) return true;
    const nome = getPessoaNome(item).toLowerCase();
    return nome.includes(busca.toLowerCase());
  });

  const valorTotalSelecionado = Array.from(selectedContas.values()).reduce((s, c) => s + c.valorPago, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quitações</h1>
          <p className="text-muted-foreground">Quitação de contas a receber e a pagar</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Quitação
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quitado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(items.reduce((s, i) => s + i.valorTotal, 0))}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recebimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(items.filter((i) => i.tipo === 'RECEBER').reduce((s, i) => s + i.valorTotal, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(items.filter((i) => i.tipo === 'PAGAR').reduce((s, i) => s + i.valorTotal, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quantidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
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
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Pessoa</TableHead>
                <TableHead>Contas Quitadas</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead>Forma Pagamento</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">Carregando...</TableCell>
                </TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nenhuma quitação encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">{item.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <Badge variant={item.tipo === 'RECEBER' ? 'default' : 'secondary'}>
                        {item.tipo === 'RECEBER' ? 'Receber' : 'Pagar'}
                      </Badge>
                    </TableCell>
                    <TableCell>{getPessoaNome(item)}</TableCell>
                    <TableCell>{item.contas.length} conta(s)</TableCell>
                    <TableCell>{formatDate(item.dataQuitacao)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(item.valorTotal)}</TableCell>
                    <TableCell>{item.formaPagamento || '-'}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenDetail(item)} title="Ver detalhes">
                        <Eye className="h-4 w-4" />
                      </Button>
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
            <DialogTitle>Nova Quitação</DialogTitle>
            <DialogDescription>Selecione as contas a serem quitadas e defina os valores</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Tipo</Label>
                <Select value={tipo} onValueChange={(v) => { setTipo(v); setSelectedContas(new Map()); }}>
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
                      <TableHead className="text-right">Valor a Pagar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contasDisponiveis.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          Nenhuma conta disponível
                        </TableCell>
                      </TableRow>
                    ) : (
                      contasDisponiveis.map((conta) => {
                        const selected = selectedContas.get(conta.id);
                        return (
                          <TableRow key={conta.id} className={selected ? 'bg-muted/50' : ''}>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={!!selected}
                                onChange={() => toggleConta(conta)}
                                className="h-4 w-4"
                              />
                            </TableCell>
                            <TableCell className="font-medium">{conta.numeroDocumento}</TableCell>
                            <TableCell>{conta.numeroParcela}/{conta.totalParcelas}</TableCell>
                            <TableCell>{formatDate(conta.dataVencimento)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(conta.valorOriginal)}</TableCell>
                            <TableCell className="text-right">
                              {selected && (
                                <Input
                                  type="number"
                                  step="0.01"
                                  className="h-8 w-28 text-right"
                                  value={selected.valorPago}
                                  onChange={(e) => updateValorPago(conta.id, parseFloat(e.target.value) || 0)}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Data de Quitação</Label>
                <Input
                  type="date"
                  placeholder="Data em que a quitação foi realizada"
                  title="Selecione a data de realização da quitação"
                  value={dataQuitacao}
                  onChange={(e) => setDataQuitacao(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Forma de Pagamento</Label>
                <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="CARTAO_CREDITO">Cartão de Crédito</SelectItem>
                    <SelectItem value="CARTAO_DEBITO">Cartão de Débito</SelectItem>
                    <SelectItem value="BOLETO">Boleto</SelectItem>
                    <SelectItem value="TRANSFERENCIA">Transferência</SelectItem>
                    <SelectItem value="CHEQUE">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {valorTotalSelecionado > 0 && (
              <div className="text-sm text-muted-foreground">
                Total selecionado: <span className="font-bold text-foreground">{formatCurrency(valorTotalSelecionado)}</span>
              </div>
            )}

            <div className="grid gap-2">
              <Label>Observações</Label>
              <textarea
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Observações adicionais sobre a quitação..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancelar</Button>
            <Button onClick={handleCriar}>Quitar Contas</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Quitação</DialogTitle>
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
                  <span className="text-sm text-muted-foreground">Data de Quitação</span>
                  <p className="font-medium">{formatDate(selectedItem.dataQuitacao)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Forma de Pagamento</span>
                  <p className="font-medium">{selectedItem.formaPagamento || '-'}</p>
                </div>
              </div>

              <div className="p-3 bg-muted rounded-md">
                <span className="text-xs text-muted-foreground">Valor Total</span>
                <p className="font-semibold text-lg">{formatCurrency(selectedItem.valorTotal)}</p>
              </div>

              <div>
                <Label>Contas Quitadas</Label>
                <div className="border rounded-md mt-1">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Conta</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Valor Pago</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedItem.contas.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-mono text-xs">{c.contaId.slice(0, 8)}</TableCell>
                          <TableCell>
                            <Badge variant={c.tipoConta === 'RECEBER' ? 'default' : 'secondary'}>
                              {c.tipoConta === 'RECEBER' ? 'Receber' : 'Pagar'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(c.valorPago)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {selectedItem.observacoes && (
                <div>
                  <span className="text-sm text-muted-foreground">Observações</span>
                  <p className="text-sm">{selectedItem.observacoes}</p>
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
