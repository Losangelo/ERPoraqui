import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Search, Plus, Check, X, Send } from "lucide-react"
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
                  <TableRow key={pedido.id}>
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
                        {pedido.situacao === "PENDENTE" && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => aprovar(pedido.id)}>
                              <Check className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => cancelar(pedido.id)}>
                              <X className="w-4 h-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        {pedido.situacao === "APROVADO" && (
                          <Button variant="ghost" size="sm" onClick={() => enviar(pedido.id)}>
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
