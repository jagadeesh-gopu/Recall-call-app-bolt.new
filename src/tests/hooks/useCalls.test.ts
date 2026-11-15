import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

import { useCalls } from '../../hooks/useCalls';
import { calls as staticCalls } from '../../data';

describe('useCalls Hook', () => {
  it('returns static calls when Supabase is not configured', async () => {
    const { result } = renderHook(() => useCalls());
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.calls).toHaveLength(staticCalls.length);
    expect(result.current.loading).toBe(false);
  });

  it('logCall adds a new call record locally', async () => {
    const { result } = renderHook(() => useCalls());
    await act(async () => {
      await Promise.resolve();
    });

    const initialLen = result.current.calls.length;
    await act(async () => {
      await result.current.logCall({
        contactName: 'Rohit Verma',
        phone: '+91 99999 88888',
        type: 'outgoing',
        duration: '04:12',
        notes: 'Discussed project launch',
      });
    });

    expect(result.current.calls.length).toBe(initialLen + 1);
    expect(result.current.calls[0].contactName).toBe('Rohit Verma');
    expect(result.current.calls[0].notes).toBe('Discussed project launch');
  });

  it('deleteCall removes call record from list', async () => {
    const { result } = renderHook(() => useCalls());
    await act(async () => {
      await Promise.resolve();
    });

    const initialLen = result.current.calls.length;
    const targetId = result.current.calls[0].id;

    await act(async () => {
      await result.current.deleteCall(targetId);
    });

    expect(result.current.calls.length).toBe(initialLen - 1);
    expect(result.current.calls.find((c) => c.id === targetId)).toBeUndefined();
  });
});
