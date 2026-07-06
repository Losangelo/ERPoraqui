import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { centrosCustoService, CentroCusto } from '@/services/centros-custo';
import { Plus, Pencil, Trash2, ChevronRight, ChevronDown, FolderOpen, Folder, ToggleLeft, ToggleRight } from 'lucide-react';

export default function CentrosCustoPage() {
  const [centros, setCentros] = useState<CentroCusto[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<CentroCusto | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    centroPaiId: '',
    ativo: true,
  });

  useEffect(() => {
    carregarCentros();
  }, []);

  const carregarCentros = async () => {
    setLoading(true);
    try {
      const data = await centrosCustoService.arvore();
      setCentros(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar centros de custo:', error);
      setCentros([]);
    }
    setLoading(false);
  };

  const toggleExpanded = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  const handleOpenNew = (centroPaiId?: string) => {
    setEditando(null);
    setFormData({ codigo: '', nome: '', descricao: '', centroPaiId: centroPaiId || '', ativo: true });
    setDialogOpen(true);
  };

  const handleEdit = (centro: CentroCusto) => {
    setEditando(centro);
    setFormData({
      codigo: centro.codigo,
      nome: centro.nome,
      descricao: centro.descricao || '',
      centroPaiId: centro.centroPaiId || '',
      ativo: centro.ativo,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editando) {
        await centrosCustoService.atualizar(editando.id, {
          codigo: formData.codigo,
          nome: formData.nome,
          descricao: formData.descricao || undefined,
          centroPaiId: formData.centroPaiId || undefined,
          ativo: formData.ativo,
        });
      } else {
        await centrosCustoService.criar({
          codigo: formData.codigo,
          nome: formData.nome,
          descricao: formData.descricao || undefined,
          centroPaiId: formData.centroPaiId || undefined,
        });
      }
      setDialogOpen(false);
      carregarCentros();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este centro de custo?')) return;
    try {
      await centrosCustoService.excluir(id);
      carregarCentros();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleToggleAtivo = async (centro: CentroCusto) => {
    try {
      await centrosCustoService.atualizar(centro.id, { ativo: !centro.ativo });
      carregarCentros();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const flattenCentrosPai = (lista: CentroCusto[], depth = 0): { id: string; nome: string; codigo: string; depth: number }[] => {
    const result: { id: string; nome: string; codigo: string; depth: number }[] = [];
    for (const c of lista) {
      result.push({ id: c.id, nome: c.nome, codigo: c.codigo, depth });
      if (c.subcentros?.length) {
        result.push(...flattenCentrosPai(c.subcentros, depth + 1));
      }
    }
    return result;
  };

  const renderCentro = (centro: CentroCusto, level: number = 0): React.ReactNode => {
    const hasChildren = centro.subcentros && centro.subcentros.length > 0;
    const isExpanded = expanded.has(centro.id);

    return (
      <TableRow key={centro.id} className="hover:bg-muted/50">
        <TableCell className="w-8">
          {hasChildren && (
            <Button variant="ghost" size="sm" onClick={() => toggleExpanded(centro.id)}>
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}
        </TableCell>
        <TableCell className="font-mono">
          {level > 0 && <span className="text-muted-foreground">{'— '.repeat(level)}</span>}
          {centro.codigo}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {hasChildren ? (
              <Folder className="h-4 w-4 text-yellow-500" />
            ) : (
              <FolderOpen className="h-4 w-4 text-blue-500" />
            )}
            <span className={centro.ativo ? '' : 'text-muted-foreground'}>{centro.nome}</span>
          </div>
        </TableCell>
        <TableCell className="text-muted-foreground">{centro.descricao || '-'}</TableCell>
        <TableCell>
          <Badge variant={centro.ativo ? 'success' : 'secondary'}>
            {centro.ativo ? 'Ativo' : 'Inativo'}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex gap-1 justify-end">
            <Button variant="ghost" size="sm" onClick={() => handleToggleAtivo(centro)}>
              {centro.ativo ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleOpenNew(centro.id)} title="Adicionar subcentro">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleEdit(centro)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(centro.id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const renderComFilhos = (centro: CentroCusto, level: number = 0): React.ReactNode => {
    const isExpanded = expanded.has(centro.id);
    const hasChildren = centro.subcentros && centro.subcentros.length > 0;

    return (
      <>
        {renderCentro(centro, level)}
        {hasChildren && isExpanded && centro.subcentros!.map((sub) => renderComFilhos(sub, level + 1))}
      </>
    );
  };

  const listaPais = flattenCentrosPai(centros);
  const filteredPais = editando ? listaPais.filter((p) => p.id !== editando.id) : listaPais;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Centros de Custo</h1>
          <p className="text-muted-foreground">Estrutura hierárquica de centros de custo</p>
        </div>
        <Button onClick={() => handleOpenNew()}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Centro de Custo
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
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">Carregando...</TableCell>
                </TableRow>
              ) : centros.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum centro de custo cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                centros.map((centro) => renderComFilhos(centro))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editando ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Código</Label>
                <Input
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  placeholder="Código de identificação único"
                  title="Ex: 01.001 — use pontos para separar níveis hierárquicos"
                />
              </div>
              <div className="grid gap-2">
                <Label>Centro Pai</Label>
                <Select
                  value={formData.centroPaiId || 'none'}
                  onValueChange={(v) => setFormData({ ...formData, centroPaiId: v === 'none' ? '' : v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nenhum (raiz)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum (raiz)</SelectItem>
                    {filteredPais.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {'— '.repeat(p.depth)}{p.codigo} - {p.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Nome</Label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome completo do centro de custo"
                title="Ex: Administrativo, Financeiro, TI — nome descritivo e único"
              />
            </div>
            <div className="grid gap-2">
              <Label>Descrição</Label>
              <Input
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descrição detalhada da finalidade do centro de custo"
                title="Explique o propósito e o escopo deste centro de custo"
              />
            </div>
            {editando && (
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={formData.ativo ? 'true' : 'false'}
                  onValueChange={(v) => setFormData({ ...formData, ativo: v === 'true' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Ativo</SelectItem>
                    <SelectItem value="false">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
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
