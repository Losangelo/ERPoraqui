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
import { fornecedoresService, Fornecedor } from '@/services/fornecedores';
import { DollarSign, Plus, Search, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface ContaPagar {
  id: string;
  empresaId: string;
  fornecedorId: string;
  numeroDocumento: string;
  numeroParcela: number;
  totalParcelas: number;
  dataVencimento: string;
  dataEmissao: string;
  valorOriginal: number;
  valorPago: number;
  valorDesconto: number;
  valorJuros: number;
  valorMulta: number;
  situacao: string;
  formaPagamento: string | null;
  dataPagamento: string | null;
  fornecedor?: { id: string; nome: string; documento: string };
}

const situacoes: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' }> = {
  ABERTA: { label: 'Aberta', variant: 'default' },
  PAGO: { label: 'Pago', variant: 'success' },
  VENCIDO: { label: 'Vencido', variant: 'destructive' },
  CANCELADO: { label: 'Cancelado', variant: 'secondary' },
  BAIXADO: { label: 'Baixado', variant: 'warning' },
};

export default function ContasPagarPage() {
  const [contas, setContas] = useState<ContaPagar[]>([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  
  const [formData, setFormData] = useState({
    fornecedorId: '',
    numeroDocumento: '',
    dataVencimento: '',
    valorOriginal: 0,
    quantidadeParcelas: 1,
    intervaloParcelas: 30,
  });

  useEffect(() => {
    loadContas();
    loadFornecedores();
  }, [filtroStatus]);

  const loadContas = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filtroStatus) params.situacao = filtroStatus;
      const response = await financeiroService.listarPagar(params);
      setContas(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
      setContas([]);
    }
    setLoading(false);
  };

  const loadFornecedores = async () => {
    try {
      const response = await fornecedoresService.listar({ limite: 100 });
      setFornecedores(response || []);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
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
          fornecedorId: formData.fornecedorId,
          numeroDocumento: `${formData.numeroDocumento}-${i + 1}`,
          numeroParcela: i + 1,
          totalParcelas: formData.quantidadeParcelas,
          dataVencimento: dataVencimento.toISOString(),
          valorOriginal: valorParcela,
        });
      }

      for (const conta of contas) {
        await financeiroService.criarPagar(conta);
      }
      
      setDialogOpen(false);
      setFormData({ fornecedorId: '', numeroDocumento: '', dataVencimento: '', valorOriginal: 0, quantidadeParcelas: 1, intervaloParcelas: 30 });
      loadContas();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleBaixar = async (id: string) => {
    const formaPagamento = prompt('Forma de pagamento (DINHEIRO, PIX, CARTAO_CREDITO, CARTAO_DEBITO, BOLETO, TRANSFERENCIA):');
    if (!formaPagamento) return;
    
    try {
      await financeiroService.atualizarPagar(id, {
        situacao: 'PAGO',
        formaPagamento,
        dataPagamento: new Date().toISOString(),
        valorPago: 0,
      });
      loadContas();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleExcluir = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta conta?')) return;
    try {
      await financeiroService.excluirPagar(id);
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
    c.fornecedor?.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  const totalPagar = contas.filter(c => c.situacao === 'ABERTA' || c.situacao === 'VENCIDO').reduce((sum, c) => sum + c.valorOriginal, 0);
  const totalPago = contas.filter(c => c.situacao === 'PAGO').reduce((sum, c) => sum + c.valorPago, 0);
  const totalVencido = contas.filter(c => c.situacao === 'VENCIDO').reduce((sum, c) => sum + c.valorOriginal, 0);

  const colunasExportacao = [
    { label: 'Documento', accessor: 'numeroDocumento' },
    { label: 'Parcela', accessor: (row: Record<string, unknown>) => `${row.numeroParcela}/${row.totalParcelas}` },
    { label: 'Fornecedor', accessor: (row: Record<string, unknown>) => (row.fornecedor as { nome?: string })?.nome || '-' },
    { label: 'Vencimento', accessor: (row: Record<string, unknown>) => formatDate(row.dataVencimento as string) },
    { label: 'Valor', accessor: (row: Record<string, unknown>) => formatCurrency(row.valorOriginal as number) },
    { label: 'Pago', accessor: (row: Record<string, unknown>) => formatCurrency(row.valorPago as number) },
    { label: 'Status', accessor: 'situacao' },
  ];

  return (
    <div id="relatorio-contas-pagar" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contas a Pagar</h1>
          <p className="text-muted-foreground">Gerenciamento de contas a pagar</p>
        </div>
        <div className="flex gap-2">
          <ExportButton
            dados={contasFiltradas as unknown as Record<string, unknown>[]}
            colunas={colunasExportacao}
            nomeArquivo="contas-a-pagar"
            tituloRelatorio="Contas a Pagar"
            elementoIdParaPDF="relatorio-contas-pagar"
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
            <CardTitle className="text-sm font-medium">Total a Pagar</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPagar)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pago</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPago)}</div>
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
            placeholder="Buscar por número ou fornecedor..."
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
                <TableHead>Fornecedor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Pago</TableHead>
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
                    Nenhuma conta a pagar encontrada
                  </TableCell>
                </TableRow>
              ) : (
                contasFiltradas.map((conta) => (
                  <TableRow key={conta.id}>
                    <TableCell className="font-medium">{conta.numeroDocumento}</TableCell>
                    <TableCell>{conta.numeroParcela}/{conta.totalParcelas}</TableCell>
                    <TableCell>{conta.fornecedor?.nome || '-'}</TableCell>
                    <TableCell>{formatDate(conta.dataVencimento)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(conta.valorOriginal)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(conta.valorPago)}</TableCell>
                    <TableCell>{getSituacaoBadge(conta.situacao)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        {conta.situacao === 'ABERTA' && (
                          <Button variant="ghost" size="sm" onClick={() => handleBaixar(conta.id)}>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        {conta.situacao !== 'PAGO' && (
                          <Button variant="ghost" size="sm" onClick={() => handleExcluir(conta.id)}>
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
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Nova Conta a Pagar</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Fornecedor</Label>
              <Select value={formData.fornecedorId} onValueChange={(v) => setFormData({...formData, fornecedorId: v})}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {fornecedores.map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.nome}</SelectItem>
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
