import { api } from './api';

export const usuariosService = {
  listar: (params?: any) => api.get('/usuarios', { params }),
  criar: (data: any) => api.post('/usuarios', data),
  buscar: (id: string) => api.get(`/usuarios/${id}`),
  atualizar: (id: string, data: any) => api.put(`/usuarios/${id}`, data),
  excluir: (id: string) => api.delete(`/usuarios/${id}`),
  perfis: () => api.get('/usuarios/perfis'),
};
