import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { LookupField } from "@/components/lookup/LookupField"
import { ShoppingCart, Search, Plus, Check, X, Send, Eye, FileText, CreditCard, Package, Trash2, Grid3X3 } from "lucide-react"
import { pedidosService, PedidoVenda } from "@/services/pedidos"
import { api } from "@/services/api"
import toast from "react-hot-toast"

const SITUACOES_FRONTEND = [
  { value: "", label: "Todos" },
  { value: "PENDENTE", label: "Pendente" },
  { value: "APROVADO", label: "Aprovado" },
  { value: "EM_PROCESSAMENTO", label: "Em Processamento" },
  { value: "ENVIADO", label: "Enviado" },
  { value: "ENTREGUE", label: "Entregue" },
  { value: "CANCELADO", label: "Cancelado" },
]

const STATUS_MAP: Record<string, string> = {
  "": "",
  "PENDENTE": "EM_ABERTO",
  "APROVADO": "CONFIRMADO",
  "EM_PROCESSAMENTO": "EM_PRODUCAO",
  "ENVIADO": "ENVIADO",
  "ENTREGUE": "ENTREGUE",
  "CANCELADO": "CANCELADO",
}

const CONDICOES_PAGAMENTO = [
  { value: "A_VISTA", label: "À Vista" },
  { value: "A_PRAZO", label: "A Prazo" },
  { value: "PARCELADO", label: "Parcelado" },
]

interface ItemPedido {
  produtoId: string
  produtoNome: string
  quantidade: number
  unidadeMedida: string
  valorUnitario: number
  valorDesconto: number
}

export function OrdersPage() {
  const [pedidos, setPedidos] = useState<PedidoVenda[]>([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedPedido, setSelectedPedido] = useState<any>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("")
  const [filiais, setFiliais] = useState<any[]>([])

  const [itens, setItens] = useState<ItemPedido[]>([])
  const [formData, setFormData] = useState({
    filialId: "",
    clienteId: "",
    clienteNome: "",
    vendedorId: "",
    vendedorNome: "",
    transportadoraId: "",
    transportadoraNome: "",
    dataEntrega: "",
    condicaoPagamento: "A_VISTA",
    quantidadeParcelas: 1,
    intervaloParcelas: 30,
    primeiraParcelaDias: 0,
    valorFrete: 0,
    valorDesconto: 0,
    valorOutrosAcrescimos: 0,
    observacoes: "",
    observacoesInternas: "",
  })

  const [productSheetOpen, setProductSheetOpen] = useState(false)
  const [sheetSearch, setSheetSearch] = useState("")
  const [sheetProdutos, setSheetProdutos] = useState<any[]>([])
  const [sheetLoading, setSheetLoading] = useState(false)

  useEffect(() => {
    loadFiliais()
  }, [])

  useEffect(() => {
    loadPedidos()
  }, [busca, filtroStatus])

  async function loadFiliais() {
    try {
      const res = await api.get("/empresas")
      const data = res.data?.dados || res.data?.data || res.data || []
      if (Array.isArray(data)) {
        const todas = data.flatMap((e: any) => e.filiais || [])
        setFiliais(todas)
      }
    } catch {
      console.error("Erro ao carregar filiais")
    }
  }

  async function loadPedidos() {
    setLoading(true)
    try {
      const backendSituacao = STATUS_MAP[filtroStatus] || undefined
      const pedidos = await pedidosService.listar({ situacao: backendSituacao })
      setPedidos(pedidos || [])
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
    } finally {
      setLoading(false)
    }
  }

  async function verDetalhes(pedido: PedidoVenda) {
    setDetailLoading(true)
    setDetailDialogOpen(true)
    try {
      const result = await pedidosService.buscarPorId(pedido.id)
      setSelectedPedido(result?.data || result)
    } catch {
      setSelectedPedido(pedido)
    } finally {
      setDetailLoading(false)
    }
  }

  function formatValor(v: number) {
    return `R$ ${(v || 0).toFixed(2)}`
  }

  function getCondicaoLabel(c: string) {
    const map: Record<string, string> = { A_VISTA: "À Vista", A_PRAZO: "A Prazo", PARCELADO: "Parcelado" }
    return map[c] || c
  }

  function calcTotals() {
    const subtotal = itens.reduce((sum, item) => {
      const totalItem = item.quantidade * item.valorUnitario
      return sum + totalItem - (item.valorDesconto || 0)
    }, 0)
    const frete = formData.valorFrete || 0
    const desconto = formData.valorDesconto || 0
    const acrescimos = formData.valorOutrosAcrescimos || 0
    const total = subtotal + frete + acrescimos - desconto
    return { subtotal, frete, desconto, acrescimos, total }
  }

  function addItem() {
    setItens([...itens, { produtoId: "", produtoNome: "", quantidade: 1, unidadeMedida: "UN", valorUnitario: 0, valorDesconto: 0 }])
  }

  function updateItem(index: number, field: string, value: any) {
    const newItens = [...itens]
    ;(newItens[index] as any)[field] = value
    setItens(newItens)
  }

  function removeItem(index: number) {
    setItens(itens.filter((_, i) => i !== index))
  }

  async function loadSheetProdutos() {
    setSheetLoading(true)
    try {
      const params = new URLSearchParams()
      if (sheetSearch) params.append("nome", sheetSearch)
      params.append("limite", "50")
      const res = await api.get(`/produtos?${params}`)
      const data = res.data?.dados || res.data?.data || res.data || []
      setSheetProdutos(Array.isArray(data) ? data : [])
    } catch {
      toast.error("Erro ao carregar produtos")
    } finally {
      setSheetLoading(false)
    }
  }

  useEffect(() => {
    if (productSheetOpen) loadSheetProdutos()
  }, [productSheetOpen])

  function addSheetItem(produto: any) {
    setItens([...itens, {
      produtoId: produto.id,
      produtoNome: produto.nome,
      quantidade: 1,
      unidadeMedida: "UN",
      valorUnitario: produto.precoVenda || 0,
      valorDesconto: 0,
    }])
    toast.success(`${produto.nome} adicionado`)
  }

  function resetForm() {
    setFormData({
      filialId: "",
      clienteId: "",
      clienteNome: "",
      vendedorId: "",
      vendedorNome: "",
      transportadoraId: "",
      transportadoraNome: "",
      dataEntrega: "",
      condicaoPagamento: "A_VISTA",
      quantidadeParcelas: 1,
      intervaloParcelas: 30,
      primeiraParcelaDias: 0,
      valorFrete: 0,
      valorDesconto: 0,
      valorOutrosAcrescimos: 0,
      observacoes: "",
      observacoesInternas: "",
    })
    setItens([])
  }

  async function criarPedido() {
    if (!formData.filialId) {
      toast.error("Selecione uma filial")
      return
    }
    if (!formData.clienteId) {
      toast.error("Selecione um cliente")
      return
    }
    if (itens.length === 0) {
      toast.error("Adicione pelo menos um item ao pedido")
      return
    }
    const itemCompleto = itens.every(i => i.produtoId && i.quantidade > 0 && i.valorUnitario > 0)
    if (!itemCompleto) {
      toast.error("Preencha produto, quantidade e valor unitário de todos os itens")
      return
    }
    try {
      const { subtotal } = calcTotals()
      await pedidosService.criar({
        filialId: formData.filialId,
        clienteId: formData.clienteId,
        vendedorId: formData.vendedorId || undefined,
        transportadoraId: formData.transportadoraId || undefined,
        dataEntrega: formData.dataEntrega || undefined,
        condicaoPagamento: formData.condicaoPagamento,
        quantidadeParcelas: formData.condicaoPagamento !== "A_VISTA" ? formData.quantidadeParcelas : 1,
        intervaloParcelas: formData.condicaoPagamento !== "A_VISTA" ? formData.intervaloParcelas : 30,
        primeiraParcelaDias: formData.condicaoPagamento !== "A_VISTA" ? formData.primeiraParcelaDias : 0,
        valorSubtotal: subtotal,
        valorDesconto: formData.valorDesconto,
        valorFrete: formData.valorFrete,
        valorOutrosAcrescimos: formData.valorOutrosAcrescimos,
        observacoes: formData.observacoes || undefined,
        observacoesInternas: formData.observacoesInternas || undefined,
        itens: itens.map((item, idx) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          unidadeMedida: item.unidadeMedida,
          valorUnitario: item.valorUnitario,
          valorDesconto: item.valorDesconto,
          numeroItem: idx + 1,
        })),
      })
      setDialogOpen(false)
      resetForm()
      loadPedidos()
      toast.success("Pedido criado com sucesso")
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || error?.response?.data?.error || "Erro ao criar pedido")
    }
  }

  async function aprovar(id: string) {
    try {
      await pedidosService.aprovar(id)
      loadPedidos()
      toast.success("Pedido aprovado")
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || error.message || "Erro ao aprovar")
    }
  }

  async function cancelar(id: string) {
    try {
      await pedidosService.cancelar(id)
      loadPedidos()
      toast.success("Pedido cancelado")
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || error.message || "Erro ao cancelar")
    }
  }

  async function enviar(id: string) {
    try {
      await pedidosService.enviar(id)
      loadPedidos()
      toast.success("Pedido enviado")
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || error.message || "Erro ao enviar")
    }
  }

  const situacaoLabel: Record<string, string> = {
    EM_ABERTO: "PENDENTE",
    CONFIRMADO: "APROVADO",
    EM_PRODUCAO: "EM_PROCESSAMENTO",
    ENVIADO: "ENVIADO",
    ENTREGUE: "ENTREGUE",
    CANCELADO: "CANCELADO",
  }

  function getSituacaoBadge(situacao: string) {
    const reverseMap: Record<string, string> = {
      EM_ABERTO: "bg-yellow-100 text-yellow-800",
      CONFIRMADO: "bg-blue-100 text-blue-800",
      EM_PRODUCAO: "bg-indigo-100 text-indigo-800",
      ENVIADO: "bg-purple-100 text-purple-800",
      ENTREGUE: "bg-green-100 text-green-800",
      CANCELADO: "bg-red-100 text-red-800",
    }
    return reverseMap[situacao] || "bg-gray-100 text-gray-800"
  }

  function getSituacao(s: string) {
    return situacaoLabel[s] || s
  }

  const totals = calcTotals()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Pedidos
          </h1>
          <p className="text-muted-foreground">Gerencie pedidos de vendas</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true) }}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Pedido
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {pedidos.filter(p => p.situacao === "PENDENTE").length}
              </p>
              <p className="text-sm text-muted-foreground">Pendentes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {pedidos.filter(p => p.situacao === "APROVADO").length}
              </p>
              <p className="text-sm text-muted-foreground">Aprovados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {pedidos.filter(p => p.situacao === "ENTREGUE").length}
              </p>
              <p className="text-sm text-muted-foreground">Entregues</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-muted-foreground">
                {pedidos.length}
              </p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pedidos por número, cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
            title="Digite o número do pedido ou nome do cliente para buscar"
          />
        </div>
        <select
          className="border rounded-lg px-3 py-2 bg-background"
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
        >
          {SITUACOES_FRONTEND.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : pedidos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Nenhum pedido encontrado
                  </TableCell>
                </TableRow>
              ) : (
                pedidos.map((pedido) => (
                  <TableRow key={pedido.id} className="cursor-pointer hover:bg-muted/50" onClick={() => verDetalhes(pedido)}>
                    <TableCell className="font-medium">{pedido.numeroPedido}</TableCell>
                    <TableCell>{(pedido as any).cliente?.nome || "-"}</TableCell>
                    <TableCell>{pedido.dataEmissao ? new Date(pedido.dataEmissao).toLocaleDateString("pt-BR") : "-"}</TableCell>
                    <TableCell className="text-right">R$ {pedido.valorTotal.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSituacaoBadge(pedido.situacao)}`}>
                        {getSituacao(pedido.situacao)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="sm" title="Visualizar detalhes" onClick={(e) => { e.stopPropagation(); verDetalhes(pedido) }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {(pedido.situacao as string) === "EM_ABERTO" && (
                          <>
                            <Button variant="ghost" size="sm" title="Aprovar pedido" onClick={(e) => { e.stopPropagation(); aprovar(pedido.id) }}>
                              <Check className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Cancelar pedido" onClick={(e) => { e.stopPropagation(); cancelar(pedido.id) }}>
                              <X className="w-4 h-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        {(pedido.situacao as string) === "CONFIRMADO" && (
                          <Button variant="ghost" size="sm" title="Enviar pedido" onClick={(e) => { e.stopPropagation(); enviar(pedido.id) }}>
                            <Send className="w-4 h-4 text-blue-600" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Pedido #{selectedPedido?.numeroPedido || ""}
              {selectedPedido?.situacao && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSituacaoBadge(selectedPedido.situacao)}`}>
                  {selectedPedido.situacao}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {detailLoading ? (
            <div className="text-center py-12 text-muted-foreground">Carregando detalhes...</div>
          ) : selectedPedido ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Cliente</Label>
                  <p className="font-medium">{selectedPedido.cliente?.nome || selectedPedido.clienteId || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Filial</Label>
                  <p className="font-medium">{selectedPedido.filial?.nomeFantasia || selectedPedido.filial?.razaoSocial || selectedPedido.filial?.nome || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Data de Emissão</Label>
                  <p className="font-medium">{selectedPedido.dataEmissao ? new Date(selectedPedido.dataEmissao).toLocaleDateString("pt-BR") : "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Condição de Pagamento</Label>
                  <p className="font-medium">{getCondicaoLabel(selectedPedido.condicaoPagamento)}</p>
                </div>
                {selectedPedido.dataEntrega && (
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Data de Entrega</Label>
                    <p className="font-medium">{new Date(selectedPedido.dataEntrega).toLocaleDateString("pt-BR")}</p>
                  </div>
                )}
                {selectedPedido.vendedorId && (
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Vendedor</Label>
                    <p className="font-medium">{selectedPedido.vendedor?.nome || selectedPedido.vendedorId}</p>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Itens do Pedido
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead className="text-right">Qtd</TableHead>
                      <TableHead className="text-right">Valor Unit.</TableHead>
                      <TableHead className="text-right">Desconto</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPedido.itens?.length > 0 ? selectedPedido.itens.map((item: any, i: number) => (
                      <TableRow key={item.id || i}>
                        <TableCell>{item.produto?.nome || item.produtoId}</TableCell>
                        <TableCell className="text-right">{item.quantidade}</TableCell>
                        <TableCell className="text-right">{formatValor(item.valorUnitario)}</TableCell>
                        <TableCell className="text-right">{formatValor(item.valorDesconto)}</TableCell>
                        <TableCell className="text-right font-medium">{formatValor(item.valorTotal)}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-4">Nenhum item</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="border-t pt-4 space-y-1 text-right">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatValor(selectedPedido.valorSubtotal ?? selectedPedido.valorTotal)}</span>
                </div>
                {selectedPedido.valorDesconto > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Desconto</span>
                    <span>-{formatValor(selectedPedido.valorDesconto)}</span>
                  </div>
                )}
                {selectedPedido.valorFrete > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Frete</span>
                    <span>{formatValor(selectedPedido.valorFrete)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>{formatValor(selectedPedido.valorTotal)}</span>
                </div>
              </div>

              {selectedPedido.contasReceber?.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Parcelas / Contas a Receber
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parcela</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedPedido.contasReceber.map((cr: any) => (
                        <TableRow key={cr.id}>
                          <TableCell>{cr.numeroParcela}/{cr.totalParcelas}</TableCell>
                          <TableCell>{cr.dataVencimento ? new Date(cr.dataVencimento).toLocaleDateString("pt-BR") : "-"}</TableCell>
                          <TableCell className="text-right">{formatValor(cr.valorOriginal)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cr.situacao === "PAGO" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                              {cr.situacao === "PAGO" ? "Pago" : "Pendente"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {selectedPedido.observacoes && (
                <div className="border-t pt-4">
                  <Label className="text-muted-foreground text-xs">Observações</Label>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{selectedPedido.observacoes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">Pedido não encontrado</div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Novo Pedido de Venda
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="filial">Filial <span className="text-red-500">*</span></Label>
                <Select value={formData.filialId} onValueChange={(v) => setFormData({ ...formData, filialId: v })}>
                  <SelectTrigger id="filial">
                    <SelectValue placeholder="Selecione a filial de atendimento" />
                  </SelectTrigger>
                  <SelectContent>
                    {filiais.length === 0 && <SelectItem value="" disabled>Carregando...</SelectItem>}
                    {filiais.map((f: any) => (
                      <SelectItem key={f.id} value={f.id}>{f.nomeFantasia || f.razaoSocial}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dataEntrega">Data de Entrega</Label>
                <Input
                  id="dataEntrega"
                  type="date"
                  value={formData.dataEntrega}
                  onChange={(e) => setFormData({ ...formData, dataEntrega: e.target.value })}
                  title="Data prevista para entrega do pedido"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Cliente <span className="text-red-500">*</span></Label>
              <LookupField
                source="clientes"
                value={formData.clienteId}
                selectedLabel={formData.clienteNome}
                onChange={(item) => setFormData({ ...formData, clienteId: item.id, clienteNome: item.nome || item.razaoSocial })}
                onClear={() => setFormData({ ...formData, clienteId: "", clienteNome: "" })}
                placeholder="Buscar cliente por nome, CPF ou CNPJ..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Vendedor</Label>
                <LookupField
                  source="vendedores"
                  value={formData.vendedorId}
                  selectedLabel={formData.vendedorNome}
                  onChange={(item) => setFormData({ ...formData, vendedorId: item.id, vendedorNome: item.nome })}
                  onClear={() => setFormData({ ...formData, vendedorId: "", vendedorNome: "" })}
                  placeholder="Buscar vendedor por nome..."
                />
              </div>
              <div className="grid gap-2">
                <Label>Transportadora</Label>
                <LookupField
                  source="transportadoras"
                  value={formData.transportadoraId}
                  selectedLabel={formData.transportadoraNome}
                  onChange={(item) => setFormData({ ...formData, transportadoraId: item.id, transportadoraNome: item.nome })}
                  onClear={() => setFormData({ ...formData, transportadoraId: "", transportadoraNome: "" })}
                  placeholder="Buscar transportadora por nome ou CNPJ..."
                />
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Itens do Pedido <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setProductSheetOpen(true)}>
                    <Grid3X3 className="w-4 h-4 mr-1" />
                    Buscar Produtos
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar Item
                  </Button>
                </div>
              </div>

              {itens.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum item adicionado. Clique em "Buscar Produtos" ou "Adicionar Item" para começar.
                </p>
              ) : (
                <div className="space-y-2">
                  {itens.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start p-2 rounded-lg border bg-muted/30">
                      <div className="flex-1 min-w-0">
                        <LookupField
                          source="produtos"
                          value={item.produtoId}
                          selectedLabel={item.produtoNome}
                          onChange={(p) => { updateItem(index, "produtoId", p.id); updateItem(index, "produtoNome", p.nome); updateItem(index, "valorUnitario", p.precoVenda || 0) }}
                          onClear={() => { updateItem(index, "produtoId", ""); updateItem(index, "produtoNome", "") }}
                          placeholder="Buscar produto por nome, código ou código de barras..."
                        />
                      </div>
                      <div className="w-20 shrink-0">
                        <Label className="text-xs text-muted-foreground">Qtd</Label>
                        <Input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={item.quantidade}
                          onChange={(e) => updateItem(index, "quantidade", parseFloat(e.target.value) || 0)}
                          placeholder="Qtd"
                          title="Quantidade de unidades do produto"
                        />
                      </div>
                      <div className="w-24 shrink-0">
                        <Label className="text-xs text-muted-foreground">R$ Unit.</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.valorUnitario}
                          onChange={(e) => updateItem(index, "valorUnitario", parseFloat(e.target.value) || 0)}
                          placeholder="0,00"
                          title="Valor unitário do produto em R$"
                        />
                      </div>
                      <div className="w-20 shrink-0">
                        <Label className="text-xs text-muted-foreground">R$ Desc.</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.valorDesconto}
                          onChange={(e) => updateItem(index, "valorDesconto", parseFloat(e.target.value) || 0)}
                          placeholder="0,00"
                          title="Desconto por item em R$ (opcional)"
                        />
                      </div>
                      <div className="w-24 shrink-0 pt-5 text-right">
                        <p className="text-sm font-medium">R$ {(item.quantidade * item.valorUnitario - (item.valorDesconto || 0)).toFixed(2)}</p>
                      </div>
                      <Button type="button" variant="ghost" size="icon" className="mt-4 shrink-0" onClick={() => removeItem(index)} title="Remover item">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Condição de Pagamento
              </Label>
              <Select value={formData.condicaoPagamento} onValueChange={(v) => setFormData({ ...formData, condicaoPagamento: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONDICOES_PAGAMENTO.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {formData.condicaoPagamento !== "A_VISTA" && (
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="grid gap-2">
                    <Label htmlFor="qtdParcelas">Quantidade de Parcelas</Label>
                    <Input
                      id="qtdParcelas"
                      type="number"
                      min="1"
                      value={formData.quantidadeParcelas}
                      onChange={(e) => setFormData({ ...formData, quantidadeParcelas: parseInt(e.target.value) || 1 })}
                      placeholder="Número de parcelas (ex: 6)"
                      title="Quantidade de parcelas para pagamento"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="intervalo">Intervalo entre Parcelas (dias)</Label>
                    <Input
                      id="intervalo"
                      type="number"
                      min="1"
                      value={formData.intervaloParcelas}
                      onChange={(e) => setFormData({ ...formData, intervaloParcelas: parseInt(e.target.value) || 30 })}
                      placeholder="Dias entre parcelas (ex: 30)"
                      title="Intervalo em dias entre cada parcela"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="primeiraParcela">Dias para 1ª Parcela</Label>
                    <Input
                      id="primeiraParcela"
                      type="number"
                      min="0"
                      value={formData.primeiraParcelaDias}
                      onChange={(e) => setFormData({ ...formData, primeiraParcelaDias: parseInt(e.target.value) || 0 })}
                      placeholder="Dias para primeira parcela (ex: 30)"
                      title="Quantidade de dias até o vencimento da primeira parcela"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <Label className="text-base font-semibold">Valores</Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="frete">Valor Frete (R$)</Label>
                  <Input
                    id="frete"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.valorFrete}
                    onChange={(e) => setFormData({ ...formData, valorFrete: parseFloat(e.target.value) || 0 })}
                    placeholder="Valor do frete (ex: 25,90)"
                    title="Valor do frete em R$"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="desconto">Desconto (R$)</Label>
                  <Input
                    id="desconto"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.valorDesconto}
                    onChange={(e) => setFormData({ ...formData, valorDesconto: parseFloat(e.target.value) || 0 })}
                    placeholder="Desconto total em R$ (opcional)"
                    title="Valor do desconto global em R$"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="acrescimos">Outros Acréscimos (R$)</Label>
                  <Input
                    id="acrescimos"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.valorOutrosAcrescimos}
                    onChange={(e) => setFormData({ ...formData, valorOutrosAcrescimos: parseFloat(e.target.value) || 0 })}
                    placeholder="Outros acréscimos (ex: 10,00)"
                    title="Outros acréscimos em R$ (opcional)"
                  />
                </div>
              </div>

              <div className="border-t pt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatValor(totals.subtotal)}</span>
                </div>
                {totals.desconto > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Desconto</span>
                    <span>-{formatValor(totals.desconto)}</span>
                  </div>
                )}
                {totals.frete > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Frete</span>
                    <span>{formatValor(totals.frete)}</span>
                  </div>
                )}
                {totals.acrescimos > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Acréscimos</span>
                    <span>{formatValor(totals.acrescimos)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base border-t pt-1">
                  <span>Total</span>
                  <span>{formatValor(totals.total)}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="obs">Observações</Label>
              <textarea
                id="obs"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Informações adicionais sobre o pedido (condições especiais, instruções de entrega, contato do cliente, etc.)"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                title="Observações gerais do pedido. Use para anotações, instruções especiais ou detalhes da negociação."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="obsInternas">Observações Internas</Label>
              <textarea
                id="obsInternas"
                value={formData.observacoesInternas}
                onChange={(e) => setFormData({ ...formData, observacoesInternas: e.target.value })}
                placeholder="Anotações internas (não visíveis para o cliente, ex: observações do vendedor, margem de negociação, etc.)"
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                title="Observações internas visíveis apenas para a equipe interna"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm() }}>Cancelar</Button>
            <Button onClick={criarPedido}>Criar Pedido</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={productSheetOpen} onOpenChange={setProductSheetOpen}>
        <SheetContent side="right" className="w-full max-w-2xl p-0 flex flex-col">
          <SheetHeader className="px-4 pt-4 pb-2 border-b">
            <SheetTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Buscar Produtos
            </SheetTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produto por nome, código ou código de barras..."
                value={sheetSearch}
                onChange={(e) => setSheetSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") loadSheetProdutos() }}
                className="pl-10"
                title="Digite o nome, código interno ou código de barras do produto"
              />
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4">
            {sheetLoading ? (
              <div className="text-center py-12 text-muted-foreground">Carregando produtos...</div>
            ) : sheetProdutos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {sheetSearch ? "Nenhum produto encontrado" : "Digite um termo para buscar produtos"}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sheetProdutos.map((p: any) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => addSheetItem(p)}
                    className="text-left p-4 rounded-lg border hover:bg-accent hover:border-primary transition-all"
                  >
                    <p className="font-medium truncate">{p.nome}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-lg font-bold text-primary">R$ {(p.precoVenda || 0).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Estoque: {p.quantidadeEstoque ?? "—"}</p>
                    </div>
                    {p.codigoBarras && (
                      <p className="text-xs text-muted-foreground mt-1">Cód. Barras: {p.codigoBarras}</p>
                    )}
                    {p.ncm && (
                      <p className="text-xs text-muted-foreground">NCM: {p.ncm}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default OrdersPage
