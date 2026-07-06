import { Request, Response } from 'express';
import { PublicEntregasService } from './public-entregas.service';
import { salvarAvaliacaoSchema } from './dto/public-entrega.dto';

export class PublicEntregasController {
  constructor(private service: PublicEntregasService) {}

  buscarRastreio = async (req: Request, res: Response) => {
    const { token } = req.params;

    try {
      const resultado = await this.service.buscarRastreio(token);

      if (!resultado) {
        return res.status(404).json({ error: 'Entrega não encontrada' });
      }

      return res.json(resultado);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

  buscarAvaliacao = async (req: Request, res: Response) => {
    const { token } = req.params;

    try {
      const resultado = await this.service.buscarAvaliacao(token);

      if (!resultado) {
        return res.status(404).json({ error: 'Avaliação não encontrada' });
      }

      return res.json(resultado);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

  salvarAvaliacao = async (req: Request, res: Response) => {
    const { token } = req.params;

    try {
      const dados = salvarAvaliacaoSchema.parse(req.body);
      const resultado = await this.service.salvarAvaliacao(token, dados);
      return res.json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || error.issues?.[0]?.message || 'Validation error' });
    }
  };
}
