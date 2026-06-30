import { z } from 'zod';

export const tributosItemSchema = z.object({
  icmsCst: z.string().default('00'),
  icmsAliquota: z.number().min(0).default(0),
  icmsReducaoBase: z.number().min(0).max(100).default(0),
  icmsModalidade: z.enum(['MARGEM_VALOR_AGREGADO', 'VALOR_PAUTA', 'PRECO_TABELADO', 'VALOR_OPERACAO']).default('VALOR_OPERACAO'),
  icmsSTMargem: z.number().min(0).default(0),
  icmsSTReducao: z.number().min(0).max(100).default(0),
  icmsSTAliquota: z.number().min(0).default(0),

  ipiCst: z.string().default('50'),
  ipiAliquota: z.number().min(0).default(0),
  ipiTributado: z.boolean().default(true),

  pisCst: z.string().default('01'),
  pisAliquota: z.number().min(0).default(0),
  cofinsCst: z.string().default('01'),
  cofinsAliquota: z.number().min(0).default(0),

  cbsAliquota: z.number().min(0).default(0),
  ibsAliquota: z.number().min(0).default(0),
  isAliquota: z.number().min(0).default(0),

  valorUnitario: z.number().min(0),
  quantidade: z.number().min(0),
  valorFrete: z.number().min(0).default(0),
  valorSeguro: z.number().min(0).default(0),
  valorDespesas: z.number().min(0).default(0),
  valorDesconto: z.number().min(0).default(0),
});

export type TributosItem = z.infer<typeof tributosItemSchema>;

export interface TributosResult {
  valorProduto: number;
  valorTotalLiquido: number;
  icmsBaseCalculo: number;
  icmsValor: number;
  icmsSTBaseCalculo: number;
  icmsSTValor: number;
  icmsReducaoBase: number;
  ipiValor: number;
  pisBaseCalculo: number;
  pisValor: number;
  cofinsBaseCalculo: number;
  cofinsValor: number;
  cbsBaseCalculo: number;
  cbsValor: number;
  ibsBaseCalculo: number;
  ibsValor: number;
  isValor: number;
  valorTotalTributos: number;
}

export interface PartilhaICMSResult {
  icmsInterestadual: number;
  icmsUFOrigem: number;
  icmsUFDestino: number;
}

export interface ICMSSTParams {
  valorProduto: number;
  valorFrete: number;
  valorSeguro: number;
  valorDespesas: number;
  valorDesconto: number;
  margemST: number;
  aliquotaST: number;
  aliquotaInterna: number;
  reducaoST: number;
}

export interface ICMSSTResult {
  baseCalculoST: number;
  valorST: number;
  valorICMS: number;
}

const ALIQUOTAS_INTERESTADUAIS: Record<string, Record<string, number>> = {
  'SP': { 'default': 12 },
  'RJ': { 'default': 12 },
  'MG': { 'default': 12 },
  'RS': { 'default': 12 },
  'PR': { 'default': 12 },
  'SC': { 'default': 12 },
  'BA': { 'default': 12 },
  'PE': { 'default': 12 },
  'CE': { 'default': 12 },
  'GO': { 'default': 12 },
  'PA': { 'default': 12 },
  'AM': { 'default': 12 },
  'ES': { 'default': 7 },
  'PB': { 'default': 12 },
  'RN': { 'default': 12 },
  'AL': { 'default': 12 },
  'PI': { 'default': 12 },
  'MA': { 'default': 12 },
  'MT': { 'default': 12 },
  'MS': { 'default': 12 },
  'DF': { 'default': 12 },
};

const REGIOES_SUL_SUDESTE = ['SP', 'RJ', 'MG', 'ES', 'RS', 'PR', 'SC'];

export function tributosItem(params: TributosItem): TributosResult {
  const parsed = tributosItemSchema.parse(params);

  const valorProduto = parsed.valorUnitario * parsed.quantidade;
  const valorTotalLiquido = valorProduto + parsed.valorFrete + parsed.valorSeguro + parsed.valorDespesas - parsed.valorDesconto;

  const reducao = parsed.icmsReducaoBase / 100;
  const icmsBaseCalculo = valorTotalLiquido * (1 - reducao);
  const icmsValor = icmsBaseCalculo * (parsed.icmsAliquota / 100);

  const stReducao = parsed.icmsSTReducao / 100;
  const icmsSTBaseCalculo = valorTotalLiquido * (1 + parsed.icmsSTMargem / 100) * (1 - stReducao);
  const icmsSTValor = icmsSTBaseCalculo * (parsed.icmsSTAliquota / 100);

  let ipiValor = 0;
  if (parsed.ipiTributado) {
    ipiValor = valorTotalLiquido * (parsed.ipiAliquota / 100);
  }

  const pisBaseCalculo = valorTotalLiquido;
  const pisValor = pisBaseCalculo * (parsed.pisAliquota / 100);

  const cofinsBaseCalculo = valorTotalLiquido;
  const cofinsValor = cofinsBaseCalculo * (parsed.cofinsAliquota / 100);

  const cbsBaseCalculo = valorTotalLiquido;
  const cbsValor = cbsBaseCalculo * (parsed.cbsAliquota / 100);

  const ibsBaseCalculo = valorTotalLiquido;
  const ibsValor = ibsBaseCalculo * (parsed.ibsAliquota / 100);

  const isValor = valorTotalLiquido * (parsed.isAliquota / 100);

  const valorTotalTributos = icmsValor + icmsSTValor + ipiValor + pisValor + cofinsValor + cbsValor + ibsValor + isValor;

  return {
    valorProduto,
    valorTotalLiquido,
    icmsBaseCalculo: Math.round(icmsBaseCalculo * 100) / 100,
    icmsValor: Math.round(icmsValor * 100) / 100,
    icmsSTBaseCalculo: Math.round(icmsSTBaseCalculo * 100) / 100,
    icmsSTValor: Math.round(icmsSTValor * 100) / 100,
    icmsReducaoBase: parsed.icmsReducaoBase,
    ipiValor: Math.round(ipiValor * 100) / 100,
    pisBaseCalculo: Math.round(pisBaseCalculo * 100) / 100,
    pisValor: Math.round(pisValor * 100) / 100,
    cofinsBaseCalculo: Math.round(cofinsBaseCalculo * 100) / 100,
    cofinsValor: Math.round(cofinsValor * 100) / 100,
    cbsBaseCalculo: Math.round(cbsBaseCalculo * 100) / 100,
    cbsValor: Math.round(cbsValor * 100) / 100,
    ibsBaseCalculo: Math.round(ibsBaseCalculo * 100) / 100,
    ibsValor: Math.round(ibsValor * 100) / 100,
    isValor: Math.round(isValor * 100) / 100,
    valorTotalTributos: Math.round(valorTotalTributos * 100) / 100,
  };
}

export function partilhaICMS(
  valorICMS: number,
  ufOrigem: string,
  ufDestino: string,
  valorTotal: number
): PartilhaICMSResult {
  const aliquotaInterestadual = ALIQUOTAS_INTERESTADUAIS[ufOrigem]?.default ?? 12;
  const isMesmaRegiao = REGIOES_SUL_SUDESTE.includes(ufOrigem) === REGIOES_SUL_SUDESTE.includes(ufDestino);

  let aliquotaInterna: number;
  if (ufOrigem === ufDestino) {
    aliquotaInterna = 18;
  } else if (isMesmaRegiao) {
    aliquotaInterna = 12;
  } else {
    aliquotaInterna = 7;
  }

  const icmsInterestadual = valorTotal * (aliquotaInterestadual / 100);
  const difal = (aliquotaInterna - aliquotaInterestadual) * valorTotal / 100;

  if (ufOrigem === ufDestino) {
    return {
      icmsInterestadual: 0,
      icmsUFOrigem: valorICMS,
      icmsUFDestino: 0,
    };
  }

  const fcp = 0;
  const icmsUFOrigem = valorICMS - (difal * 0.6);
  const icmsUFDestino = difal * 0.4 + fcp;

  return {
    icmsInterestadual: Math.round(icmsInterestadual * 100) / 100,
    icmsUFOrigem: Math.round(icmsUFOrigem * 100) / 100,
    icmsUFDestino: Math.round(icmsUFDestino * 100) / 100,
  };
}

export function icmsST(params: ICMSSTParams): ICMSSTResult {
  const valorTotal = params.valorProduto + params.valorFrete + params.valorSeguro + params.valorDespesas - params.valorDesconto;
  const reducao = params.reducaoST / 100;
  const baseCalculoST = valorTotal * (1 + params.margemST / 100) * (1 - reducao);
  const valorICMS = valorTotal * (params.aliquotaInterna / 100);
  const valorST = baseCalculoST * (params.aliquotaST / 100) - valorICMS;

  return {
    baseCalculoST: Math.round(baseCalculoST * 100) / 100,
    valorST: Math.max(0, Math.round(valorST * 100) / 100),
    valorICMS: Math.round(valorICMS * 100) / 100,
  };
}
