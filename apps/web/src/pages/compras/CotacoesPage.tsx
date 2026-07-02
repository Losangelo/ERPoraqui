import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { comprasService, CotacaoCompra } from '@/services/compras';
import { produtosService } from '@/services/produtos';
import { 
  FileText, 
  Plus,
  Trash2,
  Send,
  CheckCircle,
  Clock
} from 'lucide-react';

const SITUACOES = [
  { value: 'ABERTA', label: 'Aberta', cor: 'bg-blue-100 text-blue-800' },
  { value: 'FECHADA', label: 'Fechada', cor: 'bg-green-100 text-green-800' },
  { value: 'CANCELADA', label: 'Cancelada', cor: 'bg-red-100 text-red-800' },
];

export function CotacoesPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itens, setItens] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    dataValidade: '',
    observacoes: '',
  });

  const { data: cotacoes, isLoading } = useQuery<CotacaoCompra[]>({
    queryKey: ['cotacoes-compra'],
    queryFn: () => comprasService.listarCotacoes(),
  });

  const { data: produtos } = useQuery({
    queryKey: ['produtos'],
    queryFn: () => produtosService.listar(),
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => comprasService.criarCotacao(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cotacoes-compra'] });
      setDialogOpen(false);
      setFormData({ dataValidade: '', observacoes: '' });
      setItens([]);
      alert('Cotação criada com sucesso');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || error.message);
    },
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => comprasService.excluirCotacao(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cotacoes-compra'] });
      alert('Cotação excluída');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || error.message);
    },
  });

  const addItem = () => {
    setItens([...itens, { produtoId: '', quantidade: 1, unidadeMedida: 'UN' }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItens = [...itens];
    (newItens[index] as any)[field] = value;
    setItens(newItens);
  };

  const removeItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (itens.length === 0) {
      alert('Adicione pelo menos um item');
      return;
    }

    criarMutation.mutate({
      dataValidade: formData.dataValidade || null,
      observacoes: formData.observacoes,
      itens: itens.map((item, index) => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        unidadeMedida: item.unidadeMedida,
        numeroItem: index + 1,
      })),
    });
  };

  const getSituacaoBadge = (situacao: string) => {
    const s = SITUACOES.find(x => x.value === situacao);
    return <Badge className={s?.cor}>{s?.label || situacao}</Badge>;
  };

  const totalCotacoes = cotacoes?.length || 0;
  const abertas = cotacoes?.filter(c => c.situacao === 'ABERTA').length || 0;
  const fechadas = cotacoes?.filter(c => c.situacao === 'FECHADA').length || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Cotações de Compra
          </h1>
          <p className="text-muted-foreground">Gerencie cotações para fornecedores</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Cotação
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCotacoes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abertas</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{abertas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fechadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{fechadas}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cotações</CardTitle>
          <CardDescription>Lista de cotações de compra</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : cotacoes?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma cotação encontrada.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Número</th>
                    <th className="text-left p-2">Data Abertura</th>
                    <th className="text-left p-2">Validade</th>
                    <th className="text-center p-2">Itens</th>
                    <th className="text-center p-2">Situação</th>
                    <th className="text-center p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {cotacoes?.map((cotacao) => (
                    <tr key={cotacao.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{cotacao.numeroCotacao}</td>
                      <td className="p-2">
                        {new Date(cotacao.dataAbertura).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-2">
                        {cotacao.dataValidade 
                          ? new Date(cotacao.dataValidade).toLocaleDateString('pt-BR')
                          : '-'}
                      </td>
                      <td className="p-2 text-center">{cotacao.itens?.length || 0}</td>
                      <td className="p-2 text-center">
                        {getSituacaoBadge(cotacao.situacao)}
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex justify-center gap-1">
                          {cotacao.situacao === 'ABERTA' && (
                            <Button variant="outline" size="sm">
                              <Send className="h-4 w-4 text-blue-500" />
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              if (confirm('Deseja excluir esta cotação?')) {
                                excluirMutation.mutate(cotacao.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
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
            <DialogTitle>Nova Cotação de Compra</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="dataValidade">Data Validade</Label>
                <Input
                  id="dataValidade"
                  type="date"
                  value={formData.dataValidade}
                  onChange={(e) => setFormData({ ...formData, dataValidade: e.target.value })}
                  title="Data de validade da cotação"
                />
              </div>

              <div className="grid gap-2">
                <Label>Itens Solicitados</Label>
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
                      <div className="w-20">
                        <Input
                          placeholder="Unidade (ex: KG, UN, LT)"
                          value={item.unidadeMedida}
                          onChange={(e) => updateItem(index, 'unidadeMedida', e.target.value)}
                        />
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
                  placeholder="Observações adicionais sobre a cotação"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={criarMutation.isPending}>
                {criarMutation.isPending ? 'Criando...' : 'Criar Cotação'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
