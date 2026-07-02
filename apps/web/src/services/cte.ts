import { api } from './api';

export interface Cte {
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
  tomador: { id: string; nome: string; documento: string } | null
  remetente: { id: string; nome: string; documento: string } | null
  destinatario: { id: string; nome: string; documento: string } | null
}

export interface CteListParams {
  pagina?: number
  limite?: number
  situacao?: string
  periodoIni?: string
  periodoFin?: string
}

export async function listarCtes(params?: CteListParams) {
  const res = await api.get('/cte', { params })
  return res.data as { success: boolean; data: Cte[]; total: number; pagina: number; totalPaginas: number }
}

export async function buscarCte(id: string) {
  const res = await api.get(`/cte/${id}`)
  return res.data as { success: boolean; data: Cte }
}

export async function criarCte(dados: Record<string, unknown>) {
  const res = await api.post('/cte', dados)
  return res.data as { success: boolean; data: Cte }
}

export async function atualizarCte(id: string, dados: Record<string, unknown>) {
  const res = await api.put(`/cte/${id}`, dados)
  return res.data as { success: boolean; data: Cte }
}

export async function excluirCte(id: string) {
  const res = await api.delete(`/cte/${id}`)
  return res.data as { success: boolean; data: { success: boolean } }
}

export async function cancelarCte(id: string) {
  const res = await api.post(`/cte/${id}/cancelar`)
  return res.data as { success: boolean; data: Cte }
}
