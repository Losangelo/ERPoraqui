import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/services/api'
import { Plus, Pencil, Trash2 } from 'lucide-react'

interface Veiculo {
  id: string
  placa: string
  renavam: string | null
  rntrc: string | null
  tipoPropriedade: string
  tara: number
  capacidade: number
  tipoCarroceria: string | null
  marca: string | null
  modelo: string | null
  anoFabricacao: number | null
  cor: string | null
  ativo: boolean
}

const initialForm = {
  placa: '',
  renavam: '',
  rntrc: '',
  tipoPropriedade: '1',
  tara: '0',
  capacidade: '0',
  tipoCarroceria: '',
  marca: '',
  modelo: '',
  anoFabricacao: '',
  cor: '',
  ativo: true,
}

const tipoPropriedadeOptions = [
  { value: '1', label: 'Próprio' },
  { value: '2', label: 'Terceiro' },
  { value: '3', label: 'Arrendado' },
]

export function VeiculosPage() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(initialForm)

  const carregar = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/mdfe/veiculos')
      setVeiculos(res.data?.data || [])
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Erro ao carregar veículos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  function openCreate() {
    setEditId(null)
    setForm(initialForm)
    setDialogOpen(true)
  }

  function openEdit(v: Veiculo) {
    setEditId(v.id)
    setForm({
      placa: v.placa,
      renavam: v.renavam || '',
      rntrc: v.rntrc || '',
      tipoPropriedade: v.tipoPropriedade,
      tara: v.tara.toString(),
      capacidade: v.capacidade.toString(),
      tipoCarroceria: v.tipoCarroceria || '',
      marca: v.marca || '',
      modelo: v.modelo || '',
      anoFabricacao: v.anoFabricacao?.toString() || '',
      cor: v.cor || '',
      ativo: v.ativo,
    })
    setDialogOpen(true)
  }

  async function salvar() {
    try {
      const payload = {
        ...form,
        tara: Number(form.tara),
        capacidade: Number(form.capacidade),
        anoFabricacao: form.anoFabricacao ? Number(form.anoFabricacao) : undefined,
      }
      if (editId) {
        await api.put(`/mdfe/veiculos/${editId}`, payload)
      } else {
        await api.post('/mdfe/veiculos', payload)
      }
      setDialogOpen(false)
      await carregar()
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Erro ao salvar veículo')
    }
  }

  async function excluir(id: string) {
    if (!confirm('Excluir este veículo?')) return
    try {
      await api.delete(`/mdfe/veiculos/${id}`)
      await carregar()
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Erro ao excluir veículo')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Veículos</h1>
          <p className="text-muted-foreground">Cadastro de veículos para MDF-e</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Novo Veículo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Veículos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 text-muted-foreground">Carregando...</div>
          ) : veiculos.length === 0 ? (
            <div className="p-4 text-muted-foreground">Nenhum veículo cadastrado</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Placa</TableHead>
                  <TableHead>Marca / Modelo</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Propriedade</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {veiculos.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-mono">{v.placa}</TableCell>
                    <TableCell>{[v.marca, v.modelo].filter(Boolean).join(' / ') || '-'}</TableCell>
                    <TableCell>{v.anoFabricacao || '-'}</TableCell>
                    <TableCell>{tipoPropriedadeOptions.find(o => o.value === v.tipoPropriedade)?.label || v.tipoPropriedade}</TableCell>
                    <TableCell>{v.capacidade} kg</TableCell>
                    <TableCell>{v.ativo ? 'Sim' : 'Não'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(v)} title="Editar veículo">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => excluir(v.id)} title="Excluir veículo">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? 'Editar Veículo' : 'Novo Veículo'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="placa">Placa</Label>
                <Input id="placa" placeholder="ABC1234 ou ABC1D23" title="Formato: ABC1234 (merc. comum) ou ABC1D23 (Mercosul)" value={form.placa} onChange={e => setForm({...form, placa: e.target.value.toUpperCase()})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="renavam">RENAVAM</Label>
                <Input id="renavam" placeholder="Número do RENAVAM" value={form.renavam} onChange={e => setForm({...form, renavam: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="marca">Marca</Label>
                <Input id="marca" placeholder="Ex: Mercedes-Benz" value={form.marca} onChange={e => setForm({...form, marca: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="modelo">Modelo</Label>
                <Input id="modelo" placeholder="Ex: Actros 2546" value={form.modelo} onChange={e => setForm({...form, modelo: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="anoFabricacao">Ano</Label>
                <Input id="anoFabricacao" placeholder="Ex: 2024" value={form.anoFabricacao} onChange={e => setForm({...form, anoFabricacao: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cor">Cor</Label>
                <Input id="cor" placeholder="Ex: Branca" value={form.cor} onChange={e => setForm({...form, cor: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tipoCarroceria">Carroceria</Label>
                <Input id="tipoCarroceria" placeholder="Ex: Baú, Sider" value={form.tipoCarroceria} onChange={e => setForm({...form, tipoCarroceria: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tipoPropriedade">Propriedade</Label>
                <Select value={form.tipoPropriedade} onValueChange={v => setForm({...form, tipoPropriedade: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {tipoPropriedadeOptions.map(o => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tara">Tara (kg)</Label>
                <Input id="tara" type="number" placeholder="Peso do veículo vazio" title="Peso do veículo sem carga em kg" value={form.tara} onChange={e => setForm({...form, tara: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacidade">Capacidade (kg)</Label>
                <Input id="capacidade" type="number" placeholder="Capacidade máxima de carga" title="Peso máximo de carga suportado em kg" value={form.capacidade} onChange={e => setForm({...form, capacidade: e.target.value})} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rntrc">RNTRC</Label>
              <Input id="rntrc" placeholder="Registro Nacional de Transportadores" title="Registro Nacional de Transporte Rodoviário de Cargas" value={form.rntrc} onChange={e => setForm({...form, rntrc: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={salvar}>{editId ? 'Atualizar' : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
