import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Search, Shield } from 'lucide-react';
import { api } from '@/services/api';

interface Garantia {
  id: string; clienteId: string; produtoId: string; vendaId?: string;
  numero: string; tipo: string; prazoDias: number;
  dataInicio: string; dataFim?: string; cobertura?: string;
  status: string; observacoes?: string;
  cliente?: { id: string; nome: string }; produto?: { id: string; nome: string };
}

interface GarantiaRegra {
  id: string; produtoId?: string; categoriaId?: string;
  prazoDias: number; tipo: string; cobertura?: string; termos?: string; ativo: boolean;
}

const tipoLabel: Record<string, string> = { FABRICA: 'Fábrica', ESTENDIDA: 'Estendida', LEGAL: 'Legal' };
const statusLabel: Record<string, string> = { ATIVA: 'Ativa', EXPIRADA: 'Expirada', CANCELADA: 'Cancelada', ACIONADA: 'Acionada' };
const statusColor: Record<string, string> = {
  ATIVA: 'text-green-600 bg-green-50', EXPIRADA: 'text-gray-600 bg-gray-50',
  CANCELADA: 'text-red-600 bg-red-50', ACIONADA: 'text-blue-600 bg-blue-50',
};

export function GarantiasPage() {
  const [garantias, setGarantias] = useState<Garantia[]>([]);
  const [regras, setRegras] = useState<GarantiaRegra[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [regraDialogOpen, setRegraDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [abAba, setAba] = useState<'garantias' | 'regras'>('garantias');
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState<any>({
    clienteId: '', produtoId: '', numero: '', tipo: 'FABRICA',
    prazoDias: '365', dataInicio: '', cobertura: '', observacoes: '',
  });
  const [regraForm, setRegraForm] = useState<any>({
    produtoId: '', prazoDias: '365', tipo: 'FABRICA', cobertura: '', termos: '', ativo: true,
  });
  const [regraEditId, setRegraEditId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter) params.set('search', filter);
      const res = await api.get(`/garantias?${params}`);
      setGarantias(res.data?.data ?? res.data ?? []);
      const resRegras = await api.get('/garantias/regras');
      setRegras(resRegras.data?.data ?? resRegras.data ?? []);
    } catch { } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { loadData(); }, [loadData]);

  const openNew = () => {
    setEditId(null);
    setForm({ clienteId: '', produtoId: '', numero: '', tipo: 'FABRICA', prazoDias: '365', dataInicio: '', cobertura: '', observacoes: '' });
    setDialogOpen(true);
  };

  const openEdit = (g: Garantia) => {
    setEditId(g.id);
    setForm({
      clienteId: g.clienteId, produtoId: g.produtoId, numero: g.numero,
      tipo: g.tipo, prazoDias: String(g.prazoDias),
      dataInicio: g.dataInicio?.split('T')[0] ?? '',
      cobertura: g.cobertura ?? '', observacoes: g.observacoes ?? '',
    });
    setDialogOpen(true);
  };

  const save = async () => {
    const payload = { ...form, prazoDias: Number(form.prazoDias), dataInicio: new Date(form.dataInicio) };
    if (editId) {
      await api.put(`/garantias/${editId}`, payload);
    } else {
      await api.post('/garantias', payload);
    }
    setDialogOpen(false);
    loadData();
  };

  const excluir = async (id: string) => {
    await api.delete(`/garantias/${id}`);
    loadData();
  };

  const openNovaRegra = () => {
    setRegraEditId(null);
    setRegraForm({ produtoId: '', prazoDias: '365', tipo: 'FABRICA', cobertura: '', termos: '', ativo: true });
    setRegraDialogOpen(true);
  };

  const openEditRegra = (r: GarantiaRegra) => {
    setRegraEditId(r.id);
    setRegraForm({
      produtoId: r.produtoId ?? '', prazoDias: String(r.prazoDias),
      tipo: r.tipo, cobertura: r.cobertura ?? '', termos: r.termos ?? '', ativo: r.ativo,
    });
    setRegraDialogOpen(true);
  };

  const saveRegra = async () => {
    const payload = { ...regraForm, prazoDias: Number(regraForm.prazoDias) };
    if (regraEditId) {
      await api.put(`/garantias/regras/${regraEditId}`, payload);
    } else {
      await api.post('/garantias/regras', payload);
    }
    setRegraDialogOpen(false);
    loadData();
  };

  const excluirRegra = async (id: string) => {
    await api.delete(`/garantias/regras/${id}`);
    loadData();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Garantias</h1>
          <p className="text-muted-foreground">Gestão de garantias de produtos e regras de elegibilidade</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setAba(abAba === 'garantias' ? 'regras' : 'garantias')}>
            <Shield className="mr-2 h-4 w-4" />{abAba === 'garantias' ? 'Regras' : 'Garantias'}
          </Button>
          {abAba === 'garantias' ? (
            <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Nova Garantia</Button>
          ) : (
            <Button onClick={openNovaRegra}><Plus className="mr-2 h-4 w-4" />Nova Regra</Button>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por número, cliente ou produto..." value={filter} onChange={(e) => setFilter(e.target.value)} className="pl-10" />
        </div>
      </div>

      {abAba === 'garantias' ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Carregando...</TableCell></TableRow>
                ) : garantias.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Nenhuma garantia encontrada</TableCell></TableRow>
                ) : garantias.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium">{g.numero}</TableCell>
                    <TableCell>{g.cliente?.nome ?? g.clienteId}</TableCell>
                    <TableCell>{g.produto?.nome ?? g.produtoId}</TableCell>
                    <TableCell>{tipoLabel[g.tipo] ?? g.tipo}</TableCell>
                    <TableCell>{g.prazoDias} dias</TableCell>
                    <TableCell className="text-xs">{g.dataFim ? new Date(g.dataFim).toLocaleDateString('pt-BR') : '-'}</TableCell>
                    <TableCell><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[g.status]}`}>{statusLabel[g.status]}</span></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {g.status === 'ATIVA' && <Button variant="ghost" size="icon" title="Editar" onClick={() => openEdit(g)}><Pencil className="h-4 w-4" /></Button>}
                        <Button variant="ghost" size="icon" title="Excluir" onClick={() => excluir(g.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Prazo (dias)</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cobertura</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regras.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhuma regra cadastrada</TableCell></TableRow>
                ) : regras.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.produtoId ?? '(Geral)'}</TableCell>
                    <TableCell>{r.prazoDias}</TableCell>
                    <TableCell>{tipoLabel[r.tipo] ?? r.tipo}</TableCell>
                    <TableCell className="max-w-xs truncate">{r.cobertura ?? '-'}</TableCell>
                    <TableCell><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${r.ativo ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>{r.ativo ? 'Sim' : 'Não'}</span></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" title="Editar" onClick={() => openEditRegra(r)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" title="Excluir" onClick={() => excluirRegra(r.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{editId ? 'Editar Garantia' : 'Nova Garantia'}</DialogTitle><DialogDescription>Preencha os dados da garantia</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="clienteId">Cliente</Label>
                <Input id="clienteId" placeholder="ID do cliente" value={form.clienteId} onChange={(e) => setForm({ ...form, clienteId: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="produtoId">Produto</Label>
                <Input id="produtoId" placeholder="ID do produto" value={form.produtoId} onChange={(e) => setForm({ ...form, produtoId: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="numero">Número da garantia</Label>
                <Input id="numero" placeholder="Ex: GAR-2026-0001" value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(tipoLabel).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="prazoDias">Prazo (dias)</Label>
                <Input id="prazoDias" type="number" placeholder="365" value={form.prazoDias} onChange={(e) => setForm({ ...form, prazoDias: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dataInicio">Data de início</Label>
                <Input id="dataInicio" type="date" value={form.dataInicio} onChange={(e) => setForm({ ...form, dataInicio: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cobertura">Cobertura</Label>
              <Input id="cobertura" placeholder="Descrição do que a garantia cobre" value={form.cobertura} onChange={(e) => setForm({ ...form, cobertura: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Input id="observacoes" placeholder="Observações adicionais" value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={save}>{editId ? 'Atualizar' : 'Criar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={regraDialogOpen} onOpenChange={setRegraDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{regraEditId ? 'Editar Regra' : 'Nova Regra'}</DialogTitle><DialogDescription>Configure a regra de garantia</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="produtoId">Produto (deixe em branco para regra geral)</Label>
              <Input id="produtoId" placeholder="ID do produto ou vazio para regra geral" title="Se vazio, a regra se aplica a todos os produtos" value={regraForm.produtoId} onChange={(e) => setRegraForm({ ...regraForm, produtoId: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="prazoDias">Prazo padrão (dias)</Label>
                <Input id="prazoDias" type="number" placeholder="365" value={regraForm.prazoDias} onChange={(e) => setRegraForm({ ...regraForm, prazoDias: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={regraForm.tipo} onValueChange={(v) => setRegraForm({ ...regraForm, tipo: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(tipoLabel).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cobertura">Cobertura padrão</Label>
              <Input id="cobertura" placeholder="Descrição da cobertura padrão" value={regraForm.cobertura} onChange={(e) => setRegraForm({ ...regraForm, cobertura: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="termos">Termos / Texto da garantia</Label>
              <Input id="termos" placeholder="Termos e condições da garantia" value={regraForm.termos} onChange={(e) => setRegraForm({ ...regraForm, termos: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRegraDialogOpen(false)}>Cancelar</Button>
            <Button onClick={saveRegra}>{regraEditId ? 'Atualizar' : 'Criar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
