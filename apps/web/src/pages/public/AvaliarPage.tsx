import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, Truck, ThumbsUp, ShoppingBag, Store, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react"
import { publicEntregasService } from "@/services/entregas"

interface AvaliacaoData {
  tokenAvaliacao: string
  entrega: {
    pedidoVendaId?: string
    cliente?: { nome: string }
  }
  avaliacao: {
    ratingLoja: number
    ratingPedido: number
    ratingEntrega: number
    comentario?: string
  } | null
}

interface RatingSection {
  key: string
  label: string
  icon: typeof Star
  value: number
  onChange: (v: number) => void
}

function StarRating({ value, onChange, size = "md" }: { value: number; onChange: (v: number) => void; size?: string }) {
  const sizeClass = size === "lg" ? "w-8 h-8" : "w-6 h-6"
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`${sizeClass} transition-colors ${star <= value ? "text-yellow-400" : "text-gray-200"} hover:text-yellow-400`}
          title={`${star} estrela${star !== 1 ? "s" : ""}`}
        >
          <Star className="w-full h-full fill-current" />
        </button>
      ))}
    </div>
  )
}

export function AvaliarPage() {
  const { token } = useParams<{ token: string }>()
  const [data, setData] = useState<AvaliacaoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [ratingLoja, setRatingLoja] = useState(0)
  const [ratingPedido, setRatingPedido] = useState(0)
  const [ratingEntrega, setRatingEntrega] = useState(0)
  const [comentario, setComentario] = useState("")

  useEffect(() => {
    if (token) loadData()
  }, [token])

  async function loadData() {
    setLoading(true)
    try {
      const result = await publicEntregasService.avaliar.get(token!)
      if (!result) {
        setError("Avaliação não encontrada")
        return
      }
      setData(result)
      if (result.avaliacao) {
        setRatingLoja(result.avaliacao.ratingLoja || 0)
        setRatingPedido(result.avaliacao.ratingPedido || 0)
        setRatingEntrega(result.avaliacao.ratingEntrega || 0)
        setComentario(result.avaliacao.comentario || "")
      }
    } catch {
      setError("Não foi possível carregar a avaliação")
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit() {
    if (ratingLoja === 0) { setError("Avalie a loja"); return }
    if (ratingPedido === 0) { setError("Avalie o pedido"); return }
    if (ratingEntrega === 0) { setError("Avalie a entrega"); return }

    setSubmitting(true)
    setError("")
    try {
      await publicEntregasService.avaliar.post(token!, {
        ratingLoja,
        ratingPedido,
        ratingEntrega,
        comentario: comentario || undefined,
      })
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || "Erro ao enviar avaliação")
    } finally {
      setSubmitting(false)
    }
  }

  const alreadyEvaluated = data?.avaliacao !== null && data?.avaliacao !== undefined

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
          <p className="mt-4 text-gray-500">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Avaliação não encontrada</h2>
            <p className="text-gray-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Obrigado pela sua avaliação!</h2>
            <p className="text-gray-500">Sua opinião é muito importante para melhorarmos nossos serviços.</p>
            <div className="mt-6 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (alreadyEvaluated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Você já avaliou esta entrega</h2>
            <p className="text-gray-500">Obrigado! Sua avaliação já foi registrada em nosso sistema.</p>
            {data?.avaliacao && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Loja</span>
                  <StarRating value={data.avaliacao.ratingLoja} onChange={() => {}} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pedido</span>
                  <StarRating value={data.avaliacao.ratingPedido} onChange={() => {}} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Entrega</span>
                  <StarRating value={data.avaliacao.ratingEntrega} onChange={() => {}} />
                </div>
                {data.avaliacao.comentario && (
                  <div className="text-left p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 italic">"{data.avaliacao.comentario}"</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const sections: RatingSection[] = [
    { key: "loja", label: "Loja", icon: Store, value: ratingLoja, onChange: setRatingLoja },
    { key: "pedido", label: "Pedido", icon: ShoppingBag, value: ratingPedido, onChange: setRatingPedido },
    { key: "entrega", label: "Entrega", icon: Truck, value: ratingEntrega, onChange: setRatingEntrega },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <ThumbsUp className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Avalie sua Experiência</h1>
          <p className="text-gray-500 mt-1">
            Sua opinião ajuda a melhorar nossos serviços
            {data?.entrega?.cliente?.nome && <> - {data.entrega.cliente.nome}</>}
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6 space-y-6">
            {sections.map((section) => (
              <div key={section.key}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <section.icon className="w-5 h-5 text-muted-foreground" />
                    <Label className="text-base font-medium">{section.label}</Label>
                  </div>
                </div>
                <div className="flex justify-center">
                  <StarRating value={section.value} onChange={section.onChange} size="lg" />
                </div>
              </div>
            ))}

            <div className="space-y-2">
              <Label htmlFor="comentario" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Comentário (opcional)
              </Label>
              <Textarea
                id="comentario"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Compartilhe sua experiência, sugestões ou críticas construtivas..."
                title="Deixe um comentário opcional sobre sua experiência"
                className="min-h-[100px]"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={handleSubmit} disabled={submitting} className="w-full max-w-xs">
            {submitting ? "Enviando..." : "Enviar Avaliação"}
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">ERPoraqui - Sistema de Gestão</p>
        </div>
      </div>
    </div>
  )
}

export default AvaliarPage
