import { useState, useEffect, useRef } from 'react';
import { X, Mic, Send, Sparkles, Volume2, Settings2, Trash2, Cpu, StickyNote, Bell, User } from 'lucide-react';
import { Avatar, CallTypeBadge, DurationDisplay } from '../components/ui';
import type { CallRecord, Note, Reminder, Contact } from '../types';
import { useAI } from '../hooks/useAI';
import { AISettingsModal } from '../components/AISettingsModal';

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

const stateConfig: Record<VoiceState, { label: string; color: string; ringColor: string }> = {
  idle: { label: 'Tap to speak', color: 'from-navy-400 to-violet-400', ringColor: 'border-navy-300/30' },
  listening: { label: 'Listening...', color: 'from-rose-400 to-pink-400', ringColor: 'border-rose-400/50' },
  processing: { label: 'Local AI Thinking...', color: 'from-amber-400 to-orange-400', ringColor: 'border-amber-400/50' },
  speaking: { label: 'Speaking...', color: 'from-emerald-400 to-teal-400', ringColor: 'border-emerald-400/50' },
};

function Waveform({ active, color }: { active: boolean; color: string }) {
  const bars = [0.3, 0.6, 1, 0.7, 0.4, 0.8, 0.5, 0.9, 0.6, 0.3, 0.7, 1, 0.5, 0.4, 0.8, 0.6, 0.3, 0.7, 0.5, 0.9];
  return (
    <div className="flex items-center justify-center gap-[3px] h-8">
      {bars.map((h, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full bg-gradient-to-t ${color} transition-all`}
          style={{
            height: active ? `${h * 100}%` : '20%',
            animation: active ? `wave 1s ease-in-out infinite` : 'none',
            animationDelay: `${i * 0.05}s`,
            opacity: active ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
}

function AIOrb({ state }: { state: VoiceState }) {
  const cfg = stateConfig[state];
  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      {/* Outer rings */}
      <div className={`absolute inset-0 rounded-full border-2 ${cfg.ringColor} ${state !== 'idle' ? 'animate-ping' : ''} opacity-40`} />
      <div className={`absolute inset-3 rounded-full border-2 ${cfg.ringColor} ${state !== 'idle' ? 'animate-pulse-slow' : ''} opacity-30`} />
      <div className={`absolute inset-6 rounded-full border-2 ${cfg.ringColor} opacity-20`} />

      {/* Orbiting particles */}
      {state !== 'idle' && (
        <>
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full gradient-primary" />
          </div>
          <div className="absolute inset-0 animate-spin-reverse">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-lavender-400" />
          </div>
        </>
      )}

      {/* Core orb */}
      <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${cfg.color} shadow-glow-lg flex items-center justify-center ${state === 'idle' ? 'animate-pulse-slow' : ''}`}>
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-transparent opacity-60" />
        <Sparkles size={34} className="text-white relative" strokeWidth={1.5} />
      </div>
    </div>
  );
}

function CallResultCard({ result }: { result: CallRecord }) {
  const initials = result.contactName.split(' ').map((w) => w[0]).join('').slice(0, 2);
  return (
    <div className="glass-card rounded-2xl p-3 flex items-center gap-3 animate-slide-up">
      <Avatar initials={initials} color={result.avatarColor} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs font-semibold text-navy-800 dark:text-navy-100 truncate">{result.contactName}</p>
          <CallTypeBadge type={result.type} />
        </div>
        <p className="text-[11px] text-navy-400">{result.phone}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[10px] text-navy-300 dark:text-navy-500">{result.date} · {result.time}</span>
          <DurationDisplay duration={result.duration} />
        </div>
      </div>
    </div>
  );
}

function NoteResultCard({ note }: { note: Note }) {
  return (
    <div className="glass-card rounded-2xl p-3 animate-slide-up border-l-4 border-lavender-400">
      <div className="flex items-center gap-1.5 mb-1">
        <StickyNote size={12} className="text-lavender-400" />
        <p className="text-xs font-semibold text-navy-800 dark:text-navy-100 truncate">{note.title}</p>
        <span className="text-[10px] ml-auto text-navy-400 font-medium">{note.category}</span>
      </div>
      <p className="text-[11px] text-navy-500 dark:text-navy-300 line-clamp-2 leading-relaxed">{note.content}</p>
    </div>
  );
}

function ReminderResultCard({ reminder }: { reminder: Reminder }) {
  return (
    <div className="glass-card rounded-2xl p-3 animate-slide-up flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
        <Bell size={13} className="text-amber-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-navy-800 dark:text-navy-100 truncate">{reminder.title}</p>
        <p className="text-[10px] text-navy-400">{reminder.date} · {reminder.time}</p>
      </div>
    </div>
  );
}

const suggestedPrompts = [
  'Who called me yesterday?',
  'What are my reminders for today?',
  'Show notes on project',
  'Who is Priya Patel?',
];

export function AssistantScreen({ onClose }: { onClose: () => void }) {
  const {
    settings,
    updateSettings,
    messages,
    voiceState,
    sendMessage,
    startListening,
    stopListening,
    stopSpeaking,
    clearMessages,
  } = useAI();

  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, voiceState]);

  const handleSend = () => {
    if (!input.trim() || voiceState === 'processing') return;
    sendMessage(input);
    setInput('');
  };

  const handleMicToggle = () => {
    if (voiceState === 'idle') {
      startListening();
    } else {
      stopListening();
    }
  };

  const cfg = stateConfig[voiceState];

  const providerLabel =
    settings.provider === 'local-builtin'
      ? 'Built-in Local AI'
      : settings.provider === 'gemini'
      ? `Gemini (${settings.model})`
      : settings.provider === 'ollama'
      ? `Ollama (${settings.model})`
      : 'Custom Local LLM';

  return (
    <div className="fixed inset-0 z-50 bg-navy-50 dark:bg-navy-950 flex flex-col animate-slide-up">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-14 pb-3 gradient-splash">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-navy-600 dark:text-lavender-400" />
          <span className="font-display font-bold text-navy-900 dark:text-white">Local AI Assistant</span>
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/70 dark:bg-navy-800/80 border border-white/60 dark:border-navy-700 text-[10px] font-medium text-navy-600 dark:text-navy-200 ml-1 hover:bg-white"
          >
            <Cpu size={10} className="text-emerald-500" />
            <span className="truncate max-w-[110px]">{providerLabel}</span>
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowSettings(true)}
            title="AI Settings"
            className="w-9 h-9 rounded-xl glass-card flex items-center justify-center transition-transform hover:scale-105"
          >
            <Settings2 size={16} className="text-navy-600 dark:text-navy-200" />
          </button>
          <button
            onClick={clearMessages}
            title="Clear Chat"
            className="w-9 h-9 rounded-xl glass-card flex items-center justify-center transition-transform hover:scale-105"
          >
            <Trash2 size={16} className="text-navy-600 dark:text-navy-200" />
          </button>
          <button
            onClick={() => { stopSpeaking(); onClose(); }}
            className="w-9 h-9 rounded-xl glass-card flex items-center justify-center transition-transform hover:scale-105"
          >
            <X size={18} className="text-navy-600 dark:text-navy-200" />
          </button>
        </div>
      </div>

      {/* Orb area */}
      <div className="flex flex-col items-center gap-2 py-4 bg-gradient-to-b from-lavender-100/50 to-transparent dark:from-navy-900/50 shrink-0">
        <AIOrb state={voiceState} />
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            {voiceState === 'speaking' && <Volume2 size={14} className="text-emerald-500" />}
            <span className={`text-xs font-semibold ${voiceState === 'idle' ? 'text-navy-500 dark:text-navy-300' : `bg-gradient-to-r ${cfg.color} bg-clip-text text-transparent`}`}>
              {cfg.label}
            </span>
          </div>
          <div className="w-36">
            <Waveform active={voiceState === 'listening' || voiceState === 'speaking'} color={cfg.color} />
          </div>
        </div>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="flex gap-2 px-5 py-2 overflow-x-auto -mx-0 shrink-0">
        {suggestedPrompts.map((p) => (
          <button
            key={p}
            onClick={() => sendMessage(p)}
            className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-navy-800/80 border border-navy-100 dark:border-navy-700 text-[11px] font-medium text-navy-600 dark:text-navy-200 whitespace-nowrap shadow-xs hover:border-lavender-400 transition-all active:scale-95"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Conversation history */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-4 space-y-3.5">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? '' : 'w-full'}`}>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'gradient-primary text-white shadow-soft'
                    : 'glass-card text-navy-700 dark:text-navy-100'
                }`}
              >
                <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <p className={`text-[9px] mt-1.5 ${msg.role === 'user' ? 'text-white/60' : 'text-navy-300 dark:text-navy-500'}`}>
                  {msg.timestamp}
                </p>
              </div>

              {/* Structured cards returned by local AI */}
              {msg.results && msg.results.length > 0 && (
                <div className="mt-2 space-y-2">
                  {msg.results.map((r) => <CallResultCard key={r.id} result={r} />)}
                </div>
              )}
              {msg.notes && msg.notes.length > 0 && (
                <div className="mt-2 space-y-2">
                  {msg.notes.map((n) => <NoteResultCard key={n.id} note={n} />)}
                </div>
              )}
              {msg.reminders && msg.reminders.length > 0 && (
                <div className="mt-2 space-y-2">
                  {msg.reminders.map((rem) => <ReminderResultCard key={rem.id} reminder={rem} />)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="px-5 pb-7 pt-2.5 bg-white dark:bg-navy-900/60 border-t border-navy-100 dark:border-navy-800 shrink-0">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything... e.g. 'Who called yesterday?'"
              className="w-full h-11 pl-4 pr-11 rounded-2xl bg-navy-50 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-700 text-xs text-navy-900 dark:text-white placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-400 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={voiceState === 'processing'}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl gradient-primary flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Send size={13} className="text-white" />
            </button>
          </div>
        </div>
        <button
          onClick={handleMicToggle}
          className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 font-semibold text-xs text-white shadow-float transition-all active:scale-[0.98] bg-gradient-to-r"
          style={{ backgroundImage: `linear-gradient(135deg, ${voiceState === 'listening' ? '#f43f5e, #ec4899' : voiceState === 'processing' ? '#f59e0b, #f97316' : voiceState === 'speaking' ? '#10b981, #14b8a6' : '#656cf0, #9b73ff'})` }}
        >
          <Mic size={18} />
          {voiceState === 'idle' ? 'Tap to Speak' : cfg.label}
        </button>
      </div>

      {/* AI Settings Modal */}
      {showSettings && (
        <AISettingsModal
          settings={settings}
          onUpdate={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
