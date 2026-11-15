import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock import.meta.env — no Supabase credentials in test mode
Object.defineProperty(import.meta, 'env', {
  configurable: true,
  writable: true,
  value: {
    VITE_SUPABASE_URL: '',
    VITE_SUPABASE_ANON_KEY: '',
    MODE: 'test',
    DEV: false,
    PROD: false,
    SSR: false,
  },
});

// Silence console.warn/error unless running with VERBOSE_TESTS=1
if (!process.env.VERBOSE_TESTS) {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
}
