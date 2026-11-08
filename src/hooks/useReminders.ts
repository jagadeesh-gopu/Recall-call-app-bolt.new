import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Reminder } from '../types';

interface DbReminder {
  id: string;
  user_id: string;
  title: string;
  remind_at: string | null;
  completed: boolean;
  recurring: boolean;
  recurrence_pattern: string | null;
  category: string;
  contact_name: string | null;
  created_at: string;
  updated_at: string;
}

function dbToReminder(db: DbReminder): Reminder {
  let dateStr = 'Today';
  let timeStr = '12:00 PM';

  if (db.remind_at) {
    const d = new Date(db.remind_at);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diffDays = Math.round((target.getTime() - today.getTime()) / 86400000);

    if (diffDays === 0) dateStr = 'Today';
    else if (diffDays === 1) dateStr = 'Tomorrow';
    else dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  return {
    id: db.id,
    title: db.title,
    time: timeStr,
    date: dateStr,
    completed: db.completed,
    recurring: db.recurring,
    contactName: db.contact_name ?? undefined,
    category: db.category,
  };
}

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReminders = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('reminders')
      .select('*')
      .order('completed', { ascending: true })
      .order('remind_at', { ascending: true, nullsFirst: false });

    if (err) {
      setError(err.message);
      setReminders([]);
    } else {
      setReminders((data as DbReminder[] ?? []).map(dbToReminder));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const createReminder = useCallback(async (reminder: {
    title: string;
    remindAt?: Date;
    category?: string;
    contactName?: string;
    recurring?: boolean;
  }) => {
    const { data, error: err } = await supabase
      .from('reminders')
      .insert({
        title: reminder.title,
        remind_at: reminder.remindAt?.toISOString() ?? null,
        category: reminder.category ?? 'Personal',
        contact_name: reminder.contactName ?? null,
        recurring: reminder.recurring ?? false,
      })
      .select()
      .single();

    if (err) {
      return { error: err.message, reminder: null };
    }
    const newReminder = dbToReminder(data as DbReminder);
    setReminders((prev) => [...prev, newReminder]);
    return { error: null, reminder: newReminder };
  }, []);

  const toggleComplete = useCallback(async (id: string) => {
    const reminder = reminders.find((r) => r.id === id);
    if (!reminder) return { error: 'Reminder not found' };

    const { error: err } = await supabase
      .from('reminders')
      .update({ completed: !reminder.completed })
      .eq('id', id);

    if (err) return { error: err.message };
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
    return { error: null };
  }, [reminders]);

  const deleteReminder = useCallback(async (id: string) => {
    const { error: err } = await supabase.from('reminders').delete().eq('id', id);
    if (err) return { error: err.message };
    setReminders((prev) => prev.filter((r) => r.id !== id));
    return { error: null };
  }, []);

  return {
    reminders,
    loading,
    error,
    createReminder,
    toggleComplete,
    deleteReminder,
    refetch: fetchReminders,
  };
}
