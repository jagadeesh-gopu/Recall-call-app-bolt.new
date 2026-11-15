import { useState } from 'react';
import { Search, Mic, Phone, Users, StickyNote, Bell, Sparkles, ArrowRight, X, ChevronRight } from 'lucide-react';
import { useContacts } from '../hooks/useContacts';
import { useNotes } from '../hooks/useNotes';
import { useCalls } from '../hooks/useCalls';
import { useReminders } from '../hooks/useReminders';
import { EmptyState } from '../components/ui';
import type { Screen, Contact, Note } from '../types';

const recentSearches = ['Rahul', 'Prescription', 'Project', 'Mom'];

interface SearchScreenProps {
  onNavigate?: (s: Screen) => void;
  onOpenContact?: (c: Contact) => void;
  onOpenNote?: (n?: Note) => void;
}

export function SearchScreen({ onNavigate, onOpenContact, onOpenNote }: SearchScreenProps) {
  const { contacts } = useContacts();
  const { notes } = useNotes();
  const { calls } = useCalls();
  const { reminders } = useReminders();

  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'calls' | 'contacts' | 'notes' | 'reminders'>('all');

  const q = query.toLowerCase().trim();

  // Real data searches
  const matchedContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.memorySummary.toLowerCase().includes(q)
  );

  const matchedNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
  );

  const matchedCalls = calls.filter(
    (c) =>
      c.contactName.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.notes && c.notes.toLowerCase().includes(q))
  );

  const matchedReminders = reminders.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      (r.contactName && r.contactName.toLowerCase().includes(q))
  );

  const totalResults =
    matchedContacts.length + matchedNotes.length + matchedCalls.length + matchedReminders.length;

  const handleSearch = (val?: string) => {
    const target = val !== undefined ? val : query;
    setQuery(target);
    setSearched(Boolean(target.trim()));
  };

  const handleVoiceSearch = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      handleSearch('Rahul');
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.lang = 'en-US';
      rec.onresult = (e: any) => {
        const transcript = e.results?.[0]?.[0]?.transcript;
        if (transcript) handleSearch(transcript);
      };
      rec.start();
    } catch {
      // Ignore
    }
  };

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950 pb-32 animate-fade-in">
      {/* Header */}
      <div className="gradient-splash px-5 pt-14 pb-5 rounded-b-[2rem]">
        <h1 className="font-display text-2xl font-extrabold text-navy-900 dark:text-white mb-1 pl-14">
          Universal Search
        </h1>
        <p className="text-xs text-navy-400 dark:text-navy-200 mb-4">
          Instant search across calls, notes, contacts & reminders
        </p>

        <div className="glass-card rounded-2xl p-1.5 flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400 dark:text-navy-300" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search across all your records..."
              className="w-full h-11 pl-10 pr-8 rounded-xl bg-transparent text-sm text-navy-900 dark:text-white placeholder:text-navy-300 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setSearched(false);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={handleVoiceSearch}
            className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft transition-transform hover:scale-105 active:scale-95"
            aria-label="Voice search"
          >
            <Mic size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* When not searched */}
      {!searched && (
        <div className="px-5 mt-5">
          <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm mb-3 px-1">
            Recent Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((s) => (
              <button
                key={s}
                onClick={() => handleSearch(s)}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-navy-800/50 border border-navy-100 dark:border-navy-700 text-xs font-medium text-navy-500 dark:text-navy-300 transition-all hover:border-lavender-300"
              >
                {s}
              </button>
            ))}
          </div>

          <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm mb-3 mt-6 px-1">
            Browse by Section
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Calls', count: calls.length, icon: Phone, color: 'from-indigo-400 to-violet-400', screen: 'calls' as Screen },
              { label: 'Contacts', count: contacts.length, icon: Users, color: 'from-emerald-400 to-teal-400', screen: 'contacts' as Screen },
              { label: 'Notes', count: notes.length, icon: StickyNote, color: 'from-pink-400 to-rose-400', screen: 'notes' as Screen },
              { label: 'Reminders', count: reminders.length, icon: Bell, color: 'from-amber-400 to-orange-400', screen: 'reminders' as Screen },
            ].map((cat, i) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.label}
                  onClick={() => onNavigate?.(cat.screen)}
                  className="glass-card rounded-2xl p-4 flex flex-col items-start gap-2 transition-all hover:shadow-card active:scale-95 animate-slide-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-semibold text-navy-800 dark:text-navy-100 block">{cat.label}</span>
                    <span className="text-[10px] text-navy-400">{cat.count} records</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Searched results */}
      {searched && (
        <div className="px-5 mt-4 space-y-5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-lavender-400" />
              <span className="text-xs font-medium text-navy-600 dark:text-navy-300">
                {totalResults} results for "{query}"
              </span>
            </div>
          </div>

          {/* Category filter tabs */}
          <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1">
            {[
              { id: 'all', label: `All (${totalResults})` },
              { id: 'contacts', label: `Contacts (${matchedContacts.length})` },
              { id: 'notes', label: `Notes (${matchedNotes.length})` },
              { id: 'calls', label: `Calls (${matchedCalls.length})` },
              { id: 'reminders', label: `Reminders (${matchedReminders.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  activeCategory === tab.id
                    ? 'border-transparent gradient-primary text-white shadow-soft'
                    : 'border-navy-100 dark:border-navy-700 bg-white dark:bg-navy-800/50 text-navy-500 dark:text-navy-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {totalResults === 0 && (
            <EmptyState icon={Search} title="No matching records" subtitle="Try searching for a different keyword or name." />
          )}

          {/* Contacts Section */}
          {(activeCategory === 'all' || activeCategory === 'contacts') && matchedContacts.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-navy-700 dark:text-navy-200">Contacts</span>
                <span className="text-[10px] text-navy-400">{matchedContacts.length} found</span>
              </div>
              {matchedContacts.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onOpenContact?.(c)}
                  className="glass-card rounded-2xl p-3.5 flex items-center gap-3 cursor-pointer hover:shadow-card transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center font-bold text-white text-xs">
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy-900 dark:text-white truncate">{c.name}</p>
                    <p className="text-xs text-navy-400 truncate">{c.memorySummary}</p>
                  </div>
                  <ChevronRight size={16} className="text-navy-300" />
                </div>
              ))}
            </div>
          )}

          {/* Notes Section */}
          {(activeCategory === 'all' || activeCategory === 'notes') && matchedNotes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-navy-700 dark:text-navy-200">Smart Notes</span>
                <span className="text-[10px] text-navy-400">{matchedNotes.length} found</span>
              </div>
              {matchedNotes.map((n) => (
                <div
                  key={n.id}
                  onClick={() => onOpenNote?.(n)}
                  className="glass-card rounded-2xl p-3.5 cursor-pointer hover:shadow-card transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-navy-900 dark:text-white truncate">{n.title}</p>
                    <span className="text-[10px] text-lavender-500 font-medium px-2 py-0.5 rounded-full bg-lavender-50 dark:bg-lavender-900/30">
                      {n.category}
                    </span>
                  </div>
                  <p className="text-xs text-navy-400 line-clamp-2">{n.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Calls Section */}
          {(activeCategory === 'all' || activeCategory === 'calls') && matchedCalls.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-navy-700 dark:text-navy-200">Call History</span>
                <span className="text-[10px] text-navy-400">{matchedCalls.length} found</span>
              </div>
              {matchedCalls.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onNavigate?.('calls')}
                  className="glass-card rounded-2xl p-3.5 flex items-center gap-3 cursor-pointer hover:shadow-card transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center text-navy-500">
                    <Phone size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-navy-900 dark:text-white truncate">{c.contactName}</p>
                      <span className="text-[10px] capitalize text-navy-400">({c.type})</span>
                    </div>
                    <p className="text-xs text-navy-400">{c.date} · {c.time} ({c.duration})</p>
                  </div>
                  <a
                    href={`tel:${c.phone.replace(/\s+/g, '')}`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-2.5 py-1 rounded-lg gradient-primary text-white text-[11px] font-semibold shadow-xs"
                  >
                    Call
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Reminders Section */}
          {(activeCategory === 'all' || activeCategory === 'reminders') && matchedReminders.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-navy-700 dark:text-navy-200">Reminders</span>
                <span className="text-[10px] text-navy-400">{matchedReminders.length} found</span>
              </div>
              {matchedReminders.map((r) => (
                <div
                  key={r.id}
                  onClick={() => onNavigate?.('reminders')}
                  className="glass-card rounded-2xl p-3.5 flex items-center gap-3 cursor-pointer hover:shadow-card transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-500">
                    <Bell size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy-900 dark:text-white truncate">{r.title}</p>
                    <p className="text-xs text-navy-400">{r.date} · {r.time}</p>
                  </div>
                  <ChevronRight size={16} className="text-navy-300" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
