import { useState, useEffect } from 'react';
import { Users, Search, Plus, Edit, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { clientesService, Cliente, CriarClienteDto } from '@/services/clientes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export function CustomersPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CriarClienteDto>({
    nome: '',
    tipoPessoa: 'FISICA',
    documento: '',
    email: '',
    telefone: '',
    telefoneCelular: '',
    limiteCredito: 0,
  });

  useEffect(() => {
    loadClientes();
  }, [search]);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const response = await clientesService.listar({ nome: search, ativo: true });
      setClientes(response);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (editingCliente) {
        await clientesService.atualizar(editingCliente.id, formData);
      } else {
        await clientesService.criar(formData);
      }
      setDialogOpen(false);
      setEditingCliente(null);
      resetForm();
      loadClientes();
    } catch (err: any) {
      console.error('Erro ao salvar cliente:', err);
      setError(err.response?.data?.error || 'Erro ao salvar cliente');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nome: cliente.nome,
      tipoPessoa: cliente.tipoPessoa,
      documento: cliente.documento,
      email: cliente.email || '',
      telefone: cliente.telefone || '',
      telefoneCelular: cliente.telefoneCelular || '',
      limiteCredito: cliente.limiteCredito,
    });
    setDialogOpen(true);
  };

  const handleToggleAtivo = async (cliente: Cliente) => {
    try {
      if (cliente.ativo) {
        await clientesService.inativar(cliente.id);
      } else {
        await clientesService.ativar(cliente.id);
      }
      loadClientes();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      tipoPessoa: 'FISICA',
      documento: '',
      email: '',
      telefone: '',
      telefoneCelular: '',
      limiteCredito: 0,
    });
  };

  const openNewModal = () => {
    resetForm();
    setEditingCliente(null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Gerencie seus clientes</p>
        </div>
        <Button onClick={openNewModal}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                title="Buscar pelo nome do cliente"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : clientes.length === 0 ? (
            <div className="text-center p-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Nenhum cliente encontrado</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Comece adicionando seu primeiro cliente
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
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nome}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        cliente.tipoPessoa === 'FISICA' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {cliente.tipoPessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                      </span>
                    </TableCell>
                    <TableCell>{cliente.documento}</TableCell>
                    <TableCell>{cliente.email || '-'}</TableCell>
                    <TableCell>{cliente.telefone || cliente.telefoneCelular || '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleAtivo(cliente)}
                        className={cliente.ativo ? 'text-green-600' : 'text-muted-foreground'}
                      >
                        {cliente.ativo ? (
                          <ToggleRight className="mr-1 h-4 w-4" />
                        ) : (
                          <ToggleLeft className="mr-1 h-4 w-4" />
                        )}
                        {cliente.ativo ? 'Ativo' : 'Inativo'}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(cliente)}>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>
              {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  placeholder="Nome completo do cliente"
                  title="Nome do cliente"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tipoPessoa">Tipo</Label>
                  <select
                    id="tipoPessoa"
                    value={formData.tipoPessoa}
                    onChange={(e) => setFormData({ ...formData, tipoPessoa: e.target.value as 'FISICA' | 'JURIDICA' })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="FISICA">Pessoa Física</option>
                    <option value="JURIDICA">Pessoa Jurídica</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="documento">CPF/CNPJ</Label>
                  <Input
                    id="documento"
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                    title="CPF ou CNPJ do cliente"
                    value={formData.documento}
                    onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    title="Email do cliente"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    placeholder="(99) 99999-9999"
                    title="Formato: (99) 99999-9999"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telefoneCelular">Celular</Label>
                  <Input
                    id="telefoneCelular"
                    placeholder="(99) 99999-9999"
                    title="Formato: (99) 99999-9999"
                    value={formData.telefoneCelular}
                    onChange={(e) => setFormData({ ...formData, telefoneCelular: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="limiteCredito">Limite de Crédito</Label>
                  <Input
                    id="limiteCredito"
                    type="number"
                    placeholder="0,00"
                    title="Use vírgula para centavos"
                    value={formData.limiteCredito}
                    onChange={(e) => setFormData({ ...formData, limiteCredito: Number(e.target.value) })}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Salvando...' : editingCliente ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
