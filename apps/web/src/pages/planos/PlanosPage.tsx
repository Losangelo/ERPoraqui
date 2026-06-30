import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CreditCard, 
  Check, 
  X, 
  AlertTriangle, 
  Clock, 
  Users, 
  Package, 
  FileText, 
  Building,
  Star,
  Crown,
  Zap
} from "lucide-react"
import { licencasService, InfoLicenca, Plano } from '@/services/licencas'

function PlanosPage() {
  const [planos, setPlanos] = useState<Plano[]>([])
  const [licenca, setLicenca] = useState<InfoLicenca | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [planosData, licencaData] = await Promise.all([
        licencasService.listarPlanos(),
        licencasService.minhaLicenca()
      ])
      setPlanos(planosData)
      setLicenca(licencaData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const getIconPlano = (nome: string) => {
    switch (nome) {
      case 'PREMIUM': return <Crown className="w-6 h-6" />
      case 'PROFISSIONAL': return <Star className="w-6 h-6" />
      default: return <Zap className="w-6 h-6" />
    }
  }

  const getColorPlano = (nome: string) => {
    switch (nome) {
      case 'PREMIUM': return 'bg-gradient-to-r from-amber-500 to-yellow-600'
      case 'PROFISSIONAL': return 'bg-gradient-to-r from-blue-500 to-indigo-600'
      default: return 'bg-gradient-to-r from-green-500 to-emerald-600'
    }
  }

  const ModuloItem = ({ nome, ativo }: { nome: string; ativo: boolean }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm">{nome}</span>
      {ativo ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-gray-300" />
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Planos e Licenca</h1>
          <p className="text-muted-foreground">Gerencie seu plano e limites</p>
        </div>
      </div>

      {/* Status da Licenca Atual */}
      {licenca && (
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{licenca.plano?.nome || 'Plano'}</h2>
                  <Badge variant={licenca.status === 'ATIVA' ? 'default' : 'destructive'}>
                    {licenca.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  Chave: <code className="bg-gray-100 px-2 py-1 rounded">{licenca.chave}</code>
                </p>
                {licenca.diasRestantes !== null && licenca.diasRestantes !== undefined && (
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-orange-600">
                      {licenca.diasRestantes} dias restantes
                    </span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Tipo de Cobranca</p>
                <p className="font-medium">{licenca.tipoCobranca}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Limites Atuais */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Usuarios</p>
                <p className="text-2xl font-bold">
                  {licenca?.contagens.usuarios.atual || 0}
                  <span className="text-sm font-normal text-muted-foreground">
                    / {licenca?.contagens.usuarios.limite || 0}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Building className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Clientes</p>
                <p className="text-2xl font-bold">
                  {licenca?.contagens.clientes.atual || 0}
                  <span className="text-sm font-normal text-muted-foreground">
                    / {licenca?.contagens.clientes.limite || 0}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Package className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Produtos</p>
                <p className="text-2xl font-bold">
                  {licenca?.contagens.produtos.atual || 0}
                  <span className="text-sm font-normal text-muted-foreground">
                    / {licenca?.contagens.produtos.limite || 0}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <FileText className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Notas Fiscais</p>
                <p className="text-2xl font-bold">
                  {licenca?.contagens.notas.atual || 0}
                  <span className="text-sm font-normal text-muted-foreground">
                    / {licenca?.contagens.notas.limite || 0}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Planos Disponiveis */}
      <Tabs defaultValue="mensal">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Planos Disponiveis</h2>
          <TabsList>
            <TabsTrigger value="mensal">Mensal</TabsTrigger>
            <TabsTrigger value="anual">Anual</TabsTrigger>
            <TabsTrigger value="definitivo">Definitivo</TabsTrigger>
          </TabsList>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {planos.map((plano) => (
            <Card key={plano.id} className={`relative overflow-hidden ${licenca?.plano?.nome === plano.nome ? 'ring-2 ring-primary' : ''}`}>
              {licenca?.plano?.nome === plano.nome && (
                <div className={`absolute top-0 right-0 ${getColorPlano(plano.nome)} text-white px-3 py-1 text-xs font-bold rounded-bl-lg`}>
                  ATUAL
                </div>
              )}
              
              <CardHeader className={`${getColorPlano(plano.nome)} text-white`}>
                <div className="flex items-center gap-2">
                  {getIconPlano(plano.nome)}
                  <CardTitle className="text-white">{plano.nome}</CardTitle>
                </div>
                <CardDescription className="text-white/80">
                  {plano.descricao}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="mb-4">
                  {plano.tipoCobranca === 'MENSAL' && plano.precoMensal && (
                    <div className="text-3xl font-bold">
                      R$ {plano.precoMensal}
                      <span className="text-sm font-normal text-muted-foreground">/mes</span>
                    </div>
                  )}
                  {plano.tipoCobranca === 'ANUAL' && plano.precoAnual && (
                    <div className="text-3xl font-bold">
                      R$ {plano.precoAnual}
                      <span className="text-sm font-normal text-muted-foreground">/ano</span>
                    </div>
                  )}
                  {plano.tipoCobranca === 'DEFINITIVO' && plano.precoDefinitivo && (
                    <div className="text-3xl font-bold">
                      R$ {plano.precoDefinitivo}
                      <span className="text-sm font-normal text-muted-foreground"> unico</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Usuarios</span>
                    <span className="font-medium">{plano.limiteUsuarios}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Clientes</span>
                    <span className="font-medium">{plano.limiteClientes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Produtos</span>
                    <span className="font-medium">{plano.limiteProdutos.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Notas/mes</span>
                    <span className="font-medium">{plano.limiteNotasFiscais.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t mt-4 pt-4">
                  <p className="text-sm font-medium mb-2">Modulos</p>
                  <ModuloItem nome="CRM" ativo={plano.moduloCrm} />
                  <ModuloItem nome="Automacao" ativo={plano.moduloAutomacao} />
                  <ModuloItem nome="Multi-empresa" ativo={plano.moduloMultiEmpresa} />
                  <ModuloItem nome="API Externa" ativo={plano.moduloApi} />
                  <ModuloItem nome="Boletos" ativo={plano.moduloBoletos} />
                  <ModuloItem nome="NFSe" ativo={plano.moduloNfse} />
                  <ModuloItem nome="ECF" ativo={plano.moduloEcf} />
                  <ModuloItem nome="DRE" ativo={plano.moduloDre} />
                  <ModuloItem nome="Plano de Contas" ativo={plano.moduloPlanoContas} />
                </div>
              </CardContent>

              <CardFooter>
                {licenca?.plano?.nome === plano.nome ? (
                  <Button className="w-full" disabled variant="outline">
                    Plano Atual
                  </Button>
                ) : (
                  <Button className="w-full">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Assinar Plano
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </Tabs>

      {/* Alertas de Limite */}
      {licenca && (
        <div className="space-y-2">
          {licenca.contagens.usuarios.atual >= licenca.contagens.usuarios.limite && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-700">
                Voce atingiu o limite de usuarios. Considere fazer upgrade do plano.
              </span>
            </div>
          )}
          {licenca.contagens.clientes.atual >= licenca.contagens.clientes.limite && (
            <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-orange-700">
                Voce atingiu o limite de clientes.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PlanosPage
