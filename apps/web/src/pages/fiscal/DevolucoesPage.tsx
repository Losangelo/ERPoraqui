import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Plus, Trash2, Search, CheckCircle, XCircle, ArrowRightLeft } from 'lucide-react';
import { api } from '@/services/api';

interface DevolucaoItem {
  id: string; produtoId: string; quantidade: number; valor: number;
  condicao: string; numeroSerie?: string;
  produto?: { id: string; nome: string };
}

interface Devolucao {
  id: string; clienteId: string; pedidoVendaId?: string;
  numero: string; motivo: string; status: string; destino?: string;
  observacoes?: string; laudoTecnico?: string; nfDevolucao?: string;
  cliente?: { id: string; nome: string };
  itens?: DevolucaoItem[];
}

const motivoLabel: Record<string, string> = {
  DEFEITO: 'Defeito', TROCA: 'Troca', ARREPENDIMENTO: 'Arrependimento', AVARIA: 'Avaria',
};
const statusLabel: Record<string, string> = {
  SOLICITACAO: 'Solicitação', INSPECAO: 'Inspeção', APROVADO: 'Aprovado',
  REJEITADO: 'Rejeitado', DESTINADO: 'Destinado', CANCELADO: 'Cancelado',
};
const statusColor: Record<string, string> = {
  SOLICITACAO: 'text-blue-600 bg-blue-50', INSPECAO: 'text-yellow-600 bg-yellow-50',
  APROVADO: 'text-green-600 bg-green-50', REJEITADO: 'text-red-600 bg-red-50',
  DESTINADO: 'text-purple-600 bg-purple-50', CANCELADO: 'text-gray-600 bg-gray-50',
};
const destinoLabel: Record<string, string> = {
  REPARO: 'Reparo', SUBSTITUICAO: 'Substituição', CREDITO: 'Crédito', DESCARTE: 'Descarte',
};

export function DevolucoesPage() {
  const [devolucoes, setDevolucoes] = useState<Devolucao[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [destinoDialog, setDestinoDialog] = useState<string | null>(null);
  const [destinoValue, setDestinoValue] = useState('REPARO');
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState<any>({
    clienteId: '', pedidoVendaId: '', numero: '', motivo: 'DEFEITO',
    observacoes: '', itens: [{ produtoId: '', quantidade: '1', valor: '0', condicao: 'NOVO', numeroSerie: '' }],
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter) params.set('search', filter);
      const res = await api.get(`/devolucoes?${params}`);
      setDevolucoes(res.data?.data ?? res.data ?? []);
    } catch { } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { loadData(); }, [loadData]);

  const openNew = () => {
    setForm({
      clienteId: '', pedidoVendaId: '', numero: '', motivo: 'DEFEITO',
      observacoes: '', itens: [{ produtoId: '', quantidade: '1', valor: '0', condicao: 'NOVO', numeroSerie: '' }],
    });
    setDialogOpen(true);
  };

  const addItem = () => {
    setForm({ ...form, itens: [...form.itens, { produtoId: '', quantidade: '1', valor: '0', condicao: 'NOVO', numeroSerie: '' }] });
  };

  const removeItem = (idx: number) => {
    setForm({ ...form, itens: form.itens.filter((_: any, i: number) => i !== idx) });
  };

  const updateItem = (idx: number, field: string, value: string) => {
    const itens = [...form.itens];
    itens[idx] = { ...itens[idx], [field]: value };
    setForm({ ...form, itens });
  };

  const save = async () => {
    const payload = {
      ...form,
      itens: form.itens.map((i: any) => ({ ...i, quantidade: Number(i.quantidade), valor: Number(i.valor) })),
    };
    await api.post('/devolucoes', payload);
    setDialogOpen(false);
    loadData();
  };

  const action = async (id: string, action: string, data?: any) => {
    await api.post(`/devolucoes/${id}/${action}`, data ?? {});
    setDetailId(null);
    loadData();
  };

  const excluir = async (id: string) => {
    await api.delete(`/devolucoes/${id}`);
    loadData();
  };

  const confirmDestino = async () => {
    if (destinoDialog) {
      await action(destinoDialog, 'destinar', { destino: destinoValue });
      setDestinoDialog(null);
      setDestinoValue('REPARO');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Devoluções / RMA</h1>
          <p className="text-muted-foreground">Gestão de devoluções, garantias e assistência técnica</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Nova Devolução</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Solicitações</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{devolucoes.filter((d) => d.status === 'SOLICITACAO').length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Em Inspeção</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{devolucoes.filter((d) => d.status === 'INSPECAO').length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Pendentes Destino</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{devolucoes.filter((d) => d.status === 'APROVADO').length}</p></CardContent></Card>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por número, cliente ou motivo..." value={filter} onChange={(e) => setFilter(e.target.value)} className="pl-10" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead className="w-36 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Carregando...</TableCell></TableRow>
              ) : devolucoes.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Nenhuma devolução encontrada</TableCell></TableRow>
              ) : devolucoes.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.numero}</TableCell>
                  <TableCell>{d.cliente?.nome ?? d.clienteId}</TableCell>
                  <TableCell>{motivoLabel[d.motivo] ?? d.motivo}</TableCell>
                  <TableCell>{d.itens?.length ?? 0} item(ns)</TableCell>
                  <TableCell><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[d.status]}`}>{statusLabel[d.status]}</span></TableCell>
                  <TableCell>{d.destino ? (destinoLabel[d.destino] ?? d.destino) : '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {d.status === 'SOLICITACAO' && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => action(d.id, 'rejeitar')}><XCircle className="h-4 w-4 text-red-600 mr-1" />Rejeitar</Button>
                          <Button variant="ghost" size="sm" onClick={() => action(d.id, 'aprovar')}><CheckCircle className="h-4 w-4 text-green-600 mr-1" />Aprovar</Button>
                        </>
                      )}
                      {d.status === 'APROVADO' && (
                        <Button variant="ghost" size="sm" onClick={() => { setDestinoDialog(d.id); setDestinoValue('REPARO'); }}>
                          <ArrowRightLeft className="h-4 w-4 mr-1" />Destinar
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" title="Detalhes" onClick={() => setDetailId(detailId === d.id ? null : d.id)}>
                        <Search className="h-4 w-4" />
                      </Button>
                      {d.status === 'SOLICITACAO' && (
                        <Button variant="ghost" size="icon" title="Excluir" onClick={() => excluir(d.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {detailId && (() => {
        const d = devolucoes.find((x) => x.id === detailId);
        if (!d) return null;
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Devolução {d.numero} - {d.cliente?.nome}</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setDetailId(null)}>Fechar</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><span className="font-medium">Motivo:</span> {motivoLabel[d.motivo] ?? d.motivo}</div>
                <div><span className="font-medium">Status:</span> {statusLabel[d.status] ?? d.status}</div>
                <div><span className="font-medium">Destino:</span> {d.destino ? (destinoLabel[d.destino] ?? d.destino) : '-'}</div>
                {d.observacoes && <div className="col-span-3"><span className="font-medium">Observações:</span> {d.observacoes}</div>}
                {d.laudoTecnico && <div className="col-span-3"><span className="font-medium">Laudo Técnico:</span> {d.laudoTecnico}</div>}
                {d.nfDevolucao && <div className="col-span-3"><span className="font-medium">NF-e Devolução:</span> {d.nfDevolucao}</div>}
              </div>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Produto</TableHead><TableHead>Qtd</TableHead><TableHead>Valor</TableHead><TableHead>Condição</TableHead><TableHead>Série</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {(d.itens ?? []).map((i) => (
                    <TableRow key={i.id}>
                      <TableCell>{i.produto?.nome ?? i.produtoId}</TableCell>
                      <TableCell>{Number(i.quantidade)}</TableCell>
                      <TableCell>R$ {Number(i.valor).toFixed(2)}</TableCell>
                      <TableCell>{i.condicao}</TableCell>
                      <TableCell>{i.numeroSerie ?? '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })()}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Nova Devolução</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="clienteId">Cliente</Label>
                <Input id="clienteId" placeholder="ID do cliente" value={form.clienteId} onChange={(e) => setForm({ ...form, clienteId: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pedidoVendaId">Pedido de venda</Label>
                <Input id="pedidoVendaId" placeholder="ID do pedido (opcional)" value={form.pedidoVendaId} onChange={(e) => setForm({ ...form, pedidoVendaId: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="numero">Número</Label>
                <Input id="numero" placeholder="Ex: DEV-2026-0001" value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="motivo">Motivo</Label>
                <Select value={form.motivo} onValueChange={(v) => setForm({ ...form, motivo: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(motivoLabel).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Input id="observacoes" placeholder="Descrição da devolução" value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Itens</Label>
                <Button variant="outline" size="sm" onClick={addItem}><Plus className="h-4 w-4 mr-1" />Adicionar Item</Button>
              </div>
              {form.itens.map((item: any, idx: number) => (
                <div key={idx} className="grid grid-cols-5 gap-2 mb-2 p-2 border rounded-lg">
                  <Input placeholder="ID do produto" value={item.produtoId} onChange={(e) => updateItem(idx, 'produtoId', e.target.value)} />
                  <Input type="number" placeholder="Quantidade de unidades" title="Quantidade de produtos" value={item.quantidade} onChange={(e) => updateItem(idx, 'quantidade', e.target.value)} />
                  <Input type="number" step="0.01" placeholder="Valor unitário (R$)" title="Valor por unidade" value={item.valor} onChange={(e) => updateItem(idx, 'valor', e.target.value)} />
                  <Select value={item.condicao} onValueChange={(v) => updateItem(idx, 'condicao', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NOVO">Novo</SelectItem>
                      <SelectItem value="DEFEITO">Defeito</SelectItem>
                      <SelectItem value="AVARIADO">Avariado</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-1">
                    <Input placeholder="Número de série do produto" title="Número de série (opcional)" value={item.numeroSerie} onChange={(e) => updateItem(idx, 'numeroSerie', e.target.value)} />
                    {form.itens.length > 1 && <Button variant="ghost" size="icon" title="Remover item da devolução" onClick={() => removeItem(idx)}><Trash2 className="h-4 w-4 text-red-600" /></Button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={save}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!destinoDialog} onOpenChange={(v) => { if (!v) setDestinoDialog(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Definir Destinação</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Destino</Label>
              <Select value={destinoValue} onValueChange={setDestinoValue}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(destinoLabel).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDestinoDialog(null)}>Cancelar</Button>
            <Button onClick={confirmDestino}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
