import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, ChevronDown, FileSpreadsheet, FileJson, FileText, File } from 'lucide-react'
import { exportarCSV, exportarJSON, exportarXLSX, exportarPDF, type ColunaExportacao, type FormatoExportacao } from '@/utils/export'

interface ExportButtonProps {
  dados: Record<string, unknown>[]
  colunas: ColunaExportacao[]
  nomeArquivo: string
  tituloRelatorio?: string
  elementoIdParaPDF?: string
  formatos?: FormatoExportacao[]
}

export function ExportButton({
  dados,
  colunas,
  nomeArquivo,
  tituloRelatorio,
  elementoIdParaPDF,
  formatos = ['csv', 'json', 'xlsx', 'pdf'],
}: ExportButtonProps) {
  const [aberto, setAberto] = useState(false)
  const [exportando, setExportando] = useState<FormatoExportacao | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setAberto(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const icones: Record<FormatoExportacao, React.ReactNode> = {
    csv: <FileText className="h-4 w-4" />,
    json: <FileJson className="h-4 w-4" />,
    xlsx: <FileSpreadsheet className="h-4 w-4" />,
    pdf: <File className="h-4 w-4" />,
  }

  const labels: Record<FormatoExportacao, string> = {
    csv: 'CSV (Excel)',
    json: 'JSON',
    xlsx: 'XLSX (Excel)',
    pdf: 'PDF',
  }

  async function handleExport(formato: FormatoExportacao) {
    setExportando(formato)
    setAberto(false)

    try {
      switch (formato) {
        case 'csv':
          exportarCSV(dados, colunas, nomeArquivo)
          break
        case 'json':
          exportarJSON(dados, nomeArquivo)
          break
        case 'xlsx':
          exportarXLSX(dados, colunas, nomeArquivo)
          break
        case 'pdf':
          if (elementoIdParaPDF) {
            await exportarPDF(elementoIdParaPDF, nomeArquivo, tituloRelatorio)
          }
          break
      }
    } finally {
      setExportando(null)
    }
  }

  return (
    <div ref={ref} className="relative">
      <Button
        variant="outline"
        onClick={() => setAberto(!aberto)}
        disabled={exportando !== null}
      >
        <Download className="mr-2 h-4 w-4" />
        {exportando ? `Exportando ${exportando.toUpperCase()}...` : 'Exportar'}
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>

      {aberto && (
        <div className="absolute right-0 z-50 mt-1 w-48 rounded-md border bg-popover p-1 shadow-md">
          {formatos.map(formato => (
            <button
              key={formato}
              onClick={() => handleExport(formato)}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
            >
              {icones[formato]}
              {labels[formato]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
