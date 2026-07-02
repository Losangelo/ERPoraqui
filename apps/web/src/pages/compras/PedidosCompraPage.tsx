import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { comprasService, PedidoCompra } from '@/services/compras';
import { fornecedoresService } from '@/services/fornecedores';
import { produtosService } from '@/services/produtos';
import { 
  ShoppingCart, 
  Plus, 
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

const SITUACOES = [
  { value: 'EM_ABERTO', label: 'Em Aberto', cor: 'bg-blue-100 text-blue-800' },
  { value: 'APROVADO', label: 'Aprovado', cor: 'bg-green-100 text-green-800' },
  { value: 'REPROVADO', label: 'Reprovado', cor: 'bg-red-100 text-red-800' },
  { value: 'CANCELADO', label: 'Cancelado', cor: 'bg-gray-100 text-gray-800' },
  { value: 'RECEBIDO', label: 'Recebido', cor: 'bg-green-100 text-green-800' },
];

export function PedidosCompraPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itens, setItens] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    fornecedorId: '',
    dataEntrega: '',
    condicaoPagamento: 'A_VISTA',
    observacoes: '',
  });

  const { data: pedidos, isLoading } = useQuery<PedidoCompra[]>({
    queryKey: ['pedidos-compra'],
    queryFn: () => comprasService.listarPedidos(),
  });

  const { data: fornecedores } = useQuery({
    queryKey: ['fornecedores'],
    queryFn: () => fornecedoresService.listar(),
  });

  const { data: produtos } = useQuery({
    queryKey: ['produtos'],
    queryFn: () => produtosService.listar(),
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => comprasService.criarPedido(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos-compra'] });
      setDialogOpen(false);
      resetForm();
      alert('Pedido criado com sucesso');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || error.message);
    },
  });

  const cancelarMutation = useMutation({
    mutationFn: (id: string) => comprasService.cancelarPedido(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos-compra'] });
      alert('Pedido cancelado');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      fornecedorId: '',
      dataEntrega: '',
      condicaoPagamento: 'A_VISTA',
      observacoes: '',
    });
    setItens([]);
  };

  const addItem = () => {
    setItens([...itens, { produtoId: '', quantidade: 1, valorUnitario: 0 }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItens = [...itens];
    (newItens[index] as any)[field] = value;
    
    if (field === 'produtoId') {
      const produto = produtos?.find((p: any) => p.id === value);
      if (produto) {
        newItens[index].valorUnitario = produto.precoVenda || 0;
      }
    }
    
    if (field === 'quantidade' || field === 'valorUnitario') {
      newItens[index].valorTotal = 
        (newItens[index].quantidade || 0) * (newItens[index].valorUnitario || 0);
    }
    
    setItens(newItens);
  };

  const removeItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fornecedorId) {
      alert('Selecione um fornecedor');
      return;
    }

    if (itens.length === 0) {
      alert('Adicione pelo menos um item');
      return;
    }

    const valorTotal = itens.reduce((sum, item) => sum + (item.valorTotal || 0), 0);

    criarMutation.mutate({
      fornecedorId: formData.fornecedorId,
      dataEntrega: formData.dataEntrega || null,
      condicaoPagamento: formData.condicaoPagamento,
      observacoes: formData.observacoes,
      valorTotal,
      itens: itens.map((item, index) => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        valorTotal: item.valorTotal,
        unidadeMedida: 'UN',
        numeroItem: index + 1,
      })),
    });
  };

  const getSituacaoBadge = (situacao: string) => {
    const s = SITUACOES.find(x => x.value === situacao);
    return <Badge className={s?.cor}>{s?.label || situacao}</Badge>;
  };

  const totalPedidos = pedidos?.length || 0;
  const emAberto = pedidos?.filter(p => p.situacao === 'EM_ABERTO').length || 0;
  const recebidos = pedidos?.filter(p => p.situacao === 'RECEBIDO').length || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Pedidos de Compra
          </h1>
          <p className="text-muted-foreground">Gerencie pedidos de compra</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Pedido
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPedidos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Aberto</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{emAberto}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recebidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{recebidos}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
          <CardDescription>Lista de pedidos de compra</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : pedidos?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum pedido encontrado. Clique em "Novo Pedido" para começar.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Número</th>
                    <th className="text-left p-2">Fornecedor</th>
                    <th className="text-left p-2">Data</th>
                    <th className="text-right p-2">Valor</th>
                    <th className="text-center p-2">Situação</th>
                    <th className="text-center p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos?.map((pedido) => (
                    <tr key={pedido.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{pedido.numeroPedido}</td>
                      <td className="p-2">{pedido.fornecedor?.nome || '-'}</td>
                      <td className="p-2">
                        {pedido.dataEmissao 
                          ? new Date(pedido.dataEmissao).toLocaleDateString('pt-BR')
                          : '-'}
                      </td>
                      <td className="p-2 text-right">
                        R$ {pedido.valorTotal.toFixed(2)}
                      </td>
                      <td className="p-2 text-center">
                        {getSituacaoBadge(pedido.situacao)}
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex justify-center gap-1">
                          {pedido.situacao === 'EM_ABERTO' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (confirm('Deseja cancelar este pedido?')) {
                                  cancelarMutation.mutate(pedido.id);
                                }
                              }}
                            >
                              <XCircle className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Novo Pedido de Compra</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fornecedor">Fornecedor</Label>
                  <Select
                    value={formData.fornecedorId}
                    onValueChange={(value) => setFormData({ ...formData, fornecedorId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {fornecedores?.map((f: any) => (
                        <SelectItem key={f.id} value={f.id}>{f.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dataEntrega">Data Entrega</Label>
                  <Input
                    id="dataEntrega"
                    type="date"
                    value={formData.dataEntrega}
                    onChange={(e) => setFormData({ ...formData, dataEntrega: e.target.value })}
                    title="Data prevista de entrega"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Condição de Pagamento</Label>
                <Select
                  value={formData.condicaoPagamento}
                  onValueChange={(value) => setFormData({ ...formData, condicaoPagamento: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A_VISTA">À Vista</SelectItem>
                    <SelectItem value="A_PRAZO">À Prazo</SelectItem>
                    <SelectItem value="PARCELADO">Parcelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Itens</Label>
                <div className="border rounded-md p-2 space-y-2">
                  {itens.map((item, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Select
                          value={item.produtoId}
                          onValueChange={(value) => updateItem(index, 'produtoId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Produto" />
                          </SelectTrigger>
                          <SelectContent>
                            {produtos?.map((p: any) => (
                              <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-20">
                        <Input
                          type="number"
                          placeholder="Quantidade de unidades"
                          value={item.quantidade}
                          onChange={(e) => updateItem(index, 'quantidade', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          placeholder="Valor unitário (R$)"
                          value={item.valorUnitario}
                          onChange={(e) => updateItem(index, 'valorUnitario', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="w-24 text-right font-medium">
                        R$ {(item.valorTotal || 0).toFixed(2)}
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={() => removeItem(index)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Input
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Observações do pedido"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                Cancelar
              </Button>
              <Button type="submit" disabled={criarMutation.isPending}>
                {criarMutation.isPending ? 'Criando...' : 'Criar Pedido'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
