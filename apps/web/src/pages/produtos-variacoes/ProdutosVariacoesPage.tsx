import { useState, useEffect } from 'react';
import { Package, Search, Plus, Edit, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { produtosVariacoesService, ProdutoVariacao, CriarProdutoVariacaoDto } from '@/services/produtos-variacoes';
import { produtosService, Produto } from '@/services/produtos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ProdutosVariacoesPage() {
  const [variacoes, setVariacoes] = useState<ProdutoVariacao[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroProdutoId, setFiltroProdutoId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVariacao, setEditingVariacao] = useState<ProdutoVariacao | null>(null);
  const [formData, setFormData] = useState<CriarProdutoVariacaoDto>({
    produtoId: '',
    sku: '',
    nome: '',
    valor: '',
    precoAdicional: 0,
    estoque: 0,
    codigoBarras: '',
    ativo: true,
  });

  useEffect(() => {
    loadVariacoes();
    loadProdutos();
  }, [filtroProdutoId]);

  const loadVariacoes = async () => {
    try {
      setLoading(true);
      const response = await produtosVariacoesService.listar({
        produtoId: filtroProdutoId || undefined,
      });
      setVariacoes(response);
    } catch (error) {
      console.error('Erro ao carregar variações:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProdutos = async () => {
    try {
      const response = await produtosService.listar({});
      setProdutos(response);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVariacao) {
        await produtosVariacoesService.atualizar(editingVariacao.id, formData);
      } else {
        await produtosVariacoesService.criar(formData);
      }
      setShowModal(false);
      setEditingVariacao(null);
      resetForm();
      loadVariacoes();
    } catch (error) {
      console.error('Erro ao salvar variação:', error);
    }
  };

  const handleEdit = (variacao: ProdutoVariacao) => {
    setEditingVariacao(variacao);
    setFormData({
      produtoId: variacao.produtoId,
      sku: variacao.sku,
      nome: variacao.nome,
      valor: variacao.valor,
      precoAdicional: variacao.precoAdicional,
      estoque: variacao.estoque,
      codigoBarras: variacao.codigoBarras || '',
    });
    setShowModal(true);
  };

  const handleToggleAtivo = async (variacao: ProdutoVariacao) => {
    try {
      if (variacao.ativo) {
        await produtosVariacoesService.inativar(variacao.id);
      } else {
        await produtosVariacoesService.ativar(variacao.id);
      }
      loadVariacoes();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const handleDelete = async (variacao: ProdutoVariacao) => {
    if (!confirm(`Excluir variação "${variacao.nome}"?`)) return;
    try {
      await produtosVariacoesService.excluir(variacao.id);
      loadVariacoes();
    } catch (error) {
      console.error('Erro ao excluir variação:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      produtoId: '',
      sku: '',
      nome: '',
      valor: '',
      precoAdicional: 0,
      estoque: 0,
      codigoBarras: '',
      ativo: true,
    });
  };

  const openNewModal = () => {
    resetForm();
    setEditingVariacao(null);
    setShowModal(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Variações de Produtos</h1>
          <p className="text-gray-500">Gerencie variações como tamanhos, cores e versões</p>
        </div>
        <Button onClick={openNewModal}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Variação
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar variações..."
                className="pl-10"
              />
            </div>
            <div className="w-72">
              <Select
                value={filtroProdutoId}
                onValueChange={(value) => setFiltroProdutoId(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por produto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os produtos</SelectItem>
                  {produtos.map((produto) => (
                    <SelectItem key={produto.id} value={produto.id}>
                      {produto.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : variacoes.length === 0 ? (
          <div className="text-center p-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhuma variação encontrada</h3>
            <p className="mt-2 text-sm text-gray-500">
              Comece adicionando variações para seus produtos
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Preço Adicional</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Cód. Barras</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variacoes.map((variacao) => (
                  <TableRow key={variacao.id}>
                    <TableCell className="font-mono text-sm">{variacao.sku}</TableCell>
                    <TableCell className="font-medium">{variacao.nome}</TableCell>
                    <TableCell>{variacao.valor}</TableCell>
                    <TableCell className="font-medium text-green-600">
                      {formatCurrency(variacao.precoAdicional)}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        variacao.estoque <= 0
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {variacao.estoque}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{variacao.codigoBarras || '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleAtivo(variacao)}
                        className={`flex items-center gap-1 ${variacao.ativo ? 'text-green-600' : 'text-gray-400'}`}
                      >
                        {variacao.ativo ? (
                          <ToggleRight className="h-5 w-5" />
                        ) : (
                          <ToggleLeft className="h-5 w-5" />
                        )}
                        <span className="text-sm">{variacao.ativo ? 'Ativo' : 'Inativo'}</span>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(variacao)}
                          className="text-gray-600 hover:text-primary"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(variacao)}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>
              {editingVariacao ? 'Editar Variação' : 'Nova Variação'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="produtoId">Produto</Label>
                <Select
                  value={formData.produtoId}
                  onValueChange={(value) => setFormData({ ...formData, produtoId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {produtos.map((produto) => (
                      <SelectItem key={produto.id} value={produto.id}>
                        {produto.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  type="text"
                  placeholder="Ex: CAMISETA-M-BRANCA"
                  title="Código único alfanumérico para identificar a variação"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigoBarras">Código Barras</Label>
                <Input
                  id="codigoBarras"
                  type="text"
                  placeholder="Código de barras (EAN-13)"
                  title="Formato: 13 dígitos numéricos. Ex: 7891234567890"
                  value={formData.codigoBarras}
                  onChange={(e) => setFormData({ ...formData, codigoBarras: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Ex: Camiseta M, Azul, 42"
                  title="Descreva a característica específica da variação (tamanho, cor, versão)"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor</Label>
                <Input
                  id="valor"
                  type="text"
                  placeholder="Ex: 129,90"
                  title="Valor de venda da variação. Use vírgula para centavos"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precoAdicional">Preço Adicional</Label>
                <Input
                  id="precoAdicional"
                  type="number"
                  placeholder="0,00"
                  title="Acréscimo no preço em relação ao produto base. Use 0 se não houver adicional"
                  value={formData.precoAdicional}
                  onChange={(e) => setFormData({ ...formData, precoAdicional: Number(e.target.value) })}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estoque">Estoque</Label>
                <Input
                  id="estoque"
                  type="number"
                  placeholder="Quantidade disponível"
                  title="Informe a quantidade inicial em estoque. Apenas números inteiros"
                  value={formData.estoque}
                  onChange={(e) => setFormData({ ...formData, estoque: Number(e.target.value) })}
                  min="0"
                  step="1"
                />
              </div>
            </div>
            <DialogFooter className="pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingVariacao ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
