import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, FileBarChart, Check, X } from "lucide-react"
import { orcamentosService, Orcamento } from "@/services/orcamentos"

export function OrcamentosPage() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("")
  const [formData, setFormData] = useState({
    clienteId: "",
    observacoes: "",
  })

  useEffect(() => {
    loadOrcamentos()
  }, [busca, filtroStatus])

  async function loadOrcamentos() {
    setLoading(true)
    try {
      const orcamentos = await orcamentosService.listar({
        situacao: filtroStatus || undefined,
      })
      setOrcamentos(orcamentos || [])
    } catch (error) {
      console.error("Erro ao carregar orçamentos:", error)
    } finally {
      setLoading(false)
    }
  }

  async function aprovar(id: string) {
    try {
      await orcamentosService.aprovar(id)
      loadOrcamentos()
    } catch (error) {
      console.error("Erro ao aprovar:", error)
    }
  }

  async function reprovar(id: string) {
    try {
      await orcamentosService.reprovar(id)
      loadOrcamentos()
    } catch (error) {
      console.error("Erro ao reprovar:", error)
    }
  }

  async function converter(id: string) {
    try {
      await orcamentosService.converter(id)
      loadOrcamentos()
    } catch (error) {
      console.error("Erro ao converter:", error)
    }
  }

  async function criarOrcamento() {
    try {
      await orcamentosService.criar({
        clienteId: formData.clienteId,
        observacoes: formData.observacoes,
      })
      setDialogOpen(false)
      setFormData({ clienteId: "", observacoes: "" })
      loadOrcamentos()
    } catch (error) {
      console.error("Erro ao criar:", error)
    }
  }

  function getSituacaoBadge(situacao: string) {
    const cores: Record<string, string> = {
      ABERTO: "bg-blue-100 text-blue-800",
      APROVADO: "bg-green-100 text-green-800",
      REPROVADO: "bg-red-100 text-red-800",
      EXPIRADO: "bg-gray-100 text-gray-800",
      CONVERTIDO: "bg-purple-100 text-purple-800",
    }
    return cores[situacao] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileBarChart className="w-6 h-6" />
            Orçamentos
          </h1>
          <p className="text-muted-foreground">Gerencie orçamentos de vendas</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Orçamento
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar orçamentos..."
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
          <option value="APROVADO">Aprovado</option>
          <option value="REPROVADO">Reprovado</option>
          <option value="EXPIRADO">Expirado</option>
          <option value="CONVERTIDO">Convertido</option>
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Filial</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : orcamentos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Nenhum orçamento encontrado
                  </TableCell>
                </TableRow>
              ) : (
                orcamentos.map((orcamento) => (
                  <TableRow key={orcamento.id}>
                    <TableCell className="font-medium">{orcamento.numeroOrcamento}</TableCell>
                    <TableCell>{(orcamento as any).cliente?.nome}</TableCell>
                    <TableCell>{(orcamento as any).filial?.nome}</TableCell>
                    <TableCell>R$ {orcamento.valorTotal.toFixed(2)}</TableCell>
                    <TableCell>{new Date(orcamento.dataEmissao).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>{new Date(orcamento.dataValidade).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSituacaoBadge(orcamento.situacao)}`}>
                        {orcamento.situacao}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {orcamento.situacao === "ABERTO" && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => aprovar(orcamento.id)}>
                              <Check className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => reprovar(orcamento.id)}>
                              <X className="w-4 h-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        {(orcamento.situacao === "ABERTO" || orcamento.situacao === "APROVADO") && (
                          <Button variant="ghost" size="sm" onClick={() => converter(orcamento.id)}>
                            <FileBarChart className="w-4 h-4 text-blue-600" />
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Orçamento</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
              <Label htmlFor="obs">Observações</Label>
              <Input
                id="obs"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Observações do orçamento"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={criarOrcamento}>Criar Orçamento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OrcamentosPage
