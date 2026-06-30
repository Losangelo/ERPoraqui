import { useState, useEffect } from 'react';
import { Package, Search, Plus, Edit, ToggleLeft, ToggleRight, Loader2, PackageCheck } from 'lucide-react';
import { produtosLotesService, ProdutoLote, CriarProdutoLoteDto } from '@/services/produtos-lotes';
import { produtosService, Produto } from '@/services/produtos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export function ProdutosLotesPage() {
  const [lotes, setLotes] = useState<ProdutoLote[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroProdutoId, setFiltroProdutoId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAjusteModal, setShowAjusteModal] = useState(false);
  const [ajusteLote, setAjusteLote] = useState<ProdutoLote | null>(null);
  const [ajusteQuantidade, setAjusteQuantidade] = useState(0);
  const [ajusteMotivo, setAjusteMotivo] = useState('');
  const [editingLote, setEditingLote] = useState<ProdutoLote | null>(null);
  const [formData, setFormData] = useState<CriarProdutoLoteDto>({
    produtoId: '',
    codigoLote: '',
    dataFabricacao: '',
    dataValidade: '',
    quantidade: 0,
    quantidadeOriginal: 0,
    custoUnitario: 0,
    ativo: true,
  });

  useEffect(() => {
    loadLotes();
    loadProdutos();
  }, [filtroProdutoId]);

  const loadLotes = async () => {
    try {
      setLoading(true);
      const response = await produtosLotesService.listar({
        produtoId: filtroProdutoId || undefined,
      });
      setLotes(response);
    } catch (error) {
      console.error('Erro ao carregar lotes:', error);
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
      const payload = {
        ...formData,
        dataFabricacao: formData.dataFabricacao ? new Date(formData.dataFabricacao).toISOString() : undefined,
        dataValidade: formData.dataValidade ? new Date(formData.dataValidade).toISOString() : undefined,
      };
      if (editingLote) {
        await produtosLotesService.atualizar(editingLote.id, payload);
      } else {
        await produtosLotesService.criar(payload);
      }
      setShowModal(false);
      setEditingLote(null);
      resetForm();
      loadLotes();
    } catch (error) {
      console.error('Erro ao salvar lote:', error);
    }
  };

  const handleEdit = (lote: ProdutoLote) => {
    setEditingLote(lote);
    setFormData({
      produtoId: lote.produtoId,
      codigoLote: lote.codigoLote,
      dataFabricacao: lote.dataFabricacao ? lote.dataFabricacao.slice(0, 10) : '',
      dataValidade: lote.dataValidade ? lote.dataValidade.slice(0, 10) : '',
      quantidade: lote.quantidade,
      quantidadeOriginal: lote.quantidadeOriginal,
      custoUnitario: lote.custoUnitario,
    });
    setShowModal(true);
  };

  const handleToggleAtivo = async (lote: ProdutoLote) => {
    try {
      if (lote.ativo) {
        await produtosLotesService.inativar(lote.id);
      } else {
        await produtosLotesService.atualizar(lote.id, { ativo: true });
      }
      loadLotes();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const openAjusteEstoque = (lote: ProdutoLote) => {
    setAjusteLote(lote);
    setAjusteQuantidade(lote.quantidade);
    setAjusteMotivo('');
    setShowAjusteModal(true);
  };

  const handleAjusteEstoque = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ajusteLote) return;
    try {
      await produtosLotesService.ajustarEstoque(ajusteLote.id, {
        quantidade: ajusteQuantidade,
        motivo: ajusteMotivo || undefined,
      });
      setShowAjusteModal(false);
      setAjusteLote(null);
      loadLotes();
    } catch (error) {
      console.error('Erro ao ajustar estoque:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      produtoId: '',
      codigoLote: '',
      dataFabricacao: '',
      dataValidade: '',
      quantidade: 0,
      quantidadeOriginal: 0,
      custoUnitario: 0,
      ativo: true,
    });
  };

  const openNewModal = () => {
    resetForm();
    setEditingLote(null);
    setShowModal(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Intl.DateTimeFormat('pt-BR').format(new Date(dateStr));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lotes de Produtos</h1>
          <p className="text-gray-500">Gerencie lotes, validades e custos</p>
        </div>
        <Button onClick={openNewModal}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Lote
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar lotes..."
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
        ) : lotes.length === 0 ? (
          <div className="text-center p-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum lote encontrado</h3>
            <p className="mt-2 text-sm text-gray-500">
              Comece adicionando lotes para seus produtos
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cód. Lote</TableHead>
                  <TableHead>Fabricação</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Custo Unitário</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lotes.map((lote) => (
                  <TableRow key={lote.id}>
                    <TableCell className="font-mono text-sm font-medium">{lote.codigoLote}</TableCell>
                    <TableCell className="text-sm">{formatDate(lote.dataFabricacao)}</TableCell>
                    <TableCell className="text-sm">{formatDate(lote.dataValidade)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        lote.quantidade <= 0
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {lote.quantidade}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(lote.custoUnitario)}</TableCell>
                    <TableCell>
                      <Badge variant={lote.ativo ? 'default' : 'secondary'}>
                        {lote.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(lote)}
                          className="text-gray-600 hover:text-primary"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openAjusteEstoque(lote)}
                          className="text-gray-600 hover:text-primary gap-1"
                        >
                          <PackageCheck className="h-4 w-4" />
                          <span className="text-xs">Ajustar Estoque</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleAtivo(lote)}
                          className={`flex items-center gap-1 ${lote.ativo ? 'text-green-600' : 'text-gray-400'}`}
                        >
                          {lote.ativo ? (
                            <ToggleRight className="h-4 w-4" />
                          ) : (
                            <ToggleLeft className="h-4 w-4" />
                          )}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLote ? 'Editar Lote' : 'Novo Lote'}
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
              <div className="col-span-2 space-y-2">
                <Label htmlFor="codigoLote">Código do Lote</Label>
                <Input
                  id="codigoLote"
                  type="text"
                  value={formData.codigoLote}
                  onChange={(e) => setFormData({ ...formData, codigoLote: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataFabricacao">Data Fabricação</Label>
                <Input
                  id="dataFabricacao"
                  type="date"
                  value={formData.dataFabricacao}
                  onChange={(e) => setFormData({ ...formData, dataFabricacao: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataValidade">Data Validade</Label>
                <Input
                  id="dataValidade"
                  type="date"
                  value={formData.dataValidade}
                  onChange={(e) => setFormData({ ...formData, dataValidade: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  id="quantidade"
                  type="number"
                  value={formData.quantidade}
                  onChange={(e) => setFormData({ ...formData, quantidade: Number(e.target.value) })}
                  min="0"
                  step="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantidadeOriginal">Quantidade Original</Label>
                <Input
                  id="quantidadeOriginal"
                  type="number"
                  value={formData.quantidadeOriginal}
                  onChange={(e) => setFormData({ ...formData, quantidadeOriginal: Number(e.target.value) })}
                  min="0"
                  step="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custoUnitario">Custo Unitário</Label>
                <Input
                  id="custoUnitario"
                  type="number"
                  value={formData.custoUnitario}
                  onChange={(e) => setFormData({ ...formData, custoUnitario: Number(e.target.value) })}
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
                {editingLote ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showAjusteModal} onOpenChange={setShowAjusteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajustar Estoque</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAjusteEstoque} className="space-y-4">
            <div className="space-y-2">
              <Label>Lote</Label>
              <p className="text-sm font-medium">{ajusteLote?.codigoLote}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ajusteQuantidade">Nova Quantidade</Label>
              <Input
                id="ajusteQuantidade"
                type="number"
                value={ajusteQuantidade}
                onChange={(e) => setAjusteQuantidade(Number(e.target.value))}
                min="0"
                step="1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ajusteMotivo">Motivo</Label>
              <Input
                id="ajusteMotivo"
                type="text"
                value={ajusteMotivo}
                onChange={(e) => setAjusteMotivo(e.target.value)}
                placeholder="Ex: Ajuste manual de inventário"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAjusteModal(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Confirmar Ajuste
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
