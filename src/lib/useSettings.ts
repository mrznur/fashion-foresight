import { useState, useEffect } from 'react';
import { fetchSettings, type Settings } from './db';

const DEFAULT_SETTINGS: Settings = {
  store_name:              'Fashion Foresight',
  store_email:             'hello@fashionforesight.com',
  support_phone:           '+880 1XXX-XXXXXX',
  store_address:           'Dhaka, Bangladesh',
  free_shipping_threshold: '1000',
  default_currency:        'BDT',
  return_window:           '7',
  copyright_year:          String(new Date().getFullYear()),
  business_hours:          'Sat–Thu: 10:00 AM – 8:00 PM',
};

let cached: Settings | null = null;
let promise: Promise<Settings> | null = null;

function loadSettings(): Promise<Settings> {
  if (cached) return Promise.resolve(cached);
  if (promise) return promise;
  promise = fetchSettings().then((data) => {
    cached = { ...DEFAULT_SETTINGS, ...data };
    return cached;
  });
  return promise;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(cached ?? DEFAULT_SETTINGS);
  useEffect(() => { loadSettings().then(setSettings); }, []);
  return settings;
}
