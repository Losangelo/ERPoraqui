import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EstoqueService, MovimentacaoEstoque } from '@/services/estoque';
import { produtosService } from '@/services/produtos';
import { 
  ArrowRightLeft, 
  Plus,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCw,
  Settings
} from 'lucide-react';

const TIPOS = [
  { value: 'ENTRADA', label: 'Entrada', icon: ArrowDownCircle, cor: 'text-green-500' },
  { value: 'SAIDA', label: 'Saída', icon: ArrowUpCircle, cor: 'text-red-500' },
  { value: 'TRANSFERENCIA', label: 'Transferência', icon: ArrowRightLeft, cor: 'text-blue-500' },
  { value: 'AJUSTE', label: 'Ajuste', icon: Settings, cor: 'text-yellow-500' },
  { value: 'DEVOLUCAO', label: 'Devolução', icon: RefreshCw, cor: 'text-purple-500' },
];

export function MovimentacoesPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    produtoId: '',
    tipoMovimentacao: 'ENTRADA',
    quantidade: 0,
    motivo: '',
  });

  const { data: movimentacoes, isLoading } = useQuery<MovimentacaoEstoque[]>({
    queryKey: ['movimentacoes-estoque'],
    queryFn: () => EstoqueService.listarMovimentacoes(),
  });

  const { data: produtos } = useQuery({
    queryKey: ['produtos'],
    queryFn: () => produtosService.listar(),
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => EstoqueService.criarMovimentacao(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movimentacoes-estoque'] });
      queryClient.invalidateQueries({ queryKey: ['estoque'] });
      setDialogOpen(false);
      setFormData({ produtoId: '', tipoMovimentacao: 'ENTRADA', quantidade: 0, motivo: '' });
      alert('Movimentação registrada com sucesso');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.produtoId || formData.quantidade <= 0) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    criarMutation.mutate(formData);
  };

  const getTipoIcon = (tipo: string) => {
    const t = TIPOS.find(x => x.value === tipo);
    const Icon = t?.icon || Settings;
    return <Icon className={`h-4 w-4 ${t?.cor}`} />;
  };

  const entradas = movimentacoes?.filter(m => m.tipoMovimentacao === 'ENTRADA').length || 0;
  const saidas = movimentacoes?.filter(m => m.tipoMovimentacao === 'SAIDA').length || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ArrowRightLeft className="h-6 w-6" />
            Movimentações de Estoque
          </h1>
          <p className="text-muted-foreground">Registre entradas, saídas e transferências</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Movimentação
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{movimentacoes?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entradas</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{entradas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saídas</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{saidas}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
          <CardDescription>Últimas movimentações de estoque</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : movimentacoes?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma movimentação encontrada.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Data</th>
                    <th className="text-left p-2">Produto</th>
                    <th className="text-center p-2">Tipo</th>
                    <th className="text-right p-2">Quantidade</th>
                    <th className="text-left p-2">Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {movimentacoes?.slice(0, 50).map((m) => (
                    <tr key={m.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        {new Date(m.dataMovimentacao).toLocaleString('pt-BR')}
                      </td>
                      <td className="p-2">{m.produto?.nome || '-'}</td>
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {getTipoIcon(m.tipoMovimentacao)}
                          <span>{TIPOS.find(t => t.value === m.tipoMovimentacao)?.label}</span>
                        </div>
                      </td>
                      <td className="p-2 text-right">{m.quantidade}</td>
                      <td className="p-2 text-muted-foreground">{m.motivo || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Movimentação</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Produto</Label>
                <Select
                  value={formData.produtoId}
                  onValueChange={(value) => setFormData({ ...formData, produtoId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {produtos?.map((p: any) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nome} (Estoque: {p.quantidadeEstoque})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Tipo</Label>
                <Select
                  value={formData.tipoMovimentacao}
                  onValueChange={(value) => setFormData({ ...formData, tipoMovimentacao: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Quantidade</Label>
                <Input
                  type="number"
                  value={formData.quantidade}
                  onChange={(e) => setFormData({ ...formData, quantidade: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Motivo</Label>
                <Input
                  value={formData.motivo}
                  onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                  placeholder="Ex: Compra de reposição"
                />
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
