import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { inventarioService, Inventario } from "@/services/inventario"
import { Plus, Search, ClipboardList, Check, AlertTriangle } from "lucide-react"

export function InventarioPage() {
  const [inventarios, setInventarios] = useState<Inventario[]>([])
  const [loading, setLoading] = useState(false)
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    tipo: "GERAL",
    observacoes: "",
  })

  useEffect(() => {
    loadInventarios()
  }, [busca, filtroStatus])

  async function loadInventarios() {
    setLoading(true)
    try {
      const inventarios = await inventarioService.listar({
        situacao: filtroStatus || undefined,
      })
      setInventarios(inventarios || [])
    } catch (error) {
      console.error("Erro ao carregar inventários:", error)
    } finally {
      setLoading(false)
    }
  }

  async function criarInventario() {
    try {
      await inventarioService.criar({
        tipo: formData.tipo,
        observacoes: formData.observacoes,
      })
      setDialogOpen(false)
      setFormData({ tipo: "GERAL", observacoes: "" })
      loadInventarios()
    } catch (error) {
      console.error("Erro ao criar inventário:", error)
    }
  }

  async function concluir(id: string) {
    try {
      await inventarioService.conciliar(id, {
        itemIds: [],
        ajustarEstoque: true,
      })
      loadInventarios()
    } catch (error) {
      console.error("Erro ao concluir:", error)
    }
  }

  async function cancelar(id: string) {
    try {
      await inventarioService.cancelar(id)
      loadInventarios()
    } catch (error) {
      console.error("Erro ao cancelar:", error)
    }
  }

  function getSituacaoBadge(situacao: string) {
    const cores: Record<string, string> = {
      ABERTO: "bg-blue-100 text-blue-800",
      EM_CONFERENCIA: "bg-yellow-100 text-yellow-800",
      CONCLUIDO: "bg-green-100 text-green-800",
      CANCELADO: "bg-red-100 text-red-800",
    }
    return cores[situacao] || "bg-gray-100 text-gray-800"
  }

  function getTipoLabel(tipo: string) {
    const labels: Record<string, string> = {
      GERAL: "Geral",
      PARCIAL: "Parcial",
      ROTATIVO: "Rotativo",
    }
    return labels[tipo] || tipo
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="w-6 h-6" />
            Inventário
          </h1>
          <p className="text-muted-foreground">Contagem e conciliação de estoque</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Inventário
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar inventários..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          className="border rounded-lg px-3 py-2"
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="ABERTO">Aberto</option>
          <option value="EM_CONFERENCIA">Em Conferência</option>
          <option value="CONCLUIDO">Concluído</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {inventarios.filter(i => i.situacao === "ABERTO").length}
              </p>
              <p className="text-sm text-muted-foreground">Abertos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {inventarios.filter(i => i.situacao === "EM_CONFERENCIA").length}
              </p>
              <p className="text-sm text-muted-foreground">Em Conferência</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {inventarios.filter(i => i.situacao === "CONCLUIDO").length}
              </p>
              <p className="text-sm text-muted-foreground">Concluídos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600">
                {inventarios.length}
              </p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Filial</TableHead>
                <TableHead>Itens</TableHead>
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
              ) : inventarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Nenhum inventário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                inventarios.map((inventario) => (
                  <TableRow key={inventario.id}>
                    <TableCell>{new Date(inventario.dataInventario).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>{getTipoLabel(inventario.tipo)}</TableCell>
                    <TableCell>{inventario.filial?.nome || "-"}</TableCell>
                    <TableCell>{inventario._count?.itens || 0}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSituacaoBadge(inventario.situacao)}`}>
                        {inventario.situacao === "EM_CONFERENCIA" ? "Conferência" : inventario.situacao}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {inventario.situacao !== "CONCLUIDO" && inventario.situacao !== "CANCELADO" && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => concluir(inventario.id)}>
                              <Check className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => cancelar(inventario.id)}>
                              <AlertTriangle className="w-4 h-4 text-red-600" />
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Novo Inventário</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo</Label>
              <select
                id="tipo"
                className="border rounded-lg px-3 py-2"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              >
                <option value="GERAL">Geral</option>
                <option value="PARCIAL">Parcial</option>
                <option value="ROTATIVO">Rotativo</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="obs">Observações</Label>
              <Input
                id="obs"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Observações opcionais..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={criarInventario}>Criar Inventário</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default InventarioPage
