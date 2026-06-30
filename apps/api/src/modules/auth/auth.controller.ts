import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { loginSchema } from './dto/auth.dto';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
  nome: z.string().min(1),
  empresa: z.object({
    razaoSocial: z.string().min(1),
    cnpj: z.string().min(1),
  }),
});

export class AuthController {
  service: AuthService;
  
  constructor(service: AuthService) {
    this.service = service;
  }

  async register(req: Request, res: Response) {
    console.log('Register called, service:', this.service);
    try {
      const dados = registerSchema.parse(req.body);
      console.log('Parsed data:', dados);
      const resultado = await this.service.register(dados);
      return res.status(201).json(resultado);
    } catch (error) {
      console.error('Register error:', error);
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const dados = loginSchema.parse(req.body);
      const resultado = await this.service.login(dados);
      return res.json(resultado);
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message });
    }
  }
}
