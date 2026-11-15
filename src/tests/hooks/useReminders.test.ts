import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

import { useReminders } from '../../hooks/useReminders';
import { reminders as staticReminders } from '../../data';

describe('useReminders — demo mode (no Supabase)', () => {
  it('returns static reminders when Supabase is not configured', async () => {
    const { result } = renderHook(() => useReminders());
    await act(async () => { await Promise.resolve(); });

    expect(result.current.reminders).toHaveLength(staticReminders.length);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('toggleComplete flips the completed state', async () => {
    const { result } = renderHook(() => useReminders());
    await act(async () => { await Promise.resolve(); });

    // r1 is not completed
    const r1 = result.current.reminders.find((r) => r.id === 'r1');
    expect(r1?.completed).toBe(false);

    await act(async () => {
      await result.current.toggleComplete('r1');
    });

    const r1After = result.current.reminders.find((r) => r.id === 'r1');
    expect(r1After?.completed).toBe(true);
  });

  it('toggleComplete twice returns to original state', async () => {
    const { result } = renderHook(() => useReminders());
    await act(async () => { await Promise.resolve(); });

    await act(async () => { await result.current.toggleComplete('r1'); });
    await act(async () => { await result.current.toggleComplete('r1'); });

    const r1 = result.current.reminders.find((r) => r.id === 'r1');
    expect(r1?.completed).toBe(false);
  });

  it('createReminder adds a reminder to the list', async () => {
    const { result } = renderHook(() => useReminders());
    await act(async () => { await Promise.resolve(); });

    const before = result.current.reminders.length;

    await act(async () => {
      await result.current.createReminder({
        title: 'New test reminder',
        category: 'Personal',
      });
    });

    expect(result.current.reminders.length).toBe(before + 1);
    const created = result.current.reminders.find((r) => r.title === 'New test reminder');
    expect(created).toBeDefined();
    expect(created?.completed).toBe(false);
  });

  it('deleteReminder removes the reminder from the list', async () => {
    const { result } = renderHook(() => useReminders());
    await act(async () => { await Promise.resolve(); });

    const before = result.current.reminders.length;

    await act(async () => {
      await result.current.deleteReminder('r1');
    });

    expect(result.current.reminders.length).toBe(before - 1);
    expect(result.current.reminders.find((r) => r.id === 'r1')).toBeUndefined();
  });

  it('toggleComplete returns error when reminder not found', async () => {
    const { result } = renderHook(() => useReminders());
    await act(async () => { await Promise.resolve(); });

    const { error } = await result.current.toggleComplete('nonexistent_id');
    expect(error).toBe('Reminder not found');
  });
});
