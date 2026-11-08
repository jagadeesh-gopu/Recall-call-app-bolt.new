import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Note, NoteCategory } from '../types';

interface DbNote {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  pinned: boolean;
  color: string | null;
  created_at: string;
  updated_at: string;
}

function dbToNote(db: DbNote): Note {
  return {
    id: db.id,
    title: db.title,
    content: db.content,
    category: db.category as NoteCategory,
    tags: db.tags ?? [],
    date: new Date(db.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    pinned: db.pinned,
    color: db.color ?? 'from-indigo-400 to-violet-400',
  };
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('notes')
      .select('*')
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (err) {
      setError(err.message);
      setNotes([]);
    } else {
      setNotes((data as DbNote[] ?? []).map(dbToNote));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = useCallback(async (note: Partial<Note>) => {
    const { data, error: err } = await supabase
      .from('notes')
      .insert({
        title: note.title ?? '',
        content: note.content ?? '',
        category: note.category ?? 'Personal',
        tags: note.tags ?? [],
        pinned: note.pinned ?? false,
        color: note.color ?? null,
      })
      .select()
      .single();

    if (err) {
      return { error: err.message, note: null };
    }
    const newNote = dbToNote(data as DbNote);
    setNotes((prev) => [newNote, ...prev]);
    return { error: null, note: newNote };
  }, []);

  const updateNote = useCallback(async (id: string, updates: Partial<Note>) => {
    const { data, error: err } = await supabase
      .from('notes')
      .update({
        title: updates.title,
        content: updates.content,
        category: updates.category,
        tags: updates.tags,
        pinned: updates.pinned,
        color: updates.color,
      })
      .eq('id', id)
      .select()
      .single();

    if (err) {
      return { error: err.message };
    }
    const updated = dbToNote(data as DbNote);
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    return { error: null };
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    const { error: err } = await supabase.from('notes').delete().eq('id', id);
    if (err) return { error: err.message };
    setNotes((prev) => prev.filter((n) => n.id !== id));
    return { error: null };
  }, []);

  const togglePin = useCallback(async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return { error: 'Note not found' };
    return updateNote(id, { ...note, pinned: !note.pinned });
  }, [notes, updateNote]);

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    refetch: fetchNotes,
  };
}
