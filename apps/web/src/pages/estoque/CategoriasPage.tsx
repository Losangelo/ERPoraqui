import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriasService, Categoria } from '@/services/estoque';
import { 
  Folder, 
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';

export function CategoriasPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [formData, setFormData] = useState({ nome: '', descricao: '', ativo: true });

  const { data: categorias, isLoading } = useQuery<Categoria[]>({
    queryKey: ['categorias'],
    queryFn: () => categoriasService.listar(),
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => categoriasService.criar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      setDialogOpen(false);
      setFormData({ nome: '', descricao: '', ativo: true });
      alert('Categoria criada');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || error.message);
    },
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => categoriasService.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      setDialogOpen(false);
      setEditando(null);
      setFormData({ nome: '', descricao: '', ativo: true });
      alert('Categoria atualizada');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || error.message);
    },
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => categoriasService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      alert('Categoria excluída');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome) {
      alert('Nome é obrigatório');
      return;
    }
    if (editando) {
      atualizarMutation.mutate({ id: editando.id, data: formData });
    } else {
      criarMutation.mutate(formData);
    }
  };

  const openEdit = (categoria: Categoria) => {
    setEditando(categoria);
    setFormData({ nome: categoria.nome, descricao: categoria.descricao || '', ativo: categoria.ativo });
    setDialogOpen(true);
  };

  const openNew = () => {
    setEditando(null);
    setFormData({ nome: '', descricao: '', ativo: true });
    setDialogOpen(true);
  };

  const ativas = categorias?.filter(c => c.ativo).length || 0;
  const inativas = categorias?.filter(c => !c.ativo).length || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Folder className="h-6 w-6" />
            Categorias
          </h1>
          <p className="text-muted-foreground">Gerencie categorias de produtos</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categorias?.length || 0}</div>
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
            <CardTitle className="text-sm font-medium">Inativas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inativas}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : categorias?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma categoria encontrada.
            </div>
          ) : (
            <div className="grid gap-2">
              {categorias?.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Folder className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{c.nome}</div>
                      <div className="text-sm text-muted-foreground">{c.descricao || 'Sem descrição'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={c.ativo ? 'default' : 'secondary'}>
                      {c.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => openEdit(c)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (confirm('Excluir categoria?')) {
                          excluirMutation.mutate(c.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editando ? 'Editar' : 'Nova'} Categoria</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nome</Label>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Eletrônicos"
                />
              </div>
              <div className="grid gap-2">
                <Label>Descrição</Label>
                <Input
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />
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
