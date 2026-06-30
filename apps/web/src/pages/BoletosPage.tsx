import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Search, Receipt, Check, X } from "lucide-react"
import { boletosService, Boleto } from "@/services/boletos"

export function BoletosPage() {
  const [boletos, setBoletos] = useState<Boleto[]>([])
  const [loading, setLoading] = useState(false)
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("")

  useEffect(() => {
    loadBoletos()
  }, [busca, filtroStatus])

  async function loadBoletos() {
    setLoading(true)
    try {
      const boletos = await boletosService.listar({
        situacao: filtroStatus || undefined,
      })
      setBoletos(boletos || [])
    } catch (error) {
      console.error("Erro ao carregar boletos:", error)
    } finally {
      setLoading(false)
    }
  }

  async function baixar(id: string) {
    try {
      await boletosService.baixar(id, {
        dataPagamento: new Date().toISOString(),
        valorPago: 0,
      })
      loadBoletos()
    } catch (error) {
      console.error("Erro ao baixar:", error)
    }
  }

  async function cancelar(id: string) {
    try {
      await boletosService.cancelar(id)
      loadBoletos()
    } catch (error) {
      console.error("Erro ao cancelar:", error)
    }
  }

  function getSituacaoBadge(situacao: string) {
    const cores: Record<string, string> = {
      EMITIDO: "bg-blue-100 text-blue-800",
      ENVIADO: "bg-indigo-100 text-indigo-800",
      BAIXADO: "bg-green-100 text-green-800",
      BAIXADO_MANUALMENTE: "bg-green-100 text-green-800",
      VENCIDO: "bg-red-100 text-red-800",
      CANCELADO: "bg-gray-100 text-gray-800",
    }
    return cores[situacao] || "bg-gray-100 text-gray-800"
  }

  const totalizadores = {
    emitidos: boletos.filter(b => b.situacao === "EMITIDO").length,
    recebidos: boletos.filter(b => b.situacao === "BAIXADO").length,
    vencidos: boletos.filter(b => b.situacao === "VENCIDO").length,
    total: boletos.length,
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Receipt className="w-6 h-6" />
            Boletos
          </h1>
          <p className="text-muted-foreground">Gerencie boletos bancários</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{totalizadores.emitidos}</p>
              <p className="text-sm text-muted-foreground">Emitidos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{totalizadores.recebidos}</p>
              <p className="text-sm text-muted-foreground">Recebidos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{totalizadores.vencidos}</p>
              <p className="text-sm text-muted-foreground">Vencidos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600">{totalizadores.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar boletos..."
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
          <option value="EMITIDO">Emitido</option>
          <option value="ENVIADO">Enviado</option>
          <option value="BAIXADO">Baixado</option>
          <option value="VENCIDO">Vencido</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Banco</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Valor</TableHead>
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
              ) : boletos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Nenhum boleto encontrado
                  </TableCell>
                </TableRow>
              ) : (
                boletos.map((boleto) => (
                  <TableRow key={boleto.id}>
                    <TableCell className="font-medium">{boleto.numeroBoleto}</TableCell>
                    <TableCell>{(boleto as any).contaReceber?.cliente?.nome}</TableCell>
                    <TableCell>{(boleto as any).contaReceber?.numeroDocumento}</TableCell>
                    <TableCell>{(boleto as any).banco?.nome || "-"}</TableCell>
                    <TableCell>{new Date(boleto.dataVencimento).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>R$ {boleto.valorOriginal.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSituacaoBadge(boleto.situacao)}`}>
                        {boleto.situacao}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {boleto.situacao === "EMITIDO" || boleto.situacao === "ENVIADO" ? (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => baixar(boleto.id)}>
                              <Check className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => cancelar(boleto.id)}>
                              <X className="w-4 h-4 text-red-600" />
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default BoletosPage
