import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react';
import { licitacoesService, Licitacao } from '@/services/licitacoes';
import { LookupField } from '@/components/lookup/LookupField';

const tipoLabel: Record<string, string> = {
  PREGAO: 'Pregão', CONCORRENCIA: 'Concorrência', CONVITE: 'Convite', TOMADA_PRECOS: 'Tomada de Preços',
};
const situacaoLabel: Record<string, string> = {
  EM_ANDAMENTO: 'Em Andamento', GANHA: 'Ganha', PERDIDA: 'Perdida', CANCELADA: 'Cancelada',
};
const situacaoColor: Record<string, string> = {
  EM_ANDAMENTO: 'text-blue-600 bg-blue-50', GANHA: 'text-green-600 bg-green-50',
  PERDIDA: 'text-red-600 bg-red-50', CANCELADA: 'text-gray-600 bg-gray-50',
};

export function LicitacoesPage() {
  const [licitacoes, setLicitacoes] = useState<Licitacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [itemsTab, setItemsTab] = useState(false);
  const [selectedLicitacao, setSelectedLicitacao] = useState<Licitacao | null>(null);
  const [form, setForm] = useState<any>({
    numero: '', orgao: '', descricao: '', tipo: 'PREGAO',
    dataAbertura: '', dataEncerramento: '', valorEstimado: '', observacoes: '',
  });
  const [itemForm, setItemForm] = useState({ produtoId: '', quantidade: '1', valorUnitario: '', marca: '' });
  const [itemProdutoLabel, setItemProdutoLabel] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filter) params.search = filter;
      const res = await licitacoesService.listar(params);
      setLicitacoes(res.data?.data ?? res.data ?? []);
    } catch { } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { loadData(); }, [loadData]);

  const openNew = () => {
    setEditId(null);
    setForm({ numero: '', orgao: '', descricao: '', tipo: 'PREGAO', dataAbertura: '', dataEncerramento: '', valorEstimado: '', observacoes: '' });
    setItemsTab(false);
    setSelectedLicitacao(null);
    setDialogOpen(true);
  };

  const openEdit = (l: Licitacao) => {
    setEditId(l.id);
    setForm({
      numero: l.numero, orgao: l.orgao, descricao: l.descricao ?? '',
      tipo: l.tipo, dataAbertura: l.dataAbertura?.split('T')[0] ?? '',
      dataEncerramento: l.dataEncerramento?.split('T')[0] ?? '',
      valorEstimado: String(l.valorEstimado), observacoes: l.observacoes ?? '',
    });
    setSelectedLicitacao(l);
    setItemsTab(false);
    setDialogOpen(true);
  };

  const save = async () => {
    const payload = {
      ...form,
      valorEstimado: Number(form.valorEstimado),
      dataAbertura: form.dataAbertura ? new Date(form.dataAbertura) : undefined,
      dataEncerramento: form.dataEncerramento ? new Date(form.dataEncerramento) : undefined,
    };
    if (editId) {
      await licitacoesService.atualizar(editId, payload);
    } else {
      await licitacoesService.criar(payload);
    }
    setDialogOpen(false);
    loadData();
  };

  const excluir = async (id: string) => {
    await licitacoesService.excluir(id);
    loadData();
  };

  const adicionarItem = async () => {
    if (!selectedLicitacao) return;
    await licitacoesService.adicionarItem(selectedLicitacao.id, {
      produtoId: itemForm.produtoId,
      quantidade: Number(itemForm.quantidade),
      valorUnitario: Number(itemForm.valorUnitario),
      marca: itemForm.marca || undefined,
    });
    setItemForm({ produtoId: '', quantidade: '1', valorUnitario: '', marca: '' });
    setItemProdutoLabel('');
    const res = await licitacoesService.buscarPorId(selectedLicitacao.id);
    setSelectedLicitacao(res.data);
    const idx = licitacoes.findIndex((l) => l.id === selectedLicitacao.id);
    if (idx >= 0) {
      const updated = [...licitacoes];
      updated[idx] = res.data;
      setLicitacoes(updated);
    }
  };

  const removerItem = async (itemId: string) => {
    if (!selectedLicitacao) return;
    await licitacoesService.removerItem(selectedLicitacao.id, itemId);
    const res = await licitacoesService.buscarPorId(selectedLicitacao.id);
    setSelectedLicitacao(res.data);
    const idx = licitacoes.findIndex((l) => l.id === selectedLicitacao.id);
    if (idx >= 0) {
      const updated = [...licitacoes];
      updated[idx] = res.data;
      setLicitacoes(updated);
    }
  };

  const openTabItens = async (l: Licitacao) => {
    setSelectedLicitacao(l);
    setItemsTab(true);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Licitações</h1>
          <p className="text-muted-foreground">Gestão de processos licitatórios</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Nova Licitação</Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por número, órgão ou descrição..." value={filter} onChange={(e) => setFilter(e.target.value)} className="pl-10" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Órgão</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data Abertura</TableHead>
                <TableHead>Valor Estimado</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead className="w-36 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Carregando...</TableCell></TableRow>
              ) : licitacoes.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Nenhuma licitação encontrada</TableCell></TableRow>
              ) : licitacoes.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.numero}</TableCell>
                  <TableCell>{l.orgao}</TableCell>
                  <TableCell>{tipoLabel[l.tipo] ?? l.tipo}</TableCell>
                  <TableCell className="text-xs">{new Date(l.dataAbertura).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>R$ {Number(l.valorEstimado).toFixed(2)}</TableCell>
                  <TableCell><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${situacaoColor[l.situacao]}`}>{situacaoLabel[l.situacao]}</span></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" title="Itens" onClick={() => openTabItens(l)}><Package className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" title="Editar" onClick={() => openEdit(l)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" title="Excluir" onClick={() => excluir(l.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {itemsTab && selectedLicitacao && (
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Itens - {selectedLicitacao.numero}</h3>
            </div>
            <div className="p-4 grid grid-cols-5 gap-2 items-end">
              <div className="col-span-2">
                <Label className="mb-1 block text-xs">Produto</Label>
                <LookupField
                  source="produtos"
                  value={itemForm.produtoId}
                  selectedLabel={itemProdutoLabel}
                  onChange={(item) => { setItemForm({ ...itemForm, produtoId: item.id }); setItemProdutoLabel(item.nome); }}
                  onClear={() => { setItemForm({ ...itemForm, produtoId: '' }); setItemProdutoLabel(''); }}
                  placeholder="Selecionar produto..."
                />
              </div>
              <div>
                <Label className="mb-1 block text-xs">Quantidade</Label>
                <Input type="number" step="0.01" placeholder="Qtd" value={itemForm.quantidade} onChange={(e) => setItemForm({ ...itemForm, quantidade: e.target.value })} />
              </div>
              <div>
                <Label className="mb-1 block text-xs">Valor Unit.</Label>
                <Input type="number" step="0.01" placeholder="0,00" value={itemForm.valorUnitario} onChange={(e) => setItemForm({ ...itemForm, valorUnitario: e.target.value })} />
              </div>
              <Button onClick={adicionarItem}>Adicionar</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow><TableHead>Produto</TableHead><TableHead>Quantidade</TableHead><TableHead>Valor Unit.</TableHead><TableHead>Total</TableHead><TableHead>Marca</TableHead><TableHead className="w-16"></TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {(!selectedLicitacao.itens || selectedLicitacao.itens.length === 0) ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhum item cadastrado</TableCell></TableRow>
                ) : selectedLicitacao.itens.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.produto?.nome ?? item.produtoId}</TableCell>
                    <TableCell>{Number(item.quantidade).toFixed(2)}</TableCell>
                    <TableCell>R$ {Number(item.valorUnitario).toFixed(2)}</TableCell>
                    <TableCell>R$ {(Number(item.quantidade) * Number(item.valorUnitario)).toFixed(2)}</TableCell>
                    <TableCell>{item.marca ?? '-'}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => removerItem(item.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen && !itemsTab} onOpenChange={(open) => { setDialogOpen(open); if (!open) setItemsTab(false); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{editId ? 'Editar Licitação' : 'Nova Licitação'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="numero">Número da licitação</Label>
                <Input id="numero" placeholder="Ex: LIC-2026-0001" value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} />
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
            <div className="grid gap-2">
              <Label htmlFor="orgao">Órgão</Label>
              <Input id="orgao" placeholder="Nome do órgão público realizador da licitação" value={form.orgao} onChange={(e) => setForm({ ...form, orgao: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input id="descricao" placeholder="Descrição do objeto da licitação" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dataAbertura">Data de abertura</Label>
                <Input id="dataAbertura" type="date" value={form.dataAbertura} onChange={(e) => setForm({ ...form, dataAbertura: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dataEncerramento">Data de encerramento</Label>
                <Input id="dataEncerramento" type="date" title="Data prevista para encerramento da licitação" value={form.dataEncerramento} onChange={(e) => setForm({ ...form, dataEncerramento: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="valorEstimado">Valor estimado (R$)</Label>
                <Input id="valorEstimado" type="number" step="0.01" placeholder="0,00" value={form.valorEstimado} onChange={(e) => setForm({ ...form, valorEstimado: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Input id="observacoes" placeholder="Observações sobre o processo licitatório" value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />
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
