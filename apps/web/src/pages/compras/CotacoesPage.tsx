import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { LookupField } from '@/components/lookup/LookupField';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { comprasService, CotacaoCompra } from '@/services/compras';
import { api } from '@/services/api';
import toast from 'react-hot-toast';
import {
  FileText,
  Plus,
  Trash2,
  Send,
  CheckCircle,
  Clock,
  Search,
  Package,
  Grid3X3,
} from 'lucide-react';

interface ItemCotacao {
  produtoId: string;
  produtoNome: string;
  quantidade: number;
  unidadeMedida: string;
}

const SITUACOES = [
  { value: 'ABERTA', label: 'Aberta', cor: 'bg-blue-100 text-blue-800' },
  { value: 'FECHADA', label: 'Fechada', cor: 'bg-green-100 text-green-800' },
  { value: 'CANCELADA', label: 'Cancelada', cor: 'bg-red-100 text-red-800' },
];

export function CotacoesPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itens, setItens] = useState<ItemCotacao[]>([]);
  const [formData, setFormData] = useState({
    dataValidade: '',
    observacoes: '',
  });
  const [productSheetOpen, setProductSheetOpen] = useState(false);
  const [sheetSearch, setSheetSearch] = useState('');
  const [sheetProdutos, setSheetProdutos] = useState<any[]>([]);
  const [sheetLoading, setSheetLoading] = useState(false);

  const { data: cotacoes, isLoading } = useQuery<CotacaoCompra[]>({
    queryKey: ['cotacoes-compra'],
    queryFn: () => comprasService.listarCotacoes(),
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => comprasService.criarCotacao(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cotacoes-compra'] });
      setDialogOpen(false);
      setFormData({ dataValidade: '', observacoes: '' });
      setItens([]);
      toast.success('Cotação criada com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || error.message);
    },
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => comprasService.excluirCotacao(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cotacoes-compra'] });
      toast.success('Cotação excluída');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || error.message);
    },
  });

  function addItem() {
    setItens([...itens, { produtoId: '', produtoNome: '', quantidade: 1, unidadeMedida: 'UN' }]);
  }

  function updateItem(index: number, field: string, value: any) {
    const newItens = [...itens];
    (newItens[index] as any)[field] = value;
    setItens(newItens);
  }

  function removeItem(index: number) {
    setItens(itens.filter((_, i) => i !== index));
  }

  async function loadSheetProdutos() {
    setSheetLoading(true);
    try {
      const params = new URLSearchParams();
      if (sheetSearch) params.append('nome', sheetSearch);
      params.append('limite', '50');
      const res = await api.get(`/produtos?${params}`);
      const data = res.data?.dados || res.data?.data || res.data || [];
      setSheetProdutos(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Erro ao carregar produtos');
    } finally {
      setSheetLoading(false);
    }
  }

  function addSheetItem(produto: any) {
    setItens([...itens, {
      produtoId: produto.id,
      produtoNome: produto.nome,
      quantidade: 1,
      unidadeMedida: 'UN',
    }]);
    toast.success(`${produto.nome} adicionado`);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (itens.length === 0) {
      toast.error('Adicione pelo menos um item');
      return;
    }

    criarMutation.mutate({
      dataValidade: formData.dataValidade || null,
      observacoes: formData.observacoes,
      itens: itens.map((item, index) => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        unidadeMedida: item.unidadeMedida,
        numeroItem: index + 1,
      })),
    });
  };

  const getSituacaoBadge = (situacao: string) => {
    const s = SITUACOES.find(x => x.value === situacao);
    return <Badge className={s?.cor}>{s?.label || situacao}</Badge>;
  };

  const totalCotacoes = cotacoes?.length || 0;
  const abertas = cotacoes?.filter(c => c.situacao === 'ABERTA').length || 0;
  const fechadas = cotacoes?.filter(c => c.situacao === 'FECHADA').length || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Cotações de Compra
          </h1>
          <p className="text-muted-foreground">Gerencie cotações para fornecedores</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Cotação
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCotacoes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abertas</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{abertas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fechadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{fechadas}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cotações</CardTitle>
          <CardDescription>Lista de cotações de compra</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : cotacoes?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma cotação encontrada.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Número</th>
                    <th className="text-left p-2">Data Abertura</th>
                    <th className="text-left p-2">Validade</th>
                    <th className="text-center p-2">Itens</th>
                    <th className="text-center p-2">Situação</th>
                    <th className="text-center p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {cotacoes?.map((cotacao) => (
                    <tr key={cotacao.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{cotacao.numeroCotacao}</td>
                      <td className="p-2">
                        {new Date(cotacao.dataAbertura).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-2">
                        {cotacao.dataValidade
                          ? new Date(cotacao.dataValidade).toLocaleDateString('pt-BR')
                          : '-'}
                      </td>
                      <td className="p-2 text-center">{cotacao.itens?.length || 0}</td>
                      <td className="p-2 text-center">
                        {getSituacaoBadge(cotacao.situacao)}
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex justify-center gap-1">
                          {cotacao.situacao === 'ABERTA' && (
                            <Button variant="outline" size="sm">
                              <Send className="h-4 w-4 text-blue-500" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (confirm('Deseja excluir esta cotação?')) {
                                excluirMutation.mutate(cotacao.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Cotação de Compra</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="dataValidade">Data Validade</Label>
                <Input
                  id="dataValidade"
                  type="date"
                  value={formData.dataValidade}
                  onChange={(e) => setFormData({ ...formData, dataValidade: e.target.value })}
                  title="Data de validade da cotação"
                />
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Itens Solicitados <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => { setProductSheetOpen(true); setSheetSearch(''); }}>
                      <Grid3X3 className="w-4 h-4 mr-1" />
                      Buscar Produtos
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={addItem}>
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar Item
                    </Button>
                  </div>
                </div>

                {itens.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum item adicionado. Clique em "Buscar Produtos" ou "Adicionar Item" para começar.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {itens.map((item, index) => (
                      <div key={index} className="flex gap-2 items-start p-2 rounded-lg border bg-muted/30">
                        <div className="flex-1 min-w-0">
                          <LookupField
                            source="produtos"
                            value={item.produtoId}
                            selectedLabel={item.produtoNome}
                            onChange={(p) => { updateItem(index, 'produtoId', p.id); updateItem(index, 'produtoNome', p.nome) }}
                            onClear={() => { updateItem(index, 'produtoId', ''); updateItem(index, 'produtoNome', '') }}
                            placeholder="Buscar produto por nome, código ou código de barras..."
                          />
                        </div>
                        <div className="w-20 shrink-0">
                          <Label className="text-xs text-muted-foreground">Qtd</Label>
                          <Input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={item.quantidade}
                            onChange={(e) => updateItem(index, 'quantidade', parseFloat(e.target.value) || 0)}
                            placeholder="Qtd"
                            title="Quantidade de unidades do produto"
                          />
                        </div>
                        <div className="w-20 shrink-0">
                          <Label className="text-xs text-muted-foreground">Un.</Label>
                          <Input
                            placeholder="Ex: UN, KG, LT"
                            value={item.unidadeMedida}
                            onChange={(e) => updateItem(index, 'unidadeMedida', e.target.value)}
                            title="Unidade de medida do produto"
                          />
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="mt-4 shrink-0" onClick={() => removeItem(index)} title="Remover item">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="observacoes">Observações</Label>
                <textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Observações adicionais sobre a cotação, como prazos de entrega esperados, condições de pagamento, etc."
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  title="Observações adicionais sobre a cotação"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={criarMutation.isPending}>
                {criarMutation.isPending ? 'Criando...' : 'Criar Cotação'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Sheet open={productSheetOpen} onOpenChange={setProductSheetOpen}>
        <SheetContent side="right" className="w-full max-w-2xl p-0 flex flex-col">
          <SheetHeader className="px-4 pt-4 pb-2 border-b">
            <SheetTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Buscar Produtos
            </SheetTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produto por nome, código ou código de barras..."
                value={sheetSearch}
                onChange={(e) => setSheetSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') loadSheetProdutos() }}
                className="pl-10"
                title="Digite o nome, código interno ou código de barras do produto"
              />
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4">
            {sheetLoading ? (
              <div className="text-center py-12 text-muted-foreground">Carregando produtos...</div>
            ) : sheetProdutos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {sheetSearch ? 'Nenhum produto encontrado' : 'Digite um termo para buscar produtos'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sheetProdutos.map((p: any) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => { addSheetItem(p); setProductSheetOpen(false) }}
                    className="text-left p-4 rounded-lg border hover:bg-accent hover:border-primary transition-all"
                  >
                    <p className="font-medium truncate">{p.nome}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-lg font-bold text-primary">R$ {(p.precoVenda || 0).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Estoque: {p.quantidadeEstoque ?? '—'}</p>
                    </div>
                    {p.codigoBarras && (
                      <p className="text-xs text-muted-foreground mt-1">Cód. Barras: {p.codigoBarras}</p>
                    )}
                    {p.ncm && (
                      <p className="text-xs text-muted-foreground">NCM: {p.ncm}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
