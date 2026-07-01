import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { multiEmpresaService, Empresa, GrupoEmpresarial } from '@/services/multi-empresa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, Link, Unlink, Plus, AlertTriangle } from 'lucide-react';

export function MultiEmpresaPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState<string>('');

  const { data: grupo, isLoading, error } = useQuery<GrupoEmpresarial>({
    queryKey: ['multi-empresa-grupo'],
    queryFn: () => multiEmpresaService.getGrupo(),
  });

  const { data: empresasDisponiveis } = useQuery<Empresa[]>({
    queryKey: ['multi-empresa-disponiveis'],
    queryFn: () => multiEmpresaService.getEmpresasDisponiveis(),
    enabled: grupo?.tipo === 'matriz',
  });

  const vincularMutation = useMutation({
    mutationFn: (filialId: string) => multiEmpresaService.vincularEmpresa(filialId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multi-empresa-grupo'] });
      queryClient.invalidateQueries({ queryKey: ['multi-empresa-disponiveis'] });
      setDialogOpen(false);
      setEmpresaSelecionada('');
      alert('Empresa vinculada com sucesso');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Erro ao vincular empresa');
    },
  });

  const desvincularMutation = useMutation({
    mutationFn: (filialId: string) => multiEmpresaService.desvincularEmpresa(filialId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multi-empresa-grupo'] });
      queryClient.invalidateQueries({ queryKey: ['multi-empresa-disponiveis'] });
      alert('Empresa desvinculada com sucesso');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Erro ao desvincular empresa');
    },
  });

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

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              <div>
                <h3 className="font-semibold">Acesso Restrito</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  O módulo Multi-empresa não está disponível no seu plano atual.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Faça upgrade para o plano PROFISSIONAL ou PREMIUM para usar este recurso.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isMatriz = grupo?.tipo === 'matriz';
  const empresas = grupo?.empresas || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Multi-empresa
          </h1>
          <p className="text-muted-foreground">
            {isMatriz 
              ? 'Gerencie as empresas do seu grupo econômico' 
              : 'Visualize as empresas do grupo econômico'}
          </p>
        </div>
        {isMatriz && (
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Vincular Empresa
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {isMatriz ? (
                <>
                  <Badge variant="default">Matriz</Badge>
                  <span className="text-sm text-muted-foreground">Empresa principal</span>
                </>
              ) : (
                <>
                  <Badge variant="secondary">Filial</Badge>
                  <span className="text-sm text-muted-foreground">Vinculada a matriz</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Empresas do Grupo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{empresas.length}</div>
            <p className="text-xs text-muted-foreground">
              {isMatriz ? 'matriz + filiais' : 'incluindo matriz'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Empresa Matriz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-medium">{grupo?.matriz?.nomeFantasia || grupo?.matriz?.razaoSocial}</div>
            <p className="text-xs text-muted-foreground">{grupo?.matriz?.cnpj}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Empresas do Grupo</CardTitle>
          <CardDescription>
            Lista de empresas vinculadas ao mesmo grupo econômico
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                {isMatriz && <TableHead className="text-right">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {empresas.map((empresa) => (
                <TableRow key={empresa.id}>
                  <TableCell>
                    <div className="font-medium">{empresa.nomeFantasia || empresa.razaoSocial}</div>
                    <div className="text-sm text-muted-foreground">{empresa.razaoSocial}</div>
                  </TableCell>
                  <TableCell>{empresa.cnpj}</TableCell>
                  <TableCell>{empresa.telefone || '-'}</TableCell>
                  <TableCell>{empresa.email || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={empresa.ativo ? 'default' : 'destructive'}>
                      {empresa.ativo ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </TableCell>
                  {isMatriz && (
                    <TableCell className="text-right">
                      {empresa.id !== grupo?.matriz?.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => desvincularMutation.mutate(empresa.id)}
                          disabled={desvincularMutation.isPending}
                        >
                          <Unlink className="h-4 w-4 mr-1" />
                          Desvincular
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {empresas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isMatriz ? 6 : 5} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma empresa vinculada</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Vincular Empresa</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Selecione uma empresa para vincular ao seu grupo econômico:
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {empresasDisponiveis?.map((empresa) => (
                <div
                  key={empresa.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    empresaSelecionada === empresa.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setEmpresaSelecionada(empresa.id)}
                >
                  <div className="font-medium">{empresa.nomeFantasia || empresa.razaoSocial}</div>
                  <div className="text-sm text-muted-foreground">{empresa.cnpj}</div>
                </div>
              ))}
              {empresasDisponiveis?.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Nenhuma empresa disponível para vinculação
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => empresaSelecionada && vincularMutation.mutate(empresaSelecionada)}
              disabled={!empresaSelecionada || vincularMutation.isPending}
            >
              <Link className="h-4 w-4 mr-2" />
              {vincularMutation.isPending ? 'Vinculando...' : 'Vincular'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
