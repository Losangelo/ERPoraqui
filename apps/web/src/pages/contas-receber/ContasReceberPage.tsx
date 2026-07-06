import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExportButton } from '@/components/export/ExportButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { financeiroService } from '@/services/financeiro';
import { clientesService, Cliente } from '@/services/clientes';
import { DollarSign, Plus, Search, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface ContaReceber {
  id: string;
  empresaId: string;
  clienteId: string;
  numeroDocumento: string;
  numeroParcela: number;
  totalParcelas: number;
  dataVencimento: string;
  dataEmissao: string;
  valorOriginal: number;
  valorRecebido: number;
  valorDesconto: number;
  valorJuros: number;
  valorMulta: number;
  situacao: string;
  formaPagamento: string | null;
  dataRecebimento: string | null;
  cliente?: { id: string; nome: string; documento: string };
}

const situacoes: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' }> = {
  ABERTA: { label: 'Aberta', variant: 'default' },
  PAGO: { label: 'Pago', variant: 'success' },
  VENCIDO: { label: 'Vencido', variant: 'destructive' },
  CANCELADO: { label: 'Cancelado', variant: 'secondary' },
  BAIXADO: { label: 'Baixado', variant: 'warning' },
};

export default function ContasReceberPage() {
  const [contas, setContas] = useState<ContaReceber[]>([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  
  const [formData, setFormData] = useState({
    clienteId: '',
    numeroDocumento: '',
    dataVencimento: '',
    valorOriginal: 0,
    quantidadeParcelas: 1,
    intervaloParcelas: 30,
  });

  useEffect(() => {
    loadContas();
    loadClientes();
  }, [filtroStatus]);

  const loadContas = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filtroStatus) params.situacao = filtroStatus;
      const response = await financeiroService.listarReceber(params);
      setContas(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
      setContas([]);
    }
    setLoading(false);
  };

  const loadClientes = async () => {
    try {
      const response = await clientesService.listar({ limite: 100 });
      setClientes(response || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const handleCriar = async () => {
    try {
      const contas = [];
      const valorParcela = formData.valorOriginal / formData.quantidadeParcelas;
      
      for (let i = 0; i < formData.quantidadeParcelas; i++) {
        const dataVencimento = new Date(formData.dataVencimento);
        dataVencimento.setDate(dataVencimento.getDate() + (i * formData.intervaloParcelas));
        
        contas.push({
          clienteId: formData.clienteId,
          numeroDocumento: `${formData.numeroDocumento}-${i + 1}`,
          numeroParcela: i + 1,
          totalParcelas: formData.quantidadeParcelas,
          dataVencimento: dataVencimento.toISOString(),
          valorOriginal: valorParcela,
        });
      }

      for (const conta of contas) {
        await financeiroService.criarReceber(conta);
      }
      
      setDialogOpen(false);
      setFormData({ clienteId: '', numeroDocumento: '', dataVencimento: '', valorOriginal: 0, quantidadeParcelas: 1, intervaloParcelas: 30 });
      loadContas();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleBaixar = async (id: string) => {
    const formaPagamento = prompt('Forma de pagamento (DINHEIRO, PIX, CARTAO_CREDITO, CARTAO_DEBITO, BOLETO):');
    if (!formaPagamento) return;
    
    try {
      await financeiroService.atualizarReceber(id, {
        situacao: 'PAGO',
        formaPagamento,
        dataRecebimento: new Date().toISOString(),
        valorRecebido: 0,
      });
      loadContas();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleExcluir = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta conta?')) return;
    try {
      await financeiroService.excluirReceber(id);
      loadContas();
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

  const contasFiltradas = contas.filter(c =>
    c.numeroDocumento?.toLowerCase().includes(busca.toLowerCase()) ||
    c.cliente?.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  const totalReceber = contas.filter(c => c.situacao === 'ABERTA' || c.situacao === 'VENCIDO').reduce((sum, c) => sum + c.valorOriginal, 0);
  const totalRecebido = contas.filter(c => c.situacao === 'PAGO').reduce((sum, c) => sum + c.valorRecebido, 0);
  const totalVencido = contas.filter(c => c.situacao === 'VENCIDO').reduce((sum, c) => sum + c.valorOriginal, 0);

  const colunasExportacao = [
    { label: 'Documento', accessor: 'numeroDocumento' },
    { label: 'Parcela', accessor: (row: Record<string, unknown>) => `${row.numeroParcela}/${row.totalParcelas}` },
    { label: 'Cliente', accessor: (row: Record<string, unknown>) => (row.cliente as { nome?: string })?.nome || '-' },
    { label: 'Vencimento', accessor: (row: Record<string, unknown>) => formatDate(row.dataVencimento as string) },
    { label: 'Valor', accessor: (row: Record<string, unknown>) => formatCurrency(row.valorOriginal as number) },
    { label: 'Recebido', accessor: (row: Record<string, unknown>) => formatCurrency(row.valorRecebido as number) },
    { label: 'Status', accessor: 'situacao' },
  ];

  return (
    <div id="relatorio-contas-receber" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contas a Receber</h1>
          <p className="text-muted-foreground">Gerenciamento de contas a receber</p>
        </div>
        <div className="flex gap-2">
          <ExportButton
            dados={contasFiltradas as unknown as Record<string, unknown>[]}
            colunas={colunasExportacao}
            nomeArquivo="contas-a-receber"
            tituloRelatorio="Contas a Receber"
            elementoIdParaPDF="relatorio-contas-receber"
          />
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Conta
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total a Receber</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalReceber)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recebido</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRecebido)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencido</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalVencido)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Contas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contas.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por número ou cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filtroStatus || 'all'} onValueChange={(v) => setFiltroStatus(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="ABERTA">Aberta</SelectItem>
            <SelectItem value="PAGO">Pago</SelectItem>
            <SelectItem value="VENCIDO">Vencido</SelectItem>
            <SelectItem value="CANCELADO">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead>Parcela</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Recebido</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">Carregando...</TableCell>
                </TableRow>
              ) : contasFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nenhuma conta a receber encontrada
                  </TableCell>
                </TableRow>
              ) : (
                contasFiltradas.map((conta) => (
                  <TableRow key={conta.id}>
                    <TableCell className="font-medium">{conta.numeroDocumento}</TableCell>
                    <TableCell>{conta.numeroParcela}/{conta.totalParcelas}</TableCell>
                    <TableCell>{conta.cliente?.nome || '-'}</TableCell>
                    <TableCell>{formatDate(conta.dataVencimento)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(conta.valorOriginal)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(conta.valorRecebido)}</TableCell>
                    <TableCell>{getSituacaoBadge(conta.situacao)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        {conta.situacao === 'ABERTA' && (
                          <Button variant="ghost" size="sm" title="Baixar conta a receber" onClick={() => handleBaixar(conta.id)}>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        {conta.situacao !== 'PAGO' && (
                          <Button variant="ghost" size="sm" title="Excluir conta a receber" onClick={() => handleExcluir(conta.id)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Conta a Receber</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Cliente</Label>
              <Select value={formData.clienteId} onValueChange={(v) => setFormData({...formData, clienteId: v})}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {clientes.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Número Documento</Label>
              <Input 
                placeholder="Número do documento fiscal ou contrato"
                title="Ex: NF-12345 ou CTR-001"
                value={formData.numeroDocumento}
                onChange={(e) => setFormData({...formData, numeroDocumento: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label>Data Vencimento</Label>
              <Input 
                type="date"
                placeholder="dd/mm/aaaa"
                title="Selecione a data de vencimento da conta"
                value={formData.dataVencimento}
                onChange={(e) => setFormData({...formData, dataVencimento: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label>Valor Total</Label>
              <Input 
                type="number"
                placeholder="Valor total da conta"
                title="Use ponto para decimais. Ex: 1500.50"
                value={formData.valorOriginal}
                onChange={(e) => setFormData({...formData, valorOriginal: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Parcelas</Label>
                <Input 
                  type="number"
                  placeholder="Quantidade de parcelas"
                  title="Mínimo de 1 parcela"
                  value={formData.quantidadeParcelas}
                  onChange={(e) => setFormData({...formData, quantidadeParcelas: parseInt(e.target.value) || 1})}
                />
              </div>
              <div className="grid gap-2">
                <Label>Intervalo (dias)</Label>
                <Input 
                  type="number"
                  placeholder="Dias entre parcelas"
                  title="Ex: 30 para parcelas mensais"
                  value={formData.intervaloParcelas}
                  onChange={(e) => setFormData({...formData, intervaloParcelas: parseInt(e.target.value) || 30})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCriar}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
