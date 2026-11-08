import { useState, useEffect, useRef } from 'react';
import { X, Mic, Send, Sparkles, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, Volume2 } from 'lucide-react';
import { Avatar, CallTypeIcon, CallTypeBadge, DurationDisplay } from '../components/ui';
import { chatHistory } from '../data';
import type { ChatMessage, CallRecord } from '../types';

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

const stateConfig: Record<VoiceState, { label: string; color: string; ringColor: string }> = {
  idle: { label: 'Tap to speak', color: 'from-navy-400 to-violet-400', ringColor: 'border-navy-300/30' },
  listening: { label: 'Listening...', color: 'from-rose-400 to-pink-400', ringColor: 'border-rose-400/50' },
  processing: { label: 'Thinking...', color: 'from-amber-400 to-orange-400', ringColor: 'border-amber-400/50' },
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
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Outer rings */}
      <div className={`absolute inset-0 rounded-full border-2 ${cfg.ringColor} ${state !== 'idle' ? 'animate-ping' : ''} opacity-40`} />
      <div className={`absolute inset-4 rounded-full border-2 ${cfg.ringColor} ${state !== 'idle' ? 'animate-pulse-slow' : ''} opacity-30`} />
      <div className={`absolute inset-8 rounded-full border-2 ${cfg.ringColor} opacity-20`} />

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
      <div className={`relative w-28 h-28 rounded-full bg-gradient-to-br ${cfg.color} shadow-glow-lg flex items-center justify-center ${state === 'idle' ? 'animate-pulse-slow' : ''}`}>
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-transparent opacity-60" />
        <Sparkles size={40} className="text-white relative" strokeWidth={1.5} />
      </div>
    </div>
  );
}

function ResultCard({ result }: { result: CallRecord }) {
  const initials = result.contactName.split(' ').map((w) => w[0]).join('').slice(0, 2);
  return (
    <div className="glass-card rounded-2xl p-3.5 flex items-center gap-3 animate-slide-up">
      <Avatar initials={initials} color={result.avatarColor} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold text-navy-800 dark:text-navy-100 truncate">{result.contactName}</p>
          <CallTypeBadge type={result.type} />
        </div>
        <p className="text-xs text-navy-400 dark:text-navy-400">{result.phone}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[10px] text-navy-300 dark:text-navy-500">{result.date} · {result.time}</span>
          <DurationDisplay duration={result.duration} />
        </div>
      </div>
    </div>
  );
}

export function AssistantScreen({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<VoiceState>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>(chatHistory);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleMic = () => {
    if (state === 'idle') {
      setState('listening');
      setTimeout(() => setState('processing'), 2000);
      setTimeout(() => {
        setState('speaking');
        setMessages((prev) => [
          ...prev,
          { id: `m${prev.length + 1}`, role: 'user', text: 'Find missed calls last Friday.', timestamp: 'Now' },
          {
            id: `m${prev.length + 2}`,
            role: 'assistant',
            text: 'I found 2 missed calls from last Friday.',
            results: [
              { id: 'nr1', contactName: 'Arjun Reddy', phone: '+91 90909 80808', type: 'missed', date: 'Friday', time: '2:15 PM', duration: '00:00', avatarColor: 'from-cyan-400 to-blue-400' },
              { id: 'nr2', contactName: 'Unknown Number', phone: '+91 90000 12345', type: 'missed', date: 'Friday', time: '5:40 PM', duration: '00:00', avatarColor: 'from-gray-400 to-slate-400' },
            ],
            timestamp: 'Now',
          },
        ]);
        setTimeout(() => setState('idle'), 3000);
      }, 3500);
    } else {
      setState('idle');
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: `m${prev.length + 1}`, role: 'user', text: input, timestamp: 'Now' }]);
    setInput('');
    setState('processing');
    setTimeout(() => {
      setState('speaking');
      setMessages((prev) => [
        ...prev,
        { id: `m${prev.length + 1}`, role: 'assistant', text: 'I found 3 calls matching your request.', results: [
          { id: 'ar1', contactName: 'Rahul Sharma', phone: '+91 98765 43210', type: 'incoming', date: 'Today', time: '6:30 PM', duration: '12:45', avatarColor: 'from-indigo-400 to-violet-400' },
          { id: 'ar2', contactName: 'Priya Patel', phone: '+91 98123 45678', type: 'outgoing', date: 'Today', time: '3:15 PM', duration: '05:20', avatarColor: 'from-pink-400 to-rose-400' },
          { id: 'ar3', contactName: 'Dr. Mehta', phone: '+91 99887 76655', type: 'incoming', date: 'Yesterday', time: '8:45 PM', duration: '18:30', avatarColor: 'from-emerald-400 to-teal-400' },
        ], timestamp: 'Now' },
      ]);
      setTimeout(() => setState('idle'), 2000);
    }, 2000);
  };

  const cfg = stateConfig[state];

  return (
    <div className="fixed inset-0 z-50 bg-navy-50 dark:bg-navy-950 flex flex-col animate-slide-up">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-14 pb-3 gradient-splash">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-navy-600 dark:text-lavender-400" />
          <span className="font-display font-bold text-navy-900 dark:text-white">AI Assistant</span>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl glass-card flex items-center justify-center transition-transform hover:scale-105"
        >
          <X size={18} className="text-navy-600 dark:text-navy-200" />
        </button>
      </div>

      {/* Orb area */}
      <div className="flex flex-col items-center gap-3 py-6 bg-gradient-to-b from-lavender-100/50 to-transparent dark:from-navy-900/50">
        <AIOrb state={state} />
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            {state === 'speaking' && <Volume2 size={14} className="text-emerald-500" />}
            <span className={`text-sm font-semibold ${state === 'idle' ? 'text-navy-500 dark:text-navy-300' : `bg-gradient-to-r ${cfg.color} bg-clip-text text-transparent`}`}>
              {cfg.label}
            </span>
          </div>
          <div className="w-40">
            <Waveform active={state === 'listening' || state === 'speaking'} color={cfg.color} />
          </div>
        </div>
      </div>

      {/* Conversation history */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
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
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-white/60' : 'text-navy-300 dark:text-navy-500'}`}>
                  {msg.timestamp}
                </p>
              </div>
              {msg.results && (
                <div className="mt-2 space-y-2">
                  {msg.results.map((r) => <ResultCard key={r.id} result={r} />)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="px-5 pb-8 pt-3 bg-white dark:bg-navy-900/50 border-t border-navy-100 dark:border-navy-800">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything... e.g., 'Who called yesterday?'"
              className="w-full h-12 pl-4 pr-12 rounded-2xl bg-navy-50 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-700 text-sm text-navy-900 dark:text-white placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-400 transition-all"
            />
            <button
              onClick={handleSend}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl gradient-primary flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
            >
              <Send size={15} className="text-white" />
            </button>
          </div>
        </div>
        <button
          onClick={handleMic}
          className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 font-semibold text-sm text-white shadow-float transition-all active:scale-[0.98] bg-gradient-to-r"
          style={{ backgroundImage: `linear-gradient(135deg, ${state === 'listening' ? '#f43f5e, #ec4899' : state === 'processing' ? '#f59e0b, #f97316' : state === 'speaking' ? '#10b981, #14b8a6' : '#656cf0, #9b73ff'})` }}
        >
          <Mic size={20} />
          {state === 'idle' ? 'Tap to speak' : cfg.label}
        </button>
      </div>
    </div>
  );
}
