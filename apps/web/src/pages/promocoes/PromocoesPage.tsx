import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { promocoesService, Promocao } from '@/services/promocoes';
import { produtosService, Produto } from '@/services/produtos';
import { Plus, Search, Pencil, Trash2, Power, PowerOff } from 'lucide-react';
import { LookupField } from '@/components/lookup/LookupField';

const tipoDescontoLabels: Record<string, string> = {
  PERCENTUAL: 'Percentual',
  VALOR_FIXO: 'Valor Fixo',
  LEVE_PAGUE: 'Leve X Pague Y',
};

const tipoDescontoVariants: Record<string, 'default' | 'secondary' | 'warning' | 'success'> = {
  PERCENTUAL: 'default',
  VALOR_FIXO: 'secondary',
  LEVE_PAGUE: 'warning',
};

const aplicaProdutosLabels: Record<string, string> = {
  TODOS: 'Todos os Produtos',
  SELECIONADOS: 'Produtos Selecionados',
};

interface PromocaoFormData {
  nome: string;
  descricao: string;
  tipoDesconto: 'PERCENTUAL' | 'VALOR_FIXO' | 'LEVE_PAGUE';
  valorDesconto: number;
  qtdMinima: number | null;
  qtdCobrar: number | null;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
  aplicaProdutos: 'TODOS' | 'SELECIONADOS';
  itens: { produtoId: string; precoPromocional?: number }[];
}

const emptyFormData: PromocaoFormData = {
  nome: '',
  descricao: '',
  tipoDesconto: 'PERCENTUAL',
  valorDesconto: 0,
  qtdMinima: null,
  qtdCobrar: null,
  dataInicio: '',
  dataFim: '',
  ativo: true,
  aplicaProdutos: 'TODOS',
  itens: [],
};

export default function PromocoesPage() {
  const [promocoes, setPromocoes] = useState<Promocao[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Promocao | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [formData, setFormData] = useState<PromocaoFormData>(emptyFormData);

  useEffect(() => {
    loadPromocoes();
    loadProdutos();
  }, []);

  const loadPromocoes = async () => {
    setLoading(true);
    try {
      const data = await promocoesService.listar({ nome: search || undefined });
      setPromocoes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar promoções:', error);
      setPromocoes([]);
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

  const handleOpenNew = () => {
    setEditando(null);
    setFormData(emptyFormData);
    setDialogOpen(true);
  };

  const handleEdit = (promocao: Promocao) => {
    setEditando(promocao);
    setFormData({
      nome: promocao.nome,
      descricao: promocao.descricao || '',
      tipoDesconto: promocao.tipoDesconto,
      valorDesconto: promocao.valorDesconto,
      qtdMinima: promocao.qtdMinima,
      qtdCobrar: promocao.qtdCobrar,
      dataInicio: promocao.dataInicio.slice(0, 16),
      dataFim: promocao.dataFim.slice(0, 16),
      ativo: promocao.ativo,
      aplicaProdutos: promocao.aplicaProdutos,
      itens: promocao.itens?.map((i) => ({
        produtoId: i.produtoId,
        precoPromocional: i.precoPromocional ?? undefined,
      })) || [],
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        qtdMinima: formData.qtdMinima ?? undefined,
        qtdCobrar: formData.qtdCobrar ?? undefined,
        itens: formData.aplicaProdutos === 'SELECIONADOS' ? formData.itens : undefined,
      };

      if (editando) {
        await promocoesService.atualizar(editando.id, payload);
      } else {
        await promocoesService.criar(payload);
      }
      setDialogOpen(false);
      loadPromocoes();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleToggleAtivo = async (id: string) => {
    try {
      await promocoesService.toggleAtivo(id);
      loadPromocoes();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleExcluir = async (id: string) => {
    if (!confirm('Excluir esta promoção?')) return;
    try {
      await promocoesService.excluir(id);
      loadPromocoes();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const addProdutoItem = (produto: Produto) => {
    if (formData.itens.some((i) => i.produtoId === produto.id)) return;
    setFormData({
      ...formData,
      itens: [...formData.itens, { produtoId: produto.id, precoPromocional: undefined }],
    });
  };

  const removeProdutoItem = (produtoId: string) => {
    setFormData({
      ...formData,
      itens: formData.itens.filter((i) => i.produtoId !== produtoId),
    });
  };

  const updateProdutoPreco = (produtoId: string, precoPromocional: number | undefined) => {
    setFormData({
      ...formData,
      itens: formData.itens.map((i) =>
        i.produtoId === produtoId ? { ...i, precoPromocional } : i
      ),
    });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Promoções</h1>
          <p className="text-muted-foreground">Gerenciamento de promoções e descontos especiais</p>
        </div>
        <Button onClick={handleOpenNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Promoção
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome da promoção..."
            title="Digite parte do nome da promoção para filtrar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={loadPromocoes}>
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Abrangência</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">Carregando...</TableCell>
                </TableRow>
              ) : promocoes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhuma promoção encontrada
                  </TableCell>
                </TableRow>
              ) : (
                promocoes.map((promocao) => (
                  <TableRow key={promocao.id}>
                    <TableCell className="font-medium">{promocao.nome}</TableCell>
                    <TableCell>
                      <Badge variant={tipoDescontoVariants[promocao.tipoDesconto] || 'default'}>
                        {tipoDescontoLabels[promocao.tipoDesconto] || promocao.tipoDesconto}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {promocao.tipoDesconto === 'PERCENTUAL' && `${promocao.valorDesconto}%`}
                      {promocao.tipoDesconto === 'VALOR_FIXO' && formatCurrency(promocao.valorDesconto)}
                      {promocao.tipoDesconto === 'LEVE_PAGUE' && `${promocao.qtdMinima} pague ${promocao.qtdCobrar}`}
                    </TableCell>
                    <TableCell>
                      {formatDate(promocao.dataInicio)} - {formatDate(promocao.dataFim)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{aplicaProdutosLabels[promocao.aplicaProdutos]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={promocao.ativo ? 'success' : 'secondary'}>
                        {promocao.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(promocao)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleToggleAtivo(promocao.id)}>
                          {promocao.ativo ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleExcluir(promocao.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{editando ? 'Editar Promoção' : 'Nova Promoção'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  placeholder="Nome da promoção (ex: Promoção de Inverno)"
                  title="Nome de identificação da promoção. Se vazio, será gerado automaticamente."
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tipoDesconto">Tipo de Desconto</Label>
                <Select
                  value={formData.tipoDesconto}
                  onValueChange={(v: 'PERCENTUAL' | 'VALOR_FIXO' | 'LEVE_PAGUE') => setFormData({ ...formData, tipoDesconto: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTUAL">Percentual (%)</SelectItem>
                    <SelectItem value="VALOR_FIXO">Valor Fixo (R$)</SelectItem>
                    <SelectItem value="LEVE_PAGUE">Leve X Pague Y</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                placeholder="Descrição detalhada da promoção (opcional)"
                title="Informações adicionais sobre a promoção"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="valorDesconto">
                  {formData.tipoDesconto === 'PERCENTUAL' && 'Valor do Desconto (%)'}
                  {formData.tipoDesconto === 'VALOR_FIXO' && 'Valor do Desconto (R$)'}
                  {formData.tipoDesconto === 'LEVE_PAGUE' && 'Valor do Desconto (R$)'}
                </Label>
                <Input
                  id="valorDesconto"
                  type="number"
                  placeholder={formData.tipoDesconto === 'PERCENTUAL' ? 'Ex: 10.0' : 'Ex: 5.50'}
                  title={
                    formData.tipoDesconto === 'PERCENTUAL'
                      ? 'Percentual de desconto a ser aplicado (ex: 10 para 10%)'
                      : formData.tipoDesconto === 'VALOR_FIXO'
                      ? 'Valor fixo em reais a ser descontado'
                      : 'Valor fixo em reais para cada conjunto'
                  }
                  value={formData.valorDesconto}
                  onChange={(e) => setFormData({ ...formData, valorDesconto: parseFloat(e.target.value) || 0 })}
                  min={0}
                  step={0.01}
                />
              </div>
              {formData.tipoDesconto === 'LEVE_PAGUE' && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="qtdMinima">Quantidade Mínima (Leve)</Label>
                    <Input
                      id="qtdMinima"
                      type="number"
                      placeholder="Ex: 5"
                      title="Quantidade de itens que o cliente deve levar para ativar a promoção"
                      value={formData.qtdMinima ?? ''}
                      onChange={(e) => setFormData({ ...formData, qtdMinima: parseInt(e.target.value) || null })}
                      min={1}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="qtdCobrar">Quantidade a Cobrar (Pague)</Label>
                    <Input
                      id="qtdCobrar"
                      type="number"
                      placeholder="Ex: 4"
                      title="Quantidade de itens que o cliente efetivamente pagará"
                      value={formData.qtdCobrar ?? ''}
                      onChange={(e) => setFormData({ ...formData, qtdCobrar: parseInt(e.target.value) || null })}
                      min={1}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dataInicio">Data de Início</Label>
                <Input
                  id="dataInicio"
                  type="datetime-local"
                  placeholder="Selecione a data de início da promoção"
                  title="Data e hora a partir da qual a promoção entra em vigor"
                  value={formData.dataInicio}
                  onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dataFim">Data de Término</Label>
                <Input
                  id="dataFim"
                  type="datetime-local"
                  placeholder="Selecione a data de término da promoção"
                  title="Data e hora na qual a promoção expira (deve ser posterior à data de início)"
                  value={formData.dataFim}
                  onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="aplicaProdutos">Aplicar a</Label>
                <Select
                  value={formData.aplicaProdutos}
                  onValueChange={(v: 'TODOS' | 'SELECIONADOS') => setFormData({ ...formData, aplicaProdutos: v, itens: v === 'TODOS' ? [] : formData.itens })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODOS">Todos os Produtos</SelectItem>
                    <SelectItem value="SELECIONADOS">Produtos Selecionados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ativo">Status</Label>
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

            {formData.aplicaProdutos === 'SELECIONADOS' && (
              <div className="grid gap-2">
                <Label>Produtos na Promoção</Label>
                <LookupField
                  source="products"
                  placeholder="Buscar produto para adicionar à promoção..."
                  onChange={(produto: Produto) => addProdutoItem(produto)}
                />
                {formData.itens.length > 0 && (
                  <div className="mt-2 border rounded-md divide-y">
                    {formData.itens.map((item) => {
                      const p = produtos.find((p) => p.id === item.produtoId);
                      return (
                        <div key={item.produtoId} className="flex items-center gap-2 p-2">
                          <span className="flex-1 text-sm">{p ? `${p.codigoInterno} - ${p.nome}` : item.produtoId}</span>
                          <Input
                            type="number"
                            className="w-32 h-8 text-sm"
                            placeholder="Preço promocional"
                            title="Preço promocional específico para este produto (opcional)"
                            value={item.precoPromocional ?? ''}
                            onChange={(e) => updateProdutoPreco(item.produtoId, e.target.value ? parseFloat(e.target.value) : undefined)}
                            min={0}
                            step={0.01}
                          />
                          <Button variant="ghost" size="sm" onClick={() => removeProdutoItem(item.produtoId)}>
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
