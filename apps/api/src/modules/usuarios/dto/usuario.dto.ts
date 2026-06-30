import { z } from 'zod';

export const UsuarioSchema = z.object({
  email: z.string().email('Email inválido'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  perfil: z.enum(['ADMINISTRADOR', 'GERENTE', 'USUARIO', 'VISUALIZADOR']).optional(),
  ativo: z.boolean().optional(),
});

export const UsuarioUpdateSchema = z.object({
  email: z.string().email('Email inválido').optional(),
  nome: z.string().min(1, 'Nome é obrigatório').optional(),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
  perfil: z.enum(['ADMINISTRADOR', 'GERENTE', 'USUARIO', 'VISUALIZADOR']).optional(),
  ativo: z.boolean().optional(),
});

export const UsuarioFiltroSchema = z.object({
  nome: z.string().optional(),
  email: z.string().optional(),
  perfil: z.enum(['ADMINISTRADOR', 'GERENTE', 'USUARIO', 'VISUALIZADOR']).optional(),
  ativo: z.boolean().optional(),
  pagina: z.number().int().positive().default(1),
  limite: z.number().int().positive().max(100).default(20),
});

export type UsuarioInput = z.infer<typeof UsuarioSchema>;
export type UsuarioUpdateInput = z.infer<typeof UsuarioUpdateSchema>;
export type UsuarioFiltro = z.infer<typeof UsuarioFiltroSchema>;
