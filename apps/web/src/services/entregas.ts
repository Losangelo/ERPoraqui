import { api } from "./api"

export const entregasService = {
  listar: (params?: any) => api.get("/entregas", { params }).then(r => r.data?.dados || r.data?.data || []),
  buscarPorId: (id: string) => api.get(`/entregas/${id}`).then(r => r.data),
  criar: (data: any) => api.post("/entregas", data).then(r => r.data),
  atualizar: (id: string, data: any) => api.put(`/entregas/${id}`, data).then(r => r.data),
  agendar: (id: string, data: any) => api.patch(`/entregas/${id}/agendar`, data).then(r => r.data),
  saiuParaEntrega: (id: string) => api.patch(`/entregas/${id}/saiu-para-entrega`).then(r => r.data),
  entregue: (id: string) => api.patch(`/entregas/${id}/entregue`).then(r => r.data),
  tentativaFalhou: (id: string, data: any) => api.patch(`/entregas/${id}/tentativa-falhou`, data).then(r => r.data),
  cancelar: (id: string) => api.patch(`/entregas/${id}/cancelar`).then(r => r.data),

  listarMotoristas: (params?: any) => api.get("/motoristas", { params }).then(r => r.data?.dados || r.data?.data || []),
  criarMotorista: (data: any) => api.post("/motoristas", data).then(r => r.data),
  atualizarMotorista: (id: string, data: any) => api.put(`/motoristas/${id}`, data).then(r => r.data),
  inativarMotorista: (id: string) => api.patch(`/motoristas/${id}/inativar`).then(r => r.data),
  ativarMotorista: (id: string) => api.patch(`/motoristas/${id}/ativar`).then(r => r.data),

  listarVeiculos: (params?: any) => api.get("/veiculos-entregas", { params }).then(r => r.data?.dados || r.data?.data || []),
  criarVeiculo: (data: any) => api.post("/veiculos-entregas", data).then(r => r.data),
  atualizarVeiculo: (id: string, data: any) => api.put(`/veiculos-entregas/${id}`, data).then(r => r.data),
  inativarVeiculo: (id: string) => api.patch(`/veiculos-entregas/${id}/inativar`).then(r => r.data),
  ativarVeiculo: (id: string) => api.patch(`/veiculos-entregas/${id}/ativar`).then(r => r.data),

  listarTaxas: (params?: any) => api.get("/taxas-entrega", { params }).then(r => r.data?.dados || r.data?.data || []),
  calcularTaxa: (data: { cep: string; clienteId?: string; pedidoValor?: number }) =>
    api.post("/taxas-entrega/calcular", data).then(r => r.data),
  criarTaxa: (data: any) => api.post("/taxas-entrega", data).then(r => r.data),
  atualizarTaxa: (id: string, data: any) => api.put(`/taxas-entrega/${id}`, data).then(r => r.data),
  inativarTaxa: (id: string) => api.patch(`/taxas-entrega/${id}/inativar`).then(r => r.data),
  ativarTaxa: (id: string) => api.patch(`/taxas-entrega/${id}/ativar`).then(r => r.data),
}

const BASE_PUBLIC = "/api/v1/public/entregas"

export const publicEntregasService = {
  rastreio: async (token: string) => {
    const r = await fetch(`${BASE_PUBLIC}/rastreio/${token}`)
    if (!r.ok) throw new Error("Entrega não encontrada")
    return r.json()
  },
  avaliar: {
    get: async (token: string) => {
      const r = await fetch(`${BASE_PUBLIC}/avaliar/${token}`)
      if (!r.ok) throw new Error("Avaliação não encontrada")
      return r.json()
    },
    post: async (token: string, data: any) => {
      const r = await fetch(`${BASE_PUBLIC}/avaliar/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!r.ok) {
        const err = await r.json().catch(() => ({ error: "Erro ao salvar avaliação" }))
        throw new Error(err.error || "Erro ao salvar avaliação")
      }
      return r.json()
    },
  },
}
