import { useState } from 'react';
import { Plus, Mic, Bell, Clock, Check, Repeat, X, Calendar, User, Trash2 } from 'lucide-react';
import { categoryColors } from '../data';
import { useReminders } from '../hooks/useReminders';
import { useContacts } from '../hooks/useContacts';
import type { Reminder } from '../types';

export function RemindersScreen() {
  const { reminders: reminderList, loading, toggleComplete, createReminder, deleteReminder } = useReminders();
  const { contacts } = useContacts();

  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [listening, setListening] = useState(false);

  const today = reminderList.filter((r) => r.date === 'Today');
  const upcoming = reminderList.filter((r) => r.date !== 'Today' && !r.completed);
  const completed = reminderList.filter((r) => r.completed);

  const handleMicDictation = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setNewTitle('Call Mom tomorrow at 6 PM');
      setShowCreate(true);
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.lang = 'en-US';
      rec.onstart = () => setListening(true);
      rec.onresult = (e: any) => {
        const transcript = e.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setNewTitle(transcript);
          setShowCreate(true);
        }
      };
      rec.onend = () => setListening(false);
      rec.onerror = () => setListening(false);
      rec.start();
    } catch {
      setListening(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950 pb-32 animate-fade-in">
      {/* Header */}
      <div className="gradient-splash px-5 pt-14 pb-5 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-navy-900 dark:text-white pl-14">Reminders</h1>
            <p className="text-xs text-navy-400 dark:text-navy-200 mt-0.5">
              {loading
                ? 'Loading reminders...'
                : `${today.filter((r) => !r.completed).length} today · ${upcoming.length} upcoming`}
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center shadow-float transition-transform hover:scale-105 active:scale-95"
            aria-label="Add reminder"
          >
            <Plus size={22} className="text-white" />
          </button>
        </div>

        {/* Quick create with voice */}
        <button
          onClick={handleMicDictation}
          className={`w-full glass-card rounded-2xl h-13 py-3.5 px-4 flex items-center gap-3 transition-all hover:shadow-soft active:scale-[0.99] ${
            listening ? 'ring-2 ring-rose-500 bg-rose-50/20' : ''
          }`}
        >
          <Mic size={18} className={listening ? 'text-rose-500 animate-pulse' : 'text-lavender-400'} />
          <span className="text-sm text-navy-400 dark:text-navy-300">
            {listening ? 'Listening... say your reminder' : '"Call Rahul tomorrow at 5 PM"'}
          </span>
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
            {today.map((r) => (
              <ReminderCard
                key={r.id}
                reminder={r}
                onToggle={toggleComplete}
                onDelete={deleteReminder}
              />
            ))}
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
            {upcoming.map((r) => (
              <ReminderCard
                key={r.id}
                reminder={r}
                onToggle={toggleComplete}
                onDelete={deleteReminder}
              />
            ))}
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
            {completed.map((r) => (
              <ReminderCard
                key={r.id}
                reminder={r}
                onToggle={toggleComplete}
                onDelete={deleteReminder}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create reminder modal */}
      {showCreate && (
        <CreateReminderModal
          initialTitle={newTitle}
          contacts={contacts}
          onClose={() => {
            setShowCreate(false);
            setNewTitle('');
          }}
          onCreate={async (data) => {
            await createReminder(data);
            setNewTitle('');
            setShowCreate(false);
          }}
        />
      )}
    </div>
  );
}

function ReminderCard({
  reminder,
  onToggle,
  onDelete,
}: {
  reminder: Reminder;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className={`glass-card rounded-2xl p-4 flex items-center gap-3 transition-all ${
        reminder.completed ? 'opacity-60' : ''
      }`}
    >
      <button
        onClick={() => onToggle(reminder.id)}
        aria-label={reminder.completed ? 'Mark incomplete' : 'Mark complete'}
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
          reminder.completed
            ? 'gradient-primary border-transparent'
            : 'border-navy-200 dark:border-navy-600 hover:border-lavender-400'
        }`}
      >
        {reminder.completed && <Check size={14} className="text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold ${
            reminder.completed ? 'line-through text-navy-400' : 'text-navy-800 dark:text-navy-100'
          }`}
        >
          {reminder.title}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
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

      <div className="flex items-center gap-2 shrink-0">
        <div
          className={`w-2 h-2 rounded-full bg-gradient-to-br ${
            categoryColors[reminder.category] ?? 'from-navy-400 to-violet-400'
          }`}
        />
        <button
          onClick={() => onDelete(reminder.id)}
          className="text-navy-300 hover:text-rose-500 transition-colors"
          title="Delete reminder"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

function CreateReminderModal({
  initialTitle,
  contacts,
  onClose,
  onCreate,
}: {
  initialTitle: string;
  contacts: any[];
  onClose: () => void;
  onCreate: (data: {
    title: string;
    remindAt?: Date;
    category?: string;
    contactName?: string;
    recurring?: boolean;
  }) => Promise<any>;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [category, setCategory] = useState('Personal');
  const [recurring, setRecurring] = useState(false);
  const [contactName, setContactName] = useState('');
  const [timeStr, setTimeStr] = useState('05:00 PM');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    await onCreate({
      title: title.trim(),
      category,
      recurring,
      contactName: contactName || undefined,
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-sm flex items-end animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-md mx-auto bg-white dark:bg-navy-900 rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-navy-900 dark:text-white text-lg">New Reminder</h2>
          <button onClick={onClose} aria-label="Close modal" className="w-8 h-8 rounded-xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center">
            <X size={16} className="text-navy-600 dark:text-navy-200" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-navy-500 dark:text-navy-300 mb-1.5 block">
              What do you want to remember? *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Call Rahul tomorrow at 5 PM"
              className="w-full h-12 px-4 rounded-2xl bg-navy-50 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-700 text-sm text-navy-900 dark:text-white placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-400"
              required
            />
          </div>

          {/* Quick contact select */}
          {contacts.length > 0 && (
            <div>
              <label className="text-[11px] font-medium text-navy-400 block mb-1">Link to Contact (optional)</label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {contacts.slice(0, 5).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setContactName(contactName === c.name ? '' : c.name)}
                    className={`px-3 py-1 rounded-xl text-xs whitespace-nowrap transition-all border ${
                      contactName === c.name
                        ? 'border-lavender-500 bg-lavender-50 dark:bg-lavender-900/30 text-lavender-600 font-semibold'
                        : 'border-navy-100 dark:border-navy-700 bg-navy-50 dark:bg-navy-800 text-navy-600 dark:text-navy-300'
                    }`}
                  >
                    {c.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category */}
          <div>
            <label className="text-[11px] font-medium text-navy-400 block mb-1">Category</label>
            <div className="flex items-center gap-2 flex-wrap">
              {['Personal', 'Work', 'College', 'Important'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    category === cat
                      ? 'border-lavender-400 bg-lavender-100/50 dark:bg-lavender-900/30 text-navy-900 dark:text-white shadow-xs'
                      : 'border-navy-100 dark:border-navy-700 bg-navy-50 dark:bg-navy-800/50 text-navy-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Recurring switch */}
          <div className="flex items-center justify-between glass-card rounded-2xl p-3.5">
            <div className="flex items-center gap-2">
              <Repeat size={16} className="text-navy-500 dark:text-navy-300" />
              <span className="text-sm font-medium text-navy-700 dark:text-navy-100">Recurring Task</span>
            </div>
            <button
              type="button"
              onClick={() => setRecurring(!recurring)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                recurring ? 'gradient-primary' : 'bg-navy-200 dark:bg-navy-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                  recurring ? 'left-[22px]' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full h-13 py-3.5 rounded-2xl gradient-primary text-white font-semibold text-sm shadow-float flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
          >
            <Bell size={18} /> {saving ? 'Creating...' : 'Create Reminder'}
          </button>
        </form>
      </div>
    </div>
  );
}
