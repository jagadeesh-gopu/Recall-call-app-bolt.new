import { useState } from 'react';
import { Plus, Mic, Bell, Clock, Check, Repeat, ChevronLeft, X, Calendar, User } from 'lucide-react';
import { reminders, categoryColors } from '../data';
import { CategoryTag, EmptyState } from '../components/ui';
import type { Reminder } from '../types';

export function RemindersScreen() {
  const [reminderList, setReminderList] = useState<Reminder[]>(reminders);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const today = reminderList.filter((r) => r.date === 'Today');
  const upcoming = reminderList.filter((r) => r.date !== 'Today' && !r.completed);
  const completed = reminderList.filter((r) => r.completed);

  const toggleComplete = (id: string) => {
    setReminderList(reminderList.map((r) => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950 pb-32 animate-fade-in">
      {/* Header */}
      <div className="gradient-splash px-5 pt-14 pb-5 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-navy-900 dark:text-white pl-14">Reminders</h1>
            <p className="text-xs text-navy-400 dark:text-navy-200 mt-0.5">{today.filter(r => !r.completed).length} today · {upcoming.length} upcoming</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center shadow-float transition-transform hover:scale-105 active:scale-95"
          >
            <Plus size={22} className="text-white" />
          </button>
        </div>

        {/* Quick create */}
        <button
          onClick={() => setShowCreate(true)}
          className="w-full glass-card rounded-2xl h-13 py-3.5 px-4 flex items-center gap-3 transition-all hover:shadow-soft active:scale-[0.99]"
        >
          <Mic size={18} className="text-lavender-400" />
          <span className="text-sm text-navy-300 dark:text-navy-400">"Call Rahul tomorrow at 5 PM"</span>
        </button>
      </div>

      {/* Today's reminders */}
      <div className="px-5 mt-5">
        <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm mb-3 px-1">Today</h3>
        {today.length === 0 ? (
          <div className="glass-card rounded-2xl p-4 text-center">
            <p className="text-xs text-navy-400">No reminders for today</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {today.map((r) => <ReminderCard key={r.id} reminder={r} onToggle={toggleComplete} />)}
          </div>
        )}
      </div>

      {/* Upcoming */}
      <div className="px-5 mt-6">
        <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm mb-3 px-1">Upcoming</h3>
        {upcoming.length === 0 ? (
          <div className="glass-card rounded-2xl p-4 text-center">
            <p className="text-xs text-navy-400">No upcoming reminders</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {upcoming.map((r) => <ReminderCard key={r.id} reminder={r} onToggle={toggleComplete} />)}
          </div>
        )}
      </div>

      {/* Completed */}
      <div className="px-5 mt-6">
        <h3 className="font-display font-semibold text-navy-400 dark:text-navy-400 text-sm mb-3 px-1">Completed</h3>
        {completed.length === 0 ? (
          <div className="glass-card rounded-2xl p-4 text-center">
            <p className="text-xs text-navy-400">No completed reminders yet</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {completed.map((r) => <ReminderCard key={r.id} reminder={r} onToggle={toggleComplete} />)}
          </div>
        )}
      </div>

      {/* Create reminder modal */}
      {showCreate && (
        <CreateReminderModal
          value={newTitle}
          onChange={setNewTitle}
          onClose={() => setShowCreate(false)}
          onCreate={() => {
            if (!newTitle.trim()) return;
            setReminderList([...reminderList, {
              id: `r${Date.now()}`,
              title: newTitle,
              time: '12:00 PM',
              date: 'Tomorrow',
              completed: false,
              recurring: false,
              category: 'Personal',
            }]);
            setNewTitle('');
            setShowCreate(false);
          }}
        />
      )}
    </div>
  );
}

function ReminderCard({ reminder, onToggle }: { reminder: Reminder; onToggle: (id: string) => void }) {
  return (
    <div className={`glass-card rounded-2xl p-4 flex items-center gap-3 transition-all ${reminder.completed ? 'opacity-60' : ''}`}>
      <button
        onClick={() => onToggle(reminder.id)}
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
          reminder.completed
            ? 'gradient-primary border-transparent'
            : 'border-navy-200 dark:border-navy-600 hover:border-lavender-400'
        }`}
      >
        {reminder.completed && <Check size={14} className="text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${reminder.completed ? 'line-through text-navy-400' : 'text-navy-800 dark:text-navy-100'}`}>
          {reminder.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-navy-400 flex items-center gap-1">
            <Clock size={9} /> {reminder.date} · {reminder.time}
          </span>
          {reminder.recurring && (
            <span className="text-[10px] text-navy-400 flex items-center gap-0.5">
              <Repeat size={9} /> Recurring
            </span>
          )}
          {reminder.contactName && (
            <span className="text-[10px] text-navy-400 flex items-center gap-0.5">
              <User size={9} /> {reminder.contactName.split(' ')[0]}
            </span>
          )}
        </div>
      </div>

      <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${categoryColors[reminder.category] ?? 'from-navy-400 to-violet-400'}`} />
    </div>
  );
}

function CreateReminderModal({ value, onChange, onClose, onCreate }: {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  onCreate: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-sm flex items-end animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-md mx-auto bg-white dark:bg-navy-900 rounded-t-3xl p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-navy-900 dark:text-white text-lg">New Reminder</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center">
            <X size={16} className="text-navy-600 dark:text-navy-200" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-navy-500 dark:text-navy-300 mb-1.5 block">What do you want to remember?</label>
            <div className="relative">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Call Rahul tomorrow at 5 PM"
                className="w-full h-12 pl-4 pr-12 rounded-2xl bg-navy-50 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-700 text-sm text-navy-900 dark:text-white placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-400"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
                <Mic size={15} className="text-white" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="glass-card rounded-2xl p-3 flex items-center gap-2 text-left">
              <Calendar size={16} className="text-navy-500 dark:text-navy-300" />
              <div>
                <p className="text-[10px] text-navy-400">Date</p>
                <p className="text-xs font-semibold text-navy-700 dark:text-navy-100">Tomorrow</p>
              </div>
            </button>
            <button className="glass-card rounded-2xl p-3 flex items-center gap-2 text-left">
              <Clock size={16} className="text-navy-500 dark:text-navy-300" />
              <div>
                <p className="text-[10px] text-navy-400">Time</p>
                <p className="text-xs font-semibold text-navy-700 dark:text-navy-100">5:00 PM</p>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {['Personal', 'Work', 'College', 'Important'].map((cat) => (
              <button key={cat} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-navy-50 dark:bg-navy-800/50 text-navy-400 dark:text-navy-300 border border-navy-100 dark:border-navy-700">
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between glass-card rounded-2xl p-3.5">
            <div className="flex items-center gap-2">
              <Repeat size={16} className="text-navy-500 dark:text-navy-300" />
              <span className="text-sm font-medium text-navy-700 dark:text-navy-100">Recurring</span>
            </div>
            <div className="w-10 h-6 rounded-full bg-navy-200 dark:bg-navy-700 relative">
              <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 left-0.5 shadow" />
            </div>
          </div>

          <button
            onClick={onCreate}
            className="w-full h-13 py-3.5 rounded-2xl gradient-primary text-white font-semibold text-sm shadow-float flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Bell size={18} /> Create Reminder
          </button>
        </div>
      </div>
    </div>
  );
}
