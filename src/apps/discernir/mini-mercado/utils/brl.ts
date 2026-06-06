// Formatacao de dinheiro em centavos (BRL). Dinheiro sempre em INTEGER de centavos.

export function formatBRL(cents: number): string {
  const v = (cents ?? 0) / 100;
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Aceita "12,50", "12.50", "1.234,56", "R$ 12,50" e devolve centavos.
export function parseBRLToCents(input: string | number): number {
  if (typeof input === 'number') return Math.round(input * 100);
  if (!input) return 0;
  let s = String(input).trim().replace(/[^\d.,]/g, '');
  if (s.includes(',')) {
    // virgula e o separador decimal; pontos sao milhar
    s = s.replace(/\./g, '').replace(',', '.');
  }
  const v = parseFloat(s);
  return isNaN(v) ? 0 : Math.round(v * 100);
}
