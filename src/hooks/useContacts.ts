import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Contact } from '../types';
import { contacts as staticContacts } from '../data';

const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface DbContact {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string | null;
  memory_summary: string | null;
  last_interaction: string | null;
  avatar_color: string | null;
  initials: string | null;
  created_at: string;
  updated_at: string;
}

function dbToContact(db: DbContact, notesCount = 0, callsCount = 0): Contact {
  const initials = db.initials || db.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  return {
    id: db.id,
    name: db.name,
    phone: db.phone,
    email: db.email ?? '',
    memorySummary: db.memory_summary ?? 'No memory summary yet',
    lastInteraction: db.last_interaction ?? 'Added recently',
    avatarColor: db.avatar_color ?? 'from-indigo-400 to-violet-400',
    initials,
    notes: notesCount,
    calls: callsCount,
  };
}

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      setContacts(staticContacts);
      setLoading(false);
      return;
    }

    const { data, error: err } = await supabase
      .from('contacts')
      .select('*')
      .order('name', { ascending: true });

    if (err) {
      console.warn('Supabase contacts fetch failed, using static data:', err.message);
      setContacts(staticContacts);
    } else if (data && data.length > 0) {
      setContacts((data as DbContact[]).map((c) => dbToContact(c)));
    } else {
      // Default to static contacts if user has no contacts yet
      setContacts(staticContacts);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const createContact = useCallback(
    async (contact: {
      name: string;
      phone: string;
      email?: string;
      memorySummary?: string;
      avatarColor?: string;
    }) => {
      const initials = contact.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
      const newContact: Contact = {
        id: `c_${Date.now()}`,
        name: contact.name,
        phone: contact.phone,
        email: contact.email ?? '',
        memorySummary: contact.memorySummary ?? 'Newly added contact',
        lastInteraction: 'Just now',
        avatarColor: contact.avatarColor ?? 'from-indigo-400 to-violet-400',
        initials,
        notes: 0,
        calls: 0,
      };

      if (!isSupabaseConfigured) {
        setContacts((prev) => [newContact, ...prev]);
        return { error: null, contact: newContact };
      }

      const { data, error: err } = await supabase
        .from('contacts')
        .insert({
          name: contact.name,
          phone: contact.phone,
          email: contact.email ?? null,
          memory_summary: contact.memorySummary ?? null,
          avatar_color: contact.avatarColor ?? 'from-indigo-400 to-violet-400',
          initials,
          last_interaction: 'Just now',
        })
        .select()
        .single();

      if (err) {
        // Fallback locally
        setContacts((prev) => [newContact, ...prev]);
        return { error: null, contact: newContact };
      }

      const created = dbToContact(data as DbContact);
      setContacts((prev) => [created, ...prev]);
      return { error: null, contact: created };
    },
    []
  );

  const updateContact = useCallback(
    async (id: string, updates: Partial<Contact>) => {
      if (!isSupabaseConfigured) {
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
        );
        return { error: null };
      }

      const { error: err } = await supabase
        .from('contacts')
        .update({
          name: updates.name,
          phone: updates.phone,
          email: updates.email,
          memory_summary: updates.memorySummary,
        })
        .eq('id', id);

      if (err) {
        console.warn('Update contact error:', err.message);
      }
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
      );
      return { error: null };
    },
    []
  );

  const deleteContact = useCallback(async (id: string) => {
    if (!isSupabaseConfigured) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
      return { error: null };
    }

    const { error: err } = await supabase.from('contacts').delete().eq('id', id);
    if (err) {
      console.warn('Delete contact error:', err.message);
    }
    setContacts((prev) => prev.filter((c) => c.id !== id));
    return { error: null };
  }, []);

  return {
    contacts,
    loading,
    error,
    createContact,
    updateContact,
    deleteContact,
    refetch: fetchContacts,
  };
}
