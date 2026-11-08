import { useState } from 'react';
import { Search, Mic, Phone, Users, StickyNote, Bell, Sparkles, ArrowRight, X } from 'lucide-react';
import { searchResults } from '../data';

const categories = [
  { key: 'calls', label: 'Calls', icon: Phone, color: 'from-indigo-400 to-violet-400', results: searchResults.calls },
  { key: 'contacts', label: 'Contacts', icon: Users, color: 'from-emerald-400 to-teal-400', results: searchResults.contacts },
  { key: 'notes', label: 'Notes', icon: StickyNote, color: 'from-pink-400 to-rose-400', results: searchResults.notes },
  { key: 'reminders', label: 'Reminders', icon: Bell, color: 'from-amber-400 to-orange-400', results: searchResults.reminders },
  { key: 'memories', label: 'Memories', icon: Sparkles, color: 'from-violet-400 to-purple-400', results: searchResults.memories },
];

const recentSearches = ['Rahul', 'Dr. Mehta prescription', 'Project deadline', 'Mom birthday'];

export function SearchScreen() {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (q?: string) => {
    const val = q ?? query;
    setQuery(val);
    setSearched(!!val);
  };

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950 pb-32 animate-fade-in">
      {/* Header */}
      <div className="gradient-splash px-5 pt-14 pb-5 rounded-b-[2rem]">
        <h1 className="font-display text-2xl font-extrabold text-navy-900 dark:text-white mb-1">Universal Search</h1>
        <p className="text-xs text-navy-400 dark:text-navy-200 mb-4">Search across everything in your memory</p>

        <div className="glass-card rounded-2xl p-1.5 flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400 dark:text-navy-300" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Find everything related to..."
              className="w-full h-11 pl-10 pr-8 rounded-xl bg-transparent text-sm text-navy-900 dark:text-white placeholder:text-navy-300 focus:outline-none"
            />
            {query && (
              <button onClick={() => { setQuery(''); setSearched(false); }} className="absolute right-2 top-1/2 -translate-y-1/2">
                <X size={16} className="text-navy-300" />
              </button>
            )}
          </div>
          <button
            onClick={() => handleSearch()}
            className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft transition-transform hover:scale-105"
          >
            <Mic size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Recent searches (when not searched) */}
      {!searched && (
        <div className="px-5 mt-5">
          <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm mb-3 px-1">Recent Searches</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((s) => (
              <button
                key={s}
                onClick={() => handleSearch(s)}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-navy-800/50 border border-navy-100 dark:border-navy-700 text-xs font-medium text-navy-500 dark:text-navy-300 transition-all hover:bg-lavender-50 dark:hover:bg-lavender-900/10 hover:border-lavender-300"
              >
                {s}
              </button>
            ))}
          </div>

          <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm mb-3 mt-6 px-1">Search Categories</h3>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => handleSearch(cat.key === 'calls' ? 'Rahul' : 'project')}
                  className="glass-card rounded-2xl p-4 flex flex-col items-start gap-2 transition-all hover:shadow-card active:scale-95 animate-slide-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <span className="text-sm font-semibold text-navy-700 dark:text-navy-100">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Search results grouped */}
      {searched && (
        <div className="px-5 mt-5 space-y-6">
          <div className="flex items-center gap-2 px-1">
            <Sparkles size={14} className="text-lavender-400" />
            <span className="text-xs font-medium text-navy-500 dark:text-navy-300">
              Results for "{query}"
            </span>
          </div>

          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.key} className="animate-slide-up">
                <div className="flex items-center justify-between mb-2.5 px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                      <Icon size={14} className="text-white" />
                    </div>
                    <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm">{cat.label}</h3>
                    <span className="text-[10px] text-navy-300 dark:text-navy-500">({cat.results.length})</span>
                  </div>
                  <button className="text-xs font-medium text-navy-400 hover:text-navy-600 dark:text-lavender-400 flex items-center gap-0.5">
                    View all <ArrowRight size={11} />
                  </button>
                </div>
                <div className="space-y-2">
                  {cat.results.map((r) => (
                    <div key={r.id} className="glass-card rounded-2xl p-3.5 flex items-center gap-3 transition-all hover:shadow-card">
                      <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${cat.color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-navy-800 dark:text-navy-100 truncate">{r.title}</p>
                        <p className="text-xs text-navy-400 dark:text-navy-400 truncate">{r.subtitle}</p>
                      </div>
                      <span className="text-[10px] text-navy-300 dark:text-navy-500 shrink-0">{r.meta}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
