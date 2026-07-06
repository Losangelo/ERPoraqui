import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { empresasService, type Filial, type Empresa } from "@/services/estoque"
import { Plus, Pencil, Trash2, Search, Building2 } from "lucide-react"
import toast from "react-hot-toast"

interface FilialForm {
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  inscricaoEstadual: string
  inscricaoMunicipal: string
  telefone: string
  email: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  uf: string
  cep: string
  filialMatriz: boolean
}

const formInicial: FilialForm = {
  razaoSocial: "", nomeFantasia: "", cnpj: "", inscricaoEstadual: "", inscricaoMunicipal: "",
  telefone: "", email: "", logradouro: "", numero: "", complemento: "",
  bairro: "", cidade: "", uf: "", cep: "", filialMatriz: false,
}

export function FiliaisPage() {
  const [filiais, setFiliais] = useState<Filial[]>([])
  const [empresas, setEmpresas] = useState<(Empresa & { filiais?: Filial[] })[]>([])
  const [empresaId, setEmpresaId] = useState("")
  const [loading, setLoading] = useState(false)
  const [busca, setBusca] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editando, setEditando] = useState<string | null>(null)
  const [form, setForm] = useState<FilialForm>(formInicial)

  const carregarEmpresas = useCallback(async () => {
    try {
      const data = await empresasService.listar()
      const lista = Array.isArray(data) ? data : (data as any)?.dados || []
      setEmpresas(lista)
      if (lista.length > 0 && !empresaId) setEmpresaId(lista[0].id)
    } catch { console.error("Erro ao carregar empresas") }
  }, [empresaId])

  const carregarFiliais = useCallback(async () => {
    if (!empresaId) return
    setLoading(true)
    try {
      const data = await empresasService.listarFiliais(empresaId)
      setFiliais(Array.isArray(data) ? data : [])
    } catch { toast.error("Erro ao carregar filiais") }
    finally { setLoading(false) }
  }, [empresaId])

  useEffect(() => { carregarEmpresas() }, [carregarEmpresas])
  useEffect(() => { carregarFiliais() }, [carregarFiliais])

  function openCriar() {
    setForm(formInicial)
    setEditando(null)
    setDialogOpen(true)
  }

  function openEditar(filial: Filial) {
    const end = (filial as any).endereco || {}
    setForm({
      razaoSocial: filial.razaoSocial || "",
      nomeFantasia: filial.nomeFantasia || "",
      cnpj: filial.cnpj || "",
      inscricaoEstadual: filial.inscricaoEstadual || "",
      inscricaoMunicipal: (filial as any).inscricaoMunicipal || "",
      telefone: filial.telefone || "",
      email: filial.email || "",
      logradouro: end.logradouro || "",
      numero: end.numero || "",
      complemento: end.complemento || "",
      bairro: end.bairro || "",
      cidade: end.cidade || "",
      uf: end.uf || "",
      cep: end.cep || "",
      filialMatriz: filial.filialMatriz,
    })
    setEditando(filial.id)
    setDialogOpen(true)
  }

  async function handleSalvar() {
    if (!empresaId) { toast.error("Selecione uma empresa"); return }
    if (!form.razaoSocial) { toast.error("Razão social é obrigatória"); return }
    if (!form.cnpj) { toast.error("CNPJ é obrigatório"); return }
    try {
      if (editando) {
        await empresasService.atualizarFilial(empresaId, editando, form)
        toast.success("Filial atualizada com sucesso")
      } else {
        await empresasService.criarFilial(empresaId, form)
        toast.success("Filial criada com sucesso")
      }
      setDialogOpen(false)
      carregarFiliais()
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e.message || "Erro ao salvar filial")
    }
  }

  async function handleRemover(filial: Filial) {
    if (!confirm(`Remover a filial "${filial.razaoSocial}"?`)) return
    try {
      await empresasService.removerFilial(empresaId, filial.id)
      toast.success("Filial removida")
      carregarFiliais()
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e.message || "Erro ao remover filial")
    }
  }

  const filtrados = filiais.filter(f =>
    f.razaoSocial.toLowerCase().includes(busca.toLowerCase()) ||
    f.nomeFantasia?.toLowerCase().includes(busca.toLowerCase()) ||
    f.cnpj.includes(busca)
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6" />Filiais
          </h1>
          <p className="text-muted-foreground">Gerencie as filiais da empresa</p>
        </div>
        <Button onClick={openCriar}>
          <Plus className="w-4 h-4 mr-1" /> Nova Filial
        </Button>
      </div>

      <div className="flex gap-4 items-end">
        <div className="w-72">
          <Label>Empresa</Label>
          <Select value={empresaId} onValueChange={setEmpresaId}>
            <SelectTrigger><SelectValue placeholder="Selecione a empresa" /></SelectTrigger>
            <SelectContent>
              {empresas.map(e => (
                <SelectItem key={e.id} value={e.id}>{e.razaoSocial}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Buscar filial por nome ou CNPJ..." value={busca} onChange={e => setBusca(e.target.value)} className="pl-10" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Razão Social</TableHead>
                <TableHead>Nome Fantasia</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Cidade/UF</TableHead>
                <TableHead>Matriz</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8">Carregando...</TableCell></TableRow>
              ) : filtrados.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8">Nenhuma filial encontrada</TableCell></TableRow>
              ) : (
                filtrados.map(f => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium">{f.razaoSocial}</TableCell>
                    <TableCell>{f.nomeFantasia || "-"}</TableCell>
                    <TableCell>{f.cnpj}</TableCell>
                    <TableCell>{f.telefone || "-"}</TableCell>
                    <TableCell>{(f as any).endereco ? `${(f as any).endereco.cidade || ""}/${(f as any).endereco.uf || ""}` : "-"}</TableCell>
                    <TableCell>{f.filialMatriz ? <span className="text-green-600 font-medium">Sim</span> : "Não"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditar(f)} title="Editar filial">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleRemover(f)} title="Remover filial">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editando ? "Editar Filial" : "Nova Filial"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="razaoSocial">Razão Social</Label>
              <Input id="razaoSocial" value={form.razaoSocial} onChange={e => setForm({ ...form, razaoSocial: e.target.value })} placeholder="Razão social completa da filial" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
              <Input id="nomeFantasia" value={form.nomeFantasia} onChange={e => setForm({ ...form, nomeFantasia: e.target.value })} placeholder="Nome comercial da filial" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input id="cnpj" value={form.cnpj} onChange={e => setForm({ ...form, cnpj: e.target.value })} placeholder="Apenas números" title="Formato: 99.999.999/9999-99" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ie">Inscrição Estadual</Label>
              <Input id="ie" value={form.inscricaoEstadual} onChange={e => setForm({ ...form, inscricaoEstadual: e.target.value })} placeholder="Inscrição estadual da filial" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="im">Inscrição Municipal</Label>
              <Input id="im" value={form.inscricaoMunicipal} onChange={e => setForm({ ...form, inscricaoMunicipal: e.target.value })} placeholder="Inscrição municipal da filial" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} placeholder="Telefone para contato" title="Formato: (99) 99999-9999" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="E-mail da filial" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="logradouro">Logradouro</Label>
              <Input id="logradouro" value={form.logradouro} onChange={e => setForm({ ...form, logradouro: e.target.value })} placeholder="Rua, avenida..." />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="numero">Número</Label>
                <Input id="numero" value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} placeholder="Nº" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input id="bairro" value={form.bairro} onChange={e => setForm({ ...form, bairro: e.target.value })} placeholder="Bairro" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" value={form.cidade} onChange={e => setForm({ ...form, cidade: e.target.value })} placeholder="Cidade" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="uf">UF</Label>
                <Input id="uf" value={form.uf} onChange={e => setForm({ ...form, uf: e.target.value })} placeholder="UF" title="Sigla do estado: SP, RJ, MG..." maxLength={2} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cep">CEP</Label>
              <Input id="cep" value={form.cep} onChange={e => setForm({ ...form, cep: e.target.value })} placeholder="CEP da filial" title="Formato: 99999-999" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filialMatriz">É Matriz?</Label>
              <Select value={form.filialMatriz ? "sim" : "nao"} onValueChange={v => setForm({ ...form, filialMatriz: v === "sim" })}>
                <SelectTrigger id="filialMatriz"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="nao">Não</SelectItem>
                  <SelectItem value="sim">Sim</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSalvar}>{editando ? "Atualizar" : "Salvar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FiliaisPage
