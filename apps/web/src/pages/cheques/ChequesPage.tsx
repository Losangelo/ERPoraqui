import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { chequesService, Cheque, ChequeDashboard } from '@/services/cheques';
import { clientesService, Cliente } from '@/services/clientes';
import { fornecedoresService, Fornecedor } from '@/services/fornecedores';
import { Plus, Search, AlertCircle, Banknote, ArrowUpRight, ArrowDownLeft, Ban, XCircle } from 'lucide-react';

const situacaoConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' }> = {
  EM_CARTEIRA: { label: 'Em Carteira', variant: 'default' },
  DEPOSITADO: { label: 'Depositado', variant: 'warning' },
  COMPENSADO: { label: 'Compensado', variant: 'success' },
  DEVOLVIDO: { label: 'Devolvido', variant: 'destructive' },
  REPASSADO: { label: 'Repassado', variant: 'secondary' },
  CANCELADO: { label: 'Cancelado', variant: 'secondary' },
};

const tipoLabels: Record<string, string> = {
  RECEBIDO: 'Recebido',
  EMITIDO: 'Emitido',
};

export default function ChequesPage() {
  const [cheques, setCheques] = useState<Cheque[]>([]);
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<ChequeDashboard>({
    totalEmCarteira: 0, totalDepositado: 0, totalDevolvido: 0,
    totalCompensado: 0, quantidadeEmCarteira: 0, quantidadeDepositado: 0,
    quantidadeDevolvido: 0, quantidadeCompensado: 0,
  });
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroSituacao, setFiltroSituacao] = useState('');
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [busca, setBusca] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

  const [formData, setFormData] = useState({
    numero: '',
    banco: '',
    agencia: '',
    conta: '',
    emitente: '',
    valor: 0,
    dataEmissao: new Date().toISOString().slice(0, 10),
    dataVencimento: '',
    tipo: 'RECEBIDO' as 'RECEBIDO' | 'EMITIDO',
    clienteId: '',
    fornecedorId: '',
    observacoes: '',
  });

  useEffect(() => {
    loadCheques();
    loadDashboard();
    loadClientes();
    loadFornecedores();
  }, [filtroTipo, filtroSituacao, dataInicial, dataFinal]);

  const loadCheques = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filtroTipo) params.tipo = filtroTipo;
      if (filtroSituacao) params.situacao = filtroSituacao;
      if (dataInicial) params.dataInicial = dataInicial;
      if (dataFinal) params.dataFinal = dataFinal;
      const data = await chequesService.listar(params);
      setCheques(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar cheques:', error);
      setCheques([]);
    }
    setLoading(false);
  };

  const loadDashboard = async () => {
    try {
      const data = await chequesService.dashboard();
      setDashboard(data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    }
  };

  const loadClientes = async () => {
    try {
      const data = await clientesService.listar({ limite: 200 });
      setClientes(data || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const loadFornecedores = async () => {
    try {
      const data = await fornecedoresService.listar({ limite: 200 });
      setFornecedores(data || []);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      numero: '', banco: '', agencia: '', conta: '', emitente: '',
      valor: 0, dataEmissao: new Date().toISOString().slice(0, 10),
      dataVencimento: '', tipo: 'RECEBIDO', clienteId: '', fornecedorId: '', observacoes: '',
    });
  };

  const handleSubmit = async () => {
    try {
      await chequesService.criar(formData);
      setDialogOpen(false);
      resetForm();
      loadCheques();
      loadDashboard();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleAction = async (id: string, action: 'depositar' | 'compensar' | 'cancelar') => {
    try {
      if (action === 'depositar') await chequesService.depositar(id);
      else if (action === 'compensar') await chequesService.compensar(id);
      else if (action === 'cancelar') await chequesService.cancelar(id);
      loadCheques();
      loadDashboard();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleDevolver = async (id: string) => {
    const motivo = prompt('Motivo da devolução:');
    if (!motivo) return;
    try {
      await chequesService.devolver(id, motivo);
      loadCheques();
      loadDashboard();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('pt-BR');

  const chequesFiltrados = cheques.filter((ch) =>
    ch.numero.toLowerCase().includes(busca.toLowerCase()) ||
    ch.emitente.toLowerCase().includes(busca.toLowerCase()) ||
    ch.banco.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cheques</h1>
          <p className="text-muted-foreground">Gerenciamento de cheques recebidos e emitidos</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cheque
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Carteira</CardTitle>
            <Banknote className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboard.totalEmCarteira)}</div>
            <p className="text-xs text-muted-foreground">{dashboard.quantidadeEmCarteira} cheques</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Depositado</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboard.totalDepositado)}</div>
            <p className="text-xs text-muted-foreground">{dashboard.quantidadeDepositado} cheques</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compensado</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboard.totalCompensado)}</div>
            <p className="text-xs text-muted-foreground">{dashboard.quantidadeCompensado} cheques</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devolvido</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(dashboard.totalDevolvido)}</div>
            <p className="text-xs text-muted-foreground">{dashboard.quantidadeDevolvido} cheques</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por número, emitente ou banco..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filtroTipo || 'all'} onValueChange={(v) => setFiltroTipo(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="RECEBIDO">Recebido</SelectItem>
            <SelectItem value="EMITIDO">Emitido</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroSituacao || 'all'} onValueChange={(v) => setFiltroSituacao(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Situação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="EM_CARTEIRA">Em Carteira</SelectItem>
            <SelectItem value="DEPOSITADO">Depositado</SelectItem>
            <SelectItem value="COMPENSADO">Compensado</SelectItem>
            <SelectItem value="DEVOLVIDO">Devolvido</SelectItem>
            <SelectItem value="CANCELADO">Cancelado</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2 items-center">
          <Input type="date" placeholder="DD/MM/AAAA" title="Data inicial do filtro" value={dataInicial} onChange={(e) => setDataInicial(e.target.value)} className="w-40" />
          <span className="text-muted-foreground">até</span>
          <Input type="date" placeholder="DD/MM/AAAA" title="Data final do filtro" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} className="w-40" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Banco</TableHead>
                <TableHead>Emitente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">Carregando...</TableCell>
                </TableRow>
              ) : chequesFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nenhum cheque encontrado
                  </TableCell>
                </TableRow>
              ) : (
                chequesFiltrados.map((cheque) => {
                  const situacao = situacaoConfig[cheque.situacao] || { label: cheque.situacao, variant: 'default' as const };
                  return (
                    <TableRow key={cheque.id}>
                      <TableCell className="font-mono font-medium">{cheque.numero}</TableCell>
                      <TableCell>{cheque.banco} / {cheque.agencia}-{cheque.conta}</TableCell>
                      <TableCell>{cheque.emitente}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(cheque.valor)}</TableCell>
                      <TableCell>{formatDate(cheque.dataVencimento)}</TableCell>
                      <TableCell>
                        <Badge variant={cheque.tipo === 'RECEBIDO' ? 'default' : 'secondary'}>
                          {tipoLabels[cheque.tipo]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={situacao.variant}>{situacao.label}</Badge>
                        {cheque.situacao === 'DEVOLVIDO' && cheque.motivoDevolucao && (
                          <p className="text-xs text-red-500 mt-1">{cheque.motivoDevolucao}</p>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          {cheque.situacao === 'EM_CARTEIRA' && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => handleAction(cheque.id, 'depositar')}>
                                <ArrowUpRight className="h-4 w-4 text-yellow-600" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleAction(cheque.id, 'cancelar')}>
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                          {cheque.situacao === 'DEPOSITADO' && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => handleAction(cheque.id, 'compensar')}>
                                <ArrowDownLeft className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDevolver(cheque.id)}>
                                <Ban className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Novo Cheque</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Número</Label>
                <Input
                  placeholder="Número do cheque"
                  title="Ex: 000001"
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Tipo</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(v: 'RECEBIDO' | 'EMITIDO') => setFormData({ ...formData, tipo: v, clienteId: '', fornecedorId: '' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RECEBIDO">Recebido</SelectItem>
                    <SelectItem value="EMITIDO">Emitido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Banco</Label>
                <Input placeholder="Nome do banco emissor" title="Ex: Banco do Brasil, Itaú" value={formData.banco} onChange={(e) => setFormData({ ...formData, banco: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Agência</Label>
                <Input placeholder="Número da agência sem dígito" title="Ex: 1234" value={formData.agencia} onChange={(e) => setFormData({ ...formData, agencia: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Conta</Label>
                <Input placeholder="Número da conta corrente" title="Ex: 12345-0" value={formData.conta} onChange={(e) => setFormData({ ...formData, conta: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Emitente</Label>
              <Input placeholder="Nome completo do emitente do cheque" title="Pessoa física ou jurídica que emitiu o cheque" value={formData.emitente} onChange={(e) => setFormData({ ...formData, emitente: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Valor</Label>
                <Input
                  type="number"
                  placeholder="0,00"
                  title="Use vírgula para centavos. Ex: 1500,50"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
                  min={0}
                  step={0.01}
                />
              </div>
              <div className="grid gap-2">
                <Label>Vencimento</Label>
                <Input
                  type="date"
                  placeholder="DD/MM/AAAA"
                  title="Data de vencimento do cheque"
                  value={formData.dataVencimento}
                  onChange={(e) => setFormData({ ...formData, dataVencimento: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>{formData.tipo === 'RECEBIDO' ? 'Cliente' : 'Fornecedor'}</Label>
              <Select
                value={formData.tipo === 'RECEBIDO' ? formData.clienteId : formData.fornecedorId}
                onValueChange={(v) => {
                  if (formData.tipo === 'RECEBIDO') setFormData({ ...formData, clienteId: v });
                  else setFormData({ ...formData, fornecedorId: v });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {(formData.tipo === 'RECEBIDO' ? clientes : fornecedores).map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Observações</Label>
                <Input
                  placeholder="Informações adicionais relevantes"
                  title="Anotações sobre o cheque (opcional)"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
