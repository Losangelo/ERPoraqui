export function generateBarCode(
  bancoCodigo: string,
  numeroBoleto: string,
  valor: number,
  dataVencimento: Date,
): string {
  const banco = bancoCodigo.padStart(3, '0');
  const valorFormatado = String(valor.toFixed(2)).replace('.', '').padStart(10, '0');
  
  const dataBase = new Date('1997-10-07');
  const dias = Math.floor((dataVencimento.getTime() - dataBase.getTime()) / (1000 * 60 * 60 * 24));
  const fatorVencimento = String(dias).padStart(4, '0');
  
  const campo1 = banco.substring(0, 3) + '9' + numeroBoleto.substring(0, 4) + fatorVencimento.substring(0, 1);
  const campo2 = numeroBoleto.substring(4, 10) + fatorVencimento.substring(1, 4);
  const campo3 = String(Math.floor(valor * 100)).padStart(10, '0');
  
  const campo4 = '1';
  const campo5 = fatorVencimento + String(Math.floor(valor * 100)).padStart(10, '0');

  const codigoBarras = banco + '9' + campo1.substring(3) + campo2 + campo3 + campo4 + campo5;
  
  return codigoBarras;
}

export function generateLinhaDigitavel(codigoBarras: string): string {
  if (codigoBarras.length !== 44) {
    throw new Error('Código de barras deve ter 44 dígitos');
  }

  const campo1 = codigoBarras.substring(0, 4) + codigoBarras.substring(19, 20);
  const campo2 = codigoBarras.substring(20, 24);
  const campo3 = codigoBarras.substring(24, 29);
  const campo4 = codigoBarras.substring(29, 31);
  const campo5 = codigoBarras.substring(31, 47);

  const dv1 = calculateDV(campo1);
  const dv2 = calculateDV(campo2);
  const dv3 = calculateDV(campo3);
  const dv4 = calculateDV(codigoBarras.substring(0, 4) + codigoBarras.substring(32, 47));

  const linha =
    campo1.substring(0, 5) + '.' + campo1.substring(5, 10) + dv1 + ' ' +
    campo2.substring(0, 5) + '.' + campo2.substring(5, 10) + dv2 + ' ' +
    campo3.substring(0, 5) + '.' + campo3.substring(5, 10) + dv3 + ' ' +
    dv4 + ' ' +
    campo5;

  return linha;
}

function calculateDV(campo: string): string {
  const multiplicadores = [2, 3, 4, 5, 6, 7, 8, 9];
  let soma = 0;
  let index = 0;

  for (let i = campo.length - 1; i >= 0; i--) {
    soma += parseInt(campo[i]) * multiplicadores[index % multiplicadores.length];
    index++;
  }

  const resto = soma % 11;
  const dv = 11 - resto;

  if (dv === 0 || dv === 10 || dv === 11) return '1';
  return String(dv);
}

export function formatCurrency(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

export function formatDate(data: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(data);
}
