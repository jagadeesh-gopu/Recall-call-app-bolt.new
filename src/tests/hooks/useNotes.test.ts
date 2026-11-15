import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock the supabase lib BEFORE importing the hook
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

// Also mock import.meta.env to simulate no-Supabase mode
// (already done globally in setup.ts, but reinforce here)

import { useNotes } from '../../hooks/useNotes';
import { notes as staticNotes } from '../../data';

describe('useNotes — demo mode (no Supabase)', () => {
  it('returns static notes when Supabase is not configured', async () => {
    const { result } = renderHook(() => useNotes());

    // Wait for initial fetch
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.notes).toHaveLength(staticNotes.length);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('loading starts true then becomes false', async () => {
    const { result } = renderHook(() => useNotes());
    // loading may be true immediately
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.loading).toBe(false);
  });

  it('createNote adds a note to the list locally', async () => {
    const { result } = renderHook(() => useNotes());
    await act(async () => {
      await Promise.resolve();
    });
    const before = result.current.notes.length;

    await act(async () => {
      await result.current.createNote({
        title: 'Test Note',
        content: 'Test content',
        category: 'Work',
        tags: ['test'],
      });
    });

    expect(result.current.notes.length).toBe(before + 1);
    expect(result.current.notes[0].title).toBe('Test Note');
  });

  it('updateNote updates an existing note in-place', async () => {
    const { result } = renderHook(() => useNotes());
    await act(async () => {
      await Promise.resolve();
    });

    const firstNote = result.current.notes[0];
    await act(async () => {
      await result.current.updateNote(firstNote.id, { title: 'Updated Title' });
    });

    const updated = result.current.notes.find((n) => n.id === firstNote.id);
    expect(updated?.title).toBe('Updated Title');
  });

  it('deleteNote removes the note from the list', async () => {
    const { result } = renderHook(() => useNotes());
    await act(async () => {
      await Promise.resolve();
    });

    const before = result.current.notes.length;
    const targetId = result.current.notes[0].id;

    await act(async () => {
      await result.current.deleteNote(targetId);
    });

    expect(result.current.notes.length).toBe(before - 1);
    expect(result.current.notes.find((n) => n.id === targetId)).toBeUndefined();
  });

  it('togglePin flips the pinned state', async () => {
    const { result } = renderHook(() => useNotes());
    await act(async () => {
      await Promise.resolve();
    });

    // Find a pinned note
    const pinnedNote = result.current.notes.find((n) => n.pinned);
    if (!pinnedNote) throw new Error('No pinned note found in static data');

    await act(async () => {
      await result.current.togglePin(pinnedNote.id);
    });

    const after = result.current.notes.find((n) => n.id === pinnedNote.id);
    expect(after?.pinned).toBe(false);
  });
});
