import { useState } from 'react';
import {
  Bell, Volume2, Sparkles, Shield, Database, Download, Trash2, Globe,
  Moon, Sun, ChevronRight, LogOut, Brain, Mic, Lock, HelpCircle, Star,
} from 'lucide-react';

interface SettingsItem {
  icon: typeof Bell;
  label: string;
  value?: string;
  toggle: boolean;
  state?: boolean;
  onChange?: () => void;
}

interface SettingsGroup {
  title: string;
  items: SettingsItem[];
}

export function ProfileScreen({ theme, onToggleTheme }: { theme: 'light' | 'dark'; onToggleTheme: () => void }) {
  const [notifications, setNotifications] = useState(true);
  const [voice, setVoice] = useState(true);

  const settingsGroups: SettingsGroup[] = [
    {
      title: 'AI & Voice',
      items: [
        { icon: Brain, label: 'AI Provider', value: 'OpenAI GPT-4', toggle: false },
        { icon: Mic, label: 'Voice Commands', toggle: true, state: voice, onChange: () => setVoice(!voice) },
        { icon: Volume2, label: 'Voice Output', value: 'Female · Natural', toggle: false },
        { icon: Sparkles, label: 'AI Suggestions', toggle: true, state: true, onChange: () => {} },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: theme === 'dark' ? Sun : Moon, label: 'Dark Mode', toggle: true, state: theme === 'dark', onChange: onToggleTheme },
        { icon: Globe, label: 'Language', value: 'English (US)', toggle: false },
        { icon: Bell, label: 'Notifications', toggle: true, state: notifications, onChange: () => setNotifications(!notifications) },
      ],
    },
    {
      title: 'Privacy & Data',
      items: [
        { icon: Shield, label: 'Privacy Settings', toggle: false },
        { icon: Lock, label: 'App Lock', value: 'Biometric', toggle: false },
        { icon: Download, label: 'Export Data', toggle: false },
        { icon: Database, label: 'Storage', value: '2.4 GB used', toggle: false },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & FAQ', toggle: false },
        { icon: Star, label: 'Rate RecallCall', toggle: false },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950 pb-32 animate-fade-in">
      {/* Header */}
      <div className="gradient-splash px-5 pt-14 pb-6 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute top-5 right-5 w-32 h-32 rounded-full bg-lavender-300/20 blur-2xl" />
        <h1 className="font-display text-2xl font-extrabold text-navy-900 dark:text-white mb-5 pl-14">Profile & Settings</h1>

        {/* Profile card */}
        <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-400 to-violet-400 flex items-center justify-center text-white text-xl font-bold shadow-float">
            JD
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-navy-900 dark:text-white text-lg">John Doe</h2>
            <p className="text-xs text-navy-400 dark:text-navy-300">john.doe@example.com</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[10px] font-medium text-lavender-600 dark:text-lavender-400 flex items-center gap-1">
                <Sparkles size={10} /> Pro Member
              </span>
              <span className="text-[10px] text-navy-400">{notes_count()} notes · {contacts_count()} contacts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings groups */}
      <div className="px-5 mt-5 space-y-5">
        {settingsGroups.map((group, gi) => (
          <div key={group.title} className="animate-slide-up" style={{ animationDelay: `${gi * 0.05}s` }}>
            <h3 className="font-display font-semibold text-navy-500 dark:text-navy-300 text-xs uppercase tracking-wider mb-2.5 px-1">{group.title}</h3>
            <div className="glass-card rounded-2xl overflow-hidden">
              {group.items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => item.onChange?.()}
                    className={`w-full flex items-center gap-3 p-3.5 transition-colors hover:bg-navy-50/50 dark:hover:bg-navy-800/30 ${i > 0 ? 'border-t border-navy-100/60 dark:border-navy-700/40' : ''}`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center shrink-0">
                      <Icon size={17} className="text-navy-600 dark:text-navy-200" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-navy-700 dark:text-navy-100 text-left">{item.label}</span>
                    {item.toggle && item.state !== undefined ? (
                      <div className={`w-11 h-6 rounded-full transition-colors ${item.state ? 'gradient-primary' : 'bg-navy-200 dark:bg-navy-700'} relative`}>
                        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${item.state ? 'left-[22px]' : 'left-0.5'}`} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        {item.value && <span className="text-xs text-navy-400 dark:text-navy-400">{item.value}</span>}
                        <ChevronRight size={16} className="text-navy-300 dark:text-navy-500" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Privacy message */}
        <div className="glass-card rounded-2xl p-4 flex items-start gap-3">
          <Shield size={18} className="text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-xs text-navy-500 dark:text-navy-300 leading-relaxed">
            Your data is end-to-end encrypted and stored locally. We never share your memories with third parties. You're in full control.
          </p>
        </div>

        {/* Danger zone */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <button className="w-full flex items-center gap-3 p-3.5 border-b border-navy-100/60 dark:border-navy-700/40 hover:bg-rose-50/50 dark:hover:bg-rose-900/10 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
              <Trash2 size={17} className="text-rose-500" />
            </div>
            <span className="flex-1 text-sm font-medium text-rose-600 dark:text-rose-400 text-left">Delete Account</span>
            <ChevronRight size={16} className="text-navy-300 dark:text-navy-500" />
          </button>
          <button className="w-full flex items-center gap-3 p-3.5 hover:bg-navy-50/50 dark:hover:bg-navy-800/30 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center">
              <LogOut size={17} className="text-navy-600 dark:text-navy-200" />
            </div>
            <span className="flex-1 text-sm font-medium text-navy-700 dark:text-navy-100 text-left">Sign Out</span>
            <ChevronRight size={16} className="text-navy-300 dark:text-navy-500" />
          </button>
        </div>

        <p className="text-center text-[10px] text-navy-300 dark:text-navy-500 pt-2">
          RecallCall v1.0.0 · Your memory, always within reach.
        </p>
      </div>
    </div>
  );
}

function notes_count() { return 8; }
function contacts_count() { return 6; }
