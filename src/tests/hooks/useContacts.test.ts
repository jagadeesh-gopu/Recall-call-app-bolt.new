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

import { useContacts } from '../../hooks/useContacts';
import { contacts as staticContacts } from '../../data';

describe('useContacts Hook', () => {
  it('returns static contacts when Supabase is not configured', async () => {
    const { result } = renderHook(() => useContacts());
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.contacts).toHaveLength(staticContacts.length);
    expect(result.current.loading).toBe(false);
  });

  it('createContact prepends a new contact memory locally', async () => {
    const { result } = renderHook(() => useContacts());
    await act(async () => {
      await Promise.resolve();
    });

    const initialLen = result.current.contacts.length;
    await act(async () => {
      await result.current.createContact({
        name: 'Anita Desai',
        phone: '+91 91234 56789',
        memorySummary: 'Architect colleague',
      });
    });

    expect(result.current.contacts.length).toBe(initialLen + 1);
    expect(result.current.contacts[0].name).toBe('Anita Desai');
    expect(result.current.contacts[0].initials).toBe('AD');
  });

  it('updateContact modifies an existing contact', async () => {
    const { result } = renderHook(() => useContacts());
    await act(async () => {
      await Promise.resolve();
    });

    const target = result.current.contacts[0];
    await act(async () => {
      await result.current.updateContact(target.id, {
        memorySummary: 'Updated memory summary test',
      });
    });

    const updated = result.current.contacts.find((c) => c.id === target.id);
    expect(updated?.memorySummary).toBe('Updated memory summary test');
  });

  it('deleteContact removes the contact from list', async () => {
    const { result } = renderHook(() => useContacts());
    await act(async () => {
      await Promise.resolve();
    });

    const initialLen = result.current.contacts.length;
    const targetId = result.current.contacts[0].id;

    await act(async () => {
      await result.current.deleteContact(targetId);
    });

    expect(result.current.contacts.length).toBe(initialLen - 1);
    expect(result.current.contacts.find((c) => c.id === targetId)).toBeUndefined();
  });
});
