import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { nfceService, NFCe, NFCeFiltros, CriarNFCeDto } from '@/services/nfce';
import { clientesService, Cliente } from '@/services/clientes';
import { produtosService, Produto } from '@/services/produtos';
import { FilialSelect } from '@/components/FilialSelect';
import { FileText, Plus, Send, XCircle, CheckCircle, QrCode, Trash2 } from 'lucide-react';

const situacoes: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }> = {
  EM_DIGITACAO: { label: 'Rascunho', variant: 'secondary' },
  ASSINADA: { label: 'Assinada', variant: 'default' },
  ENVIADA: { label: 'Enviada', variant: 'warning' },
  AUTORIZADA: { label: 'Autorizada', variant: 'success' },
  CONTINGENCIA: { label: 'Contingência', variant: 'secondary' },
  CANCELADA: { label: 'Cancelada', variant: 'destructive' },
  DENEGADA: { label: 'Denegada', variant: 'destructive' },
};

export default function NFCePage() {
  const [notas, setNotas] = useState<NFCe[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtros] = useState<NFCeFiltros>({ pagina: 1, limite: 20 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tab, setTab] = useState('dados');
  
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  
  const [formData, setFormData] = useState<CriarNFCeDto>({
    filialId: '',
    clienteId: '',
    naturezaOperacao: 'VENDA MERCADO INTERNO',
    itens: [],
  });

  const [itemProduto, setItemProduto] = useState('');
  const [itemQtd, setItemQtd] = useState('1');
  const [itemValor, setItemValor] = useState('');
  const [itemDesconto, setItemDesconto] = useState('0');

  useEffect(() => {
    carregarNotas();
    carregarClientes();
    carregarProdutos();
  }, []);

  const carregarNotas = async () => {
    setLoading(true);
    try {
      const result = await nfceService.listar(filtros);
      setNotas(result || []);
    } catch (error) {
      console.error('Erro ao carregar NFC-e:', error);
    }
    setLoading(false);
  };

  const carregarClientes = async () => {
    try {
      const response = await clientesService.listar({ limite: 100 });
      setClientes(response || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const carregarProdutos = async () => {
    try {
      const response = await produtosService.listar({ limite: 100 });
      setProdutos(response || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const handleCriar = async () => {
    if (!formData.itens || formData.itens.length === 0) {
      alert('Adicione pelo menos um item');
      return;
    }
    try {
      await nfceService.criar(formData);
      setDialogOpen(false);
      setFormData({ filialId: '', clienteId: '', naturezaOperacao: 'VENDA MERCADO INTERNO', itens: [] });
      carregarNotas();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleAddItem = () => {
    const prod = produtos.find(p => p.id === itemProduto);
    if (!prod || !itemQtd || !itemValor) {
      alert('Selecione um produto e informe quantidade e valor');
      return;
    }
    
    const qtd = parseFloat(itemQtd);
    const valor = parseFloat(itemValor);
    const desconto = parseFloat(itemDesconto) || 0;
    
    const novoItem = {
      produtoId: prod.id,
      codigo: prod.codigoInterno || prod.id,
      descricao: prod.nome,
      ncm: prod.ncm || '',
      cfop: '5102',
      unidadeComercial: prod.unidadeMedidaId || 'UN',
      quantidadeComercial: qtd,
      valorUnitarioComercial: valor,
      valorDesconto: desconto,
      icmsAliquota: 18,
      pisAliquota: 1.65,
      cofinsAliquota: 7.6,
    };
    
    setFormData({
      ...formData,
      itens: [...(formData.itens || []), novoItem],
    });
    setItemProduto('');
    setItemQtd('1');
    setItemValor('');
    setItemDesconto('0');
  };

  const handleRemoveItem = (index: number) => {
    const novosItens = [...(formData.itens || [])];
    novosItens.splice(index, 1);
    setFormData({ ...formData, itens: novosItens });
  };

  const handleAssinar = async (id: string) => {
    try {
      await nfceService.assinar(id);
      carregarNotas();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleEnviar = async (id: string) => {
    try {
      await nfceService.enviar(id);
      carregarNotas();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleCancelar = async (id: string) => {
    const justificativa = prompt('Justificativa do cancelamento:');
    if (!justificativa) return;
    try {
      await nfceService.cancelar(id, justificativa);
      carregarNotas();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  const getSituacaoBadge = (situacao: string) => {
    const config = situacoes[situacao] || { label: situacao, variant: 'outline' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const valorTotal = (formData.itens || []).reduce((sum, item) => {
    const qtd = item.quantidadeComercial || 0;
    const valor = item.valorUnitarioComercial || 0;
    const desconto = item.valorDesconto || 0;
    return sum + (qtd * valor) - desconto;
  }, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">NFC-e</h1>
          <p className="text-muted-foreground">Nota Fiscal do Consumidor Eletrônica</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova NFC-e
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notas.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Autorizadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notas.filter(n => n.situacao === 'AUTORIZADA').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Send className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notas.filter(n => ['EM_DIGITACAO', 'ASSINADA'].includes(n.situacao)).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notas.filter(n => n.situacao === 'CANCELADA').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de NFC-e</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Série</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">Carregando...</TableCell>
                </TableRow>
              ) : notas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhuma NFC-e encontrada
                  </TableCell>
                </TableRow>
              ) : (
                notas.map((nota) => (
                  <TableRow key={nota.id}>
                    <TableCell className="font-medium">{nota.numero || '-'}</TableCell>
                    <TableCell>{nota.serie || '-'}</TableCell>
                    <TableCell>{nota.dataEmissao ? formatDate(nota.dataEmissao) : '-'}</TableCell>
                    <TableCell>{formatCurrency(nota.valorTotal || 0)}</TableCell>
                    <TableCell>{getSituacaoBadge(nota.situacao)}</TableCell>
                    <TableCell className="text-right">
                      {nota.situacao === 'EM_DIGITACAO' && (
                        <Button variant="outline" size="sm" onClick={() => handleAssinar(nota.id)}>
                          Assinar
                        </Button>
                      )}
                      {nota.situacao === 'ASSINADA' && (
                        <Button variant="outline" size="sm" onClick={() => handleEnviar(nota.id)}>
                          Enviar
                        </Button>
                      )}
                      {nota.situacao === 'AUTORIZADA' && (
                        <>
                          <Button variant="outline" size="sm" className="mr-2">
                            <QrCode className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleCancelar(nota.id)}>
                            Cancelar
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Nova NFC-e</DialogTitle>
          </DialogHeader>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="dados">Dados Gerais</TabsTrigger>
              <TabsTrigger value="itens">Itens ({formData.itens?.length || 0})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dados" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Filial</Label>
                  <FilialSelect value={formData.filialId} onValueChange={v => setFormData({...formData, filialId: v})} placeholder="Selecione a filial" />
                </div>
                <div className="grid gap-2">
                  <Label>Cliente</Label>
                  <Select value={formData.clienteId || 'consumidor-final'} onValueChange={(v) => setFormData({...formData, clienteId: v === 'consumidor-final' ? '' : v})}>
                    <SelectTrigger><SelectValue placeholder="Consumidor final" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consumidor-final">Consumidor final</SelectItem>
                      {clientes.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.nome} - {c.documento}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Natureza da Operação</Label>
                  <Select value={formData.naturezaOperacao || 'VENDA MERCADO INTERNO'} onValueChange={(v) => setFormData({...formData, naturezaOperacao: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VENDA MERCADO INTERNO">Venda Mercado Interno</SelectItem>
                      <SelectItem value="VENDA ATA">Venda ATA</SelectItem>
                      <SelectItem value="VENDA SIMPLES">Venda Simples</SelectItem>
                      <SelectItem value="DEV MERCADO INTERNO">Devolução Mercado Interno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2 col-span-2">
                  <Label>Observações</Label>
                  <Input 
                    placeholder="Observações da NFC-e..."
                    value={formData.observacoes || ''}
                    onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  />
                </div>
                <div className="grid gap-2 col-span-2">
                  <Label>Informações Complementares</Label>
                  <Input 
                    placeholder="Informações complementares..."
                    value={formData.informacoesComplementares || ''}
                    onChange={(e) => setFormData({...formData, informacoesComplementares: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={() => setTab('itens')}>
                  Próximo: Itens
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="itens" className="space-y-4">
              <div className="flex gap-2 items-end">
                <div className="flex-1 grid gap-2">
                  <Label>Produto</Label>
                  <Select value={itemProduto} onValueChange={setItemProduto}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      {produtos.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.codigoInterno} - {p.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-20 grid gap-2">
                  <Label>Qtd</Label>
                  <Input type="number" value={itemQtd} onChange={(e) => setItemQtd(e.target.value)} />
                </div>
                <div className="w-32 grid gap-2">
                  <Label>Valor Unit.</Label>
                  <Input type="number" step="0.01" value={itemValor} onChange={(e) => setItemValor(e.target.value)} />
                </div>
                <div className="w-24 grid gap-2">
                  <Label>Desc.</Label>
                  <Input type="number" step="0.01" value={itemDesconto} onChange={(e) => setItemDesconto(e.target.value)} />
                </div>
                <Button onClick={handleAddItem}>Adicionar</Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Qtd</TableHead>
                    <TableHead className="text-right">Vl. Unit.</TableHead>
                    <TableHead className="text-right">Desc.</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(formData.itens || []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Adicione itens para continuar
                      </TableCell>
                    </TableRow>
                  ) : (
                    (formData.itens || []).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.codigo}</TableCell>
                        <TableCell>{item.descricao}</TableCell>
                        <TableCell className="text-right">{item.quantidadeComercial}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.valorUnitarioComercial)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.valorDesconto || 0)}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency((item.quantidadeComercial * item.valorUnitarioComercial) - (item.valorDesconto || 0))}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(index)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              
              <div className="flex justify-end">
                <div className="text-xl font-bold">
                  Total: {formatCurrency(valorTotal)}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCriar}>Salvar NFC-e</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
