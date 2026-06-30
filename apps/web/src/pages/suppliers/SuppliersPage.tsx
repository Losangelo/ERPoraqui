import { useState, useEffect } from 'react';
import { Truck, Search, Plus, Edit, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { fornecedoresService, Fornecedor, CriarFornecedorDto } from '@/services/fornecedores';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export function SuppliersPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState<Fornecedor | null>(null);
  const [formData, setFormData] = useState<CriarFornecedorDto>({
    nome: '',
    tipoPessoa: 'JURIDICA',
    documento: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    email: '',
    telefone: '',
    telefoneCelular: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: '',
  });

  useEffect(() => {
    loadFornecedores();
  }, [search]);

  const loadFornecedores = async () => {
    try {
      setLoading(true);
      const response = await fornecedoresService.listar({ nome: search, ativo: true });
      setFornecedores(response);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFornecedor) {
        await fornecedoresService.atualizar(editingFornecedor.id, formData);
      } else {
        await fornecedoresService.criar(formData);
      }
      setShowModal(false);
      setEditingFornecedor(null);
      resetForm();
      loadFornecedores();
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
    }
  };

  const handleEdit = (fornecedor: Fornecedor) => {
    setEditingFornecedor(fornecedor);
    setFormData({
      nome: fornecedor.nome,
      tipoPessoa: fornecedor.tipoPessoa,
      documento: fornecedor.documento,
      inscricaoEstadual: fornecedor.inscricaoEstadual || '',
      inscricaoMunicipal: fornecedor.inscricaoMunicipal || '',
      email: fornecedor.email || '',
      telefone: fornecedor.telefone || '',
      telefoneCelular: fornecedor.telefoneCelular || '',
      logradouro: fornecedor.logradouro || '',
      numero: fornecedor.numero || '',
      complemento: fornecedor.complemento || '',
      bairro: fornecedor.bairro || '',
      cidade: fornecedor.cidade || '',
      uf: fornecedor.uf || '',
      cep: fornecedor.cep || '',
    });
    setShowModal(true);
  };

  const handleToggleAtivo = async (fornecedor: Fornecedor) => {
    try {
      if (fornecedor.ativo) {
        await fornecedoresService.inativar(fornecedor.id);
      } else {
        await fornecedoresService.ativar(fornecedor.id);
      }
      loadFornecedores();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      tipoPessoa: 'JURIDICA',
      documento: '',
      inscricaoEstadual: '',
      inscricaoMunicipal: '',
      email: '',
      telefone: '',
      telefoneCelular: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      cep: '',
    });
  };

  const openNewModal = () => {
    resetForm();
    setEditingFornecedor(null);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fornecedores</h1>
          <p className="text-gray-500">Gerencie seus fornecedores</p>
        </div>
        <Button onClick={openNewModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Fornecedor
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar fornecedores..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : fornecedores.length === 0 ? (
            <div className="text-center p-12">
              <Truck className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum fornecedor encontrado</h3>
              <p className="mt-2 text-sm text-gray-500">
                Comece adicionando seu primeiro fornecedor
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Cidade/UF</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fornecedores.map((fornecedor) => (
                  <TableRow key={fornecedor.id}>
                    <TableCell className="font-medium">{fornecedor.nome}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${fornecedor.tipoPessoa === 'FISICA' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {fornecedor.tipoPessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{fornecedor.documento}</TableCell>
                    <TableCell>{fornecedor.email || '-'}</TableCell>
                    <TableCell>{fornecedor.telefone || fornecedor.telefoneCelular || '-'}</TableCell>
                    <TableCell>
                      {fornecedor.cidade && fornecedor.uf 
                        ? `${fornecedor.cidade}/${fornecedor.uf}` 
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleAtivo(fornecedor)}
                        className={`flex items-center gap-1 ${fornecedor.ativo ? 'text-green-600' : 'text-gray-400'}`}
                      >
                        {fornecedor.ativo ? (
                          <ToggleRight className="h-5 w-5" />
                        ) : (
                          <ToggleLeft className="h-5 w-5" />
                        )}
                        <span className="text-sm">{fornecedor.ativo ? 'Ativo' : 'Inativo'}</span>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(fornecedor)}
                        className="text-gray-600 hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFornecedor ? 'Editar Fornecedor' : 'Novo Fornecedor'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="nome">Nome/Razão Social</Label>
                <Input
                  id="nome"
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="tipoPessoa">Tipo</Label>
                <select
                  id="tipoPessoa"
                  value={formData.tipoPessoa}
                  onChange={(e) => setFormData({ ...formData, tipoPessoa: e.target.value as 'FISICA' | 'JURIDICA' })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="JURIDICA">Pessoa Jurídica</option>
                  <option value="FISICA">Pessoa Física</option>
                </select>
              </div>
              <div>
                <Label htmlFor="documento">CPF/CNPJ</Label>
                <Input
                  id="documento"
                  type="text"
                  value={formData.documento}
                  onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                <Input
                  id="inscricaoEstadual"
                  type="text"
                  value={formData.inscricaoEstadual}
                  onChange={(e) => setFormData({ ...formData, inscricaoEstadual: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="inscricaoMunicipal">Inscrição Municipal</Label>
                <Input
                  id="inscricaoMunicipal"
                  type="text"
                  value={formData.inscricaoMunicipal}
                  onChange={(e) => setFormData({ ...formData, inscricaoMunicipal: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="telefoneCelular">Celular</Label>
                <Input
                  id="telefoneCelular"
                  type="text"
                  value={formData.telefoneCelular}
                  onChange={(e) => setFormData({ ...formData, telefoneCelular: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <h3 className="font-medium text-gray-900 mb-2">Endereço</h3>
              </div>
              <div className="col-span-2">
                <Label htmlFor="logradouro">Logradouro</Label>
                <Input
                  id="logradouro"
                  type="text"
                  value={formData.logradouro}
                  onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  type="text"
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  type="text"
                  value={formData.complemento}
                  onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  type="text"
                  value={formData.bairro}
                  onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  type="text"
                  value={formData.cep}
                  onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  type="text"
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="uf">UF</Label>
                <Input
                  id="uf"
                  type="text"
                  value={formData.uf}
                  onChange={(e) => setFormData({ ...formData, uf: e.target.value })}
                  maxLength={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingFornecedor ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
