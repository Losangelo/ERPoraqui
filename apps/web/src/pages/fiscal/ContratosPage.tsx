import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Play, Pause, XCircle, FileText, Search } from 'lucide-react';
import { api } from '@/services/api';

interface Contrato {
  id: string; clienteId: string; numero: string; descricao?: string;
  dataInicio: string; dataFim?: string; valor: number; tipoReajuste: string;
  periodicidade: string; status: string; observacoes?: string;
  cliente?: { id: string; nome: string; documento: string };
  medicoes?: ContratoMedicao[];
}

interface ContratoMedicao {
  id: string; periodo: string; valor: number; dataVencimento: string;
  status: string; pedidoGerado?: string;
}

const statusLabel: Record<string, string> = {
  RASCUNHO: 'Rascunho', ATIVO: 'Ativo', SUSPENSO: 'Suspenso', ENCERRADO: 'Encerrado',
};
const statusColor: Record<string, string> = {
  RASCUNHO: 'text-yellow-600 bg-yellow-50', ATIVO: 'text-green-600 bg-green-50',
  SUSPENSO: 'text-orange-600 bg-orange-50', ENCERRADO: 'text-gray-600 bg-gray-50',
};
const reajusteLabel: Record<string, string> = {
  NENHUM: 'Nenhum', IGPM: 'IGPM', IPCA: 'IPCA', NF: 'Nota Fiscal',
};

export function ContratosPage() {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [medicoesOpen, setMedicoesOpen] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState<any>({
    clienteId: '', numero: '', descricao: '', dataInicio: '', dataFim: '',
    valor: '', tipoReajuste: 'NENHUM', observacoes: '',
  });
  const [medForm, setMedForm] = useState({ periodo: '', valor: '', dataVencimento: '' });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter) params.set('search', filter);
      const res = await api.get(`/contratos?${params}`);
      setContratos(res.data?.data ?? res.data ?? []);
    } catch { } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { loadData(); }, [loadData]);

  const openNew = () => {
    setEditId(null);
    setForm({ clienteId: '', numero: '', descricao: '', dataInicio: '', dataFim: '', valor: '', tipoReajuste: 'NENHUM', observacoes: '' });
    setDialogOpen(true);
  };

  const openEdit = (c: Contrato) => {
    setEditId(c.id);
    setForm({
      clienteId: c.clienteId, numero: c.numero, descricao: c.descricao ?? '',
      dataInicio: c.dataInicio?.split('T')[0] ?? '', dataFim: c.dataFim?.split('T')[0] ?? '',
      valor: String(c.valor), tipoReajuste: c.tipoReajuste, observacoes: c.observacoes ?? '',
    });
    setDialogOpen(true);
  };

  const save = async () => {
    const payload = {
      ...form,
      valor: Number(form.valor),
      dataInicio: form.dataInicio ? new Date(form.dataInicio) : undefined,
      dataFim: form.dataFim ? new Date(form.dataFim) : undefined,
    };
    if (editId) {
      await api.put(`/contratos/${editId}`, payload);
    } else {
      await api.post('/contratos', payload);
    }
    setDialogOpen(false);
    loadData();
  };

  const actionContrato = async (id: string, action: string) => {
    await api.post(`/contratos/${id}/${action}`);
    loadData();
  };

  const excluir = async (id: string) => {
    await api.delete(`/contratos/${id}`);
    loadData();
  };

  const saveMedicao = async (contratoId: string) => {
    await api.post(`/contratos/${contratoId}/medicoes`, {
      ...medForm,
      valor: Number(medForm.valor),
      dataVencimento: new Date(medForm.dataVencimento),
    });
    setMedForm({ periodo: '', valor: '', dataVencimento: '' });
    loadData();
  };

  const faturarMedicao = async (contratoId: string, medicaoId: string) => {
    await api.post(`/contratos/${contratoId}/medicoes/${medicaoId}/faturar`);
    loadData();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contratos</h1>
          <p className="text-muted-foreground">Gestão de contratos de serviços e planos</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Novo Contrato</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {['RASCUNHO', 'ATIVO', 'SUSPENSO', 'ENCERRADO'].map((s) => (
          <Card key={s}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{statusLabel[s]}</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">{contratos.filter((c) => c.status === s).length}</p></CardContent>
          </Card>
        ))}
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
                <TableHead>Valor</TableHead>
                <TableHead>Vigência</TableHead>
                <TableHead>Reajuste</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-48 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Carregando...</TableCell></TableRow>
              ) : contratos.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Nenhum contrato encontrado</TableCell></TableRow>
              ) : contratos.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.numero}</TableCell>
                  <TableCell>{c.cliente?.nome ?? c.clienteId}</TableCell>
                  <TableCell>R$ {Number(c.valor).toFixed(2)}</TableCell>
                  <TableCell className="text-xs">
                    {new Date(c.dataInicio).toLocaleDateString('pt-BR')}
                    {c.dataFim ? ` - ${new Date(c.dataFim).toLocaleDateString('pt-BR')}` : ''}
                  </TableCell>
                  <TableCell>{reajusteLabel[c.tipoReajuste] ?? c.tipoReajuste}</TableCell>
                  <TableCell><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[c.status]}`}>{statusLabel[c.status]}</span></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {c.status === 'RASCUNHO' && <Button variant="ghost" size="icon" title="Ativar" onClick={() => actionContrato(c.id, 'ativar')}><Play className="h-4 w-4 text-green-600" /></Button>}
                      {c.status === 'ATIVO' && <Button variant="ghost" size="icon" title="Suspender" onClick={() => actionContrato(c.id, 'suspender')}><Pause className="h-4 w-4 text-orange-600" /></Button>}
                      {(c.status === 'ATIVO' || c.status === 'SUSPENSO') && <Button variant="ghost" size="icon" title="Encerrar" onClick={() => actionContrato(c.id, 'encerrar')}><XCircle className="h-4 w-4 text-red-600" /></Button>}
                      <Button variant="ghost" size="icon" title="Medições" onClick={() => setMedicoesOpen(medicoesOpen === c.id ? null : c.id)}><FileText className="h-4 w-4" /></Button>
                      {c.status !== 'ENCERRADO' && <Button variant="ghost" size="icon" title="Editar" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>}
                      {c.status === 'RASCUNHO' && <Button variant="ghost" size="icon" title="Excluir" onClick={() => excluir(c.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {medicoesOpen && (() => {
        const contrato = contratos.find((c) => c.id === medicoesOpen);
        if (!contrato) return null;
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Medições - {contrato.numero}</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setMedicoesOpen(null)}>Fechar</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                <Input placeholder="Período (ex: 2026-07)" title="Formato: AAAA-MM" value={medForm.periodo} onChange={(e) => setMedForm({ ...medForm, periodo: e.target.value })} />
                <Input placeholder="Valor da medição" type="number" step="0.01" value={medForm.valor} onChange={(e) => setMedForm({ ...medForm, valor: e.target.value })} />
                <Input placeholder="Data de vencimento" type="date" value={medForm.dataVencimento} onChange={(e) => setMedForm({ ...medForm, dataVencimento: e.target.value })} />
                <Button onClick={() => saveMedicao(medicoesOpen)}>Adicionar</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Período</TableHead><TableHead>Valor</TableHead><TableHead>Vencimento</TableHead><TableHead>Status</TableHead><TableHead>Ações</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {(contrato.medicoes ?? []).length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Nenhuma medição</TableCell></TableRow>
                  ) : (contrato.medicoes ?? []).map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>{m.periodo}</TableCell>
                      <TableCell>R$ {Number(m.valor).toFixed(2)}</TableCell>
                      <TableCell>{new Date(m.dataVencimento).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${m.status === 'FATURADO' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50'}`}>{m.status}</span></TableCell>
                      <TableCell>
                        {m.status === 'PENDENTE' && <Button variant="ghost" size="sm" onClick={() => faturarMedicao(medicoesOpen, m.id)}>Faturar</Button>}
                        {m.pedidoGerado && <span className="text-xs text-muted-foreground">Pedido: {m.pedidoGerado}</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })()}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{editId ? 'Editar Contrato' : 'Novo Contrato'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="clienteId">Cliente</Label>
              <Input id="clienteId" placeholder="ID do cliente" title="Informe o ID do cliente" value={form.clienteId} onChange={(e) => setForm({ ...form, clienteId: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="numero">Número do contrato</Label>
                <Input id="numero" placeholder="Ex: CT-2026-0001" value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="valor">Valor mensal (R$)</Label>
                <Input id="valor" type="number" step="0.01" placeholder="0,00" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input id="descricao" placeholder="Descrição do contrato ou serviço prestado" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
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
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tipoReajuste">Tipo de reajuste</Label>
                <Select value={form.tipoReajuste} onValueChange={(v) => setForm({ ...form, tipoReajuste: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(reajusteLabel).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Input id="observacoes" placeholder="Observações internas sobre o contrato" value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />
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
