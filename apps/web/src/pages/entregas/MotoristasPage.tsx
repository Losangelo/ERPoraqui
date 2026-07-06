import { useEffect, useState } from "react"
import { User, Plus, Edit, ToggleLeft, ToggleRight } from "lucide-react"
import { entregasService } from "@/services/entregas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"

interface Motorista {
  id: string
  nome: string
  cpf?: string
  tipo: "PROPRIO" | "PJ"
  cnh?: string
  cnhCategoria?: string
  telefone?: string
  email?: string
  ativo: boolean
  observacoes?: string
}

export function MotoristasPage() {
  const [motoristas, setMotoristas] = useState<Motorista[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState<Motorista | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    tipo: "PROPRIO" as "PROPRIO" | "PJ",
    cnh: "",
    cnhCategoria: "",
    telefone: "",
    email: "",
    observacoes: "",
    ativo: true,
  })

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const result = await entregasService.listarMotoristas()
      setMotoristas(Array.isArray(result) ? result : [])
    } catch (error) {
      console.error("Erro ao carregar motoristas:", error)
      toast.error("Erro ao carregar motoristas")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editando) {
        await entregasService.atualizarMotorista(editando.id, formData)
        toast.success("Motorista atualizado com sucesso")
      } else {
        await entregasService.criarMotorista(formData)
        toast.success("Motorista criado com sucesso")
      }
      setShowModal(false)
      resetForm()
      loadData()
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || "Erro ao salvar motorista")
    }
  }

  const handleToggleAtivo = async (item: Motorista) => {
    try {
      if (item.ativo) {
        await entregasService.inativarMotorista(item.id)
        toast.success("Motorista inativado")
      } else {
        await entregasService.ativarMotorista(item.id)
        toast.success("Motorista ativado")
      }
      loadData()
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || "Erro ao alterar status")
    }
  }

  const openEdit = (item: Motorista) => {
    setEditando(item)
    setFormData({
      nome: item.nome,
      cpf: item.cpf || "",
      tipo: item.tipo,
      cnh: item.cnh || "",
      cnhCategoria: item.cnhCategoria || "",
      telefone: item.telefone || "",
      email: item.email || "",
      observacoes: item.observacoes || "",
      ativo: item.ativo,
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditando(null)
    setFormData({
      nome: "",
      cpf: "",
      tipo: "PROPRIO",
      cnh: "",
      cnhCategoria: "",
      telefone: "",
      email: "",
      observacoes: "",
      ativo: true,
    })
  }

  const tipoLabel: Record<string, string> = {
    PROPRIO: "Próprio",
    PJ: "PJ",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-6 h-6" />
            Motoristas
          </h1>
          <p className="text-gray-500">Gerenciamento de motoristas de entregas</p>
        </div>
        <Button onClick={() => { resetForm(); setShowModal(true) }} title="Cadastrar novo motorista">
          <Plus className="mr-2 h-4 w-4" />
          Novo Motorista
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : (
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {motoristas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                      Nenhum motorista encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  motoristas.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">{item.nome}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.cpf || "-"}</TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${item.tipo === "PROPRIO" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                          {tipoLabel[item.tipo]}
                        </span>
                      </TableCell>
                      <TableCell>{item.telefone || "-"}</TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${item.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {item.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="Editar motorista" onClick={() => openEdit(item)}>
                            <Edit className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button variant="ghost" size="icon" title={item.ativo ? "Inativar motorista" : "Ativar motorista"} onClick={() => handleToggleAtivo(item)}>
                            {item.ativo ? <ToggleLeft className="h-4 w-4 text-red-600" /> : <ToggleRight className="h-4 w-4 text-green-600" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>

      <Dialog open={showModal} onOpenChange={(open) => { if (!open) { setShowModal(false); resetForm() } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><User className="w-5 h-5" /> {editando ? "Editar" : "Novo"} Motorista</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome <span className="text-red-500">*</span></Label>
              <Input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome completo do motorista"
                title="Nome completo do motorista"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  placeholder="000.000.000-00"
                  title="CPF do motorista (apenas números)"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={formData.tipo} onValueChange={(v: "PROPRIO" | "PJ") => setFormData({ ...formData, tipo: v })}>
                  <SelectTrigger id="tipo" title="Tipo de vínculo do motorista">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PROPRIO">Próprio</SelectItem>
                    <SelectItem value="PJ">PJ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cnh">CNH</Label>
                <Input
                  id="cnh"
                  type="text"
                  value={formData.cnh}
                  onChange={(e) => setFormData({ ...formData, cnh: e.target.value })}
                  placeholder="Número da CNH"
                  title="Número da Carteira Nacional de Habilitação"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cnhCategoria">Categoria CNH</Label>
                <Input
                  id="cnhCategoria"
                  type="text"
                  value={formData.cnhCategoria}
                  onChange={(e) => setFormData({ ...formData, cnhCategoria: e.target.value })}
                  placeholder="Ex: A, B, C, D, E"
                  title="Categoria da CNH (A, B, C, D ou E)"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(99) 99999-9999"
                  title="Telefone do motorista com DDD"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="motorista@exemplo.com"
                  title="E-mail do motorista"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Informações adicionais sobre o motorista (restrições, observações de cadastro, etc.)"
                title="Observações relevantes sobre o motorista"
              />
            </div>
            <div className="flex items-center gap-2">
              <Input
                id="ativo"
                type="checkbox"
                checked={formData.ativo}
                onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="ativo">Ativo</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setShowModal(false); resetForm() }}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MotoristasPage
