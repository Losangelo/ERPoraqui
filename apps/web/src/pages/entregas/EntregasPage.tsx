import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Truck, Plus, Clock, Package, MapPin, User, Calendar, AlertCircle, CheckCircle2, XCircle, ShoppingCart } from "lucide-react"
import { entregasService } from "@/services/entregas"
import { pedidosService } from "@/services/pedidos"
import toast from "react-hot-toast"

type Situacao = "PENDENTE" | "AGENDADO" | "SAIU_PARA_ENTREGA" | "ENTREGUE" | "TENTATIVA_FALHOU" | "CANCELADO"

interface Entrega {
  id: string
  tokenRastreio: string
  pedidoVendaId?: string
  clienteId?: string
  motoristaId?: string
  veiculoId?: string
  situacao: Situacao
  enderecoEntrega?: any
  dataAgendamento?: string
  dataSaida?: string
  dataEntrega?: string
  dataPrevisao?: string
  dataCriacao: string
  observacoes?: string
  motorista?: { id: string; nome: string }
  veiculoEntrega?: { id: string; placa: string; modelo?: string; marca?: string }
  cliente?: { id: string; nome: string }
  pedidoVenda?: { id: string; numeroPedido?: string }
  tentativas?: Array<{ id: string; dataTentativa: string; motivoFalha?: string; observacoes?: string }>
}

const SITUACAO_BADGE: Record<Situacao, string> = {
  PENDENTE: "bg-yellow-100 text-yellow-800",
  AGENDADO: "bg-blue-100 text-blue-800",
  SAIU_PARA_ENTREGA: "bg-purple-100 text-purple-800",
  ENTREGUE: "bg-green-100 text-green-800",
  TENTATIVA_FALHOU: "bg-red-100 text-red-800",
  CANCELADO: "bg-gray-100 text-gray-800",
}

const SITUACAO_LABEL: Record<Situacao, string> = {
  PENDENTE: "Pendente",
  AGENDADO: "Agendado",
  SAIU_PARA_ENTREGA: "Saiu para Entrega",
  ENTREGUE: "Entregue",
  TENTATIVA_FALHOU: "Tentativa Falhou",
  CANCELADO: "Cancelado",
}

const SITUACAO_OPTIONS = [
  { value: "todas", label: "Todas" },
  { value: "PENDENTE", label: "Pendente" },
  { value: "AGENDADO", label: "Agendado" },
  { value: "SAIU_PARA_ENTREGA", label: "Saiu para Entrega" },
  { value: "ENTREGUE", label: "Entregue" },
  { value: "TENTATIVA_FALHOU", label: "Tentativa Falhou" },
  { value: "CANCELADO", label: "Cancelado" },
]

export function EntregasPage() {
  const [entregas, setEntregas] = useState<Entrega[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState("")
  const [filtroSituacao, setFiltroSituacao] = useState("")
  const [activeTab] = useState("pendentes")

  const [detailSheetOpen, setDetailSheetOpen] = useState(false)
  const [selectedEntrega, setSelectedEntrega] = useState<Entrega | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [agendarDialogOpen, setAgendarDialogOpen] = useState(false)
  const [falhaDialogOpen, setFalhaDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const [formData, setFormData] = useState({
    pedidoVendaId: "",
    clienteId: "",
    enderecoEntrega: "",
    motoristaId: "",
    veiculoId: "",
    dataAgendamento: "",
    dataPrevisao: "",
    valorFrete: "0",
    observacoes: "",
  })

  const [agendarData, setAgendarData] = useState({
    dataAgendamento: "",
    motoristaId: "",
    veiculoId: "",
  })

  const [falhaData, setFalhaData] = useState({
    motivoFalha: "",
    observacoes: "",
  })

  const [motoristas, setMotoristas] = useState<any[]>([])
  const [veiculos, setVeiculos] = useState<any[]>([])
  const [pedidoSearchOpen, setPedidoSearchOpen] = useState(false)
  const [pedidosList, setPedidosList] = useState<any[]>([])
  const [pedidosLoading, setPedidosLoading] = useState(false)
  const [pedidoSearchTerm, setPedidoSearchTerm] = useState("")

  useEffect(() => {
    loadEntregas()
    loadMotoristas()
    loadVeiculos()
  }, [])

  useEffect(() => {
    if (pedidoSearchOpen) loadPedidos()
  }, [pedidoSearchOpen])

  useEffect(() => {
    loadEntregas()
  }, [busca, filtroSituacao, activeTab])

  async function loadEntregas() {
    setLoading(true)
    try {
      const params: any = {}
      if (busca) params.busca = busca
      if (filtroSituacao && filtroSituacao !== 'todas') params.situacao = filtroSituacao
      if (activeTab === "pendentes") params.situacao = "PENDENTE"
      else if (activeTab === "em-andamento") params.situacao = "AGENDADO,SAIU_PARA_ENTREGA"
      const result = await entregasService.listar(params)
      setEntregas(Array.isArray(result) ? result : [])
    } catch (error) {
      console.error("Erro ao carregar entregas:", error)
      toast.error("Erro ao carregar entregas")
    } finally {
      setLoading(false)
    }
  }

  async function loadMotoristas() {
    try {
      const result = await entregasService.listarMotoristas()
      setMotoristas(Array.isArray(result) ? result : [])
    } catch { /* ignore */ }
  }

  async function loadVeiculos() {
    try {
      const result = await entregasService.listarVeiculos()
      setVeiculos(Array.isArray(result) ? result : [])
    } catch { /* ignore */ }
  }

  async function loadPedidos() {
    setPedidosLoading(true)
    try {
      const result = await pedidosService.listar({ situacao: "APROVADO,EM_PROCESSAMENTO,ENVIADO,PENDENTE", limite: 50, busca: pedidoSearchTerm })
      setPedidosList(Array.isArray(result) ? result : [])
    } catch {
      toast.error("Erro ao carregar pedidos")
    } finally {
      setPedidosLoading(false)
    }
  }

  function selectPedido(pedido: any) {
    setFormData({
      ...formData,
      pedidoVendaId: pedido.id,
      clienteId: pedido.clienteId || pedido.cliente?.id || "",
      enderecoEntrega: formData.enderecoEntrega || "",
    })
    setPedidoSearchOpen(false)
    setPedidoSearchTerm("")
    toast.success(`Pedido ${pedido.numeroPedido} selecionado`)
  }

  function verDetalhes(entrega: Entrega) {
    setSelectedEntrega(entrega)
    setDetailSheetOpen(true)
  }

  async function criarEntrega() {
    if (!formData.pedidoVendaId) { toast.error("Informe o pedido de venda"); return }
    if (!formData.clienteId) { toast.error("Informe o cliente"); return }
    setActionLoading(true)
    try {
      await entregasService.criar({
        pedidoVendaId: formData.pedidoVendaId,
        clienteId: formData.clienteId,
        motoristaId: formData.motoristaId || undefined,
        veiculoId: formData.veiculoId || undefined,
        dataAgendamento: formData.dataAgendamento ? new Date(formData.dataAgendamento).toISOString() : undefined,
        dataPrevisao: formData.dataPrevisao ? new Date(formData.dataPrevisao).toISOString() : undefined,
        enderecoEntrega: formData.enderecoEntrega || undefined,
        valorFrete: parseFloat(formData.valorFrete) || 0,
        observacoes: formData.observacoes || undefined,
      })
      setDialogOpen(false)
      resetForm()
      loadEntregas()
      toast.success("Entrega criada com sucesso")
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || "Erro ao criar entrega")
    } finally {
      setActionLoading(false)
    }
  }

  async function agendarEntrega() {
    if (!agendarData.dataAgendamento) { toast.error("Selecione a data de agendamento"); return }
    if (!selectedEntrega) return
    setActionLoading(true)
    try {
      await entregasService.agendar(selectedEntrega.id, {
        dataAgendamento: new Date(agendarData.dataAgendamento).toISOString(),
        motoristaId: agendarData.motoristaId || undefined,
        veiculoId: agendarData.veiculoId || undefined,
      })
      setAgendarDialogOpen(false)
      loadEntregas()
      toast.success("Entrega agendada com sucesso")
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || "Erro ao agendar")
    } finally {
      setActionLoading(false)
    }
  }

  async function saiuParaEntrega(id: string) {
    if (!confirm("Confirmar que a entrega saiu para entrega?")) return
    setActionLoading(true)
    try {
      await entregasService.saiuParaEntrega(id)
      loadEntregas()
      toast.success("Saída para entrega registrada")
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || "Erro ao registrar saída")
    } finally {
      setActionLoading(false)
    }
  }

  async function entregue(id: string) {
    if (!confirm("Confirmar que a entrega foi realizada?")) return
    setActionLoading(true)
    try {
      await entregasService.entregue(id)
      loadEntregas()
      toast.success("Entrega concluída com sucesso")
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || "Erro ao confirmar entrega")
    } finally {
      setActionLoading(false)
    }
  }

  async function tentativaFalhou() {
    if (!falhaData.motivoFalha) { toast.error("Informe o motivo da falha"); return }
    if (!selectedEntrega) return
    setActionLoading(true)
    try {
      await entregasService.tentativaFalhou(selectedEntrega.id, {
        motivoFalha: falhaData.motivoFalha,
        observacoes: falhaData.observacoes || undefined,
      })
      setFalhaDialogOpen(false)
      setFalhaData({ motivoFalha: "", observacoes: "" })
      loadEntregas()
      toast.success("Tentativa registrada")
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || "Erro ao registrar tentativa")
    } finally {
      setActionLoading(false)
    }
  }

  async function cancelar(id: string) {
    if (!confirm("Tem certeza que deseja cancelar esta entrega?")) return
    setActionLoading(true)
    try {
      await entregasService.cancelar(id)
      loadEntregas()
      toast.success("Entrega cancelada")
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || "Erro ao cancelar")
    } finally {
      setActionLoading(false)
    }
  }

  function resetForm() {
    setFormData({
      pedidoVendaId: "",
      clienteId: "",
      enderecoEntrega: "",
      motoristaId: "",
      veiculoId: "",
      dataAgendamento: "",
      dataPrevisao: "",
      valorFrete: "0",
      observacoes: "",
    })
  }

  function getSituacaoBadge(situacao: Situacao) {
    return SITUACAO_BADGE[situacao] || "bg-gray-100 text-gray-800"
  }

  function getSituacaoLabel(situacao: Situacao) {
    return SITUACAO_LABEL[situacao] || situacao
  }

  function formatData(data?: string) {
    if (!data) return "-"
    return new Date(data).toLocaleDateString("pt-BR")
  }

  function isToday(data?: string) {
    if (!data) return false
    const d = new Date(data)
    const hoje = new Date()
    return d.getDate() === hoje.getDate() && d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear()
  }

  function isLate(entrega: Entrega) {
    return entrega.situacao === "AGENDADO" && entrega.dataAgendamento && new Date(entrega.dataAgendamento) < new Date()
  }

  const pendentes = entregas.filter(e => e.situacao === "PENDENTE")
  const emAndamento = entregas.filter(e => e.situacao === "AGENDADO" || e.situacao === "SAIU_PARA_ENTREGA")
  const entreguesHoje = entregas.filter(e => e.situacao === "ENTREGUE" && isToday(e.dataEntrega))
  const atrasadas = entregas.filter(e => isLate(e))

  function filteredList() {
    return entregas
  }

  function openAgendarDialog(entrega: Entrega) {
    setSelectedEntrega(entrega)
    setAgendarData({
      dataAgendamento: "",
      motoristaId: entrega.motoristaId || "",
      veiculoId: entrega.veiculoId || "",
    })
    setAgendarDialogOpen(true)
  }

  function openFalhaDialog(entrega: Entrega) {
    setSelectedEntrega(entrega)
    setFalhaData({ motivoFalha: "", observacoes: "" })
    setFalhaDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="w-6 h-6" />
            Entregas
          </h1>
          <p className="text-gray-500">Gerenciamento de entregas e rastreio</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true) }} title="Criar nova entrega">
          <Plus className="mr-2 h-4 w-4" />
          Nova Entrega
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">{pendentes.length}</p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" /> Pendentes
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{emAndamento.length}</p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Package className="w-3 h-3" /> Em Andamento
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{entreguesHoje.length}</p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Entregues Hoje
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{atrasadas.length}</p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <AlertCircle className="w-3 h-3" /> Atrasadas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, pedido ou token..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
            title="Digite nome do cliente, número do pedido ou token de rastreio"
          />
        </div>
        <Select value={filtroSituacao} onValueChange={setFiltroSituacao}>
          <SelectTrigger className="w-48" title="Filtrar por situação da entrega">
            <SelectValue placeholder="Todas as situações" />
          </SelectTrigger>
          <SelectContent>
            {SITUACAO_OPTIONS.map(s => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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
                  <TableHead>Token</TableHead>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Motorista</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead>Data Prevista</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredList().length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                      Nenhuma entrega encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredList().map((entrega) => (
                    <TableRow key={entrega.id} className="cursor-pointer hover:bg-muted/50" onClick={() => verDetalhes(entrega)}>
                      <TableCell>
                        <span className="font-mono text-xs">{entrega.tokenRastreio?.substring(0, 8)}</span>
                      </TableCell>
                      <TableCell className="font-medium">{entrega.pedidoVenda?.numeroPedido || entrega.pedidoVendaId?.substring(0, 8) || "-"}</TableCell>
                      <TableCell>{entrega.cliente?.nome || entrega.clienteId?.substring(0, 8) || "-"}</TableCell>
                      <TableCell>{entrega.motorista?.nome || "-"}</TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getSituacaoBadge(entrega.situacao)}`}>
                          {getSituacaoLabel(entrega.situacao)}
                        </span>
                      </TableCell>
                      <TableCell>{formatData(entrega.dataPrevisao)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          {entrega.situacao === "PENDENTE" && (
                            <Button variant="ghost" size="sm" title="Agendar entrega" onClick={() => openAgendarDialog(entrega)}>
                              <Calendar className="w-4 h-4 text-blue-600" />
                            </Button>
                          )}
                          {entrega.situacao === "AGENDADO" && (
                            <Button variant="ghost" size="sm" title="Registrar saída para entrega" onClick={() => saiuParaEntrega(entrega.id)}>
                              <Package className="w-4 h-4 text-purple-600" />
                            </Button>
                          )}
                          {entrega.situacao === "SAIU_PARA_ENTREGA" && (
                            <>
                              <Button variant="ghost" size="sm" title="Confirmar entrega" onClick={() => entregue(entrega.id)}>
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Registrar tentativa falha" onClick={() => openFalhaDialog(entrega)}>
                                <XCircle className="w-4 h-4 text-red-600" />
                              </Button>
                            </>
                          )}
                          {entrega.situacao === "TENTATIVA_FALHOU" && (
                            <>
                              <Button variant="ghost" size="sm" title="Reagendar entrega" onClick={() => openAgendarDialog(entrega)}>
                                <Calendar className="w-4 h-4 text-blue-600" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Cancelar entrega" onClick={() => cancelar(entrega.id)}>
                                <XCircle className="w-4 h-4 text-gray-600" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm" title="Visualizar detalhes" onClick={() => verDetalhes(entrega)}>
                            <Search className="w-4 h-4" />
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

      <Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
        <SheetContent side="right" className="w-full max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Detalhes da Entrega
            </SheetTitle>
            <SheetDescription>
              {selectedEntrega && (
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getSituacaoBadge(selectedEntrega.situacao)}`}>
                  {getSituacaoLabel(selectedEntrega.situacao)}
                </span>
              )}
            </SheetDescription>
          </SheetHeader>
          {selectedEntrega && (
            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Token de Rastreio</Label>
                  <p className="font-mono text-sm font-medium">{selectedEntrega.tokenRastreio}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Pedido</Label>
                  <p className="font-medium">{selectedEntrega.pedidoVenda?.numeroPedido || selectedEntrega.pedidoVendaId || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1"><User className="w-3 h-3" /> Cliente</Label>
                  <p className="font-medium">{selectedEntrega.cliente?.nome || selectedEntrega.clienteId || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1"><User className="w-3 h-3" /> Motorista</Label>
                  <p className="font-medium">{selectedEntrega.motorista?.nome || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1"><Truck className="w-3 h-3" /> Veículo</Label>
                  <p className="font-medium">
                    {selectedEntrega.veiculoEntrega
                      ? `${selectedEntrega.veiculoEntrega.placa} - ${selectedEntrega.veiculoEntrega.modelo || ""}`
                      : "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> Data Agendamento</Label>
                  <p className="font-medium">{formatData(selectedEntrega.dataAgendamento)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> Data Saída</Label>
                  <p className="font-medium">{formatData(selectedEntrega.dataSaida)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> Data Entrega</Label>
                  <p className="font-medium">{formatData(selectedEntrega.dataEntrega)}</p>
                </div>
              </div>

              {selectedEntrega.enderecoEntrega && (
                <div className="space-y-1 border-t pt-4">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> Endereço de Entrega</Label>
                  <p className="text-sm whitespace-pre-wrap">{typeof selectedEntrega.enderecoEntrega === "string" ? selectedEntrega.enderecoEntrega : JSON.stringify(selectedEntrega.enderecoEntrega)}</p>
                </div>
              )}

              {selectedEntrega.observacoes && (
                <div className="space-y-1 border-t pt-4">
                  <Label className="text-xs text-muted-foreground">Observações</Label>
                  <p className="text-sm whitespace-pre-wrap">{selectedEntrega.observacoes}</p>
                </div>
              )}

              {selectedEntrega.tentativas && selectedEntrega.tentativas.length > 0 && (
                <div className="border-t pt-4">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                    <AlertCircle className="w-3 h-3" /> Tentativas de Entrega
                  </Label>
                  <div className="space-y-3">
                    {selectedEntrega.tentativas.map((t) => (
                      <div key={t.id} className="rounded-lg border p-3 bg-red-50">
                        <div className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">{formatData(t.dataTentativa)}</p>
                            <p className="text-sm font-medium text-red-700">{t.motivoFalha || "Motivo não informado"}</p>
                            {t.observacoes && <p className="text-xs text-muted-foreground mt-1">{t.observacoes}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                {selectedEntrega.situacao === "PENDENTE" && (
                  <Button className="flex-1" onClick={() => { setDetailSheetOpen(false); openAgendarDialog(selectedEntrega) }}>
                    <Calendar className="w-4 h-4 mr-2" /> Agendar
                  </Button>
                )}
                {selectedEntrega.situacao === "AGENDADO" && (
                  <Button className="flex-1" onClick={() => { setDetailSheetOpen(false); saiuParaEntrega(selectedEntrega.id) }}>
                    <Package className="w-4 h-4 mr-2" /> Saiu para Entrega
                  </Button>
                )}
                {selectedEntrega.situacao === "TENTATIVA_FALHOU" && (
                  <>
                    <Button className="flex-1" onClick={() => { setDetailSheetOpen(false); openAgendarDialog(selectedEntrega) }}>
                      <Calendar className="w-4 h-4 mr-2" /> Reagendar
                    </Button>
                    <Button variant="destructive" className="flex-1" onClick={() => { setDetailSheetOpen(false); cancelar(selectedEntrega.id) }}>
                      <XCircle className="w-4 h-4 mr-2" /> Cancelar
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Plus className="w-5 h-5" /> Nova Entrega</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="pedidoVendaId">Pedido de Venda <span className="text-red-500">*</span></Label>
              <div className="flex gap-2">
                <Input
                  id="pedidoVendaId"
                  value={formData.pedidoVendaId}
                  onChange={(e) => setFormData({ ...formData, pedidoVendaId: e.target.value })}
                  placeholder="ID do pedido de venda"
                  title="Informe o ID do pedido de venda associado"
                  required
                  onFocus={() => { if (!formData.pedidoVendaId) { setPedidoSearchTerm(""); setPedidoSearchOpen(true) } }}
                />
                <Button type="button" variant="outline" onClick={() => { setPedidoSearchTerm(""); setPedidoSearchOpen(true) }} title="Buscar pedidos de venda">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clienteId">Cliente <span className="text-red-500">*</span></Label>
              <Input
                id="clienteId"
                value={formData.clienteId}
                onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                placeholder="ID do cliente"
                title="Informe o ID do cliente"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="enderecoEntrega">Endereço de Entrega</Label>
              <Textarea
                id="enderecoEntrega"
                value={formData.enderecoEntrega}
                onChange={(e) => setFormData({ ...formData, enderecoEntrega: e.target.value })}
                placeholder="Rua, número, bairro, cidade, CEP - endereço completo para entrega"
                title="Endereço completo para realização da entrega"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="motoristaId">Motorista</Label>
                <Select value={formData.motoristaId} onValueChange={(v) => setFormData({ ...formData, motoristaId: v })}>
                  <SelectTrigger id="motoristaId" title="Selecione o motorista responsável">
                    <SelectValue placeholder="Selecione um motorista" />
                  </SelectTrigger>
                  <SelectContent>
                    {motoristas.map((m: any) => (
                      <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="veiculoId">Veículo</Label>
                <Select value={formData.veiculoId} onValueChange={(v) => setFormData({ ...formData, veiculoId: v })}>
                  <SelectTrigger id="veiculoId" title="Selecione o veículo para a entrega">
                    <SelectValue placeholder="Selecione um veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {veiculos.map((v: any) => (
                      <SelectItem key={v.id} value={v.id}>{v.placa} - {v.modelo || v.marca || ""}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dataAgendamento">Data de Agendamento</Label>
                <Input
                  id="dataAgendamento"
                  type="date"
                  value={formData.dataAgendamento}
                  onChange={(e) => setFormData({ ...formData, dataAgendamento: e.target.value })}
                  title="Data agendada para a entrega"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dataPrevisao">Data Prevista</Label>
                <Input
                  id="dataPrevisao"
                  type="date"
                  value={formData.dataPrevisao}
                  onChange={(e) => setFormData({ ...formData, dataPrevisao: e.target.value })}
                  title="Data prevista para conclusão da entrega"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="valorFrete">Valor do Frete (R$)</Label>
              <Input
                id="valorFrete"
                type="number"
                min="0"
                step="0.01"
                value={formData.valorFrete}
                onChange={(e) => setFormData({ ...formData, valorFrete: e.target.value })}
                placeholder="Valor do frete (ex: 15,90)"
                title="Valor cobrado pelo frete em R$"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Instruções especiais para a entrega, contato do cliente, etc."
                title="Observações adicionais sobre a entrega"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm() }}>Cancelar</Button>
            <Button onClick={criarEntrega} disabled={actionLoading}>
              {actionLoading ? "Salvando..." : "Criar Entrega"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={agendarDialogOpen} onOpenChange={setAgendarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Agendar Entrega</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="agendarData">Data de Agendamento <span className="text-red-500">*</span></Label>
              <Input
                id="agendarData"
                type="date"
                value={agendarData.dataAgendamento}
                onChange={(e) => setAgendarData({ ...agendarData, dataAgendamento: e.target.value })}
                placeholder="Selecione a data para agendamento"
                title="Data em que a entrega será realizada"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="agendarMotorista">Motorista</Label>
              <Select value={agendarData.motoristaId} onValueChange={(v) => setAgendarData({ ...agendarData, motoristaId: v })}>
                <SelectTrigger id="agendarMotorista" title="Selecione o motorista para esta entrega">
                  <SelectValue placeholder="Selecione um motorista" />
                </SelectTrigger>
                <SelectContent>
                  {motoristas.map((m: any) => (
                    <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="agendarVeiculo">Veículo</Label>
              <Select value={agendarData.veiculoId} onValueChange={(v) => setAgendarData({ ...agendarData, veiculoId: v })}>
                <SelectTrigger id="agendarVeiculo" title="Selecione o veículo para esta entrega">
                  <SelectValue placeholder="Selecione um veículo" />
                </SelectTrigger>
                <SelectContent>
                  {veiculos.map((v: any) => (
                    <SelectItem key={v.id} value={v.id}>{v.placa} - {v.modelo || v.marca || ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAgendarDialogOpen(false)}>Cancelar</Button>
            <Button onClick={agendarEntrega} disabled={actionLoading}>
              {actionLoading ? "Salvando..." : "Agendar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={falhaDialogOpen} onOpenChange={setFalhaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><XCircle className="w-5 h-5" /> Registrar Tentativa Falha</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="motivoFalha">Motivo da Falha <span className="text-red-500">*</span></Label>
              <Select value={falhaData.motivoFalha} onValueChange={(v) => setFalhaData({ ...falhaData, motivoFalha: v })}>
                <SelectTrigger id="motivoFalha" title="Selecione o motivo da falha na entrega">
                  <SelectValue placeholder="Selecione o motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cliente ausente">Cliente ausente</SelectItem>
                  <SelectItem value="Endereço incorreto">Endereço incorreto</SelectItem>
                  <SelectItem value="Recusado pelo cliente">Recusado pelo cliente</SelectItem>
                  <SelectItem value="Problemas no veículo">Problemas no veículo</SelectItem>
                  <SelectItem value="Área de risco">Área de risco</SelectItem>
                  <SelectItem value="Tempo insuficiente">Tempo insuficiente</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="obsFalha">Observações</Label>
              <Textarea
                id="obsFalha"
                value={falhaData.observacoes}
                onChange={(e) => setFalhaData({ ...falhaData, observacoes: e.target.value })}
                placeholder="Detalhes adicionais sobre a falha na entrega"
                title="Informações complementares sobre o ocorrido"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFalhaDialogOpen(false)}>Cancelar</Button>
            <Button onClick={tentativaFalhou} disabled={actionLoading} variant="destructive">
              {actionLoading ? "Salvando..." : "Registrar Falha"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={pedidoSearchOpen} onOpenChange={setPedidoSearchOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> Selecionar Pedido de Venda</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pedido por número ou nome do cliente..."
                value={pedidoSearchTerm}
                onChange={(e) => setPedidoSearchTerm(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') loadPedidos() }}
                className="pl-10"
                title="Digite o número do pedido ou nome do cliente"
              />
            </div>
            <div className="max-h-80 overflow-y-auto border rounded-lg">
              {pedidosLoading ? (
                <div className="text-center py-8 text-muted-foreground">Carregando pedidos...</div>
              ) : pedidosList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {pedidoSearchTerm ? "Nenhum pedido encontrado" : "Clique em buscar para listar pedidos"}
                </div>
              ) : (
                <div className="divide-y">
                  {pedidosList.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selectPedido(p)}
                      className="w-full text-left px-4 py-3 hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">#{p.numeroPedido}</span>
                        <span className="text-sm text-muted-foreground">{new Date(p.dataEmissao).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm">{p.cliente?.nome || "Cliente não informado"}</span>
                        <span className="text-sm font-semibold text-primary">R$ {(p.valorTotal || 0).toFixed(2)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button onClick={() => { setPedidoSearchTerm(""); loadPedidos() }} variant="outline" className="w-full">
              <Search className="w-4 h-4 mr-2" /> Buscar Pedidos
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EntregasPage
