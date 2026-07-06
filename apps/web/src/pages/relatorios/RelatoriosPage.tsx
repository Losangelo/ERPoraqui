import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/services/api'
import { exportarCSV, exportarXLSX } from '@/utils/export'
import { Play, Save, Trash2, Download, FileText, Database, Columns } from 'lucide-react'

interface DataSourceCol {
  key: string
  label: string
  type: string
}

interface DataSource {
  id: string
  nome: string
  descricao: string
  colunas: DataSourceCol[]
}

interface Template {
  id: string
  nome: string
  descricao: string | null
  dataSource: string
  colunas: string[]
  filtros: any
  formato: string
  dataCriacao: string
}

interface ReportResult {
  dataSource: string
  colunas: string[]
  linhas: Record<string, any>[]
  total: number
}

const initialFilter = { campo: '', operador: 'eq', valor: '' }

export function RelatoriosPage() {
  const [dataSources, setDataSources] = useState<DataSource[]>([])
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null)
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [filters, setFilters] = useState<typeof initialFilter[]>([])
  const [result, setResult] = useState<ReportResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [templates, setTemplates] = useState<Template[]>([])
  const [templateName, setTemplateName] = useState('')
  const [templateDesc, setTemplateDesc] = useState('')
  const [format, setFormat] = useState('table')
  const [showTemplates, setShowTemplates] = useState(false)
  const [showSaveTemplate, setShowSaveTemplate] = useState(false)

  const carregarSources = useCallback(async () => {
    try {
      const res = await api.get('/relatorios/data-sources')
      setDataSources(res.data?.data || [])
    } catch (_) { }
  }, [])

  const carregarTemplates = useCallback(async () => {
    try {
      const res = await api.get('/relatorios/templates')
      setTemplates(res.data?.data || [])
    } catch (_) { }
  }, [])

  useEffect(() => { carregarSources(); carregarTemplates() }, [carregarSources, carregarTemplates])

  function selectSource(id: string) {
    const src = dataSources.find(d => d.id === id) || null
    setSelectedSource(src)
    setSelectedColumns(src ? src.colunas.map(c => c.key) : [])
    setFilters([])
    setResult(null)
  }

  function toggleColumn(key: string) {
    setSelectedColumns(prev =>
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    )
  }

  function updateFilter(idx: number, field: string, value: string) {
    setFilters(prev => prev.map((f, i) => i === idx ? { ...f, [field]: value } : f))
  }

  function addFilter() {
    setFilters(prev => [...prev, { ...initialFilter }])
  }

  function removeFilter(idx: number) {
    setFilters(prev => prev.filter((_, i) => i !== idx))
  }

  async function executar() {
    if (!selectedSource || selectedColumns.length === 0) return
    try {
      setLoading(true)
      const res = await api.post('/relatorios/executar', {
        dataSource: selectedSource.id,
        colunas: selectedColumns,
        filtros: filters.filter(f => f.campo),
      })
      setResult(res.data?.data || null)
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Erro ao executar relatório')
    } finally {
      setLoading(false)
    }
  }

  function downloadCSV() {
    if (!result) return
    const colunas = result.colunas.map(c => ({ label: colLabels[c] || c, accessor: c as string }))
    const dados = result.linhas.map(r => {
      const obj: Record<string, unknown> = {}
      result.colunas.forEach(c => { obj[c] = r[c] as unknown })
      return obj
    })
    exportarCSV(dados, colunas, `relatorio_${selectedSource?.nome}_${Date.now()}`)
  }

  function downloadXLSX() {
    if (!result) return
    const colunas = result.colunas.map(c => ({ label: colLabels[c] || c, accessor: c as string }))
    const dados = result.linhas.map(r => {
      const obj: Record<string, unknown> = {}
      result.colunas.forEach(c => { obj[c] = r[c] as unknown })
      return obj
    })
    exportarXLSX(dados, colunas, `relatorio_${selectedSource?.nome}_${Date.now()}`)
  }

  async function salvarTemplate() {
    if (!selectedSource || !templateName || selectedColumns.length === 0) return
    try {
      await api.post('/relatorios/templates', {
        nome: templateName,
        descricao: templateDesc || undefined,
        dataSource: selectedSource.id,
        colunas: selectedColumns,
        filtros: filters.filter(f => f.campo),
        formato: format,
      })
      setTemplateName('')
      setTemplateDesc('')
      await carregarTemplates()
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Erro ao salvar template')
    }
  }

  async function carregarTemplate(t: Template) {
    const src = dataSources.find(d => d.id === t.dataSource)
    if (!src) return
    setSelectedSource(src)
    setSelectedColumns(t.colunas)
    setFilters(t.filtros || [])
    setFormat(t.formato)
    setResult(null)
  }

  async function excluirTemplate(id: string) {
    if (!confirm('Excluir template?')) return
    try {
      await api.delete(`/relatorios/templates/${id}`)
      await carregarTemplates()
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Erro ao excluir')
    }
  }

  const colLabels = selectedSource
    ? Object.fromEntries(selectedSource.colunas.map(c => [c.key, c.label]))
    : {}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">Motor de relatórios genérico — selecione dados, colunas e filtros</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowTemplates(!showTemplates)}>
            <FileText className="mr-2 h-4 w-4" /> Templates
          </Button>
        </div>
      </div>

      {templates.length > 0 && showTemplates && (
        <Card>
          <CardHeader><CardTitle>Templates Salvos</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Fonte</TableHead>
                  <TableHead>Formato</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map(t => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.nome}</TableCell>
                    <TableCell>{t.dataSource}</TableCell>
                    <TableCell>{t.formato}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => carregarTemplate(t)}>Carregar</Button>
                        <Button variant="ghost" size="icon" title="Excluir template" onClick={() => excluirTemplate(t.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="h-4 w-4" /> Fonte de Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Fonte</Label>
              <Select value={selectedSource?.id || ''} onValueChange={selectSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma fonte" />
                </SelectTrigger>
                <SelectContent>
                  {dataSources.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSource && (
              <>
                <div className="grid gap-2">
                  <Label className="flex items-center gap-2">
                    <Columns className="h-4 w-4" /> Colunas
                  </Label>
                  <div className="max-h-48 overflow-y-auto space-y-1 border rounded-md p-2">
                    {selectedSource.colunas.map(col => (
                      <label key={col.key} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted rounded px-1 py-0.5">
                        <input
                          type="checkbox"
                          checked={selectedColumns.includes(col.key)}
                          onChange={() => toggleColumn(col.key)}
                          className="rounded border-gray-300"
                        />
                        {col.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Filtros</Label>
                  {filters.map((f, i) => (
                    <div key={i} className="flex gap-1 items-center">
                      <select
                        className="flex h-8 w-24 rounded-md border border-input bg-transparent px-2 text-xs"
                        value={f.campo}
                        onChange={e => updateFilter(i, 'campo', e.target.value)}
                      >
                        <option value="">Campo</option>
                        {selectedSource.colunas.map(col => (
                          <option key={col.key} value={col.key}>{col.label}</option>
                        ))}
                      </select>
                      <Input
                        className="h-8 text-xs"
                        placeholder="Valor do filtro"
                        value={f.valor}
                        onChange={e => updateFilter(i, 'valor', e.target.value)}
                      />
                      <Button variant="ghost" size="icon" title="Remover filtro" className="h-8 w-8" onClick={() => removeFilter(i)}>
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addFilter}>
                    + Filtro
                  </Button>
                </div>

                <div className="grid gap-2">
                  <Label>Formato</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="table">Tabela</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">XLSX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {format === 'table' && (
                  <Button onClick={executar} disabled={loading || selectedColumns.length === 0}>
                    <Play className="mr-2 h-4 w-4" /> Executar
                  </Button>
                )}
                {format !== 'table' && (
                  <Button onClick={format === 'csv' ? downloadCSV : downloadXLSX} disabled={!result}>
                    <Download className="mr-2 h-4 w-4" /> Download {format.toUpperCase()}
                  </Button>
                )}

                <Button variant="outline" size="sm" onClick={() => setShowSaveTemplate(!showSaveTemplate)}>
                  <Save className="mr-2 h-4 w-4" /> Salvar template
                </Button>
                {showSaveTemplate && (
                  <div className="space-y-2 border rounded-md p-3">
                    <Input placeholder="Nome do template" value={templateName} onChange={e => setTemplateName(e.target.value)} />
                    <Input placeholder="Descrição (opcional)" value={templateDesc} onChange={e => setTemplateDesc(e.target.value)} />
                    <Button size="sm" onClick={salvarTemplate} disabled={!templateName}>
                      <Save className="mr-2 h-4 w-4" /> Salvar
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4" /> Resultado
              {result && <span className="text-sm font-normal text-muted-foreground ml-2">({result.total} registros)</span>}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Executando relatório...</div>
            ) : !result ? (
              <div className="p-8 text-center text-muted-foreground">Selecione fonte, colunas e clique em Executar</div>
            ) : result.linhas.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">Nenhum resultado encontrado</div>
            ) : (
              <div className="overflow-auto max-h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {result.colunas.map(col => (
                        <TableHead key={col}>{colLabels[col] || col}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.linhas.slice(0, 200).map((row, i) => (
                      <TableRow key={i}>
                        {result.colunas.map(col => (
                          <TableCell key={col}>
                            {formatCell(row[col])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {result.linhas.length > 200 && (
                  <div className="p-2 text-center text-xs text-muted-foreground border-t">
                    Mostrando 200 de {result.linhas.length} registros
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function formatCell(value: any): string {
  if (value === null || value === undefined) return '-'
  if (value instanceof Date || (typeof value === 'string' && value.includes('T'))) {
    try { return new Date(value).toLocaleString('pt-BR') } catch { return String(value) }
  }
  if (typeof value === 'number') return value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não'
  return String(value)
}
