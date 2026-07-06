import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { conciliacaoService, ContaBancaria, MovimentacaoBancaria, Conciliacao } from '@/services/conciliacao';
import { Plus, Building2, Search, CheckCircle, XCircle, Banknote } from 'lucide-react';

const tipoContaLabels: Record<string, string> = {
  CORRENTE: 'Corrente',
  POUPANCA: 'Poupança',
  INVESTIMENTO: 'Investimento',
};

export default function ConciliacaoPage() {
  const [contas, setContas] = useState<ContaBancaria[]>([]);
  const [contaSelecionada, setContaSelecionada] = useState<ContaBancaria | null>(null);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoBancaria[]>([]);
  const [conciliacoes, setConciliacoes] = useState<Conciliacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroDescr, setFiltroDescr] = useState('');
  const [filtroConciliado, setFiltroConciliado] = useState('');

  // Dialog states
  const [contaDialogOpen, setContaDialogOpen] = useState(false);
  const [movDialogOpen, setMovDialogOpen] = useState(false);
  const [concDialogOpen, setConcDialogOpen] = useState(false);
  const [concDetalheOpen, setConcDetalheOpen] = useState(false);
  const [conciliacaoDetalhe, setConciliacaoDetalhe] = useState<Conciliacao | null>(null);

  // Form state: Nova Conta
  const [contaForm, setContaForm] = useState({
    banco: '',
    agencia: '',
    conta: '',
    tipo: 'CORRENTE' as 'CORRENTE' | 'POUPANCA' | 'INVESTIMENTO',
    saldoInicial: 0,
  });

  // Form state: Nova Movimentação
  const [movForm, setMovForm] = useState({
    dataMovimentacao: new Date().toISOString().split('T')[0],
    tipo: 'CREDITO' as 'CREDITO' | 'DEBITO',
    descricao: '',
    documento: '',
    valor: 0,
  });

  // Form state: Nova Conciliação
  const [concForm, setConcForm] = useState({
    periodoIni: '',
    periodoFin: '',
    observacoes: '',
  });
  const [previewMovs, setPreviewMovs] = useState<MovimentacaoBancaria[]>([]);

  useEffect(() => {
    loadContas();
  }, []);

  useEffect(() => {
    if (contaSelecionada) {
      loadMovimentacoes(contaSelecionada.id);
      loadConciliacoes(contaSelecionada.id);
    }
  }, [contaSelecionada]);

  const loadContas = async () => {
    setLoading(true);
    try {
      const data = await conciliacaoService.listarContas();
      setContas(data);
    } catch {
      setContas([]);
    }
    setLoading(false);
  };

  const loadMovimentacoes = async (contaId: string) => {
    try {
      const data = await conciliacaoService.listarMovimentacoes(contaId);
      setMovimentacoes(data);
    } catch {
      setMovimentacoes([]);
    }
  };

  const loadConciliacoes = async (contaId: string) => {
    try {
      const data = await conciliacaoService.listarConciliacoes(contaId);
      setConciliacoes(data);
    } catch {
      setConciliacoes([]);
    }
  };

  const handleCriarConta = async () => {
    try {
      await conciliacaoService.criarConta({
        ...contaForm,
        saldoInicial: contaForm.saldoInicial || undefined,
      });
      setContaDialogOpen(false);
      setContaForm({ banco: '', agencia: '', conta: '', tipo: 'CORRENTE', saldoInicial: 0 });
      loadContas();
    } catch (error: any) {
      alert(error.response?.data?.error?.message || error.message);
    }
  };

  const handleCriarMovimentacao = async () => {
    if (!contaSelecionada) return;
    try {
      await conciliacaoService.criarMovimentacao({
        contaBancariaId: contaSelecionada.id,
        dataMovimentacao: new Date(movForm.dataMovimentacao).toISOString(),
        tipo: movForm.tipo,
        descricao: movForm.descricao,
        documento: movForm.documento || undefined,
        valor: movForm.valor,
      });
      setMovDialogOpen(false);
      setMovForm({
        dataMovimentacao: new Date().toISOString().split('T')[0],
        tipo: 'CREDITO',
        descricao: '',
        documento: '',
        valor: 0,
      });
      loadMovimentacoes(contaSelecionada.id);
    } catch (error: any) {
      alert(error.response?.data?.error?.message || error.message);
    }
  };

  const handleConciliar = async (movimentacaoId: string) => {
    if (!conciliacoes.length) {
      alert('Crie uma conciliação primeiro na aba Conciliações');
      return;
    }
    try {
      const conciliacao = conciliacoes[0];
      await conciliacaoService.conciliarMovimentacao({
        movimentacaoId,
        conciliacaoId: conciliacao.id,
      });
      loadMovimentacoes(contaSelecionada!.id);
    } catch (error: any) {
      alert(error.response?.data?.error?.message || error.message);
    }
  };

  const handleDesconciliar = async (movimentacaoId: string) => {
    try {
      await conciliacaoService.desconciliarMovimentacao(movimentacaoId);
      loadMovimentacoes(contaSelecionada!.id);
    } catch (error: any) {
      alert(error.response?.data?.error?.message || error.message);
    }
  };

  const handlePreviewConciliacao = async () => {
    if (!contaSelecionada || !concForm.periodoIni || !concForm.periodoFin) return;
    try {
      const movs = await conciliacaoService.listarMovimentacoes(contaSelecionada.id);
      const filtered = movs.filter(m => {
        const data = new Date(m.dataMovimentacao);
        return data >= new Date(concForm.periodoIni) && data <= new Date(concForm.periodoFin);
      });
      setPreviewMovs(filtered);
    } catch {
      setPreviewMovs([]);
    }
  };

  const handleCriarConciliacao = async () => {
    if (!contaSelecionada) return;
    try {
      await conciliacaoService.criarConciliacao({
        contaBancariaId: contaSelecionada.id,
        periodoIni: new Date(concForm.periodoIni).toISOString(),
        periodoFin: new Date(concForm.periodoFin).toISOString(),
        observacoes: concForm.observacoes || undefined,
      });
      setConcDialogOpen(false);
      setConcForm({ periodoIni: '', periodoFin: '', observacoes: '' });
      setPreviewMovs([]);
      loadConciliacoes(contaSelecionada.id);
    } catch (error: any) {
      alert(error.response?.data?.error?.message || error.message);
    }
  };

  const handleVerConciliacao = async (conciliacao: Conciliacao) => {
    setConciliacaoDetalhe(conciliacao);
    if (contaSelecionada) {
      const movs = await conciliacaoService.listarMovimentacoes(contaSelecionada.id);
      setConciliacaoDetalhe({
        ...conciliacao,
        movimentacoes: movs.filter(m => m.conciliacaoId === conciliacao.id),
      });
    }
    setConcDetalheOpen(true);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('pt-BR');

  const filteredMovimentacoes = movimentacoes.filter(m => {
    if (filtroDescr && !m.descricao.toLowerCase().includes(filtroDescr.toLowerCase())) return false;
    if (filtroConciliado === 'sim' && !m.conciliado) return false;
    if (filtroConciliado === 'nao' && m.conciliado) return false;
    return true;
  });

  const previewTotalCreditos = previewMovs
    .filter(m => m.tipo === 'CREDITO')
    .reduce((acc, m) => acc + m.valor, 0);
  const previewTotalDebitos = previewMovs
    .filter(m => m.tipo === 'DEBITO')
    .reduce((acc, m) => acc + m.valor, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Conciliação Bancária</h1>
          <p className="text-muted-foreground">Gerencie contas bancárias e conciliações</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Left panel: Contas */}
        <div className="space-y-4 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Contas Bancárias</h2>
            <Button size="sm" onClick={() => setContaDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Nova
            </Button>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : contas.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma conta cadastrada</p>
          ) : (
            <div className="space-y-2">
              {contas.map(conta => (
                <Card
                  key={conta.id}
                  className={`cursor-pointer transition-colors hover:bg-accent ${
                    contaSelecionada?.id === conta.id ? 'border-primary ring-1 ring-primary' : ''
                  }`}
                  onClick={() => setContaSelecionada(conta)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <Building2 className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{conta.banco}</p>
                        <p className="text-xs text-muted-foreground">
                          Ag {conta.agencia} • Cta {conta.conta}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tipoContaLabels[conta.tipo] || conta.tipo}
                        </p>
                        <p className="text-sm font-semibold mt-1">
                          {formatCurrency(conta.saldoAtual)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right panel: Detalhes */}
        <div className="lg:col-span-3">
          {!contaSelecionada ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Banknote className="h-12 w-12 mb-4" />
                <p>Selecione uma conta bancária ao lado</p>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="movimentacoes">
              <TabsList>
                <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
                <TabsTrigger value="conciliacoes">Conciliações</TabsTrigger>
              </TabsList>

              {/* Tab: Movimentações */}
              <TabsContent value="movimentacoes" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 flex-1">
                    <div className="relative flex-1 max-w-xs">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Buscar por descrição..."
                        value={filtroDescr}
                        onChange={e => setFiltroDescr(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={filtroConciliado} onValueChange={v => setFiltroConciliado(v)}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Conciliado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="sim">Conciliado</SelectItem>
                        <SelectItem value="nao">Não conciliado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button size="sm" onClick={() => setMovDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Nova Movimentação
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Documento</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead className="text-center">Conciliado</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMovimentacoes.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                              Nenhuma movimentação encontrada
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredMovimentacoes.map(mov => (
                            <TableRow key={mov.id}>
                              <TableCell>{formatDate(mov.dataMovimentacao)}</TableCell>
                              <TableCell className="font-medium">{mov.descricao}</TableCell>
                              <TableCell>{mov.documento || '-'}</TableCell>
                              <TableCell>
                                <Badge variant={mov.tipo === 'CREDITO' ? 'success' : 'destructive'}>
                                  {mov.tipo === 'CREDITO' ? 'CRÉDITO' : 'DÉBITO'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">{formatCurrency(mov.valor)}</TableCell>
                              <TableCell className="text-center">
                                {mov.conciliado ? (
                                  <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                {mov.conciliado ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDesconciliar(mov.id)}
                                  >
                                    Desconciliar
                                  </Button>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleConciliar(mov.id)}
                                  >
                                    Conciliar
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Conciliações */}
              <TabsContent value="conciliacoes" className="space-y-4">
                <div className="flex justify-end">
                  <Button size="sm" onClick={() => {
                    setConcDialogOpen(true);
                    setPreviewMovs([]);
                  }}>
                    <Plus className="h-4 w-4 mr-1" />
                    Nova Conciliação
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Período</TableHead>
                          <TableHead>Data Conciliação</TableHead>
                          <TableHead className="text-right">Total Créditos</TableHead>
                          <TableHead className="text-right">Total Débitos</TableHead>
                          <TableHead className="text-right">Total Conciliado</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {conciliacoes.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              Nenhuma conciliação encontrada
                            </TableCell>
                          </TableRow>
                        ) : (
                          conciliacoes.map(conc => (
                            <TableRow key={conc.id}>
                              <TableCell>
                                {formatDate(conc.periodoIni)} - {formatDate(conc.periodoFin)}
                              </TableCell>
                              <TableCell>{formatDate(conc.dataConciliacao)}</TableCell>
                              <TableCell className="text-right text-green-600">
                                {formatCurrency(conc.totalCreditos)}
                              </TableCell>
                              <TableCell className="text-right text-red-600">
                                {formatCurrency(conc.totalDebitos)}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(conc.totalConciliado)}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleVerConciliacao(conc)}
                                >
                                  Detalhes
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      {/* Dialog: Nova Conta */}
      <Dialog open={contaDialogOpen} onOpenChange={setContaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Conta Bancária</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Banco</Label>
              <Input
                placeholder="Nome do banco (ex: Banco do Brasil)"
                title="Digite o nome ou código do banco"
                value={contaForm.banco}
                onChange={e => setContaForm({ ...contaForm, banco: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Agência</Label>
                <Input
                  placeholder="Número da agência"
                  title="Número da agência sem dígito"
                  value={contaForm.agencia}
                  onChange={e => setContaForm({ ...contaForm, agencia: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Conta</Label>
                <Input
                  placeholder="Número da conta"
                  title="Número da conta com dígito verificador"
                  value={contaForm.conta}
                  onChange={e => setContaForm({ ...contaForm, conta: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Tipo</Label>
              <Select
                value={contaForm.tipo}
                onValueChange={(v: 'CORRENTE' | 'POUPANCA' | 'INVESTIMENTO') =>
                  setContaForm({ ...contaForm, tipo: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CORRENTE">Corrente</SelectItem>
                  <SelectItem value="POUPANCA">Poupança</SelectItem>
                  <SelectItem value="INVESTIMENTO">Investimento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Saldo Inicial</Label>
              <Input
                type="number"
                placeholder="Saldo inicial da conta"
                title="Valor do saldo no momento da abertura"
                value={contaForm.saldoInicial}
                onChange={e => setContaForm({ ...contaForm, saldoInicial: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContaDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCriarConta}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Nova Movimentação */}
      <Dialog open={movDialogOpen} onOpenChange={setMovDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Movimentação Bancária</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Data</Label>
              <Input
                type="date"
                placeholder="dd/mm/aaaa"
                title="Data da movimentação"
                value={movForm.dataMovimentacao}
                onChange={e => setMovForm({ ...movForm, dataMovimentacao: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Tipo</Label>
              <Select
                value={movForm.tipo}
                onValueChange={(v: 'CREDITO' | 'DEBITO') =>
                  setMovForm({ ...movForm, tipo: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CREDITO">Crédito (Entrada)</SelectItem>
                  <SelectItem value="DEBITO">Débito (Saída)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Descrição</Label>
              <Input
                placeholder="Descrição da movimentação"
                title="Ex: Pagamento de fornecedor, Recebimento de cliente"
                value={movForm.descricao}
                onChange={e => setMovForm({ ...movForm, descricao: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Documento</Label>
              <Input
                placeholder="Número do documento (opcional)"
                title="Ex: NF-12345, TED-987654"
                value={movForm.documento}
                onChange={e => setMovForm({ ...movForm, documento: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Valor</Label>
              <Input
                type="number"
                placeholder="Valor da movimentação"
                title="Use ponto para decimais. Ex: 1500.50"
                value={movForm.valor}
                onChange={e => setMovForm({ ...movForm, valor: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMovDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCriarMovimentacao}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Nova Conciliação */}
      <Dialog open={concDialogOpen} onOpenChange={setConcDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Conciliação Bancária</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Período Início</Label>
                <Input
                  type="date"
                  placeholder="dd/mm/aaaa"
                  title="Data inicial do período a conciliar"
                  value={concForm.periodoIni}
                  onChange={e => {
                    setConcForm({ ...concForm, periodoIni: e.target.value });
                  }}
                  onBlur={handlePreviewConciliacao}
                />
              </div>
              <div className="grid gap-2">
                <Label>Período Fim</Label>
                <Input
                  type="date"
                  placeholder="dd/mm/aaaa"
                  title="Data final do período a conciliar"
                  value={concForm.periodoFin}
                  onChange={e => {
                    setConcForm({ ...concForm, periodoFin: e.target.value });
                  }}
                  onBlur={handlePreviewConciliacao}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Observações</Label>
              <Textarea
                placeholder="Observações sobre esta conciliação (opcional)"
                title="Informações adicionais sobre o período de conciliação"
                value={concForm.observacoes}
                onChange={e => setConcForm({ ...concForm, observacoes: e.target.value })}
              />
            </div>

            {previewMovs.length > 0 && (
              <div className="rounded-lg border p-4 space-y-2">
                <h3 className="text-sm font-semibold">Preview do Período</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Movimentações:</span>{' '}
                    <span className="font-medium">{previewMovs.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Créditos:</span>{' '}
                    <span className="font-medium text-green-600">{formatCurrency(previewTotalCreditos)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Já conciliados:</span>{' '}
                    <span className="font-medium">{previewMovs.filter(m => m.conciliado).length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Débitos:</span>{' '}
                    <span className="font-medium text-red-600">{formatCurrency(previewTotalDebitos)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConcDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCriarConciliacao} disabled={!concForm.periodoIni || !concForm.periodoFin}>
              Confirmar Conciliação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Detalhes Conciliação */}
      <Dialog open={concDetalheOpen} onOpenChange={setConcDetalheOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Conciliação</DialogTitle>
          </DialogHeader>
          {conciliacaoDetalhe && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Período:</span>{' '}
                  <span className="font-medium">
                    {formatDate(conciliacaoDetalhe.periodoIni)} - {formatDate(conciliacaoDetalhe.periodoFin)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Data Conciliação:</span>{' '}
                  <span className="font-medium">{formatDate(conciliacaoDetalhe.dataConciliacao)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Créditos:</span>{' '}
                  <span className="font-medium text-green-600">{formatCurrency(conciliacaoDetalhe.totalCreditos)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Débitos:</span>{' '}
                  <span className="font-medium text-red-600">{formatCurrency(conciliacaoDetalhe.totalDebitos)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Conciliado:</span>{' '}
                  <span className="font-medium">{formatCurrency(conciliacaoDetalhe.totalConciliado)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Não Conciliado:</span>{' '}
                  <span className="font-medium">{formatCurrency(conciliacaoDetalhe.totalNaoConciliado)}</span>
                </div>
              </div>
              {conciliacaoDetalhe.observacoes && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Observações:</span>{' '}
                  <span>{conciliacaoDetalhe.observacoes}</span>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold mb-2">Movimentações Conciliadas</h3>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!conciliacaoDetalhe.movimentacoes || conciliacaoDetalhe.movimentacoes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                            Nenhuma movimentação nesta conciliação
                          </TableCell>
                        </TableRow>
                      ) : (
                        conciliacaoDetalhe.movimentacoes.map(mov => (
                          <TableRow key={mov.id}>
                            <TableCell>{formatDate(mov.dataMovimentacao)}</TableCell>
                            <TableCell>{mov.descricao}</TableCell>
                            <TableCell>
                              <Badge variant={mov.tipo === 'CREDITO' ? 'success' : 'destructive'}>
                                {mov.tipo === 'CREDITO' ? 'CRÉDITO' : 'DÉBITO'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(mov.valor)}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setConcDetalheOpen(false); setConciliacaoDetalhe(null); }}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
