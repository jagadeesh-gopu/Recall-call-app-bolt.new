import { useState } from 'react';
import {
  Search, Mic, Sparkles, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock,
  Calendar, Plus, X, Phone, Trash2, StickyNote, Info
} from 'lucide-react';
import { Avatar, CallTypeIcon, CallTypeBadge, DurationDisplay, EmptyState, SkeletonCard } from '../components/ui';
import { useCalls } from '../hooks/useCalls';
import { useContacts } from '../hooks/useContacts';
import type { CallType, CallRecord } from '../types';

type FilterLabel = 'All' | 'Incoming' | 'Outgoing' | 'Missed';
const filters: FilterLabel[] = ['All', 'Incoming', 'Outgoing', 'Missed'];
const examples = ['Who called yesterday?', 'Find missed calls', 'Rahul'];

export function CallsScreen() {
  const { calls, loading, logCall, deleteCall } = useCalls();
  const { contacts } = useContacts();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterLabel>('All');
  const [searching, setSearching] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);

  const filtered = calls.filter((c) => {
    if (filter !== 'All' && c.type !== filter.toLowerCase()) return false;
    if (
      search &&
      !c.contactName.toLowerCase().includes(search.toLowerCase()) &&
      !c.phone.includes(search) &&
      !(c.notes && c.notes.toLowerCase().includes(search.toLowerCase()))
    ) {
      return false;
    }
    return true;
  });

  const handleSearch = () => {
    if (!search) return;
    setSearching(true);
    setTimeout(() => setSearching(false), 500);
  };

  const handleDeviceCall = (phone: string, contactName: string) => {
    logCall({
      contactName,
      phone,
      type: 'outgoing',
      duration: '01:30',
    });
    window.location.href = `tel:${phone.replace(/\s+/g, '')}`;
  };

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950 pb-32 animate-fade-in">
      {/* Header */}
      <div className="gradient-splash px-5 pt-14 pb-5 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-navy-900 dark:text-white pl-14">Call History</h1>
            <p className="text-xs text-navy-400 dark:text-navy-200">
              {loading ? 'Loading calls...' : `${calls.length} total call records logged`}
            </p>
          </div>
          <button
            onClick={() => setShowLogModal(true)}
            className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center shadow-float transition-transform hover:scale-105 active:scale-95"
            aria-label="Log call record"
          >
            <Plus size={22} className="text-white" />
          </button>
        </div>

        {/* AI search bar */}
        <div className="glass-card rounded-2xl p-1.5 flex items-center gap-2">
          <div className="relative flex-1">
            <Sparkles size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lavender-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by name, number, or notes..."
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-transparent text-sm text-navy-900 dark:text-white placeholder:text-navy-300 focus:outline-none"
            />
          </div>
          <button
            onClick={handleSearch}
            className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft transition-transform hover:scale-105 active:scale-95"
            aria-label="Search"
          >
            <Mic size={18} className="text-white" />
          </button>
        </div>

        {/* Example queries */}
        <div className="flex gap-2 mt-3 overflow-x-auto -mx-5 px-5">
          {examples.map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setSearch(ex);
                handleSearch();
              }}
              className="px-3 py-1.5 rounded-xl bg-white/60 dark:bg-navy-800/50 border border-white/60 dark:border-navy-700 text-[11px] font-medium text-navy-500 dark:text-navy-300 whitespace-nowrap transition-all hover:bg-white"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Notice on phone calling vs simulated logging */}
      <div className="px-5 mt-3">
        <div className="p-3 rounded-2xl bg-lavender-50/70 dark:bg-lavender-950/20 border border-lavender-200/60 dark:border-lavender-900/30 flex items-start gap-2.5">
          <Info size={15} className="text-lavender-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-navy-600 dark:text-navy-300 leading-snug">
            Tapping <strong>Call</strong> uses your device's native telephone dialer (<code className="text-[10px] bg-white dark:bg-navy-800 px-1 rounded">tel:</code>) and automatically logs the call timestamp.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="px-5 mt-4">
        <div className="flex gap-2 overflow-x-auto -mx-5 px-5">
          {filters.map((f) => {
            const count = f === 'All' ? calls.length : calls.filter((c) => c.type === f.toLowerCase()).length;
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
        {(loading || searching) && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!loading && !searching && filtered.length === 0 && (
          <EmptyState icon={Search} title="No calls found" subtitle="Try a different search query or filter." />
        )}

        {!loading && !searching && filtered.length > 0 && (
          <>
            <div className="flex items-center gap-2 px-1">
              <Calendar size={12} className="text-navy-400" />
              <span className="text-xs font-medium text-navy-400 dark:text-navy-300">
                {filtered.length} call records
              </span>
            </div>
            {filtered.map((call, i) => {
              const initials = call.contactName.split(' ').map((w) => w[0]).join('').slice(0, 2);
              return (
                <div
                  key={call.id}
                  className="glass-card rounded-2xl p-3.5 flex items-center gap-3 transition-all hover:shadow-card animate-slide-up"
                  style={{ animationDelay: `${i * 0.02}s` }}
                >
                  <Avatar initials={initials} color={call.avatarColor} size="sm" />
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => setSelectedCall(call)}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-navy-800 dark:text-navy-100 truncate">
                        {call.contactName}
                      </p>
                      <CallTypeBadge type={call.type} />
                    </div>
                    <p className="text-xs text-navy-400 dark:text-navy-400">{call.phone}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-navy-300 dark:text-navy-500">
                        {call.date} · {call.time}
                      </span>
                      <DurationDisplay duration={call.duration} />
                      {call.notes && (
                        <span className="text-[10px] text-lavender-500 flex items-center gap-0.5">
                          <StickyNote size={10} /> Note
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleDeviceCall(call.phone, call.contactName)}
                      title={`Call ${call.contactName}`}
                      className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                    >
                      <Phone size={14} />
                    </button>
                    <button
                      onClick={() => deleteCall(call.id)}
                      title="Delete record"
                      className="w-8 h-8 rounded-xl bg-navy-50 dark:bg-navy-800/50 text-navy-400 hover:text-rose-500 flex items-center justify-center transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Log Call Modal */}
      {showLogModal && (
        <LogCallModal
          contacts={contacts}
          onClose={() => setShowLogModal(false)}
          onSave={async (data) => {
            await logCall(data);
            setShowLogModal(false);
          }}
        />
      )}

      {/* Call Details Modal */}
      {selectedCall && (
        <div
          className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedCall(null)}
        >
          <div
            className="w-full max-w-sm glass-card bg-white dark:bg-navy-900 rounded-3xl p-6 space-y-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CallTypeIcon type={selectedCall.type} size={20} />
                <h3 className="font-display font-bold text-navy-900 dark:text-white text-base">
                  {selectedCall.contactName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCall(null)}
                className="w-8 h-8 rounded-xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-navy-100 dark:border-navy-800">
                <span className="text-navy-400">Phone Number:</span>
                <span className="font-semibold text-navy-800 dark:text-navy-100">{selectedCall.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-navy-100 dark:border-navy-800">
                <span className="text-navy-400">Call Type:</span>
                <CallTypeBadge type={selectedCall.type} />
              </div>
              <div className="flex justify-between py-1.5 border-b border-navy-100 dark:border-navy-800">
                <span className="text-navy-400">Timestamp:</span>
                <span className="font-semibold text-navy-800 dark:text-navy-100">{selectedCall.date} at {selectedCall.time}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-navy-100 dark:border-navy-800">
                <span className="text-navy-400">Duration:</span>
                <span className="font-semibold text-navy-800 dark:text-navy-100">{selectedCall.duration}</span>
              </div>
              {selectedCall.notes && (
                <div className="pt-2">
                  <span className="text-navy-400 block mb-1">Call Notes:</span>
                  <p className="p-3 rounded-xl bg-navy-50 dark:bg-navy-800 text-navy-700 dark:text-navy-200">
                    {selectedCall.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  handleDeviceCall(selectedCall.phone, selectedCall.contactName);
                  setSelectedCall(null);
                }}
                className="flex-1 h-11 rounded-xl gradient-primary text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-soft"
              >
                <Phone size={14} /> Call Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LogCallModal({
  contacts,
  onClose,
  onSave,
}: {
  contacts: any[];
  onClose: () => void;
  onSave: (data: { contactName: string; phone: string; type: CallType; duration: string; notes?: string }) => Promise<void>;
}) {
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<CallType>('incoming');
  const [duration, setDuration] = useState('02:30');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSelectContact = (c: any) => {
    setContactName(c.name);
    setPhone(c.phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !phone.trim()) return;
    setSaving(true);
    await onSave({
      contactName: contactName.trim(),
      phone: phone.trim(),
      type,
      duration: type === 'missed' ? '00:00' : duration,
      notes: notes.trim() || undefined,
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
          <h2 className="font-display font-bold text-navy-900 dark:text-white text-lg">Log Call Record</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        {/* Quick select from existing contacts */}
        {contacts.length > 0 && (
          <div className="mb-4">
            <span className="text-[11px] font-medium text-navy-400 block mb-1.5">Pick Contact</span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {contacts.slice(0, 6).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectContact(c)}
                  className="px-2.5 py-1 rounded-xl bg-navy-50 dark:bg-navy-800 border border-navy-100 dark:border-navy-700 text-xs text-navy-700 dark:text-navy-200 whitespace-nowrap hover:border-lavender-400"
                >
                  {c.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-medium text-navy-500 dark:text-navy-400 mb-1 block">Contact Name *</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full h-11 px-3.5 rounded-xl bg-navy-50 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-700 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-400"
              required
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
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-navy-500 dark:text-navy-400 mb-1.5 block">Call Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['incoming', 'outgoing', 'missed'] as CallType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2 rounded-xl text-xs font-semibold capitalize flex items-center justify-center gap-1.5 border transition-all ${
                    type === t
                      ? 'border-lavender-500 bg-lavender-50 dark:bg-lavender-900/30 text-navy-900 dark:text-white'
                      : 'border-navy-100 dark:border-navy-700 text-navy-400'
                  }`}
                >
                  <CallTypeIcon type={t} size={13} />
                  {t}
                </button>
              ))}
            </div>
          </div>

          {type !== 'missed' && (
            <div>
              <label className="text-xs font-medium text-navy-500 dark:text-navy-400 mb-1 block">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="12:45"
                className="w-full h-11 px-3.5 rounded-xl bg-navy-50 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-700 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-400"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-navy-500 dark:text-navy-400 mb-1 block">Call Notes / Summary</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="What was discussed? Action items or follow-ups..."
              className="w-full p-3 rounded-xl bg-navy-50 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-700 text-xs text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-400"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full h-12 mt-2 rounded-2xl gradient-primary text-white font-semibold text-xs shadow-soft transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            {saving ? 'Logging...' : 'Save Call Record'}
          </button>
        </form>
      </div>
    </div>
  );
}
