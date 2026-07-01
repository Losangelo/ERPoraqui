import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { unidadesService, UnidadeMedida } from '@/services/estoque';
import { 
  Scale, 
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  
} from 'lucide-react';

export function UnidadesMedidaPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<UnidadeMedida | null>(null);
  const [formData, setFormData] = useState({ simbolo: '', descricao: '', fracionada: false, ativo: true });

  const { data: unidades, isLoading } = useQuery<UnidadeMedida[]>({
    queryKey: ['unidades-medida'],
    queryFn: () => unidadesService.listar(),
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => unidadesService.criar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidades-medida'] });
      setDialogOpen(false);
      setFormData({ simbolo: '', descricao: '', fracionada: false, ativo: true });
      alert('Unidade criada');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || error.message);
    },
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => unidadesService.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidades-medida'] });
      setDialogOpen(false);
      setEditando(null);
      setFormData({ simbolo: '', descricao: '', fracionada: false, ativo: true });
      alert('Unidade atualizada');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || error.message);
    },
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => unidadesService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidades-medida'] });
      alert('Unidade excluída');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.simbolo || !formData.descricao) {
      alert('Preencha todos os campos');
      return;
    }
    if (editando) {
      atualizarMutation.mutate({ id: editando.id, data: formData });
    } else {
      criarMutation.mutate(formData);
    }
  };

  const openEdit = (unidade: UnidadeMedida) => {
    setEditando(unidade);
    setFormData({ 
      simbolo: unidade.simbolo, 
      descricao: unidade.descricao, 
      fracionada: unidade.fracionada, 
      ativo: unidade.ativo 
    });
    setDialogOpen(true);
  };

  const openNew = () => {
    setEditando(null);
    setFormData({ simbolo: '', descricao: '', fracionada: false, ativo: true });
    setDialogOpen(true);
  };

  const ativas = unidades?.filter(u => u.ativo).length || 0;
  const fracionadas = unidades?.filter(u => u.fracionada).length || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Scale className="h-6 w-6" />
            Unidades de Medida
          </h1>
          <p className="text-muted-foreground">Gerencie unidades de medida</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Unidade
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unidades?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{ativas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fracionáveis</CardTitle>
            <Scale className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{fracionadas}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Unidades</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : unidades?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma unidade encontrada.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Símbolo</th>
                    <th className="text-left p-2">Descrição</th>
                    <th className="text-center p-2">Fracionável</th>
                    <th className="text-center p-2">Status</th>
                    <th className="text-center p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {unidades?.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{u.simbolo}</td>
                      <td className="p-2">{u.descricao}</td>
                      <td className="p-2 text-center">
                        {u.fracionada ? (
                          <Badge variant="default">Sim</Badge>
                        ) : (
                          <Badge variant="secondary">Não</Badge>
                        )}
                      </td>
                      <td className="p-2 text-center">
                        <Badge variant={u.ativo ? 'default' : 'secondary'}>
                          {u.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex justify-center gap-1">
                          <Button variant="outline" size="sm" onClick={() => openEdit(u)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              if (confirm('Excluir unidade?')) {
                                excluirMutation.mutate(u.id);
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
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{editando ? 'Editar' : 'Nova'} Unidade</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Símbolo</Label>
                  <Input
                    value={formData.simbolo}
                    onChange={(e) => setFormData({ ...formData, simbolo: e.target.value.toUpperCase() })}
                    placeholder="Ex: KG, UN, LT"
                    maxLength={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Descrição</Label>
                  <Input
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Ex: Quilograma"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="fracionada"
                  checked={formData.fracionada}
                  onChange={(e) => setFormData({ ...formData, fracionada: e.target.checked })}
                />
                <Label htmlFor="fracionada">Pode ser fracionada (ex: 0,5 kg)</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editando ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
