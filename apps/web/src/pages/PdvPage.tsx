import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { pdvService, VendaPDV, Caixa } from "@/services/pdv"
import { empresasService, Filial } from "@/services/estoque"
import { useAuth } from "@/stores/AuthContext"
import { Search, ShoppingBasket, DollarSign, ShoppingCart } from "lucide-react"
import toast from "react-hot-toast"

export function PdvPage() {
  const { user } = useAuth()
  const [vendas, setVendas] = useState<VendaPDV[]>([])
  const [caixaAberto, setCaixaAberto] = useState<Caixa | null>(null)
  const [loading, setLoading] = useState(false)
  const [busca, setBusca] = useState("")
  const [caixaDialogOpen, setCaixaDialogOpen] = useState(false)
  const [vendaDialogOpen, setVendaDialogOpen] = useState(false)
  const [saldoInicial, setSaldoInicial] = useState("")
  const [filialId, setFilialId] = useState("")
  const [filiais, setFiliais] = useState<Filial[]>([])

  useEffect(() => {
    loadFiliais()
    loadDados()
  }, [busca])

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

  async function loadDados() {
    setLoading(true)
    try {
      const [vendasRes, caixaRes] = await Promise.all([
        pdvService.listarVendas({ situacao: "FINALIZADA" }),
        pdvService.buscarCaixaAberto("").catch(() => null),
      ])
      
      setVendas(Array.isArray(vendasRes) ? vendasRes : [])
      if (caixaRes) {
        setCaixaAberto(caixaRes)
        if (caixaRes.filialId) setFilialId(caixaRes.filialId)
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  async function abrirCaixa() {
    if (!filialId) {
      toast.error("Selecione uma filial")
      return
    }
    if (!user?.id) {
      toast.error("Usuário não identificado")
      return
    }
    try {
      const response = await pdvService.abrirCaixa({
        filialId,
        operadorId: user.id,
        saldoInicial: Number(saldoInicial) || 0,
      })
      if (response.success) {
        setCaixaAberto(response.data)
        setCaixaDialogOpen(false)
        setSaldoInicial("")
        toast.success("Caixa aberto com sucesso")
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Erro ao abrir caixa")
    }
  }

  async function fecharCaixa() {
    if (!caixaAberto) return
    try {
      const response = await pdvService.fecharCaixa(caixaAberto.id, {
        saldoFinal: 0,
      })
      if (response.success) {
        setCaixaAberto(null)
        setFilialId("")
        loadDados()
        toast.success("Caixa fechado com sucesso")
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Erro ao fechar caixa")
    }
  }

  function getSituacaoBadge(situacao: string) {
    const cores: Record<string, string> = {
      ABERTA: "bg-blue-100 text-blue-800",
      FINALIZADA: "bg-green-100 text-green-800",
      CANCELADA: "bg-red-100 text-red-800",
    }
    return cores[situacao] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBasket className="w-6 h-6" />
            PDV - Ponto de Venda
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
                <p className="text-xs">Saldo: R$ {caixaAberto.saldoInicial.toFixed(2)}</p>
                <Button variant="destructive" size="sm" className="mt-2" onClick={fecharCaixa}>
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
            <p className="text-2xl font-bold">
              {vendas.filter(v => v.situacao === "FINALIZADA").length}
            </p>
            <p className="text-xs text-muted-foreground">
              Total: R$ {vendas
                .filter(v => v.situacao === "FINALIZADA")
                .reduce((acc, v) => acc + v.valorTotal, 0)
                .toFixed(2)}
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
                <DollarSign className="w-4 h-4 mr-1" />
                Abrir Caixa
              </Button>
            ) : (
              <Button className="w-full" size="sm" onClick={() => setVendaDialogOpen(true)}>
                <ShoppingCart className="w-4 h-4 mr-1" />
                Nova Venda
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar vendas..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
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
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : vendas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Nenhuma venda encontrada
                  </TableCell>
                </TableRow>
              ) : (
                vendas.map((venda) => (
                  <TableRow key={venda.id}>
                    <TableCell className="font-medium">{venda.numeroCupom}</TableCell>
                    <TableCell>{venda.cliente?.nome || "-"}</TableCell>
                    <TableCell>{venda.operador?.nome || "-"}</TableCell>
                    <TableCell>{venda.formaPagamento}</TableCell>
                    <TableCell>R$ {venda.valorTotal.toFixed(2)}</TableCell>
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

      <Dialog open={caixaDialogOpen} onOpenChange={setCaixaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Abrir Caixa</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="filial">Filial</Label>
              <Select value={filialId} onValueChange={setFilialId}>
                <SelectTrigger id="filial">
                  <SelectValue placeholder="Selecione uma filial" />
                </SelectTrigger>
                <SelectContent>
                  {filiais.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.nomeFantasia || f.razaoSocial}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Operador</Label>
              <Input value={user?.name || "Administrador"} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="saldo">Saldo Inicial (R$)</Label>
              <Input
                id="saldo"
                type="number"
                value={saldoInicial}
                onChange={(e) => setSaldoInicial(e.target.value)}
                placeholder="0,00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCaixaDialogOpen(false)}>Cancelar</Button>
            <Button onClick={abrirCaixa}>Abrir Caixa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={vendaDialogOpen} onOpenChange={setVendaDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Venda</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center text-muted-foreground">
            <ShoppingBasket className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Em breve: Interface de vendas PDV</p>
            <p className="text-sm">Selecione produtos e finalize vendas</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVendaDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PdvPage
