import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Search, Plus, Check, X, Send, Eye, FileText, CreditCard, Package } from "lucide-react"
import { pedidosService, PedidoVenda } from "@/services/pedidos"
import { empresasService, Filial } from "@/services/estoque"
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

export function OrdersPage() {
  const [pedidos, setPedidos] = useState<PedidoVenda[]>([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedPedido, setSelectedPedido] = useState<any>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("")
  const [filiais, setFiliais] = useState<Filial[]>([])
  const [formData, setFormData] = useState({
    filialId: "",
    clienteId: "",
    produtoId: "",
    quantidade: "1",
    valorUnitario: "",
    observacoes: "",
    condicaoPagamento: "A_VISTA",
  })

  useEffect(() => {
    loadFiliais()
  }, [])

  useEffect(() => {
    loadPedidos()
  }, [busca, filtroStatus])

  async function loadFiliais() {
    try {
      const data = await empresasService.listar()
      if (Array.isArray(data)) {
        const todas = data.flatMap(e => (e as any).filiais || [])
        setFiliais(todas)
      } else if ((data as any)?.dados) {
        const todas = (data as any).dados.flatMap((e: any) => e.filiais || [])
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
      const pedidos = await pedidosService.listar({
        situacao: backendSituacao,
      })
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

  async function criarPedido() {
    if (!formData.filialId) {
      toast.error("Selecione uma filial")
      return
    }
    if (!formData.clienteId) {
      toast.error("Informe o ID do cliente")
      return
    }
    if (!formData.produtoId) {
      toast.error("Informe o ID do produto")
      return
    }
    try {
      await pedidosService.criar({
        filialId: formData.filialId,
        clienteId: formData.clienteId,
        condicaoPagamento: formData.condicaoPagamento,
        observacoes: formData.observacoes,
        itens: [
          {
            produtoId: formData.produtoId,
            quantidade: Number(formData.quantidade) || 1,
            unidadeMedida: "UN",
            valorUnitario: Number(formData.valorUnitario) || 0,
          },
        ],
      })
      setDialogOpen(false)
      setFormData({
        filialId: "",
        clienteId: "",
        produtoId: "",
        quantidade: "1",
        valorUnitario: "",
        observacoes: "",
        condicaoPagamento: "A_VISTA",
      })
      loadPedidos()
      toast.success("Pedido criado com sucesso")
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Erro ao criar pedido")
    }
  }

  async function aprovar(id: string) {
    try {
      await pedidosService.aprovar(id)
      loadPedidos()
      toast.success("Pedido aprovado")
    } catch (error) {
      console.error("Erro ao aprovar:", error)
    }
  }

  async function cancelar(id: string) {
    try {
      await pedidosService.cancelar(id)
      loadPedidos()
      toast.success("Pedido cancelado")
    } catch (error) {
      console.error("Erro ao cancelar:", error)
    }
  }

  async function enviar(id: string) {
    try {
      await pedidosService.enviar(id)
      loadPedidos()
      toast.success("Pedido enviado")
    } catch (error) {
      console.error("Erro ao enviar:", error)
    }
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
        <Button onClick={() => setDialogOpen(true)}>
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
            placeholder="Buscar pedidos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
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
                        {pedido.situacao}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="sm" title="Visualizar detalhes" onClick={(e) => { e.stopPropagation(); verDetalhes(pedido) }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {pedido.situacao === "PENDENTE" && (
                          <>
                            <Button variant="ghost" size="sm" title="Aprovar pedido" onClick={() => aprovar(pedido.id)}>
                              <Check className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Cancelar pedido" onClick={() => cancelar(pedido.id)}>
                              <X className="w-4 h-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        {pedido.situacao === "APROVADO" && (
                          <Button variant="ghost" size="sm" title="Enviar pedido" onClick={() => enviar(pedido.id)}>
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
                  <p className="text-sm mt-1">{selectedPedido.observacoes}</p>
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Novo Pedido</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="filial">Filial</Label>
              <Select value={formData.filialId} onValueChange={(v) => setFormData({ ...formData, filialId: v })}>
                <SelectTrigger id="filial">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {filiais.map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.nomeFantasia || f.razaoSocial}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cliente">Cliente ID</Label>
              <Input
                id="cliente"
                value={formData.clienteId}
                onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                placeholder="ID do cliente"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="produto">Produto ID</Label>
              <Input
                id="produto"
                value={formData.produtoId}
                onChange={(e) => setFormData({ ...formData, produtoId: e.target.value })}
                placeholder="ID do produto"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="1"
                  value={formData.quantidade}
                  onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                  placeholder="Quantidade de unidades"
                  title="Informe a quantidade do produto"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="valor">Valor Unitário (R$)</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={formData.valorUnitario}
                  onChange={(e) => setFormData({ ...formData, valorUnitario: e.target.value })}
                  placeholder="0,00"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pagamento">Condição de Pagamento</Label>
              <Select value={formData.condicaoPagamento} onValueChange={(v) => setFormData({ ...formData, condicaoPagamento: v })}>
                <SelectTrigger id="pagamento">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONDICOES_PAGAMENTO.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="obs">Observações</Label>
              <Input
                id="obs"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Observações do pedido"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={criarPedido}>Criar Pedido</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OrdersPage
