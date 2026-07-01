import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface ColunaExportacao {
  label: string
  accessor: string | ((row: Record<string, unknown>) => string | number)
}

function extrairValor(row: Record<string, unknown>, col: ColunaExportacao): string | number {
  if (typeof col.accessor === 'function') return col.accessor(row)
  const val = row[col.accessor]
  if (val === null || val === undefined) return ''
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

export function exportarCSV(dados: Record<string, unknown>[], colunas: ColunaExportacao[], nomeArquivo: string) {
  const linhas = dados.map(row => colunas.map(c => {
    const val = extrairValor(row, c)
    const str = String(val).replace(/"/g, '""')
    return `"${str}"`
  }))
  linhas.unshift(colunas.map(c => `"${c.label}"`))
  const conteudo = linhas.map(l => l.join(',')).join('\n')
  const bom = '\uFEFF'
  const blob = new Blob([bom + conteudo], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, `${nomeArquivo}.csv`)
}

export function exportarJSON(dados: Record<string, unknown>[], nomeArquivo: string) {
  const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' })
  downloadBlob(blob, `${nomeArquivo}.json`)
}

export function exportarXLSX(dados: Record<string, unknown>[], colunas: ColunaExportacao[], nomeArquivo: string) {
  const aoa = dados.map(row => colunas.map(c => extrairValor(row, c)))
  aoa.unshift(colunas.map(c => c.label))
  const ws = XLSX.utils.aoa_to_sheet(aoa)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Dados')
  XLSX.writeFile(wb, `${nomeArquivo}.xlsx`)
}

export async function exportarPDF(
  elementoId: string,
  nomeArquivo: string,
  titulo?: string,
) {
  const elemento = document.getElementById(elementoId)
  if (!elemento) return

  const canvas = await html2canvas(elemento, {
    scale: 2,
    useCORS: true,
    logging: false,
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const imgWidth = pageWidth - 20
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  let heightLeft = imgHeight
  let position = 10

  if (titulo) {
    pdf.setFontSize(16)
    pdf.text(titulo, 10, 10)
    position = 20
  }

  pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
  heightLeft -= pdf.internal.pageSize.getHeight() - position - 10

  while (heightLeft > 0) {
    position = 10
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', 10, position - (imgHeight - heightLeft), imgWidth, imgHeight)
    heightLeft -= pdf.internal.pageSize.getHeight() - 20
  }

  pdf.save(`${nomeArquivo}.pdf`)
}

function downloadBlob(blob: Blob, nome: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nome
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export type FormatoExportacao = 'csv' | 'json' | 'xlsx' | 'pdf'
