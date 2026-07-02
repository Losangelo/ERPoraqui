import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Play, Pause, XCircle, Search } from 'lucide-react';
import { conveniosService, Convenio } from '@/services/convenios';
import { LookupField } from '@/components/lookup/LookupField';

const situacaoLabel: Record<string, string> = {
  ATIVO: 'Ativo', SUSPENSO: 'Suspenso', ENCERRADO: 'Encerrado',
};
const situacaoColor: Record<string, string> = {
  ATIVO: 'text-green-600 bg-green-50', SUSPENSO: 'text-orange-600 bg-orange-50',
  ENCERRADO: 'text-gray-600 bg-gray-50',
};

export function ConveniosPage() {
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState<any>({
    clienteId: '', numero: '', descricao: '', dataInicio: '', dataFim: '',
    valorTotal: '', observacoes: '',
  });
  const [clienteLabel, setClienteLabel] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filter) params.search = filter;
      const res = await conveniosService.listar(params);
      setConvenios(res.data?.data ?? res.data ?? []);
    } catch { } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { loadData(); }, [loadData]);

  const openNew = () => {
    setEditId(null);
    setForm({ clienteId: '', numero: '', descricao: '', dataInicio: '', dataFim: '', valorTotal: '', observacoes: '' });
    setClienteLabel('');
    setDialogOpen(true);
  };

  const openEdit = (c: Convenio) => {
    setEditId(c.id);
    setForm({
      clienteId: c.clienteId, numero: c.numero, descricao: c.descricao ?? '',
      dataInicio: c.dataInicio?.split('T')[0] ?? '', dataFim: c.dataFim?.split('T')[0] ?? '',
      valorTotal: String(c.valorTotal), observacoes: c.observacoes ?? '',
    });
    setClienteLabel(c.cliente?.nome ?? '');
    setDialogOpen(true);
  };

  const save = async () => {
    const payload = {
      clienteId: form.clienteId,
      numero: form.numero,
      descricao: form.descricao,
      dataInicio: form.dataInicio ? new Date(form.dataInicio) : undefined,
      dataFim: form.dataFim ? new Date(form.dataFim) : undefined,
      valorTotal: Number(form.valorTotal),
      observacoes: form.observacoes || undefined,
    };
    if (editId) {
      await conveniosService.atualizar(editId, payload);
    } else {
      await conveniosService.criar(payload as any);
    }
    setDialogOpen(false);
    loadData();
  };

  const action = async (id: string, acao: string) => {
    if (acao === 'ativar') await conveniosService.ativar(id);
    else if (acao === 'suspender') await conveniosService.suspender(id);
    else if (acao === 'encerrar') await conveniosService.encerrar(id);
    loadData();
  };

  const excluir = async (id: string) => {
    await conveniosService.excluir(id);
    loadData();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Convênios</h1>
          <p className="text-muted-foreground">Gestão de convênios e parcerias</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Novo Convênio</Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por número, descrição ou cliente..." value={filter} onChange={(e) => setFilter(e.target.value)} className="pl-10" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Data Início</TableHead>
                <TableHead>Data Fim</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead className="w-36 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Carregando...</TableCell></TableRow>
              ) : convenios.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Nenhum convênio encontrado</TableCell></TableRow>
              ) : convenios.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.numero}</TableCell>
                  <TableCell>{c.cliente?.nome ?? c.clienteId}</TableCell>
                  <TableCell className="max-w-xs truncate">{c.descricao}</TableCell>
                  <TableCell className="text-xs">{new Date(c.dataInicio).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-xs">{c.dataFim ? new Date(c.dataFim).toLocaleDateString('pt-BR') : '-'}</TableCell>
                  <TableCell>R$ {Number(c.valorTotal).toFixed(2)}</TableCell>
                  <TableCell><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${situacaoColor[c.situacao]}`}>{situacaoLabel[c.situacao]}</span></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {c.situacao === 'SUSPENSO' && <Button variant="ghost" size="icon" title="Reativar" onClick={() => action(c.id, 'ativar')}><Play className="h-4 w-4 text-green-600" /></Button>}
                      {c.situacao === 'ATIVO' && <Button variant="ghost" size="icon" title="Suspender" onClick={() => action(c.id, 'suspender')}><Pause className="h-4 w-4 text-orange-600" /></Button>}
                      {(c.situacao === 'ATIVO' || c.situacao === 'SUSPENSO') && <Button variant="ghost" size="icon" title="Encerrar" onClick={() => action(c.id, 'encerrar')}><XCircle className="h-4 w-4 text-red-600" /></Button>}
                      {c.situacao !== 'ENCERRADO' && <Button variant="ghost" size="icon" title="Editar" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>}
                      <Button variant="ghost" size="icon" title="Excluir" onClick={() => excluir(c.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{editId ? 'Editar Convênio' : 'Novo Convênio'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="clienteId">Cliente</Label>
              <LookupField
                source="clientes"
                value={form.clienteId}
                selectedLabel={clienteLabel}
                onChange={(item) => { setForm({ ...form, clienteId: item.id }); setClienteLabel(item.nome); }}
                onClear={() => { setForm({ ...form, clienteId: '' }); setClienteLabel(''); }}
                placeholder="Selecionar cliente..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="numero">Número do convênio</Label>
                <Input id="numero" placeholder="Ex: CV-2026-0001" value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="valorTotal">Valor total (R$)</Label>
                <Input id="valorTotal" type="number" step="0.01" placeholder="0,00" value={form.valorTotal} onChange={(e) => setForm({ ...form, valorTotal: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input id="descricao" placeholder="Descrição do convênio ou objeto da parceria" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dataInicio">Data de início</Label>
                <Input id="dataInicio" type="date" value={form.dataInicio} onChange={(e) => setForm({ ...form, dataInicio: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dataFim">Data de fim</Label>
                <Input id="dataFim" type="date" title="Deixe em branco para vigência indeterminada" value={form.dataFim} onChange={(e) => setForm({ ...form, dataFim: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Input id="observacoes" placeholder="Observações internas sobre o convênio" value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={save}>{editId ? 'Atualizar' : 'Criar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
