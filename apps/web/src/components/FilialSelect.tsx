import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { empresasService, type Filial, type Empresa } from "@/services/estoque"

interface FilialSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function FilialSelect({ value, onValueChange, placeholder, disabled }: FilialSelectProps) {
  const [filiais, setFiliais] = useState<Filial[]>([])
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [empresaId, setEmpresaId] = useState("")

  useEffect(() => {
    empresasService.listar().then(data => {
      const lista = Array.isArray(data) ? data : (data as any)?.dados || []
      setEmpresas(lista)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!empresaId && empresas.length > 0) {
      setEmpresaId(empresas[0].id)
    }
  }, [empresas, empresaId])

  useEffect(() => {
    if (!empresaId) return
    empresasService.listarFiliais(empresaId).then(data => {
      setFiliais(Array.isArray(data) ? data : [])
    }).catch(() => setFiliais([]))
  }, [empresaId])

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder || "Selecione a filial"} />
      </SelectTrigger>
      <SelectContent>
        {empresas.length > 1 && (
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b">
            Empresa: {empresas.find(e => e.id === empresaId)?.razaoSocial || ""}
          </div>
        )}
        {filiais.length === 0 ? (
          <SelectItem value="__none__" disabled>Nenhuma filial disponível</SelectItem>
        ) : (
          filiais.map(f => (
            <SelectItem key={f.id} value={f.id}>
              {f.nomeFantasia || f.razaoSocial}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}
