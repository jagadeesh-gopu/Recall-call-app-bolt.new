import { useState } from 'react';
import { Search, Plus, X, Phone, Mail, Clock, StickyNote, Bell, ChevronLeft, UserPlus, Sparkles, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react';
import { contacts, calls, notes, reminders } from '../data';
import { Avatar, EmptyState } from '../components/ui';
import type { Contact } from '../types';

export function ContactsScreen({ onOpenContact }: { onOpenContact: (c: Contact) => void }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unknown'>('all');

  const filtered = contacts.filter((c) => {
    if (filter === 'unknown' && c.name !== 'Unknown Number') return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.memorySummary.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950 pb-32 animate-fade-in">
      {/* Header */}
      <div className="gradient-splash px-5 pt-14 pb-5 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-navy-900 dark:text-white">Contact Memory</h1>
            <p className="text-xs text-navy-400 dark:text-navy-200 mt-0.5">{contacts.length} contacts with memories</p>
          </div>
          <button className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center shadow-float transition-transform hover:scale-105 active:scale-95">
            <Plus size={22} className="text-white" />
          </button>
        </div>

        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 dark:text-navy-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts or memories..."
            className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white/80 dark:bg-navy-800/50 backdrop-blur border border-white/60 dark:border-navy-700 text-sm text-navy-900 dark:text-white placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-400 transition-all"
          />
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all' ? 'gradient-primary text-white shadow-soft' : 'bg-white/60 dark:bg-navy-800/50 text-navy-400 dark:text-navy-300 border border-white/60 dark:border-navy-700'
            }`}
          >
            All Contacts
          </button>
          <button
            onClick={() => setFilter('unknown')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'unknown' ? 'gradient-primary text-white shadow-soft' : 'bg-white/60 dark:bg-navy-800/50 text-navy-400 dark:text-navy-300 border border-white/60 dark:border-navy-700'
            }`}
          >
            Unknown Numbers
          </button>
        </div>
      </div>

      {/* Contact list */}
      <div className="px-5 mt-5 space-y-2.5">
        {filtered.length === 0 && (
          <EmptyState icon={Search} title="No contacts found" subtitle="Try a different search or add a new contact memory." />
        )}
        {filtered.map((c, i) => (
          <button
            key={c.id}
            onClick={() => onOpenContact(c)}
            className="w-full glass-card rounded-2xl p-4 flex items-center gap-3 text-left transition-all hover:shadow-card active:scale-[0.98] animate-slide-up"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <Avatar initials={c.initials} color={c.avatarColor} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-navy-800 dark:text-navy-100 truncate">{c.name}</p>
              <p className="text-xs text-navy-400 dark:text-navy-400 truncate">{c.memorySummary}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-navy-300 dark:text-navy-500 flex items-center gap-1">
                  <Clock size={9} /> {c.lastInteraction}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex gap-2">
                <span className="text-[10px] text-navy-300 dark:text-navy-500 flex items-center gap-0.5">
                  <StickyNote size={9} /> {c.notes}
                </span>
                <span className="text-[10px] text-navy-300 dark:text-navy-500 flex items-center gap-0.5">
                  <Phone size={9} /> {c.calls}
                </span>
              </div>
            </div>
          </button>
        ))}

        {/* Add new memory card */}
        <button className="w-full rounded-2xl p-4 border-2 border-dashed border-navy-200 dark:border-navy-700 flex items-center gap-3 transition-all hover:border-lavender-400 hover:bg-lavender-50/50 dark:hover:bg-lavender-900/10">
          <div className="w-11 h-11 rounded-2xl bg-lavender-100 dark:bg-lavender-900/30 flex items-center justify-center">
            <UserPlus size={20} className="text-lavender-500" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-navy-700 dark:text-navy-200">Add Contact Memory</p>
            <p className="text-xs text-navy-400">Save details about a new contact</p>
          </div>
        </button>
      </div>
    </div>
  );
}

export function ContactDetailScreen({ contact, onBack }: { contact: Contact; onBack: () => void }) {
  const contactCalls = calls.filter((c) => c.contactName === contact.name).slice(0, 4);
  const contactNotes = notes.filter((n) => n.tags.some((t) => contact.name.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(contact.name.split(' ')[0].toLowerCase()))).slice(0, 2);
  const contactReminders = reminders.filter((r) => r.contactName === contact.name).slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 bg-navy-50 dark:bg-navy-950 overflow-y-auto animate-slide-in-right">
      {/* Header */}
      <div className="gradient-splash px-5 pt-14 pb-6 rounded-b-[2rem] relative">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl glass-card flex items-center justify-center mb-4 transition-transform hover:scale-105"
        >
          <ChevronLeft size={20} className="text-navy-600 dark:text-navy-200" />
        </button>

        <div className="flex flex-col items-center gap-3">
          <Avatar initials={contact.initials} color={contact.avatarColor} size="lg" />
          <div className="text-center">
            <h1 className="font-display text-xl font-bold text-navy-900 dark:text-white">{contact.name}</h1>
            <p className="text-xs text-navy-400 dark:text-navy-200 mt-0.5">{contact.phone}</p>
          </div>
        </div>
      </div>

      <div className="px-5 mt-5 space-y-5 pb-10">
        {/* Memory summary */}
        <div className="glass-card rounded-2xl p-4 animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-lavender-500" />
            <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm">Memory Summary</h3>
          </div>
          <p className="text-sm text-navy-600 dark:text-navy-200 leading-relaxed">{contact.memorySummary}</p>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-navy-100 dark:border-navy-700">
            <span className="text-[10px] text-navy-400 flex items-center gap-1"><Clock size={9} /> {contact.lastInteraction}</span>
            <span className="text-[10px] text-navy-300 dark:text-navy-500">·</span>
            <span className="text-[10px] text-navy-400">{contact.calls} calls · {contact.notes} notes</span>
          </div>
        </div>

        {/* Contact info */}
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm mb-1">Contact Information</h3>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center">
              <Phone size={16} className="text-navy-500 dark:text-navy-300" />
            </div>
            <span className="text-sm text-navy-700 dark:text-navy-100">{contact.phone}</span>
          </div>
          {contact.email && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center">
                <Mail size={16} className="text-navy-500 dark:text-navy-300" />
              </div>
              <span className="text-sm text-navy-700 dark:text-navy-100">{contact.email}</span>
            </div>
          )}
        </div>

        {/* Associated notes */}
        <div>
          <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm mb-2.5 px-1">Associated Notes</h3>
          <div className="space-y-2.5">
            {contactNotes.length > 0 ? contactNotes.map((n) => (
              <div key={n.id} className="glass-card rounded-2xl p-3.5">
                <p className="text-sm font-semibold text-navy-800 dark:text-navy-100">{n.title}</p>
                <p className="text-xs text-navy-400 mt-1 line-clamp-2">{n.content}</p>
                <span className="text-[10px] text-navy-300 dark:text-navy-500 mt-1.5 block">{n.date} · {n.category}</span>
              </div>
            )) : (
              <div className="glass-card rounded-2xl p-4 text-center">
                <p className="text-xs text-navy-400">No notes associated with this contact</p>
              </div>
            )}
          </div>
        </div>

        {/* Call history */}
        <div>
          <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm mb-2.5 px-1">Call History</h3>
          <div className="space-y-2.5">
            {contactCalls.length > 0 ? contactCalls.map((c) => (
              <div key={c.id} className="glass-card rounded-2xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center">
                  {c.type === 'incoming' && <PhoneIncoming size={16} className="text-emerald-500" />}
                  {c.type === 'outgoing' && <PhoneOutgoing size={16} className="text-sky-500" />}
                  {c.type === 'missed' && <PhoneMissed size={16} className="text-rose-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-navy-700 dark:text-navy-100">{c.date} · {c.time}</p>
                  <p className="text-[10px] text-navy-400">{c.type} · {c.duration}</p>
                </div>
              </div>
            )) : (
              <div className="glass-card rounded-2xl p-4 text-center">
                <p className="text-xs text-navy-400">No call history available</p>
              </div>
            )}
          </div>
        </div>

        {/* Reminders */}
        <div>
          <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm mb-2.5 px-1">Reminders</h3>
          <div className="space-y-2.5">
            {contactReminders.length > 0 ? contactReminders.map((r) => (
              <div key={r.id} className="glass-card rounded-2xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                  <Bell size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-navy-700 dark:text-navy-100">{r.title}</p>
                  <p className="text-[10px] text-navy-400">{r.date} · {r.time}</p>
                </div>
              </div>
            )) : (
              <div className="glass-card rounded-2xl p-4 text-center">
                <p className="text-xs text-navy-400">No reminders for this contact</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
