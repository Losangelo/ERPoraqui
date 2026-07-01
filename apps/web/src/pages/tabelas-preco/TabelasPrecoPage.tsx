import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { tabelasPrecoService, TabelaPreco, TabelaPrecoItem } from '@/services/tabelas-preco';
import { produtosService, Produto } from '@/services/produtos';
import { Plus, Search, ChevronDown, ChevronRight, Pencil, Trash2, Percent, Calculator } from 'lucide-react';

const tipoVariants: Record<string, 'default' | 'secondary' | 'warning' | 'success'> = {
  VISTA: 'default',
  PRAZO: 'secondary',
  PROMOCAO: 'warning',
  ESPECIAL: 'success',
};

const tipoLabels: Record<string, string> = {
  VISTA: 'À Vista',
  PRAZO: 'A Prazo',
  PROMOCAO: 'Promoção',
  ESPECIAL: 'Especial',
};

interface ItemFormData {
  produtoId: string;
  precoVenda: number;
  precoMinimo: number;
  descontoMaximo: number;
}

const emptyItemForm: ItemFormData = {
  produtoId: '',
  precoVenda: 0,
  precoMinimo: 0,
  descontoMaximo: 0,
};

export default function TabelasPrecoPage() {
  const [tabelas, setTabelas] = useState<TabelaPreco[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<TabelaPreco | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [itensExpandidos, setItensExpandidos] = useState<TabelaPrecoItem[]>([]);
  const [loadingItens, setLoadingItens] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [itemForm, setItemForm] = useState<ItemFormData>(emptyItemForm);
  const [itemEditando, setItemEditando] = useState<TabelaPrecoItem | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    tipo: 'VISTA' as 'VISTA' | 'PRAZO' | 'PROMOCAO' | 'ESPECIAL',
    markupBase: 0,
    ativo: true,
  });

  useEffect(() => {
    loadTabelas();
    loadProdutos();
  }, []);

  const loadTabelas = async () => {
    setLoading(true);
    try {
      const data = await tabelasPrecoService.listar({ nome: search || undefined });
      setTabelas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar tabelas:', error);
      setTabelas([]);
    }
    setLoading(false);
  };

  const loadProdutos = async () => {
    try {
      const data = await produtosService.listar({ limite: 500 });
      setProdutos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const toggleExpandir = async (tabela: TabelaPreco) => {
    if (expandedId === tabela.id) {
      setExpandedId(null);
      setItensExpandidos([]);
      return;
    }
    setExpandedId(tabela.id);
    setLoadingItens(true);
    try {
      const data = await tabelasPrecoService.listarItens(tabela.id);
      setItensExpandidos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
      setItensExpandidos([]);
    }
    setLoadingItens(false);
  };

  const handleOpenNew = () => {
    setEditando(null);
    setFormData({ nome: '', descricao: '', tipo: 'VISTA', markupBase: 0, ativo: true });
    setDialogOpen(true);
  };

  const handleEdit = (tabela: TabelaPreco) => {
    setEditando(tabela);
    setFormData({
      nome: tabela.nome,
      descricao: tabela.descricao || '',
      tipo: tabela.tipo,
      markupBase: tabela.markupBase,
      ativo: tabela.ativo,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editando) {
        await tabelasPrecoService.atualizar(editando.id, formData);
      } else {
        await tabelasPrecoService.criar(formData);
      }
      setDialogOpen(false);
      loadTabelas();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleCalcular = async (id: string) => {
    try {
      await tabelasPrecoService.calcularPrecos(id);
      alert('Preços recalculados com sucesso!');
      if (expandedId === id) {
        const data = await tabelasPrecoService.listarItens(id);
        setItensExpandidos(Array.isArray(data) ? data : []);
      }
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleOpenNewItem = () => {
    setItemEditando(null);
    setItemForm(emptyItemForm);
    setItemDialogOpen(true);
  };

  const handleEditItem = (item: TabelaPrecoItem) => {
    setItemEditando(item);
    setItemForm({
      produtoId: item.produtoId,
      precoVenda: item.precoVenda,
      precoMinimo: item.precoMinimo,
      descontoMaximo: item.descontoMaximo,
    });
    setItemDialogOpen(true);
  };

  const handleSubmitItem = async () => {
    if (!expandedId) return;
    try {
      if (itemEditando) {
        await tabelasPrecoService.atualizarItem(expandedId, itemEditando.id, {
          precoVenda: itemForm.precoVenda,
          precoMinimo: itemForm.precoMinimo,
          descontoMaximo: itemForm.descontoMaximo,
        });
      } else {
        await tabelasPrecoService.adicionarItem(expandedId, itemForm);
      }
      setItemDialogOpen(false);
      const data = await tabelasPrecoService.listarItens(expandedId);
      setItensExpandidos(Array.isArray(data) ? data : []);
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!expandedId) return;
    if (!confirm('Remover este item da tabela?')) return;
    try {
      await tabelasPrecoService.removerItem(expandedId, itemId);
      const data = await tabelasPrecoService.listarItens(expandedId);
      setItensExpandidos(Array.isArray(data) ? data : []);
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tabelas de Preço</h1>
          <p className="text-muted-foreground">Gerenciamento de tabelas de preço e markup</p>
        </div>
        <Button onClick={handleOpenNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Tabela
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome..."
            title="Digite parte do nome da tabela para filtrar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={loadTabelas}>
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Markup Base</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">Carregando...</TableCell>
                </TableRow>
              ) : tabelas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhuma tabela de preço encontrada
                  </TableCell>
                </TableRow>
              ) : (
                tabelas.map((tabela) => (
                  <>
                    <TableRow key={tabela.id} className="cursor-pointer hover:bg-muted/50" onClick={() => toggleExpandir(tabela)}>
                      <TableCell>
                        {expandedId === tabela.id ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{tabela.nome}</TableCell>
                      <TableCell className="text-muted-foreground">{tabela.descricao || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={tipoVariants[tabela.tipo] || 'default'}>
                          {tipoLabels[tabela.tipo] || tabela.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="flex items-center justify-end gap-1">
                          <Percent className="h-3 w-3" />
                          {tabela.markupBase}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={tabela.ativo ? 'success' : 'secondary'}>
                          {tabela.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleEdit(tabela); }}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleCalcular(tabela.id); }}>
                            <Calculator className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedId === tabela.id && (
                      <TableRow key={`${tabela.id}-itens`}>
                        <TableCell colSpan={7} className="bg-muted/30 p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold">Itens da Tabela</h4>
                              <Button size="sm" onClick={handleOpenNewItem}>
                                <Plus className="h-3 w-3 mr-1" />
                                Adicionar Produto
                              </Button>
                            </div>
                            {loadingItens ? (
                              <p className="text-sm text-muted-foreground py-2">Carregando itens...</p>
                            ) : itensExpandidos.length === 0 ? (
                              <p className="text-sm text-muted-foreground py-2">Nenhum item cadastrado</p>
                            ) : (
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Produto</TableHead>
                                    <TableHead className="text-right">Preço Venda</TableHead>
                                    <TableHead className="text-right">Preço Mínimo</TableHead>
                                    <TableHead className="text-right">Desconto Máx.</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {itensExpandidos.map((item) => (
                                    <TableRow key={item.id}>
                                      <TableCell>{item.produto?.nome || item.produtoId}</TableCell>
                                      <TableCell className="text-right font-medium">{formatCurrency(item.precoVenda)}</TableCell>
                                      <TableCell className="text-right">{formatCurrency(item.precoMinimo)}</TableCell>
                                      <TableCell className="text-right">{item.descontoMaximo}%</TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex gap-1 justify-end">
                                          <Button variant="ghost" size="sm" onClick={() => handleEditItem(item)}>
                                            <Pencil className="h-3 w-3" />
                                          </Button>
                                          <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.id)}>
                                            <Trash2 className="h-3 w-3 text-red-500" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{editando ? 'Editar Tabela de Preço' : 'Nova Tabela de Preço'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Nome</Label>
                <Input
                  placeholder="Nome da tabela de preço"
                  title="Ex: Tabela Padrão - À Vista"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Tipo</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(v: 'VISTA' | 'PRAZO' | 'PROMOCAO' | 'ESPECIAL') => setFormData({ ...formData, tipo: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VISTA">À Vista</SelectItem>
                    <SelectItem value="PRAZO">A Prazo</SelectItem>
                    <SelectItem value="PROMOCAO">Promoção</SelectItem>
                    <SelectItem value="ESPECIAL">Especial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Descrição</Label>
              <Input
                placeholder="Descrição da tabela de preço"
                title="Descrição opcional para identificar a finalidade da tabela"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Markup Base (%)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 25.50"
                  title="Valor percentual do markup base (aceita decimais)"
                  value={formData.markupBase}
                  onChange={(e) => setFormData({ ...formData, markupBase: parseFloat(e.target.value) || 0 })}
                  min={0}
                  step={0.01}
                />
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={formData.ativo ? 'true' : 'false'}
                  onValueChange={(v) => setFormData({ ...formData, ativo: v === 'true' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Ativo</SelectItem>
                    <SelectItem value="false">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{itemEditando ? 'Editar Item' : 'Adicionar Produto'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {!itemEditando && (
              <div className="grid gap-2">
                <Label>Produto</Label>
                <Select
                  value={itemForm.produtoId}
                  onValueChange={(v) => setItemForm({ ...itemForm, produtoId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {produtos.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.codigoInterno} - {p.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Preço Venda</Label>
                <Input
                  type="number"
                  placeholder="0,00"
                  title="Valor de venda do produto nesta tabela"
                  value={itemForm.precoVenda}
                  onChange={(e) => setItemForm({ ...itemForm, precoVenda: parseFloat(e.target.value) || 0 })}
                  min={0}
                  step={0.01}
                />
              </div>
              <div className="grid gap-2">
                <Label>Preço Mínimo</Label>
                <Input
                  type="number"
                  placeholder="0,00"
                  title="Valor mínimo permitido para negociação"
                  value={itemForm.precoMinimo}
                  onChange={(e) => setItemForm({ ...itemForm, precoMinimo: parseFloat(e.target.value) || 0 })}
                  min={0}
                  step={0.01}
                />
              </div>
              <div className="grid gap-2">
                <Label>Desconto Máx. (%)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 10.0"
                  title="Percentual máximo de desconto permitido (0 a 100)"
                  value={itemForm.descontoMaximo}
                  onChange={(e) => setItemForm({ ...itemForm, descontoMaximo: parseFloat(e.target.value) || 0 })}
                  min={0}
                  max={100}
                  step={0.1}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setItemDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmitItem}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
