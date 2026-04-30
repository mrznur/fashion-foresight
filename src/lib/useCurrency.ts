import { useSettings } from './useSettings';

export function useCurrency() {
  const s = useSettings();
  const currency = s.default_currency || 'BDT';
  const threshold = Number(s.free_shipping_threshold) || 200;

  const format = (amount: number) =>
    `${amount.toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ${currency}`;

  return { currency, format, freeShippingThreshold: threshold };
}
