import { Controller, Get, Post, Body, Param, Query, Req, Res } from '@nestjs/common';
import { SpedFiscalService } from './sped-fiscal.service';
import { gerarSpedFiscalSchema, gerarSpedContribuicoesSchema, spedFiscalFiltroSchema, GerarSpedFiscalInput, GerarSpedContribuicoesInput, SpedFiscalFiltro } from './dto/sped-fiscal.dto';

interface AuthRequest {
  usuario?: { empresaId: string };
}

@Controller('sped-fiscal')
export class SpedFiscalController {
  constructor(private readonly spedFiscalService: SpedFiscalService) {}

  @Post('gerar')
  async gerar(@Body() data: GerarSpedFiscalInput, @Req() req: AuthRequest) {
    const empresaId = req.usuario?.empresaId;
    return this.spedFiscalService.gerarSpedFiscal(data, empresaId);
  }

  @Get('listar')
  async listar(@Query() filtros: SpedFiscalFiltro, @Req() req: AuthRequest) {
    const empresaId = req.usuario?.empresaId;
    return this.spedFiscalService.listar(filtros, empresaId);
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: string, @Req() req: AuthRequest) {
    const empresaId = req.usuario?.empresaId;
    return this.spedFiscalService.buscarPorId(id, empresaId);
  }

  @Get(':id/download')
  async download(@Param('id') id: string, @Req() req: AuthRequest, @Res() res: any) {
    const empresaId = req.usuario?.empresaId;
    const arquivo = await this.spedFiscalService.download(id, empresaId);
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${arquivo.nome}"`);
    res.send(arquivo.arquivo);
  }

  @Post('contribuicoes/gerar')
  async gerarContribuicoes(@Body() data: GerarSpedContribuicoesInput, @Req() req: AuthRequest) {
    const empresaId = req.usuario?.empresaId;
    return this.spedFiscalService.gerarSpedContribuicoes(data, empresaId);
  }

  @Get('contribuicoes/listar')
  async listarContribuicoes(@Query() filtros: SpedFiscalFiltro, @Req() req: AuthRequest) {
    const empresaId = req.usuario?.empresaId;
    return this.spedFiscalService.listarContribuicoes(filtros, empresaId);
  }

  @Get('contribuicoes/:id/download')
  async downloadContribuicoes(@Param('id') id: string, @Req() req: AuthRequest, @Res() res: any) {
    const empresaId = req.usuario?.empresaId;
    const arquivo = await this.spedFiscalService.downloadContribuicoes(id, empresaId);
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${arquivo.nome}"`);
    res.send(arquivo.arquivo);
  }
}
