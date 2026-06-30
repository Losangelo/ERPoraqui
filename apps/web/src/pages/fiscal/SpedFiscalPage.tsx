import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/services/api';
import { 
  FileText, 
  Download,
  CheckCircle,
  Clock
} from 'lucide-react';

export function SpedFiscalPage() {
  const [ano, setAno] = useState(new Date().getFullYear().toString());
  const [mes, setMes] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [gerando, setGerando] = useState(false);

  const gerarSped = async () => {
    setGerando(true);
    try {
      const response = await api.post('/sped-fiscal/gerar', {
        ano: parseInt(ano),
        mes: parseInt(mes),
      }, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SPED_FISCAL_${ano}${mes}.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      alert('SPED Fiscal gerado com sucesso!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao gerar SPED');
    } finally {
      setGerando(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            SPED Fiscal
          </h1>
          <p className="text-muted-foreground">Gere arquivos do SPED Fiscal</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gerar SPED Fiscal</CardTitle>
            <CardDescription>
              Selecione o período para gerar o arquivo do SPED Fiscal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Ano</Label>
                  <Select value={ano} onValueChange={setAno}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2024, 2025, 2026].map((a) => (
                        <SelectItem key={a} value={a.toString()}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Mês</Label>
                  <Select value={mes} onValueChange={setMes}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <SelectItem key={m} value={m.toString().padStart(2, '0')}>
                          {m.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={gerarSped} disabled={gerando} className="w-full">
                {gerando ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Gerar SPED
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium">O que é o SPED Fiscal?</div>
                <div className="text-sm text-muted-foreground">
                  Sistema Público de Escrituração Digital - arquivo digital contendo informações fiscais
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium">Obligatoriedade</div>
                <div className="text-sm text-muted-foreground">
                  Obrigatório para empresas Lucro Presumido, Lucro Real e Simples Nacional (acima de limites)
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium">Período</div>
                <div className="text-sm text-muted-foreground">
                  Gere mensalmente até o dia 25 do mês subsequente
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
          <CardDescription>Últimos SPEDs gerados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Nenhum SPED gerado recentemente.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
