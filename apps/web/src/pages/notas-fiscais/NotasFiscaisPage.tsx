import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { notasFiscaisService, NotaFiscal, CriarNotaFiscalDto } from "@/services/notas-fiscais"
import { clientesService } from "@/services/clientes"
import { produtosService } from "@/services/produtos"
import { FileText, Search, Plus, Send, X, FileSignature, Download, Eye, Trash2, Mail } from "lucide-react"

const SITUACOES = [
  { value: "", label: "Todos" },
  { value: "EM_DIGITACAO", label: "Em Digitação" },
  { value: "ASSINADA", label: "Assinada" },
  { value: "ENVIADA", label: "Enviada" },
  { value: "AUTORIZADA", label: "Autorizada" },
  { value: "CANCELADA", label: "Cancelada" },
  { value: "DENEGADA", label: "Denegada" },
]

export function NotasFiscaisPage() {
  const [notas, setNotas] = useState<NotaFiscal[]>([])
  const [loading, setLoading] = useState(false)
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [notaSelecionada, setNotaSelecionada] = useState<NotaFiscal | null>(null)
  const [acaoDialog, setAcaoDialog] = useState<string | null>(null)
  const [justificativa, setJustificativa] = useState("")
  const [tab, setTab] = useState("lista")
  
  // Form state
  const [clientes, setClientes] = useState<any[]>([])
  const [produtos, setProdutos] = useState<any[]>([])
  const [formData, setFormData] = useState<CriarNotaFiscalDto>({
    filialId: "",
    clienteId: "",
    tipoOperacao: "VENDA",
    finalidade: "NORMAL",
    itens: [],
  })
  const [itemProduto, setItemProduto] = useState("")
  const [itemQtd, setItemQtd] = useState("1")
  const [itemValor, setItemValor] = useState("")

  useEffect(() => {
    loadNotas()
    loadClientes()
    loadProdutos()
  }, [filtroStatus])

  async function loadNotas() {
    setLoading(true)
    try {
      const notas = await notasFiscaisService.listar({
        situacao: filtroStatus || undefined,
      })
      setNotas(notas || [])
    } catch (error) {
      console.error("Erro ao carregar notas:", error)
    } finally {
      setLoading(false)
    }
  }

  async function loadClientes() {
    try {
      const response = await clientesService.listar()
      setClientes(response || [])
    } catch (error) {
      console.error("Erro ao carregar clientes:", error)
    }
  }

  async function loadProdutos() {
    try {
      const response = await produtosService.listar()
      setProdutos(response || [])
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    }
  }

  async function handleAssinar(id: string) {
    try {
      await notasFiscaisService.assinar(id)
      loadNotas()
    } catch (error: any) {
      alert(error.response?.data?.error || error.message)
    }
  }

  async function handleEnviar(id: string) {
    try {
      await notasFiscaisService.enviar(id)
      loadNotas()
    } catch (error: any) {
      alert(error.response?.data?.error || error.message)
    }
  }

  async function handleCancelar() {
    if (!notaSelecionada || !justificativa) return
    try {
      await notasFiscaisService.cancelar(notaSelecionada.id, justificativa)
      setAcaoDialog(null)
      setJustificativa("")
      loadNotas()
    } catch (error: any) {
      alert(error.response?.data?.error || error.message)
    }
  }

  async function handleCriarNota() {
    try {
      await notasFiscaisService.criar(formData)
      setDialogOpen(false)
      setFormData({
        filialId: "",
        clienteId: "",
        tipoOperacao: "VENDA",
        finalidade: "NORMAL",
        itens: [],
      })
      loadNotas()
    } catch (error: any) {
      alert(error.response?.data?.error || error.message)
    }
  }

  function handleAddItem() {
    const prod = produtos.find(p => p.id === itemProduto)
    if (!prod || !itemQtd || !itemValor) return
    
    const qtd = parseFloat(itemQtd)
    const valor = parseFloat(itemValor)
    
    const novoItem = {
      produtoId: prod.id,
      quantidade: qtd,
      valorUnitario: valor,
      cfop: "5102",
      cstICMS: "00",
      cstPIS: "01",
      cstCOFINS: "01",
    }
    
    setFormData({
      ...formData,
      itens: [...(formData.itens || []), novoItem],
    })
    setItemProduto("")
    setItemQtd("1")
    setItemValor("")
  }

  function handleRemoveItem(index: number) {
    const novosItens = [...(formData.itens || [])]
    novosItens.splice(index, 1)
    setFormData({ ...formData, itens: novosItens })
  }

  function openDetail(nota: NotaFiscal) {
    setNotaSelecionada(nota)
    setDetailOpen(true)
  }

  function getSituacaoBadge(situacao: string) {
    const cores: Record<string, string> = {
      EM_DIGITACAO: "bg-gray-100 text-gray-800",
      ASSINADA: "bg-blue-100 text-blue-800",
      ENVIADA: "bg-yellow-100 text-yellow-800",
      AUTORIZADA: "bg-green-100 text-green-800",
      CANCELADA: "bg-red-100 text-red-800",
      DENEGADA: "bg-red-100 text-red-800",
    }
    return cores[situacao] || "bg-gray-100 text-gray-800"
  }

  const notasFiltradas = notas.filter(n =>
    String(n.numeroNota || "").includes(busca) ||
    String(n.chaveAcesso || "").includes(busca) ||
    String(n.cliente?.nome || "").toLowerCase().includes(busca.toLowerCase())
  )

  const totalizadores = {
    rascunho: notas.filter(n => n.situacao === "EM_DIGITACAO").length,
    autorizadas: notas.filter(n => n.situacao === "AUTORIZADA").length,
    canceladas: notas.filter(n => n.situacao === "CANCELADA").length,
    total: notas.length,
  }

  const valorTotal = notasFiltradas.reduce((sum, n) => sum + (n.valorTotal || 0), 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Notas Fiscais (NF-e)
          </h1>
          <p className="text-muted-foreground">Emissão e controle de Nota Fiscal Eletrônica</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova NF-e
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-600">{totalizadores.rascunho}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Autorizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{totalizadores.autorizadas}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{totalizadores.canceladas}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalizadores.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">R$ {valorTotal.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por número, chave ou cliente..."
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
          {SITUACOES.map((s) => (
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
                <TableHead>Série</TableHead>
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
                  <TableCell colSpan={7} className="text-center py-8">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : notasFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Nenhuma nota fiscal encontrada
                  </TableCell>
                </TableRow>
              ) : (
                notasFiltradas.map((nota) => (
                  <TableRow key={nota.id}>
                    <TableCell className="font-medium">{nota.numeroNota || "-"}</TableCell>
                    <TableCell>{nota.serie}</TableCell>
                    <TableCell>{nota.cliente?.nome || "-"}</TableCell>
                    <TableCell>{nota.dataEmissao ? new Date(nota.dataEmissao).toLocaleDateString("pt-BR") : "-"}</TableCell>
                    <TableCell className="text-right">R$ {nota.valorTotal?.toFixed(2) || "0,00"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSituacaoBadge(nota.situacao)}`}>
                        {nota.situacao}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => openDetail(nota)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {nota.situacao === "EM_DIGITACAO" && (
                          <Button variant="ghost" size="sm" onClick={() => handleAssinar(nota.id)}>
                            <FileSignature className="w-4 h-4 text-blue-600" />
                          </Button>
                        )}
                        {nota.situacao === "ASSINADA" && (
                          <Button variant="ghost" size="sm" onClick={() => handleEnviar(nota.id)}>
                            <Send className="w-4 h-4 text-yellow-600" />
                          </Button>
                        )}
                        {(nota.situacao === "AUTORIZADA" || nota.situacao === "ASSINADA" || nota.situacao === "ENVIADA") && (
                          <Button variant="ghost" size="sm" onClick={() => { setNotaSelecionada(nota); setAcaoDialog("cancelar") }}>
                            <X className="w-4 h-4 text-red-600" />
                          </Button>
                        )}
                        {nota.situacao === "AUTORIZADA" && (
                          <>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Mail className="w-4 h-4 text-blue-600" />
                            </Button>
                          </>
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

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nova Nota Fiscal Eletrônica</DialogTitle>
          </DialogHeader>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="lista">Dados Gerais</TabsTrigger>
              <TabsTrigger value="itens">Itens ({formData.itens?.length || 0})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="lista" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Cliente</Label>
                  <Select value={formData.clienteId} onValueChange={(v) => setFormData({...formData, clienteId: v})}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      {clientes.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Tipo Operação</Label>
                  <Select value={formData.tipoOperacao} onValueChange={(v) => setFormData({...formData, tipoOperacao: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VENDA">Venda</SelectItem>
                      <SelectItem value="DEVOLUCAO">Devolução</SelectItem>
                      <SelectItem value="REMESSA">Remessa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Finalidade</Label>
                  <Select value={formData.finalidade} onValueChange={(v) => setFormData({...formData, finalidade: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NORMAL">Normal</SelectItem>
                      <SelectItem value="COMPLEMENTAR">Complementar</SelectItem>
                      <SelectItem value="DEVOLUCAO">Devolução</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Natureza Operação</Label>
                  <Input 
                    placeholder="VENDA MERCADO INTERNO" 
                    value={formData.naturezaOperacao || ""}
                    onChange={(e) => setFormData({...formData, naturezaOperacao: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={() => setTab("itens")}>Próximo: Itens</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="itens" className="space-y-4">
              <div className="flex gap-2 items-end">
                <div className="flex-1 grid gap-2">
                  <Label>Produto</Label>
                  <Select value={itemProduto} onValueChange={setItemProduto}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      {produtos.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.codigoInterno} - {p.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-20 grid gap-2">
                  <Label>Qtd</Label>
                  <Input type="number" value={itemQtd} onChange={(e) => setItemQtd(e.target.value)} />
                </div>
                <div className="w-32 grid gap-2">
                  <Label>Valor Unit.</Label>
                  <Input type="number" step="0.01" value={itemValor} onChange={(e) => setItemValor(e.target.value)} />
                </div>
                <Button onClick={handleAddItem}>Adicionar</Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Qtd</TableHead>
                    <TableHead>Valor Unit.</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.itens?.map((item, idx) => {
                    const prod = produtos.find(p => p.id === item.produtoId)
                    return (
                      <TableRow key={idx}>
                        <TableCell>{prod?.nome || item.produtoId}</TableCell>
                        <TableCell>{item.quantidade}</TableCell>
                        <TableCell>R$ {item.valorUnitario.toFixed(2)}</TableCell>
                        <TableCell>R$ {(item.quantidade * item.valorUnitario).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(idx)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {(!formData.itens || formData.itens.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        Nenhum item adicionado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={() => setTab("lista")}>Voltar</Button>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total da Nota</p>
                  <p className="text-2xl font-bold">
                    R$ {formData.itens?.reduce((sum, i) => sum + (i.quantidade * i.valorUnitario), 0).toFixed(2) || "0,00"}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Fechar</Button>
            <Button onClick={handleCriarNota} disabled={!formData.clienteId || !formData.itens?.length}>
              Criar NF-e
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes da NF-e</DialogTitle>
          </DialogHeader>
          {notaSelecionada && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Número</Label>
                  <p className="font-medium">{notaSelecionada.numeroNota}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Série</Label>
                  <p className="font-medium">{notaSelecionada.serie}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Chave de Acesso</Label>
                  <p className="font-mono text-xs">{notaSelecionada.chaveAcesso}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Data Emissão</Label>
                  <p className="font-medium">{notaSelecionada.dataEmissao ? new Date(notaSelecionada.dataEmissao).toLocaleString("pt-BR") : "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Cliente</Label>
                  <p className="font-medium">{notaSelecionada.cliente?.nome || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Valor Total</Label>
                  <p className="font-medium">R$ {notaSelecionada.valorTotal?.toFixed(2) || "0,00"}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={acaoDialog === "cancelar"} onOpenChange={(open) => { if (!open) setAcaoDialog(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Nota Fiscal</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="justificativa">Justificativa</Label>
              <Input
                id="justificativa"
                value={justificativa}
                onChange={(e) => setJustificativa(e.target.value)}
                placeholder="Motivo do cancelamento (mínimo 15 caracteres)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAcaoDialog(null)}>Cancelar</Button>
            <Button onClick={handleCancelar} disabled={justificativa.length < 15}>
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default NotasFiscaisPage
