import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, MapPin, User, CheckCircle2, XCircle, AlertCircle, Phone } from "lucide-react"
import { publicEntregasService } from "@/services/entregas"

interface RastreioData {
  situacao: string
  tokenRastreio: string
  dataCriacao: string
  dataAgendamento?: string
  dataSaida?: string
  dataEntrega?: string
  dataPrevisao?: string
  enderecoEntrega?: any
  cliente?: { nome: string; telefone?: string; email?: string }
  motorista?: { nome: string; telefone?: string }
  veiculo?: { placa: string; modelo?: string; marca?: string; cor?: string }
  tentativas: Array<{ dataTentativa: string; motivoFalha?: string; observacoes?: string }>
}

const SITUACAO_BADGE: Record<string, string> = {
  PENDENTE: "bg-yellow-100 text-yellow-800",
  AGENDADO: "bg-blue-100 text-blue-800",
  SAIU_PARA_ENTREGA: "bg-purple-100 text-purple-800",
  ENTREGUE: "bg-green-100 text-green-800",
  TENTATIVA_FALHOU: "bg-red-100 text-red-800",
  CANCELADO: "bg-gray-100 text-gray-800",
}

const SITUACAO_LABEL: Record<string, string> = {
  PENDENTE: "Pendente",
  AGENDADO: "Agendado",
  SAIU_PARA_ENTREGA: "Saiu para Entrega",
  ENTREGUE: "Entregue",
  TENTATIVA_FALHOU: "Tentativa Falhou",
  CANCELADO: "Cancelado",
}

const STEPS = ["PENDENTE", "AGENDADO", "SAIU_PARA_ENTREGA", "ENTREGUE"]

export function RastreioPage() {
  const { token } = useParams<{ token: string }>()
  const [data, setData] = useState<RastreioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (token) loadData()
  }, [token])

  async function loadData() {
    setLoading(true)
    try {
      const result = await publicEntregasService.rastreio(token!)
      if (!result) {
        setError("Token de rastreio não encontrado")
        return
      }
      setData(result)
    } catch {
      setError("Não foi possível carregar as informações de rastreio")
    } finally {
      setLoading(false)
    }
  }

  function getStepIndex(situacao: string) {
    const idx = STEPS.indexOf(situacao)
    if (idx >= 0) return idx
    if (situacao === "TENTATIVA_FALHOU" || situacao === "CANCELADO") return -1
    return 0
  }

  function formatDataHora(data?: string) {
    if (!data) return "-"
    return new Date(data).toLocaleString("pt-BR")
  }

  const stepIndex = data ? getStepIndex(data.situacao) : -1

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
          <p className="mt-4 text-gray-500">Buscando informações da entrega...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Entrega não encontrada</h2>
            <p className="text-gray-500">{error || "Verifique o token de rastreio e tente novamente"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Truck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Rastreio de Entrega</h1>
          <p className="text-gray-500 mt-1">Acompanhe o status da sua entrega</p>
          <p className="font-mono text-sm text-gray-400 mt-2">Token: {data.tokenRastreio}</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-2"
              style={{ backgroundColor: SITUACAO_BADGE[data.situacao]?.split(" ")[0] || "#f3f4f6", color: SITUACAO_BADGE[data.situacao]?.split(" ")[1]?.replace("text-", "") || "#374151" }}>
              {SITUACAO_LABEL[data.situacao] || data.situacao}
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {data.situacao === "ENTREGUE" ? "Entrega Realizada!" : "Entrega em Andamento"}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              {STEPS.map((step, idx) => {
                const isCompleted = idx <= stepIndex
                const isCurrent = idx === stepIndex
                return (
                  <div key={step} className="flex items-start mb-6 last:mb-0">
                    <div className="flex flex-col items-center mr-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isCompleted ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"}`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      {idx < STEPS.length - 1 && (
                        <div className={`w-0.5 h-12 mt-1 ${isCompleted ? "bg-blue-600" : "bg-gray-200"}`} />
                      )}
                    </div>
                    <div className="pt-1">
                      <p className={`font-medium ${isCurrent ? "text-blue-600" : isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                        {SITUACAO_LABEL[step]}
                      </p>
                      <p className="text-sm text-gray-400">
                        {idx === 0 && formatDataHora(data.dataCriacao)}
                        {idx === 1 && formatDataHora(data.dataAgendamento)}
                        {idx === 2 && formatDataHora(data.dataSaida)}
                        {idx === 3 && formatDataHora(data.dataEntrega)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {data.cliente && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <User className="w-4 h-4" />
                  <span className="font-medium">Cliente</span>
                </div>
                <p className="font-medium">{data.cliente.nome}</p>
                {data.cliente.telefone && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Phone className="w-3 h-3" /> {data.cliente.telefone}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {data.motorista && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <User className="w-4 h-4" />
                  <span className="font-medium">Motorista</span>
                </div>
                <p className="font-medium">{data.motorista.nome}</p>
                {data.motorista.telefone && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Phone className="w-3 h-3" /> {data.motorista.telefone}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {data.veiculo && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Truck className="w-4 h-4" />
                  <span className="font-medium">Veículo</span>
                </div>
                <p className="font-medium uppercase">{data.veiculo.placa}</p>
                {data.veiculo.marca && (
                  <p className="text-sm text-muted-foreground">{data.veiculo.marca} {data.veiculo.modelo || ""}</p>
                )}
                {data.veiculo.cor && <p className="text-sm text-muted-foreground">Cor: {data.veiculo.cor}</p>}
              </CardContent>
            </Card>
          )}

          {data.enderecoEntrega && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">Endereço de Entrega</span>
                </div>
                <p className="text-sm whitespace-pre-wrap">
                  {typeof data.enderecoEntrega === "string" ? data.enderecoEntrega : JSON.stringify(data.enderecoEntrega)}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {data.tentativas && data.tentativas.length > 0 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                Tentativas de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.tentativas.map((t, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-red-50">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">{formatDataHora(t.dataTentativa)}</p>
                      <p className="text-sm font-medium text-red-700">{t.motivoFalha || "Motivo não informado"}</p>
                      {t.observacoes && <p className="text-xs text-muted-foreground mt-1">{t.observacoes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">ERPoraqui - Sistema de Gestão</p>
        </div>
      </div>
    </div>
  )
}

export default RastreioPage
