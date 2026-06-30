import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { parametrosService, Parametro } from "@/services/parametros"
import { Settings, Search, Plus, Edit, ToggleLeft, ToggleRight } from "lucide-react"

const MODULOS = [
  { value: "", label: "Todos" },
  { value: "GERAL", label: "Geral" },
  { value: "NF-E", label: "NF-e" },
  { value: "NFC-E", label: "NFC-e" },
  { value: "BOLETOS", label: "Boletos" },
  { value: "PDV", label: "PDV" },
  { value: "ESTOQUE", label: "Estoque" },
  { value: "FINANCEIRO", label: "Financeiro" },
  { value: "FISCAL", label: "Fiscal" },
]

export function ParametrosPage() {
  const [parametros, setParametros] = useState<Parametro[]>([])
  const [loading, setLoading] = useState(false)
  const [busca, setBusca] = useState("")
  const [filtroModulo, setFiltroModulo] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editando, setEditando] = useState<Parametro | null>(null)
  const [formData, setFormData] = useState({
    modulo: "GERAL",
    chave: "",
    valor: "",
    descricao: "",
  })

  useEffect(() => {
    loadParametros()
  }, [filtroModulo])

  async function loadParametros() {
    setLoading(true)
    try {
      const parametros = await parametrosService.listar({
        modulo: filtroModulo || undefined,
      })
      setParametros(parametros || [])
    } catch (error) {
      console.error("Erro ao carregar parâmetros:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSalvar() {
    try {
      if (editando) {
        await parametrosService.atualizar(editando.id, formData)
      } else {
        await parametrosService.criar(formData)
      }
      setDialogOpen(false)
      setEditando(null)
      setFormData({ modulo: "GERAL", chave: "", valor: "", descricao: "" })
      loadParametros()
    } catch (error) {
      console.error("Erro ao salvar:", error)
    }
  }

  async function handleToggle(param: Parametro) {
    try {
      if (param.ativo) {
        await parametrosService.inativar(param.id)
      } else {
        await parametrosService.ativar(param.id)
      }
      loadParametros()
    } catch (error) {
      console.error("Erro ao togglar:", error)
    }
  }

  function abrirEditar(param: Parametro) {
    setEditando(param)
    setFormData({
      modulo: param.modulo,
      chave: param.chave,
      valor: param.valor,
      descricao: param.descricao || "",
    })
    setDialogOpen(true)
  }

  function abrirNovo() {
    setEditando(null)
    setFormData({ modulo: "GERAL", chave: "", valor: "", descricao: "" })
    setDialogOpen(true)
  }

  const parametrosFiltrados = parametros.filter(p =>
    p.chave.toLowerCase().includes(busca.toLowerCase()) ||
    p.descricao?.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Parâmetros
          </h1>
          <p className="text-muted-foreground">Configure o sistema</p>
        </div>
        <Button onClick={abrirNovo}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Parâmetro
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar parâmetros..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          className="border rounded-lg px-3 py-2 bg-background"
          value={filtroModulo}
          onChange={(e) => setFiltroModulo(e.target.value)}
        >
          {MODULOS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parametros.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parametros.filter(p => p.ativo).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parametros.filter(p => !p.ativo).length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Módulo</TableHead>
                <TableHead>Chave</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Descrição</TableHead>
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
              ) : parametrosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Nenhum parâmetro encontrado
                  </TableCell>
                </TableRow>
              ) : (
                parametrosFiltrados.map((param) => (
                  <TableRow key={param.id}>
                    <TableCell>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                        {param.modulo}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{param.chave}</TableCell>
                    <TableCell className="font-mono text-sm">{param.valor}</TableCell>
                    <TableCell className="text-muted-foreground">{param.descricao || "-"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggle(param)}
                        className={param.ativo ? "text-green-600" : "text-gray-400"}
                      >
                        {param.ativo ? (
                          <ToggleRight className="w-5 h-5" />
                        ) : (
                          <ToggleLeft className="w-5 h-5" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => abrirEditar(param)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editando ? "Editar Parâmetro" : "Novo Parâmetro"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="modulo">Módulo</Label>
              <select
                id="modulo"
                className="border rounded-lg px-3 py-2"
                value={formData.modulo}
                onChange={(e) => setFormData({ ...formData, modulo: e.target.value })}
              >
                {MODULOS.filter(m => m.value).map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="chave">Chave</Label>
              <Input
                id="chave"
                value={formData.chave}
                onChange={(e) => setFormData({ ...formData, chave: e.target.value })}
                placeholder="EX: EMPRESA_NOME"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSalvar}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ParametrosPage
