import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { automacaoService, Automacao, AutomacaoDashboard } from '@/services/automacao';
import { 
  Zap, 
  Plus, 
  Play, 
  Pause, 
  Trash2,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const TRIGGERS = [
  { value: 'ESTOQUE_BAIXO', label: 'Estoque Baixo', desc: 'Ativado quando estoque cai abaixo do limite' },
  { value: 'CONTA_VENCENDO', label: 'Conta Vencendo', desc: 'Ativado quando conta a receber está próximo do vencimento' },
  { value: 'CLIENTE_CADASTRADO', label: 'Cliente Cadastrado', desc: 'Ativado quando novo cliente é cadastrado' },
];

const ACOES = [
  { value: 'CRIAR_TAREFA', label: 'Criar Tarefa', desc: 'Cria uma tarefa no sistema' },
  { value: 'ENVIAR_EMAIL', label: 'Enviar E-mail', desc: 'Envia um e-mail de notificação' },
  { value: 'ATUALIZAR_STATUS', label: 'Atualizar Status', desc: 'Atualiza o status de um registro' },
];

export function AutomacaoPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    tipo: 'AUTOMATICA',
    triggerTipo: 'ESTOQUE_BAIXO',
    triggerThreshold: '10',
    acaoTipo: 'CRIAR_TAREFA',
    acaoTitulo: '',
  });

  const { data: dashboard, isLoading: loadingDashboard } = useQuery<AutomacaoDashboard>({
    queryKey: ['automacao-dashboard'],
    queryFn: () => automacaoService.getDashboard(),
  });

  const { data: automacoes, isLoading } = useQuery<Automacao[]>({
    queryKey: ['automacoes'],
    queryFn: () => automacaoService.listar(),
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => automacaoService.criar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automacoes'] });
      queryClient.invalidateQueries({ queryKey: ['automacao-dashboard'] });
      setDialogOpen(false);
      setFormData({
        nome: '',
        descricao: '',
        tipo: 'AUTOMATICA',
        triggerTipo: 'ESTOQUE_BAIXO',
        triggerThreshold: '10',
        acaoTipo: 'CRIAR_TAREFA',
        acaoTitulo: '',
      });
      alert('Automação criada com sucesso');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || error.message);
    },
  });

  const ativarMutation = useMutation({
    mutationFn: (id: string) => automacaoService.ativar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automacoes'] });
      queryClient.invalidateQueries({ queryKey: ['automacao-dashboard'] });
      alert('Automação ativada');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || error.message);
    },
  });

  const pausarMutation = useMutation({
    mutationFn: (id: string) => automacaoService.pausar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automacoes'] });
      queryClient.invalidateQueries({ queryKey: ['automacao-dashboard'] });
      alert('Automação pausada');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || error.message);
    },
  });

  const executarMutation = useMutation({
    mutationFn: (id: string) => automacaoService.executar(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['automacoes'] });
      queryClient.invalidateQueries({ queryKey: ['automacao-dashboard'] });
      if (data.executado) {
        alert(`Automação executada! ${data.detalhes.length} registro(s) afetado(s).`);
      } else {
        alert('Automação executada. Nenhum registro encontrado para os critérios.');
      }
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || error.message);
    },
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => automacaoService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automacoes'] });
      queryClient.invalidateQueries({ queryKey: ['automacao-dashboard'] });
      alert('Automação excluída');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    criarMutation.mutate({
      nome: formData.nome,
      descricao: formData.descricao,
      tipo: formData.tipo,
      trigger: {
        tipo: formData.triggerTipo,
        threshold: formData.triggerTipo === 'ESTOQUE_BAIXO' ? parseInt(formData.triggerThreshold) : undefined,
        diasAntecedencia: formData.triggerTipo === 'CONTA_VENCENDO' ? parseInt(formData.triggerThreshold) : undefined,
      },
      acoes: [
        {
          tipo: formData.acaoTipo,
          config: formData.acaoTipo === 'CRIAR_TAREFA' ? { titulo: formData.acaoTitulo } : {},
        },
      ],
    });
  };

  const getTriggerLabel = (tipo: string) => TRIGGERS.find(t => t.value === tipo)?.label || tipo;
  const getAcaoLabel = (tipo: string) => ACOES.find(a => a.value === tipo)?.label || tipo;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6" />
            Automação
          </h1>
          <p className="text-muted-foreground">Gerencie fluxos de trabalho automatizados</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Automação
        </Button>
      </div>

      {loadingDashboard ? (
        <div className="text-center py-8">Carregando...</div>
      ) : dashboard && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ativas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{dashboard.ativas}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pausadas</CardTitle>
              <Pause className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{dashboard.pausadas}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Execuções</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.totalExecucoes}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Automações</CardTitle>
          <CardDescription>Lista de fluxos automatizados cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : automacoes?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma automação cadastrada. Clique em "Nova Automação" para começar.
            </div>
          ) : (
            <div className="space-y-4">
              {automacoes?.map((automacao) => (
                <div
                  key={automacao.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{automacao.nome}</span>
                      <Badge variant={automacao.status === 'ATIVA' ? 'default' : 'secondary'}>
                        {automacao.status === 'ATIVA' ? 'Ativa' : 'Pausada'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {automacao.descricao || 'Sem descrição'}
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Trigger: {getTriggerLabel(automacao.trigger?.tipo)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Ação: {getAcaoLabel(automacao.acoes[0]?.tipo)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        {automacao.executadaCount} execuções
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {automacao.status === 'ATIVA' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        title="Pausar automação"
                        onClick={() => pausarMutation.mutate(automacao.id)}
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        title="Ativar automação"
                        onClick={() => ativarMutation.mutate(automacao.id)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      title="Executar automação agora"
                      onClick={() => executarMutation.mutate(automacao.id)}
                      disabled={automacao.status !== 'ATIVA'}
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      title="Excluir automação"
                      onClick={() => {
                        if (confirm('Tem certeza que deseja excluir esta automação?')) {
                          excluirMutation.mutate(automacao.id);
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Automação</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Alerta estoque baixo"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva o que esta automação faz"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="trigger">Trigger (Evento)</Label>
                <Select
                  value={formData.triggerTipo}
                  onValueChange={(value) => setFormData({ ...formData, triggerTipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRIGGERS.map((trigger) => (
                      <SelectItem key={trigger.value} value={trigger.value}>
                        <div>
                          <div>{trigger.label}</div>
                          <div className="text-xs text-muted-foreground">{trigger.desc}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {formData.triggerTipo === 'ESTOQUE_BAIXO' && (
                <div className="grid gap-2">
                  <Label htmlFor="threshold">Limite de Estoque</Label>
                  <Input
                    id="threshold"
                    type="number"
                    value={formData.triggerThreshold}
                    onChange={(e) => setFormData({ ...formData, triggerThreshold: e.target.value })}
                    placeholder="10"
                  />
                </div>
              )}
              {formData.triggerTipo === 'CONTA_VENCENDO' && (
                <div className="grid gap-2">
                  <Label htmlFor="dias">Dias de Antecedência</Label>
                  <Input
                    id="dias"
                    type="number"
                    value={formData.triggerThreshold}
                    onChange={(e) => setFormData({ ...formData, triggerThreshold: e.target.value })}
                    placeholder="3"
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="acao">Ação</Label>
                <Select
                  value={formData.acaoTipo}
                  onValueChange={(value) => setFormData({ ...formData, acaoTipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACOES.map((acao) => (
                      <SelectItem key={acao.value} value={acao.value}>
                        <div>
                          <div>{acao.label}</div>
                          <div className="text-xs text-muted-foreground">{acao.desc}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {formData.acaoTipo === 'CRIAR_TAREFA' && (
                <div className="grid gap-2">
                  <Label htmlFor="acaoTitulo">Título da Tarefa</Label>
                  <Input
                    id="acaoTitulo"
                    value={formData.acaoTitulo}
                    onChange={(e) => setFormData({ ...formData, acaoTitulo: e.target.value })}
                    placeholder="Ex: Repor estoque"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={criarMutation.isPending}>
                {criarMutation.isPending ? 'Criando...' : 'Criar Automação'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
