import { useState, useEffect } from 'react';
import { fetchSettings, type Settings } from './db';
import { setCurrency } from './currency';

const DEFAULT_SETTINGS: Settings = {
  store_name:              'Fashion Foresight',
  store_email:             'hello@fashionforesight.com',
  support_phone:           '+1 (555) 000-0000',
  store_address:           'Via Montenapoleone 12, Milan',
  free_shipping_threshold: '200',
  default_currency:        'BDT',
  return_window:           '30',
  copyright_year:          '2026',
  business_hours:          'Mon–Sat: 10:00–19:00 CET',
};

// Module-level cache so we only fetch once per session
let cached: Settings | null = null;
let promise: Promise<Settings> | null = null;

function loadSettings(): Promise<Settings> {
  if (cached) return Promise.resolve(cached);
  if (promise) return promise;
  promise = fetchSettings().then((data) => {
    cached = { ...DEFAULT_SETTINGS, ...data };
    if (cached.default_currency) setCurrency(cached.default_currency);
    return cached;
  });
  return promise;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(cached ?? DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  return settings;
}

// ─── Currency formatter ───────────────────────────────────────────────────────
// Reads currency from settings, defaults to BDT
export function formatPrice(amount: number, currency?: string): string {
  const cur = currency ?? 'BDT';
  return `${amount.toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ${cur}`;
}
