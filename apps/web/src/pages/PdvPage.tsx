import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { pdvService, type VendaPDV, type Caixa, type ProdutoPDV } from "@/services/pdv"
import { clientesService } from "@/services/clientes"
import { empresasService, type Filial } from "@/services/estoque"
import { useAuth } from "@/stores/AuthContext"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Search, ShoppingBasket, DollarSign, ShoppingCart, Plus, Minus, Trash2, Barcode, User, Package, ChevronLeft, ChevronRight } from "lucide-react"
import toast from "react-hot-toast"

interface ItemCarrinho {
  produtoId: string
  codigoBarras?: string
  descricao: string
  quantidade: number
  valorUnitario: number
  valorTotal: number
}

interface ClienteResumo {
  id: string
  nome: string
}

export function PdvPage() {
  const { user } = useAuth()
  const [vendas, setVendas] = useState<VendaPDV[]>([])
  const [caixaAberto, setCaixaAberto] = useState<Caixa | null>(null)
  const [loading, setLoading] = useState(false)
  const [buscaVenda, setBuscaVenda] = useState("")
  const [caixaDialogOpen, setCaixaDialogOpen] = useState(false)
  const [vendaDialogOpen, setVendaDialogOpen] = useState(false)
  const [saldoInicial, setSaldoInicial] = useState("")
  const [filialId, setFilialId] = useState("")
  const [filiais, setFiliais] = useState<Filial[]>([])

  const [vendaAtual, setVendaAtual] = useState<VendaPDV | null>(null)
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([])
  const [produtosBusca, setProdutosBusca] = useState<ProdutoPDV[]>([])
  const [buscaProduto, setBuscaProduto] = useState("")
  const [codigoBarras, setCodigoBarras] = useState("")
  const [mostrarProdutos, setMostrarProdutos] = useState(false)
  const [selecionandoCliente, setSelecionandoCliente] = useState(false)
  const [clientesBusca, setClientesBusca] = useState("")
  const [clientesLista, setClientesLista] = useState<ClienteResumo[]>([])
  const [clienteSelecionado, setClienteSelecionado] = useState<ClienteResumo | null>(null)
  const [confirmarVendaOpen, setConfirmarVendaOpen] = useState(false)
  const [formaPagamento, setFormaPagamento] = useState("DINHEIRO")
  const [valorPago, setValorPago] = useState("")
  const [finalizando, setFinalizando] = useState(false)
  const [vendaFinalizada, setVendaFinalizada] = useState<VendaPDV | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedProdIndex, setSelectedProdIndex] = useState(0)
  const [produtosSheetOpen, setProdutosSheetOpen] = useState(false)
  const [sheetProdutos, setSheetProdutos] = useState<ProdutoPDV[]>([])
  const [sheetSearchTerm, setSheetSearchTerm] = useState("")
  const [sheetPage, setSheetPage] = useState(1)
  const [sheetTotalPages, setSheetTotalPages] = useState(1)
  const [sheetLoading, setSheetLoading] = useState(false)
  const barcodeRef = useRef<HTMLInputElement>(null)
  const buscaRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const clientTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const sheetSearchTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const totalCarrinho = carrinho.reduce((acc, item) => acc + item.valorTotal, 0)

  const carregarFiliais = useCallback(async () => {
    try {
      const data = await empresasService.listar()
      const lista = Array.isArray(data) ? data : (data as any)?.dados || []
      const todas = lista.flatMap((e: any) => e.filiais || [])
      setFiliais(todas)
    } catch { console.error("Erro ao carregar filiais") }
  }, [])

  const carregarDados = useCallback(async () => {
    setLoading(true)
    try {
      const [vendasRes, caixaRes] = await Promise.all([
        pdvService.listarVendas({ situacao: "FINALIZADA" }),
        pdvService.buscarCaixaAberto(""),
      ])
      setVendas(Array.isArray(vendasRes) ? vendasRes : [])
      if (caixaRes?.data) {
        setCaixaAberto(caixaRes.data)
        if (caixaRes.data.filialId) setFilialId(caixaRes.data.filialId)
      }
    } catch { console.error("Erro ao carregar dados") }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { carregarFiliais(); carregarDados() }, [carregarFiliais, carregarDados])

  async function handleAbrirCaixa() {
    if (!filialId) { toast.error("Selecione uma filial"); return }
    if (!user?.id) { toast.error("Usuário não identificado"); return }
    try {
      const r = await pdvService.abrirCaixa({ filialId, operadorId: user.id, saldoInicial: Number(saldoInicial) || 0 })
      if (r.success) {
        setCaixaAberto(r.data)
        setCaixaDialogOpen(false)
        setSaldoInicial("")
        toast.success("Caixa aberto com sucesso")
      }
    } catch (e: any) { toast.error(e?.response?.data?.error || "Erro ao abrir caixa") }
  }

  async function handleFecharCaixa() {
    if (!caixaAberto) return
    try {
      const r = await pdvService.fecharCaixa(caixaAberto.id, {})
      if (r.success) {
        setCaixaAberto(null); setFilialId(""); carregarDados()
        toast.success("Caixa fechado com sucesso")
      }
    } catch (e: any) { toast.error(e?.response?.data?.error || "Erro ao fechar caixa") }
  }

  async function handleIniciarVenda() {
    if (!caixaAberto) { toast.error("Abra o caixa primeiro"); return }
    try {
      const r = await pdvService.iniciarVenda({ filialId: caixaAberto.filialId })
      if (r.success) {
        setVendaAtual(r.data?.venda || r.data)
        setCarrinho([])
        setClienteSelecionado(null)
        setBuscaProduto("")
        setCodigoBarras("")
        setVendaFinalizada(null)
        setVendaDialogOpen(true)
        setTimeout(() => barcodeRef.current?.focus(), 300)
      }
    } catch (e: any) { toast.error(e?.response?.data?.error || "Erro ao iniciar venda") }
  }

  async function buscarProdutos(termo: string) {
    setBuscaProduto(termo)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    if (termo.length < 2) { setProdutosBusca([]); setMostrarProdutos(false); setSearchLoading(false); return }
    setSearchLoading(true)
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const r = await pdvService.listarProdutos(termo)
        const lista = r?.data?.data || r?.data?.dados || r?.dados || (Array.isArray(r) ? r : [])
        setProdutosBusca(Array.isArray(lista) ? lista : [])
        setMostrarProdutos(true)
        setSelectedProdIndex(0)
      } catch { setProdutosBusca([]) }
      finally { setSearchLoading(false) }
    }, 300)
  }

  async function carregarSheetProdutos(termo: string, pagina: number) {
    setSheetLoading(true)
    try {
      const r = await pdvService.listarProdutos(termo || undefined, pagina, 20)
      const lista = r?.data?.data || r?.data?.dados || r?.dados || []
      setSheetProdutos(Array.isArray(lista) ? lista : [])
      const meta = r?.data?.meta || r?.meta
      setSheetTotalPages(meta?.totalPaginas || 1)
    } catch { setSheetProdutos([]) }
    finally { setSheetLoading(false) }
  }

  function abrirSheetProdutos() {
    setSheetSearchTerm(buscaProduto)
    setSheetPage(1)
    setProdutosSheetOpen(true)
    carregarSheetProdutos(buscaProduto, 1)
  }

  async function handleBarcode(codigo: string) {
    if (codigo.length < 3) return
    try {
      const r = await pdvService.buscarPorCodigoBarras(codigo)
      const produto = r?.data
      if (produto) adicionarAoCarrinho(produto)
    } catch { toast.error("Produto não encontrado") }
    setCodigoBarras("")
  }

  function adicionarAoCarrinho(produto: ProdutoPDV) {
    if (!vendaAtual) return
    const existente = carrinho.find(i => i.produtoId === produto.id)
    if (existente) {
      setCarrinho(carrinho.map(i =>
        i.produtoId === produto.id
          ? { ...i, quantidade: i.quantidade + 1, valorTotal: (i.quantidade + 1) * i.valorUnitario }
          : i
      ))
    } else {
      setCarrinho([...carrinho, {
        produtoId: produto.id,
        codigoBarras: produto.codigoBarras,
        descricao: produto.nome,
        quantidade: 1,
        valorUnitario: produto.precoVenda,
        valorTotal: produto.precoVenda,
      }])
    }
    setMostrarProdutos(false)
    setTimeout(() => buscaRef.current?.focus(), 100)
  }

  function alterarQuantidade(produtoId: string, delta: number) {
    setCarrinho(carrinho.map(i =>
      i.produtoId === produtoId
        ? { ...i, quantidade: Math.max(1, i.quantidade + delta), valorTotal: Math.max(1, i.quantidade + delta) * i.valorUnitario }
        : i
    ))
  }

  function removerDoCarrinho(produtoId: string) {
    setCarrinho(carrinho.filter(i => i.produtoId !== produtoId))
  }

  async function buscarClientes(termo: string) {
    setClientesBusca(termo)
    if (clientTimeoutRef.current) clearTimeout(clientTimeoutRef.current)
    if (termo.length < 2) { setClientesLista([]); return }
    clientTimeoutRef.current = setTimeout(async () => {
      try {
        const r = await clientesService.listar({ nome: termo, pagina: 1, limite: 10 })
        const lista = Array.isArray(r) ? r : []
        setClientesLista(lista)
      } catch { setClientesLista([]) }
    }, 300)
  }

  async function handleFinalizarVenda() {
    if (!vendaAtual || carrinho.length === 0) { toast.error("Adicione itens ao carrinho"); return }
    const pago = Number(valorPago) || 0
    if (pago < totalCarrinho) { toast.error("Valor pago é menor que o total"); return }
    setFinalizando(true)
    try {
      for (const item of carrinho) {
        const r1 = await pdvService.adicionarItem(vendaAtual.id, {
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          valorUnitario: item.valorUnitario,
        })
        if (!r1.success) throw new Error(r1.error)
      }
      const r2 = await pdvService.finalizarVenda(vendaAtual.id, {
        formaPagamento,
        valorPago: pago,
        clienteId: clienteSelecionado?.id,
      })
      if (r2.success) {
        setVendaFinalizada(r2.data?.venda || r2.data)
        setConfirmarVendaOpen(false)
        setFormaPagamento("DINHEIRO")
        setValorPago("")
        carregarDados()
        toast.success("Venda finalizada com sucesso!")
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e.message || "Erro ao finalizar venda")
    } finally { setFinalizando(false) }
  }

  function getSituacaoBadge(situacao: string) {
    const cores: Record<string, string> = {
      ABERTA: "bg-blue-100 text-blue-800", FINALIZADA: "bg-green-100 text-green-800",
      CANCELADA: "bg-red-100 text-red-800",
    }
    return cores[situacao] || "bg-gray-100 text-gray-800"
  }

  const troco = Math.max(0, (Number(valorPago) || 0) - totalCarrinho)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBasket className="w-6 h-6" />PDV - Ponto de Venda
          </h1>
          <p className="text-muted-foreground">Gerencie vendas no balcão</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Caixa</CardTitle>
          </CardHeader>
          <CardContent>
            {caixaAberto ? (
              <div className="space-y-1">
                <p className="text-2xl font-bold text-green-600">Aberto</p>
                <p className="text-xs text-muted-foreground">
                  {caixaAberto.filial?.nome || "Sem filial"} - {caixaAberto.operador?.nome || "Sem operador"}
                </p>
                <p className="text-xs">Saldo: R$ {(caixaAberto.saldoInicial ?? 0).toFixed(2)}</p>
                <Button variant="destructive" size="sm" className="mt-2" onClick={handleFecharCaixa}>
                  Fechar Caixa
                </Button>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-2xl font-bold text-red-600">Fechado</p>
                <p className="text-xs text-muted-foreground">Nenhum caixa aberto</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{vendas.filter(v => v.situacao === "FINALIZADA").length}</p>
            <p className="text-xs text-muted-foreground">
              Total: R$ {vendas.filter(v => v.situacao === "FINALIZADA").reduce((acc, v) => acc + v.valorTotal, 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Acesso Rápido</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {!caixaAberto ? (
              <Button className="w-full" size="sm" onClick={() => setCaixaDialogOpen(true)}>
                <DollarSign className="w-4 h-4 mr-1" /> Abrir Caixa
              </Button>
            ) : (
              <Button className="w-full" size="sm" onClick={handleIniciarVenda}>
                <ShoppingCart className="w-4 h-4 mr-1" /> Nova Venda
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Buscar vendas..." value={buscaVenda} onChange={e => setBuscaVenda(e.target.value)} className="pl-10" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cupom</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Operador</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8">Carregando...</TableCell></TableRow>
              ) : vendas.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8">Nenhuma venda encontrada</TableCell></TableRow>
              ) : (
                vendas.map(venda => (
                  <TableRow key={venda.id}>
                    <TableCell className="font-medium">{venda.numeroCupom}</TableCell>
                    <TableCell>{venda.cliente?.nome || "-"}</TableCell>
                    <TableCell>{venda.operador?.nome || "-"}</TableCell>
                    <TableCell>{venda.formaPagamento}</TableCell>
                    <TableCell>R$ {(venda.valorTotal ?? 0).toFixed(2)}</TableCell>
                    <TableCell>{new Date(venda.dataVenda).toLocaleString("pt-BR")}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSituacaoBadge(venda.situacao)}`}>
                        {venda.situacao}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog Abrir Caixa */}
      <Dialog open={caixaDialogOpen} onOpenChange={setCaixaDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Abrir Caixa</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="filial">Filial</Label>
              <Select value={filialId} onValueChange={setFilialId}>
                <SelectTrigger id="filial"><SelectValue placeholder="Selecione uma filial" /></SelectTrigger>
                <SelectContent>
                  {filiais.map(f => <SelectItem key={f.id} value={f.id}>{f.nomeFantasia || f.razaoSocial}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Operador</Label>
              <Input value={user?.name || "Administrador"} disabled placeholder="Nome do operador" title="Operador responsável pelo caixa" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="saldo">Saldo Inicial (R$)</Label>
              <Input id="saldo" type="number" value={saldoInicial} onChange={e => setSaldoInicial(e.target.value)} placeholder="0,00" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCaixaDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAbrirCaixa}>Abrir Caixa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Nova Venda */}
      <Dialog open={vendaDialogOpen} onOpenChange={(open) => { if (!open) { setVendaDialogOpen(false); setVendaAtual(null); setCarrinho([]); setClienteSelecionado(null); setVendaFinalizada(null) } }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Venda {vendaAtual ? `- Cupom ${vendaAtual.numeroCupom}` : ""}</DialogTitle>
          </DialogHeader>

          {/* Linha de busca */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                ref={barcodeRef}
                placeholder="Código de barras (Enter para buscar)"
                value={codigoBarras}
                onChange={e => setCodigoBarras(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleBarcode(codigoBarras) }}
                className="pl-10 font-mono text-lg"
              />
            </div>
            <div className="relative flex-[2]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                ref={buscaRef}
                placeholder="Buscar produto por nome..."
                value={buscaProduto}
                onChange={e => buscarProdutos(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault()
                    setSelectedProdIndex(i => Math.min(i + 1, produtosBusca.length - 1))
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault()
                    setSelectedProdIndex(i => Math.max(i - 1, 0))
                  } else if (e.key === "Enter") {
                    e.preventDefault()
                    if (produtosBusca[selectedProdIndex]) {
                      adicionarAoCarrinho(produtosBusca[selectedProdIndex])
                    } else {
                      abrirSheetProdutos()
                    }
                  }
                }}
                className="pl-10"
              />
            </div>
          </div>

          {/* Grid de produtos sugeridos */}
          {mostrarProdutos && (
            <div className="min-h-[60px]">
              {searchLoading && (
                <p className="text-sm text-muted-foreground text-center py-4">Buscando produtos...</p>
              )}
              {!searchLoading && produtosBusca.length > 0 && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-lg p-2">
                    {produtosBusca.map((p, i) => (
                      <button
                        key={p.id}
                        onClick={() => adicionarAoCarrinho(p)}
                        className={`text-left p-2 rounded border text-sm ${i === selectedProdIndex ? 'bg-accent border-primary' : 'hover:bg-accent'}`}
                      >
                        <p className="font-medium truncate">{p.nome}</p>
                        <p className="text-xs text-muted-foreground">R$ {p.precoVenda.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Estoque: {p.quantidadeEstoque}</p>
                      </button>
                    ))}
                  </div>
                  <Button variant="link" size="sm" className="w-full" onClick={abrirSheetProdutos}>
                    Ver mais produtos...
                  </Button>
                </div>
              )}
              {!searchLoading && produtosBusca.length === 0 && buscaProduto.length >= 2 && (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum produto encontrado</p>
              )}
            </div>
          )}

          {/* Tabela do carrinho */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="w-20 text-center">Qtd</TableHead>
                  <TableHead className="w-28 text-right">Unitário</TableHead>
                  <TableHead className="w-28 text-right">Total</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carrinho.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      <ShoppingBasket className="w-10 h-10 mx-auto mb-2 opacity-40" />
                      Carrinho vazio. Busque produtos acima.
                    </TableCell>
                  </TableRow>
                ) : (
                  carrinho.map(item => (
                    <TableRow key={item.produtoId}>
                      <TableCell>
                        <p className="font-medium">{item.descricao}</p>
                        {item.codigoBarras && <p className="text-xs text-muted-foreground">{item.codigoBarras}</p>}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="outline" size="icon" title="Diminuir quantidade" className="h-7 w-7" onClick={() => alterarQuantidade(item.produtoId, -1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantidade}</span>
                          <Button variant="outline" size="icon" title="Aumentar quantidade" className="h-7 w-7" onClick={() => alterarQuantidade(item.produtoId, 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">R$ {item.valorUnitario.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium">R$ {item.valorTotal.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" title="Remover item do carrinho" className="h-8 w-8 text-red-500" onClick={() => removerDoCarrinho(item.produtoId)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Resumo do carrinho + cliente */}
          <div className="flex justify-between items-start">
            <div>
              <Button variant="outline" size="sm" onClick={() => setSelecionandoCliente(!selecionandoCliente)}>
                <User className="w-4 h-4 mr-1" />
                {clienteSelecionado ? clienteSelecionado.nome : "Selecionar Cliente"}
              </Button>
              {selecionandoCliente && (
                <div className="mt-2 space-y-2">
                  <Input placeholder="Buscar cliente por nome..." value={clientesBusca} onChange={e => buscarClientes(e.target.value)} className="w-64" />
                  <div className="max-h-32 overflow-y-auto border rounded">
                    {clientesLista.map(c => (
                      <button
                        key={c.id}
                        onClick={() => { setClienteSelecionado(c); setSelecionandoCliente(false) }}
                        className="block w-full text-left px-3 py-1.5 text-sm hover:bg-accent"
                      >
                        {c.nome}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm text-muted-foreground">Total: <span className="text-lg font-bold text-foreground">R$ {totalCarrinho.toFixed(2)}</span></p>
              {carrinho.some(i => i.valorUnitario === 0) && (
                <p className="text-xs text-red-500">Configure o preço de venda dos produtos</p>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => { setVendaDialogOpen(false); setVendaFinalizada(null) }}>
              Cancelar Venda
            </Button>
            <Button
              disabled={carrinho.length === 0 || finalizando}
              onClick={() => setConfirmarVendaOpen(true)}
            >
              {finalizando ? "Finalizando..." : "Finalizar Venda"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Confirmar Pagamento */}
      <Dialog open={confirmarVendaOpen} onOpenChange={setConfirmarVendaOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Finalizar Venda</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted p-4 rounded-lg space-y-1">
              <div className="flex justify-between text-sm"><span>Itens</span><span>{carrinho.length}</span></div>
              <div className="flex justify-between text-sm"><span>Total</span><span className="font-bold">R$ {totalCarrinho.toFixed(2)}</span></div>
              {clienteSelecionado && <div className="flex justify-between text-sm"><span>Cliente</span><span>{clienteSelecionado.nome}</span></div>}
            </div>

            <div className="grid gap-2">
              <Label>Forma de Pagamento</Label>
              <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="CARTAO_CREDITO">Cartão de Crédito</SelectItem>
                  <SelectItem value="CARTAO_DEBITO">Cartão de Débito</SelectItem>
                  <SelectItem value="CARTAO_CREDITO_PARCELADO">Crédito Parcelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Valor Recebido (R$)</Label>
              <Input
                type="number" step="0.01"
                value={valorPago}
                onChange={e => setValorPago(e.target.value)}
                placeholder="0,00"
              />
            </div>

            {troco > 0 && (
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-center">
                <p className="text-sm text-green-700">Troco</p>
                <p className="text-2xl font-bold text-green-600">R$ {troco.toFixed(2)}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmarVendaOpen(false)}>Voltar</Button>
            <Button onClick={handleFinalizarVenda} disabled={finalizando || !valorPago || Number(valorPago) <= 0}>
              {finalizando ? "Processando..." : "Confirmar Pagamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sheet Produtos */}
      <Sheet open={produtosSheetOpen} onOpenChange={setProdutosSheetOpen}>
        <SheetContent side="right" className="w-full max-w-2xl p-0 flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-2">
            <SheetTitle>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Produtos
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar produto..."
                value={sheetSearchTerm}
                onChange={e => {
                  setSheetSearchTerm(e.target.value)
                  setSheetPage(1)
                  if (sheetSearchTimeoutRef.current) clearTimeout(sheetSearchTimeoutRef.current)
                  sheetSearchTimeoutRef.current = setTimeout(() => carregarSheetProdutos(e.target.value, 1), 300)
                }}
                onKeyDown={e => { if (e.key === "Enter") carregarSheetProdutos(sheetSearchTerm, 1) }}
                className="pl-10"
                autoFocus
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-4">
            {sheetLoading ? (
              <p className="text-center text-muted-foreground py-8">Carregando produtos...</p>
            ) : sheetProdutos.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhum produto encontrado</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sheetProdutos.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { adicionarAoCarrinho(p); setProdutosSheetOpen(false) }}
                    className="text-left p-4 rounded-lg border hover:bg-accent hover:border-primary transition-all"
                  >
                    <p className="font-medium truncate">{p.nome}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-lg font-bold text-primary">R$ {p.precoVenda.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Estoque: {p.quantidadeEstoque}</p>
                    </div>
                    {p.codigoBarras && (
                      <p className="text-xs text-muted-foreground mt-1">Cód: {p.codigoBarras}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {sheetTotalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <Button
                variant="outline" size="sm"
                disabled={sheetPage <= 1}
                onClick={() => { const p = sheetPage - 1; setSheetPage(p); carregarSheetProdutos(sheetSearchTerm, p) }}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {sheetPage} de {sheetTotalPages}
              </span>
              <Button
                variant="outline" size="sm"
                disabled={sheetPage >= sheetTotalPages}
                onClick={() => { const p = sheetPage + 1; setSheetPage(p); carregarSheetProdutos(sheetSearchTerm, p) }}
              >
                Próxima <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Dialog Venda Finalizada */}
      <Dialog open={!!vendaFinalizada} onOpenChange={() => { setVendaFinalizada(null); setVendaDialogOpen(false); setVendaAtual(null) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">Venda Finalizada!</DialogTitle>
          </DialogHeader>
          {vendaFinalizada && (
            <div className="text-center space-y-3 py-4">
              <p className="text-3xl font-bold">R$ {(vendaFinalizada.valorTotal ?? 0).toFixed(2)}</p>
              <p className="text-muted-foreground">{vendaFinalizada.formaPagamento}</p>
              <p className="text-sm">Cupom: {vendaFinalizada.numeroCupom}</p>
              {(vendaFinalizada.valorTroco ?? 0) > 0 && (
                <p className="text-green-600 font-medium">Troco: R$ {(vendaFinalizada.valorTroco ?? 0).toFixed(2)}</p>
              )}
            </div>
          )}
          <DialogFooter className="justify-center">
            <Button onClick={() => { setVendaFinalizada(null); setVendaDialogOpen(false); setVendaAtual(null) }}>
              Nova Venda
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PdvPage
