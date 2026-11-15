import { useState } from 'react';
import { Plus, Mic, Sparkles, Search, Pin, Archive, Trash2, Edit3, X, Tag, ChevronDown, Loader2, Users } from 'lucide-react';
import { categoryColors } from '../data';
import { CategoryTag, PinIndicator, EmptyState } from '../components/ui';
import { useNotes } from '../hooks/useNotes';
import { useContacts } from '../hooks/useContacts';
import type { Note, NoteCategory } from '../types';
import { queryLocalModel, loadAISettings } from '../services/ai';

const categories: (NoteCategory | 'All')[] = ['All', 'Personal', 'College', 'Work', 'Contacts', 'Important', 'Reminders'];

export function NotesScreen({ onOpenEditor }: { onOpenEditor: (note?: Note) => void }) {
  const { notes, loading, error } = useNotes();
  const [activeCategory, setActiveCategory] = useState<NoteCategory | 'All'>('All');
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const filtered = notes.filter((n) => {
    if (activeCategory !== 'All' && n.category !== activeCategory) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pinned = filtered.filter((n) => n.pinned);
  const others = filtered.filter((n) => !n.pinned);

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950 pb-32 animate-fade-in">
      {/* Header */}
      <div className="gradient-splash px-5 pt-14 pb-5 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-navy-900 dark:text-white pl-14">Smart Notes</h1>
            <p className="text-xs text-navy-400 dark:text-navy-200 mt-0.5">
              {loading ? 'Loading notes...' : `${notes.length} notes · ${pinned.length} pinned`}
            </p>
          </div>
          <button
            onClick={() => onOpenEditor()}
            className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center shadow-float transition-transform hover:scale-105 active:scale-95"
          >
            <Plus size={22} className="text-white" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 dark:text-navy-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white/80 dark:bg-navy-800/50 backdrop-blur border border-white/60 dark:border-navy-700 text-sm text-navy-900 dark:text-white placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-400 transition-all"
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="px-5 mt-4">
        <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'gradient-primary text-white shadow-soft'
                  : 'bg-white dark:bg-navy-800/50 text-navy-400 dark:text-navy-300 border border-navy-100 dark:border-navy-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Quick create actions */}
      <div className="px-5 mt-4 grid grid-cols-3 gap-3">
        {[
          { label: 'New Note', icon: Edit3, color: 'from-indigo-400 to-violet-400', action: () => onOpenEditor() },
          { label: 'Voice Note', icon: Mic, color: 'from-pink-400 to-rose-400', action: () => onOpenEditor({ id: '', title: 'Voice Note', content: '', category: 'Personal', tags: ['voice'], date: 'Today', pinned: false, color: 'from-pink-400 to-rose-400' }) },
          { label: 'AI Note', icon: Sparkles, color: 'from-emerald-400 to-teal-400', action: () => onOpenEditor({ id: '', title: 'Smart Summary Note', content: 'Key Takeaways:\n• \n\nNext Action Items:\n- [ ] ', category: 'Work', tags: ['ai-summary'], date: 'Today', pinned: false, color: 'from-emerald-400 to-teal-400' }) },
        ].map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.label}
              onClick={a.action}
              className="glass-card rounded-2xl py-3 px-2 flex flex-col items-center gap-2 transition-all hover:shadow-card active:scale-95"
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center`}>
                <Icon size={16} className="text-white" />
              </div>
              <span className="text-[10px] font-semibold text-navy-600 dark:text-navy-200 text-center">{a.label}</span>
            </button>
          );
        })}
      </div>

      {/* Notes list */}
      <div className="px-5 mt-5 space-y-5">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-lavender-400" />
          </div>
        )}

        {error && (
          <div className="glass-card rounded-2xl p-4 text-center">
            <p className="text-xs text-rose-500">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState icon={Search} title="No notes found" subtitle="Try a different search or category filter, or create a new note." />
        )}

        {!loading && pinned.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2.5 px-1">
              <Pin size={14} className="text-amber-500" />
              <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm">Pinned</h3>
            </div>
            <div className="space-y-2.5">
              {pinned.map((note) => <NoteCard key={note.id} note={note} onClick={() => onOpenEditor(note)} />)}
            </div>
          </div>
        )}

        {!loading && others.length > 0 && (
          <div>
            {pinned.length > 0 && <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm mb-2.5 px-1">All Notes</h3>}
            <div className="space-y-2.5">
              {others.map((note) => <NoteCard key={note.id} note={note} onClick={() => onOpenEditor(note)} />)}
            </div>
          </div>
        )}

        <button
          onClick={() => setShowArchived(!showArchived)}
          className="flex items-center justify-center gap-2 w-full py-3 text-xs font-medium text-navy-400 dark:text-navy-300 hover:text-navy-600 transition-colors"
        >
          <Archive size={14} />
          {showArchived ? 'Hide Archived' : 'Show Archived (0)'}
          <ChevronDown size={14} className={`transition-transform ${showArchived ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
}

function NoteCard({ note, onClick }: { note: Note; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full glass-card rounded-2xl p-4 text-left relative transition-all hover:shadow-card active:scale-[0.98]"
    >
      {note.pinned && <PinIndicator />}
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${categoryColors[note.category]}`} />
        <CategoryTag category={note.category} />
        <span className="text-[10px] text-navy-300 dark:text-navy-500 ml-auto">{note.date}</span>
      </div>
      <h4 className="font-display font-semibold text-navy-800 dark:text-navy-100 text-sm mb-1">{note.title}</h4>
      <p className="text-xs text-navy-400 dark:text-navy-400 line-clamp-2 leading-relaxed">{note.content}</p>
      {note.tags.length > 0 && (
        <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
          {note.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] text-navy-400 dark:text-navy-400 flex items-center gap-0.5">
              <Tag size={9} /> {tag}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

export function NoteEditorScreen({ note, onClose }: { note?: Note; onClose: () => void }) {
  const { createNote, updateNote, deleteNote } = useNotes();
  const { contacts } = useContacts();
  const [title, setTitle] = useState(note?.title ?? '');
  const [content, setContent] = useState(note?.content ?? '');
  const [category, setCategory] = useState<NoteCategory>(note?.category ?? 'Personal');
  const [tags, setTags] = useState<string[]>(note?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [contactId, setContactId] = useState<string | undefined>(note?.contactId);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [dictating, setDictating] = useState(false);

  const selectedContact = contacts.find((c) => c.id === contactId);

  const handleAIEnhance = async () => {
    if (!title && !content) {
      setTitle('Call Summary & Action Items');
      setContent('1. Key discussion points:\n- \n\n2. Next follow-ups:\n- \n\n3. Decisions reached:\n- ');
      return;
    }

    setAiGenerating(true);
    const settings = loadAISettings();
    const prompt = `Summarize and clean up these notes into clear action items and key takeaways: Title: "${title}", Content: "${content}"`;
    const res = await queryLocalModel(prompt, settings, {});
    setAiGenerating(false);

    if (res.text) {
      const cleaned = res.text.replace(/^\[Local Engine\]\s*/, '');
      setContent((prev) => `${prev}\n\n[Local AI Summary]:\n${cleaned}`);
    }
  };

  const handleVoiceDictation = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setContent((prev) => `${prev} [Voice dictation added via speech]`);
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.lang = 'en-US';
      rec.onstart = () => setDictating(true);
      rec.onresult = (e: any) => {
        const transcript = e.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setContent((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };
      rec.onend = () => setDictating(false);
      rec.onerror = () => setDictating(false);
      rec.start();
    } catch {
      setDictating(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      onClose();
      return;
    }
    setSaving(true);
    setError(null);

    const noteData = {
      title,
      content,
      category,
      tags,
      pinned: note?.pinned ?? false,
      color: note?.color,
      contactId,
    };

    if (note && note.id) {
      const { error: err } = await updateNote(note.id, noteData);
      if (err) setError(err);
    } else {
      const { error: err } = await createNote(noteData);
      if (err) setError(err);
    }

    setSaving(false);
    if (!error) onClose();
  };

  const handleDelete = async () => {
    if (!note) return;
    setSaving(true);
    const { error: err } = await deleteNote(note.id);
    setSaving(false);
    if (err) setError(err);
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-50 dark:bg-navy-950 flex flex-col animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-3 bg-white dark:bg-navy-900/50 border-b border-navy-100 dark:border-navy-800">
        <button onClick={onClose} className="w-9 h-9 rounded-xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center">
          <X size={18} className="text-navy-600 dark:text-navy-200" />
        </button>
        <h2 className="font-display font-bold text-navy-900 dark:text-white">{note ? 'Edit Note' : 'New Note'}</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 h-9 rounded-xl gradient-primary text-white text-sm font-semibold flex items-center gap-1.5 shadow-soft disabled:opacity-60"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : 'Save'}
        </button>
      </div>

      {error && (
        <div className="mx-5 mt-3 p-3 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800">
          <p className="text-xs text-rose-700 dark:text-rose-300">{error}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Category selector */}
        <div className="flex gap-2 overflow-x-auto -mx-5 px-5">
          {categories.filter(c => c !== 'All').map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                category === cat
                  ? 'gradient-primary text-white shadow-soft'
                  : 'bg-white dark:bg-navy-800/50 text-navy-400 dark:text-navy-300 border border-navy-100 dark:border-navy-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="w-full font-display text-xl font-bold text-navy-900 dark:text-white bg-transparent border-none focus:outline-none placeholder:text-navy-300"
        />

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing or use voice input..."
          rows={10}
          className="w-full text-sm text-navy-700 dark:text-navy-100 bg-transparent border-none focus:outline-none resize-none leading-relaxed placeholder:text-navy-300"
        />

        {/* Tags */}
        <div className="glass-card rounded-2xl p-3.5">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={14} className="text-navy-400" />
            <span className="text-xs font-semibold text-navy-600 dark:text-navy-200">Tags</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span key={tag} className="text-[11px] px-2.5 py-1 rounded-lg bg-lavender-100 text-lavender-700 dark:bg-lavender-900/30 dark:text-lavender-300 flex items-center gap-1">
                {tag}
                <button onClick={() => setTags(tags.filter(t => t !== tag))}>
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Add tag..."
            className="w-full text-xs bg-navy-50 dark:bg-navy-800/50 rounded-lg px-3 py-2 text-navy-700 dark:text-navy-100 placeholder:text-navy-300 focus:outline-none"
          />
        </div>

        {/* Contact association */}
        <div className="glass-card rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                {selectedContact ? selectedContact.initials : <Users size={16} />}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-navy-700 dark:text-navy-100 truncate">
                {selectedContact ? selectedContact.name : 'Associate contact'}
              </p>
              <p className="text-[10px] text-navy-400 truncate">
                {selectedContact ? selectedContact.phone : 'Link this note to a contact memory'}
              </p>
            </div>
            {selectedContact ? (
              <button
                type="button"
                onClick={() => setContactId(undefined)}
                className="text-xs font-medium text-rose-500 hover:underline"
              >
                Unlink
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowContactPicker(!showContactPicker)}
                className="text-xs font-medium text-navy-500 hover:text-navy-700 dark:text-lavender-400"
              >
                {showContactPicker ? 'Close' : 'Link'}
              </button>
            )}
          </div>

          {showContactPicker && !selectedContact && (
            <div className="pt-2 border-t border-navy-100 dark:border-navy-700 space-y-1">
              <span className="text-[10px] text-navy-400 block mb-1">Select a contact:</span>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                {contacts.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setContactId(c.id);
                      setShowContactPicker(false);
                      if (!tags.includes(c.name.toLowerCase().split(' ')[0])) {
                        setTags((prev) => [...prev, c.name.toLowerCase().split(' ')[0]]);
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-navy-50 dark:bg-navy-800 text-[11px] font-medium text-navy-700 dark:text-navy-200 border border-navy-100 dark:border-navy-700 hover:border-lavender-400"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom toolbar */}
      <div className="flex items-center justify-around px-5 py-4 bg-white dark:bg-navy-900/50 border-t border-navy-100 dark:border-navy-800">
        <button
          onClick={handleVoiceDictation}
          title="Dictate with voice"
          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-105 ${dictating ? 'bg-rose-500 text-white animate-pulse' : 'bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-200'}`}
        >
          <Mic size={18} />
        </button>
        <button
          onClick={handleAIEnhance}
          disabled={aiGenerating}
          title="Enhance with Local AI"
          className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-soft transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {aiGenerating ? <Loader2 size={18} className="text-white animate-spin" /> : <Sparkles size={18} className="text-white" />}
        </button>
        {note && (
          <button
            onClick={handleDelete}
            disabled={saving}
            className="w-11 h-11 rounded-xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center transition-transform hover:scale-105"
          >
            <Trash2 size={18} className="text-rose-500" />
          </button>
        )}
      </div>
    </div>
  );
}
