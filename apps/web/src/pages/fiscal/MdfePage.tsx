import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/services/api'
import { Plus, Trash2, XCircle, CheckCircle, Eye } from 'lucide-react'

interface VeiculoItem {
  id: string
  placa: string
  marca: string | null
  modelo: string | null
}

interface CondutorItem {
  id: string
  nome: string
  cpf: string
}

interface MdfeDocumento {
  id: string
  tipo: string
  chaveAcesso: string
  valorDocumento: number
  pesoTotal: number
}

interface MdfeEvento {
  id: string
  tipo: string
  descricao: string
  dataEvento: string
  protocolo: string | null
}

interface Mdfe {
  id: string
  serie: number
  numero: number
  chaveAcesso: string
  ufCarregamento: string
  ufDescarregamento: string | null
  rntrc: string | null
  veiculo: VeiculoItem | null
  condutor: CondutorItem | null
  valorTotalCarga: number
  qtdTotalDocumentos: number
  situacao: string
  dataEmissao: string
  dataAutorizacao: string | null
  dataEncerramento: string | null
  observacoes: string | null
  documentos: MdfeDocumento[]
  eventos: MdfeEvento[]
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

export function MdfePage() {
  const [mdfes, setMdfes] = useState<Mdfe[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedMdfe, setSelectedMdfe] = useState<Mdfe | null>(null)
  const [veiculos, setVeiculos] = useState<VeiculoItem[]>([])
  const [condutores, setCondutores] = useState<CondutorItem[]>([])
  const [filtroSituacao, setFiltroSituacao] = useState('')

  const [form, setForm] = useState({
    filialId: '',
    ufCarregamento: 'SP',
    ufDescarregamento: '',
    rntrc: '',
    veiculoId: '',
    condutorId: '',
    valorTotalCarga: '0',
    observacoes: '',
  })

  const carregarMdfes = useCallback(async () => {
    try {
      setLoading(true)
      const params: any = { pagina: 1, limite: 50 }
      if (filtroSituacao) params.situacao = filtroSituacao
      const res = await api.get('/mdfe', { params })
      setMdfes(res.data?.data || [])
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Erro ao carregar MDF-e')
    } finally {
      setLoading(false)
    }
  }, [filtroSituacao])

  const carregarVeiculos = useCallback(async () => {
    try {
      const res = await api.get('/mdfe/veiculos')
      setVeiculos((res.data?.data || []).filter((v: any) => v.ativo))
    } catch (_) { }
  }, [])

  const carregarCondutores = useCallback(async () => {
    try {
      const res = await api.get('/mdfe/condutores')
      setCondutores((res.data?.data || []).filter((c: any) => c.ativo))
    } catch (_) { }
  }, [])

  useEffect(() => { carregarMdfes() }, [carregarMdfes])

  function openCreate() {
    carregarVeiculos()
    carregarCondutores()
    setForm({
      filialId: '',
      ufCarregamento: 'SP',
      ufDescarregamento: '',
      rntrc: '',
      veiculoId: '',
      condutorId: '',
      valorTotalCarga: '0',
      observacoes: '',
    })
    setDialogOpen(true)
  }

  function openDetail(m: Mdfe) {
    setSelectedMdfe(m)
    setDetailDialogOpen(true)
  }

  async function criarMdfe() {
    try {
      const payload = {
        filialId: form.filialId || undefined,
        ufCarregamento: form.ufCarregamento,
        ufDescarregamento: form.ufDescarregamento || undefined,
        rntrc: form.rntrc || undefined,
        veiculoId: form.veiculoId || undefined,
        condutorId: form.condutorId || undefined,
        valorTotalCarga: Number(form.valorTotalCarga),
        observacoes: form.observacoes || undefined,
      }
      await api.post('/mdfe', payload)
      setDialogOpen(false)
      await carregarMdfes()
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Erro ao criar MDF-e')
    }
  }

  async function actionMdfe(id: string, action: string) {
    try {
      await api.post(`/mdfe/${id}/${action}`)
      await carregarMdfes()
      if (selectedMdfe?.id === id) {
        setSelectedMdfe(null)
        setDetailDialogOpen(false)
      }
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Erro na operação')
    }
  }

  async function excluirMdfe(id: string) {
    if (!confirm('Excluir MDF-e?')) return
    try {
      await api.delete(`/mdfe/${id}`)
      await carregarMdfes()
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Erro ao excluir')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">MDF-e</h1>
          <p className="text-muted-foreground">Manifesto Eletrônico de Documentos Fiscais</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Novo MDF-e
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
          <CardTitle>Manifestos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 text-muted-foreground">Carregando...</div>
          ) : mdfes.length === 0 ? (
            <div className="p-4 text-muted-foreground">Nenhum MDF-e encontrado</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>MDF-e</TableHead>
                  <TableHead>UF</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Condutor</TableHead>
                  <TableHead>Documentos</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-28">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mdfes.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-mono text-xs">{m.chaveAcesso.slice(0, 20)}...</TableCell>
                    <TableCell>{m.ufCarregamento} → {m.ufDescarregamento || '-'}</TableCell>
                    <TableCell>{m.veiculo?.placa || '-'}</TableCell>
                    <TableCell>{m.condutor?.nome?.split(' ')[0] || '-'}</TableCell>
                    <TableCell>{m.qtdTotalDocumentos}</TableCell>
                    <TableCell>R$ {m.valorTotalCarga.toFixed(2)}</TableCell>
                    <TableCell><span className={situacaoColor[m.situacao]}>{situacaoLabel[m.situacao] || m.situacao}</span></TableCell>
                    <TableCell className="text-xs">{new Date(m.dataEmissao).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openDetail(m)} title="Detalhes">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {m.situacao === 'EM_DIGITACAO' && (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => excluirMdfe(m.id)} title="Excluir">
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Novo MDF-e</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ufCarregamento">UF Carregamento</Label>
                <Input id="ufCarregamento" placeholder="SP" title="Sigla do estado de carregamento" maxLength={2} value={form.ufCarregamento} onChange={e => setForm({...form, ufCarregamento: e.target.value.toUpperCase()})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ufDescarregamento">UF Descarregamento</Label>
                <Input id="ufDescarregamento" placeholder="RJ" title="Sigla do estado de descarregamento" maxLength={2} value={form.ufDescarregamento} onChange={e => setForm({...form, ufDescarregamento: e.target.value.toUpperCase()})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="veiculoId">Veículo</Label>
                <Select value={form.veiculoId} onValueChange={v => setForm({...form, veiculoId: v})}>
                  <SelectTrigger><SelectValue placeholder="Selecione um veículo" /></SelectTrigger>
                  <SelectContent>
                    {veiculos.map(v => (
                      <SelectItem key={v.id} value={v.id}>{v.placa} - {v.marca || ''} {v.modelo || ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="condutorId">Condutor</Label>
                <Select value={form.condutorId} onValueChange={v => setForm({...form, condutorId: v})}>
                  <SelectTrigger><SelectValue placeholder="Selecione um condutor" /></SelectTrigger>
                  <SelectContent>
                    {condutores.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="rntrc">RNTRC</Label>
                <Input id="rntrc" placeholder="Registro Nacional de Transportadores" value={form.rntrc} onChange={e => setForm({...form, rntrc: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="valorTotalCarga">Valor Total Carga (R$)</Label>
                <Input id="valorTotalCarga" type="number" step="0.01" placeholder="Valor total da carga" value={form.valorTotalCarga} onChange={e => setForm({...form, valorTotalCarga: e.target.value})} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="observacoes">Observações</Label>
              <textarea
                id="observacoes"
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Observações adicionais sobre o manifesto"
                value={form.observacoes}
                onChange={e => setForm({...form, observacoes: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={criarMdfe}>Criar MDF-e</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>MDF-e nº {selectedMdfe?.numero} - {selectedMdfe && situacaoLabel[selectedMdfe.situacao]}</DialogTitle>
          </DialogHeader>
          {selectedMdfe && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Chave:</strong> <span className="font-mono text-xs">{selectedMdfe.chaveAcesso}</span></div>
                <div><strong>Série:</strong> {selectedMdfe.serie}</div>
                <div><strong>UF Carregamento:</strong> {selectedMdfe.ufCarregamento}</div>
                <div><strong>UF Descarregamento:</strong> {selectedMdfe.ufDescarregamento || '-'}</div>
                <div><strong>Veículo:</strong> {selectedMdfe.veiculo?.placa || '-'}</div>
                <div><strong>Condutor:</strong> {selectedMdfe.condutor?.nome || '-'}</div>
                <div><strong>Valor Carga:</strong> R$ {selectedMdfe.valorTotalCarga.toFixed(2)}</div>
                <div><strong>Documentos:</strong> {selectedMdfe.qtdTotalDocumentos}</div>
                <div><strong>Emissão:</strong> {new Date(selectedMdfe.dataEmissao).toLocaleString('pt-BR')}</div>
                <div><strong>Autorização:</strong> {selectedMdfe.dataAutorizacao ? new Date(selectedMdfe.dataAutorizacao).toLocaleString('pt-BR') : '-'}</div>
              </div>

              {selectedMdfe.documentos.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Documentos Vinculados</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Chave</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Peso</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedMdfe.documentos.map(d => (
                        <TableRow key={d.id}>
                          <TableCell>{d.tipo}</TableCell>
                          <TableCell className="font-mono text-xs">{d.chaveAcesso}</TableCell>
                          <TableCell>R$ {d.valorDocumento.toFixed(2)}</TableCell>
                          <TableCell>{d.pesoTotal} kg</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {selectedMdfe.eventos.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Eventos</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Protocolo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedMdfe.eventos.map(e => (
                        <TableRow key={e.id}>
                          <TableCell>{e.tipo}</TableCell>
                          <TableCell>{e.descricao}</TableCell>
                          <TableCell className="text-xs">{new Date(e.dataEvento).toLocaleString('pt-BR')}</TableCell>
                          <TableCell className="font-mono text-xs">{e.protocolo || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {selectedMdfe.situacao === 'EM_DIGITACAO' && (
                  <Button onClick={() => actionMdfe(selectedMdfe.id, 'cancelar')} variant="destructive">
                    <XCircle className="mr-2 h-4 w-4" /> Cancelar
                  </Button>
                )}
                {selectedMdfe.situacao === 'AUTORIZADO' && (
                  <>
                    <Button onClick={() => actionMdfe(selectedMdfe.id, 'cancelar')} variant="destructive">
                      <XCircle className="mr-2 h-4 w-4" /> Cancelar
                    </Button>
                    <Button onClick={() => actionMdfe(selectedMdfe.id, 'encerrar')}>
                      <CheckCircle className="mr-2 h-4 w-4" /> Encerrar
                    </Button>
                  </>
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
