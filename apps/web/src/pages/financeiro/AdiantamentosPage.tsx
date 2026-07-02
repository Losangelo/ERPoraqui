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
import { adiantamentoService, Adiantamento } from '@/services/adiantamentos';
import { Plus, Search, CheckCircle, XCircle, Pencil, Trash2 } from 'lucide-react';

const situacoes: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline' }> = {
  ABERTO: { label: 'Aberto', variant: 'warning' },
  QUITADO: { label: 'Quitado', variant: 'success' },
  CANCELADO: { label: 'Cancelado', variant: 'secondary' },
};

const tiposPessoa: Record<string, string> = {
  CLIENTE: 'Cliente',
  FORNECEDOR: 'Fornecedor',
  FUNCIONARIO: 'Funcionário',
};

export default function AdiantamentosPage() {
  const [items, setItems] = useState<Adiantamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroSituacao, setFiltroSituacao] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [tipo, setTipo] = useState('CLIENTE');
  const [clienteId, setClienteId] = useState('');
  const [clienteLabel, setClienteLabel] = useState('');
  const [fornecedorId, setFornecedorId] = useState('');
  const [fornecedorLabel, setFornecedorLabel] = useState('');
  const [valor, setValor] = useState(0);
  const [dataAdiantamento, setDataAdiantamento] = useState('');
  const [dataPrevisao, setDataPrevisao] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
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
      const response = await adiantamentoService.listar(params);
      setItems(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Erro ao carregar adiantamentos:', error);
      setItems([]);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setTipo('CLIENTE');
    setClienteId('');
    setClienteLabel('');
    setFornecedorId('');
    setFornecedorLabel('');
    setValor(0);
    setDataAdiantamento('');
    setDataPrevisao('');
    setFormaPagamento('');
    setObservacoes('');
    setEditingId(null);
  };

  const handleOpenEdit = (item: Adiantamento) => {
    setEditingId(item.id);
    setTipo(item.tipo);
    if (item.cliente) {
      setClienteId(item.cliente.id);
      setClienteLabel(item.cliente.nome);
    }
    if (item.fornecedor) {
      setFornecedorId(item.fornecedor.id);
      setFornecedorLabel(item.fornecedor.nome);
    }
    setValor(item.valor);
    setDataAdiantamento(new Date(item.dataAdiantamento).toISOString().split('T')[0]);
    setDataPrevisao(item.dataPrevisao ? new Date(item.dataPrevisao).toISOString().split('T')[0] : '');
    setFormaPagamento(item.formaPagamento || '');
    setObservacoes(item.observacoes || '');
    setDialogOpen(true);
  };

  const handleQuitar = async (id: string) => {
    try {
      await adiantamentoService.quitar(id);
      loadItems();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Tem certeza que deseja cancelar este adiantamento?')) return;
    try {
      await adiantamentoService.cancelar(id);
      loadItems();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleExcluir = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este adiantamento?')) return;
    try {
      await adiantamentoService.excluir(id);
      loadItems();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleSalvar = async () => {
    if (!valor || valor <= 0) {
      alert('Informe um valor válido');
      return;
    }
    if (!dataAdiantamento) {
      alert('Informe a data do adiantamento');
      return;
    }
    if (tipo === 'CLIENTE' && !clienteId) {
      alert('Selecione um cliente');
      return;
    }
    if (tipo === 'FORNECEDOR' && !fornecedorId) {
      alert('Selecione um fornecedor');
      return;
    }

    try {
      const data: Record<string, unknown> = {
        tipo,
        valor,
        dataAdiantamento: new Date(dataAdiantamento).toISOString(),
      };
      if (tipo === 'CLIENTE') data.clienteId = clienteId;
      if (tipo === 'FORNECEDOR') data.fornecedorId = fornecedorId;
      if (dataPrevisao) data.dataPrevisao = new Date(dataPrevisao).toISOString();
      if (formaPagamento) data.formaPagamento = formaPagamento;
      if (observacoes) data.observacoes = observacoes;

      if (editingId) {
        await adiantamentoService.atualizar(editingId, data as any);
      } else {
        await adiantamentoService.criar(data as any);
      }
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

  const getSituacaoBadge = (situacao: string) => {
    const config = situacoes[situacao] || { label: situacao, variant: 'default' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPessoaNome = (item: Adiantamento) => {
    if (item.cliente) return item.cliente.nome;
    if (item.fornecedor) return item.fornecedor.nome;
    return '-';
  };

  const filteredItems = items.filter((item) => {
    if (!busca) return true;
    const nome = getPessoaNome(item).toLowerCase();
    return nome.includes(busca.toLowerCase());
  });

  const totalAberto = items.filter((i) => i.situacao === 'ABERTO').reduce((s, i) => s + i.valor, 0);
  const totalQuitado = items.filter((i) => i.situacao === 'QUITADO').reduce((s, i) => s + i.valor, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Adiantamentos</h1>
          <p className="text-muted-foreground">Gerenciamento de adiantamentos para clientes, fornecedores e funcionários</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Adiantamento
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Adiantamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(items.reduce((s, i) => s + i.valor, 0))}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Aberto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(totalAberto)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quitados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalQuitado)}</div>
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
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="CLIENTE">Cliente</SelectItem>
            <SelectItem value="FORNECEDOR">Fornecedor</SelectItem>
            <SelectItem value="FUNCIONARIO">Funcionário</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroSituacao || 'all'} onValueChange={(v) => setFiltroSituacao(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Situação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="ABERTO">Aberto</SelectItem>
            <SelectItem value="QUITADO">Quitado</SelectItem>
            <SelectItem value="CANCELADO">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Pessoa</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Previsão</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">Carregando...</TableCell>
                </TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum adiantamento encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge variant="outline">{tiposPessoa[item.tipo] || item.tipo}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{getPessoaNome(item)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.valor)}</TableCell>
                    <TableCell>{formatDate(item.dataAdiantamento)}</TableCell>
                    <TableCell>{item.dataPrevisao ? formatDate(item.dataPrevisao) : '-'}</TableCell>
                    <TableCell>{getSituacaoBadge(item.situacao)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-1 justify-center">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(item)} title="Editar">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {item.situacao === 'ABERTO' && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleQuitar(item.id)} title="Quitar">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleCancel(item.id)} title="Cancelar">
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleExcluir(item.id)} title="Excluir">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
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
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Adiantamento' : 'Novo Adiantamento'}</DialogTitle>
            <DialogDescription>Registre um adiantamento para cliente, fornecedor ou funcionário</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={tipo} onValueChange={(v) => { setTipo(v); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLIENTE">Cliente</SelectItem>
                    <SelectItem value="FORNECEDOR">Fornecedor</SelectItem>
                    <SelectItem value="FUNCIONARIO">Funcionário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>{tipo === 'CLIENTE' ? 'Cliente' : tipo === 'FORNECEDOR' ? 'Fornecedor' : 'Funcionário'}</Label>
                {tipo === 'CLIENTE' ? (
                  <LookupField
                    source="clientes"
                    value={clienteId}
                    selectedLabel={clienteLabel}
                    onChange={(item: any) => { setClienteId(item.id); setClienteLabel(item.nome); }}
                    onClear={() => { setClienteId(''); setClienteLabel(''); }}
                    placeholder="Selecionar cliente..."
                  />
                ) : tipo === 'FORNECEDOR' ? (
                  <LookupField
                    source="fornecedores"
                    value={fornecedorId}
                    selectedLabel={fornecedorLabel}
                    onChange={(item: any) => { setFornecedorId(item.id); setFornecedorLabel(item.nome); }}
                    onClear={() => { setFornecedorId(''); setFornecedorLabel(''); }}
                    placeholder="Selecionar fornecedor..."
                  />
                ) : (
                  <LookupField
                    source="vendedores"
                    value={''}
                    onChange={(item: any) => { setFornecedorId(item.id); setFornecedorLabel(item.nome); }}
                    placeholder="Selecionar funcionário..."
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="valor">Valor</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  placeholder="Valor do adiantamento"
                  title="Valor em reais do adiantamento"
                  value={valor}
                  onChange={(e) => setValor(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dataAdiantamento">Data do Adiantamento</Label>
                <Input
                  id="dataAdiantamento"
                  type="date"
                  placeholder="Data em que o adiantamento foi realizado"
                  title="Selecione a data de realização do adiantamento"
                  value={dataAdiantamento}
                  onChange={(e) => setDataAdiantamento(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dataPrevisao">Data de Previsão</Label>
                <Input
                  id="dataPrevisao"
                  type="date"
                  placeholder="Data prevista para quitação"
                  title="Selecione a data prevista para quitação do adiantamento (opcional)"
                  value={dataPrevisao}
                  onChange={(e) => setDataPrevisao(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="observacoes">Observações</Label>
              <textarea
                id="observacoes"
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Observações adicionais sobre o adiantamento..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancelar</Button>
            <Button onClick={handleSalvar}>{editingId ? 'Atualizar' : 'Criar Adiantamento'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
