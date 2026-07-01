import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { comprasService, EntradaMercadoria } from '@/services/compras';
import { 
  Package, 
  Plus,
  CheckCircle,
  Clock,
  Truck
} from 'lucide-react';

const SITUACOES = [
  { value: 'PENDENTE', label: 'Pendente', cor: 'bg-yellow-100 text-yellow-800' },
  { value: 'CONFIRMADA', label: 'Confirmada', cor: 'bg-green-100 text-green-800' },
  { value: 'CANCELADA', label: 'Cancelada', cor: 'bg-red-100 text-red-800' },
];

export function EntradasPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    pedidoCompraId: '',
    numeroNota: '',
    dataEmissao: '',
    valorFrete: 0,
    valorDesconto: 0,
    observacoes: '',
  });

  const { data: entradas, isLoading } = useQuery<EntradaMercadoria[]>({
    queryKey: ['entradas-mercadoira'],
    queryFn: () => comprasService.listarEntradas(),
  });

  const { data: pedidos } = useQuery({
    queryKey: ['pedidos-compra'],
    queryFn: () => comprasService.listarPedidos(),
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => comprasService.criarEntrada(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entradas-mercadoira'] });
      setDialogOpen(false);
      setFormData({
        pedidoCompraId: '',
        numeroNota: '',
        dataEmissao: '',
        valorFrete: 0,
        valorDesconto: 0,
        observacoes: '',
      });
      alert('Entrada registrada com sucesso');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || error.message);
    },
  });

  const confirmarMutation = useMutation({
    mutationFn: (id: string) => comprasService.confirmarEntrada(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entradas-mercadoira'] });
      alert('Entrada confirmada');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.pedidoCompraId || !formData.numeroNota) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    criarMutation.mutate({
      pedidoCompraId: formData.pedidoCompraId,
      numeroNota: formData.numeroNota,
      dataEmissao: formData.dataEmissao || null,
      valorFrete: formData.valorFrete,
      valorDesconto: formData.valorDesconto,
      observacoes: formData.observacoes,
      valorTotal: 0,
    });
  };

  const getSituacaoBadge = (situacao: string) => {
    const s = SITUACOES.find(x => x.value === situacao);
    return <Badge className={s?.cor}>{s?.label || situacao}</Badge>;
  };

  const totalEntradas = entradas?.length || 0;
  const pendentes = entradas?.filter(e => e.situacao === 'PENDENTE').length || 0;
  const confirmadas = entradas?.filter(e => e.situacao === 'CONFIRMADA').length || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Truck className="h-6 w-6" />
            Entradas de Mercadoria
          </h1>
          <p className="text-muted-foreground">Registre entradas de mercadorias</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Entrada
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEntradas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendentes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{confirmadas}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entradas</CardTitle>
          <CardDescription>Histórico de entradas de mercadoria</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : entradas?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma entrada encontrada.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">NF</th>
                    <th className="text-left p-2">Pedido</th>
                    <th className="text-left p-2">Data Entrada</th>
                    <th className="text-right p-2">Valor</th>
                    <th className="text-center p-2">Situação</th>
                    <th className="text-center p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {entradas?.map((entrada) => (
                    <tr key={entrada.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{entrada.numeroNota}</td>
                      <td className="p-2">{entrada.pedidoCompra?.numeroPedido || '-'}</td>
                      <td className="p-2">
                        {new Date(entrada.dataEntrada).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-2 text-right">
                        R$ {entrada.valorTotal.toFixed(2)}
                      </td>
                      <td className="p-2 text-center">
                        {getSituacaoBadge(entrada.situacao)}
                      </td>
                      <td className="p-2 text-center">
                        {entrada.situacao === 'PENDENTE' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => confirmarMutation.mutate(entrada.id)}
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </Button>
                        )}
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
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Nova Entrada de Mercadoria</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="pedido">Pedido de Compra</Label>
                <Select
                  value={formData.pedidoCompraId}
                  onValueChange={(value) => setFormData({ ...formData, pedidoCompraId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pedidos?.filter((p: any) => p.situacao === 'APROVADO' || p.situacao === 'EM_ABERTO').map((p: any) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.numeroPedido} - {p.fornecedor?.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="numeroNota">Número NF</Label>
                  <Input
                    id="numeroNota"
                    value={formData.numeroNota}
                    onChange={(e) => setFormData({ ...formData, numeroNota: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dataEmissao">Data Emissão</Label>
                  <Input
                    id="dataEmissao"
                    type="date"
                    value={formData.dataEmissao}
                    onChange={(e) => setFormData({ ...formData, dataEmissao: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="valorFrete">Frete</Label>
                  <Input
                    id="valorFrete"
                    type="number"
                    value={formData.valorFrete}
                    onChange={(e) => setFormData({ ...formData, valorFrete: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="valorDesconto">Desconto</Label>
                  <Input
                    id="valorDesconto"
                    type="number"
                    value={formData.valorDesconto}
                    onChange={(e) => setFormData({ ...formData, valorDesconto: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={criarMutation.isPending}>
                {criarMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
