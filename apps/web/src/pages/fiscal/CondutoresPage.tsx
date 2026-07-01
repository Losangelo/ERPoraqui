import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { api } from '@/services/api'
import { Plus, Pencil, Trash2 } from 'lucide-react'

interface Condutor {
  id: string
  cpf: string
  nome: string
  rntrc: string | null
  cnh: string | null
  cnhCategoria: string | null
  cnhVencimento: string | null
  telefone: string | null
  email: string | null
  ativo: boolean
}

const initialForm = {
  cpf: '',
  nome: '',
  rntrc: '',
  cnh: '',
  cnhCategoria: '',
  cnhVencimento: '',
  telefone: '',
  email: '',
  ativo: true,
}

export function CondutoresPage() {
  const [condutores, setCondutores] = useState<Condutor[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(initialForm)

  const carregar = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/mdfe/condutores')
      setCondutores(res.data?.data || [])
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Erro ao carregar condutores')
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

  function openEdit(c: Condutor) {
    setEditId(c.id)
    setForm({
      cpf: c.cpf,
      nome: c.nome,
      rntrc: c.rntrc || '',
      cnh: c.cnh || '',
      cnhCategoria: c.cnhCategoria || '',
      cnhVencimento: c.cnhVencimento ? c.cnhVencimento.split('T')[0] : '',
      telefone: c.telefone || '',
      email: c.email || '',
      ativo: c.ativo,
    })
    setDialogOpen(true)
  }

  async function salvar() {
    try {
      const payload = {
        ...form,
        cnhVencimento: form.cnhVencimento ? new Date(form.cnhVencimento).toISOString() : undefined,
      }
      if (editId) {
        await api.put(`/mdfe/condutores/${editId}`, payload)
      } else {
        await api.post('/mdfe/condutores', payload)
      }
      setDialogOpen(false)
      await carregar()
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Erro ao salvar condutor')
    }
  }

  async function excluir(id: string) {
    if (!confirm('Excluir este condutor?')) return
    try {
      await api.delete(`/mdfe/condutores/${id}`)
      await carregar()
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Erro ao excluir condutor')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Condutores</h1>
          <p className="text-muted-foreground">Cadastro de condutores para MDF-e</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Novo Condutor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Condutores Cadastrados</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 text-muted-foreground">Carregando...</div>
          ) : condutores.length === 0 ? (
            <div className="p-4 text-muted-foreground">Nenhum condutor cadastrado</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>CNH</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Vencimento CNH</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {condutores.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.nome}</TableCell>
                    <TableCell className="font-mono">{c.cpf}</TableCell>
                    <TableCell className="font-mono">{c.cnh || '-'}</TableCell>
                    <TableCell>{c.cnhCategoria || '-'}</TableCell>
                    <TableCell>{c.cnhVencimento ? new Date(c.cnhVencimento).toLocaleDateString('pt-BR') : '-'}</TableCell>
                    <TableCell>{c.telefone || '-'}</TableCell>
                    <TableCell>{c.ativo ? 'Sim' : 'Não'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(c)} title="Editar condutor">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => excluir(c.id)} title="Excluir condutor">
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
            <DialogTitle>{editId ? 'Editar Condutor' : 'Novo Condutor'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input id="nome" placeholder="Nome completo do condutor" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" placeholder="000.000.000-00" title="Cadastro de Pessoa Física do condutor" value={form.cpf} onChange={e => setForm({...form, cpf: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cnh">CNH</Label>
                <Input id="cnh" placeholder="Número da CNH" value={form.cnh} onChange={e => setForm({...form, cnh: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cnhCategoria">Categoria</Label>
                  <Input id="cnhCategoria" placeholder="Ex: A, B, C, D, E" title="Categoria da CNH conforme Código de Trânsito" value={form.cnhCategoria} onChange={e => setForm({...form, cnhCategoria: e.target.value.toUpperCase()})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cnhVencimento">Vencimento CNH</Label>
                  <Input id="cnhVencimento" type="date" value={form.cnhVencimento} onChange={e => setForm({...form, cnhVencimento: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="rntrc">RNTRC</Label>
                <Input id="rntrc" placeholder="Registro Nacional de Transportadores" title="Registro Nacional de Transporte Rodoviário de Cargas" value={form.rntrc} onChange={e => setForm({...form, rntrc: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" placeholder="(99) 99999-9999" title="Telefone para contato do condutor" value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="condutor@exemplo.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
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
