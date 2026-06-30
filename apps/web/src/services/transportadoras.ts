import { api } from './api';

export const transportadorasService = {
  listar: (params?: any) => api.get('/transportadoras', { params }),
  criar: (data: any) => api.post('/transportadoras', data),
  buscar: (id: string) => api.get(`/transportadoras/${id}`),
  atualizar: (id: string, data: any) => api.put(`/transportadoras/${id}`, data),
  excluir: (id: string) => api.delete(`/transportadoras/${id}`),
};
