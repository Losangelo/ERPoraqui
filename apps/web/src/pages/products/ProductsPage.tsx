import { useState, useEffect } from 'react';
import { Package, Search, Plus, Edit, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { produtosService, Produto, CriarProdutoDto } from '@/services/produtos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export function ProductsPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
  const [formData, setFormData] = useState<CriarProdutoDto>({
    codigoInterno: '',
    codigoBarras: '',
    gtin: '',
    nome: '',
    descricao: '',
    precoVenda: 0,
    precoCusto: 0,
    precoMinimo: 0,
    quantidadeEstoque: 0,
    estoqueMinimo: 0,
    estoqueMaximo: 0,
    ncm: '',
    cest: '',
    origenMercadoria: 'NACIONAL',
  });

  useEffect(() => {
    loadProdutos();
  }, [search]);

  const loadProdutos = async () => {
    try {
      setLoading(true);
      const response = await produtosService.listar({ nome: search, ativo: true });
      setProdutos(response);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduto) {
        await produtosService.atualizar(editingProduto.id, formData);
      } else {
        await produtosService.criar(formData);
      }
      setShowModal(false);
      setEditingProduto(null);
      resetForm();
      loadProdutos();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleEdit = (produto: Produto) => {
    setEditingProduto(produto);
    setFormData({
      codigoInterno: produto.codigoInterno,
      codigoBarras: produto.codigoBarras || '',
      gtin: produto.gtin || '',
      nome: produto.nome,
      descricao: produto.descricao || '',
      precoVenda: produto.precoVenda,
      precoCusto: produto.precoCusto,
      precoMinimo: produto.precoMinimo,
      quantidadeEstoque: produto.quantidadeEstoque,
      estoqueMinimo: produto.estoqueMinimo,
      estoqueMaximo: produto.estoqueMaximo,
      ncm: produto.ncm || '',
      cest: produto.cest || '',
      origenMercadoria: produto.origenMercadoria,
    });
    setShowModal(true);
  };

  const handleToggleAtivo = async (produto: Produto) => {
    try {
      if (produto.ativo) {
        await produtosService.inativar(produto.id);
      } else {
        await produtosService.ativar(produto.id);
      }
      loadProdutos();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      codigoInterno: '',
      codigoBarras: '',
      gtin: '',
      nome: '',
      descricao: '',
      precoVenda: 0,
      precoCusto: 0,
      precoMinimo: 0,
      quantidadeEstoque: 0,
      estoqueMinimo: 0,
      estoqueMaximo: 0,
      ncm: '',
      cest: '',
      origenMercadoria: 'NACIONAL',
    });
  };

  const openNewModal = () => {
    resetForm();
    setEditingProduto(null);
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
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-500">Gerencie seu catálogo de produtos</p>
        </div>
        <Button onClick={openNewModal}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : produtos.length === 0 ? (
          <div className="text-center p-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum produto encontrado</h3>
            <p className="mt-2 text-sm text-gray-500">
              Comece adicionando seu primeiro produto
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cód. Interno</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cód. Barras</TableHead>
                  <TableHead>NCM</TableHead>
                  <TableHead>Preço Venda</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtos.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell className="font-mono text-sm">{produto.codigoInterno}</TableCell>
                    <TableCell className="font-medium">{produto.nome}</TableCell>
                    <TableCell className="font-mono text-sm">{produto.codigoBarras || '-'}</TableCell>
                    <TableCell className="font-mono text-sm">{produto.ncm || '-'}</TableCell>
                    <TableCell className="font-medium text-green-600">{formatCurrency(produto.precoVenda)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        produto.quantidadeEstoque <= produto.estoqueMinimo
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {produto.quantidadeEstoque}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleAtivo(produto)}
                        className={`flex items-center gap-1 ${produto.ativo ? 'text-green-600' : 'text-gray-400'}`}
                      >
                        {produto.ativo ? (
                          <ToggleRight className="h-5 w-5" />
                        ) : (
                          <ToggleLeft className="h-5 w-5" />
                        )}
                        <span className="text-sm">{produto.ativo ? 'Ativo' : 'Inativo'}</span>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(produto)}
                        className="text-gray-600 hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduto ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigoInterno">Código Interno</Label>
                <Input
                  id="codigoInterno"
                  type="text"
                  value={formData.codigoInterno}
                  onChange={(e) => setFormData({ ...formData, codigoInterno: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigoBarras">Código Barras</Label>
                <Input
                  id="codigoBarras"
                  type="text"
                  value={formData.codigoBarras}
                  onChange={(e) => setFormData({ ...formData, codigoBarras: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gtin">GTIN</Label>
                <Input
                  id="gtin"
                  type="text"
                  value={formData.gtin}
                  onChange={(e) => setFormData({ ...formData, gtin: e.target.value })}
                />
              </div>
              <div className="col-span-3 space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-3 space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  type="text"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ncm">NCM</Label>
                <Input
                  id="ncm"
                  type="text"
                  value={formData.ncm}
                  onChange={(e) => setFormData({ ...formData, ncm: e.target.value })}
                  maxLength={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cest">CEST</Label>
                <Input
                  id="cest"
                  type="text"
                  value={formData.cest}
                  onChange={(e) => setFormData({ ...formData, cest: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="origenMercadoria">Origem</Label>
                <Input
                  id="origenMercadoria"
                  type="text"
                  value={formData.origenMercadoria}
                  onChange={(e) => setFormData({ ...formData, origenMercadoria: e.target.value as any })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precoCusto">Preço Custo</Label>
                <Input
                  id="precoCusto"
                  type="number"
                  value={formData.precoCusto}
                  onChange={(e) => setFormData({ ...formData, precoCusto: Number(e.target.value) })}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precoVenda">Preço Venda</Label>
                <Input
                  id="precoVenda"
                  type="number"
                  value={formData.precoVenda}
                  onChange={(e) => setFormData({ ...formData, precoVenda: Number(e.target.value) })}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precoMinimo">Preço Mínimo</Label>
                <Input
                  id="precoMinimo"
                  type="number"
                  value={formData.precoMinimo}
                  onChange={(e) => setFormData({ ...formData, precoMinimo: Number(e.target.value) })}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantidadeEstoque">Estoque Atual</Label>
                <Input
                  id="quantidadeEstoque"
                  type="number"
                  value={formData.quantidadeEstoque}
                  onChange={(e) => setFormData({ ...formData, quantidadeEstoque: Number(e.target.value) })}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estoqueMinimo">Estoque Mínimo</Label>
                <Input
                  id="estoqueMinimo"
                  type="number"
                  value={formData.estoqueMinimo}
                  onChange={(e) => setFormData({ ...formData, estoqueMinimo: Number(e.target.value) })}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estoqueMaximo">Estoque Máximo</Label>
                <Input
                  id="estoqueMaximo"
                  type="number"
                  value={formData.estoqueMaximo}
                  onChange={(e) => setFormData({ ...formData, estoqueMaximo: Number(e.target.value) })}
                  min="0"
                  step="0.01"
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
                {editingProduto ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
