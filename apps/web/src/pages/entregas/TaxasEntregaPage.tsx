import { useEffect, useState } from "react"
import { DollarSign, Plus, Edit, ToggleLeft, ToggleRight } from "lucide-react"
import { entregasService } from "@/services/entregas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"

type TipoTaxa = "FIXA" | "POR_KM" | "POR_CEP" | "POR_VALOR"

interface TaxaEntrega {
  id: string
  descricao: string
  tipo: TipoTaxa
  valor: number
  raioKm?: number
  cepInicio?: string
  cepFim?: string
  valorMinimoPedido?: number
  ativo: boolean
}

const TIPO_TAXA_LABEL: Record<TipoTaxa, string> = {
  FIXA: "Fixa",
  POR_KM: "Por KM",
  POR_CEP: "Por CEP",
  POR_VALOR: "Por Valor",
}

const TIPO_TAXA_BADGE: Record<TipoTaxa, string> = {
  FIXA: "bg-blue-100 text-blue-800",
  POR_KM: "bg-green-100 text-green-800",
  POR_CEP: "bg-purple-100 text-purple-800",
  POR_VALOR: "bg-orange-100 text-orange-800",
}

export function TaxasEntregaPage() {
  const [taxas, setTaxas] = useState<TaxaEntrega[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState<TaxaEntrega | null>(null)
  const [formData, setFormData] = useState({
    descricao: "",
    tipo: "FIXA" as TipoTaxa,
    valor: "",
    raioKm: "",
    cepInicio: "",
    cepFim: "",
    valorMinimoPedido: "",
    ativo: true,
  })

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const result = await entregasService.listarTaxas()
      setTaxas(Array.isArray(result) ? result : [])
    } catch (error) {
      console.error("Erro ao carregar taxas:", error)
      toast.error("Erro ao carregar taxas de entrega")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data: any = {
        descricao: formData.descricao,
        tipo: formData.tipo,
        valor: parseFloat(formData.valor) || 0,
        ativo: formData.ativo,
      }
      if (formData.tipo === "POR_KM") data.raioKm = parseFloat(formData.raioKm) || undefined
      if (formData.tipo === "POR_CEP") {
        data.cepInicio = formData.cepInicio || undefined
        data.cepFim = formData.cepFim || undefined
      }
      if (formData.valorMinimoPedido) data.valorMinimoPedido = parseFloat(formData.valorMinimoPedido) || undefined

      if (editando) {
        await entregasService.atualizarTaxa(editando.id, data)
        toast.success("Taxa atualizada com sucesso")
      } else {
        await entregasService.criarTaxa(data)
        toast.success("Taxa criada com sucesso")
      }
      setShowModal(false)
      resetForm()
      loadData()
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || "Erro ao salvar taxa")
    }
  }

  const handleToggleAtivo = async (item: TaxaEntrega) => {
    try {
      if (item.ativo) {
        await entregasService.inativarTaxa(item.id)
        toast.success("Taxa inativada")
      } else {
        await entregasService.ativarTaxa(item.id)
        toast.success("Taxa ativada")
      }
      loadData()
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || "Erro ao alterar status")
    }
  }

  const openEdit = (item: TaxaEntrega) => {
    setEditando(item)
    setFormData({
      descricao: item.descricao,
      tipo: item.tipo,
      valor: String(item.valor),
      raioKm: item.raioKm ? String(item.raioKm) : "",
      cepInicio: item.cepInicio || "",
      cepFim: item.cepFim || "",
      valorMinimoPedido: item.valorMinimoPedido ? String(item.valorMinimoPedido) : "",
      ativo: item.ativo,
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditando(null)
    setFormData({
      descricao: "",
      tipo: "FIXA",
      valor: "",
      raioKm: "",
      cepInicio: "",
      cepFim: "",
      valorMinimoPedido: "",
      ativo: true,
    })
  }

  function formatValor(v: number) {
    return `R$ ${(v || 0).toFixed(2)}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-6 h-6" />
            Taxas de Entrega
          </h1>
          <p className="text-gray-500">Gerenciamento de taxas de entrega</p>
        </div>
        <Button onClick={() => { resetForm(); setShowModal(true) }} title="Cadastrar nova taxa de entrega">
          <Plus className="mr-2 h-4 w-4" />
          Nova Taxa
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
                  <TableHead>Descrição</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Raio KM</TableHead>
                  <TableHead>CEP</TableHead>
                  <TableHead>Valor Mínimo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-gray-500">
                      Nenhuma taxa encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  taxas.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                            <DollarSign className="h-4 w-4 text-emerald-600" />
                          </div>
                          <span className="font-medium text-gray-900">{item.descricao}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${TIPO_TAXA_BADGE[item.tipo]}`}>
                          {TIPO_TAXA_LABEL[item.tipo]}
                        </span>
                      </TableCell>
                      <TableCell>{formatValor(item.valor)}</TableCell>
                      <TableCell>{item.raioKm ? `${item.raioKm} km` : "-"}</TableCell>
                      <TableCell>{item.cepInicio ? `${item.cepInicio} - ${item.cepFim || "..."}` : "-"}</TableCell>
                      <TableCell>{item.valorMinimoPedido ? formatValor(item.valorMinimoPedido) : "-"}</TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${item.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {item.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="Editar taxa" onClick={() => openEdit(item)}>
                            <Edit className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button variant="ghost" size="icon" title={item.ativo ? "Inativar taxa" : "Ativar taxa"} onClick={() => handleToggleAtivo(item)}>
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
            <DialogTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5" /> {editando ? "Editar" : "Nova"} Taxa de Entrega</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição <span className="text-red-500">*</span></Label>
              <Input
                id="descricao"
                type="text"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descrição da taxa (ex: Taxa Fixa Centro, Taxa por KM Zona Sul)"
                title="Nome descritivo para a taxa de entrega"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={formData.tipo} onValueChange={(v: TipoTaxa) => setFormData({ ...formData, tipo: v })}>
                <SelectTrigger id="tipo" title="Tipo de cálculo da taxa">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIXA">Fixa</SelectItem>
                  <SelectItem value="POR_KM">Por KM</SelectItem>
                  <SelectItem value="POR_CEP">Por CEP</SelectItem>
                  <SelectItem value="POR_VALOR">Por Valor do Pedido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="valor">Valor (R$) <span className="text-red-500">*</span></Label>
              <Input
                id="valor"
                type="number"
                min="0"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                placeholder="Valor da taxa (ex: 15,90)"
                title="Valor da taxa de entrega em R$"
                required
              />
            </div>

            {formData.tipo === "POR_KM" && (
              <div className="grid gap-2">
                <Label htmlFor="raioKm">Raio (KM)</Label>
                <Input
                  id="raioKm"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.raioKm}
                  onChange={(e) => setFormData({ ...formData, raioKm: e.target.value })}
                  placeholder="Raio máximo de abrangência em KM (ex: 10)"
                  title="Raio máximo em quilômetros para esta taxa"
                />
              </div>
            )}

            {formData.tipo === "POR_CEP" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cepInicio">CEP Início</Label>
                  <Input
                    id="cepInicio"
                    type="text"
                    value={formData.cepInicio}
                    onChange={(e) => setFormData({ ...formData, cepInicio: e.target.value })}
                    placeholder="CEP inicial da faixa (ex: 01000-000)"
                    title="CEP inicial da faixa de abrangência"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cepFim">CEP Fim</Label>
                  <Input
                    id="cepFim"
                    type="text"
                    value={formData.cepFim}
                    onChange={(e) => setFormData({ ...formData, cepFim: e.target.value })}
                    placeholder="CEP final da faixa (ex: 01999-999)"
                    title="CEP final da faixa de abrangência"
                  />
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="valorMinimoPedido">Valor Mínimo do Pedido (R$)</Label>
              <Input
                id="valorMinimoPedido"
                type="number"
                min="0"
                step="0.01"
                value={formData.valorMinimoPedido}
                onChange={(e) => setFormData({ ...formData, valorMinimoPedido: e.target.value })}
                placeholder="Valor mínimo do pedido para aplicar esta taxa (ex: 50,00)"
                title="Valor mínimo do pedido para que esta taxa seja aplicada"
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

export default TaxasEntregaPage
