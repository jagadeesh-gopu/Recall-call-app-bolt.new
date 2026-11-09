import { Bell, Search, Phone, StickyNote, Users, Bell as BellIcon, ArrowRight, Sparkles, Mic, PhoneIncoming, PhoneMissed, Clock } from 'lucide-react';
import { Avatar, CallTypeIcon } from '../components/ui';
import { calls, notes, reminders, contacts } from '../data';
import type { Screen } from '../types';

const quickActions: { screen: Screen; label: string; icon: any; color: string }[] = [
  { screen: 'calls', label: 'Search Calls', icon: Phone, color: 'from-indigo-400 to-violet-400' },
  { screen: 'notes', label: 'Smart Notes', icon: StickyNote, color: 'from-pink-400 to-rose-400' },
  { screen: 'contacts', label: 'Contact Memory', icon: Users, color: 'from-emerald-400 to-teal-400' },
  { screen: 'reminders', label: 'Reminders', icon: BellIcon, color: 'from-amber-400 to-orange-400' },
];

export function HomeScreen({ onNavigate, onOpenAssistant }: { onNavigate: (s: Screen) => void; onOpenAssistant: () => void }) {
  const recentCalls = calls.slice(0, 3);
  const pinnedNotes = notes.filter((n) => n.pinned).slice(0, 2);
  const todayReminders = reminders.filter((r) => r.date === 'Today' && !r.completed);
  const recentContacts = contacts.slice(0, 4);

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950 pb-32 animate-fade-in">
      {/* Header */}
      <div className="gradient-splash px-5 pt-14 pb-6 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute top-10 right-5 w-32 h-32 rounded-full bg-lavender-300/20 blur-2xl" />
        <div className="flex items-center justify-between mb-5 relative">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-navy-400 to-violet-400 flex items-center justify-center text-white font-semibold shadow-soft">
              JD
            </div>
            <div>
              <p className="text-xs text-navy-400 dark:text-navy-200">Good evening</p>
              <p className="font-display font-bold text-navy-900 dark:text-white text-base">John Doe</p>
            </div>
          </div>
          <button className="relative w-11 h-11 rounded-2xl glass-card flex items-center justify-center transition-transform hover:scale-105">
            <Bell size={20} className="text-navy-600 dark:text-navy-200" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500" />
          </button>
        </div>

        {/* AI greeting */}
        <div className="glass-card rounded-2xl p-4 flex items-center gap-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <Sparkles size={18} className="text-white" />
          </div>
          <p className="text-sm font-medium text-navy-700 dark:text-navy-100">
            Hi! What would you like to remember today?
          </p>
        </div>
      </div>

      <div className="px-5 mt-5 space-y-6">
        {/* Search bar */}
        <button
          onClick={() => onNavigate('search')}
          className="w-full glass-card rounded-2xl h-13 py-3.5 px-4 flex items-center gap-3 transition-all hover:shadow-soft active:scale-[0.99]"
        >
          <Search size={20} className="text-navy-400 dark:text-navy-300" />
          <span className="text-sm text-navy-300 dark:text-navy-400">Search calls, notes, contacts...</span>
          <Mic size={18} className="ml-auto text-lavender-400" />
        </button>

        {/* Quick actions */}
        <div>
          <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm mb-3 px-1">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => onNavigate(action.screen)}
                  className="glass-card rounded-2xl p-4 flex flex-col items-start gap-3 transition-all hover:shadow-card active:scale-[0.97] animate-slide-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-soft`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <span className="text-sm font-semibold text-navy-700 dark:text-navy-100">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent call searches */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm">Recent Searches</h3>
            <button onClick={() => onNavigate('calls')} className="text-xs font-medium text-navy-400 hover:text-navy-600 dark:text-lavender-400 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2.5">
            {recentCalls.map((call) => (
              <button
                key={call.id}
                onClick={() => onNavigate('calls')}
                className="w-full glass-card rounded-2xl p-3.5 flex items-center gap-3 transition-all hover:shadow-card active:scale-[0.98] text-left"
              >
                <Avatar initials={call.contactName.split(' ').map(w => w[0]).join('').slice(0, 2)} color={call.avatarColor} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy-800 dark:text-navy-100 truncate">{call.contactName}</p>
                  <p className="text-xs text-navy-400 dark:text-navy-400">{call.phone}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <CallTypeIcon type={call.type} size={14} />
                  <span className="text-[10px] text-navy-300 dark:text-navy-500">{call.time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Smart Notes preview */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm">Smart Notes</h3>
            <button onClick={() => onNavigate('notes')} className="text-xs font-medium text-navy-400 hover:text-navy-600 dark:text-lavender-400 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-1">
            {pinnedNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => onNavigate('notes')}
                className="glass-card rounded-2xl p-4 min-w-[200px] text-left transition-all hover:shadow-card active:scale-[0.98]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${note.color}`} />
                  <span className="text-[10px] font-semibold text-navy-400">{note.category}</span>
                </div>
                <p className="text-sm font-semibold text-navy-800 dark:text-navy-100 mb-1 line-clamp-1">{note.title}</p>
                <p className="text-xs text-navy-400 dark:text-navy-400 line-clamp-2 leading-relaxed">{note.content}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming reminders */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm">Upcoming Reminders</h3>
            <button onClick={() => onNavigate('reminders')} className="text-xs font-medium text-navy-400 hover:text-navy-600 dark:text-lavender-400 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2.5">
            {todayReminders.map((r) => (
              <button
                key={r.id}
                onClick={() => onNavigate('reminders')}
                className="w-full glass-card rounded-2xl p-3.5 flex items-center gap-3 transition-all hover:shadow-card active:scale-[0.98] text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy-800 dark:text-navy-100 truncate">{r.title}</p>
                  <p className="text-xs text-navy-400 dark:text-navy-400">{r.date} · {r.time}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recently accessed contacts */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm">Recent Contacts</h3>
            <button onClick={() => onNavigate('contacts')} className="text-xs font-medium text-navy-400 hover:text-navy-600 dark:text-lavender-400 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-1">
            {recentContacts.map((c) => (
              <button
                key={c.id}
                onClick={() => onNavigate('contacts')}
                className="glass-card rounded-2xl p-3 min-w-[140px] flex flex-col items-center gap-2 text-center transition-all hover:shadow-card active:scale-[0.97]"
              >
                <Avatar initials={c.initials} color={c.avatarColor} size="md" />
                <div>
                  <p className="text-xs font-semibold text-navy-800 dark:text-navy-100 truncate w-full">{c.name.split(' ')[0]}</p>
                  <p className="text-[10px] text-navy-400 dark:text-navy-400 truncate w-full">{c.lastInteraction}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
