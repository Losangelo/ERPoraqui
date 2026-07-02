import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LookupField } from '@/components/lookup/LookupField'
import { api } from '@/services/api'
import { Plus, Trash2, XCircle, Eye } from 'lucide-react'

interface ClienteItem {
  id: string
  nome: string
  documento: string
}

interface Cte {
  id: string
  numero: number
  serie: string
  chaveAcesso: string
  modelo: string
  tomadorId: string
  tomadorTipo: string
  remetenteId: string | null
  destinatarioId: string | null
  tipoServico: string
  valorFrete: number
  valorCarga: number
  naturezaCarga: string | null
  especieCarga: string | null
  peso: number | null
  volumes: number | null
  situacao: string
  dataEmissao: string
  tomador: ClienteItem | null
  remetente: ClienteItem | null
  destinatario: ClienteItem | null
}

const situacaoLabel: Record<string, string> = {
  EM_DIGITACAO: 'Em Digitação',
  AUTORIZADO: 'Autorizado',
  CANCELADO: 'Cancelado',
  ENCERRADO: 'Encerrado',
}

const situacaoColor: Record<string, string> = {
  EM_DIGITACAO: 'text-yellow-600',
  AUTORIZADO: 'text-green-600',
  CANCELADO: 'text-red-600',
  ENCERRADO: 'text-blue-600',
}

const tipoServicoLabel: Record<string, string> = {
  NORMAL: 'Normal',
  SUBCONTRATACAO: 'Subcontratação',
  REDESPACHO: 'Redespacho',
  MISTO: 'Misto',
}

const tomadorTipoLabel: Record<string, string> = {
  REMETENTE: 'Remetente',
  DESTINATARIO: 'Destinatário',
  OUTROS: 'Outros',
}

export function CtePage() {
  const [ctes, setCtes] = useState<Cte[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedCte, setSelectedCte] = useState<Cte | null>(null)
  const [filiais, setFiliais] = useState<{ id: string; razaoSocial: string }[]>([])
  const [filtroSituacao, setFiltroSituacao] = useState('')

  const [form, setForm] = useState({
    filialId: '',
    tomadorId: '',
    tomadorTipo: 'REMETENTE' as string,
    remetenteId: '',
    destinatarioId: '',
    tipoServico: 'NORMAL' as string,
    valorFrete: '0',
    valorCarga: '0',
    naturezaCarga: '',
    especieCarga: '',
    peso: '',
    volumes: '',
  })

  const carregarCtes = useCallback(async () => {
    try {
      setLoading(true)
      const params: Record<string, unknown> = { pagina: 1, limite: 50 }
      if (filtroSituacao) params.situacao = filtroSituacao
      const res = await api.get('/cte', { params })
      setCtes(res.data?.data || [])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar CT-e'
      alert(message)
    } finally {
      setLoading(false)
    }
  }, [filtroSituacao])

  const carregarFiliais = useCallback(async () => {
    try {
      const res = await api.get('/empresas/filiais')
      setFiliais(res.data?.data || [])
    } catch (_) { /* ignore */ }
  }, [])

  useEffect(() => { carregarCtes() }, [carregarCtes])

  function openCreate() {
    carregarFiliais()
    setForm({
      filialId: '',
      tomadorId: '',
      tomadorTipo: 'REMETENTE',
      remetenteId: '',
      destinatarioId: '',
      tipoServico: 'NORMAL',
      valorFrete: '0',
      valorCarga: '0',
      naturezaCarga: '',
      especieCarga: '',
      peso: '',
      volumes: '',
    })
    setDialogOpen(true)
  }

  function openDetail(cte: Cte) {
    setSelectedCte(cte)
    setDetailDialogOpen(true)
  }

  async function criarCte() {
    try {
      const payload: Record<string, unknown> = {
        filialId: form.filialId || undefined,
        tomadorId: form.tomadorId,
        tomadorTipo: form.tomadorTipo,
        remetenteId: form.remetenteId || undefined,
        destinatarioId: form.destinatarioId || undefined,
        tipoServico: form.tipoServico,
        valorFrete: Number(form.valorFrete),
        valorCarga: Number(form.valorCarga),
        naturezaCarga: form.naturezaCarga || undefined,
        especieCarga: form.especieCarga || undefined,
        peso: form.peso ? Number(form.peso) : undefined,
        volumes: form.volumes ? Number(form.volumes) : undefined,
      }
      await api.post('/cte', payload)
      setDialogOpen(false)
      await carregarCtes()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao criar CT-e'
      alert(message)
    }
  }

  async function cancelarCte(id: string) {
    try {
      await api.post(`/cte/${id}/cancelar`)
      await carregarCtes()
      if (selectedCte?.id === id) {
        setSelectedCte(null)
        setDetailDialogOpen(false)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao cancelar CT-e'
      alert(message)
    }
  }

  async function excluirCte(id: string) {
    if (!confirm('Excluir CT-e?')) return
    try {
      await api.delete(`/cte/${id}`)
      await carregarCtes()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir'
      alert(message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">CT-e</h1>
          <p className="text-muted-foreground">Conhecimento de Transporte Eletrônico</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Novo CT-e
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-48">
          <Select value={filtroSituacao} onValueChange={setFiltroSituacao}>
            <SelectTrigger>
              <SelectValue placeholder="Todas situações" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Todas</SelectItem>
              <SelectItem value="EM_DIGITACAO">Em Digitação</SelectItem>
              <SelectItem value="AUTORIZADO">Autorizado</SelectItem>
              <SelectItem value="CANCELADO">Cancelado</SelectItem>
              <SelectItem value="ENCERRADO">Encerrado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conhecimentos de Transporte</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 text-muted-foreground">Carregando...</div>
          ) : ctes.length === 0 ? (
            <div className="p-4 text-muted-foreground">Nenhum CT-e encontrado</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº</TableHead>
                  <TableHead>Chave Acesso</TableHead>
                  <TableHead>Tomador</TableHead>
                  <TableHead>Tipo Serviço</TableHead>
                  <TableHead>Valor Frete</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-28">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ctes.map((cte) => (
                  <TableRow key={cte.id}>
                    <TableCell className="font-medium">{cte.numero}</TableCell>
                    <TableCell className="font-mono text-xs">{cte.chaveAcesso.slice(0, 20)}...</TableCell>
                    <TableCell>{cte.tomador?.nome || '-'}</TableCell>
                    <TableCell>{tipoServicoLabel[cte.tipoServico] || cte.tipoServico}</TableCell>
                    <TableCell>R$ {cte.valorFrete.toFixed(2)}</TableCell>
                    <TableCell><span className={situacaoColor[cte.situacao]}>{situacaoLabel[cte.situacao] || cte.situacao}</span></TableCell>
                    <TableCell className="text-xs">{new Date(cte.dataEmissao).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openDetail(cte)} title="Detalhes">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {cte.situacao === 'EM_DIGITACAO' && (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => excluirCte(cte.id)} title="Excluir">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo CT-e</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="filialId">Filial</Label>
              <Select value={form.filialId} onValueChange={v => setForm({...form, filialId: v})}>
                <SelectTrigger><SelectValue placeholder="Selecione a filial" /></SelectTrigger>
                <SelectContent>
                  {filiais.map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.razaoSocial}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tomadorTipo">Tipo Tomador</Label>
                <Select value={form.tomadorTipo} onValueChange={v => setForm({...form, tomadorTipo: v})}>
                  <SelectTrigger><SelectValue placeholder="Tipo do tomador" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REMETENTE">Remetente</SelectItem>
                    <SelectItem value="DESTINATARIO">Destinatário</SelectItem>
                    <SelectItem value="OUTROS">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tipoServico">Tipo Serviço</Label>
                <Select value={form.tipoServico} onValueChange={v => setForm({...form, tipoServico: v})}>
                  <SelectTrigger><SelectValue placeholder="Tipo de serviço" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="SUBCONTRATACAO">Subcontratação</SelectItem>
                    <SelectItem value="REDESPACHO">Redespacho</SelectItem>
                    <SelectItem value="MISTO">Misto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Tomador</Label>
              <LookupField
                source="clientes"
                value={form.tomadorId}
                selectedLabel={form.tomadorId ? undefined : ''}
                onChange={(item) => setForm({...form, tomadorId: item.id})}
                onClear={() => setForm({...form, tomadorId: ''})}
                placeholder="Buscar cliente tomador..."
              />
            </div>

            <div className="grid gap-2">
              <Label>Remetente</Label>
              <LookupField
                source="clientes"
                value={form.remetenteId}
                selectedLabel={form.remetenteId ? undefined : ''}
                onChange={(item) => setForm({...form, remetenteId: item.id})}
                onClear={() => setForm({...form, remetenteId: ''})}
                placeholder="Buscar cliente remetente (opcional)..."
              />
            </div>

            <div className="grid gap-2">
              <Label>Destinatário</Label>
              <LookupField
                source="clientes"
                value={form.destinatarioId}
                selectedLabel={form.destinatarioId ? undefined : ''}
                onChange={(item) => setForm({...form, destinatarioId: item.id})}
                onClear={() => setForm({...form, destinatarioId: ''})}
                placeholder="Buscar cliente destinatário (opcional)..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="valorFrete">Valor Frete (R$)</Label>
                <Input id="valorFrete" type="number" step="0.01" placeholder="Valor do frete" value={form.valorFrete} onChange={e => setForm({...form, valorFrete: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="valorCarga">Valor Carga (R$)</Label>
                <Input id="valorCarga" type="number" step="0.01" placeholder="Valor da carga" value={form.valorCarga} onChange={e => setForm({...form, valorCarga: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="naturezaCarga">Natureza da Carga</Label>
                <Input id="naturezaCarga" placeholder="Ex: granel, frigorífica, perigosa" value={form.naturezaCarga} onChange={e => setForm({...form, naturezaCarga: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="especieCarga">Espécie da Carga</Label>
                <Input id="especieCarga" placeholder="Ex: caixas, paletes, tambores" value={form.especieCarga} onChange={e => setForm({...form, especieCarga: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="peso">Peso (kg)</Label>
                <Input id="peso" type="number" step="0.1" placeholder="Peso total da carga" value={form.peso} onChange={e => setForm({...form, peso: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="volumes">Volumes</Label>
                <Input id="volumes" type="number" step="1" placeholder="Quantidade de volumes" value={form.volumes} onChange={e => setForm({...form, volumes: e.target.value})} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={criarCte}>Criar CT-e</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>CT-e nº {selectedCte?.numero} - {selectedCte && situacaoLabel[selectedCte.situacao]}</DialogTitle>
          </DialogHeader>
          {selectedCte && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Chave:</strong> <span className="font-mono text-xs">{selectedCte.chaveAcesso}</span></div>
                <div><strong>Série:</strong> {selectedCte.serie}</div>
                <div><strong>Modelo:</strong> {selectedCte.modelo}</div>
                <div><strong>Tipo Serviço:</strong> {tipoServicoLabel[selectedCte.tipoServico] || selectedCte.tipoServico}</div>
                <div><strong>Tomador:</strong> {selectedCte.tomador?.nome || '-'}</div>
                <div><strong>Tipo Tomador:</strong> {tomadorTipoLabel[selectedCte.tomadorTipo] || selectedCte.tomadorTipo}</div>
                <div><strong>Remetente:</strong> {selectedCte.remetente?.nome || '-'}</div>
                <div><strong>Destinatário:</strong> {selectedCte.destinatario?.nome || '-'}</div>
                <div><strong>Valor Frete:</strong> R$ {selectedCte.valorFrete.toFixed(2)}</div>
                <div><strong>Valor Carga:</strong> R$ {selectedCte.valorCarga.toFixed(2)}</div>
                <div><strong>Natureza:</strong> {selectedCte.naturezaCarga || '-'}</div>
                <div><strong>Espécie:</strong> {selectedCte.especieCarga || '-'}</div>
                <div><strong>Peso:</strong> {selectedCte.peso ? `${selectedCte.peso} kg` : '-'}</div>
                <div><strong>Volumes:</strong> {selectedCte.volumes ?? '-'}</div>
                <div><strong>Emissão:</strong> {new Date(selectedCte.dataEmissao).toLocaleString('pt-BR')}</div>
              </div>

              <div className="flex gap-2 pt-4">
                {(selectedCte.situacao === 'EM_DIGITACAO' || selectedCte.situacao === 'AUTORIZADO') && (
                  <Button onClick={() => cancelarCte(selectedCte.id)} variant="destructive">
                    <XCircle className="mr-2 h-4 w-4" /> Cancelar
                  </Button>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
