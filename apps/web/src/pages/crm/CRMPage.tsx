import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  crmService, 
  Pipeline, 
  Oportunidade, 
  Tarefa, 
  DashboardCRM 
} from '@/services/crm';
import { clientesService } from '@/services/clientes';
import { 
  Kanban, 
  Plus, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  Lock,
  ArrowUpCircle
} from 'lucide-react';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

function is403Error(error: unknown): boolean {
  if (error instanceof AxiosError && error.response?.status === 403) return true;
  if (error && typeof error === 'object' && 'response' in error) {
    const resp = (error as any).response;
    return resp?.status === 403;
  }
  return false;
}

export function CRMPage() {
  const queryClient = useQueryClient();
  const [abaAtiva, setAbaAtiva] = useState('pipeline');
  const [dialogAberto, setDialogAberto] = useState(false);
  const [tipoDialog, setTipoDialog] = useState<'oportunidade' | 'tarefa'>('oportunidade');

  const { data: dashboard, isLoading: dashboardLoading, error: dashboardError } = useQuery<DashboardCRM>({
    queryKey: ['crm-dashboard'],
    queryFn: () => crmService.getDashboard(),
    retry: false,
  });

  const { data: pipelines, error: pipelinesError } = useQuery<Pipeline[]>({
    queryKey: ['crm-pipelines'],
    queryFn: () => crmService.getPipelines(),
    retry: false,
  });

  const { data: oportunidades } = useQuery<Oportunidade[]>({
    queryKey: ['crm-oportunidades'],
    queryFn: () => crmService.getOportunidades(),
    retry: false,
  });

  const { data: tarefas } = useQuery<Tarefa[]>({
    queryKey: ['crm-tarefas'],
    queryFn: () => crmService.getTarefas({ concluida: false }),
    retry: false,
  });

  const { data: clientes } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => clientesService.listar(),
    retry: false,
  });

  const restricted = is403Error(dashboardError) || is403Error(pipelinesError);

  const criarOportunidadeMutation = useMutation({
    mutationFn: (data: any) => crmService.criarOportunidade(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-oportunidades'] });
      queryClient.invalidateQueries({ queryKey: ['crm-dashboard'] });
      setDialogAberto(false);
      toast.success('Oportunidade criada com sucesso');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || error.message || 'Erro ao criar oportunidade');
    },
  });

  const criarTarefaMutation = useMutation({
    mutationFn: (data: any) => crmService.criarTarefa(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-tarefas'] });
      queryClient.invalidateQueries({ queryKey: ['crm-dashboard'] });
      setDialogAberto(false);
      toast.success('Tarefa criada com sucesso');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || error.message || 'Erro ao criar tarefa');
    },
  });

  const mudarEstagioMutation = useMutation({
    mutationFn: ({ id, pipelineId }: { id: string; pipelineId: string }) => 
      crmService.mudarEstagio(id, pipelineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-oportunidades'] });
      queryClient.invalidateQueries({ queryKey: ['crm-dashboard'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Erro ao mover oportunidade');
    },
  });

  const marcarGanhaMutation = useMutation({
    mutationFn: (id: string) => crmService.marcarGanha(id, false),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-oportunidades'] });
      queryClient.invalidateQueries({ queryKey: ['crm-dashboard'] });
      toast.success('Oportunidade marcada como GANHA!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Erro ao marcar como ganha');
    },
  });

  const concluirTarefaMutation = useMutation({
    mutationFn: (id: string) => crmService.concluirTarefa(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-tarefas'] });
      queryClient.invalidateQueries({ queryKey: ['crm-dashboard'] });
      toast.success('Tarefa concluída');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Erro ao concluir tarefa');
    },
  });

  const oportunidadesPorPipeline = (pipelineId: string) => {
    return oportunidades?.filter(o => o.pipelineId === pipelineId && o.status === 'ABERTA') || [];
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'URGENTE': return 'bg-red-500';
      case 'ALTA': return 'bg-orange-500';
      case 'MEDIA': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (restricted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-amber-100 p-3">
                <Lock className="h-8 w-8 text-amber-600" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Módulo não disponível</h2>
            <p className="text-muted-foreground mb-4">
              O CRM está disponível apenas nos planos <strong>Profissional</strong> e <strong>Premium</strong>.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Faça upgrade do seu plano para acessar pipeline de vendas, oportunidades, tarefas e gestão de relacionamento com clientes.
            </p>
            <Button className="w-full" onClick={() => window.location.href = '/planos'}>
              <ArrowUpCircle className="h-4 w-4 mr-2" />
              Ver Planos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            CRM - Gestão de Vendas
          </h1>
          <p className="text-muted-foreground">
            Pipeline de vendas e relacionamento com clientes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setTipoDialog('tarefa'); setDialogAberto(true); }}>
            <Clock className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
          <Button onClick={() => { setTipoDialog('oportunidade'); setDialogAberto(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Oportunidade
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Oportunidades Abertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.oportunidades.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboard?.oportunidades.valorTotal || 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Ponderado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboard?.oportunidades.valorPonderado || 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.tarefasPendentes || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
        <TabsList>
          <TabsTrigger value="pipeline">
            <Kanban className="h-4 w-4 mr-2" />
            Pipeline
          </TabsTrigger>
          <TabsTrigger value="tarefas">
            <CheckCircle className="h-4 w-4 mr-2" />
            Tarefas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {pipelines?.map((pipeline) => (
              <div
                key={pipeline.id}
                className="flex-shrink-0 w-72 bg-muted rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: pipeline.cor }}
                    />
                    <h3 className="font-semibold">{pipeline.nome}</h3>
                  </div>
                  <Badge variant="secondary">
                    {oportunidadesPorPipeline(pipeline.id).length}
                  </Badge>
                </div>

                <div className="space-y-2 min-h-[200px]">
                  {oportunidadesPorPipeline(pipeline.id).map((opp) => (
                    <Card key={opp.id} className="p-3 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{opp.titulo}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatCurrency(Number(opp.valor))}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {opp.probabilidade}%
                        </Badge>
                      </div>
                      <div className="flex gap-1 mt-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 text-xs"
                          onClick={() => {
                            const proximoPipeline = pipelines.find(p => p.ordem === pipeline.ordem + 1);
                            if (proximoPipeline) {
                              mudarEstagioMutation.mutate({ id: opp.id, pipelineId: proximoPipeline.id });
                            }
                          }}
                        >
                          <TrendingUp className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 text-xs text-green-600"
                          onClick={() => marcarGanhaMutation.mutate(opp.id)}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tarefas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tarefas Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tarefas?.map((tarefa) => (
                  <div 
                    key={tarefa.id} 
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${getPrioridadeColor(tarefa.prioridade)}`} />
                      <div>
                        <p className="font-medium">{tarefa.titulo}</p>
                        {tarefa.oportunidade && (
                          <p className="text-xs text-muted-foreground">
                            {tarefa.oportunidade.titulo}
                          </p>
                        )}
                        {tarefa.dataVencimento && (
                          <p className="text-xs text-muted-foreground">
                            Vence: {new Date(tarefa.dataVencimento).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{tarefa.tipo}</Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => concluirTarefaMutation.mutate(tarefa.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {(!tarefas || tarefas.length === 0) && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma tarefa pendente
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogAberto && tipoDialog === 'oportunidade'} onOpenChange={setDialogAberto}>
        <DialogContent className="max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Nova Oportunidade</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              criarOportunidadeMutation.mutate({
                pipelineId: pipelines?.[0]?.id || '',
                titulo: formData.get('titulo') as string,
                descricao: formData.get('descricao') as string,
                valor: Number(formData.get('valor')),
                probabilidade: Number(formData.get('probabilidade')),
                clienteId: formData.get('clienteId') as string || undefined,
              });
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="titulo">Título</Label>
                <Input id="titulo" name="titulo" required placeholder="Ex: Venda de 100 unidades do produto X" title="Título descritivo da oportunidade" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" name="descricao" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="valor">Valor (R$)</Label>
                  <Input id="valor" name="valor" type="number" step="0.01" required placeholder="0,00" title="Valor total da oportunidade" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="probabilidade">Probabilidade (%)</Label>
                  <Input id="probabilidade" name="probabilidade" type="number" defaultValue="50" placeholder="Ex: 50" title="Chance de fechamento em percentual (0-100)" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="clienteId">Cliente</Label>
                <select 
                  name="clienteId" 
                  id="clienteId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecione um cliente</option>
                  {clientes?.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogAberto(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={criarOportunidadeMutation.isPending}>
                {criarOportunidadeMutation.isPending ? 'Criando...' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogAberto && tipoDialog === 'tarefa'} onOpenChange={setDialogAberto}>
        <DialogContent className="max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Nova Tarefa</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              criarTarefaMutation.mutate({
                titulo: formData.get('titulo') as string,
                descricao: formData.get('descricao') as string,
                tipo: formData.get('tipo') as string,
                prioridade: formData.get('prioridade') as string,
                dataVencimento: formData.get('dataVencimento') as string || undefined,
              });
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="titulo">Título</Label>
                <Input id="titulo" name="titulo" required placeholder="Ex: Ligar para cliente sobre proposta" title="Título descritivo da tarefa" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" name="descricao" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <select 
                    name="tipo" 
                    id="tipo"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue="LIGACAO"
                  >
                    <option value="LIGACAO">Ligação</option>
                    <option value="EMAIL">E-mail</option>
                    <option value="REUNIAO">Reunião</option>
                    <option value="VISITA">Visita</option>
                    <option value="DEMONSTRACAO">Demonstração</option>
                    <option value="PROPOSTA">Proposta</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <select 
                    name="prioridade" 
                    id="prioridade"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue="MEDIA"
                  >
                    <option value="BAIXA">Baixa</option>
                    <option value="MEDIA">Média</option>
                    <option value="ALTA">Alta</option>
                    <option value="URGENTE">Urgente</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dataVencimento">Data de Vencimento</Label>
                <Input id="dataVencimento" name="dataVencimento" type="date" title="Data limite para conclusão da tarefa" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogAberto(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={criarTarefaMutation.isPending}>
                {criarTarefaMutation.isPending ? 'Criando...' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
