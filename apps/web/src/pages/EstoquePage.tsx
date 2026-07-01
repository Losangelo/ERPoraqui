import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, PackageCheck, Eye } from "lucide-react"
import { produtosService, Produto } from "@/services/produtos"

export function EstoquePage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(false)
  const [busca, setBusca] = useState("")
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null)

  useEffect(() => {
    loadProdutos()
  }, [busca])

  async function loadProdutos() {
    setLoading(true)
    try {
      const response = await produtosService.listar({ nome: busca, limite: 50 })
      setProdutos(response)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalEstoque = produtos.reduce((acc, p) => acc + p.quantidadeEstoque, 0)
  const totalValor = produtos.reduce((acc, p) => acc + (p.quantidadeEstoque * p.precoVenda), 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <PackageCheck className="w-6 h-6" />
            Estoque
          </h1>
          <p className="text-muted-foreground">Consulta de estoque de produtos</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{produtos.length}</p>
              <p className="text-sm text-muted-foreground">Produtos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{totalEstoque.toLocaleString("pt-BR")}</p>
              <p className="text-sm text-muted-foreground">Total Unidades</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">R$ {totalValor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              <p className="text-sm text-muted-foreground">Valor Total Estoque</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar produtos..."
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
                <TableHead>Código</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead className="text-right">Estoque</TableHead>
                <TableHead className="text-right">Valor Unit.</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
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
              ) : produtos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              ) : (
                produtos.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell className="font-medium">{produto.codigoInterno}</TableCell>
                    <TableCell>{produto.nome}</TableCell>
                    <TableCell className="text-right">{produto.quantidadeEstoque}</TableCell>
                    <TableCell className="text-right">R$ {produto.precoVenda.toFixed(2)}</TableCell>
                    <TableCell className="text-right">R$ {(produto.quantidadeEstoque * produto.precoVenda).toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => setProdutoSelecionado(produto)}>
                          <Eye className="w-4 h-4 text-blue-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!produtoSelecionado} onOpenChange={() => setProdutoSelecionado(null)}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Detalhes do Produto</DialogTitle>
          </DialogHeader>
          {produtoSelecionado && (
            <div className="grid gap-3 py-4">
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Código:</strong></div>
                <div>{produtoSelecionado.codigoInterno}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Nome:</strong></div>
                <div>{produtoSelecionado.nome}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Estoque:</strong></div>
                <div>{produtoSelecionado.quantidadeEstoque}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Preço Venda:</strong></div>
                <div>R$ {produtoSelecionado.precoVenda.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Preço Custo:</strong></div>
                <div>R$ {produtoSelecionado.precoCusto?.toFixed(2) || "0,00"}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><strong>NCM:</strong></div>
                <div>{produtoSelecionado.ncm || "-"}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EstoquePage
