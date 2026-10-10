import { Centavos } from '@/shared/types';

/**
 * Format integer centavos into a clean Philippine Peso string (e.g., ₱1,250.00).
 * Never uses floating point math for internal storage.
 */
export function formatPHP(centavos: Centavos | number, showSign: boolean = false): string {
  if (centavos === null || centavos === undefined || isNaN(centavos)) {
    return '₱0.00';
  }

  const isNegative = centavos < 0;
  const absCentavos = Math.abs(Math.round(centavos));
  
  const pesos = Math.floor(absCentavos / 100);
  const remainingCents = absCentavos % 100;
  
  const formattedPesos = pesos.toLocaleString('en-PH');
  const formattedCents = remainingCents.toString().padStart(2, '0');
  
  const signPrefix = isNegative ? '-₱' : (showSign && centavos > 0 ? '+₱' : '₱');
  return `${signPrefix}${formattedPesos}.${formattedCents}`;
}

/**
 * Safely parse a user-entered Peso string into integer centavos.
 * Avoids classic float issues like 19.99 * 100 = 1998.9999999999998
 */
export function parsePesosToCentavos(pesoString: string | number): Centavos {
  if (typeof pesoString === 'number') {
    return Math.round(pesoString * 100);
  }
  
  if (!pesoString || typeof pesoString !== 'string') {
    return 0;
  }
  
  // Clean out currency symbol, commas, and whitespace
  const clean = pesoString.replace(/[₱,\s]/g, '').trim();
  if (!clean) return 0;
  
  const parts = clean.split('.');
  const whole = parseInt(parts[0], 10) || 0;
  
  let cents = 0;
  if (parts.length > 1) {
    const rawCents = parts[1].padEnd(2, '0').slice(0, 2);
    cents = parseInt(rawCents, 10) || 0;
  }
  
  const total = (whole * 100) + cents;
  return isNaN(total) ? 0 : total;
}

/**
 * Convert centavos to standard number of Pesos (for charts or calculation inputs)
 */
export function centavosToPesos(centavos: Centavos): number {
  return Math.round(centavos) / 100;
}

/**
 * Calculate margin percentage between selling price and cost
 */
export function calculateMarginPercent(priceCentavos: Centavos, costCentavos: Centavos): number {
  if (priceCentavos <= 0) return 0;
  const profit = priceCentavos - costCentavos;
  return Math.round((profit / priceCentavos) * 100);
}

/**
 * Format percentage with sign
 */
export function formatPercent(value: number | null): string {
  if (value === null || isNaN(value)) return 'N/A';
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1)}%`;
}
