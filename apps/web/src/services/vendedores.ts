import { api } from './api';

export const vendedoresService = {
  listar: (params?: any) => api.get('/vendedores', { params }),
  criar: (data: any) => api.post('/vendedores', data),
  buscar: (id: string) => api.get(`/vendedores/${id}`),
  atualizar: (id: string, data: any) => api.put(`/vendedores/${id}`, data),
  excluir: (id: string) => api.delete(`/vendedores/${id}`),
};
