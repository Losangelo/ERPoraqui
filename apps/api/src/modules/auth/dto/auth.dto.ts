import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const loginResponseSchema = z.object({
  usuario: z.object({
    id: z.string(),
    email: z.string(),
    nome: z.string(),
    perfil: z.enum(['ADMINISTRADOR', 'GERENTE', 'USUARIO', 'VISUALIZADOR']),
  }),
  empresa: z.object({
    id: z.string(),
    razaoSocial: z.string(),
    nomeFantasia: z.string().nullable(),
  }).nullable(),
  token: z.string(),
  refreshToken: z.string(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
