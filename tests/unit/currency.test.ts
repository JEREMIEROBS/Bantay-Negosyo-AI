import { describe, it, expect } from 'vitest';
import {
  formatPHP,
  parsePesosToCentavos,
  centavosToPesos,
  calculateMarginPercent,
  formatPercent,
} from '@/renderer/lib/currency';

describe('Philippine Peso Currency & Centavos Arithmetic', () => {
  it('formats integer centavos into clean Philippine Peso format with comma separation', () => {
    expect(formatPHP(0)).toBe('₱0.00');
    expect(formatPHP(50)).toBe('₱0.50');
    expect(formatPHP(100)).toBe('₱1.00');
    expect(formatPHP(1600)).toBe('₱16.00');
    expect(formatPHP(5200)).toBe('₱52.00');
    expect(formatPHP(125000)).toBe('₱1,250.00');
    expect(formatPHP(10000000)).toBe('₱100,000.00');
  });

  it('correctly handles negative centavos without float corruption', () => {
    expect(formatPHP(-25000)).toBe('-₱250.00');
    expect(formatPHP(-50)).toBe('-₱0.50');
  });

  it('optionally displays positive sign when requested', () => {
    expect(formatPHP(5000, true)).toBe('+₱50.00');
  });

  it('safely parses user-entered Peso strings into exact integer centavos', () => {
    expect(parsePesosToCentavos('16.00')).toBe(1600);
    expect(parsePesosToCentavos('16')).toBe(1600);
    expect(parsePesosToCentavos('1,250.50')).toBe(125050);
    expect(parsePesosToCentavos('₱52.00')).toBe(5200);
    expect(parsePesosToCentavos('0.75')).toBe(75);
    expect(parsePesosToCentavos('19.99')).toBe(1999);
  });

  it('converts centavos to pesos for charting', () => {
    expect(centavosToPesos(1600)).toBe(16);
    expect(centavosToPesos(125050)).toBe(1250.5);
  });

  it('computes gross profit margin percentage accurately', () => {
    // Selling price: ₱16.00 (1600 cents), Cost: ₱12.50 (1250 cents)
    // Profit: 350 cents. 350 / 1600 = 0.21875 -> 22%
    expect(calculateMarginPercent(1600, 1250)).toBe(22);

    // Selling price: ₱100 (10000 cents), Cost: ₱50 (5000 cents) -> 50%
    expect(calculateMarginPercent(10000, 5000)).toBe(50);

    // Zero price edge case
    expect(calculateMarginPercent(0, 500)).toBe(0);
  });

  it('formats percentage delta strings', () => {
    expect(formatPercent(12.5)).toBe('+12.5%');
    expect(formatPercent(-8.4)).toBe('-8.4%');
    expect(formatPercent(null)).toBe('N/A');
  });
});
