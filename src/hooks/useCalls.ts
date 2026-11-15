import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { CallRecord, CallType } from '../types';
import { calls as staticCalls } from '../data';

const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface DbCall {
  id: string;
  user_id: string;
  contact_id: string | null;
  contact_name: string;
  phone: string;
  type: CallType;
  date: string;
  time: string;
  duration: string;
  avatar_color: string | null;
  notes: string | null;
  created_at: string;
}

function dbToCall(db: DbCall): CallRecord {
  return {
    id: db.id,
    contactName: db.contact_name,
    phone: db.phone,
    type: db.type,
    date: db.date,
    time: db.time,
    duration: db.duration,
    avatarColor: db.avatar_color ?? 'from-indigo-400 to-violet-400',
    notes: db.notes ?? undefined,
    contactId: db.contact_id ?? undefined,
  };
}

export function useCalls() {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalls = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      setCalls(staticCalls);
      setLoading(false);
      return;
    }

    const { data, error: err } = await supabase
      .from('calls')
      .select('*')
      .order('created_at', { ascending: false });

    if (err) {
      console.warn('Supabase calls fetch failed, using static data:', err.message);
      setCalls(staticCalls);
    } else if (data && data.length > 0) {
      setCalls((data as DbCall[]).map(dbToCall));
    } else {
      setCalls(staticCalls);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);

  const logCall = useCallback(
    async (callData: {
      contactName: string;
      phone: string;
      type: CallType;
      duration?: string;
      notes?: string;
      contactId?: string;
    }) => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
      const newCall: CallRecord = {
        id: `call_${Date.now()}`,
        contactName: callData.contactName,
        phone: callData.phone,
        type: callData.type,
        date: 'Today',
        time: timeStr,
        duration: callData.duration ?? (callData.type === 'missed' ? '00:00' : '02:30'),
        avatarColor: 'from-indigo-400 to-violet-400',
        notes: callData.notes,
        contactId: callData.contactId,
      };

      if (!isSupabaseConfigured) {
        setCalls((prev) => [newCall, ...prev]);
        return { error: null, call: newCall };
      }

      const { data, error: err } = await supabase
        .from('calls')
        .insert({
          contact_name: callData.contactName,
          phone: callData.phone,
          type: callData.type,
          date: 'Today',
          time: timeStr,
          duration: newCall.duration,
          notes: callData.notes ?? null,
          contact_id: callData.contactId ?? null,
        })
        .select()
        .single();

      if (err) {
        setCalls((prev) => [newCall, ...prev]);
        return { error: null, call: newCall };
      }

      const created = dbToCall(data as DbCall);
      setCalls((prev) => [created, ...prev]);
      return { error: null, call: created };
    },
    []
  );

  const deleteCall = useCallback(async (id: string) => {
    if (!isSupabaseConfigured) {
      setCalls((prev) => prev.filter((c) => c.id !== id));
      return { error: null };
    }

    const { error: err } = await supabase.from('calls').delete().eq('id', id);
    if (err) {
      console.warn('Delete call error:', err.message);
    }
    setCalls((prev) => prev.filter((c) => c.id !== id));
    return { error: null };
  }, []);

  return {
    calls,
    loading,
    error,
    logCall,
    deleteCall,
    refetch: fetchCalls,
  };
}
