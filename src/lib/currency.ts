/**
 * Currency formatting utility.
 * Reads currency symbol from settings — defaults to BDT (৳).
 */

const CURRENCY_SYMBOLS: Record<string, string> = {
  BDT: '৳',
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
};

// Module-level cache — updated when settings load
let currentCurrency = 'BDT';

export function setCurrency(code: string) {
  currentCurrency = code;
}

export function getCurrencySymbol(): string {
  return CURRENCY_SYMBOLS[currentCurrency] ?? currentCurrency;
}

export function formatPrice(amount: number): string {
  const symbol = getCurrencySymbol();
  return `${symbol}${amount.toLocaleString()}`;
}
