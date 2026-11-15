import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/AuthContext';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      signInWithOtp: vi.fn().mockResolvedValue({ error: null }),
      verifyOtp: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue({}),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

describe('AuthContext', () => {
  it('useAuth throws when used outside AuthProvider', () => {
    // Suppress React error boundary logs
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within AuthProvider'
    );
    spy.mockRestore();
  });

  it('loading becomes false when Supabase is not configured', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // In no-Supabase mode, loading resolves synchronously
    // We await a microtask flush
    await new Promise((r) => setTimeout(r, 0));
    expect(result.current.loading).toBe(false);
  });

  it('session is null when Supabase is not configured', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });
    await new Promise((r) => setTimeout(r, 0));
    expect(result.current.session).toBeNull();
  });

  it('user is null when Supabase is not configured', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });
    await new Promise((r) => setTimeout(r, 0));
    expect(result.current.user).toBeNull();
  });

  it('sendOtp returns error message when Supabase is not configured', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });
    await new Promise((r) => setTimeout(r, 0));

    const { error } = await result.current.sendOtp('+919876543210');
    expect(error).toContain('Supabase is not configured');
  });
});
