import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { planoContasService, PlanoConta, CriarPlanoContaDto } from '@/services/plano-contas';
import { Plus, Trash2, ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react';

export default function PlanoContasPage() {
  const [contas, setContas] = useState<PlanoConta[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState<CriarPlanoContaDto>({
    codigo: '',
    nome: '',
    tipo: 'ANALITICA',
    natureza: 'DEVEDORA',
  });

  useEffect(() => {
    carregarContas();
  }, []);

  const carregarContas = async () => {
    try {
      const data = await planoContasService.listarArvore();
      setContas(data);
    } catch (error) {
      console.error('Erro ao carregar plano de contas:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await planoContasService.criar(formData);
      setDialogOpen(false);
      setFormData({ codigo: '', nome: '', tipo: 'ANALITICA', natureza: 'DEVEDORA' });
      carregarContas();
    } catch (error) {
      console.error('Erro ao criar conta:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta conta?')) return;
    try {
      await planoContasService.excluir(id);
      carregarContas();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpanded(newExpanded);
  };

  const renderConta = (conta: PlanoConta, level: number = 0): React.ReactNode => {
    const hasChildren = conta.subcontas && conta.subcontas.length > 0;
    const isExpanded = expanded.has(conta.id);

    return (
      <>
        <TableRow key={conta.id} className="hover:bg-muted/50">
          <TableCell className="w-8">
            {hasChildren && (
              <Button variant="ghost" size="sm" onClick={() => toggleExpanded(conta.id)}>
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            )}
          </TableCell>
          <TableCell className="font-mono">
            {level > 0 && '— '.repeat(level)}
            {conta.codigo}
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              {conta.tipo === 'SINTETICA' ? (
                <Folder className="h-4 w-4 text-yellow-500" />
              ) : (
                <FileText className="h-4 w-4 text-blue-500" />
              )}
              {conta.nome}
            </div>
          </TableCell>
          <TableCell>{conta.tipo === 'SINTETICA' ? 'Sintética' : 'Analítica'}</TableCell>
          <TableCell>
            <span className={conta.natureza === 'CREDORA' ? 'text-green-500' : 'text-red-500'}>
              {conta.natureza === 'CREDORA' ? 'Credora' : 'Devedora'}
            </span>
          </TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="sm" onClick={() => handleDelete(conta.id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </TableCell>
        </TableRow>
        {hasChildren && isExpanded && conta.subcontas!.map((sub) => renderConta(sub, level + 1))}
      </>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Plano de Contas</h1>
          <p className="text-muted-foreground">Estrutura contábil</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Conta
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Natureza</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contas.map((conta) => renderConta(conta))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Conta</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                placeholder="1.1.1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Caixa"
              />
            </div>
            <div className="grid gap-2">
              <Label>Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: 'SINTETICA' | 'ANALITICA') => setFormData({ ...formData, tipo: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINTETICA">Sintética (Grupo)</SelectItem>
                  <SelectItem value="ANALITICA">Analítica (Detalhe)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Natureza</Label>
              <Select
                value={formData.natureza}
                onValueChange={(value: 'CREDORA' | 'DEVEDORA') => setFormData({ ...formData, natureza: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEVEDORA">Devedora</SelectItem>
                  <SelectItem value="CREDORA">Credora</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
