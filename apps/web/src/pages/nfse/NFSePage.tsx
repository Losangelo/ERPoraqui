import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { nfseService, NotaServico, CriarNFSeDto } from '@/services/nfse';
import { Plus, Send, XCircle, Trash2 } from 'lucide-react';

const situacoes: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }> = {
  EM_DIGITACAO: { label: 'Rascunho', variant: 'secondary' },
  ASSINADA: { label: 'Assinada', variant: 'default' },
  ENVIADA: { label: 'Enviada', variant: 'warning' },
  AUTORIZADA: { label: 'Autorizada', variant: 'success' },
  CANCELADA: { label: 'Cancelada', variant: 'destructive' },
  DENEGADA: { label: 'Denegada', variant: 'destructive' },
  PROCESSANDO: { label: 'Processando', variant: 'warning' },
};

export default function NFSePage() {
  const [notas, setNotas] = useState<NotaServico[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtros] = useState({ pagina: 1, limite: 20 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tab, setTab] = useState('dados');
  const [empresaId, setEmpresaId] = useState('');
  
  
  const [formData, setFormData] = useState<CriarNFSeDto>({
    empresaId: '',
    filialId: '',
    naturezaOperacao: '1',
    tipoRps: 'RPS',
    regimeTributario: 'SIMPLES_NACIONAL',
    optanteSimplesNacional: false,
    incentivoFiscal: false,
    tomadorNome: '',
    tomadorCnpjCpf: '',
    tomadorEndereco: '',
    tomadorNumero: '',
    tomadorBairro: '',
    tomadorCidade: '',
    tomadorUf: '',
    tomadorCep: '',
    tomadorTelefone: '',
    tomadorEmail: '',
    discriminacao: '',
    itens: [],
  });

  const [itemCodigo, setItemCodigo] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemQtd, setItemQtd] = useState('1');
  const [itemValor, setItemValor] = useState('');
  const [itemAliqIss, setItemAliqIss] = useState('5');

  const usuarioJson = typeof window !== 'undefined' ? localStorage.getItem('usuario') : null;
  const usuario = usuarioJson ? JSON.parse(usuarioJson) : null;

  useEffect(() => {
    if (usuario?.empresaId) {
      setEmpresaId(usuario.empresaId);
      setFormData(prev => ({ ...prev, empresaId: usuario.empresaId }));
    }
  }, [usuario]);

  useEffect(() => {
    if (empresaId) {
      carregarNotas();
    }
  }, [empresaId]);

  const carregarNotas = async () => {
    setLoading(true);
    try {
      const result = await nfseService.listar({ ...filtros, empresaId } as any);
      setNotas(result || []);
    } catch (error) {
      console.error('Erro ao carregar NFSe:', error);
    }
    setLoading(false);
  };

  const handleCriar = async () => {
    if (!formData.itens || formData.itens.length === 0) {
      alert('Adicione pelo menos um serviço');
      return;
    }
    try {
      await nfseService.criar(formData);
      setDialogOpen(false);
      setFormData({
        empresaId,
        filialId: '',
        naturezaOperacao: '1',
        tipoRps: 'RPS',
        regimeTributario: 'SIMPLES_NACIONAL',
        optanteSimplesNacional: false,
        incentivoFiscal: false,
        tomadorNome: '',
        tomadorCnpjCpf: '',
        tomadorEndereco: '',
        tomadorNumero: '',
        tomadorBairro: '',
        tomadorCidade: '',
        tomadorUf: '',
        tomadorCep: '',
        tomadorTelefone: '',
        tomadorEmail: '',
        discriminacao: '',
        itens: [],
      });
      carregarNotas();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleAddItem = () => {
    if (!itemCodigo || !itemDesc || !itemValor) {
      alert('Preencha os campos do item');
      return;
    }
    const qtd = parseFloat(itemQtd) || 1;
    const valor = parseFloat(itemValor) || 0;
    const aliq = parseFloat(itemAliqIss) || 0;
    
    const novoItem = {
      codigo: itemCodigo,
      discriminacao: itemDesc,
      quantidade: qtd,
      valorUnitario: valor,
      issAliquota: aliq,
    };
    
    setFormData(prev => ({
      ...prev,
      itens: [...(prev.itens || []), novoItem],
    }));
    
    setItemCodigo('');
    setItemDesc('');
    setItemQtd('1');
    setItemValor('');
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itens: prev.itens?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleAssinar = async (id: string) => {
    try {
      await nfseService.assinar(id);
      carregarNotas();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleEnviar = async (id: string) => {
    try {
      await nfseService.enviar(id);
      carregarNotas();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleCancelar = async (id: string) => {
    const motivo = prompt('Motivo do cancelamento:');
    if (!motivo) return;
    try {
      await nfseService.cancelar(id, motivo);
      carregarNotas();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleExcluir = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    try {
      await nfseService.excluir(id);
      carregarNotas();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const valorTotal = formData.itens?.reduce((sum, item) => 
    sum + (item.valorUnitario * (item.quantidade || 1)), 0
  ) || 0;


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">NFSe - Nota Fiscal de Serviços</h1>
          <p className="text-muted-foreground">Emissão de Nota Fiscal de Serviços Eletrônica</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w4" /> Nova NFSe
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notas Fiscais de Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Série</TableHead>
                <TableHead>Data Emissão</TableHead>
                <TableHead>Tomador</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">Carregando...</TableCell>
                </TableRow>
              ) : notas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">Nenhuma NFSe encontrada</TableCell>
                </TableRow>
              ) : (
                notas.map((nota) => (
                  <TableRow key={nota.id}>
                    <TableCell>{nota.numero}</TableCell>
                    <TableCell>{nota.serie}</TableCell>
                    <TableCell>{new Date(nota.dataEmissao).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{nota.tomadorNome || 'Não informado'}</TableCell>
                    <TableCell className="text-right">
                      R$ {nota.valorTotal.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={situacoes[nota.situacao]?.variant || 'secondary'}>
                        {situacoes[nota.situacao]?.label || nota.situacao}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {nota.situacao === 'EM_DIGITACAO' && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleAssinar(nota.id)}>
                              Assinar
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleExcluir(nota.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {nota.situacao === 'ASSINADA' && (
                          <Button size="sm" onClick={() => handleEnviar(nota.id)}>
                            <Send className="mr-1 h-4 w-4" /> Enviar
                          </Button>
                        )}
                        {nota.situacao === 'AUTORIZADA' && (
                          <Button size="sm" variant="destructive" onClick={() => handleCancelar(nota.id)}>
                            <XCircle className="mr-1 h-4 w-4" /> Cancelar
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova NFSe - Nota Fiscal de Serviços</DialogTitle>
          </DialogHeader>
          
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="dados">Dados Principal</TabsTrigger>
              <TabsTrigger value="tomador">Tomador</TabsTrigger>
              <TabsTrigger value="servicos">Serviços</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dados">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="filial">Filial</Label>
                    <Input
                      id="filial"
                      value={formData.filialId}
                      onChange={(e) => setFormData(prev => ({ ...prev, filialId: e.target.value }))}
                      placeholder="ID da filial"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tipoRps">Tipo RPS</Label>
                    <Select 
                      value={formData.tipoRps} 
                      onValueChange={(v: any) => setFormData(prev => ({ ...prev, tipoRps: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RPS">RPS</SelectItem>
                        <SelectItem value="RPS_CONJUGADO">RPS Conjugado</SelectItem>
                        <SelectItem value="CUPOM">Cupom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="natureza">Natureza Operação</Label>
                    <Input
                      id="natureza"
                      value={formData.naturezaOperacao}
                      onChange={(e) => setFormData(prev => ({ ...prev, naturezaOperacao: e.target.value }))}
                      placeholder="1 - Tributação"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="regime">Regime Tributário</Label>
                    <Select 
                      value={formData.regimeTributario} 
                      onValueChange={(v: any) => setFormData(prev => ({ ...prev, regimeTributario: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SIMPLES_NACIONAL">Simples Nacional</SelectItem>
                        <SelectItem value="LUCRO_PRESUMIDO">Lucro Presumido</SelectItem>
                        <SelectItem value="LUCRO_REAL">Lucro Real</SelectItem>
                        <SelectItem value="ISENTO">Isento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="competencia">Competência</Label>
                    <Input
                      id="competencia"
                      value={formData.competencia}
                      onChange={(e) => setFormData(prev => ({ ...prev, competencia: e.target.value }))}
                      placeholder="MM/AAAA"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="codigoServico">Código Serviço</Label>
                    <Input
                      id="codigoServico"
                      value={formData.codigoServico}
                      onChange={(e) => setFormData(prev => ({ ...prev, codigoServico: e.target.value }))}
                      placeholder="Código do serviço municipal"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="discriminacao">Discriminação dos Serviços</Label>
                  <textarea
                    id="discriminacao"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.discriminacao}
                    onChange={(e) => setFormData(prev => ({ ...prev, discriminacao: e.target.value }))}
                    placeholder="Descrição detalhada dos serviços prestados"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="optante"
                      checked={formData.optanteSimplesNacional}
                      onChange={(e) => setFormData(prev => ({ ...prev, optanteSimplesNacional: e.target.checked }))}
                    />
                    <Label htmlFor="optante">Optante Simples Nacional</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="incentivo"
                      checked={formData.incentivoFiscal}
                      onChange={(e) => setFormData(prev => ({ ...prev, incentivoFiscal: e.target.checked }))}
                    />
                    <Label htmlFor="incentivo">Incentivo Fiscal</Label>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tomador">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tomadorNome">Nome/Razão Social</Label>
                    <Input
                      id="tomadorNome"
                      value={formData.tomadorNome}
                      onChange={(e) => setFormData(prev => ({ ...prev, tomadorNome: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tomadorDoc">CNPJ/CPF</Label>
                    <Input
                      id="tomadorDoc"
                      value={formData.tomadorCnpjCpf}
                      onChange={(e) => setFormData(prev => ({ ...prev, tomadorCnpjCpf: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tomadorEnd">Endereço</Label>
                    <Input
                      id="tomadorEnd"
                      value={formData.tomadorEndereco}
                      onChange={(e) => setFormData(prev => ({ ...prev, tomadorEndereco: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tomadorNum">Número</Label>
                    <Input
                      id="tomadorNum"
                      value={formData.tomadorNumero}
                      onChange={(e) => setFormData(prev => ({ ...prev, tomadorNumero: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tomadorBairro">Bairro</Label>
                    <Input
                      id="tomadorBairro"
                      value={formData.tomadorBairro}
                      onChange={(e) => setFormData(prev => ({ ...prev, tomadorBairro: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tomadorCep">CEP</Label>
                    <Input
                      id="tomadorCep"
                      value={formData.tomadorCep}
                      onChange={(e) => setFormData(prev => ({ ...prev, tomadorCep: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tomadorTel">Telefone</Label>
                    <Input
                      id="tomadorTel"
                      value={formData.tomadorTelefone}
                      onChange={(e) => setFormData(prev => ({ ...prev, tomadorTelefone: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tomadorCidade">Cidade</Label>
                    <Input
                      id="tomadorCidade"
                      value={formData.tomadorCidade}
                      onChange={(e) => setFormData(prev => ({ ...prev, tomadorCidade: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tomadorUf">UF</Label>
                    <Input
                      id="tomadorUf"
                      value={formData.tomadorUf}
                      onChange={(e) => setFormData(prev => ({ ...prev, tomadorUf: e.target.value }))}
                      maxLength={2}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tomadorEmail">E-mail</Label>
                    <Input
                      id="tomadorEmail"
                      type="email"
                      value={formData.tomadorEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, tomadorEmail: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="servicos">
              <div className="space-y-4 py-4">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Adicionar Serviço</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-6 gap-2">
                      <Input
                        placeholder="Código"
                        value={itemCodigo}
                        onChange={(e) => setItemCodigo(e.target.value)}
                      />
                      <Input
                        placeholder="Descrição"
                        value={itemDesc}
                        onChange={(e) => setItemDesc(e.target.value)}
                        className="col-span-2"
                      />
                      <Input
                        type="number"
                        placeholder="Qtd"
                        value={itemQtd}
                        onChange={(e) => setItemQtd(e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Valor"
                        value={itemValor}
                        onChange={(e) => setItemValor(e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="% ISS"
                        value={itemAliqIss}
                        onChange={(e) => setItemAliqIss(e.target.value)}
                      />
                    </div>
                    <Button className="mt-2" onClick={handleAddItem}>
                      <Plus className="mr-1 h-4 w-4" /> Adicionar
                    </Button>
                  </CardContent>
                </Card>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-right">Qtd</TableHead>
                      <TableHead className="text-right">Valor Unit.</TableHead>
                      <TableHead className="text-right">% ISS</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.itens?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.codigo}</TableCell>
                        <TableCell>{item.discriminacao}</TableCell>
                        <TableCell className="text-right">{item.quantidade}</TableCell>
                        <TableCell className="text-right">R$ {item.valorUnitario.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{item.issAliquota}%</TableCell>
                        <TableCell className="text-right">
                          R$ {(item.valorUnitario * (item.quantidade || 1)).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" onClick={() => handleRemoveItem(index)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex justify-end">
                  <div className="text-right space-y-1">
                    <p>Valor Serviços: R$ {valorTotal.toFixed(2)}</p>
                    <p>Valor ISS ({itemAliqIss}%): R$ {(valorTotal * parseFloat(itemAliqIss || '5') / 100).toFixed(2)}</p>
                    <p className="font-bold">Total: R$ {valorTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCriar}>Criar NFSe</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
