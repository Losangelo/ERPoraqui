import { Router, Request, Response } from 'express';
import { AuthService } from './auth.service';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, senha, nome, empresa } = req.body;
    
    if (!email || !senha || !nome || !empresa?.razaoSocial || !empresa?.cnpj) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const service = new AuthService();
    const resultado = await service.register({ email, senha, nome, empresa });
    return res.status(201).json(resultado);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const service = new AuthService();
    const resultado = await service.login({ email, senha });
    return res.json(resultado);
  } catch (error: any) {
    return res.status(401).json({ error: error.message });
  }
});

export default router;
