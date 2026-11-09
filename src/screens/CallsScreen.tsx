import { useState } from 'react';
import { Search, Mic, Sparkles, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, Calendar } from 'lucide-react';
import { Avatar, CallTypeIcon, CallTypeBadge, DurationDisplay, EmptyState, SkeletonCard } from '../components/ui';
import { calls } from '../data';
import type { CallType } from '../types';

type FilterLabel = 'All' | 'Incoming' | 'Outgoing' | 'Missed';
const filters: FilterLabel[] = ['All', 'Incoming', 'Outgoing', 'Missed'];
const examples = ['Who called yesterday?', 'Find missed calls last Friday', 'Show calls from January'];

export function CallsScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterLabel>('All');
  const [loading, setLoading] = useState(false);

  const filtered = calls.filter((c) => {
    if (filter !== 'All' && c.type !== filter.toLowerCase()) return false;
    if (search && !c.contactName.toLowerCase().includes(search.toLowerCase()) && !c.phone.includes(search)) return false;
    return true;
  });

  const handleSearch = () => {
    if (!search) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950 pb-32 animate-fade-in">
      {/* Header */}
      <div className="gradient-splash px-5 pt-14 pb-5 rounded-b-[2rem]">
        <h1 className="font-display text-2xl font-extrabold text-navy-900 dark:text-white mb-1 pl-14">Call History</h1>
        <p className="text-xs text-navy-400 dark:text-navy-200 mb-4">Search your calls with natural language</p>

        {/* AI search bar */}
        <div className="glass-card rounded-2xl p-1.5 flex items-center gap-2">
          <div className="relative flex-1">
            <Sparkles size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lavender-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ask in natural language..."
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-transparent text-sm text-navy-900 dark:text-white placeholder:text-navy-300 focus:outline-none"
            />
          </div>
          <button
            onClick={handleSearch}
            className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft transition-transform hover:scale-105 active:scale-95"
          >
            <Mic size={18} className="text-white" />
          </button>
        </div>

        {/* Example queries */}
        <div className="flex gap-2 mt-3 overflow-x-auto -mx-5 px-5">
          {examples.map((ex) => (
            <button
              key={ex}
              onClick={() => { setSearch(ex); setLoading(true); setTimeout(() => setLoading(false), 1200); }}
              className="px-3 py-1.5 rounded-xl bg-white/60 dark:bg-navy-800/50 border border-white/60 dark:border-navy-700 text-[11px] font-medium text-navy-500 dark:text-navy-300 whitespace-nowrap transition-all hover:bg-white"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="px-5 mt-4">
        <div className="flex gap-2 overflow-x-auto -mx-5 px-5">
          {filters.map((f) => {
            const count = f === 'All' ? calls.length : calls.filter(c => c.type === f.toLowerCase()).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  filter === f
                    ? 'gradient-primary text-white shadow-soft'
                    : 'bg-white dark:bg-navy-800/50 text-navy-400 dark:text-navy-300 border border-navy-100 dark:border-navy-700'
                }`}
              >
                {f === 'Incoming' && <PhoneIncoming size={12} />}
                {f === 'Outgoing' && <PhoneOutgoing size={12} />}
                {f === 'Missed' && <PhoneMissed size={12} />}
                {f === 'All' && <Clock size={12} />}
                {f} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="px-5 mt-4 space-y-2.5">
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!loading && filtered.length === 0 && (
          <EmptyState icon={Search} title="No calls found" subtitle="Try a different search query or filter." />
        )}

        {!loading && filtered.length > 0 && (
          <>
            <div className="flex items-center gap-2 px-1">
              <Calendar size={12} className="text-navy-400" />
              <span className="text-xs font-medium text-navy-400 dark:text-navy-300">{filtered.length} results found</span>
            </div>
            {filtered.map((call, i) => {
              const initials = call.contactName.split(' ').map(w => w[0]).join('').slice(0, 2);
              return (
                <div
                  key={call.id}
                  className="glass-card rounded-2xl p-3.5 flex items-center gap-3 transition-all hover:shadow-card animate-slide-up"
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  <Avatar initials={initials} color={call.avatarColor} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-navy-800 dark:text-navy-100 truncate">{call.contactName}</p>
                      <CallTypeBadge type={call.type} />
                    </div>
                    <p className="text-xs text-navy-400 dark:text-navy-400">{call.phone}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-navy-300 dark:text-navy-500">{call.date} · {call.time}</span>
                      <DurationDisplay duration={call.duration} />
                    </div>
                  </div>
                  <CallTypeIcon type={call.type} size={20} />
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
