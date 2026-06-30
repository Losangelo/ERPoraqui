import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crmService } from '@/services/crm';
import { produtosService } from '@/services/produtos';
import { 
  Megaphone, 
  Plus, 
  Play, 
  Pause, 
  CheckCircle, 
  Trash2,
  Users,
  TrendingUp
} from 'lucide-react';

interface Campanha {
  id: string;
  nome: string;
  descricao?: string;
  tipoSegmento: string;
  produtoId?: string;
  diasInatividade?: number;
  valorMinimo?: number;
  status: 'RASCUNHO' | 'AGENDADA' | 'ATIVA' | 'PAUSADA' | 'FINALIZADA' | 'CANCELADA';
  clientesTarget: number;
  enviosRealizados: number;
  dataInicio?: string;
  dataFim?: string;
}

export function CampanhasPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  const { data: campanhas, isLoading } = useQuery<Campanha[]>({
    queryKey: ['crm-campanhas'],
    queryFn: () => crmService.getCampanhas(),
  });

  const { data: produtos } = useQuery({
    queryKey: ['produtos'],
    queryFn: () => produtosService.listar(),
  });

  const criarCampanhaMutation = useMutation({
    mutationFn: (data: any) => crmService.criarCampanha(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-campanhas'] });
      setDialogOpen(false);
      alert('Campanha criada com sucesso');
    },
    onError: (error: any) => {
      alert(error.message);
    },
  });

  const executarCampanhaMutation = useMutation({
    mutationFn: (id: string) => crmService.executarCampanha(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['crm-campanhas'] });
      alert(`Campanha executada! ${data.clientesAlvo} clientes identificados.`);
    },
    onError: (error: any) => {
      alert(error.message);
    },
  });

  const pausarCampanhaMutation = useMutation({
    mutationFn: (id: string) => crmService.pausarCampanha(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-campanhas'] });
      alert('Campanha pausada');
    },
  });

  const finalizarCampanhaMutation = useMutation({
    mutationFn: (id: string) => crmService.finalizarCampanha(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-campanhas'] });
      alert('Campanha finalizada');
    },
  });

  const excluirCampanhaMutation = useMutation({
    mutationFn: (id: string) => crmService.excluirCampanha(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-campanhas'] });
      alert('Campanha excluída');
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVA': return 'bg-green-500';
      case 'PAUSADA': return 'bg-yellow-500';
      case 'FINALIZADA': return 'bg-blue-500';
      case 'CANCELADA': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'RASCUNHO': return 'Rascunho';
      case 'ATIVA': return 'Ativa';
      case 'PAUSADA': return 'Pausada';
      case 'FINALIZADA': return 'Finalizada';
      case 'CANCELADA': return 'Cancelada';
      default: return status;
    }
  };

  const campanhasFiltradas = campanhas?.filter(c => 
    filtroStatus === 'todos' || c.status === filtroStatus
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Megaphone className="h-6 w-6" />
            Campanhas de Marketing
          </h1>
          <p className="text-muted-foreground">
            Crie e gerencie campanhas de marketing para seus clientes
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      <div className="flex gap-2">
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="RASCUNHO">Rascunho</SelectItem>
            <SelectItem value="ATIVA">Ativa</SelectItem>
            <SelectItem value="PAUSADA">Pausada</SelectItem>
            <SelectItem value="FINALIZADA">Finalizada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Campanhas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campanhas?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campanhas?.filter(c => c.status === 'ATIVA').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Clientes Impactados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campanhas?.reduce((sum, c) => sum + c.clientesTarget, 0) || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {campanhasFiltradas.map((campanha) => (
          <Card key={campanha.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{campanha.nome}</CardTitle>
                  <CardDescription>{campanha.descricao}</CardDescription>
                </div>
                <Badge className={getStatusColor(campanha.status)}>
                  {getStatusLabel(campanha.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Segmento: {campanha.tipoSegmento}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span>Clientes: {campanha.clientesTarget}</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                {campanha.status === 'RASCUNHO' && (
                  <Button 
                    size="sm" 
                    onClick={() => executarCampanhaMutation.mutate(campanha.id)}
                    disabled={executarCampanhaMutation.isPending}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Executar
                  </Button>
                )}
                {campanha.status === 'ATIVA' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => pausarCampanhaMutation.mutate(campanha.id)}
                    disabled={pausarCampanhaMutation.isPending}
                  >
                    <Pause className="h-4 w-4 mr-1" />
                    Pausar
                  </Button>
                )}
                {campanha.status === 'ATIVA' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => finalizarCampanhaMutation.mutate(campanha.id)}
                    disabled={finalizarCampanhaMutation.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Finalizar
                  </Button>
                )}
                {campanha.status !== 'ATIVA' && (
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir?')) {
                        excluirCampanhaMutation.mutate(campanha.id);
                      }
                    }}
                    disabled={excluirCampanhaMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {campanhasFiltradas.length === 0 && (
          <div className="col-span-full">
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma campanha encontrada</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setDialogOpen(true)}
                >
                  Criar primeira campanha
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Campanha</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              criarCampanhaMutation.mutate({
                nome: formData.get('nome') as string,
                descricao: formData.get('descricao') as string,
                tipoSegmento: formData.get('tipoSegmento') as string,
                produtoId: formData.get('produtoId') as string || undefined,
                diasInatividade: formData.get('diasInatividade') ? Number(formData.get('diasInatividade')) : undefined,
                valorMinimo: formData.get('valorMinimo') ? Number(formData.get('valorMinimo')) : undefined,
              });
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome da Campanha</Label>
                <Input id="nome" name="nome" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" name="descricao" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tipoSegmento">Tipo de Segmento</Label>
                <select 
                  name="tipoSegmento" 
                  id="tipoSegmento"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue="todos"
                >
                  <option value="todos">Todos os clientes</option>
                  <option value="inativos">Clientes inativos</option>
                  <option value="por_produto">Por produto comprado</option>
                  <option value="por_valor">Por valor de compra</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="produtoId">Produto (para segmento por produto)</Label>
                <select 
                  name="produtoId" 
                  id="produtoId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecione um produto</option>
                  {produtos?.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="diasInatividade">Dias de inatividade (para clientes inativos)</Label>
                <Input id="diasInatividade" name="diasInatividade" type="number" placeholder="30" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="valorMinimo">Valor mínimo de compra (para segmento por valor)</Label>
                <Input id="valorMinimo" name="valorMinimo" type="number" step="0.01" placeholder="1000" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={criarCampanhaMutation.isPending}>
                {criarCampanhaMutation.isPending ? 'Criando...' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
