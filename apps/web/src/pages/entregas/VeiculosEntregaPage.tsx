import { useEffect, useState } from "react"
import { Truck, Plus, Edit, ToggleLeft, ToggleRight } from "lucide-react"
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

type TipoVeiculo = "CARRO" | "MOTO" | "VAN" | "CAMINHAO" | "BICICLETA" | "OUTRO"

interface Veiculo {
  id: string
  placa: string
  marca?: string
  modelo?: string
  ano?: number
  cor?: string
  capacidadeKg?: number
  tipo: TipoVeiculo
  ativo: boolean
  observacoes?: string
}

const TIPO_VEICULO_LABEL: Record<TipoVeiculo, string> = {
  CARRO: "Carro",
  MOTO: "Moto",
  VAN: "Van",
  CAMINHAO: "Caminhão",
  BICICLETA: "Bicicleta",
  OUTRO: "Outro",
}

const TIPO_VEICULO_BADGE: Record<TipoVeiculo, string> = {
  CARRO: "bg-blue-100 text-blue-800",
  MOTO: "bg-orange-100 text-orange-800",
  VAN: "bg-purple-100 text-purple-800",
  CAMINHAO: "bg-green-100 text-green-800",
  BICICLETA: "bg-yellow-100 text-yellow-800",
  OUTRO: "bg-gray-100 text-gray-800",
}

export function VeiculosEntregaPage() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState<Veiculo | null>(null)
  const [formData, setFormData] = useState({
    placa: "",
    marca: "",
    modelo: "",
    ano: "",
    cor: "",
    capacidadeKg: "",
    tipo: "CARRO" as TipoVeiculo,
    observacoes: "",
    ativo: true,
  })

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const result = await entregasService.listarVeiculos()
      setVeiculos(Array.isArray(result) ? result : [])
    } catch (error) {
      console.error("Erro ao carregar veículos:", error)
      toast.error("Erro ao carregar veículos")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        ...formData,
        ano: formData.ano ? parseInt(formData.ano) : undefined,
        capacidadeKg: formData.capacidadeKg ? parseFloat(formData.capacidadeKg) : undefined,
      }
      if (editando) {
        await entregasService.atualizarVeiculo(editando.id, data)
        toast.success("Veículo atualizado com sucesso")
      } else {
        await entregasService.criarVeiculo(data)
        toast.success("Veículo criado com sucesso")
      }
      setShowModal(false)
      resetForm()
      loadData()
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || "Erro ao salvar veículo")
    }
  }

  const handleToggleAtivo = async (item: Veiculo) => {
    try {
      if (item.ativo) {
        await entregasService.inativarVeiculo(item.id)
        toast.success("Veículo inativado")
      } else {
        await entregasService.ativarVeiculo(item.id)
        toast.success("Veículo ativado")
      }
      loadData()
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || "Erro ao alterar status")
    }
  }

  const openEdit = (item: Veiculo) => {
    setEditando(item)
    setFormData({
      placa: item.placa,
      marca: item.marca || "",
      modelo: item.modelo || "",
      ano: item.ano ? String(item.ano) : "",
      cor: item.cor || "",
      capacidadeKg: item.capacidadeKg ? String(item.capacidadeKg) : "",
      tipo: item.tipo,
      observacoes: item.observacoes || "",
      ativo: item.ativo,
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditando(null)
    setFormData({
      placa: "",
      marca: "",
      modelo: "",
      ano: "",
      cor: "",
      capacidadeKg: "",
      tipo: "CARRO",
      observacoes: "",
      ativo: true,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="w-6 h-6" />
            Veículos de Entrega
          </h1>
          <p className="text-gray-500">Gerenciamento de veículos para entregas</p>
        </div>
        <Button onClick={() => { resetForm(); setShowModal(true) }} title="Cadastrar novo veículo">
          <Plus className="mr-2 h-4 w-4" />
          Novo Veículo
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
                  <TableHead>Placa</TableHead>
                  <TableHead>Marca / Modelo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {veiculos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                      Nenhum veículo encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  veiculos.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                            <Truck className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="font-mono font-medium text-gray-900 uppercase">{item.placa}</span>
                        </div>
                      </TableCell>
                      <TableCell>{[item.marca, item.modelo].filter(Boolean).join(" / ") || "-"}</TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${TIPO_VEICULO_BADGE[item.tipo]}`}>
                          {TIPO_VEICULO_LABEL[item.tipo]}
                        </span>
                      </TableCell>
                      <TableCell>{item.capacidadeKg ? `${item.capacidadeKg} kg` : "-"}</TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${item.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {item.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="Editar veículo" onClick={() => openEdit(item)}>
                            <Edit className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button variant="ghost" size="icon" title={item.ativo ? "Inativar veículo" : "Ativar veículo"} onClick={() => handleToggleAtivo(item)}>
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
            <DialogTitle className="flex items-center gap-2"><Truck className="w-5 h-5" /> {editando ? "Editar" : "Novo"} Veículo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="placa">Placa <span className="text-red-500">*</span></Label>
                <Input
                  id="placa"
                  type="text"
                  value={formData.placa}
                  onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
                  placeholder="ABC-1234"
                  title="Placa do veículo no formato ABC-1234"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={formData.tipo} onValueChange={(v: TipoVeiculo) => setFormData({ ...formData, tipo: v })}>
                  <SelectTrigger id="tipo" title="Tipo de veículo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CARRO">Carro</SelectItem>
                    <SelectItem value="MOTO">Moto</SelectItem>
                    <SelectItem value="VAN">Van</SelectItem>
                    <SelectItem value="CAMINHAO">Caminhão</SelectItem>
                    <SelectItem value="BICICLETA">Bicicleta</SelectItem>
                    <SelectItem value="OUTRO">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  type="text"
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  placeholder="Marca do veículo (ex: Fiat, Ford)"
                  title="Marca/fabricante do veículo"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="modelo">Modelo</Label>
                <Input
                  id="modelo"
                  type="text"
                  value={formData.modelo}
                  onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                  placeholder="Modelo do veículo (ex: Fiorino, Courier)"
                  title="Modelo do veículo"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ano">Ano</Label>
                <Input
                  id="ano"
                  type="number"
                  min="1900"
                  max="2100"
                  value={formData.ano}
                  onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
                  placeholder="Ano de fabricação (ex: 2024)"
                  title="Ano de fabricação do veículo"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cor">Cor</Label>
                <Input
                  id="cor"
                  type="text"
                  value={formData.cor}
                  onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                  placeholder="Cor predominante (ex: Branco)"
                  title="Cor do veículo"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacidadeKg">Capacidade (kg)</Label>
                <Input
                  id="capacidadeKg"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.capacidadeKg}
                  onChange={(e) => setFormData({ ...formData, capacidadeKg: e.target.value })}
                  placeholder="Peso máximo suportado em kg"
                  title="Capacidade de carga em quilogramas"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Informações adicionais sobre o veículo (manutenção, restrições, etc.)"
                title="Observações relevantes sobre o veículo"
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

export default VeiculosEntregaPage
