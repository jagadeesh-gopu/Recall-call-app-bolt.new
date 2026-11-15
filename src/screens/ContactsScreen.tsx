import { useState } from 'react';
import {
  Search, Plus, X, Phone, Mail, Clock, StickyNote, Bell, ChevronLeft,
  UserPlus, Sparkles, PhoneIncoming, PhoneOutgoing, PhoneMissed, Edit3, Trash2, Check, ExternalLink
} from 'lucide-react';
import { useContacts } from '../hooks/useContacts';
import { useNotes } from '../hooks/useNotes';
import { useReminders } from '../hooks/useReminders';
import { useCalls } from '../hooks/useCalls';
import { Avatar, EmptyState } from '../components/ui';
import type { Contact } from '../types';

const avatarColors = [
  'from-indigo-400 to-violet-400',
  'from-pink-400 to-rose-400',
  'from-emerald-400 to-teal-400',
  'from-amber-400 to-orange-400',
  'from-cyan-400 to-blue-400',
  'from-violet-400 to-purple-400',
];

export function ContactsScreen({ onOpenContact }: { onOpenContact: (c: Contact) => void }) {
  const { contacts, loading, createContact } = useContacts();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unknown'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = contacts.filter((c) => {
    if (filter === 'unknown' && c.name !== 'Unknown Number') return false;
    if (
      search &&
      !c.name.toLowerCase().includes(search.toLowerCase()) &&
      !c.memorySummary.toLowerCase().includes(search.toLowerCase()) &&
      !c.phone.includes(search)
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950 pb-32 animate-fade-in">
      {/* Header */}
      <div className="gradient-splash px-5 pt-14 pb-5 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-navy-900 dark:text-white pl-14">Contact Memory</h1>
            <p className="text-xs text-navy-400 dark:text-navy-200 mt-0.5">
              {loading ? 'Loading contacts...' : `${contacts.length} contacts with memories`}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center shadow-float transition-transform hover:scale-105 active:scale-95"
            aria-label="Add new contact"
          >
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
              filter === 'all'
                ? 'gradient-primary text-white shadow-soft'
                : 'bg-white/60 dark:bg-navy-800/50 text-navy-400 dark:text-navy-300 border border-white/60 dark:border-navy-700'
            }`}
          >
            All Contacts ({contacts.length})
          </button>
          <button
            onClick={() => setFilter('unknown')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'unknown'
                ? 'gradient-primary text-white shadow-soft'
                : 'bg-white/60 dark:bg-navy-800/50 text-navy-400 dark:text-navy-300 border border-white/60 dark:border-navy-700'
            }`}
          >
            Unknown Numbers ({contacts.filter((c) => c.name === 'Unknown Number').length})
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
            style={{ animationDelay: `${i * 0.03}s` }}
          >
            <Avatar initials={c.initials} color={c.avatarColor} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-navy-800 dark:text-navy-100 truncate">{c.name}</p>
              <p className="text-xs text-navy-400 dark:text-navy-400 truncate">{c.memorySummary}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-navy-300 dark:text-navy-500 flex items-center gap-1">
                  <Clock size={9} /> {c.lastInteraction}
                </span>
                <span className="text-[10px] text-navy-300 dark:text-navy-500">·</span>
                <span className="text-[10px] text-navy-400">{c.phone}</span>
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
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full rounded-2xl p-4 border-2 border-dashed border-navy-200 dark:border-navy-700 flex items-center gap-3 transition-all hover:border-lavender-400 hover:bg-lavender-50/50 dark:hover:bg-lavender-900/10 active:scale-[0.99]"
        >
          <div className="w-11 h-11 rounded-2xl bg-lavender-100 dark:bg-lavender-900/30 flex items-center justify-center">
            <UserPlus size={20} className="text-lavender-500" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-navy-700 dark:text-navy-200">Add Contact Memory</p>
            <p className="text-xs text-navy-400">Save details & context about a contact</p>
          </div>
        </button>
      </div>

      {showAddModal && (
        <ContactFormModal
          onClose={() => setShowAddModal(false)}
          onSave={async (data) => {
            await createContact(data);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

export function ContactDetailScreen({
  contact,
  onBack,
  onOpenNoteEditor,
}: {
  contact: Contact;
  onBack: () => void;
  onOpenNoteEditor?: (contactName: string) => void;
}) {
  const { updateContact, deleteContact } = useContacts();
  const { notes } = useNotes();
  const { reminders } = useReminders();
  const { calls, logCall } = useCalls();

  const [currentContact, setCurrentContact] = useState<Contact>(contact);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const contactCalls = calls.filter(
    (c) => c.contactName.toLowerCase() === currentContact.name.toLowerCase() || c.phone === currentContact.phone
  );
  const contactNotes = notes.filter(
    (n) =>
      n.contactId === currentContact.id ||
      n.tags.some((t) => currentContact.name.toLowerCase().includes(t.toLowerCase())) ||
      n.title.toLowerCase().includes(currentContact.name.split(' ')[0].toLowerCase())
  );
  const contactReminders = reminders.filter(
    (r) => r.contactName?.toLowerCase() === currentContact.name.toLowerCase()
  );

  const handleDeviceCall = () => {
    // Log an outgoing call record
    logCall({
      contactName: currentContact.name,
      phone: currentContact.phone,
      type: 'outgoing',
      duration: '01:45',
      contactId: currentContact.id,
    });
    // Trigger real tel: URI supported by mobile/desktop devices
    window.location.href = `tel:${currentContact.phone.replace(/\s+/g, '')}`;
  };

  const handleDelete = async () => {
    await deleteContact(currentContact.id);
    onBack();
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-50 dark:bg-navy-950 overflow-y-auto animate-slide-in-right">
      {/* Header */}
      <div className="gradient-splash px-5 pt-14 pb-6 rounded-b-[2rem] relative">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl glass-card flex items-center justify-center transition-transform hover:scale-105"
            aria-label="Back"
          >
            <ChevronLeft size={20} className="text-navy-600 dark:text-navy-200" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="w-9 h-9 rounded-xl glass-card flex items-center justify-center transition-transform hover:scale-105 text-navy-600 dark:text-navy-200"
              aria-label="Edit contact"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-9 h-9 rounded-xl glass-card flex items-center justify-center transition-transform hover:scale-105 text-rose-500"
              aria-label="Delete contact"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Avatar initials={currentContact.initials} color={currentContact.avatarColor} size="lg" />
          <div className="text-center">
            <h1 className="font-display text-xl font-bold text-navy-900 dark:text-white">{currentContact.name}</h1>
            <p className="text-xs text-navy-400 dark:text-navy-200 mt-0.5">{currentContact.phone}</p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={handleDeviceCall}
              className="px-4 py-2 rounded-xl gradient-primary text-white text-xs font-semibold flex items-center gap-1.5 shadow-soft hover:shadow-glow-lg transition-transform active:scale-95"
            >
              <Phone size={14} /> Call Now
            </button>
            {currentContact.email && (
              <a
                href={`mailto:${currentContact.email}`}
                className="px-3.5 py-2 rounded-xl glass-card text-navy-700 dark:text-navy-200 text-xs font-semibold flex items-center gap-1.5 hover:bg-white"
              >
                <Mail size={14} /> Email
              </a>
            )}
            <a
              href={`sms:${currentContact.phone.replace(/\s+/g, '')}`}
              className="px-3.5 py-2 rounded-xl glass-card text-navy-700 dark:text-navy-200 text-xs font-semibold flex items-center gap-1.5 hover:bg-white"
            >
              <ExternalLink size={14} /> SMS
            </a>
          </div>
        </div>
      </div>

      <div className="px-5 mt-5 space-y-5 pb-12">
        {/* Memory summary */}
        <div className="glass-card rounded-2xl p-4 animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-lavender-500" />
            <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm">Memory Summary</h3>
          </div>
          <p className="text-sm text-navy-600 dark:text-navy-200 leading-relaxed">{currentContact.memorySummary}</p>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-navy-100 dark:border-navy-700">
            <span className="text-[10px] text-navy-400 flex items-center gap-1"><Clock size={9} /> {currentContact.lastInteraction}</span>
            <span className="text-[10px] text-navy-300 dark:text-navy-500">·</span>
            <span className="text-[10px] text-navy-400">{contactCalls.length} calls · {contactNotes.length} notes</span>
          </div>
        </div>

        {/* Contact info */}
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm mb-1">Contact Details</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center">
                <Phone size={16} className="text-navy-500 dark:text-navy-300" />
              </div>
              <span className="text-sm text-navy-700 dark:text-navy-100">{currentContact.phone}</span>
            </div>
            <button
              onClick={handleDeviceCall}
              className="text-xs font-semibold gradient-text"
            >
              Dial
            </button>
          </div>
          {currentContact.email && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center">
                <Mail size={16} className="text-navy-500 dark:text-navy-300" />
              </div>
              <span className="text-sm text-navy-700 dark:text-navy-100">{currentContact.email}</span>
            </div>
          )}
        </div>

        {/* Associated notes */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm">Associated Notes ({contactNotes.length})</h3>
            {onOpenNoteEditor && (
              <button
                onClick={() => onOpenNoteEditor(currentContact.name)}
                className="text-xs font-semibold gradient-text flex items-center gap-1"
              >
                <Plus size={12} /> Add Note
              </button>
            )}
          </div>
          <div className="space-y-2.5">
            {contactNotes.length > 0 ? (
              contactNotes.map((n) => (
                <div key={n.id} className="glass-card rounded-2xl p-3.5">
                  <p className="text-sm font-semibold text-navy-800 dark:text-navy-100">{n.title}</p>
                  <p className="text-xs text-navy-400 mt-1 line-clamp-2">{n.content}</p>
                  <span className="text-[10px] text-navy-300 dark:text-navy-500 mt-1.5 block">{n.date} · {n.category}</span>
                </div>
              ))
            ) : (
              <div className="glass-card rounded-2xl p-4 text-center">
                <p className="text-xs text-navy-400">No notes linked to {currentContact.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Call history */}
        <div>
          <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm mb-2.5 px-1">
            Call History ({contactCalls.length})
          </h3>
          <div className="space-y-2.5">
            {contactCalls.length > 0 ? (
              contactCalls.map((c) => (
                <div key={c.id} className="glass-card rounded-2xl p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center">
                    {c.type === 'incoming' && <PhoneIncoming size={16} className="text-emerald-500" />}
                    {c.type === 'outgoing' && <PhoneOutgoing size={16} className="text-sky-500" />}
                    {c.type === 'missed' && <PhoneMissed size={16} className="text-rose-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-navy-700 dark:text-navy-100">{c.date} · {c.time}</p>
                    <p className="text-[10px] text-navy-400 capitalize">{c.type} · {c.duration}</p>
                  </div>
                  <button
                    onClick={handleDeviceCall}
                    className="text-[11px] font-semibold text-navy-500 hover:text-lavender-500"
                  >
                    Call
                  </button>
                </div>
              ))
            ) : (
              <div className="glass-card rounded-2xl p-4 text-center">
                <p className="text-xs text-navy-400">No call history with this contact</p>
              </div>
            )}
          </div>
        </div>

        {/* Reminders */}
        <div>
          <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm mb-2.5 px-1">
            Reminders ({contactReminders.length})
          </h3>
          <div className="space-y-2.5">
            {contactReminders.length > 0 ? (
              contactReminders.map((r) => (
                <div key={r.id} className="glass-card rounded-2xl p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                    <Bell size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-navy-700 dark:text-navy-100">{r.title}</p>
                    <p className="text-[10px] text-navy-400">{r.date} · {r.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-card rounded-2xl p-4 text-center">
                <p className="text-xs text-navy-400">No reminders for this contact</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <ContactFormModal
          initial={currentContact}
          onClose={() => setShowEditModal(false)}
          onSave={async (updated) => {
            await updateContact(currentContact.id, updated);
            setCurrentContact((prev) => ({ ...prev, ...updated }));
            setShowEditModal(false);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-card bg-white dark:bg-navy-900 rounded-3xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mx-auto text-rose-500">
              <Trash2 size={24} />
            </div>
            <h3 className="font-display font-bold text-navy-900 dark:text-white text-base">Delete Contact?</h3>
            <p className="text-xs text-navy-400">
              Are you sure you want to remove <span className="font-semibold text-navy-700 dark:text-navy-200">{currentContact.name}</span> and its memory summary?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 h-11 rounded-xl bg-navy-100 dark:bg-navy-800 text-xs font-semibold text-navy-700 dark:text-navy-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 h-11 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 shadow-soft"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ContactFormModal({
  initial,
  onClose,
  onSave,
}: {
  initial?: Contact;
  onClose: () => void;
  onSave: (data: { name: string; phone: string; email?: string; memorySummary?: string; avatarColor?: string }) => Promise<void>;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [memorySummary, setMemorySummary] = useState(initial?.memorySummary ?? '');
  const [avatarColor, setAvatarColor] = useState(initial?.avatarColor ?? avatarColors[0]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Contact name is required.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 7) {
      setError('Please enter a valid phone number (at least 7 digits).');
      return;
    }

    setSaving(true);
    await onSave({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      memorySummary: memorySummary.trim() || 'Saved contact',
      avatarColor,
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white dark:bg-navy-900 rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-navy-900 dark:text-white text-lg">
            {initial ? 'Edit Contact Memory' : 'New Contact Memory'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center">
            <X size={16} className="text-navy-600 dark:text-navy-200" />
          </button>
        </div>

        {error && (
          <div className="mb-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 text-rose-600 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-medium text-navy-500 dark:text-navy-400 mb-1 block">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full h-11 px-3.5 rounded-xl bg-navy-50 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-700 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-400"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-navy-500 dark:text-navy-400 mb-1 block">Phone Number *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full h-11 px-3.5 rounded-xl bg-navy-50 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-700 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-400"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-navy-500 dark:text-navy-400 mb-1 block">Email (optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rahul@example.com"
              className="w-full h-11 px-3.5 rounded-xl bg-navy-50 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-700 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-400"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-navy-500 dark:text-navy-400 mb-1 block">Memory Summary / Context</label>
            <textarea
              value={memorySummary}
              onChange={(e) => setMemorySummary(e.target.value)}
              rows={3}
              placeholder="What do you want to remember? e.g. College project coordinator, prefers emails over calls..."
              className="w-full p-3 rounded-xl bg-navy-50 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-700 text-xs text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-400"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-navy-500 dark:text-navy-400 mb-1.5 block">Avatar Color</label>
            <div className="flex gap-2">
              {avatarColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setAvatarColor(color)}
                  className={`w-8 h-8 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center transition-transform ${
                    avatarColor === color ? 'scale-110 ring-2 ring-navy-400 ring-offset-2 dark:ring-offset-navy-900' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {avatarColor === color && <Check size={14} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full h-12 mt-2 rounded-2xl gradient-primary text-white font-semibold text-xs shadow-soft transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            {saving ? 'Saving...' : initial ? 'Save Changes' : 'Create Contact Memory'}
          </button>
        </form>
      </div>
    </div>
  );
}
