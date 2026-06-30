import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ecfService, ECF, Cupom, ReducaoZ } from '@/services/ecf';
import { Printer, Plus, ShoppingCart, DollarSign, Trash2, Send } from 'lucide-react';

export default function ECFPage() {
  const [ecfs, setEcfs] = useState<ECF[]>([]);
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [reducoes, setReducoes] = useState<ReducaoZ[]>([]);
  const [selectedECF, setSelectedECF] = useState<ECF | null>(null);
  const [_loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tab, setTab] = useState<'ecfs' | 'cupons' | 'operacoes'>('ecfs');
  const [formData, setFormData] = useState<Partial<ECF>>({
    identificacao: '',
    marca: '',
    modelo: '',
    numeroSerie: '',
    numeroFabricacao: '',
    versaoSB: '',
  });

  useEffect(() => {
    carregarECFs();
  }, []);

  const carregarECFs = async () => {
    setLoading(true);
    try {
      const data = await ecfService.listar();
      setEcfs(data);
      if (data.length > 0 && !selectedECF) {
        setSelectedECF(data[0]);
        carregarCupons(data[0].id);
        carregarReducoes(data[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar ECF:', error);
    }
    setLoading(false);
  };

  const carregarCupons = async (ecfId: string) => {
    try {
      const data = await ecfService.listarCupons(ecfId);
      setCupons(data);
    } catch (error) {
      console.error('Erro ao carregar cupons:', error);
    }
  };

  const carregarReducoes = async (ecfId: string) => {
    try {
      const data = await ecfService.listarReducoesZ(ecfId);
      setReducoes(data);
    } catch (error) {
      console.error('Erro ao carregar reduções Z:', error);
    }
  };

  const handleCriarECF = async () => {
    try {
      await ecfService.criar(formData);
      setDialogOpen(false);
      setFormData({ identificacao: '', marca: '', modelo: '', numeroSerie: '', numeroFabricacao: '', versaoSB: '' });
      carregarECFs();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleSelectECF = (ecf: ECF) => {
    setSelectedECF(ecf);
    carregarCupons(ecf.id);
    carregarReducoes(ecf.id);
  };

  const handleSuprimento = async () => {
    if (!selectedECF) return;
    const valor = prompt('Valor do suprimento:');
    if (!valor) return;
    try {
      await ecfService.criarSuprimento(selectedECF.id, { valor: parseFloat(valor), tipo: 'SUPRIMENTO' });
      alert('Suprimento realizado com sucesso!');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSangria = async () => {
    if (!selectedECF) return;
    const valor = prompt('Valor da sangria:');
    const motivo = prompt('Motivo:');
    if (!valor || !motivo) return;
    try {
      await ecfService.criarSangria(selectedECF.id, { valor: parseFloat(valor), motivo });
      alert('Sangria realizada com sucesso!');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleReducaoZ = async () => {
    if (!selectedECF) return;
    if (!confirm('Confirma a emissão da Redução Z?')) return;
    try {
      await ecfService.criarReducaoZ(selectedECF.id, {
        dataMovimento: new Date(),
        numeroReducao: reducoes.length + 1,
        cro: 1,
        crz: reducoes.length + 1,
        cooInicial: 1,
        cooFinal: cupons.filter(c => c.situacao === 'FINALIZADO').length,
        gtInicial: 0,
        gtFinal: cupons.filter(c => c.situacao === 'FINALIZADO').reduce((sum, c) => sum + c.valorTotal, 0),
        valorVendaBruta: cupons.filter(c => c.situacao === 'FINALIZADO').reduce((sum, c) => sum + c.valorTotal, 0),
        valorTotalSuprimento: 0,
        valorTotalSangria: 0,
        valorBaseICMS: 0,
        valorICMS: 0,
        valorISS: 0,
        valorPIS: 0,
        valorCOFINS: 0,
      });
      alert('Redução Z emitida com sucesso!');
      carregarReducoes(selectedECF.id);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  const getSituacaoBadge = (situacao: string) => {
    const config: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      ABERTO: { label: 'Aberto', variant: 'secondary' },
      FINALIZADO: { label: 'Finalizado', variant: 'outline' },
      CANCELADO: { label: 'Cancelado', variant: 'destructive' },
    };
    return <Badge variant={config[situacao]?.variant || 'outline'}>{config[situacao]?.label || situacao}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">ECF</h1>
          <p className="text-muted-foreground">Emissor Cupom Fiscal</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo ECF
        </Button>
      </div>

      {selectedECF && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ECF</CardTitle>
              <Printer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{selectedECF.identificacao}</div>
              <div className="text-xs text-muted-foreground">{selectedECF.marca} - {selectedECF.modelo}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Série</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{selectedECF.numeroSerie}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cupons Hoje</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cupons.filter(c => c.situacao === 'FINALIZADO').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{formatCurrency(cupons.filter(c => c.situacao === 'FINALIZADO').reduce((sum, c) => sum + c.valorTotal, 0))}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant={tab === 'ecfs' ? 'default' : 'outline'} onClick={() => setTab('ecfs')}>Equipamentos</Button>
        <Button variant={tab === 'cupons' ? 'default' : 'outline'} onClick={() => setTab('cupons')}>Cupons</Button>
        <Button variant={tab === 'operacoes' ? 'default' : 'outline'} onClick={() => setTab('operacoes')}>Operações</Button>
      </div>

      {tab === 'ecfs' && (
        <Card>
          <CardHeader><CardTitle>Equipamentos ECF</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Identificação</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Série</TableHead>
                  <TableHead>Versão SB</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ecfs.map((ecf) => (
                  <TableRow key={ecf.id} className={selectedECF?.id === ecf.id ? 'bg-primary/10' : ''}>
                    <TableCell className="font-medium">{ecf.identificacao}</TableCell>
                    <TableCell>{ecf.marca}</TableCell>
                    <TableCell>{ecf.modelo}</TableCell>
                    <TableCell>{ecf.numeroSerie}</TableCell>
                    <TableCell>{ecf.versaoSB}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleSelectECF(ecf)}>Selecionar</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {ecfs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum ECF cadastrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {tab === 'cupons' && (
        <Card>
          <CardHeader><CardTitle>Cupons Fiscais</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>COO</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Forma Pagto</TableHead>
                  <TableHead>Situação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cupons.map((cupom) => (
                  <TableRow key={cupom.id}>
                    <TableCell className="font-medium">{cupom.numeroCupom}</TableCell>
                    <TableCell>{cupom.coo}</TableCell>
                    <TableCell>{formatDate(cupom.dataEmissao)}</TableCell>
                    <TableCell>{formatCurrency(cupom.valorTotal)}</TableCell>
                    <TableCell>{cupom.formaPagamento}</TableCell>
                    <TableCell>{getSituacaoBadge(cupom.situacao)}</TableCell>
                  </TableRow>
                ))}
                {cupons.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum cupom encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {tab === 'operacoes' && selectedECF && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>Suprimento</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Adicionar dinheiro ao caixa</p>
              <Button className="w-full" onClick={handleSuprimento}>
                <DollarSign className="h-4 w-4 mr-2" />
                Novo Suprimento
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Sangria</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Retirar dinheiro do caixa</p>
              <Button className="w-full" variant="destructive" onClick={handleSangria}>
                <Trash2 className="h-4 w-4 mr-2" />
                Nova Sangria
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Redução Z</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Fechar movimento do dia</p>
              <Button className="w-full" variant="outline" onClick={handleReducaoZ}>
                <Send className="h-4 w-4 mr-2" />
                Emitir Redução Z
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo ECF</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Identificação</Label>
              <Input value={formData.identificacao} onChange={(e) => setFormData({ ...formData, identificacao: e.target.value })} placeholder="PDV-01" />
            </div>
            <div className="grid gap-2">
              <Label>Marca</Label>
              <Input value={formData.marca} onChange={(e) => setFormData({ ...formData, marca: e.target.value })} placeholder="Bematech" />
            </div>
            <div className="grid gap-2">
              <Label>Modelo</Label>
              <Input value={formData.modelo} onChange={(e) => setFormData({ ...formData, modelo: e.target.value })} placeholder="MP4200TH" />
            </div>
            <div className="grid gap-2">
              <Label>Número Série</Label>
              <Input value={formData.numeroSerie} onChange={(e) => setFormData({ ...formData, numeroSerie: e.target.value })} placeholder="123456789" />
            </div>
            <div className="grid gap-2">
              <Label>Número Fabricação</Label>
              <Input value={formData.numeroFabricacao} onChange={(e) => setFormData({ ...formData, numeroFabricacao: e.target.value })} placeholder="001234567890" />
            </div>
            <div className="grid gap-2">
              <Label>Versão SB</Label>
              <Input value={formData.versaoSB} onChange={(e) => setFormData({ ...formData, versaoSB: e.target.value })} placeholder="1.00.00" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCriarECF}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
