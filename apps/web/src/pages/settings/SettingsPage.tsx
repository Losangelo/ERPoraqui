import { useState } from 'react';
import { Settings, RefreshCw, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const parametrosExemplo = [
  { id: '1', chave: 'VENDAS_PERMITIR_DESCONTO', valor: 'true', tipo: 'BOOLEANO', modulo: 'VENDAS', descricao: 'Permitir desconto nas vendas' },
  { id: '2', chave: 'VENDAS_DESCONTO_MAXIMO', valor: '10', tipo: 'NUMERO', modulo: 'VENDAS', descricao: 'Desconto máximo permitido (%)' },
  { id: '3', chave: 'ESTOQUE_CONTROLAR', valor: 'true', tipo: 'BOOLEANO', modulo: 'ESTOQUE', descricao: 'Controlar estoque' },
  { id: '4', chave: 'NF_E_AMBIENTE', valor: '2', tipo: 'TEXTO', modulo: 'NF_E', descricao: 'Ambiente NF-e (1=Produção, 2=Homologação)' },
  { id: '5', chave: 'MOEDA_PADRAO', valor: 'BRL', tipo: 'TEXTO', modulo: 'GERAL', descricao: 'Moeda padrão do sistema' },
  { id: '6', chave: 'DECIMAIS_VALOR', valor: '2', tipo: 'NUMERO', modulo: 'GERAL', descricao: 'Casas decimais para valores' },
];

const modulos = ['GERAL', 'CADASTROS', 'VENDAS', 'COMPRAS', 'ESTOQUE', 'FINANCEIRO', 'FISCAL', 'NF_E', 'RELATORIOS'];

const tipos = ['TEXTO', 'NUMERO', 'BOOLEANO', 'DATA', 'JSON'];

export function SettingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [moduloFilter, setModuloFilter] = useState('TODOS');
  const [parametros] = useState(parametrosExemplo);

  const filteredParams = parametros.filter(param => {
    const matchesSearch = param.chave.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          param.descricao?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = moduloFilter === 'TODOS' || param.modulo === moduloFilter;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="h-7 w-7 text-primary-600" />
            Parameterização do Sistema
          </h1>
          <p className="text-gray-500">Configure as regras de negócio por empresa</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Parâmetro
        </Button>
      </div>

      <Card className="p-4">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por chave ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={moduloFilter}
              onChange={(e) => setModuloFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-48"
            >
              <option value="TODOS">Todos os Módulos</option>
              {modulos.map(modulo => (
                <option key={modulo} value={modulo}>{modulo}</option>
              ))}
            </select>
            <Button variant="secondary" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Restaurar Padrões
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chave
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Módulo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredParams.map((param) => (
                  <tr key={param.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-primary-700">
                        {param.chave}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                        param.tipo === 'BOOLEANO' 
                          ? param.valor === 'true' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          : param.tipo === 'NUMERO'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {param.valor}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {param.tipo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex rounded-full px-2 text-xs font-semibold bg-purple-100 text-purple-800">
                        {param.modulo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {param.descricao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-primary-600" title="Editar">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600" title="Excluir">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredParams.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>Nenhum parâmetro encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="p-4">
        <CardContent className="p-0">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Legenda de Tipos</h3>
          <div className="flex flex-wrap gap-4">
            {tipos.map(tipo => (
              <div key={tipo} className="flex items-center gap-2">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                  tipo === 'BOOLEANO' ? 'bg-green-100 text-green-800' :
                  tipo === 'NUMERO' ? 'bg-blue-100 text-blue-800' :
                  tipo === 'DATA' ? 'bg-orange-100 text-orange-800' :
                  tipo === 'JSON' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {tipo}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
